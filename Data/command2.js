

const fs = require('fs');
const { exit } = require('process');
const XLSX = require('xlsx');

// Load Excel file
const workbook = XLSX.readFile('players.xlsx');
console.log('Excel file loaded successfully.');

const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Get the first (and only) sheet

// Define columns to read from the Excel file
const columnsToRead = ['name','image','dob', 'height_cm','positions','overall_rating',
'potential','value','wage','preferred_foot','weak_foot','skill_moves','international_reputation',
'club_id','club_name','club_league','club_league_name','club_logo','club_rating','club_position','country_name',
'country_flag','country_rating','country_position','crossing','volleys','country_kit_number','country_kit_number',
'finishing','short_passing',
'dribbling','curve','long_pass','agility','balance','penalties','standing_tackle'];


// Open output text file for writing player commands
const outputStream = fs.createWriteStream('playerCommands.txt');

// Write the beginning of the SQL insert command to the file
outputStream.write("INSERT INTO player(" + columnsToRead.join(", ") + ") VALUES\n");

const teamData = [
    { team_id: 34, name: 'FC Bayern Munich' },
    { team_id: 35, name: 'Manchester United' },
    { team_id: 36, name: 'Galatasaray SK' },
    { team_id: 37, name: 'Sevilla FC' },
    { team_id: 38, name: 'Arsenal' },
    { team_id: 39, name: 'PSV' },
    { team_id: 40, name: 'RC Lens' },
    { team_id: 41, name: 'Real Madrid CF' },
    { team_id: 42, name: 'Napoli' },
    { team_id: 43, name: 'SC Braga' },
    { team_id: 44, name: '1. FC Union Berlin' },
    { team_id: 45, name: 'Inter' },
    { team_id: 46, name: 'SL Benfica' },
    { team_id: 47, name: 'FC Red Bull Salzburg' },
    { team_id: 48, name: 'Real Sociedad' },
    { team_id: 49, name: 'Atletico Madrid' },
    { team_id: 50, name: 'Feyenoord' },
    { team_id: 51, name: 'Lazio' },
    { team_id: 52, name: 'Celtic' },
    { team_id: 53, name: 'Paris FC' },
    { team_id: 54, name: 'Borussia Dortmund' },
    { team_id: 55, name: 'Milan' },
    { team_id: 56, name: 'Newcastle United' },
    { team_id: 57, name: 'Manchester City' },
    { team_id: 58, name: 'RB Leipzig' }
];


// Iterate over rows and columns to read data and generate SQL insert commands
const playerData = XLSX.utils.sheet_to_json(sheet);
let x = 0;
playerData.forEach((row, index) => {
    // Find team_id based on country_name
    const team = teamData.find(team => team.name === row['club_name']);
    const teamId = team ? team.team_id : 0;

    // Remove single and double quotes from all fields
    for (const key in row) {
        if (row.hasOwnProperty(key) && typeof row[key] === 'string') {
            row[key] = row[key].replace(/['"]/g, '');
        }
    }
    if(teamId !== 0){
    // Generate SQL insert command for each row
    const insertCommand = `(` +
        `'${row['name']}', ` +
        `'${row['image']}', ` +
        `'${row['dob']}', ` +
        `${parseInt(row['height_cm']) || 0}, ` +
        `'${row['positions']}', ` +
        `${parseInt(row['overall_rating']) || 0}, ` +
        `${parseInt(row['potential']) || 0}, ` +
        `'${row['value']}', ` +
        `'${row['wage']}', ` +
        `'${row['preferred_foot']}', ` +
        `${parseInt(row['weak_foot']) || 0}, ` +
        `${parseInt(row['skill_moves']) || 0}, ` +
        `${parseInt(row['international_reputation']) || 0}, ` +
        `${parseInt(row['club_id']) || 0}, ` +
        `'${row['club_name']}', ` +
        `${parseInt(row['club_league']) || 0}, ` +
        `'${row['club_league_name']}', ` +
        `'${row['club_logo']}', ` +
        `${parseInt(row['club_rating']) || 0}, ` +
        `${parseInt(row['club_position']) || 0}, ` +
        `'${row['country_name']}', ` +
        `${teamId}, ` +
        `${parseInt(row['finishing']) || 0}, ` +
        `${parseInt(row['dribbling']) || 0}, ` +
        `${parseInt(row['curve']) || 0}, ` +
        `${parseInt(row['long_pass']) || 0}, ` +
        `${parseInt(row['agility']) || 0}, ` +
        `${parseInt(row['balance']) || 0}, ` +
        `${parseInt(row['penalties']) || 0}, ` +
        `${parseInt(row['standing_tackle']) || 0} ` +
        `)`;
        
        if (index !== playerData.length - 1) {
            outputStream.write(insertCommand + ",\n");
        } else {
            // If it's the last row, don't add comma
            outputStream.write(insertCommand + ";\n");
        }
    }
    // Check if it's not the last row, add comma
   
});

// Close the output stream
outputStream.end();

console.log('Player commands written to playerCommands.txt');
