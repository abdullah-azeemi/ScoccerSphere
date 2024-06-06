document.addEventListener("DOMContentLoaded", async function() {
    try {
        await fetchTeams();
        await fetchTopPlayers();
        // await loadMatchDetails();
        toggleForms();
        displayTeams();
        await loadMatchDetailsbyLeague();
        toggleDetails('fifa18');

        $('#userDataModal').on('show.bs.modal', async function () {
            await fetchUserData();
        });
        await fetchUserData();
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
        const response = await fetch('http://localhost:5000/user-data');
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
        alert('Failed to fetch top players.');
    }
}

async function searchPlayers() {
    try {
        const searchText = document.getElementById('searchBox').value;
        const response = await fetch(`http://localhost:5000/search-player/${searchText}`);
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
                <p>Position: ${player.position}</p>
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
                            <p>Position: ${player.position}</p>
                            <p>Goals: ${player.goals}</p>
                            <p>Assists: ${player.assists}</p>
                        </div>
                        <div style="padding-left: 10px;">
                            <p>Matches Played: ${player.matches_played}</p>
                            <p>Shirt Number: ${player.shirt_no}</p>
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
function toggleDetails(game) {
    try {
        var fifa18Details = document.getElementById('fifa18Details');
        var fifa20Details = document.getElementById('fifa20Details');
        var fifa18Link = document.getElementById('fifa18Link');
        var fifa20Link = document.getElementById('fifa20Link');

        if (game === 'fifa18') {
            fifa18Details.style.display = 'block';
            fifa20Details.style.display = 'none';
            fifa18Link.classList.add('active');
            fifa20Link.classList.remove('active');
            loadMatchDetailsbyLeague('FIFA-18');
        } else if (game === 'fifa20' || game === 'fifa22') {
            fifa18Details.style.display = 'none';
            fifa20Details.style.display = 'block';
            fifa18Link.classList.remove('active');
            fifa20Link.classList.add('active');
            loadMatchDetailsbyLeague('FIFA-22');
        }
    } catch (error) {
        console.error('Error toggling details:', error);
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
        const detailsDiv = leagueName === 'FIFA-18' ? document.getElementById('fifa18Details') : document.getElementById('fifa20Details');
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
