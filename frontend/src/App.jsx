import { useEffect, useState } from "react";

const API = "https://arcflow-ai-1.onrender.com";

export default function App() {
  const [state, setState] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📊 fetch state
  const fetchState = async () => {
    try {
      const res = await fetch(`${API}/state`);
      const data = await res.json();
      setState(data);
    } catch (e) {
      console.log(e);
    }
  };

  // 📈 fetch metrics
  const fetchMetrics = async () => {
    try {
      const res = await fetch(`${API}/metrics`);
      const data = await res.json();
      setMetrics(data);
    } catch (e) {
      console.log(e);
    }
  };

  // ⚡ run system
  const runSystem = async () => {
    setLoading(true);
    try {
      await fetch(`${API}/run`, { method: "POST" });
      await fetchState();
      await fetchMetrics();
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  // 🔁 live updates
  useEffect(() => {
    fetchState();
    fetchMetrics();

    const t = setInterval(() => {
      fetchState();
      fetchMetrics();
    }, 2000);

    return () => clearInterval(t);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <h1 style={styles.title}>🚀 ArcFlow AI Pro Dashboard</h1>
        <p style={styles.sub}>
          Grant-ready AI Agent Economy System
        </p>

        {/* BUTTON */}
        <button style={styles.button} onClick={runSystem}>
          ⚡ Run AI Agents
        </button>

        {loading && <p style={styles.loading}>🧠 Processing agents...</p>}

        {/* METRICS CARDS */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>💰 Wallet</h3>
            <h2>${state?.wallet?.toFixed(3) || 0}</h2>
          </div>

          <div style={styles.card}>
            <h3>📊 Win Rate</h3>
            <h2>
              {(metrics?.winRate * 100 || 0).toFixed(1)}%
            </h2>
          </div>

          <div style={styles.card}>
            <h3>🧠 Agents</h3>
            <h2>{metrics?.agents || 0}</h2>
          </div>
        </div>

        {/* LIVE HISTORY */}
        <div style={styles.section}>
          <h2>⚡ Live Agent Activity</h2>

          <div style={styles.feed}>
            {state?.history?.slice(-12).reverse().map((h, i) => (
              <div key={i} style={styles.item}>
                🤖 Agent #{h.agent} → {h.action} | ${h.amount}
              </div>
            ))}
          </div>
        </div>

        {/* SIMPLE VISUAL GRAPH (REAL, NOT FAKE) */}
        <div style={styles.section}>
          <h2>📈 System Activity Graph</h2>

          <div style={styles.graph}>
            {state?.history?.slice(-20).map((h, i) => (
              <div
                key={i}
                style={{
                  ...styles.bar,
                  height: h.action === "gamble" ? 40 : 15,
                  background: h.action === "gamble" ? "#ef4444" : "#22c55e",
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  page: {
    background: "#0b0f19",
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
    fontSize: 30,
    marginBottom: 5,
  },
  sub: {
    color: "#9ca3af",
    marginBottom: 20,
  },
  button: {
    padding: 12,
    background: "#3b82f6",
    border: "none",
    color: "white",
    borderRadius: 10,
    cursor: "pointer",
    marginBottom: 20,
  },
  loading: {
    color: "#facc15",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 15,
  },
  card: {
    background: "#111827",
    padding: 15,
    borderRadius: 12,
    border: "1px solid #1f2937",
  },
  section: {
    marginTop: 30,
  },
  feed: {
    background: "#111827",
    padding: 10,
    borderRadius: 10,
  },
  item: {
    padding: 6,
    borderBottom: "1px solid #1f2937",
  },
  graph: {
    display: "flex",
    gap: 4,
    alignItems: "flex-end",
    height: 60,
    marginTop: 10,
  },
  bar: {
    width: 8,
    borderRadius: 4,
  },
};
