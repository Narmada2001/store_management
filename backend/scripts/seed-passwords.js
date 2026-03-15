/**
 * Run this ONCE to fix the seeded admin & staff passwords to Admin@123 / Staff@123
 * Usage: node backend/scripts/seed-passwords.js
 */
require('dotenv').config({ path: './.env' });
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function run() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'store_management',
    });

    const adminHash = await bcrypt.hash('Admin@123', 10);
    const staffHash = await bcrypt.hash('Staff@123', 10);

    await db.execute('UPDATE users SET password_hash = ? WHERE email = ?', [adminHash, 'admin@store.gov']);
    await db.execute('UPDATE users SET password_hash = ? WHERE email = ?', [staffHash, 'staff@store.gov']);

    console.log('✅ Passwords updated!');
    console.log('   admin@store.gov  → Admin@123');
    console.log('   staff@store.gov  → Staff@123');
    await db.end();
}

run().catch(console.error);
