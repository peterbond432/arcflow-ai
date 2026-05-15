const fs = require("fs");

const DB_FILE = "./db.json";

function load() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function deposit(amount) {
  const db = load();
  db.balance += amount;
  db.history.push({
    type: "deposit",
    amount,
    timestamp: Date.now(),
  });
  save(db);
  return db;
}

function spend(amount, reason, risk) {
  const db = load();

  db.balance -= amount;
  db.history.push({
    type: "spend",
    amount,
    reason,
    risk,
    timestamp: Date.now(),
  });

  save(db);
  return db;
}

module.exports = { deposit, spend, load };
