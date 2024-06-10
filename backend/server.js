// inlude libraries
const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user'); 
const auth = require('./routes/auth');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};


app.use(bodyParser.json());
app.use('/api/protected', authenticateJWT);
app.get('/api/protected', (req, res) => {
  	res.json({message : 'protected data accessed',
  user : req.user});
});




// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to the MySQL database');
});

const authenticate = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };
  
  // authorize 
  const authorize = (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };

  app.get('/admin/dashboard', authenticate, authorize, (req, res) => {
    // logic needs to be implemneted here for router logic
  });

  // app.post('/register', async (req, res) => {
  //   try {
  //     const { username, email, password } = req.body;
  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     const newUser = new User({ username, email, password: hashedPassword });
  //     await newUser.save();
  //     res.status(201).json({ message: 'User registered successfully' });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });
  
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      // Finding username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      // Validate password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      // user authenticated
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


// defining routes for creating a New player
app.post('/player', (req, res) => {
    const { name, position } = req.body; // Remove goals and assists
    const sql = 'INSERT INTO player (name, position) VALUES (?, ?)'; // Remove goals and assists
    db.query(sql, [name, position], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(201).send('Player created successfully');
      }
    });
  });
  
// fetch all players
app.get('/player', (req, res) => {
    const sql = 'SELECT p.name,p.position,p.goals,p.assists,p.yellow_cards,p.red_cards,p.matches_played,p.shirt_no, t.name FROM player p inner join team t on t.team_id = p.team_id';
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(result);
      }
    });
  });

  // fetch all players
app.get('/players', (req, res) => {
  const sql = `SELECT p.name, p.position, p.goals, p.assists, p.yellow_cards, p.red_cards, p.matches_played, p.shirt_no, t.name as team_name 
  FROM player p 
  INNER JOIN team t ON t.team_id = p.team_id`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
});



// fetch players specificllay by id
app.get('/player/:id', (req, res) => {
    const playerId = req.params.id;
    const sql = 'SELECT * FROM player WHERE id = ?';
    db.query(sql, playerId, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else if (result.length === 0) {
        res.status(404).send('Player not found');
      } else {
        res.json(result[0]);
      }
    });
  });

  app.get('/players/:id', (req, res) => {
    const playerId = req.params.id;
    const sql = 'SELECT * FROM players WHERE id = ?';
    db.query(sql, playerId, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else if (result.length === 0) {
        res.status(404).send('Player not found');
      } else {
        res.json(result[0]);
      }
    });
  });

  // select player by name
  app.get('/search-player/:name', (req, res) => {
    const playerId = req.params.name.toLowerCase();
    const sql = `SELECT p.name, p.position, p.goals, p.assists, p.yellow_cards, p.red_cards, p.matches_played, p.shirt_no, t.name as team_name 
                 FROM player p 
                 INNER JOIN team t ON t.team_id = p.team_id 
                 WHERE LOWER(p.name) LIKE ?`;
    db.query(sql, [`%${playerId}%`], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else if (result.length === 0) {
            res.json([]);
        } else {
            res.json(result);
        }
    });
});

app.get('/search-players/:name', (req, res) => {
  const playerId = req.params.name.toLowerCase();
  const sql = ` SELECT 
    p.player_id,p.name,p.image_url,p.dob,p.height,p.position,p.rating,p.potential,p.value,p.wage,p.preferred_foot,p.weak_foot,p.skill_moves,p.international_ranking,p.club_id,p.club_name,
    p.club_league_name,p.club_logo,p.club_rating,p.country,p.team_id,p.country,p.club_rating,p.country_position,p.goals,p.yellow_cards,p.red_cards,p.dribbling,
    p.long_pass,p.agility, p.standing, p.matches_played, t.name as team_name  FROM 
    players p INNER JOIN team t ON p.team_id = t.team_id Where p.name LIKE ?;`;

  db.query(sql, [`%${playerId}%`], (err, result) => {
      if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
      } else if (result.length === 0) {
          res.json([]);
      } else {
          res.json(result);
      }
  });
});



