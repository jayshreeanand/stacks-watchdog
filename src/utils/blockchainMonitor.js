const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const aiAnalyzer = require('./aiAnalyzer');
const alertService = require('../api/services/alertService');
const transactionService = require('../api/services/transactionService');
const rugPullService = require('../api/services/rugPullService');
const walletDrainerService = require('../api/services/walletDrainerService');

// Load contract ABIs
const registryABI = require('../../artifacts/contracts/ETNWatchdogRegistry.sol/ETNWatchdogRegistry.json').abi;
const transactionMonitorABI = require('../../artifacts/contracts/TransactionMonitor.sol/TransactionMonitor.json').abi;
const rugPullDetectorABI = require('../../artifacts/contracts/RugPullDetector.sol/RugPullDetector.json').abi;
const walletDrainerDetectorABI = require('../../artifacts/contracts/WalletDrainerDetector.sol/WalletDrainerDetector.json').abi;

// Load deployment info
let deploymentInfo;
try {
  // Check if we're on testnet
  const isTestnet = process.env.NETWORK_CHAIN_ID === '5201420';
  const deploymentFileName = isTestnet ? 'deployment-info-testnet.json' : 'deployment-info.json';
  
  deploymentInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '../../' + deploymentFileName)));
  console.log(`Loaded deployment info for ${isTestnet ? 'testnet' : 'mainnet'}`);
} catch (error) {
  console.error('Error loading deployment info:', error);
  // Use placeholder addresses if deployment info is not available
  deploymentInfo = {
    registry: process.env.REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000",
    transactionMonitor: process.env.TRANSACTION_MONITOR_ADDRESS || "0x0000000000000000000000000000000000000000",
    rugPullDetector: process.env.RUGPULL_DETECTOR_ADDRESS || "0x0000000000000000000000000000000000000000",
    walletDrainerDetector: process.env.WALLETDRAINER_DETECTOR_ADDRESS || "0x0000000000000000000000000000000000000000"
  };
  console.log('Using placeholder contract addresses. Please deploy contracts for full functionality.');
}

// Contract instances
let provider;
let registry;
let transactionMonitor;
let rugPullDetector;
let walletDrainerDetector;
let app;

// Initialize contracts
const initializeContracts = (_provider) => {
  provider = _provider;
  
  registry = new ethers.Contract(
    deploymentInfo.registry,
    registryABI,
    provider
  );
  
  transactionMonitor = new ethers.Contract(
    deploymentInfo.transactionMonitor,
    transactionMonitorABI,
    provider
  );
  
  rugPullDetector = new ethers.Contract(
    deploymentInfo.rugPullDetector,
    rugPullDetectorABI,
    provider
  );
  
  walletDrainerDetector = new ethers.Contract(
    deploymentInfo.walletDrainerDetector,
    walletDrainerDetectorABI,
    provider
  );
  
  console.log('Contracts initialized');
};

