const fs = require("fs");

const DB_FILE = "./backend/db.json";

// -------------------- DB --------------------

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const init = {
      wallet: 100,
      history: [],
      memory: {
        safeBias: 0,
        gamblePenalty: 0,
        lastActions: [],
        agentStats: {
          safe: 0,
          risk: 0,
          balance: 0
        }
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

// -------------------- AGENTS --------------------

function safeAgent(db) {
  return {
    name: "safe",
    action: "food",
    cost: 0.002,
    risk: 10,
    score: 0.7 + db.memory.safeBias
  };
}

function riskAgent(db) {
  return {
    name: "risk",
    action: "gamble",
    cost: 0.01,
    risk: 60,
    score: 0.5 - db.memory.gamblePenalty + Math.random() * 0.3
  };
}

function balanceAgent(db) {
  const action = Math.random() > 0.5 ? "food" : "gamble";

  return {
    name: "balance",
    action,
    cost: action === "food" ? 0.002 : 0.01,
    risk: action === "food" ? 10 : 60,
    score: 0.6 - Math.abs(db.memory.safeBias - db.memory.gamblePenalty)
  };
}

// -------------------- CORE ENGINE --------------------

function runAgent() {
  const db = loadDB();

  const agents = [
    safeAgent(db),
    riskAgent(db),
    balanceAgent(db)
  ];

  // SMART SELECTION (no pure randomness)
  const chosen = agents.reduce((best, curr) =>
    curr.score > best.score ? curr : best
  );

  if (db.wallet < chosen.cost) {
    return {
      success: false,
      error: "Insufficient funds",
      wallet: db.wallet
    };
  }

  // update wallet
  db.wallet = +(db.wallet - chosen.cost).toFixed(3);

  // MEMORY LEARNING
  if (chosen.action === "food") {
    db.memory.safeBias += 0.05;
  } else {
    db.memory.gamblePenalty += 0.08;
  }

  // clamp memory values
  db.memory.safeBias = Math.min(db.memory.safeBias, 1);
  db.memory.gamblePenalty = Math.min(db.memory.gamblePenalty, 1);

  // history tracking
  db.memory.lastActions.unshift(chosen.action);
  db.memory.lastActions = db.memory.lastActions.slice(0, 10);

  // agent stats
  db.memory.agentStats[chosen.name]++;

  const tx = {
    id: Date.now(),
    agent: chosen.name,
    type: "spend",
    amount: chosen.cost,
    walletAfter: db.wallet,
    reason: chosen.action,
    risk: chosen.risk,
    score: chosen.score,
    timestamp: Date.now()
  };

  db.history.push(tx);
  saveDB(db);

  return {
    success: true,
    tx,
    wallet: db.wallet,
    memory: db.memory,
    chosenAgent: chosen.name
  };
}

// -------------------- STATE --------------------

function getState() {
  return loadDB();
}

module.exports = { runAgent, getState };
