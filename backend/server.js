const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = "./backend/db.json";

// ------------------ LOAD DB ------------------
function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = {
      wallet: 100,
      history: [],
      memory: {
        safeBias: 0.5,
        gambleCount: 0,
        foodCount: 0,
        risk: 0
      }
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
  }

  return JSON.parse(fs.readFileSync(DB_PATH));
}

// ------------------ SAVE DB ------------------
function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ------------------ GET STATE ------------------
app.get("/state", (req, res) => {
  const db = loadDB();
  res.json(db);
});

// ------------------ RUN AGENT ------------------
app.post("/run", (req, res) => {
  const db = loadDB();

  const rand = Math.random();

  let action, amount, risk;

  if (rand < db.memory.safeBias) {
    action = "food";
    amount = 0.002;
    risk = 10;
    db.memory.foodCount++;
    db.memory.safeBias += 0.05;
  } else {
    action = "gamble";
    amount = 0.01;
    risk = 60;
    db.memory.gambleCount++;
    db.memory.safeBias -= 0.03;
  }

  // clamp safeBias between 0 and 1
  if (db.memory.safeBias > 1) db.memory.safeBias = 1;
  if (db.memory.safeBias < 0) db.memory.safeBias = 0;

  db.wallet -= amount;
  db.memory.risk += risk * 0.01;

  db.history.push({
    action,
    amount,
    risk,
    time: new Date().toISOString()
  });

  // keep last 20 transactions
  if (db.history.length > 20) {
    db.history.shift();
  }

  saveDB(db);

  res.json({
    success: true,
    state: db
  });
});

// ------------------ RUN MULTI AGENTS ------------------
app.post("/run-multi", (req, res) => {
  const db = loadDB();

  for (let i = 0; i < 5; i++) {
    const rand = Math.random();

    let action, amount, risk;

    if (rand < db.memory.safeBias) {
      action = "food";
      amount = 0.002;
      risk = 10;
      db.memory.foodCount++;
      db.memory.safeBias += 0.02;
    } else {
      action = "gamble";
      amount = 0.01;
      risk = 60;
      db.memory.gambleCount++;
      db.memory.safeBias -= 0.02;
    }

    if (db.memory.safeBias > 1) db.memory.safeBias = 1;
    if (db.memory.safeBias < 0) db.memory.safeBias = 0;

    db.wallet -= amount;
    db.memory.risk += risk * 0.01;

    db.history.push({
      action,
      amount,
      risk,
      time: new Date().toISOString()
    });

    if (db.history.length > 20) {
      db.history.shift();
    }
  }

  saveDB(db);

  res.json({
    success: true,
    state: db
  });
});

// ------------------ RESET ------------------
app.post("/reset", (req, res) => {
  const resetData = {
    wallet: 100,
    history: [],
    memory: {
      safeBias: 0.5,
      gambleCount: 0,
      foodCount: 0,
      risk: 0
    }
  };

  saveDB(resetData);

  res.json({ success: true, state: resetData });
});

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 ArcFlow backend running on port ${PORT}`);
});
