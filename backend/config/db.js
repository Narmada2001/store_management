require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'store_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: false,
});

const db = pool.promise();

// Test connection on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed!');
        console.error('   CODE:', err.code);
        console.error('   MESSAGE:', err.message);
        console.error('   HOST:', process.env.DB_HOST);
        console.error('   PORT:', process.env.DB_PORT);
        return;
    }
    console.log('✅ MySQL connected successfully to', process.env.DB_NAME);
    connection.release();
});

module.exports = db;