// fetching top players
  app.get('/top-player', (req, res) => {
    //const sqlQuery = 'SELECT p.name,p.position,p.goals,p.assists,p.yellow_cards,p.red_cards,p.matches_played,p.shirt_no,p.image_url, t.name as team_name FROM player p inner join team t on t.team_id = p.team_id ORDER BY goals DESC LIMIT 10';
    const sqlQuery = `Select p.name,p.position,p.image_url,p.team_id,p.rating as goals,p.skill_moves as assists, 
                       p.yellow_cards,p.red_cards,p.standing,t.name as team_name from players p inner join team t on p.team_id = t.team_id order by goals desc limit 10`;
    db.query(sqlQuery, (err, result) => {
        if (err){
          console.log(err);
        }else{
        res.json(result);
        }
    });
})
// for second table
app.get('/top-players', (req, res) => {
    const sqlQuery = `SELECT 
      p.player_id, p.name, p.image_url, p.dob, p.height, p.position, p.rating, p.potential, p.value, p.wage, p.preferred_foot, p.weak_foot, p.skill_moves, p.international_ranking, p.club_id, p.club_name,
      p.club_league_name, p.club_logo, p.club_rating, p.country, p.team_id, p.country, p.club_rating, p.position, p.goals, p.yellow_cards, p.red_cards, p.dribbling,
      p.long_pass, p.agility, p.standing, p.matches_played, t.name as team_name FROM players p INNER JOIN team t ON p.team_id = t.team_id ORDER BY p.goals DESC LIMIT 10;`;

  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(result);
    }
  });
});


  
// updatiung players Details by id
app.put('/players/:id', (req, res) => {
    const playerId = req.params.id;
    const { name, position, goals, assists } = req.body;
    const sql = 'UPDATE player SET name = ?, position = ?, goals = ?, assists = ? WHERE id = ?';
    db.query(sql, [name, position, goals, assists, playerId], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else if (result.affectedRows === 0) {
        res.status(404).send('Player not found');
      } else {
        res.status(200).send('Player details updated successfully');
      }
    });
  });
  
// Deletinga player
app.delete('/players/:id', (req, res) => {
    const playerId = req.params.id;
    const sql = 'DELETE FROM player WHERE id = ?';
    db.query(sql, playerId, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else if (result.affectedRows === 0) {
        res.status(404).send('Player not found');
      } else {
        res.status(200).send('Player deleted successfully');
      }
    });
  });

// specific player details
app.get('/player-details/:playerId', (req, res) => {
  const playerId = req.params.playerId; 
  const sqlQuery = 'SELECT * FROM player WHERE player_id = ?';

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
// for players(more data table)
app.get('/players-details/:playerId', (req, res) => {
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




// display all teams
  app.get('/teams', (req, res) => {
    let sqlQuery = 'SELECT * FROM team';
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

app.get('/top-teams', (req, res) => {
  const sqlQuery = 'SELECT * FROM team ORDER BY points desc Limit 10';
  db.query(sqlQuery, (err, result) => {
      if (err){
        console.log(err);
      }else{
      res.json(result);
      }
  });
})

app.get('/search-team/name', (req, res) => {
    const searchTerm = req.query.name;
    sqlQuery = ' SELECT * FROM teams WHERE LOWER(name) LIKE ?';
    db.query(sqlQuery, [`%${searchTerm.toLowerCase()}%`], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/league-matches-details', (req, res) => {
  const leagueName = req.query.name;
  let leagueID = 1;

  if (leagueName === 'FIFA-22') {
    leagueID = 1;
  } else if (leagueName === 'FIFA-18') {
    leagueID = 2;
  }
  const sqlQuery = `
    SELECT 
      m.match_id, m.date, m.homeGoals, m.awayGoals, m.attendance, m.referee, 
      home_team.name AS homeTeamName, away_team.name AS awayTeamName 
    FROM match_data AS m 
    JOIN team AS home_team ON m.homeTeam_id = home_team.team_id 
    JOIN team AS away_team ON m.awayTeam_id = away_team.team_id 
    WHERE m.league_id = ? 
    ORDER BY m.match_id, m.date
  `;

  db.query(sqlQuery, [leagueID], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.length === 0) {
      res.json([]);
    } else {
      res.json(result);
    }
  });
});

app.get('/all-matches-details', (req, res) => {
  const sql = `SELECT m.match_id, m.date, m.homeGoals, m.awayGoals, m.attendance, m.referee, home_team.name AS homeTeamName, away_team.name AS awayTeamName 
               FROM match_data AS m 
               JOIN team AS home_team ON m.homeTeam_id = home_team.team_id 
               JOIN team AS away_team ON m.awayTeam_id = away_team.team_id 
               ORDER BY m.match_id, m.date`;

  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error executing MySQL query:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      } else if (result.length === 0) {
          res.json([]);
      } else {
          res.json(result);
      }
  });
});


app.get('/user-data', (req, res) => {
  const userId = req.query.userId; // Assuming userId is passed as a query parameter

  const sql = `SELECT u.id, u.name, u.email, u.username, u.picture, 
                      u.goals, u.assists, u.position 
               FROM users AS u 
               WHERE u.id = ?`;

  db.query(sql, [userId], (err, result) => {
      if (err) {
          console.error('Error executing MySQL query:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      } else if (result.length === 0) {
          res.status(404).json({ error: 'User not found' });
      } else {
          res.json(result[0]);
      }
  });
});

// Player Statistics Details ------------------->

app.get('/top-players-by-goals', (req, res) => {
  const sqlQuery = `SELECT 
    p.player_id, p.name, p.image_url, p.dob, p.height, p.position, p.rating, p.potential, p.value, p.wage, p.preferred_foot, p.weak_foot, p.skill_moves, p.international_ranking, p.club_id, p.club_name,
    p.club_league_name, p.club_logo, p.club_rating, p.country, p.team_id, p.country, p.club_rating, p.position, p.goals, p.yellow_cards, p.red_cards, p.dribbling,
    p.long_pass, p.agility, p.standing, p.matches_played, t.name as team_name FROM players p INNER JOIN team t ON p.team_id = t.team_id ORDER BY p.goals DESC LIMIT 10;`;

db.query(sqlQuery, (err, result) => {
  if (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.json(result);
  }
});
});

app.get('/top-players-by-value', (req, res) => {
  const sqlQuery = `SELECT 
    p.player_id, p.name, p.image_url, p.dob, p.height, p.position, p.rating, p.potential, p.value, p.wage, p.preferred_foot, p.weak_foot, p.skill_moves, p.international_ranking, p.club_id, p.club_name,
    p.club_league_name, p.club_logo, p.club_rating, p.country, p.team_id, p.country, p.club_rating, p.position, p.goals, p.yellow_cards, p.red_cards, p.dribbling,
    p.long_pass, p.agility, p.standing, p.matches_played, t.name as team_name FROM players p INNER JOIN team t ON p.team_id = t.team_id ORDER BY p.value DESC LIMIT 10;`;

db.query(sqlQuery, (err, result) => {
  if (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.json(result);
  }
});
});

app.get('/top-players-by-skills', (req, res) => {
  const sqlQuery = `
    SELECT 
        player_id,name,rating,potential,dribbling,long_pass,agility,goals,matches_played,standing,
        (rating * 0.3 + 
         potential * 0.2 + 
         dribbling * 0.1 + 
         long_pass * 0.1 + 
         agility * 0.1 + 
         goals * 0.1 + 
         matches_played * 0.05 + 
         standing * 0.05) AS playerPerformance
    FROM 
        players
    ORDER BY 
        playerPerformance DESC
    LIMIT 10;
  `;

  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(result);
    }
  });
});

