const Circle = require("@circle-fin/circle-sdk");

const circle = new Circle({
  apiKey: process.env.CIRCLE_API_KEY,
  baseUrl: "https://api-sandbox.circle.com",
});

// Create wallet
async function createWallet(userId) {
  return await circle.wallets.createWallet({
    idempotencyKey: Date.now().toString(),
    userId,
  });
}

// Get balances
async function getBalance(walletId) {
  return await circle.wallets.getWalletBalance({
    walletId,
  });
}

module.exports = { createWallet, getBalance };
