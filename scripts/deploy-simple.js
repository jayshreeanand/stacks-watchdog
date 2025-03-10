// A simplified deployment script that uses ethers directly
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

// Load contract artifacts
const TransactionMonitorArtifact = require('../artifacts/contracts/TransactionMonitor.sol/TransactionMonitor.json');
const RugPullDetectorArtifact = require('../artifacts/contracts/RugPullDetector.sol/RugPullDetector.json');
const WalletDrainerDetectorArtifact = require('../artifacts/contracts/WalletDrainerDetector.sol/WalletDrainerDetector.json');
const SWatchdogRegistryArtifact = require('../artifacts/contracts/SWatchdogRegistry.sol/SWatchdogRegistry.json');

async function main() {
  try {
    console.log("Deploying Sonic Shield contracts to testnet...");
    
    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.ELECTRONEUM_TESTNET_RPC_URL);
    const network = await provider.getNetwork();
    console.log(`Connected to network: Chain ID ${network.chainId}`);
    
    // Create wallet from private key
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Private key not found in .env file");
    }
    
    const wallet = new ethers.Wallet(privateKey, provider);
    const address = await wallet.getAddress();
    console.log(`Deploying from address: ${address}`);
    
    // Check balance
    const balance = await provider.getBalance(address);
    console.log(`Account balance: ${ethers.formatEther(balance)} S`);
    
    if (balance === 0n) {
      throw new Error("Account has no Sonic (S) token. Please fund your account before deploying.");
    }
    
    // Deploy TransactionMonitor
    console.log("Deploying TransactionMonitor...");
    const transactionMonitorFactory = new ethers.ContractFactory(
      TransactionMonitorArtifact.abi,
      TransactionMonitorArtifact.bytecode,
      wallet
    );
    
    const largeTransactionThreshold = ethers.parseEther("1000");
    const transactionMonitor = await transactionMonitorFactory.deploy(largeTransactionThreshold);
    await transactionMonitor.waitForDeployment();
    const transactionMonitorAddress = await transactionMonitor.getAddress();
    console.log(`TransactionMonitor deployed to: ${transactionMonitorAddress}`);
    
    // Deploy RugPullDetector
    console.log("Deploying RugPullDetector...");
    const rugPullDetectorFactory = new ethers.ContractFactory(
      RugPullDetectorArtifact.abi,
      RugPullDetectorArtifact.bytecode,
      wallet
    );
    
    const rugPullThreshold = 70;
    const rugPullDetector = await rugPullDetectorFactory.deploy(rugPullThreshold);
    await rugPullDetector.waitForDeployment();
    const rugPullDetectorAddress = await rugPullDetector.getAddress();
    console.log(`RugPullDetector deployed to: ${rugPullDetectorAddress}`);
    
    // Deploy WalletDrainerDetector
    console.log("Deploying WalletDrainerDetector...");
    const walletDrainerDetectorFactory = new ethers.ContractFactory(
      WalletDrainerDetectorArtifact.abi,
      WalletDrainerDetectorArtifact.bytecode,
      wallet
    );
    
    const walletDrainerDetector = await walletDrainerDetectorFactory.deploy();
    await walletDrainerDetector.waitForDeployment();
    const walletDrainerDetectorAddress = await walletDrainerDetector.getAddress();
    console.log(`WalletDrainerDetector deployed to: ${walletDrainerDetectorAddress}`);
    
    // Deploy SWatchdogRegistry
    console.log("Deploying SWatchdogRegistry...");
    const registryFactory = new ethers.ContractFactory(
      SWatchdogRegistryArtifact.abi,
      SWatchdogRegistryArtifact.bytecode,
      wallet
    );
    
    const registry = await registryFactory.deploy(
      transactionMonitorAddress,
      rugPullDetectorAddress,
      walletDrainerDetectorAddress
    );
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();
    console.log(`SWatchdogRegistry deployed to: ${registryAddress}`);
    
    console.log("Deployment complete!");
    
    // Save deployment info
    const deploymentInfo = {
      transactionMonitor: transactionMonitorAddress,
      rugPullDetector: rugPullDetectorAddress,
      walletDrainerDetector: walletDrainerDetectorAddress,
      registry: registryAddress,
      chainId: Number(network.chainId),
      network: "sonic_testnet"
    };
    
    fs.writeFileSync(
      "deployment-info-testnet.json",
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("Deployment info saved to deployment-info-testnet.json");
    
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main(); 