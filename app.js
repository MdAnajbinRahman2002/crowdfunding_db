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
app.use(express.json());  // Enable JSON parsing middleware

// Generic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// API to get fundraisers, optionally filtered by ID or query parameters
app.get('/fundraisers/:id?', (req, res) => {
  let sql = `
    SELECT f.*, c.NAME as category_name
    FROM FUNDRAISER f
    JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
    WHERE f.ACTIVE = true
  `;

  const params = [];
  if (req.params.id) {
    sql += ' AND f.FUNDRAISER_ID = ?';
    params.push(req.params.id);
  } else {
    const { organizer, city, category } = req.query;
    if (organizer) {
      sql += ' AND f.ORGANIZER LIKE ?';
      params.push(`%${organizer}%`);
    }
    if (city) {
      sql += ' AND f.CITY LIKE ?';
      params.push(`%${city}%`);
    }
    if (category) {
      sql += ' AND c.NAME LIKE ?';
      params.push(`%${category}%`);
    }
  }

  connection.query(sql, params, (error, results) => {
    if (error) {
      return res.status(500).send(error.message);
    }
    res.json(req.params.id ? results[0] || null : results);
  });
});

// API to get all categories
app.get('/categories', (req, res) => {
  const sql = 'SELECT * FROM CATEGORY';
  connection.query(sql, (error, results) => {
    if (error) {
      return res.status(500).send(error.message);
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
