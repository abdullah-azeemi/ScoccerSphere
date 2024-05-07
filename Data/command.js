const fs = require('fs');
const XLSX = require('xlsx');

// Load Excel file
const workbook = XLSX.readFile('PlayersData.xlsx');
console.log('Excel file loaded successfully.');

const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Get the first (and only) sheet

// Define columns to read from the Excel file
const columnsToRead = ['Player Name ', 'Position', 'Goals Scored ', 'Assists Provided ', ' Appearances', 'Nationality ', 'National Team Jersey Number']; // Player Name, Position, Goals Scored, Assists Provided, Matches Played, Team, Shirt Number

// Open output text file for writing player commands
const outputStream = fs.createWriteStream('playerCommands.txt');

// Initialize team name and team ID
let prevTeamName = '';
let currentTeamId = 0;

// Write the beginning of the SQL insert command to the file
outputStream.write("INSERT INTO player(name, position, goals, assists, matches_played, team_id, shirt_no) VALUES\n");

// Iterate over rows and columns to read data and generate SQL insert commands
const playerData = XLSX.utils.sheet_to_json(sheet);

playerData.forEach((row, index) => {
    // Extract data from the specified columns
    const playerName = row[columnsToRead[0]]; 
    const position = row[columnsToRead[1]] || ''; 
    const goals = parseInt(row[columnsToRead[2]]) || 0; 
    const assists = parseInt(row[columnsToRead[3]]) || 0; 
    const matchesPlayed = parseInt(row[columnsToRead[4]]) || 0; 
    const teamName = row[columnsToRead[5]] || ''; 
    const shirtNo = parseInt(row[columnsToRead[6]]) || 0; 

    // Assign a unique team ID when the team name changes
    if (teamName !== prevTeamName) {
        currentTeamId++;
        prevTeamName = teamName;
    }

    // Generate SQL insert command for each row
    const insertCommand = `('${playerName}', '${position}', ${goals}, ${assists}, ${matchesPlayed}, ${currentTeamId}, ${shirtNo})`;
    
    // Check if it's not the last row, add comma
    if (index !== playerData.length - 1) {
        outputStream.write(insertCommand + ",\n");
    } else {
        // If it's the last row, don't add comma
        outputStream.write(insertCommand + ";\n");
    }
});

// Close the output stream
outputStream.end();

console.log('Player commands written to playerCommands.txt');
