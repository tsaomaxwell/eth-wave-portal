import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
  }
  
  return (
    <div className="ripple">
      <div className="mainContainer">

        <div className="dataContainer">
          <div className="header">
          👋 Hi! 👋
          </div>

          <div className="bio">
          I'm Maxwell, what's up? Connect your Ethereum wallet and wave at me!
          </div>

          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
        </div>
      </div>
    </div>
  );
}