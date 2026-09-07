// Diagnostic script to test MySQL Server & Workbench connection
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('🔍 Testing MySQL Connection with the following settings:');
    console.log(`   Host:     ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port:     ${process.env.DB_PORT || 3306}`);
    console.log(`   User:     ${process.env.DB_USER || 'root'}`);
    console.log(`   Database: ${process.env.DB_NAME || 'travelgo_db'}\n`);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306', 10),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('✅ Connected to MySQL Server successfully!');

        const [dbResult] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_NAME || 'travelgo_db'}';`);
        if (dbResult.length > 0) {
            console.log(`✅ Database '${process.env.DB_NAME || 'travelgo_db'}' exists.`);
            await connection.changeUser({ database: process.env.DB_NAME || 'travelgo_db' });
            const [tables] = await connection.query('SHOW TABLES;');
            console.log('📋 Tables found:', tables.map(t => Object.values(t)[0]));
        } else {
            console.log(`ℹ️ Database '${process.env.DB_NAME || 'travelgo_db'}' does not exist yet.`);
            console.log(`👉 Run 'database.sql' in MySQL Workbench or start the server to create it automatically!`);
        }

        await connection.end();
        console.log('\n🎉 MySQL connection test passed!');
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        console.error('\n👉 Tips:');
        console.error('   - Ensure MySQL80 service is running in Windows Services.');
        console.error('   - Update DB_PASSWORD in your .env file to match your MySQL root password.');
        console.error('   - Or run database.sql directly in MySQL Workbench.');
    }
}

testConnection();