// player stats queries ends here --------------------------------------->


// users queries starts from here --------------------------------------->

app.get('/users', (req, res) => {
  const sqlQuery = 'SELECT * FROM users';
  db.query(sqlQuery, (err, result) => {
      if (err){
        console.log(err);
      }else{
      res.json(result);
      }
  });
})


app.get('/users-leaderboard', (req, res) => {
  const sqlQuery = 'SELECT * FROM users order by goals desc';
  db.query(sqlQuery, (err, result) => {
      if (err){
        console.log(err);
      }else{
      res.json(result);
      }
  });
})

// league queries start from here -------------------------------->
app.get('/leagues', (req, res) => {
  const sqlQuery = 'SELECT * FROM leagues';
  db.query(sqlQuery, (err, result) => {
      if (err){
        console.log(err);
      }else{
      res.json(result);
      }
  });
})




// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      // parsing error
      return res.status(400).json({ error: 'Invalid JSON' });
    }
    if (res.statusCode === 404) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  });

// forms dealing starts from here 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });
app.use(express.urlencoded({ extended: true })); 

// app.post('/signup', upload.single('picture'), (req, res) => {
//   try {
//     const { name, age, gender, country, goals, assists, position, email, username, password } = req.body;

//     if (!password) {
//       return res.status(400).json({ success: false, message: 'Password is required' });
//     }
//     const picture = req.file ? req.file.filename : null;
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     const sql = `INSERT INTO users (name, age, gender, country, picture, goals, assists, position, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//     db.query(sql, [name, age, gender, country, picture, goals, assists, position, email, username, hashedPassword], (err, result) => {
//       if (err) {
//         console.error('Error:', err);
//         return res.status(500).json({ success: false, message: 'Internal server error' });
//       }
//       res.json({ success: true, message: 'User registered successfully' });
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });
app.post('/register', upload.single('picture'), (req, res) => {
  try {
    const { name, age, gender, country, goals, assists, position, email, username, password } = req.body;

    // Helper function to check if all required fields are empty
    const areAllFieldsEmpty = (...fields) => fields.every(field => !field || field.trim() === '');

    // Check if all required fields are empty
    if (areAllFieldsEmpty(name, age, gender, country, goals, assists, position, email, username, password)) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    const picture = req.file ? req.file.filename : null;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = `INSERT INTO users (name, age, gender, country, picture, goals, assists, position, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [name, age, gender, country, picture, goals, assists, position, email, username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      res.json({ success: true, message: 'User registered successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});