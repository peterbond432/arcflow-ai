# 🚀 Arc Hello dApp

A full-stack Web3 dApp built on Arc Testnet (Chain ID 5042002) using Foundry + ethers.js.

---

## 🧠 What this project does

This dApp allows users to:
- Connect wallet (MetaMask / Rabby)
- Read a message from a smart contract
- Update the message on-chain using Arc network

It demonstrates a full Web3 workflow:
Frontend ↔ Wallet ↔ Smart Contract ↔ Arc Testnet

---

## 🛠 Tech Stack

- Solidity (Foundry)
- Arc Testnet (Chain ID 5042002)
- ethers.js v6
- HTML / CSS / JavaScript
- MetaMask / Rabby Wallet

---

## 📍 Smart Contract

Deployed Contract:
0x80baff4f3741f16ea1691d6c7d2738e6f294ea0e

Functions:
- `message()` → read stored message
- `setMessage(string)` → update message on-chain

---

## 🌐 Frontend

Run locally:

```bash
cd frontend
python3 -m http.server 3000
