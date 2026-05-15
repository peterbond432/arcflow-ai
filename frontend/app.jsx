import { useEffect, useState } from "react";

const API = "https://arcflow-ai-1.onrender.com";

export default function App() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH STATE ----------------
  const fetchState = async () => {
    try {
      const res = await fetch(`${API}/state`);
      const data = await res.json();
      setState(data);
    } catch (err) {
      console.log("API error:", err);
    }
  };

  // ---------------- RUN AGENT ----------------
  const runAgent = async () => {
    setLoading(true);

    try {
      await fetch(`${API}/run`, { method: "POST" });
      await fetchState();
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // ---------------- RUN MULTI AGENT ----------------
  const runMulti = async () => {
    setLoading(true);

    try {
      await fetch(`${API}/run-multi`, { method: "POST" });
      await fetchState();
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!state) {
    return (
      <div style={styles.loading}>
        ⚡ Booting ArcFlow AI...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>🚀 ArcFlow AI Dashboard</h1>

        {/* BUTTONS */}
        <div style={styles.row}>
          <button style={styles.btn} onClick={runAgent}>
            ▶ Run Agent
          </button>

          <button style={styles.btn2} onClick={runMulti}>
            ⚡ Run 5x Agents
          </button>
        </div>

        {loading && <p style={styles.thinking}>🤖 AI Thinking...</p>}

        {/* STATS */}
        <div style={styles.card}>
          <p>💰 Wallet: ${state.wallet}</p>
          <p>🧠 Safe Bias: {state.memory.safeBias.toFixed(2)}</p>
          <p>⚠ Gamble Count: {state.memory.gambleCount}</p>
        </div>

        {/* TRANSACTIONS */}
        <h3>📊 Transactions</h3>
        <div style={styles.list}>
          {state.history.slice(-10).reverse().map((t, i) => (
            <div key={i} style={styles.item}>
              {t.action} - ${t.amount} (risk {t.risk})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- STYLES ----------------
const styles = {
  page: {
    background: "#0b0f19",
    color: "white",
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Arial",
  },
  container: {
    maxWidth: 800,
    margin: "auto",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
  },
  row: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
  },
  btn: {
    padding: 10,
    background: "#22c55e",
    border: "none",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
  },
  btn2: {
    padding: 10,
    background: "#3b82f6",
    border: "none",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
  },
  thinking: {
    color: "#facc15",
  },
  card: {
    background: "#111827",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  list: {
    background: "#0f172a",
    padding: 10,
    borderRadius: 10,
  },
  item: {
    padding: 5,
    borderBottom: "1px solid #1f2937",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: 20,
  },
};
