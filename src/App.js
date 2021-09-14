import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";
import { TextField } from "@material-ui/core"

export default function App() {
  const [currAccount, setCurrAccount]= React.useState("");
  const [msg, setMsg] = React.useState("");
  const contractAddress = "0x78e8735b2137Fbb38D88eb512624B5bcD4E5e5C5"
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

    const waveTxn = await wavePortalContract.wave(msg, { gasLimit: 300000 });
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

    wavePortalContract.on("NewWave", (from, timestamp, message) => {
      setAllWaves(oldArray => [...oldArray, {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message
      }])
    })
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

          <div className = "textwrapper">
            <TextField
              id="messagebox"
              label="Enter your message to me!:"
              value={msg}
              variant="filled"
              color="secondary"
              onChange={(event) => setMsg(event.target.value)}
              fullWidth
            />
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
              <div className = "msgContainer">
                <div><b>My Guy:</b> {wave.address}</div>
                <div><b>Said:</b> {wave.message}</div>
                <div><b>At:</b> {wave.timestamp.toString()}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}