// Start monitoring blockchain
const startMonitoring = async (_provider, _app) => {
  provider = _provider;
  app = _app;
  
  try {
    initializeContracts(provider);
    
    // Get network information
    const network = await provider.getNetwork();
    console.log(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Check if we're on testnet
    // Convert BigInt to Number for comparison
    const chainId = Number(network.chainId);
    const isTestnet = chainId === 5201420;
    console.log(`Running on ${isTestnet ? 'testnet' : 'mainnet'}`);
    
    // Check if contracts are deployed with real addresses
    const isPlaceholder = deploymentInfo.registry === "0x0000000000000000000000000000000000000000";
    if (isPlaceholder) {
      console.log('WARNING: Using placeholder contract addresses. Some functionality will be limited.');
      console.log('To deploy contracts, run: npm run deploy:testnet');
      
      // Still listen for new blocks but don't process them
      provider.on('block', async (blockNumber) => {
        console.log(`New block: ${blockNumber} (not processing due to missing contract deployments)`);
      });
      
      console.log('Blockchain monitoring started in limited mode');
      return;
    }
    
    // Listen for new blocks
    provider.on('block', async (blockNumber) => {
      try {
        console.log(`New block: ${blockNumber}`);
        await processNewBlock(blockNumber);
      } catch (error) {
        console.error(`Error processing block ${blockNumber}:`, error);
      }
    });
    
    // Listen for contract events
    setupEventListeners();
    
    console.log('Blockchain monitoring started');
  } catch (error) {
    console.error('Error starting blockchain monitoring:', error);
  }
};

// Process new blocks
const processNewBlock = async (blockNumber) => {
  try {
    const block = await provider.getBlock(blockNumber, true);
    
    if (!block || !block.transactions) {
      console.log(`No transactions in block ${blockNumber}`);
      return;
    }
    
    console.log(`Processing ${block.transactions.length} transactions in block ${blockNumber}`);
    
    // Process each transaction
    for (const tx of block.transactions) {
      await analyzeTransaction(tx, blockNumber);
    }
  } catch (error) {
    console.error(`Error processing block ${blockNumber}:`, error);
  }
};

// Analyze a transaction for suspicious activity
const analyzeTransaction = async (tx, blockNumber) => {
  try {
    // Skip transactions with no recipient (contract creation)
    if (!tx.to) return;
    
    // Get transaction details
    const from = tx.from;
    const to = tx.to;
    const value = tx.value;
    
    // Check if transaction is suspicious using the contract
    const [isSuspicious, reason] = await transactionMonitor.isSuspiciousTransaction(from, to, value);
    
    if (isSuspicious) {
      console.log(`Suspicious transaction detected: ${tx.hash}`);
      console.log(`From: ${from}, To: ${to}, Value: ${ethers.formatEther(value)} ETN`);
      console.log(`Reason: ${reason}`);
      
      // Save suspicious transaction to database
      await transactionService.saveSuspiciousTransaction({
        hash: tx.hash,
        from,
        to,
        value: ethers.formatEther(value),
        blockNumber,
        timestamp: Date.now(),
        reason
      });
      
      // Use AI to analyze the transaction further
      const aiAnalysis = await aiAnalyzer.analyzeTransaction(tx);
      
      // Create an alert if AI confirms it's suspicious
      if (aiAnalysis.isSuspicious) {
        const alertDetails = {
          type: 'suspicious_transaction',
          targetAddress: to,
          details: `${reason}. AI Analysis: ${aiAnalysis.reason}`,
          transactionHash: tx.hash
        };
        
        const alert = await alertService.createAlert(alertDetails);
        
        // Emit alert through socket.io
        const io = app.get('io');
        io.to('alerts').emit('newAlert', alert);
      }
    }
  } catch (error) {
    console.error(`Error analyzing transaction ${tx.hash}:`, error);
  }
};

// Set up event listeners for contract events
const setupEventListeners = () => {
  console.log('Setting up event polling (filters disabled on Electroneum RPC)');
  
  // Instead of using filters, we'll poll for events in each new block
  // This is a workaround for RPC providers that don't support eth_newFilter
  
  // Store the last processed block to avoid duplicate processing
  let lastProcessedBlock = 0;
  
  // Set up a polling interval to check for events
  const pollInterval = 30000; // 30 seconds
  
  const pollForEvents = async () => {
    try {
      // Get the latest block number
      const latestBlock = await provider.getBlockNumber();
      
      // Skip if we've already processed this block
      if (latestBlock <= lastProcessedBlock) {
        return;
      }
      
      console.log(`Polling for events from block ${lastProcessedBlock + 1} to ${latestBlock}`);
      
      // Define the block range to query
      const fromBlock = lastProcessedBlock + 1;
      const toBlock = latestBlock;
      
      try {
        // Query for SecurityAlertRaised events
        const securityAlertFilter = registry.filters.SecurityAlertRaised();
        const securityAlerts = await registry.queryFilter(securityAlertFilter, fromBlock, toBlock);
        
        for (const event of securityAlerts) {
          const [alertId, alertType, targetAddress, details, timestamp] = event.args;
          
          console.log(`Security alert raised: ${alertId}`);
          console.log(`Type: ${alertType}, Target: ${targetAddress}`);
          console.log(`Details: ${details}`);
          
          // Save alert to database
          const alert = await alertService.createAlert({
            alertId: alertId.toString(),
            type: alertType,
            targetAddress,
            details,
            timestamp: new Date(Number(timestamp) * 1000),
            transactionHash: event.transactionHash
          });
          
          // Emit alert through socket.io
          const io = app.get('io');
          io.to('alerts').emit('newAlert', alert);
        }
      } catch (error) {
        console.error('Error querying SecurityAlertRaised events:', error);
        // If queryFilter is not supported, we'll rely on block processing instead
      }
      
      try {
        // Query for SuspiciousTransactionDetected events
        const suspiciousTxFilter = transactionMonitor.filters.SuspiciousTransactionDetected();
        const suspiciousTxs = await transactionMonitor.queryFilter(suspiciousTxFilter, fromBlock, toBlock);
        
        for (const event of suspiciousTxs) {
          const [from, to, amount, timestamp, reason] = event.args;
          
          console.log(`Suspicious transaction detected by contract`);
          console.log(`From: ${from}, To: ${to}, Amount: ${ethers.formatEther(amount)} ETN`);
          console.log(`Reason: ${reason}`);
          
          // Save suspicious transaction to database
          await transactionService.saveSuspiciousTransaction({
            hash: event.transactionHash,
            from,
            to,
            value: ethers.formatEther(amount),
            blockNumber: event.blockNumber,
            timestamp: new Date(Number(timestamp) * 1000),
            reason
          });
        }
      } catch (error) {
        console.error('Error querying SuspiciousTransactionDetected events:', error);
        // If queryFilter is not supported, we'll rely on block processing instead
      }
      
      try {
        // Query for TokenAnalyzed events
        const tokenAnalyzedFilter = rugPullDetector.filters.TokenAnalyzed();
        const tokenAnalyzed = await rugPullDetector.queryFilter(tokenAnalyzedFilter, fromBlock, toBlock);
        
        for (const event of tokenAnalyzed) {
          const [tokenAddress, isPotentialRugPull, reasons] = event.args;
          
          console.log(`Token analyzed: ${tokenAddress}`);
          console.log(`Is potential rug pull: ${isPotentialRugPull}`);
          console.log(`Reasons: ${reasons.join(', ')}`);
          
          // Save token analysis to database
          await rugPullService.saveTokenAnalysis({
            tokenAddress,
            isPotentialRugPull,
            reasons,
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
            timestamp: Date.now()
          });
          
          // Create an alert if it's a potential rug pull
          if (isPotentialRugPull) {
            const alertDetails = {
              type: 'rug_pull',
              targetAddress: tokenAddress,
              details: `Potential rug pull detected. Risk factors: ${reasons.join(', ')}`,
              transactionHash: event.transactionHash
            };
            
            const alert = await alertService.createAlert(alertDetails);
            
            // Emit alert through socket.io
            const io = app.get('io');
            io.to('alerts').emit('newAlert', alert);
          }
        }
      } catch (error) {
        console.error('Error querying TokenAnalyzed events:', error);
        // If queryFilter is not supported, we'll rely on block processing instead
      }
      
      try {
        // Query for DrainerDetected events
        const drainerDetectedFilter = walletDrainerDetector.filters.DrainerDetected();
        const drainerDetected = await walletDrainerDetector.queryFilter(drainerDetectedFilter, fromBlock, toBlock);
        
        for (const event of drainerDetected) {
          const [drainerAddress, drainerType, timestamp] = event.args;
          
          console.log(`Wallet drainer detected: ${drainerAddress}`);
          console.log(`Type: ${drainerType}`);
          
          // Save drainer to database
          await walletDrainerService.saveDrainer({
            address: drainerAddress,
            type: drainerType,
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
            timestamp: new Date(Number(timestamp) * 1000)
          });
          
          // Create an alert
          const alertDetails = {
            type: 'wallet_drainer',
            targetAddress: drainerAddress,
            details: `Wallet drainer detected. Type: ${drainerType}`,
            transactionHash: event.transactionHash
          };
          
          const alert = await alertService.createAlert(alertDetails);
          
          // Emit alert through socket.io
          const io = app.get('io');
          io.to('alerts').emit('newAlert', alert);
        }
      } catch (error) {
        console.error('Error querying DrainerDetected events:', error);
        // If queryFilter is not supported, we'll rely on block processing instead
      }
      
      // Update the last processed block
      lastProcessedBlock = latestBlock;
      
      // Fallback: Process each block manually if event filtering is not working
      // This ensures we don't miss any transactions even if the RPC doesn't support filters
      for (let blockNum = fromBlock; blockNum <= toBlock; blockNum++) {
        try {
          const block = await provider.getBlock(blockNum, true);
          if (block && block.transactions) {
            console.log(`Fallback processing: Checking ${block.transactions.length} transactions in block ${blockNum}`);
            
            for (const tx of block.transactions) {
              // Process each transaction manually
              await analyzeTransaction(tx, blockNum);
              
              // Check if the transaction is interacting with our contracts
              if (tx.to === deploymentInfo.registry || 
                  tx.to === deploymentInfo.transactionMonitor || 
                  tx.to === deploymentInfo.rugPullDetector || 
                  tx.to === deploymentInfo.walletDrainerDetector) {
                console.log(`Transaction ${tx.hash} is interacting with our contracts`);
                
                // Get the transaction receipt to check for events
                const receipt = await provider.getTransactionReceipt(tx.hash);
                if (receipt && receipt.logs) {
                  console.log(`Found ${receipt.logs.length} logs in transaction ${tx.hash}`);
                  
                  // Process logs manually if needed
                  // This is a simplified approach - in a production environment,
                  // you would decode the logs based on contract ABIs
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error processing block ${blockNum} in fallback mode:`, error);
        }
      }
    } catch (error) {
      console.error('Error polling for events:', error);
    }
  };
  
  // Start polling
  pollForEvents();
  setInterval(pollForEvents, pollInterval);
  
  console.log(`Event polling started (interval: ${pollInterval}ms)`);
};

module.exports = {
  startMonitoring
}; 