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
    console.error('Gagal koneksi ke database:', err.message);
  } else {
    console.log('Terhubung ke database MySQL');
  }
});

module.exports = db;
