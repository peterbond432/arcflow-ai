import { useEffect, useState } from "react";

export default function App() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/state")
      .then((res) => res.json())
      .then(setState);
  }, []);

  const runAgent = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:5000/run-agent", {
      method: "POST",
    });

    const data = await res.json();

    setState((prev) => ({
      ...prev,
      wallet: data.wallet,
      memory: data.memory,
      history: [data.tx, ...(prev?.history || [])],
    }));

    setTimeout(() => setLoading(false), 300);
  };

  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>⚡ ArcFlow</h2>

        <button style={styles.button} onClick={runAgent}>
          {loading ? "Running..." : "▶ Run Agent"}
        </button>

        <div style={styles.card}>
          <p>Wallet</p>
          <h2>${state?.wallet?.toFixed(3)}</h2>
        </div>

        <div style={styles.card}>
          <p>Safe Bias</p>
          <h3>{state?.memory?.safeBias?.toFixed(2)}</h3>
        </div>

        <div style={styles.card}>
          <p>Risk Level</p>
          <h3 style={{ color: "#ef4444" }}>
            {state?.memory?.gamblePenalty?.toFixed(2)}
          </h3>
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <h1>AI Economy Dashboard</h1>

        {/* MEMORY */}
        <div style={styles.panel}>
          <h3>🧠 Memory State</h3>
          <pre>{JSON.stringify(state?.memory, null, 2)}</pre>
        </div>

        {/* TRANSACTIONS */}
        <div style={styles.panel}>
          <h3>📊 Live Transactions</h3>

          {state?.history?.slice(0, 8).map((tx) => (
            <div style={styles.tx} key={tx.id}>
              <span
                style={{
                  color: tx.reason === "gamble" ? "#ef4444" : "#22c55e",
                }}
              >
                {tx.reason}
              </span>

              <span>${tx.amount}</span>
              <span style={{ opacity: 0.6 }}>risk {tx.risk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    height: "100vh",
    background: "#020617",
    color: "white",
    fontFamily: "sans-serif",
  },

  sidebar: {
    width: 260,
    padding: 20,
    background: "rgba(15,23,42,0.9)",
    backdropFilter: "blur(10px)",
  },

  logo: {
    color: "#38bdf8",
    marginBottom: 20,
  },

  button: {
    width: "100%",
    padding: 12,
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
    border: "none",
    borderRadius: 12,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
    cursor: "pointer",
  },

  card: {
    background: "#0f172a",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  main: {
    flex: 1,
    padding: 25,
  },

  panel: {
    background: "#0f172a",
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
  },

  tx: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    borderBottom: "1px solid #1e293b",
  },
};
