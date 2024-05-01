const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

require('dotenv').config();
console.log(process.env.DB_HOST);

const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    optionsSuccessStatus: 200
  };
  
  app.use(cors(corsOptions));
  
app.use(bodyParser.json());

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

// Create a connection to the database
const db = mysql.createConnection(dbConfig);

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database successfully!');
});


// Fetch the top players
app.get('/api/top-players', (req, res) => {
    const sqlQuery = 'SELECT * FROM players ORDER BY goals DESC LIMIT 10';
    db.query(sqlQuery, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
})


app.get('/api/search-players', (req, res) => {
    const searchTerm = req.query.name.toLowerCase();
    const sqlQuery = 'SELECT * FROM players WHERE LOWER(name) LIKE ?';
    db.query(sqlQuery, [`%${searchTerm}%`], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Endpoint to get all teams or search by team name
app.get('/api/teams', (req, res) => {
    let sqlQuery = 'SELECT * FROM teams';
    const searchTerm = req.query.name;

    if (searchTerm) {
        sqlQuery += ' WHERE LOWER(name) LIKE ?';
        db.query(sqlQuery, [`%${searchTerm.toLowerCase()}%`], (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    } else {
        db.query(sqlQuery, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    }
});

app.get('/api/player-details/:playerId', (req, res) => {
    const playerId = req.params.playerId;
    const sqlQuery = 'SELECT * FROM players WHERE player_id = ?';

    db.query(sqlQuery, [playerId], (err, results) => {
        if (err) {
            console.error('Error fetching player details:', err);
            res.status(500).send('Error fetching player details');
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Player not found');
        }
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
