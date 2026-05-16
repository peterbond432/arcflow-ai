const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./db.json";

// ---------------- INIT DB ----------------
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const init = {
      wallet: 100,
      history: [],
      memory: {
        safeBias: 0.5,
        gambleCount: 0,
        foodCount: 0
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

// ---------------- ROOT ROUTE ----------------
app.get("/", (req, res) => {
  res.send("🚀 ArcFlow AI Backend Running");
});

// ---------------- STATE ----------------
app.get("/state", (req, res) => {
  try {
    const db = loadDB();
    res.json(db);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- RUN AGENT ----------------
app.post("/run", (req, res) => {
  try {
    const db = loadDB();

    const rand = Math.random();
    let action, amount;

    if (rand < db.memory.safeBias) {
      action = "food";
      amount = 0.002;
      db.memory.foodCount++;
      db.memory.safeBias += 0.05;
    } else {
      action = "gamble";
      amount = 0.01;
      db.memory.gambleCount++;
      db.memory.safeBias -= 0.03;
    }

    db.wallet -= amount;

    db.history.push({
      action,
      amount,
      time: new Date().toISOString()
    });

    if (db.history.length > 20) db.history.shift();

    saveDB(db);

    res.json(db);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- RUN MULTI ----------------
app.post("/run-multi", (req, res) => {
  try {
    const db = loadDB();

    for (let i = 0; i < 5; i++) {
      const rand = Math.random();

      let action, amount;

      if (rand < db.memory.safeBias) {
        action = "food";
        amount = 0.002;
        db.memory.foodCount++;
        db.memory.safeBias += 0.02;
      } else {
        action = "gamble";
        amount = 0.01;
        db.memory.gambleCount++;
        db.memory.safeBias -= 0.02;
      }

      db.wallet -= amount;

      db.history.push({
        action,
        amount,
        time: new Date().toISOString()
      });
    }

    saveDB(db);

    res.json(db);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- START ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 ArcFlow backend running on port ${PORT}`);
});
