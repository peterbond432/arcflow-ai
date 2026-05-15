let provider;
let signer;
let contract;

// 🔥 CHANGE THESE
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
const ABI = [
  // Minimal ABI example — replace with your real ABI
  "function message() view returns (string)",
  "function setMessage(string _msg)"
];

// ---------------- CONNECT WALLET ----------------
async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();

    contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI,
      signer
    );

    document.getElementById("status").innerText =
      "Wallet Connected: " + await signer.getAddress();

  } catch (err) {
    console.log(err);
    alert("Wallet connection failed");
  }
}

// ---------------- READ MESSAGE ----------------
async function readMessage() {
  try {
    const msg = await contract.message();

    document.getElementById("status").innerText =
      "Message: " + msg;

  } catch (err) {
    console.log(err);
    alert("Error reading message");
  }
}

// ---------------- SET MESSAGE ----------------
async function setMessage() {
  try {
    const newMsg = document.getElementById("inputMessage").value;

    const tx = await contract.setMessage(newMsg);

    document.getElementById("status").innerText =
      "Tx sent: " + tx.hash;

    await tx.wait();

    document.getElementById("status").innerText =
      "Message updated: " + newMsg;

  } catch (err) {
    console.log(err);
    alert("Transaction failed");
  }
}

// ---------------- AUTO CHECK WALLET ----------------
async function checkWallet() {
  if (window.ethereum) {
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length > 0) {
      document.getElementById("status").innerText =
        "Wallet already connected: " + accounts[0];
    }
  }
}

checkWallet();
