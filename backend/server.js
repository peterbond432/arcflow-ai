const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./db.json";

/* ---------------- DB ---------------- */
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const init = {
      wallet: 100,
      history: [],
      memory: {
        safeBias: 0,
        gamblePenalty: 0,
        lastActions: []
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2));
    return init;
  }

  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

/* ---------------- ENGINE ---------------- */
function runAgent() {
  const db = loadDB();

  const actions = [
    { reason: "food", cost: 0.002, risk: 10 },
    { reason: "gamble", cost: 0.01, risk: 60 }
  ];

  const pick = actions[Math.floor(Math.random() * actions.length)];

  if (db.wallet < pick.cost) {
    return { success: false, message: "Low balance" };
  }

  db.wallet = +(db.wallet - pick.cost).toFixed(3);

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

  return { success: true, tx };
}

/* ---------------- ROUTES ---------------- */
app.get("/state", (req, res) => {
  res.json(loadDB());
});

app.post("/run-agent", (req, res) => {
  res.json(runAgent());
});

/* ---------------- START ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 ArcFlow backend running on port", PORT);
});
