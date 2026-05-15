const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// =========================
// DB FILE
// =========================
const DB_FILE = "./db.json";

// =========================
// INIT DB IF NOT EXISTS
// =========================
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const init = {
      wallet: 100,
      history: [],
      memory: {
        gamblePenalty: 0,
        safeBias: 0,
        gambleCount: 0,
        foodCount: 0,
        lastActions: []
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2));
    return init;
  }

  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// =========================
// AGENT ENGINE (FIXED SAFE VERSION)
// =========================
function runAgent() {
  const db = loadDB();

  const actions = [
    { reason: "food", cost: 0.002, risk: 10 },
    { reason: "gamble", cost: 0.01, risk: 60 }
  ];

  const pick = actions[Math.floor(Math.random() * actions.length)];

  // prevent crash
  if (!db.wallet) db.wallet = 100;
  if (!db.memory) db.memory = {};

  if (db.wallet < pick.cost) {
    return {
      success: false,
      error: "Insufficient funds",
      wallet: db.wallet
    };
  }

  db.wallet = +(db.wallet - pick.cost).toFixed(3);

  // memory tracking (SAFE FIX)
  db.memory.safeBias = db.memory.safeBias || 0;
  db.memory.gamblePenalty = db.memory.gamblePenalty || 0;
  db.memory.lastActions = db.memory.lastActions || [];

  if (pick.reason === "food") db.memory.safeBias += 0.05;
  if (pick.reason === "gamble") db.memory.gamblePenalty += 0.1;

  db.memory.lastActions.unshift(pick.reason);
  db.memory.lastActions = db.memory.lastActions.slice(0, 10);

  const tx = {
    id: Date.now(),
    type: "spend",
    amount: pick.cost,
    walletAfter: db.wallet,
    reason: pick.reason,
    risk: pick.risk,
    timestamp: Date.now()
  };

  db.history.push(tx);
  saveDB(db);

  return {
    success: true,
    tx,
    wallet: db.wallet,
    memory: db.memory
  };
}

// =========================
// API ROUTES
// =========================

// health check
app.get("/", (req, res) => {
  res.json({ status: "ArcFlow backend running 🚀" });
});

// get state
app.get("/state", (req, res) => {
  const db = loadDB();
  res.json(db);
});

// run agent
app.post("/run-agent", (req, res) => {
  const result = runAgent();
  res.json(result);
});

// =========================
// START SERVER (RENDER SAFE)
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 ArcFlow backend running on port", PORT);
});
