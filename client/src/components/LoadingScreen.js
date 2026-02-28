import React from 'react';
import './LoadingScreen.scss';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loader-content">
        <h1 className="loader-logo">
          La Toile <span>des Artisans</span>
        </h1>
        <div className="loader-bar"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;