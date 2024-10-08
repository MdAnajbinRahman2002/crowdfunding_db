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

    // SQL statements to drop, create, and insert data into tables
    const sqlCommands = `
        -- Disable foreign key checks
        SET FOREIGN_KEY_CHECKS = 0;

        -- Drop existing tables
        DROP TABLE IF EXISTS DONATION;
        DROP TABLE IF EXISTS FUNDRAISER;
        DROP TABLE IF EXISTS CATEGORY;

        -- Enable foreign key checks again
        SET FOREIGN_KEY_CHECKS = 1;

        -- Create CATEGORY table
        CREATE TABLE CATEGORY (
            CATEGORY_ID INT PRIMARY KEY,
            NAME VARCHAR(100) NOT NULL
        );

        -- Create FUNDRAISER table with foreign key reference to CATEGORY
        CREATE TABLE FUNDRAISER (
            FUNDRAISER_ID INT PRIMARY KEY,
            ORGANIZER VARCHAR(100) NOT NULL,
            CAPTION VARCHAR(255),
            TARGET_FUNDING DECIMAL(10, 2),
            CURRENT_FUNDING DECIMAL(10, 2) DEFAULT 0,
            CITY VARCHAR(100),
            ACTIVE BOOLEAN,
            CATEGORY_ID INT,
            FOREIGN KEY (CATEGORY_ID) REFERENCES CATEGORY(CATEGORY_ID)
        );

        -- Create DONATION table with foreign key reference to FUNDRAISER
        CREATE TABLE DONATION (
            DONATION_ID INT PRIMARY KEY AUTO_INCREMENT,
            DATE DATE NOT NULL,
            AMOUNT DECIMAL(10, 2) NOT NULL,
            GIVER VARCHAR(100) NOT NULL,
            FUNDRAISER_ID INT,
            FOREIGN KEY (FUNDRAISER_ID) REFERENCES FUNDRAISER(FUNDRAISER_ID) ON DELETE CASCADE
        );

        -- Insert data into CATEGORY table
        INSERT INTO CATEGORY (CATEGORY_ID, NAME) VALUES
        (1, 'Education'), (2, 'Health'), (3, 'Environment');

        -- Insert data into FUNDRAISER table
        INSERT INTO FUNDRAISER (FUNDRAISER_ID, ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID) VALUES
        (1, 'RIHAN', 'School Supplies for Kids', 5000.00, 1500.00, 'New York', TRUE, 1),
        (2, 'Jane Smith', 'Medical Aid for Seniors', 10000.00, 7000.00, 'Los Angeles', TRUE, 2),
        (3, 'Green Earth', 'Tree Planting Campaign', 3000.00, 1200.00, 'San Francisco', TRUE, 3),
        (4, 'Helping Hands', 'Community Health Clinic', 8000.00, 4000.00, 'Chicago', FALSE, 2),
        (5, 'Bright Future', 'Scholarships for Students', 20000.00, 15000.00, 'Boston', TRUE, 1),
        (6, 'aaaaaaa', 'aaaaaa', 2222222.00, 0.00, 'eeeeeeee', TRUE, 3),
        (7, 'Patel', 'Medical Aid for surgery', 5000.00, 2300.00, 'Melbourne', TRUE, 1),
        (8, 'Ahmed', 'Scholarship for disadvantaged students', 12000.00, 6000.00, 'Sydney', TRUE, 2),
        (9, 'fdgdgff', 'regdfdgf', 10000.00, 4000.00, 'asfdsadf', TRUE, 3);

        -- Insert data into DONATION table
        INSERT INTO DONATION (DONATION_ID, DATE, AMOUNT, GIVER, FUNDRAISER_ID) VALUES
        (1, '2024-10-03', 500.00, 'Rihan', 2),
        (2, '2024-10-05', 1000.00, 'Dhruv', 2),
        (3, '2024-09-03', 1500.00, 'Patel', 3),
        (4, '2024-09-22', 3640.00, 'Rahman', 5),
        (5, '2024-10-03', 8787.00, 'Jack', 2),
        (6, '2024-10-06', 5000.00, 'PP', 2),
        (7, '2024-10-06', 234324.00, 'Dhruv', 1),
        (8, '2024-10-06', 100000.00, 'sedefsdfsdf', 1),
        (9, '2024-10-06', 500.00, 'Dhruv', 1),
        (10, '2024-10-06', 22222.00, 'ddfdsfsd', 1),
        (11, '2024-10-06', 34234.00, 'sadcs', 1),
        (12, '2024-10-06', 32434.00, 'wefefwe', 1),
        (13, '2024-10-06', 353453.00, 'sfsdfdsf', 1);
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
