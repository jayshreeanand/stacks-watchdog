const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Create a simple HTML file for deployment
const createSimpleHTML = () => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stacks Watchdog - Simple Deploy</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    h1 {
      color: #5546FF;
      text-align: center;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    button {
      background-color: #5546FF;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin: 10px 0;
    }
    button:hover {
      background-color: #4035CC;
    }
    .instructions {
      margin: 20px 0;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 4px;
      line-height: 1.5;
    }
    code {
      background-color: #eee;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: monospace;
    }
    .step {
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Stacks Watchdog - Simple Deploy</h1>
    
    <div class="instructions">
      <h2>Instructions for Deploying with Leather Wallet</h2>
      
      <div class="step">
        <strong>Step 1:</strong> Install the <a href="https://leather.io/install-extension" target="_blank">Leather Wallet browser extension</a> if you haven't already.
      </div>
      
      <div class="step">
        <strong>Step 2:</strong> Make sure you have STX tokens in your wallet. For testnet, you can get tokens from the <a href="https://explorer.stacks.co/sandbox/faucet?chain=testnet" target="_blank">Stacks Testnet Faucet</a>.
      </div>
      
      <div class="step">
        <strong>Step 3:</strong> Open the Stacks Explorer and connect your Leather wallet:
        <ul>
          <li><a href="https://explorer.stacks.co/sandbox/contract-call?chain=testnet" target="_blank">Testnet Explorer</a></li>
          <li><a href="https://explorer.stacks.co/sandbox/contract-call?chain=mainnet" target="_blank">Mainnet Explorer</a></li>
        </ul>
      </div>
      
      <div class="step">
        <strong>Step 4:</strong> Deploy each contract by:
        <ol>
          <li>Click "Write a new contract"</li>
          <li>Enter the contract name (e.g., "transaction-monitor")</li>
          <li>Paste the contract code from the files below</li>
          <li>Make sure to select Clarity 2 as the contract version</li>
          <li>Click "Deploy Contract"</li>
          <li>Approve the transaction in your Leather wallet</li>
        </ol>
      </div>
      
      <div class="step">
        <strong>Step 5:</strong> Deploy the contracts in this order:
        <ol>
          <li><a href="/contracts/transaction-monitor.clar" target="_blank">transaction-monitor.clar</a></li>
          <li><a href="/contracts/rug-pull-detector.clar" target="_blank">rug-pull-detector.clar</a></li>
          <li><a href="/contracts/wallet-drainer-detector.clar" target="_blank">wallet-drainer-detector.clar</a></li>
          <li><a href="/contracts/stacks-watchdog-registry.clar" target="_blank">stacks-watchdog-registry.clar</a></li>
        </ol>
      </div>
      
      <div class="step">
        <strong>Step 6:</strong> After deploying each contract, save the transaction ID for reference.
      </div>
    </div>
  </div>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(publicDir, 'simple.html'), html);
  console.log('Simple HTML file created');
};

// Copy contract files to public directory
const copyContractFiles = () => {
  const contractsDir = path.join(__dirname, '../contracts');
  const publicContractsDir = path.join(publicDir, 'contracts');
  
  if (!fs.existsSync(publicContractsDir)) {
    fs.mkdirSync(publicContractsDir);
  }
  
  const contracts = [
    'transaction-monitor.clar',
    'rug-pull-detector.clar',
    'wallet-drainer-detector.clar',
    'stacks-watchdog-registry.clar'
  ];
  
  contracts.forEach(contract => {
    const source = path.join(contractsDir, contract);
    const destination = path.join(publicContractsDir, contract);
    
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, destination);
      console.log(`Copied ${contract} to public directory`);
    } else {
      console.error(`Contract file not found: ${source}`);
    }
  });
};

// Create necessary files
createSimpleHTML();
copyContractFiles();

// Add a route for the simple page
app.get('/simple', (req, res) => {
  res.sendFile(path.join(publicDir, 'simple.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
========================================================
  Stacks Watchdog Simple Deployment Server
========================================================
  
  Server running at http://localhost:${PORT}/simple
  
  Follow the instructions on the page to deploy contracts
  using the Stacks Explorer and Leather wallet.
  
  Press Ctrl+C to stop the server
========================================================
`);
}); 