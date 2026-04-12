const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("API is running");
});

/* REAL API ROUTE */
app.get("/api/message", (req, res) => {
  res.json({
    success: true,
    message: "Hello from backend API 🚀",
    time: new Date()
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});