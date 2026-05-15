function riskAgent(amount, reason, balance) {
  let risk = 0;

  const percent = balance > 0 ? (amount / balance) * 100 : 100;

  if (percent > 70) risk += 50;
  else if (percent > 40) risk += 30;

  const bad = ["gamble", "scam", "hack", "fraud"];
  if (bad.some(w => reason.toLowerCase().includes(w))) {
    risk += 50;
  }

  return {
    name: "riskAgent",
    approve: risk < 60,
    score: risk
  };
}

function budgetAgent(amount, balance) {
  const ratio = amount / balance;

  let score = 0;

  if (ratio > 0.8) score = 100;
  else if (ratio > 0.5) score = 60;
  else if (ratio > 0.3) score = 30;

  return {
    name: "budgetAgent",
    approve: score < 70,
    score
  };
}

function complianceAgent(reason) {
  const banned = ["gamble", "illegal", "fraud", "scam"];

  const hit = banned.some(w => reason.toLowerCase().includes(w));

  return {
    name: "complianceAgent",
    approve: !hit,
    score: hit ? 100 : 0
  };
}

// ---------------------------
// 🧠 STRONG GOVERNANCE ENGINE
// ---------------------------
function evaluate(amount, reason, balance) {
  const agents = [
    riskAgent(amount, reason, balance),
    budgetAgent(amount, balance),
    complianceAgent(reason)
  ];

  const approvals = agents.filter(a => a.approve).length;

  const riskScore =
    agents.reduce((sum, a) => sum + a.score, 0) / agents.length;

  // 🚨 HARD RULES (IMPORTANT FIX)
  const complianceBlocked = !agents[2].approve;
  const highRiskBlocked = riskScore >= 70;

  const approve =
    approvals >= 2 && !complianceBlocked && !highRiskBlocked;

  return {
    approve,
    riskScore: Math.round(riskScore),
    confidence: Math.round((approvals / agents.length) * 100),
    breakdown: agents
  };
}

module.exports = { evaluate };
