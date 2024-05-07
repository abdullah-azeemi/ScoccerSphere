CREATE TABLE IF NOT EXISTS player (
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    position VARCHAR(255),
    goals INT,
    assists INT,
    yellow_cards INT,
    red_cards INT,
    matches_played INT,
    team_id INT,
    shirt_no INT
);

CREATE TABLE IF NOT EXISTS match_data (
    match_id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    homeGoals INT,
    awayGoals INT,
    attendance INT,
    referee VARCHAR(255),
    team_id INT
);


CREATE TABLE IF NOT EXISTS team (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60),
    league VARCHAR(100),
    goalsFor INT,
    goalsAgainst INT,
    wins INT,
    losses INT,
    draws INT,
    points INT
);


CREATE TABLE IF NOT EXISTS leagues (
         league_id INT PRIMARY KEY AUTO_INCREMENT,
         name VARCHAR(255),
         matches_played INT
     );



ALTER TABLE player
ADD FOREIGN KEY (team_id) REFERENCES team(team_id);





/// 
ALTER TABLE match_data
ADD COLUMN homeTeam_id INT,
ADD COLUMN awayTeam_id INT,
ADD FOREIGN KEY (homeTeam_id) REFERENCES team(team_id),
ADD FOREIGN KEY (awayTeam_id) REFERENCES team(team_id);

ALTER TABLE team
ADD COLUMN league_id INT,
ADD FOREIGN KEY (league_id) REFERENCES leagues(league_id);

