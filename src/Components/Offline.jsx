// Offline.jsx
import React from 'react';
import logo from '../Images/GoanInstitute.png';  // Correct your logo path
import './CSS/Offline.css';

function Offline() {
  return (
    <div className="offline-container">
      <img src={logo} alt="Goan Institute Logo" className="offline-logo" />
      <h1>Oops! You are Offline</h1>
      <p>It seems you have lost your internet connection.</p>
      <p>Please check your connection and try again.</p>
      <button
        className="offline-button"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
}

export default Offline;
