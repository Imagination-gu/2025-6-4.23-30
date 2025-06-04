
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3000;

// データベース接続
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '35113560',
  database: 'imagination'
});

// 静的ファイル公開（script.jsなどを提供）
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// ルーティング
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.get('/mypage.html', (req, res) => res.sendFile(path.join(__dirname, 'mypage.html')));

// 登録処理
app.post('/register', async (req, res) => {
  const { name, student_id, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, student_id, password) VALUES (?, ?, ?)', [name, student_id, hashed]);
    res.redirect('/login.html');
  } catch (err) {
    console.error(err);
    res.status(500).send('Registration error');
  }
});

// ログイン処理
app.post('/login', async (req, res) => {
  const { student_id, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE student_id = ?', [student_id]);
    if (rows.length === 0) return res.status(401).send('User not found');

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send('Invalid credentials');

    req.session.userId = user.id;
    req.session.name = user.name;
    res.redirect('/mypage.html');
  } catch (err) {
    console.error(err);
    res.status(500).send('Login error');
  }
});

// セッション取得
app.get('/session', (req, res) => {
  res.json({ name: req.session.name || null });
});

// ログアウト処理
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// サーバー起動
app.listen(port, () => {
  console.log(`✅ サーバー起動: http://localhost:${port}`);
});