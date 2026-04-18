import { useEffect, useState } from "react";

function App() {
  const [wallet, setWallet] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH WALLET
  // =========================
  const fetchWallet = async () => {
    try {
      const res = await fetch("http://localhost:5000/wallet");
      const data = await res.json();
      setWallet(data.wallet);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // FETCH TRANSACTIONS
  // =========================
  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:5000/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // RUN AGENT
  // =========================
  const runAgent = async () => {
    setLoading(true);

    try {
      await fetch("http://localhost:5000/run-agent", {
        method: "POST",
      });

      await fetchWallet();
      await fetchTransactions();
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // =========================
  // AUTO REFRESH (LIVE MODE)
  // =========================
  useEffect(() => {
    fetchWallet();
    fetchTransactions();

    const interval = setInterval(() => {
      fetchWallet();
      fetchTransactions();
    }, 3000); // refresh every 3 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🚀 ArcFlow Agent Dashboard</h1>

      {/* WALLET */}
      <div style={{
        background: "#111",
        color: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        width: "fit-content"
      }}>
        <h2>💰 Wallet: ${wallet.toFixed(3)}</h2>
      </div>

      {/* BUTTON */}
      <button
        onClick={runAgent}
        disabled={loading}
        style={{
          padding: "10px 20px",
          marginBottom: 20,
          cursor: "pointer",
          background: loading ? "#999" : "#000",
          color: "#fff",
          border: "none",
          borderRadius: 8
        }}
      >
        {loading ? "Running Agent..." : "Run Agent ($0.002)"}
      </button>

      {/* TRANSACTIONS */}
      <h2>📊 Transaction History</h2>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cost</th>
            <th>Wallet After</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>${tx.cost}</td>
              <td>${tx.walletAfter}</td>
              <td>{new Date(tx.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;