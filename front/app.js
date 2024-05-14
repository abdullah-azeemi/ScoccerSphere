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
    fetch(`http://localhost:5000/search-team/${searchText}`)
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
                             <p>Loses: ${team.losses}</p>`;
        teamDiv.addEventListener('click', () => showTeamDetails(team));
        container.appendChild(teamDiv);
    });
}

function showTeamDetails(team) {
    fetch(`https://restcountries.com/v3.1/name/${team.name}`)
        .then(response => response.json())
        .then(data => {
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
            `;
            $('#teamDetailModal').modal('show');
        })
        .catch(error => {
            console.error('Error fetching country image:', error);
            alert('Failed to fetch country image.');
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

        playerDiv.addEventListener('click', () => showPlayerDetails(player));
        container.appendChild(playerDiv);
    });
}

function showPlayerDetails(player) {
    fetch(`https://restcountries.com/v3.1/name/${player.team_name}`)
        .then(response => response.json())
        .then(data => {
            const countryImage = data[0].flags.png;
            const playerImage = player.image_url;
            var rank = 50; //player.rank

            var maxRank = 100; 
            var rankPercentage = (rank/ maxRank) * 100;

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
        })
        .catch(error => {
            console.error('Error fetching country image:', error);
            alert('Failed to fetch country image.');
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

function nextSection(sectionId) {
    document.getElementById(sectionId).style.display = "block";
    document.getElementById("personalDetails").style.display = "none";
    document.getElementById("footballSkills").style.display = "none";
}

document.getElementById("signupForm").addEventListener("submit", function(event) {
    // Handle form submission
    event.preventDefault();
    // Get form data and submit
});
