/**
 * Test script to verify connection to Electroneum network
 * Usage: node scripts/test-connection.js
 */

require('dotenv').config();
const { ethers } = require('ethers');

async function main() {
  try {
    console.log('Testing connection to Electroneum network...');
    
    // Create provider
    const provider = new ethers.JsonRpcProvider(process.env.ELECTRONEUM_RPC_URL);
    
    // Get network information
    const network = await provider.getNetwork();
    console.log(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Check if we're on testnet
    // Convert BigInt to Number for comparison
    const chainId = Number(network.chainId);
    const isTestnet = chainId === 1991;
    console.log(`Running on ${isTestnet ? 'testnet' : 'mainnet'}`);
    
    // Get latest block
    const blockNumber = await provider.getBlockNumber();
    console.log(`Latest block number: ${blockNumber}`);
    
    // Get block details
    const block = await provider.getBlock(blockNumber);
    console.log(`Latest block timestamp: ${new Date(Number(block.timestamp) * 1000).toLocaleString()}`);
    console.log(`Transactions in latest block: ${block.transactions.length}`);
    
    // Get gas price
    const gasPrice = await provider.getFeeData();
    console.log(`Current gas price: ${ethers.formatUnits(gasPrice.gasPrice, 'gwei')} gwei`);
    
    // Try to load deployment info
    try {
      const fs = require('fs');
      const path = require('path');
      const deploymentFileName = isTestnet ? 'deployment-info-testnet.json' : 'deployment-info.json';
      
      const deploymentInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '../' + deploymentFileName)));
      console.log(`\nDeployment info loaded for ${isTestnet ? 'testnet' : 'mainnet'}:`);
      console.log(`- Registry: ${deploymentInfo.registry}`);
      console.log(`- TransactionMonitor: ${deploymentInfo.transactionMonitor}`);
      console.log(`- RugPullDetector: ${deploymentInfo.rugPullDetector}`);
      console.log(`- WalletDrainerDetector: ${deploymentInfo.walletDrainerDetector}`);
      
      // Check if contracts are deployed
      const code = await provider.getCode(deploymentInfo.registry);
      if (code === '0x') {
        console.log('\nWARNING: Registry contract not deployed at the specified address');
      } else {
        console.log('\nRegistry contract is deployed and accessible');
      }
    } catch (error) {
      console.error(`\nError loading deployment info: ${error.message}`);
      console.log('You may need to deploy the contracts first');
    }
    
    console.log('\nConnection test completed successfully');
  } catch (error) {
    console.error(`Error testing connection: ${error.message}`);
    process.exit(1);
  }
}

main(); 