import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {
  const [currAccount, setCurrAccount]= React.useState("");
  const contractAddress = "0x09F9277e9019fa517788Ef6aEaF0C215eDD1068F"
  const contractABI = abi.abi

  const checkIfWalletIsConnected = () => {
    // check for ethereum access
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure metamask is enable!");
      return;
    }
    else {
      console.log("Ethereum object found", ethereum);
    }

    ethereum.request({ method: 'eth_accounts' })
    .then(accounts => {
      if(accounts.length !== 0) {
        const account = accounts[0];
        console.log("Authorized to use account: ", account);
        setCurrAccount(account);
      }
      else {
        console.log("No authorized account found");
      }
    })
  };

  const connectWallet = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get metamask(or equiv)");
    }

    ethereum.request({ method: "eth_requestAccounts"})
    .then(accounts => {
      console.log("Connected", accounts[0]);
      setCurrAccount(accounts[0]);
    })
    .catch(err => console.log(err));
  }

  React.useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const wave = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await wavePortalContract.getTotalWaves();
    console.log("Retrieved total wave count...", count.toNumber());
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

          {currAccount ? null : (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}