class Agent {
  constructor(name) {
    this.name = name;
    this.balance = 0;
    this.history = [];
  }

  deposit(amount) {
    this.balance += amount;
    this.history.push(`Deposited ${amount}`);
    return this.balance;
  }

  spend(amount, reason = "unknown") {
    if (amount > this.balance) {
      throw new Error("Insufficient balance");
    }

    this.balance -= amount;
    this.history.push(`Spent ${amount} for ${reason}`);
    return this.balance;
  }

  status() {
    return {
      name: this.name,
      balance: this.balance,
      history: this.history,
    };
  }
}

module.exports = new Agent("USDC-Agent");
