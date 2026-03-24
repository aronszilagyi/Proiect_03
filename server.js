require('dotenv').config();

const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'Welcome.1997',
    database: process.env.MYSQL_DATABASE || 'simple_site',
    connectionLimit: 10
});

function renderPage(res, page) {
    res.sendFile(path.join(__dirname, 'public', page));
}

app.get('/', (req, res) => renderPage(res, 'index.html'));
app.get('/about', (req, res) => renderPage(res, 'about.html'));
app.get('/product', (req, res) => renderPage(res, 'product.html'));
app.get('/contact', (req, res) => renderPage(res, 'contact.html'));
app.get('/register', (req, res) => renderPage(res, 'register.html'));
app.get('/register-success', (req, res) => renderPage(res, 'register-success.html'));

app.post('/register', async (req, res) => {
    const { username, email, password, age } = req.body;

    if (!username || !email || !password || !age) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const connection = await pool.getConnection();
        const query = 'INSERT INTO users (username, email, password, age) VALUES (?, ?, ?, ?)';
        await connection.query(query, [username, email, hashedPassword, age]);
        connection.release();
        res.redirect('/register-success');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});