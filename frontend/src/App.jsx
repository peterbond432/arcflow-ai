import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function App() {
  const [state, setState] = useState(null);

  const API = "http://localhost:5000";

  const fetchState = async () => {
    const res = await fetch(`${API}/state`);
    const data = await res.json();
    setState(data);
  };

  const runAgent = async () => {
    await fetch(`${API}/run-agent`, { method: "POST" });
    fetchState();
  };

  useEffect(() => {
    fetchState();
    const t = setInterval(fetchState, 2000);
    return () => clearInterval(t);
  }, []);

  if (!state) return <h2 style={{ color: "white" }}>Loading...</h2>;

  const chartData = state.history.map((t, i) => ({
    i,
    wallet: t.walletAfter
  }));

  return (
    <div style={styles.page}>
      <h1>🚀 ArcFlow AI Dashboard</h1>

      <button style={styles.btn} onClick={runAgent}>
        ▶ Run Agent
      </button>

      <div style={styles.row}>
        <div>💰 Wallet: ${state.wallet}</div>
        <div>🧠 Safe Bias: {state.memory.safeBias.toFixed(2)}</div>
        <div>⚠ Gamble: {state.memory.gamblePenalty.toFixed(2)}</div>
      </div>

      <div style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="wallet" stroke="#22c55e" />
            <XAxis dataKey="i" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3>📊 Transactions</h3>
      {state.history.slice(-10).map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={styles.tx}
        >
          {t.reason} - ${t.amount} (risk {t.risk})
        </motion.div>
      ))}
    </div>
  );
}

const styles = {
  page: {
    background: "#0b1220",
    color: "white",
    minHeight: "100vh",
    padding: 20
  },
  btn: {
    padding: 10,
    margin: "10px 0",
    background: "#22c55e",
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
  },
  row: {
    display: "flex",
    gap: 20,
    margin: "10px 0"
  },
  tx: {
    background: "#1e293b",
    padding: 8,
    marginTop: 5,
    borderRadius: 6
  }
};
