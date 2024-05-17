// const fs = require('fs');
// const XLSX = require('xlsx');

// // Load Excel file
// const workbook = XLSX.readFile('players.xlsx');
// console.log('Excel file loaded successfully.');

// const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Get the first (and only) sheet

// // Define columns to read from the Excel file
// const columnsToRead = ['name', 'description','image','dob', 'height_cm','positions','overall_rating',
// 'potential','value','wage','preferred_foot','weak_foot','skill_moves','international_reputation','specialities',
// 'club_id','club_name','club_league','club_league_name','club_logo','club_rating','club_position','country_name',
// 'country_flag','country_rating','country_position','crossing','volleys','country_kit_number','country_kit_number',
// 'finishing','short_passing',
// 'dribbling','curve','long_pass','agility','balance','penalties','standing_tackle','play_styles'];


// // Open output text file for writing player commands
// const outputStream = fs.createWriteStream('playerCommands.txt');

// // Write the beginning of the SQL insert command to the file
// outputStream.write("INSERT INTO player(" + columnsToRead.join(", ") + ") VALUES\n");

// // Define teams with respect to team ID
// // // Define teams with respect to team ID
// const teamData = [
//     { team_id: 1, name: 'Argentina' },
//     { team_id: 2, name: 'France' },
//     { team_id: 3, name: 'Croatia' },
//     { team_id: 4, name: 'Morocco' },
//     { team_id: 5, name: 'Netherlands' },
//     { team_id: 6, name: 'England' },
//     { team_id: 7, name: 'Brazil' },
//     { team_id: 8, name: 'Portugal' },
//     { team_id: 9, name: 'Australia' },
//     { team_id: 10, name: 'USA' },
//     { team_id: 11, name: 'Poland' },
//     { team_id: 12, name: 'Senegal' },
//     { team_id: 13, name: 'Japan' },
//     { team_id: 14, name: 'South Korea' },
//     { team_id: 15, name: 'Spain' },
//     { team_id: 16, name: 'Switzerland' },
//     { team_id: 17, name: 'Ecuador' },
//     { team_id: 18, name: 'Qatar' },
//     { team_id: 19, name: 'Iran' },
//     { team_id: 20, name: 'Wales' },
//     { team_id: 21, name: 'Mexico' },
//     { team_id: 22, name: 'Saudi Arabia' },
//     { team_id: 23, name: 'Denmark' },
//     { team_id: 24, name: 'Tunisia' },
//     { team_id: 25, name: 'Germany' },
//     { team_id: 26, name: 'Costa Rica' },
//     { team_id: 27, name: 'Belgium' },
//     { team_id: 28, name: 'Cameroon' },
//     { team_id: 29, name: 'Serbia' },
//     { team_id: 30, name: 'Ghana' },
//     { team_id: 31, name: 'Uruguay' },
//     { team_id: 32, name: 'Canada' },
//     { team_id: 33, name: 'Russia' },
//     { team_id: 34, name: 'Norway' },
//     { team_id: 35, name: 'Scotland' },
//     { team_id: 36, name: 'Finland' },
//     { team_id: 37, name: 'Czech Republic' },
//     { team_id: 38, name: 'Friendly International' },
//     { team_id: 39, name: 'Wales' },
//     { team_id: 40, name: 'Iceland' },
//     { team_id: 41, name: 'Romania' },
//     { team_id: 42, name: 'Republic of Ireland' },
//     { team_id: 43, name: 'Nothern Ireland' },
//     { team_id: 44, name: 'New Zealand' }
// ];

// // Iterate over rows and columns to read data and generate SQL insert commands
// const playerData = XLSX.utils.sheet_to_json(sheet);
// let x = 0;

