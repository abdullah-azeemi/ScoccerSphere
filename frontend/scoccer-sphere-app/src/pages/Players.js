import React, { useState, useEffect } from 'react';
import './Players.css';

const Players = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('http://localhost:5000/player'); // Update URL to backend port 5000
      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  return (
    <div className="players-container">
      <h1>Players</h1>
      <div className="player-list">
        {players.map((player) => (
          <div key={player.id} className="player-item">
            <h3>{player.name}</h3>
            <p>Position: {player.position}</p>
            <p>Goals: {player.goals}</p>
            <p>Assists: {player.assists}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Players;
