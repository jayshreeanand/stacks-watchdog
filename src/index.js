require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const { ethers } = require('ethers');

// Import routes
const transactionRoutes = require('./api/routes/transactionRoutes');
const rugPullRoutes = require('./api/routes/rugPullRoutes');
const walletDrainerRoutes = require('./api/routes/walletDrainerRoutes');
const alertRoutes = require('./api/routes/alertRoutes');

// Import services
const blockchainMonitor = require('./utils/blockchainMonitor');
const aiAnalyzer = require('./utils/aiAnalyzer');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API key middleware
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  
  next();
};

// Routes
app.use('/api/transactions', apiKeyMiddleware, transactionRoutes);
app.use('/api/rugpull', apiKeyMiddleware, rugPullRoutes);
app.use('/api/walletdrainer', apiKeyMiddleware, walletDrainerRoutes);
app.use('/api/alerts', apiKeyMiddleware, alertRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('subscribe', (data) => {
    console.log('Client subscribed to alerts', data);
    socket.join('alerts');
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Export socket.io instance for use in other modules
app.set('io', io);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      
      // Start blockchain monitoring
      const provider = new ethers.JsonRpcProvider(process.env.ELECTRONEUM_RPC_URL);
      blockchainMonitor.startMonitoring(provider, app);
      
      // Initialize AI analyzer
      aiAnalyzer.initialize();
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }); 