import React from "react";
import logo from "../assets/logo.png"; // Path to your logo.png file
import "./StartUpAnimation.css"; // CSS file for styling

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      
      <div className="logo-container">
        <img src={logo} alt="Logo" className="startup-logo" />
      </div>
      <div className="text-container">
        <h1 className="loading-text">Ease It</h1>
        <footer className="startupFooter">
          <h2 className="loading-text">App By</h2>
          <h2 className="subtext">Anchal Deshmukh</h2>
        </footer>
      </div>
    </div>
  );
};

export default LoadingScreen;
