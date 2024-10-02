const mysql = require('mysql');

// Configure MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rihan123#', 
    database: 'crowdfunding_db',
    multipleStatements: true 
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        return console.error('Error connecting to the database:', err);
    }
    console.log('Connected to the MySQL server.');

    // SQL statements to execute
    const sqlCommands = `
        DROP TABLE IF EXISTS FUNDRAISER;
        DROP TABLE IF EXISTS CATEGORY;

        CREATE TABLE CATEGORY (
            CATEGORY_ID INT PRIMARY KEY,
            NAME VARCHAR(100) NOT NULL
        );

        CREATE TABLE FUNDRAISER (
            FUNDRAISER_ID INT PRIMARY KEY,
            ORGANIZER VARCHAR(100) NOT NULL,
            CAPTION VARCHAR(255),
            TARGET_FUNDING DECIMAL(10, 2),
            CURRENT_FUNDING DECIMAL(10, 2),
            CITY VARCHAR(100),
            ACTIVE BOOLEAN,
            CATEGORY_ID INT,
            FOREIGN KEY (CATEGORY_ID) REFERENCES CATEGORY(CATEGORY_ID)
        );

        INSERT INTO CATEGORY (CATEGORY_ID, NAME) VALUES
        (1, 'Education'), (2, 'Health'), (3, 'Environment');

        INSERT INTO FUNDRAISER (FUNDRAISER_ID, ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID) VALUES
        (1, 'RIHAN', 'School Supplies for Kids', 5000.00, 1500.00, 'New York', TRUE, 1),
        (2, 'Jane Smith', 'Medical Aid for Seniors', 10000.00, 7000.00, 'Los Angeles', TRUE, 2),
        (3, 'Green Earth', 'Tree Planting Campaign', 3000.00, 1200.00, 'San Francisco', TRUE, 3),
        (4, 'Helping Hands', 'Community Health Clinic', 8000.00, 4000.00, 'Chicago', FALSE, 2),
        (5, 'Bright Future', 'Scholarships for Students', 20000.00, 15000.00, 'Boston', TRUE, 1);
    `;

    // Execute SQL commands
    connection.query(sqlCommands, (err, results) => {
        if (err) {
            console.error('Error executing SQL:', err);
        } else {
            console.log('Tables created and data inserted successfully.');
        }

        // Close the connection
        connection.end(err => {
            if (err) {
                console.error('Error closing the connection:', err);
            } else {
                console.log('Database connection closed.');
            }
        });
    });
});
