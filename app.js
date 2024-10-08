const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

// Configure MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rihan123#', // Update this if necessary
    database: 'crowdfunding_db',
    multipleStatements: true
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        return console.error('Error connecting to MySQL: ' + err.message);
    }
    console.log('Connected to MySQL.');
});

// Middleware
app.use(cors());
app.use(express.json());

// Root route to check if API is running
app.get('/', (req, res) => {
    res.send('Crowdfunding API is running');
});

// Get all fundraisers
app.get('/fundraisers', (req, res) => {
    const query = 'SELECT * FROM FUNDRAISER';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Get donations for a fundraiser by ID
app.get('/fundraiser/:id/donations', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM DONATION WHERE FUNDRAISER_ID = ? ORDER BY DATE DESC';
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});
// Add a new donation
app.post('/donations', (req, res) => {
    const { date, amount, giver, fundraiserId } = req.body;

    if (!date || !amount || !giver || !fundraiserId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'INSERT INTO DONATION (DATE, AMOUNT, GIVER, FUNDRAISER_ID) VALUES (?, ?, ?, ?)';
    connection.query(query, [date, amount, giver, fundraiserId], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Donation added successfully', id: results.insertId });
    });
});

// Add a new fundraiser
app.post('/fundraisers', (req, res) => {
    const { fundraiserId, organizer, caption, target_funding, city, categoryId } = req.body;

    if (!fundraiserId || !organizer || !caption || !target_funding || !city || !categoryId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'INSERT INTO FUNDRAISER (FUNDRAISER_ID, ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID) VALUES (?, ?, ?, ?, 0, ?, TRUE, ?)';
    connection.query(query, [fundraiserId, organizer, caption, target_funding, city, categoryId], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Fundraiser added successfully', id: results.insertId });
    });
});

// **New: Get a specific fundraiser by ID**
app.get('/fundraiser/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT FUNDRAISER.*, CATEGORY.NAME as category_name FROM FUNDRAISER 
                   JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID 
                   WHERE FUNDRAISER.FUNDRAISER_ID = ?`;
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Fundraiser not found' });
        }
        res.json(results[0]);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
