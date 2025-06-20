const mysql = require('mysql2');
require('dotenv').config();

// Gunakan pool agar koneksi bisa dikelola otomatis dan scalable
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,     // Maksimal 10 koneksi aktif
  queueLimit: 0            // Antrian tidak dibatasi
});

// Tes koneksi (optional)
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Gagal koneksi ke database:', err.message);
  } else {
    console.log('✅ Terhubung ke database MySQL Railway (via pool)!');
    connection.release(); // penting: lepas koneksi kembali ke pool
  }
});

// Export pool untuk dipakai di file lain
module.exports = pool;
