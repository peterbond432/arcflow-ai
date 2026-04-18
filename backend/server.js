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

/* ================= AI ENGINE ================= */
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

/* ================= SIMULATED USDC PAYMENT ================= */
async function createUSDCCharge(amount) {
  return {
    id: "sim_" + Date.now(),
    status: "completed",
    amount,
    currency: "USD"
  };
}

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.send("🚀 ArcFlow Backend Running");
});

app.get("/test-env", (req, res) => {
  res.json({
    keyExists: !!process.env.CIRCLE_API_KEY,
    keyPreview: process.env.CIRCLE_API_KEY?.slice(0, 10)
  });
});

/* RUN AGENT */
app.post("/run-agent", async (req, res) => {
  const cost = 0.002;

  const db = loadDB();

  if (db.wallet < cost) {
    return res.json({ error: "Insufficient wallet balance" });
  }

  const payment = await createUSDCCharge(cost);
  const result = runAI();

  db.wallet -= cost;

  const tx = {
    id: db.transactions.length + 1,
    cost,
    paymentId: payment.id,
    status: payment.status,
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

/* TRANSACTIONS */
app.get("/transactions", (req, res) => {
  const db = loadDB();
  res.json(db.transactions);
});

/* START SERVER */
app.listen(5000, () => {
  console.log("🚀 ArcFlow USDC Agent running on port 5000");
});