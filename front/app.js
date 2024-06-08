document.addEventListener("DOMContentLoaded", async function() {
    try {
        await fetchTeams();
        await fetchTopPlayers();
        await fetchUsers();
        await fetchLeagues();
        toggleDetailsMain('fifa');
        // await loadMatchDetails();
        toggleForms();
        displayTeams();
        await loadMatchDetailsbyLeague();
        toggleDetails('fifa18');

        $('#userDataModal').on('show.bs.modal', async function () {
            await fetchUserData();
            await fetchLeaguesMatches();
        });
        await fetchUserData();
        await fetchLeaguesMatches();
    } catch (error) {
        console.error('Error during DOMContentLoaded event:', error);
    }
});

// Side bar
function openSidebar() {
    try {
        document.getElementById("userSidebar").classList.add("open");
    } catch (error) {
        console.error('Error opening sidebar:', error);
    }
}

function closeSidebar() {
    try {
        document.getElementById("userSidebar").classList.remove("open");
    } catch (error) {
        console.error('Error closing sidebar:', error);
    }
}

async function fetchUserData() {
    try {
        const response = await fetch('http://localhost:5000/users');
        const data = await response.json();
        const doc = document.getElementById('userSidebar');
        doc.getElementById('userPicture').src = data.picture;
        doc.getElementById('userName').innerText = data.name;
        doc.getElementById('userEmail').innerText = data.email;
        doc.getElementById('userUsername').innerText = data.username;
        doc.getElementById('userGoals').innerText = `Goals: ${data.goals}`;
        doc.getElementById('userAssists').innerText = `Assists: ${data.assists}`;
        doc.getElementById('userPosition').innerText = `Position: ${data.position}`;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

async function fetchLeaguesData() {
    try {
        const response = await fetch('http://localhost:5000/leagues');
        const data = await response.json();
        const doc = document.getElementById('userSidebar');
        doc.getElementById('league_id').innerText = `League ID: ${data.league_id}`;
        doc.getElementById('name').innerText = `Name: ${data.name}`;
        doc.getElementById('matches_played').innerText = `Matches Played: ${data.matches_played}`;
    } catch (error) {
        console.error('Error fetching leagues data:', error);
    }
}

// Teams Details
async function fetchTeams() {
    try {
        const response = await fetch('http://localhost:5000/top-teams');
        const teams = await response.json();
        displayTeams(teams, 'teamsContainer');
    } catch (error) {
        console.error('Error fetching teams:', error);
    }
}

async function fetchUsers(){
    try {
        const response = await fetch('http://localhost:5000/users');
        const users = await response.json();
        displayUsers(users, 'leaderboardTableBody');
    }
    catch (error) {
        console.error('Error fetching users:', error);
    }
}
async function fetchLeagues(){
    try {
        const response = await fetch('http://localhost:5000/leagues');
        const leagues = await response.json();
        displayLeagues(leagues, 'LeaguesTableBody');
    }
    catch (error) {
        console.error('Error fetching Leagues:', error);
    }
}

async function searchTeams() {
    try {
        const searchText = document.getElementById('teamSearchBox').value;
        const response = await fetch(`http://localhost:5000/search-team/${searchText}`);
        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            throw new Error('Failed to fetch teams');
        }
        const teams = await response.json();
        const container = document.getElementById('teamResults');
        if (teams.length === 0) {
            container.innerHTML = '<p>No record found !!!</p>';
        } else {
            displayTeams(teams, 'teamResults');
        }
    } catch (error) {
        console.error('Error searching teams:', error);
        alert('Failed to search teams.');
    }
}

function displayTeams(teams, containerId) {
    try {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        teams.forEach(team => {
            const teamDiv = document.createElement('div');
            teamDiv.className = 'team-card';
            teamDiv.innerHTML = `<h2>${team.name}</h2>
                                 <p>League: ${team.league}</p>
                                 <p>Wins: ${team.wins}</p>
                                 <p>Losses: ${team.losses}</p>
                                 <button class="btn btn-primary btn-sm">View Details</button>`;
            const button = teamDiv.querySelector('button');
            button.addEventListener('click', () => showTeamDetails(team));
            container.appendChild(teamDiv);
        });
    } catch (error) {
        console.error('Error displaying teams:', error);
    }
}
function displayUsers(users, containerId) {
    try {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Clear any existing content
        
        users.forEach(user => {
            const userRow = document.createElement('tr');
            userRow.innerHTML = `
                <td>${user.rankLeaderboard}</td>
                <td>${user.name}</td>
                <td>${user.goals}</td>
                <td>${user.assists}</td>
                <td>${user.goals}</td>
            `;
            container.appendChild(userRow);
        });
    } catch (error) {
        console.error('Error displaying users:', error);
    }
}
function displayLeagues(leagues, containerId) {
    try {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Clear any existing content
        
        leagues.forEach(league => {
            const userRow = document.createElement('tr');
            userRow.innerHTML = `
                <td>${league.league_id}</td>
                <td>${league.name}</td>
                <td>${league.matches_played}</td>
            `;
            container.appendChild(userRow);
        });
    } catch (error) {
        console.error('Error displaying Leagues:', error);
    }
}


async function showTeamDetails(team) {
    try {
        let searchName = team.name;
        if (searchName.toLowerCase() === "england") {
            searchName = "UK";
        }

        const response = await fetch(`https://restcountries.com/v3.1/name/${searchName}`);
        const data = await response.json();
        const countryImage = data[0].flags.png;
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="display: flex; align-items: center;">
                <img src=${countryImage} alt="Country Image" style="max-width: 200px; margin-right: 20px; border-radius: 10px;">
                <div>
                    <div style="display: flex; align-items: center;">
                        <h2 style="margin-bottom: 5px;">${team.name}</h2>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <div style="border-right: 1px solid #ccc; padding-right: 10px;">
                            <p>Wins: ${team.wins}</p>
                            <p>Loses: ${team.losses}</p>
                            <p>Draws: ${team.draws}</p>
                        </div>
                        <div style="padding-left: 10px;">
                            <p>Points: ${team.points}</p>
                            <p>League: ${team.league}</p>
                        </div>
                    </div>
                </div>
            </div>`;
        $('#teamDetailModal').modal('show');
    } catch (error) {
        console.error('Error fetching country image:', error);
        alert('Failed to fetch country image.');
    }
}

// Player Details
async function fetchTopPlayers() {
    try {
        const response = await fetch('http://localhost:5000/top-players');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const players = await response.json();
        displayPlayers(players, 'playersContainer');
    } catch (error) {
        console.error('Error fetching top players:', error);
    }
}

async function searchPlayers() {
    try {
        const searchText = document.getElementById('searchBox').value;
        const response = await fetch(`http://localhost:5000/search-players/${searchText}`);
        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            throw new Error('Failed to fetch players');
        }
        const players = await response.json();
        if (players.length === 0) {
            const resultsContainer = document.getElementById('searchResults');
            resultsContainer.innerHTML = '<p>No record found !!!</p>';
        } else {
            displayPlayers(players, 'searchResults');
        }
    } catch (error) {
        console.error('Error searching players:', error);
        alert('Failed to search players.');
    }
}

