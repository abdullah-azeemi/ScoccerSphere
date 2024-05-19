document.addEventListener("DOMContentLoaded", function() {
    fetchTeams();
    fetchTopPlayers();
    //loadMatchDetails();
    toggleForms();
    displayTeams();
    loadMatchDetailsbyLeague();
    toggleDetails('fifa18');
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
    let searchName = team.name;
    if (searchName.toLowerCase() === "england") {
        searchName = "UK";
    }
    
    fetch(`https://restcountries.com/v3.1/name/${searchName}`)
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
    let searchName = player.team_name;
        if (searchName.toLowerCase() === "england") {
            searchName = "UK";
        }
    fetch(`https://restcountries.com/v3.1/name/${searchName}`)
        .then(response => response.json())
        .then(data => {
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
        })
        .catch(error => {
            console.error('Error fetching country image:', error);
            alert('Failed to fetch country image.');
        });
}



///  -------------------------------- FORMS ----------------------------------------------------
//login and sign up page

document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Signup successful!');
        } else {
            alert('Signup failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});




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

var currentTab = 0; 
showTab(currentTab); 

function showTab(n) {
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  fixStepIndicator(n)
}

function nextPrev(n) {
  var x = document.getElementsByClassName("tab");
  if (n == 1 && !validateForm()) return false;
  x[currentTab].style.display = "none";
  currentTab = currentTab + n;
  if (currentTab >= x.length) {
    document.getElementById("regForm").submit();
    return false;
  }
  showTab(currentTab);
}

function validateForm() {
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  for (i = 0; i < y.length; i++) {
    if (y[i].value == "") {
      y[i].className += " invalid";
      valid = false;
    }
  }
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; 
}

function fixStepIndicator(n) {
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n].className += " active";
}


document.getElementById("signupForm").addEventListener("submit", function(event) {
    // Handle form submission
    event.preventDefault();
    // Get form data and submit
});


//Matches Page 

function toggleDetails(game) {
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
}


// -> this one

// function loadMatchDetailsbyLeague(leagueName) {
//     // Use the appropriate URL and include the league name as a query parameter
//     const url = `http://localhost:5000/league-matches-details?name=${encodeURIComponent(leagueName)}`;

//     fetch(url)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Failed to fetch match details');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Determine which div to populate based on the league name
//             const detailsDiv = leagueName === 'FIFA-18' ? document.getElementById('fifa18Details') : document.getElementById('fifa20Details');
//             detailsDiv.innerHTML = '';
//             // Create and append match detail cards
//             data.forEach(match => {
//                 const formattedDate = new Date(match.date).toLocaleDateString('en-US');
//                 const cardHtml = `
//                 <div class="card mt-3 shadow-sm">
//                     <div class="card-body">
//                         <div class="d-flex justify-content-between align-items-center">
//                             <h5 class="card-title mb-0 font-weight-bold">
//                                 ${match.homeTeamName} 
//                                 <span class="text-muted">vs</span> 
//                                 ${match.awayTeamName}
//                             </h5>
//                             <small class="text-muted">${formattedDate}</small>
//                         </div>
//                         <hr>
//                         <div class="d-flex justify-content-between align-items-center">
//                             <p class="card-text mb-0"><strong>Goals:</strong> ${match.homeGoals} - ${match.awayGoals}</p>
//                             <button class="btn btn-primary btn-sm">View Details</button>
//                         </div>
//                     </div>
//                 </div>`;
//                 detailsDiv.innerHTML += cardHtml;
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching match details:', error);
//         });
// }


function loadMatchDetailsbyLeague(leagueName) {
    const url = `http://localhost:5000/league-matches-details?name=${encodeURIComponent(leagueName)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch match details');
            }
            return response.json();
        })
        .then(data => {
            const detailsDiv = leagueName === 'FIFA-18' ? document.getElementById('fifa18Details') : document.getElementById('fifa20Details');
            detailsDiv.innerHTML = '';

            data.forEach(match => {
                const formattedDate = new Date(match.date).toLocaleDateString('en-US');

                let homeFlag = match.homeTeamName;
                let awayFlag = match.awayTeamName;
                if (homeFlag === 'England' || homeFlag === 'Wales'){
                    homeFlag = 'UK';
                }
                if (awayFlag === 'England' || awayFlag === 'Wales'){
                    awayFlag = 'UK';
                }
                Promise.all([
                    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(homeFlag)}`).then(res => res.json()),
                    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(awayFlag)}`).then(res => res.json())
                ]).then(([homeTeamData, awayTeamData]) => {
                    const homeTeamFlag = homeTeamData[0]?.flags?.png || '';
                    const awayTeamFlag = awayTeamData[0]?.flags?.png || '';

                    const cardHtml = `
                    <div class="card mt-3 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="card-title mb-0 font-weight-bold">
                                    <img src="${homeTeamFlag}" alt="${match.homeTeamName} flag" style="width: 20px; height: 15px; margin-right: 10px;">
                                    ${match.homeTeamName} 
                                    <span class="text-muted">vs</span> 
                                    ${match.awayTeamName}
                                    <img src="${awayTeamFlag}" alt="${match.awayTeamName} flag" style="width: 20px; height: 15px; margin-left: 10px;">
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
                }).catch(error => {
                    console.error('Error fetching team flags:', error);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching match details:', error);
        });
}



// function loadMatchDetails(game) {
//     fetch(`http://localhost:5000/all-matches-details`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Failed to fetch match details');
//             }
//             return response.json();
//         })
//         .then(data => {
//             const detailsDiv = game === 'fifa18' ? document.getElementById('fifa18Details') : document.getElementById('fifa20Details');
//             detailsDiv.innerHTML = ''; 

//             const fetchFlags = data.map(match => {
//                 return Promise.all([
//                     fetch(`https://restcountries.com/v3.1/name/${match.homeTeamName}`).then(response => response.json()),
//                     fetch(`https://restcountries.com/v3.1/name/${match.awayTeamName}`).then(response => response.json())
//                 ]).then(([teamAData, teamBData]) => {
//                     match.flagA = teamAData[0].flags.png;
//                     match.flagB = teamBData[0].flags.png;
//                     return match;
//                 });
//             });

//             Promise.all(fetchFlags).then(matches => {
//                 matches.forEach(match => {
//                     const cardHtml = `
//                         <div class="card mt-3">
//                           <div class="card-body">
//                             <h5 class="card-title">${match.homeTeamName} 
//                               <img src="${match.flagA}" alt="${match.homeTeamName} Flag" width="30"> 
//                               vs 
//                               <img src="${match.flagB}" alt="${match.awayTeamName} Flag" width="30"> 
//                               ${match.awayTeamName}
//                             </h5>
//                             <p class="card-text">Date: ${match.date}</p>
//                             <p class="card-text">Goals: ${match.homeGoals} - ${match.awayGoals}</p>
//                           </div>
//                         </div>`;
//                     detailsDiv.innerHTML += cardHtml;
//                 });
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching match details:', error);
//         });
// }
