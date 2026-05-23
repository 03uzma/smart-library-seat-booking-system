const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3001;;

const formatDate = (date) =>
  date.toISOString().slice(0, 19).replace('T', ' ');
app.get('/api/seats', (req, res) => {
  db.all(`
    SELECT 
      s.id, 
      s.seat_number, 
      s.zone,
      CASE 
        WHEN b.status IS NULL OR b.status = 'released' THEN 'available'
        ELSE b.status
      END AS status,
      b.id AS booking_id
    FROM seats s
    LEFT JOIN bookings b 
      ON s.id = b.seat_id
      AND b.status IN ('booked','occupied')
      AND datetime(b.end_time) > datetime('now')
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
//book seats
app.post('/api/book', (req, res) => {
  const { seat_id, student_name, duration_minutes = 60 } = req.body;

  const start = new Date();
  const end = new Date(start.getTime() + duration_minutes * 60000);

  db.get(`
    SELECT id FROM bookings
    WHERE seat_id = ?
    AND status IN ('booked','occupied')
    AND datetime(start_time) < ?
    AND datetime(end_time) > ?
  `, [seat_id, formatDate(end), formatDate(start)], (err, conflict) => {

    if (err) return res.status(500).json({ error: err.message });

    if (conflict) {
      return res.status(409).json({ error: "Seat already booked" });
    }

    db.run(`
      INSERT INTO bookings (seat_id, student_name, start_time, end_time, status)
      VALUES (?, ?, ?, ?, 'booked')
    `, [seat_id, student_name, formatDate(start), formatDate(end)], function(err){

      if (err) return res.status(500).json({ error: err.message });

      res.json({ success: true, booking_id: this.lastID });
    });
  });
});

//check-in
app.post('/api/checkin', (req, res) => {
  const { booking_id } = req.body;

  db.run(`
    UPDATE bookings 
    SET status = 'occupied'
    WHERE id = ? AND status = 'booked'
  `, [booking_id], function(err) {

    if (err) return res.status(500).json({ error: err.message });

    res.json({ success: true });
  });
});

// checkout

app.post('/api/checkout', (req, res) => {
  const { booking_id } = req.body;

  db.run(`
    UPDATE bookings 
    SET status = 'released', end_time = ?
    WHERE id = ? AND status = 'occupied'
  `, [formatDate(new Date()), booking_id], function(err) {

    if (err) return res.status(500).json({ error: err.message });

    res.json({ success: true });
  });
});

// auto-release(15 seconds)

function autoRelease() {

  // Not checked-in within 15 sec
  db.run(`
    UPDATE bookings
    SET status = 'released'
    WHERE status = 'booked'
    AND (strftime('%s','now') - strftime('%s', start_time)) >= 15
  `);

  
  db.run(`
    UPDATE bookings
    SET status = 'released'
    WHERE status = 'occupied'
    AND strftime('%s','now') >= strftime('%s', end_time)
  `);
}

// Run every 5 sec
setInterval(autoRelease, 5000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});