const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'travelgo_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool = null;
let isConnected = false;

// In-memory fallback in case MySQL password is not configured yet
const memoryStorage = {
    bookings: [
        {
            id: 1,
            name: "Aarav Sharma",
            email: "aarav.sharma@example.com",
            destination: "Bali",
            message: "Looking for a relaxing 4-day trip for 2 guests.",
            status: "Confirmed",
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            name: "Sophia Davis",
            email: "sophia.davis@example.com",
            destination: "Paris",
            message: "Honeymoon vacation package inquiry.",
            status: "Confirmed",
            created_at: new Date().toISOString()
        }
    ],
    nextId: 3
};

async function initDatabase() {
    try {
        // Step 1: Connect to server without specific database to ensure DB exists
        const rootConn = await mysql.createConnection({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password
        });

        await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
        await rootConn.end();

        // Step 2: Create Connection Pool for the database
        pool = mysql.createPool(dbConfig);

        // Step 3: Ensure tables exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(120) NOT NULL,
                destination VARCHAR(100) NOT NULL,
                message TEXT,
                status VARCHAR(50) DEFAULT 'Confirmed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS destinations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                country VARCHAR(100) NOT NULL,
                description TEXT,
                price_starting DECIMAL(10, 2),
                image_url VARCHAR(500),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        isConnected = true;
        console.log(`✅ [MySQL] Successfully connected to '${dbConfig.database}' on port ${dbConfig.port}!`);
        return true;
    } catch (err) {
        isConnected = false;
        console.warn(`\n⚠️  [MySQL Notice]: Could not connect to MySQL (${err.message})`);
        console.warn(`👉 To connect live with MySQL Server & Workbench:`);
        console.warn(`   1. Open MySQL Workbench and run 'database.sql'`);
        console.warn(`   2. Set your MySQL password in the '.env' file: DB_PASSWORD=your_password\n`);
        return false;
    }
}

async function addBooking(bookingData) {
    const { name, email, destination, message } = bookingData;

    if (isConnected && pool) {
        try {
            const [result] = await pool.query(
                `INSERT INTO bookings (name, email, destination, message) VALUES (?, ?, ?, ?)`,
                [name, email, destination, message || null]
            );
            return {
                id: result.insertId,
                name,
                email,
                destination,
                message,
                status: 'Confirmed',
                created_at: new Date().toISOString(),
                source: 'mysql'
            };
        } catch (err) {
            console.error('MySQL Insert Error, falling back to memory:', err.message);
        }
    }

    // Fallback
    const newBooking = {
        id: memoryStorage.nextId++,
        name,
        email,
        destination,
        message: message || '',
        status: 'Confirmed',
        created_at: new Date().toISOString(),
        source: 'memory'
    };
    memoryStorage.bookings.unshift(newBooking);
    return newBooking;
}

async function getBookings() {
    if (isConnected && pool) {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM bookings ORDER BY created_at DESC`
            );
            return rows;
        } catch (err) {
            console.error('MySQL Fetch Error, falling back to memory:', err.message);
        }
    }

    return memoryStorage.bookings;
}

async function deleteBooking(id) {
    if (isConnected && pool) {
        try {
            const [result] = await pool.query(`DELETE FROM bookings WHERE id = ?`, [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error('MySQL Delete Error:', err.message);
        }
    }

    const index = memoryStorage.bookings.findIndex(b => b.id === parseInt(id, 10));
    if (index !== -1) {
        memoryStorage.bookings.splice(index, 1);
        return true;
    }
    return false;
}

function getConnectionStatus() {
    return {
        isConnected,
        database: dbConfig.database,
        host: dbConfig.host,
        user: dbConfig.user
    };
}

module.exports = {
    initDatabase,
    addBooking,
    getBookings,
    deleteBooking,
    getConnectionStatus
};
