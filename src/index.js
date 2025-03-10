require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const { ethers } = require("ethers");

// Import routes
const transactionRoutes = require("./api/routes/transactionRoutes");
const rugPullRoutes = require("./api/routes/rugPullRoutes");
const walletDrainerRoutes = require("./api/routes/walletDrainerRoutes");
const alertRoutes = require("./api/routes/alertRoutes");
const notificationRoutes = require("./api/routes/notificationRoutes");
const vulnerabilityScannerRoutes = require("./api/vulnerabilityScanner");

// Import services
const blockchainMonitor = require("./utils/blockchainMonitor");
const aiAnalyzer = require("./utils/aiAnalyzer");
const telegramBotHandler = require("./utils/telegramBotHandler");
const VulnerabilityScanner = require("./utils/vulnerabilityScanner");

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

// Socket.IO CORS settings
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  },
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API key middleware
const apiKeyMiddleware = (req, res, next) => {
  // Temporarily disable API key check for testing
  return next();

  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API key" });
  }

  next();
};

// Routes
app.use("/api/transactions", apiKeyMiddleware, transactionRoutes);
app.use("/api/rugpull", apiKeyMiddleware, rugPullRoutes);
app.use("/api/walletdrainer", apiKeyMiddleware, walletDrainerRoutes);
app.use("/api/alerts", apiKeyMiddleware, alertRoutes);
app.use("/api/notifications", apiKeyMiddleware, notificationRoutes);
app.use(
  "/api/vulnerability-scanner",
  apiKeyMiddleware,
  vulnerabilityScannerRoutes
);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Root route for testing
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Chain Shield AI API is running",
    version: "1.0.0",
    mongodbConnected: mongoose.connection.readyState === 1,
  });
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("subscribe", (data) => {
    console.log("Client subscribed to alerts", data);
    socket.join("alerts");
  });

  socket.on("subscribe-vulnerability-scanner", () => {
    console.log("Client subscribed to vulnerability scanner");
    socket.join("vulnerability-scanner");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Export socket.io instance for use in other modules
app.set("io", io);

// Initialize vulnerability scanner with socket.io for real-time updates
const initializeVulnerabilityScanner = async () => {
  try {
    // Use Sonic testnet RPC URL from environment variables
    const provider = process.env.SONIC_TESTNET_RPC_URL;
    if (!provider) {
      throw new Error("SONIC_TESTNET_RPC_URL not set in environment variables");
    }

    const scanner = new VulnerabilityScanner(provider);
    await scanner.initialize();

    scanner.startRealTimeScanning((data) => {
      io.to("vulnerability-scanner").emit("vulnerability-update", data);
    });

    console.log("Vulnerability scanner initialized with Sonic testnet");
  } catch (error) {
    console.error("Failed to initialize scanner:", error);
  }
};

// Function to start the server
const startServer = () => {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Start blockchain monitoring
    const provider = new ethers.JsonRpcProvider(process.env.SONIC_RPC_URL);
    blockchainMonitor.startMonitoring(provider, app);

    // Initialize AI analyzer
    aiAnalyzer.initialize();

    // Start Telegram bot
    if (process.env.TELEGRAM_BOT_TOKEN) {
      telegramBotHandler.startBot();
      console.log("Telegram bot started");
    } else {
      console.log("Telegram bot not started (TELEGRAM_BOT_TOKEN not set)");
    }

    // Initialize vulnerability scanner
    initializeVulnerabilityScanner();
  });
};

// Check if we should skip MongoDB connection (for development)
const skipMongo = process.env.SKIP_MONGODB === "true";

if (skipMongo) {
  console.log(
    "⚠️ WARNING: Running without MongoDB connection. Some features will be limited."
  );
  startServer();
} else {
  // Connect to MongoDB
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
      startServer();
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      console.log(
        "⚠️ WARNING: Failed to connect to MongoDB. Starting server with limited functionality."
      );
      startServer();
    });
}
