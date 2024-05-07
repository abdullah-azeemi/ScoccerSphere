import React from 'react';
import { useState } from 'react';
import '../public/styles.css'; 
import axios from 'axios'; 

function PlayerDetails() {
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState([]);

  const searchPlayers = async () => {
    try {
      const response = await axios.get(`https://localhost5000/players?search=${searchTerm}`);
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand" href="#">Soccer Sphere</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="nav navbar-nav ml-auto">
            <a className="nav-link" href="index.html">Home</a>
            <a className="nav-link" href="competition.html">Leagues & Competitions</a>
            <a className="nav-link" href="#">Matches</a>
            <a className="nav-link" href="login_signup.html">Login & Sign Up</a>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Players" className="form-control" />
        <button onClick={searchPlayers} className="btn btn-primary mt-2">Search</button>
        <div id="searchResults" className="players-container">
          {players.map((player) => (
            <div key={player.id}>{player.name}</div>
          ))}
        </div>
        <h1>Top 10 Players:</h1>
        <div id="playersContainer" className="players-container">
          {/* Players will be added dynamically... */}
        </div>
      </div>

      {/* Player Details Modal */}
      <div className="modal fade" id="playerDetailModal" tabIndex="-1" role="dialog" aria-labelledby="playerDetailModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="playerDetailModalLabel">Player Details</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" id="modalBody">
              {/* Additional details can be added here */}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid footer">
        <div className="row footer-content">
          <p className="footer-text">&copy; 2024 | Soccer Sphere. All rights reserved</p>
        </div>
        <div className="row footer-content">
          <div className="col">
            <i style={{ fontSize: '24px' }} className="fa">&#xf09a;</i>
          </div>
          <div className="col">
            <i style={{ fontSize: '24px' }} className="fa">&#xf08c;</i>
          </div>
          <div className="col">
            <i style={{ fontSize: '24px' }} className="fa" id="insta">&#xf16d;</i>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlayerDetails;
