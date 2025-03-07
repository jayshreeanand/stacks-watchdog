/**
 * Utility script to switch between Electroneum mainnet and testnet
 * Usage: node scripts/switch-network.js [mainnet|testnet]
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load current .env file
const envPath = path.join(__dirname, '../.env');
let envConfig = {};

try {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envConfig = dotenv.parse(envFile);
} catch (error) {
  console.error('Error loading .env file:', error);
  process.exit(1);
}

// Get network from command line argument
const network = process.argv[2]?.toLowerCase();

if (!network || (network !== 'mainnet' && network !== 'testnet')) {
  console.error('Please specify a valid network: mainnet or testnet');
  process.exit(1);
}

// Update configuration based on network
if (network === 'mainnet') {
  console.log('Switching to Electroneum Mainnet...');
  envConfig.ELECTRONEUM_RPC_URL = 'https://rpc.electroneum.com';
  envConfig.WEB3_PROVIDER_URL = 'https://rpc.electroneum.com';
  envConfig.NETWORK_CHAIN_ID = '1990';
} else {
  console.log('Switching to Electroneum Testnet...');
  envConfig.ELECTRONEUM_RPC_URL = 'https://testnet-rpc.electroneum.com';
  envConfig.WEB3_PROVIDER_URL = 'https://testnet-rpc.electroneum.com';
  envConfig.NETWORK_CHAIN_ID = '1991';
}

// Write updated configuration back to .env file
const envContent = Object.entries(envConfig)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

fs.writeFileSync(envPath, envContent);

console.log(`Successfully switched to Electroneum ${network === 'mainnet' ? 'Mainnet' : 'Testnet'}`);
console.log('Configuration updated:');
console.log(`- ELECTRONEUM_RPC_URL: ${envConfig.ELECTRONEUM_RPC_URL}`);
console.log(`- WEB3_PROVIDER_URL: ${envConfig.WEB3_PROVIDER_URL}`);
console.log(`- NETWORK_CHAIN_ID: ${envConfig.NETWORK_CHAIN_ID}`); 