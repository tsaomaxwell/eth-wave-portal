import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {
  const [currAccount, setCurrAccount]= React.useState("");
  const contractAddress = "0xd051853455E30015eb4b9Db98E6af4f24eA30C77"
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
        getAllWaves();
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

    const waveTxn = await wavePortalContract.wave("dummy msg");
  }

  const [allWaves, setAllWaves] = React.useState([]);
  async function getAllWaves() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let waves = await wavePortalContract.getAllWaves();

    let wavesCleaned = []
    waves.forEach(wave => {
      wavesCleaned.push({
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message
      });
    });

    setAllWaves(wavesCleaned);
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
            <button className="connectButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}

          {allWaves.map((wave, index) => {
            return (
              <div style ={{backgroundColor: "OldLace", marginTop: "16px", padding: "8px"}}>
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message:{wave.message}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}