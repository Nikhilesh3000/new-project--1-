

// require('dotenv').config();
// const mysql = require('mysql');

// const db = mysql.createConnection({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASS || '',
//   database: process.env.DB_NAME || 'crm_db'
// });

// db.connect((err) => {
//   if (err) {
//     console.error('❌ Database Connection Failed:', err.message);
//   } else {
//     console.log('✅ MySQL Connected...');
//   }
// });

// module.exports = db;
// db.js (ES Module version)
import dotenv from 'dotenv';
import mysql from 'mysql';

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'Root@12345',
  database: process.env.DB_NAME || 'crm_db',
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database Connection Failed:', err.message);
  } else {
    console.log('✅ MySQL Connected...');
  }
});

export default db;

