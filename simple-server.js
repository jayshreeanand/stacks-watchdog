// A simplified version of the Stacks Watchdog AI server for testing
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

// Create Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage
const alerts = [];
const transactions = [];
const tokens = [];
const drainers = [];

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Stacks Watchdog AI API is running (Simple Mode)",
    version: "1.0.0",
    mode: "in-memory",
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API routes
app.get("/api/alerts", (req, res) => {
  res.json(alerts);
});

app.post("/api/alerts", (req, res) => {
  const alert = {
    id: alerts.length + 1,
    ...req.body,
    timestamp: Date.now(),
    resolved: false,
  };
  alerts.push(alert);
  res.status(201).json(alert);
});

app.get("/api/transactions", (req, res) => {
  res.json(transactions);
});

app.post("/api/transactions", (req, res) => {
  const transaction = {
    id: transactions.length + 1,
    ...req.body,
    timestamp: Date.now(),
  };
  transactions.push(transaction);
  res.status(201).json(transaction);
});

app.get("/api/rugpull", (req, res) => {
  res.json(tokens);
});

app.post("/api/rugpull", (req, res) => {
  const token = {
    id: tokens.length + 1,
    ...req.body,
    timestamp: Date.now(),
  };
  tokens.push(token);
  res.status(201).json(token);
});

app.get("/api/walletdrainer", (req, res) => {
  res.json(drainers);
});

app.post("/api/walletdrainer", (req, res) => {
  const drainer = {
    id: drainers.length + 1,
    ...req.body,
    timestamp: Date.now(),
  };
  drainers.push(drainer);
  res.status(201).json(drainer);
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Simple Stacks Watchdog AI server running on port ${PORT}`);
  console.log("This is a simplified version for testing without MongoDB");
  console.log("Access the API at http://localhost:" + PORT);
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);