// playerData.forEach((row, index) => {
//     // Find team_id based on country_name
//     const team = teamData.find(team => team.name === row['country_name']);
//     const teamId = team ? team.team_id : 0;
//     if (x === 6){
//     console.log(row['country_name'],team,' ',teamId);
//     x++;
//     }
//     x++;
//     // Generate SQL insert command for each row
//     const insertCommand = `(` +
//         `'${row['name']}', ` +
//         `'${row['description']}', ` +
//         `'${row['image']}', ` +
//         `'${row['dob']}', ` +
//         `${parseInt(row['height_cm']) || 0}, ` +
//         `'${row['positions']}', ` +
//         `${parseInt(row['overall_rating']) || 0}, ` +
//         `${parseInt(row['potential']) || 0}, ` +
//         `'${row['value']}', ` +
//         `'${row['wage']}', ` +
//         `'${row['preferred_foot']}', ` +
//         `${parseInt(row['weak_foot']) || 0}, ` +
//         `${parseInt(row['skill_moves']) || 0}, ` +
//         `${parseInt(row['international_reputation']) || 0}, ` +
//         `'${row['specialities']}', ` +
//         `${parseInt(row['club_id']) || 0}, ` +
//         `'${row['club_name']}', ` +
//         `${parseInt(row['club_league']) || 0}, ` +
//         `'${row['club_league_name']}', ` +
//         `'${row['club_logo']}', ` +
//         `${parseInt(row['club_rating']) || 0}, ` +
//         `${parseInt(row['club_position']) || 0}, ` +
//         `'${row['country_name']}', ` +
//         `${teamId}, ` +
//         `${parseInt(row['finishing']) || 0}, ` +
//         `${parseInt(row['dribbling']) || 0}, ` +
//         `${parseInt(row['curve']) || 0}, ` +
//         `${parseInt(row['long_pass']) || 0}, ` +
//         `${parseInt(row['agility']) || 0}, ` +
//         `${parseInt(row['balance']) || 0}, ` +
//         `${parseInt(row['penalties']) || 0}, ` +
//         `${parseInt(row['standing_tackle']) || 0}, ` +
//         `'${row['play_styles']}'` +
//         `)`;

//     // Check if it's not the last row, add comma
//     if (index !== playerData.length - 1) {
//         outputStream.write(insertCommand + ",\n");
//     } else {
//         // If it's the last row, don't add comma
//         outputStream.write(insertCommand + ";\n");
//     }
// });

// // Close the output stream
// outputStream.end();

// console.log('Player commands written to playerCommands.txt');


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

// Define teams with respect to team ID
const teamData = [
    { team_id: 1, name: 'Argentina' },
    { team_id: 2, name: 'France' },
    { team_id: 3, name: 'Croatia' },
    { team_id: 4, name: 'Morocco' },
    { team_id: 5, name: 'Netherlands' },
    { team_id: 6, name: 'England' },
    { team_id: 7, name: 'Brazil' },
    { team_id: 8, name: 'Portugal' },
    { team_id: 9, name: 'Australia' },
    { team_id: 10, name: 'USA' },
    { team_id: 11, name: 'Poland' },
    { team_id: 12, name: 'Senegal' },
    { team_id: 13, name: 'Japan' },
    { team_id: 14, name: 'South Korea' },
    { team_id: 15, name: 'Spain' },
    { team_id: 16, name: 'Switzerland' },
    { team_id: 17, name: 'Ecuador' },
    { team_id: 18, name: 'Qatar' },
    { team_id: 19, name: 'Iran' },
    { team_id: 20, name: 'Wales' },
    { team_id: 21, name: 'Mexico' },
    { team_id: 22, name: 'Saudi Arabia' },
    { team_id: 23, name: 'Denmark' },
    { team_id: 24, name: 'Tunisia' },
    { team_id: 25, name: 'Germany' },
    { team_id: 26, name: 'Costa Rica' },
    { team_id: 27, name: 'Belgium' },
    { team_id: 28, name: 'Cameroon' },
    { team_id: 29, name: 'Serbia' },
    { team_id: 30, name: 'Ghana' },
    { team_id: 31, name: 'Uruguay' },
    { team_id: 32, name: 'Canada' },
    { team_id: 33, name: 'Russia' },
    { team_id: 34, name: 'Norway' },
    { team_id: 35, name: 'Scotland' },
    { team_id: 36, name: 'Finland' },
    { team_id: 37, name: 'Czech Republic' },
    { team_id: 38, name: 'Friendly International' },
    { team_id: 39, name: 'Wales' },
    { team_id: 40, name: 'Iceland' },
    { team_id: 41, name: 'Romania' },
    { team_id: 42, name: 'Republic of Ireland' },
    { team_id: 43, name: 'Northern Ireland' },
    { team_id: 44, name: 'New Zealand' }
];

// Iterate over rows and columns to read data and generate SQL insert commands
const playerData = XLSX.utils.sheet_to_json(sheet);
let x = 0;
playerData.forEach((row, index) => {
    // Find team_id based on country_name
    const team = teamData.find(team => team.name === row['country_name']);
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
