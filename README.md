# ✈️ TravelGo - Explore the World (Full-Stack Edition)

A full-stack travel booking web application featuring a modern responsive user interface, **Node.js/Express** backend, and **MySQL** database integration designed for **MySQL Workbench**.

---

## 🌟 Features

- **Responsive Frontend**: Built with HTML5, CSS3, Bootstrap 5, and JavaScript.
- **RESTful Backend**: Node.js and Express API server handling booking submissions, destination catalogs, and queries.
- **MySQL Database**: Complete relational database schema with `travelgo_db.bookings` and `destinations`.
- **MySQL Workbench Ready**: Includes pre-formatted `database.sql` script ready to run with one click.
- **Live Booking Inspector**: Interactive modal on the website displaying bookings synced live with MySQL.
- **Graceful Fallback**: Server runs reliably even before database configuration, seamlessly switching to MySQL once credentials are provided.

---

## 📁 Project Structure

```
TRAVELGO_UPDATED/
├── database.sql           # MySQL Workbench database script (tables + seed data)
├── db.js                  # MySQL connection pool & database manager
├── server.js              # Express REST API server & static file host
├── test-db.js             # MySQL connectivity test script
├── .env                   # Environment config (Port & Database password)
├── .env.example           # Example configuration template
├── package.json           # Node.js dependencies and scripts
├── .gitignore             # Git ignored files (node_modules, .env)
├── .vscode/               # VS Code launch & debug settings
│   ├── launch.json
│   └── settings.json
└── public/                # Frontend web application
    ├── index.html         # Main website page & booking form
    ├── style.css          # Custom styling & responsive layouts
    └── script.js          # Interactive UI and backend API client
```

---

## 🚀 Quick Start Guide

### 1. Open in VS Code
Open your terminal and run:
```bash
code .
```
Or open VS Code, click **File > Open Folder...**, and select `TRAVELGO_UPDATED`.

---

### 2. Set Up the Database in MySQL Workbench
1. Open **MySQL Workbench** and connect to your local MySQL instance.
2. Click **File > Open SQL Script...** (or press `Ctrl + Shift + O`).
3. Select `database.sql` from this project folder.
4. Click the **Execute** lightning bolt icon (`⚡`) or press `Ctrl + Shift + Enter`.
5. The `travelgo_db` database, `bookings` table, and `destinations` table will be created!

---

### 3. Configure Database Password
Open the `.env` file in the project folder and set your MySQL password:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=travelgo_db
```

---

### 4. Install Dependencies & Start the Server

In VS Code terminal (or PowerShell):
```bash
# Install packages (express, mysql2, dotenv, cors)
npm install

# Start the application
npm start
```

For auto-reloading during development:
```bash
npm run dev
```

To test your MySQL connection:
```bash
npm run test-db
```

---

### 5. Open the Web Application
Open your web browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

- Explore destinations and packages.
- Fill in the **Plan Your Trip** booking form and click **Submit Booking ✈️**.
- Click **📋 View Bookings** in the navigation bar to see your booking stored live in the database!
- Check your records inside **MySQL Workbench** by running:
  ```sql
  SELECT * FROM travelgo_db.bookings ORDER BY created_at DESC;
  ```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check API and database connection status |
| `POST` | `/api/bookings` | Submit and record a new travel booking |
| `GET` | `/api/bookings` | Retrieve all recorded bookings |
| `DELETE` | `/api/bookings/:id` | Cancel/delete a booking record |
| `GET` | `/api/destinations` | Retrieve popular destination list |

---

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3.3
- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0, MySQL Workbench
- **Database Driver**: `mysql2/promise`
- **Version Control**: Git & GitHub
- **Editor**: Visual Studio Code
