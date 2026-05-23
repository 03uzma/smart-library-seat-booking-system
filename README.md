# 📚 Smart Library Seat Booking System

A web-based library seat reservation system that allows students to view available seats, book seats, check in, and check out efficiently. The system automatically manages seat availability and prevents booking conflicts, improving seat utilization and reducing manual effort.

---

## 🚀 Features

- View real-time seat availability
- Book library seats for a specified duration
- Check in to confirm seat occupancy
- Check out to release seats early
- Prevents double booking of the same seat
- Automatic seat release if a user does not check in
- Automatic seat release when booking duration expires
- Dynamic seat status updates
- Color-coded seat visualization for better user experience

---





---

## ⚙️ Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/03uzma/smart-library-seat-booking-system.git
cd smart-library-seat-booking-system
```

### Install Dependencies

```bash
npm install
```

### Start the Server

```bash
npm start
```

Server will run at:

```text
http://localhost:3001
```

---

## 📌 API Endpoints

### Get All Seats

```http
GET /api/seats
```

Returns the current status of all seats.

---

### Book a Seat

```http
POST /api/book
```

Request Body:

```json
{
  "seat_id": 1,
  "student_name": "Uzma",
  "duration_minutes": 60
}
```

---

### Check In

```http
POST /api/checkin
```

Request Body:

```json
{
  "booking_id": 1
}
```

---

### Check Out

```http
POST /api/checkout
```

Request Body:

```json
{
  "booking_id": 1
}
```

---

## 🔄 Seat Status Workflow

### Available
Seat is free and can be booked.

### Booked
Seat has been reserved but the user has not checked in yet.

### Occupied
User has checked in and is actively using the seat.

### Released
Booking has ended or the user checked out, making the seat available again.

---

## 🤖 Auto Release Mechanism

The system automatically:

- Releases bookings if the user fails to check in within the allowed time.
- Releases occupied seats when the booking duration expires.
- Runs periodic checks using a background timer.

This ensures optimal utilization of library seating resources.

---

## 🎨 User Interface

Seat statuses are represented using color indicators:

| Color | Status |
|---------|---------|
| 🟢 Green | Available |
| 🔴 Red | Booked (Not Checked-In) |
| 🟡 Yellow | Occupied (Checked-In) |

The interface refreshes seat information periodically to display the latest availability.

---

## 🔒 Booking Conflict Prevention

Before creating a booking, the system checks for overlapping reservations using SQL-based validation to ensure:

- No two users can reserve the same seat simultaneously.
- Existing active bookings are respected.
- Data consistency is maintained.

---

## 📈 Future Enhancements

- User authentication and login
- Student ID verification
- Booking history dashboard
- Email notifications and reminders
- Admin panel for seat management
- Real-time updates using WebSockets
- Cloud database integration (PostgreSQL/MySQL)

---

---

## 📄 License

This project is developed for educational and academic purposes.
