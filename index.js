const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
require('dotenv').config();

const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

const session = require('express-session');
app.use(session({
  secret: 'iot-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Middleware untuk mengecek login
function isAuthenticated(req, res, next) {
  if (req.session.loggedIn) return next();
  res.redirect('/login.html');
}

app.use(express.urlencoded({ extended: true }));

// Redirect root ke login.html
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Login POST
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Ganti sesuai kebutuhan
  if (username === 'admin' && password === '1234') {
    req.session.loggedIn = true;
    res.redirect('/dashboard.html');
  } else {
    res.send('<script>alert("Login gagal!"); window.location.href="/login.html";</script>');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

//grafik setelah login
app.get('/dashboard.html', isAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});

app.get('/grafik.html', isAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/public/grafik.html');
});

app.get('/tabel.html', isAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/public/tabel.html');
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint POST dari ESP32
app.post('/api/data', (req, res) => {
  const { temperature, humidity } = req.body;

  if (temperature == null || humidity == null) {
    return res.status(400).json({ message: '❌ Data tidak lengkap' });
  }

  const query = 'INSERT INTO sensor_data (temperature, humidity) VALUES (?, ?)';
  db.query(query, [temperature, humidity], (err, result) => {
    if (err) {
      console.error('❌ Gagal menyimpan data:', err.message);
      return res.status(500).json({ message: '❌ Error pada database' });
    }

    res.status(201).json({
      message: '✅ Data berhasil disimpan',
      id: result.insertId
    });
  });
});

app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 20', (err, results) => {
    if (err) {
      return res.status(500).json({ message: '❌ Error mengambil data' });
    }
    res.status(200).json(results);
  });
});
  
// Halaman grafik
app.get('/grafik', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'grafik.html'));
});
  
// Halaman tabel
app.get('/tabel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tabel.html'));
});
  
// Halaman dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
    
// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
