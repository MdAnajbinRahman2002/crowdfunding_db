const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Set up MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rihan123#',
    database: 'crowdfunding_db'
});

connection.connect(err => {
    if (err) {
        return console.error('Error connecting to MySQL: ' + err.message);
    }
    console.log('Connected to MySQL.');
});

const app = express();
const port = 3000;

app.use(cors());

// API to get all active fundraisers (for index.html)
app.get('/fundraisers', (req, res) => {
    const sql = `
        SELECT f.*, c.NAME as category_name
        FROM FUNDRAISER f
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE f.ACTIVE = true
    `;

    connection.query(sql, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// API to get a single fundraiser by ID (for fundraiser.html)
app.get('/fundraiser/:id', (req, res) => {
    const sql = `
        SELECT f.*, c.NAME as category_name
        FROM FUNDRAISER f
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE f.FUNDRAISER_ID = ?
    `;

    connection.query(sql, [req.params.id], (error, result) => {
        if (error) throw error;
        res.json(result[0] || null);
    });
});

// API to search fundraisers based on organizer, city, or category (for search.html)
app.get('/fundraisers/search', (req, res) => {
    const { organizer, city, category } = req.query;
    let sql = `
        SELECT f.*, c.NAME as category_name
        FROM FUNDRAISER f
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE f.ACTIVE = true
    `;

    const conditions = [];
    if (organizer) conditions.push(`f.ORGANIZER LIKE '%${organizer}%'`);
    if (city) conditions.push(`f.CITY LIKE '%${city}%'`);
    if (category) conditions.push(`c.NAME LIKE '%${category}%'`);

    if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ');
    }

    connection.query(sql, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// API to get all categories (for category dropdown in search.html)
app.get('/categories', (req, res) => {
    const sql = 'SELECT * FROM CATEGORY';
    connection.query(sql, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
