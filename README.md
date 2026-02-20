# Kodbank

Full-stack web application: React + Vite (frontend), Node.js + Express (backend), MySQL (Aiven) with JWT auth and httpOnly cookies.

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, canvas-confetti
- **Backend:** Node.js, Express
- **Database:** MySQL (Aiven cloud, SSL)
- **Auth:** JWT + httpOnly cookies, bcrypt

## Setup

### 1. Database

Create the tables in your Aiven MySQL database (`defaultdb`). Run the SQL in `database/schema.sql`:

```sql
-- In Aiven MySQL console or any MySQL client connected to your instance:
CREATE TABLE KodUser (
  uid INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(100),
  password VARCHAR(255),
  phone VARCHAR(20),
  balance INT DEFAULT 100000,
  role VARCHAR(20)
);

CREATE TABLE UserToken (
  tid INT AUTO_INCREMENT PRIMARY KEY,
  token TEXT,
  uid INT,
  expiry DATETIME,
  FOREIGN KEY (uid) REFERENCES KodUser(uid)
);
```

### 2. Backend

```bash
cd backend
npm install
```

Ensure `.env` exists with your Aiven and JWT settings (see `backend/.env`). Then:

```bash
npm run dev
```

Backend runs at **http://localhost:5000**.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**. It proxies `/api` to the backend.

## How to Run

1. **Start backend:** `cd backend && npm run dev`
2. **Start frontend:** `cd frontend && npm run dev`
3. Open **http://localhost:5173** → Register → Login → Dashboard → "Check Balance"

## API Endpoints

| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| POST   | /api/register      | Register (username, password, email, phone) |
| POST   | /api/login         | Login (username, password), sets httpOnly cookie |
| GET    | /api/balance       | Get balance (requires auth cookie) |

## Project Structure

```
Kodbank/
├ backend/
│  ├ config/db.js
│  ├ controllers/authController.js, balanceController.js
│  ├ middleware/authMiddleware.js
│  ├ routes/authRoutes.js, balanceRoutes.js
│  ├ server.js
│  ├ .env
│  └ .gitignore
├ frontend/
│  ├ src/
│  │  ├ api/axios.js
│  │  ├ pages/Register.jsx, Login.jsx, Dashboard.jsx
│  │  ├ App.jsx, main.jsx, index.css
│  ├ index.html
│  ├ vite.config.js
│  └ package.json
├ database/schema.sql
└ README.md
```

## Notes

- JWT is stored in an httpOnly cookie and in the `UserToken` table; frontend uses Axios with `withCredentials: true`.
- New users get default `balance = 100000` and `role = 'customer'`.
- Dashboard shows balance and triggers a confetti animation when balance is loaded.

### Aiven SSL

If the backend fails to connect to Aiven MySQL with an SSL error, download the **CA certificate** from your Aiven service (Overview → Connection information), save it as `backend/ca.pem`, and in `backend/.env` add:

```
SSL_CA_PATH=ca.pem
```

Then restart the backend.
