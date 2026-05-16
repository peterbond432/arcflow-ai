const express = require("express");
const cors = require("cors");
const { run } = require("./engine");

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 STATE ENDPOINT
app.get("/state", (req, res) => {
  const data = require("./db.json");
  res.json(data);
});

// ⚡ RUN SYSTEM (MAIN ENGINE)
app.post("/run", (req, res) => {
  const result = run();
  res.json(result);
});

// 📊 METRICS (GRANT DASHBOARD)
app.get("/metrics", (req, res) => {
  const data = require("./db.json");

  const wins = data.agents.reduce((a, b) => a + b.memory.wins, 0);
  const losses = data.agents.reduce((a, b) => a + b.memory.losses, 0);

  res.json({
    wallet: data.wallet,
    winRate: wins / (wins + losses || 1),
    agents: data.agents.length,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 ArcFlow GRANT V2 running on " + PORT);
});
