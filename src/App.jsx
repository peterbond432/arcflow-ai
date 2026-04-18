import { useState } from "react";
import { ethers } from "ethers";

function App() {
  const [account, setAccount] = useState("");
  const [status, setStatus] = useState("Not connected");
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");

  let provider;
  let signer;

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();
    const address = await signer.getAddress();

    setAccount(address);
    setStatus("Connected: " + address);
  }

  async function sendPayment() {
    try {
      if (!to || !amount) {
        alert("Enter address and amount");
        return;
      }

      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: to,
        value: ethers.parseEther(amount),
      });

      setStatus("Transaction sent: " + tx.hash);

      await tx.wait();

      setStatus("Payment successful ✅");
    } catch (err) {
      console.log(err);
      setStatus("Transaction failed ❌");
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🚀 Arc Pay dApp</h1>

      <button onClick={connectWallet}>Connect Wallet</button>

      <p>{status}</p>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Recipient address"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{ padding: "10px", width: "300px" }}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: "10px", width: "300px" }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={sendPayment}>Send Payment</button>
      </div>
    </div>
  );
}

export default App;