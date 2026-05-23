const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./library.db', (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to SQLite database");
});

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS seats (
      id INTEGER PRIMARY KEY,
      seat_number TEXT UNIQUE,
      zone TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seat_id INTEGER,
      student_name TEXT,
      start_time TEXT,
      end_time TEXT,
      status TEXT
    )
  `);

  // Insert seats only once
  db.get(`SELECT COUNT(*) as count FROM seats`, (err, row) => {
    if (row.count === 0) {
      console.log("⚡ Seeding seats...");

      const zones = [
        { name: 'Silent', count: 60, prefix: 'S' },
        { name: 'Group Study', count: 50, prefix: 'G' },
        { name: 'Computer Lab', count: 40, prefix: 'C' },
        { name: 'Reading', count: 50, prefix: 'R' }
      ];

      let id = 1;
      zones.forEach(zone => {
        for (let i = 1; i <= zone.count; i++) {
          const num = `${zone.prefix}${i.toString().padStart(3, '0')}`;
          db.run(
            `INSERT INTO seats (id, seat_number, zone) VALUES (?, ?, ?)`,
            [id++, num, zone.name]
          );
        }
      });
    }
  });

});

module.exports = db;