// server/server.js
require('dotenv').config();
const errorHandler = require('./middleware/errorHandler');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Połączenie z bazą danych
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.locals.db = pool.promise();

// Test połączenia z bazą
(async () => {
    try {
        const connection = await app.locals.db.getConnection();
        console.log('Połączono z bazą MySQL!');
        connection.release();
    } catch (err) {
        console.error('Błąd połączenia z bazą:', err.message);
    }
})();

// Testowa trasa
app.get('/api/test', (req, res) => {
    res.json({ message: 'Serwer działa!' });
});

// Import route'ów
const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');

// Użycie route'ów
app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`🚀Serwer uruchomiony na http://localhost:${PORT}`);
});