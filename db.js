const mysql = require('mysql2');
//const { Connection } = require('mysql2/typings/mysql/lib/Connection');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});


db.connect((err) => {
  if (err) {
    console.error('❌ Gagal koneksi ke database:', err.message);
  } else {
    console.log('✅ Terhubung ke database MySQL railway!');
  }
});

module.exports = db;

// const mysql = require('mysql2');
// require('dotenv').config();

// // Membuat koneksi pool ke database MySQL
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
//   waitForConnections: true,   // Tunggu jika tidak ada koneksi yang tersedia
//   connectionLimit: 10,        // Maksimum koneksi yang boleh dibuka dalam pool
//   queueLimit: 0               // Tidak ada batasan antrian koneksi
// });

// // Test koneksi ke database
// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error('❌ Gagal koneksi ke database:', err.message);
//     return;
//   }
//   console.log('✅ Terhubung ke database MySQL railway!');
//   connection.release();  // Pastikan untuk melepaskan koneksi setelah selesai
// });

// module.exports = pool;
