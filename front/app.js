document.addEventListener("DOMContentLoaded", function() {
    fetchTeams();
    fetchTopPlayers();
    toggleForms();
});


// Teams Details

function fetchTeams() {
    fetch('http://localhost:5000/top-teams')
    .then(response => response.json())
    .then(teams => displayTeams(teams, 'teamsContainer'))
    .catch(error => console.error('Error fetching teams:', error));
}

function searchTeams() {
    const searchText = document.getElementById('teamSearchBox').value;
    fetch(`http://localhost:5000/search-team?name=${searchText}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    return [];
                }
                throw new Error('Failed to fetch teams');
            }
            return response.json();
        })
        .then(teams => {
            const container = document.getElementById('teamResults');
            if (teams.length === 0) {
                container.innerHTML = '<p>No record found !!!</p>';
            } else {
                displayTeams(teams, 'teamResults');
            }
        })
        .catch(error => {
            console.error('Error searching teams:', error);
            alert('Failed to search teams.');
        });
}


function displayTeams(teams, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    teams.forEach(team => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-card';
        teamDiv.innerHTML = `<h2>${team.name}</h2>
                             <p>League: ${team.league}</p>
                             <p>Wins: ${team.wins}</p>
                             <p>Loses: ${team.losses}</p>
                             <p>Points: ${team.points}</p>`;
        container.appendChild(teamDiv);
    });
}


// Player Details

function fetchTopPlayers() {
    fetch('http://localhost:5000/top-players')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(players => displayPlayers(players, 'playersContainer'))
        .catch(error => {
            console.error('Error fetching top players:', error);
            alert('Failed to fetch top players.');
        });
}

function searchPlayers() {
    const searchText = document.getElementById('searchBox').value;
    fetch(`http://localhost:5000/search-player/${searchText}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    return [];
                }
                throw new Error('Failed to fetch players');
            }
            return response.json();
        })
        .then(players => {
            if (players.length === 0) {
                const resultsContainer = document.getElementById('searchResults');
                resultsContainer.innerHTML = '<p>No record found !!!</p>';
            } else {
                displayPlayers(players, 'searchResults');
            }
        })
        .catch(error => {
            console.error('Error searching players:', error);
            alert('Failed to search players.');
        });
}


function displayPlayers(players, containerId) {
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
        `;
        playerDiv.onclick = () => showPlayerDetails(player.player_id);
        container.appendChild(playerDiv);
    });
}


///  -------------------------------- FORMS ----------------------------------------------------
//login and sign up page

function toggleForms() {
    const loginForm = document.getElementById('loginAccountForm');
    const signupForm = document.getElementById('signupAccountForm');
    if (loginForm.style.left === "100%") {
        loginForm.style.left = "0";
        signupForm.style.left = "100%";
    } else {
        loginForm.style.left = "-100%";
        signupForm.style.left = "0";
    }
}

window.toggleForms = toggleForms; 