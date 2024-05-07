// Teams Details

document.addEventListener("DOMContentLoaded", function() {
    fetchTeams();
});

function fetchTeams() {
    fetch('http://localhost:5000/top-teams')
    .then(response => response.json())
    .then(teams => displayTeams(teams, 'teamsContainer'))
    .catch(error => console.error('Error fetching teams:', error));
}

function searchTeams() {
    const searchText = document.getElementById('teamSearchBox').value;
    fetch(`http://localhost:5000/search-team?name=${searchText}`)
        .then(response => response.json())
        .then(teams => displayTeams(teams, 'teamResults'))
        .catch(error => console.error('Error searching teams:', error));
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

document.addEventListener('DOMContentLoaded', function() {
    fetchTopPlayers();
});

function fetchTopPlayers() {
    fetch('http://localhost:5000/top-players')
        .then(response => response.json())
        .then(players => {
            const container = document.getElementById('playersContainer');
            container.innerHTML = ''; 
            players.forEach(player => {
                const playerDiv = document.createElement('div');
                playerDiv.className = 'player-card';
                playerDiv.innerHTML = `<h2>${player.name}</h2>
                                       <p>Position: ${player.position}</p>
                                       <p>Team: ${player.team_name}</p>
                                       <p>Matches Played: ${player.matches_played}</p>`;
                playerDiv.onclick = () => showPlayerDetails(player.player_id);
                container.appendChild(playerDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching top players:', error);
            alert('Failed to fetch top players.');
        });
}

function showPlayerDetails(playerId) {
    fetch(`http://localhost:5000/player-details/${playerId}`)
        .then(response => response.json())
        .then(data => {
            const modalBody = document.querySelector('modalBody');
            modalBody.innerHTML = `
                <div class="text-center">
                    <img src="${data.imageUrl}" class="img-fluid rounded-circle mb-2" alt="${data.name}">
                </div>
                <h3>${data.name}</h3>
                <p>Position: ${data.position}</p>
                <p>Team: ${data.team}</p>
                <p>Matches Played: ${data.matchesPlayed}</p>
                <p>Goals: ${data.goals}</p>
                <p>Assists: ${data.assists}</p>
            </div>`;
        })
        .catch(error => {
            console.error('Error fetching player details:', error);
            alert('Failed to fetch player details.');
        });
}

function searchPlayers() {
    const searchText = document.getElementById('searchBox').value;
    fetch(`http://localhost:5000/search-player/${searchText}`)
        .then(response => response.json())
        .then(players => {
            const resultsContainer = document.getElementById('searchResults');
            resultsContainer.innerHTML = '';
            players.forEach(player => {
                const playerDiv = document.createElement('div');
                playerDiv.className = 'player-card';
                playerDiv.innerHTML = `<h2>${player.name}</h2>
                                       <p>Position: ${player.position}</p>
                                       <p>Team: ${player.team_name}</p>
                                       <p>Matches Played: ${player.matches_played}</p>`;
                playerDiv.onclick = () => showPlayerDetails(player.player_id);
                resultsContainer.appendChild(playerDiv);
            });
        })
        .catch(error => {
            console.error('Error searching players:', error);
            alert('Failed to search players.');
        });
}



///  -------------------------------- FORMS ----------------------------------------------------
//login and sign up page

document.addEventListener('DOMContentLoaded', function() {
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
});


function searchTeams() {
    const searchText = document.getElementById('teamSearchBox').value;
    fetch(`http://localhost:5000/search-team/${searchText}`)
        .then(response => response.json())
        .then(teams => {
            const resultsContainer = document.getElementById('teamResults');
            resultsContainer.innerHTML = '';
            teams.forEach(team => {
                const teamDiv = document.createElement('div');
                teamDiv.className = 'team-card';
                teamDiv.innerHTML = `<h2>${team.name}</h2>
                                     <p>League: ${team.league}</p>
                                     <p>Wins: ${team.wins}</p>
                                     <p>Points: ${team.points}</p>`;
                resultsContainer.appendChild(teamDiv);
            });
        })
        .catch(error => {
            console.error('Error searching teams:', error);
            alert('Failed to search teams.');
        });
}