function displayPlayers(players, containerId) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container element not found:', containerId);
            return;
        }
        container.innerHTML = '';
        players.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player-card';
            playerDiv.innerHTML = `
                <h2>${player.name}</h2>
                <p>Value : ${player.value}</p>
                <p>Team: ${player.team_name}</p>
                <p>Matches Played: ${player.matches_played}</p>
                <button class="btn btn-primary btn-sm">View Details</button>`;

            const button = playerDiv.querySelector('button');
            button.addEventListener('click', () => showPlayerDetails(player));
            container.appendChild(playerDiv);
        });
    } catch (error) {
        console.error('Error displaying players:', error);
    }
}

async function showPlayerDetails(player) {
    try {
        let searchName = player.team_name;
        if (searchName.toLowerCase() === "england") {
            searchName = "UK";
        }
        const response = await fetch(`https://restcountries.com/v3.1/name/${searchName}`);
        const data = await response.json();
        const countryImage = data[0].flags.png;
        const playerImage = player.image_url;

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="display: flex; align-items: center;">
                <img src="${playerImage}" alt="Player Image" style="max-width: 200px; margin-right: 20px; border-radius: 50%;">
                <div>
                    <div style="display: flex; align-items: center;">
                        <h2 style="margin-bottom: 5px;">${player.name}</h2>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <div style="border-right: 1px solid #ccc; padding-right: 10px;">
                            <p>Height: ${player.height} cm</p>
                            <p>Goals: ${player.goals}</p>
                            <p>Matches Played : ${player.matches_played}</p>
                            <p>Preffered Foot: ${player.preferred_foot}</p>
                        </div>
                        <div style="padding-left: 10px;">
                            <p>Agility: ${player.agility}</p>
                            <p>Club Name: ${player.club_name}</p>
                            <p>Dribbling: ${player.dribbling}</p>
                            <p>Team: ${player.team_name}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 20px;">
                <!-- Country Flag -->
                <img src="${countryImage}" alt="Country Flag" style="max-width: 200px; border-radius: 10px;">
            </div>
        `;
        $('#playerDetailModal').modal('show');
    } catch (error) {
        console.error('Error fetching country image:', error);
        alert('Failed to fetch country image.');
    }
}

// Forms
document.getElementById("signupForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    try {
        const formData = new FormData(this);
        const response = await fetch('http://localhost:5000/api/signup', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert('Signup successful!');
        } else {
            alert('Signup failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function toggleForms() {
    try {
        const loginForm = document.getElementById('loginAccountForm');
        const signupForm = document.getElementById('signupAccountForm');
        if (loginForm.style.left === "100%") {
            loginForm.style.left = "0";
            signupForm.style.left = "100%";
        } else {
            loginForm.style.left = "-100%";
            signupForm.style.left = "0";
        }
    } catch (error) {
        console.error('Error toggling forms:', error);
    }
}

window.toggleForms = toggleForms;

// Matches Page
function toggleDetailsMain(league) {
    const fifaLink = document.getElementById('fifaLink');
    const clLink = document.getElementById('ClLink');
    const scLink = document.getElementById('ScLink');

    const leagueLinks = [fifaLink, clLink, scLink];
    leagueLinks.forEach(link => link.classList.remove('active'));

    if (league === 'fifa') {
        fifaLink.classList.add('active');
        updateYearButtons('fifa');
        toggleDetails('fifa18');
    } else if (league === 'ChampionLeagues') {
        clLink.classList.add('active');
        updateYearButtons('cl');
        toggleDetails('cl18');
    } else if (league === 'SuperCup') {
        scLink.classList.add('active');
        updateYearButtons('sc');
        toggleDetails('sc18');
    }
}

function updateYearButtons(league) {
    const lowerSB = document.getElementById('lowerSB');
    lowerSB.innerHTML = '';

    if (league === 'fifa') {
        lowerSB.innerHTML = `
            <a href="#" onclick="toggleDetails('fifa18')" id="fifa18Link" class="active">FIFA 18</a>
            <a href="#" onclick="toggleDetails('fifa20')" id="fifa20Link">FIFA 22</a>
        `;
    } else if (league === 'cl') {
        lowerSB.innerHTML = `
            <a href="#" onclick="toggleDetails('cl18')" id="cl18Link" class="active">Champion Leagues 18</a>
            <a href="#" onclick="toggleDetails('cl20')" id="cl20Link">Champion Leagues 22</a>
        `;
    } else if (league === 'sc') {
        lowerSB.innerHTML = `
            <a href="#" onclick="toggleDetails('sc18')" id="sc18Link" class="active">Super Cup 18</a>
            <a href="#" onclick="toggleDetails('sc20')" id="sc20Link">Super Cup 22</a>
        `;
    }
}

// Function to toggle the details view based on the selected year
function toggleDetails(game) {
    const allDetails = [
        'fifa18Details', 'fifa20Details',
        'cl18Details', 'cl20Details',
        'sc18Details', 'sc20Details',
        'PlyrDetails','PlyrValueDetails','PlyrAverageDetails'
    ];
    const allLinks = [
        'fifa18Link', 'fifa20Link',
        'cl18Link', 'cl20Link',
        'sc18Link', 'sc20Link',
        'Plyr1Link','Plyr2Link','Plyr3Link'
    ];
    
    allDetails.forEach(detail => document.getElementById(detail).style.display = 'none');
    allLinks.forEach(link => {
        const linkElement = document.getElementById(link);
        if (linkElement) {
            linkElement.classList.remove('active');
        }
    });

    if (game.startsWith('fifa')) {
        document.getElementById(`${game}Details`).style.display = 'block';
        document.getElementById(`${game}Link`).classList.add('active');
        loadMatchDetailsbyLeague(game === 'fifa18' ? 'FIFA-18' : 'FIFA-22');
    } else if (game.startsWith('cl')) {
        document.getElementById(`${game}Details`).style.display = 'block';
        document.getElementById(`${game}Link`).classList.add('active');
        loadMatchDetailsbyLeague(game === 'cl18' ? 'Champions League 2018' : 'Champions League 2021');
    } else if (game.startsWith('sc')) {
        document.getElementById(`${game}Details`).style.display = 'block';
        document.getElementById(`${game}Link`).classList.add('active');
        loadMatchDetailsbyLeague(game === 'sc18' ? 'Super Cup 2018' : 'Super Cup 2021');
    }
    if(game.startsWith('Plyr')){
        document.getElementById(`${game}Details`).style.display = 'block';
        document.getElementById(`${game}Link`).classList.add('active');
        loadPlayerStatsDetails(game === 'Plyr1' ? 'Plyr1' : game === 'Plyr2' ? 'Plyr2' : 'Plyr3');
    }
}

// Function to load match details by league
function toggleDetailsMain(league) {
    const fifaLink = document.getElementById('fifaLink');
    const clLink = document.getElementById('ClLink');
    const scLink = document.getElementById('ScLink');

    const leagueLinks = [fifaLink, clLink, scLink];
    leagueLinks.forEach(link => link.classList.remove('active'));

    if (league === 'fifa') {
        fifaLink.classList.add('active');
        updateYearButtons('fifa');
        toggleDetails('fifa18');
    } else if (league === 'ChampionLeagues') {
        clLink.classList.add('active');
        updateYearButtons('cl');
        toggleDetails('cl18');
    } else if (league === 'SuperCup') {
        scLink.classList.add('active');
        updateYearButtons('sc');
        toggleDetails('sc18');
    }
}

function updateYearButtons(league) {
    const lowerSB = document.getElementById('lowerSB');
    lowerSB.innerHTML = '';

    if (league === 'fifa') {
        lowerSB.innerHTML = `
            <a href="#" onclick="toggleDetails('fifa18')" id="fifa18Link" class="active">FIFA 18</a>
            <a href="#" onclick="toggleDetails('fifa20')" id="fifa20Link">FIFA 22</a>
        `;
    } else if (league === 'cl') {
        lowerSB.innerHTML = `
            <a href="#" onclick="toggleDetails('cl18')" id="cl18Link" class="active">Champion League 18</a>
            <a href="#" onclick="toggleDetails('cl20')" id="cl20Link">Champion League 22</a>
        `;
    } else if (league === 'sc') {
        lowerSB.innerHTML = `
            <a href="#" onclick="toggleDetails('sc18')" id="sc18Link" class="active">Super Cup 18</a>
            <a href="#" onclick="toggleDetails('sc20')" id="sc20Link">Super Cup 22</a>
        `;
    }
}

function toggleDetails(game) {
    const allDetails = [
        'fifa18Details', 'fifa20Details',
        'cl18Details', 'cl20Details',
        'sc18Details', 'sc20Details',
    ];
    const allLinks = [
        'fifa18Link', 'fifa20Link',
        'cl18Link', 'cl20Link',
        'sc18Link', 'sc20Link'
    ];
    
    allDetails.forEach(detail => document.getElementById(detail).style.display = 'none');
    allLinks.forEach(link => {
        const linkElement = document.getElementById(link);
        if (linkElement) {
            linkElement.classList.remove('active');
        }
    });

    if (game.startsWith('fifa')) {
        document.getElementById(`${game}Details`).style.display = 'block';
        document.getElementById(`${game}Link`).classList.add('active');
        loadMatchDetailsbyLeague(game === 'fifa18' ? 'FIFA-18' : 'FIFA-22');
    } else if (game.startsWith('cl')) {
        document.getElementById(`${game}Details`).style.display = 'block';
        document.getElementById(`${game}Link`).classList.add('active');
        loadMatchDetailsbyLeague(game === 'cl18' ? 'Champions League 2018' : 'Champions League 2021');
    } else if (game.startsWith('sc')) {
        document.getElementById(`${game}Details`).style.display = 'block';
        document.getElementById(`${game}Link`).classList.add('active');
        loadMatchDetailsbyLeague(game === 'sc18' ? 'Super Cup 2018' : 'Super Cup 2021');
    }
}

async function loadMatchDetailsbyLeague(leagueName) {
    try {
        const url = `http://localhost:5000/league-matches-details?name=${encodeURIComponent(leagueName)}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch match details');
        }
        const data = await response.json();
        const detailsDiv = document.getElementById(
            leagueName.includes('FIFA') ? (leagueName === 'FIFA-18' ? 'fifa18Details' : 'fifa20Details') :
            leagueName.includes('Champions') ? (leagueName === 'Champions League 2018' ? 'cl18Details' : 'cl20Details') :
            (leagueName === 'Super Cup 2018' ? 'sc18Details' : 'sc20Details')
        );
        detailsDiv.innerHTML = '';

        for (const match of data) {
            const formattedDate = new Date(match.date).toLocaleDateString('en-US');

            let homeFlag = match.homeTeamName;
            let awayFlag = match.awayTeamName;
            if (homeFlag === 'England' || homeFlag === 'Wales') {
                homeFlag = 'UK';
            }
            if (awayFlag === 'England' || awayFlag === 'Wales') {
                awayFlag = 'UK';
            }

            const [homeTeamData, awayTeamData] = await Promise.all([
                fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(homeFlag)}`).then(res => res.json()),
                fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(awayFlag)}`).then(res => res.json())
            ]);
            const homeTeamFlag = homeTeamData[0]?.flags?.png || '';
            const awayTeamFlag = awayTeamData[0]?.flags?.png || '';

            const cardHtml = `
            <div class="card mt-3 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0 font-weight-bold">
                            <img src="${homeTeamFlag}" alt="${match.homeTeamName} flag" style="width: 20px; height: 15px; margin-right: 10px; border-radius:5px;">
                            ${match.homeTeamName} 
                            <span class="text-muted">vs</span> 
                            ${match.awayTeamName}
                            <img src="${awayTeamFlag}" alt="${match.awayTeamName} flag" style="width: 20px; height: 15px; margin-left: 10px; border-radius:5px;">
                        </h5>
                        <small class="text-muted">${formattedDate}</small>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="card-text mb-0"><strong>Goals:</strong> ${match.homeGoals} - ${match.awayGoals}</p>
                        <button class="btn btn-primary btn-sm">View Details</button>
                    </div>
                </div>
            </div>`;
            detailsDiv.innerHTML += cardHtml;
        }
    } catch (error) {
        console.error('Error fetching match details:', error);
    }
}


async function showMatchesDetails(match) {
    console.log(match.details.get);
}

// Leaderboard Page
async function fetchUserData() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();

        users.forEach(user => {
            user.strikeRate = (user.goals + user.assists) / 2;
        });
        users.sort((a, b) => b.strikeRate - a.strikeRate);

        const leaderboardTableBody = document.getElementById('leaderboardTableBody');
        leaderboardTableBody.innerHTML = '';
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.goals}</td>
                <td>${user.assists}</td>
                <td>${user.strikeRate.toFixed(2)}</td>
            `;
            leaderboardTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}


// Leagues Data
async function fetchLeaguesData() {
    try {
        const response = await fetch('/api/leagues');
        const leagues = await response.json();

        const LeaguesTableBody = document.getElementById('LeaguesTableBody');
        LeaguesTableBody.innerHTML = '';
        leagues.forEach((league, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${league.league_id}</td>
                <td>${league.name}</td>
                <td>${league.matches_played}</td>
            `;
            LeaguesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}
