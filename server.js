const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

function renderPage(res, page) {
    res.sendFile(path.join(__dirname, 'public', page));
}

app.get('/', (req, res) => renderPage(res, 'index.html'));
app.get('/about', (req, res) => renderPage(res, 'about.html'));
app.get('/product', (req, res) => renderPage(res, 'product.html'));
app.get('/contact', (req, res) => renderPage(res, 'contact.html'));
app.get('/register', (req, res) => renderPage(res, 'register.html'));

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});