// client/src/components/LoadingSpinner.js
import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...', fullPage = false }) => {
    return (
      <div className={`loading-container ${fullPage ? 'full-page' : ''}`}>
        <div className="loading-spinner"></div>
        <p className="loading-message">{message}</p>
      </div>
    );
  };

export default LoadingSpinner;