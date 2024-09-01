import React from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = () => {
  return (
    <div className="overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingOverlay;
