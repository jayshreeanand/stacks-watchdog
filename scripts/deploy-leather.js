const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { StacksTestnet, StacksMainnet } = require('@stacks/network');
require('dotenv').config();

// Determine network based on environment
const isTestnet = process.env.NETWORK_CHAIN_ID === '2147483648';
const network = isTestnet ? new StacksTestnet() : new StacksMainnet();
console.log(`Using network: ${isTestnet ? 'Testnet' : 'Mainnet'}`);

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

// Create HTML file for deployment
const createDeploymentHTML = () => {
  const contracts = [
    {
      name: 'transaction-monitor',
      path: '../contracts/transaction-monitor.clar'
    },
    {
      name: 'rug-pull-detector',
      path: '../contracts/rug-pull-detector.clar'
    },
    {
      name: 'wallet-drainer-detector',
      path: '../contracts/wallet-drainer-detector.clar'
    },
    {
      name: 'stacks-watchdog-registry',
      path: '../contracts/stacks-watchdog-registry.clar'
    }
  ];

  const contractsJson = JSON.stringify(contracts);
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stacks Watchdog - Deploy Contracts</title>
  <script src="https://unpkg.com/@stacks/connect"></script>
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
    .contract {
      margin-bottom: 15px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .contract-name {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .status {
      margin-top: 10px;
      padding: 10px;
      border-radius: 4px;
    }
    .success {
      background-color: #d4edda;
      color: #155724;
    }
    .error {
      background-color: #f8d7da;
      color: #721c24;
    }
    .pending {
      background-color: #fff3cd;
      color: #856404;
    }
    #connect-button {
      display: block;
      margin: 20px auto;
      padding: 12px 24px;
    }
    #wallet-info {
      text-align: center;
      margin-bottom: 20px;
    }
    #deploy-all {
      display: none;
      margin: 20px auto;
    }
    #deployment-results {
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Stacks Watchdog - Deploy Contracts</h1>
    
    <div id="wallet-info">
      <p>Connect your Leather wallet to deploy contracts</p>
      <button id="connect-button">Connect Wallet</button>
      <div id="connected-address"></div>
    </div>
    
    <button id="deploy-all">Deploy All Contracts</button>
    
    <div id="deployment-results"></div>
  </div>

  <script>
    // Store contracts data
    const contracts = ${contractsJson};
    let userAddress = null;
    let deploymentResults = {};
    
    // Connect to Leather wallet
    document.getElementById('connect-button').addEventListener('click', async () => {
      const appDetails = {
        name: 'Stacks Watchdog',
        icon: window.location.origin + '/logo.svg',
      };
      
      const network = '${isTestnet ? 'testnet' : 'mainnet'}';
      
      window.StacksProvider.connect({
        appDetails,
        network,
        onFinish: (data) => {
          userAddress = data.addresses[network];
          document.getElementById('connected-address').innerHTML = \`<p>Connected: <strong>\${userAddress}</strong></p>\`;
          document.getElementById('deploy-all').style.display = 'block';
        },
        onCancel: () => {
          alert('Wallet connection was cancelled');
        }
      });
    });
    
    // Deploy all contracts
    document.getElementById('deploy-all').addEventListener('click', async () => {
      const resultsDiv = document.getElementById('deployment-results');
      resultsDiv.innerHTML = '';
      
      // Deploy contracts sequentially
      for (const contract of contracts) {
        const contractDiv = document.createElement('div');
        contractDiv.className = 'contract';
        contractDiv.innerHTML = \`
          <div class="contract-name">\${contract.name}</div>
          <div class="status pending">Deploying...</div>
        \`;
        resultsDiv.appendChild(contractDiv);
        
        try {
          // Fetch contract code
          const response = await fetch(\`/api/contract-code?path=\${encodeURIComponent(contract.path)}\`);
          const data = await response.json();
          
          if (!data.success) {
            throw new Error(data.error);
          }
          
          const codeBody = data.code;
          
          // Deploy contract using Leather wallet
          await new Promise((resolve, reject) => {
            window.StacksProvider.deployContract({
              contractName: contract.name,
              codeBody,
              network: '${isTestnet ? 'testnet' : 'mainnet'}',
              anchorMode: 'any',
              onFinish: (data) => {
                contractDiv.querySelector('.status').className = 'status success';
                contractDiv.querySelector('.status').textContent = \`Deployed! Tx ID: \${data.txId}\`;
                deploymentResults[contract.name] = data.txId;
                resolve(data);
              },
              onCancel: () => {
                contractDiv.querySelector('.status').className = 'status error';
                contractDiv.querySelector('.status').textContent = 'Deployment cancelled';
                reject(new Error('Deployment cancelled'));
              }
            });
          });
          
          // Save deployment results
          await fetch('/api/save-deployment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(deploymentResults)
          });
          
        } catch (error) {
          contractDiv.querySelector('.status').className = 'status error';
          contractDiv.querySelector('.status').textContent = \`Error: \${error.message}\`;
          console.error('Deployment error:', error);
        }
      }
    });
  </script>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(publicDir, 'index.html'), html);
  console.log('Deployment HTML file created');
};

// Create a placeholder logo
const createLogo = () => {
  // This is just a placeholder. You should replace this with your actual logo.
  const logoPath = path.join(publicDir, 'logo.svg');
  if (!fs.existsSync(logoPath)) {
    // Copy a placeholder logo or create one
    console.log('Logo file found at: ' + logoPath);
  }
};

// API endpoint to get contract code
app.get('/api/contract-code', (req, res) => {
  try {
    const contractPath = req.query.path;
    const fullPath = path.join(__dirname, contractPath);
    
    // Validate path to prevent directory traversal
    if (!fullPath.startsWith(path.join(__dirname, '../contracts'))) {
      return res.status(400).json({ success: false, error: 'Invalid contract path' });
    }
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, error: 'Contract file not found' });
    }
    
    const code = fs.readFileSync(fullPath, 'utf8');
    res.json({ success: true, code });
  } catch (error) {
    console.error('Error reading contract code:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to save deployment results
app.post('/api/save-deployment', (req, res) => {
  try {
    const deploymentInfo = req.body;
    const filename = isTestnet ? 'deployment-info-testnet.json' : 'deployment-info.json';
    fs.writeFileSync(path.join(__dirname, '..', filename), JSON.stringify(deploymentInfo, null, 2));
    console.log(`Deployment info saved to ${filename}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving deployment info:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create necessary files
createDeploymentHTML();
createLogo();

// Start server
app.listen(PORT, () => {
  console.log(`
========================================================
  Stacks Watchdog Deployment Server
========================================================
  
  Server running at http://localhost:${PORT}
  
  1. Open the URL in your browser
  2. Connect your Leather wallet
  3. Deploy the contracts
  
  Press Ctrl+C to stop the server
========================================================
`);
}); 