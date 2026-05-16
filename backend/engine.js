const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "db.json");

// 📦 Load DB
function loadDB() {
  if (!fs.existsSync(dbPath)) {
    return {
      wallet: 100,
      history: [],
      agents: [],
    };
  }
  return JSON.parse(fs.readFileSync(dbPath));
}

// 💾 Save DB
function saveDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// 🧠 INIT AGENTS
function initAgents(db) {
  if (!db.agents || db.agents.length === 0) {
    db.agents = Array.from({ length: 5 }).map((_, i) => ({
      id: i + 1,
      type: Math.random() > 0.5 ? "risky" : "safe",
      bias: Math.random(),
      profit: 0,
    }));
  }
}

// 🎯 DECISION ENGINE
function decide(agent) {
  const rand = Math.random();

  if (agent.type === "risky") {
    return rand + agent.bias > 0.6 ? "gamble" : "food";
  } else {
    return rand + agent.bias > 0.8 ? "gamble" : "food";
  }
}

// ⚙️ RUN ONE AGENT
function runAgent(agent, db) {
  const action = decide(agent);

  let amount = action === "gamble" ? 0.01 : 0.002;
  let risk = action === "gamble" ? 60 : 10;

  if (action === "gamble") {
    const win = Math.random() > 0.5;

    if (win) {
      db.wallet += amount;
      agent.profit += amount;
      agent.wins = (agent.wins || 0) + 1;
    } else {
      db.wallet -= amount;
      agent.profit -= amount;
      agent.losses = (agent.losses || 0) + 1;
    }
  } else {
    db.wallet -= amount;
    agent.profit -= amount;
  }

  db.history.push({
    agent: agent.id,
    action,
    amount,
    risk,
    time: Date.now(),
  });

  db.history = db.history.slice(-100);
}

// 🚀 MAIN RUN FUNCTION (THIS WAS MISSING!)
function run() {
  const db = loadDB();

  initAgents(db);

  db.agents.forEach((agent) => runAgent(agent, db));

  saveDB(db);

  return db;
}

// ✅ EXPORT (THIS FIXES YOUR ERROR)
module.exports = { run };
