import React from 'react';
import { useState } from 'react';
import '../styles/styles.css'; // Import your CSS file

function TopTeams() {
  // State to store search input
  const [searchTerm, setSearchTerm] = useState('');

  // Function to handle search button click
  const searchTeams = () => {
    // Logic to handle search
    console.log('Search teams:', searchTerm);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand" href="#">Soccor Sphere</a>
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
        <input type="text" id="teamSearchBox" placeholder="Search Teams" className="form-control" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={searchTeams} className="btn btn-primary mt-2">Search</button>
        <div id="teamResults" className="teams-container"></div>
        <h1>Top 10 Teams</h1>
        <div id="teamsContainer" className="teams-container"> 
          {/* Teams will be added dynamically... */}
        </div>
      </div>

      <div className="container-fluid footer">
        <div className="row footer-content">
          <p className="footer-text">&copy; 2024 | Soccor Sphere. All rights reserved</p>
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

export default TopTeams;
