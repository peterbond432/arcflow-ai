const express = require("express");
const cors = require("cors");

const engine = require("./engine"); // IMPORTANT FIX

const app = express();

app.use(cors());
app.use(express.json());

// =====================
// STATE ROUTE
// =====================
app.get("/state", (req, res) => {
  try {
    res.json(engine.getState());
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// =====================
// RUN AGENT ROUTE
// =====================
app.post("/run-agent", (req, res) => {
  try {
    const result = engine.runAgent();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// =====================
// START SERVER
// =====================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 ArcFlow Live AI Dashboard running on port ${PORT}`);
});
