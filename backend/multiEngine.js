const fs = require("fs");

function loadDB() {
  try {
    const db = JSON.parse(fs.readFileSync("db.json"));

    if (!db.agents) {
      db.agents = {
        A: { wallet: 100, memory: { risk: 0.1 } },
        B: { wallet: 100, memory: { risk: 0.5 } },
        C: { wallet: 100, memory: { risk: 0.3 } }
      };
    }

    if (!db.history) db.history = [];

    return db;
  } catch {
    return {
      agents: {
        A: { wallet: 100, memory: { risk: 0.1 } },
        B: { wallet: 100, memory: { risk: 0.5 } },
        C: { wallet: 100, memory: { risk: 0.3 } }
      },
      history: []
    };
  }
}

function saveDB(db) {
  fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
}

// 🧠 DECISION ENGINE
function decide(agent) {
  const chance = Math.random();

  if (agent.wallet > 120 && chance < agent.memory.risk) {
    return "gamble";
  }
  return "food";
}

function runAgentSystem() {
  const db = loadDB();

  const cost = 0.002;
  const results = [];

  for (const id of Object.keys(db.agents)) {
    const agent = db.agents[id];

    if (agent.wallet < cost) continue;

    const action = decide(agent);

    agent.wallet = Number((agent.wallet - cost).toFixed(3));

    if (action === "gamble") {
      agent.memory.risk = Math.min(1, agent.memory.risk + 0.05);
    } else {
      agent.memory.risk = Math.max(0, agent.memory.risk - 0.01);
    }

    const tx = {
      id: Date.now() + Math.random(),
      agent: id,
      action,
      cost,
      walletAfter: agent.wallet,
      timestamp: Date.now()
    };

    db.history.push(tx);
    results.push(tx);
  }

  saveDB(db);

  return {
    success: true,
    results,
    agents: db.agents
  };
}

module.exports = { runAgentSystem };
