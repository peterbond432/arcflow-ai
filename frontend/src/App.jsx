import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API = "https://arcflow-ai-1.onrender.com";

export default function App() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const fetchState = async () => {
    try {
      const res = await fetch(`${API}/state`);
      const data = await res.json();
      setState(data);
    } catch (e) {
      console.log(e);
    }
  };

  const runAgent = async () => {
    setLoading(true);
    await fetch(`${API}/run-agent`, { method: "POST" });

    setLogs((prev) => [
      { msg: "🤖 Agent executed decision...", time: Date.now() },
      ...prev.slice(0, 8),
    ]);

    setLoading(false);
    fetchState();
  };

  const runMultiAgent = async () => {
    setLoading(true);

    for (let i = 0; i < 5; i++) {
      await fetch(`${API}/run-agent`, { method: "POST" });

      setLogs((prev) => [
        { msg: `⚡ Agent batch ${i + 1} executed`, time: Date.now() },
        ...prev.slice(0, 8),
      ]);
    }

    setLoading(false);
    fetchState();
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 1500);
    return () => clearInterval(interval);
  }, []);

  if (!state) {
    return <div style={styles.loading}>⚡ Booting ArcFlow AI...</div>;
  }

  const chartData = (state.history || []).slice(-12).map((t, i) => ({
    name: i,
    risk: t.risk,
    wallet: state.wallet - i * 0.1,
  }));

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>🚀 ArcFlow AI V3 Ultra</h1>

        {/* BUTTONS */}
        <div style={styles.buttonRow}>
          <button style={styles.button} onClick={runAgent}>
            ▶ Run Agent
          </button>

          <button style={styles.buttonAlt} onClick={runMultiAgent}>
            ⚡ Run 5x Agents
          </button>
        </div>

        {loading && <div style={styles.thinking}>🤖 AI Thinking...</div>}

        {/* CARDS */}
        <div style={styles.grid}>
          <Card label="💰 Wallet" value={`$${state.wallet}`} />
          <Card label="🧠 Safe Bias" value={state.memory.safeBias.toFixed(2)} />
          <Card label="⚠ Risk" value={state.memory.gamblePenalty.toFixed(2)} />
        </div>

        {/* CHART */}
        <div style={styles.chartBox}>
          <h3>📊 Live Intelligence Graph</h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line dataKey="risk" stroke="#ef4444" />
              <Line dataKey="wallet" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* LIVE FEED */}
        <div style={styles.panel}>
          <h3>⚡ Live Activity Feed</h3>
          {logs.map((l, i) => (
            <div key={i} style={styles.feed}>
              {l.msg}
            </div>
          ))}
        </div>

        {/* TRANSACTIONS */}
        <div style={styles.panel}>
          <h3>📦 Transactions</h3>
          {(state.history || [])
            .slice(-6)
            .reverse()
            .map((t, i) => (
              <div key={i} style={styles.tx}>
                {t.reason} — ${t.amount} (risk {t.risk})
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

/* COMPONENT */
function Card({ label, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardLabel}>{label}</div>
      <div style={styles.cardValue}>{value}</div>
    </div>
  );
}

/* STYLES */
const styles = {
  page: {
    background: "linear-gradient(to bottom, #020617, #020617, #020617)",
    color: "white",
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Arial",
  },
  container: {
    maxWidth: 1000,
    margin: "auto",
  },
  title: {
    fontSize: 32,
    marginBottom: 15,
  },
  buttonRow: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
  },
  button: {
    background: "#22c55e",
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
    color: "white",
    cursor: "pointer",
  },
  buttonAlt: {
    background: "#3b82f6",
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
    color: "white",
    cursor: "pointer",
  },
  thinking: {
    marginBottom: 10,
    color: "#facc15",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 15,
    marginBottom: 20,
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    padding: 20,
    borderRadius: 12,
  },
  cardLabel: {
    opacity: 0.7,
  },
  cardValue: {
    fontSize: 22,
  },
  chartBox: {
    background: "rgba(255,255,255,0.04)",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  panel: {
    background: "rgba(255,255,255,0.04)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  tx: {
    padding: 6,
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  feed: {
    padding: 6,
    color: "#38bdf8",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};
