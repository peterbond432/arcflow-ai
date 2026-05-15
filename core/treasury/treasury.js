let treasury = {
  balance: 0,
  reserve: 0,
  dailySpent: 0,
  lastReset: Date.now()
};

// 🔄 Reset daily spending every 24h
function resetDaily() {
  const now = Date.now();
  if (now - treasury.lastReset > 86400000) {
    treasury.dailySpent = 0;
    treasury.lastReset = now;
  }
}

// 💰 Deposit into treasury
function deposit(amount) {
  treasury.balance += amount;

  // 20% goes to reserve
  const reserveCut = amount * 0.2;
  treasury.reserve += reserveCut;

  return {
    balance: treasury.balance,
    reserve: treasury.reserve
  };
}

// 💸 Spend from treasury
function spend(amount) {
  resetDaily();

  if (amount > treasury.balance) {
    return { error: "Insufficient funds" };
  }

  // 🚨 RULE 1: Daily limit
  if (treasury.dailySpent + amount > treasury.balance * 0.5) {
    return { error: "Daily treasury limit exceeded" };
  }

  // 🚨 RULE 2: Protect reserve
  if (treasury.balance - amount < treasury.reserve) {
    return { error: "Cannot spend reserve funds" };
  }

  treasury.balance -= amount;
  treasury.dailySpent += amount;

  return {
    balance: treasury.balance,
    reserve: treasury.reserve,
    dailySpent: treasury.dailySpent
  };
}

// 📊 Treasury state
function getTreasury() {
  resetDaily();

  return {
    balance: treasury.balance,
    reserve: treasury.reserve,
    dailySpent: treasury.dailySpent
  };
}

module.exports = {
  deposit,
  spend,
  getTreasury
};
