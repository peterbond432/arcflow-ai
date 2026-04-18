const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./db.json";

/* ================= DB ================= */
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const init = { wallet: 1.0, transactions: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2));
    return init;
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

/* ================= SIMPLE AGENT ================= */
function runAI() {
  const insights = [
    "Market is slightly bullish 📈",
    "Risk is moderate ⚖️",
    "Short-term volatility expected ⚡",
    "Strong momentum detected 🚀",
    "Neutral market conditions 🧊"
  ];

  return insights[Math.floor(Math.random() * insights.length)];
}

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.send("🚀 ArcFlow Backend Running");
});

app.post("/run-agent", (req, res) => {
  const cost = 0.002;

  const db = loadDB();

  if (db.wallet < cost) {
    return res.json({ error: "Insufficient wallet balance" });
  }

  const result = runAI();

  db.wallet -= cost;

  const tx = {
    id: db.transactions.length + 1,
    cost,
    result,
    walletAfter: db.wallet,
    timestamp: new Date().toISOString()
  };

  db.transactions.push(tx);
  saveDB(db);

  res.json({
    result,
    wallet: db.wallet,
    transaction: tx,
    totalTransactions: db.transactions.length
  });
});

app.get("/transactions", (req, res) => {
  const db = loadDB();
  res.json(db.transactions);
});

/* ================= START SERVER ================= */
app.listen(5000, () => {
  console.log("🚀 ArcFlow Agent running on port 5000");
});
