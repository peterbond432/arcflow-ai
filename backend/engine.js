function runAgent(state) {
  if (!state) {
    console.log("State missing — creating default");
    state = {
      wallet: 100,
      memory: {
        safeBias: 0.5,
        gamblePenalty: 1,
        gambleCount: 0,
        foodCount: 0,
        lastActions: []
      },
      history: []
    };
  }

  if (!state.memory) {
    state.memory = {
      safeBias: 0.5,
      gamblePenalty: 1,
      gambleCount: 0,
      foodCount: 0,
      lastActions: []
    };
  }

  const memory = state.memory;

  // AI decision
  let decision = Math.random() < memory.safeBias ? "food" : "gamble";

  let amount = decision === "food" ? 0.002 : 0.01;
  let risk = decision === "food" ? 10 : 60;

  state.wallet -= amount;

  const tx = {
    id: Date.now(),
    type: "spend",
    amount,
    walletAfter: state.wallet,
    reason: decision,
    risk,
    timestamp: Date.now()
  };

  state.history.push(tx);

  // learning
  memory.lastActions.push(decision);
  if (memory.lastActions.length > 10) memory.lastActions.shift();

  if (decision === "gamble") {
    memory.gambleCount++;
    memory.safeBias -= 0.02;
  } else {
    memory.foodCount++;
    memory.safeBias += 0.02;
  }

  // clamp values
  memory.safeBias = Math.max(0.1, Math.min(0.9, memory.safeBias));

  return state;
}

module.exports = { runAgent };
