// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const hre = require("hardhat");



async function main() {

  if (!hre.ethers) {
    throw new Error("Ethers not properly initialized!");
  }

  console.log("Deploying Sonic Shield contracts...");
  console.log(`Network: ${hre.network.name} (Chain RPC: ${hre.network.config.url}) (Chain ID: ${hre.network.config.chainId})`);

  // Get the contract factories
  const TransactionMonitor = await hre.ethers.getContractFactory("TransactionMonitor");
  const RugPullDetector = await hre.ethers.getContractFactory("RugPullDetector");
  const WalletDrainerDetector = await hre.ethers.getContractFactory("WalletDrainerDetector");
  const SWatchdogRegistry = await hre.ethers.getContractFactory("SWatchdogRegistry");

  // Deploy TransactionMonitor with a large transaction threshold of 1000 S (adjust as needed)
  // 1000 S with 18 decimals
  const largeTransactionThreshold = hre.ethers.parseEther("1000");
  const transactionMonitor = await TransactionMonitor.deploy(largeTransactionThreshold);
  await transactionMonitor.waitForDeployment();
  console.log(`TransactionMonitor deployed to: ${await transactionMonitor.getAddress()}`);

  // Deploy RugPullDetector with a rug pull threshold of 70 (out of 100)
  const rugPullThreshold = 70;
  const rugPullDetector = await RugPullDetector.deploy(rugPullThreshold);
  await rugPullDetector.waitForDeployment();
  console.log(`RugPullDetector deployed to: ${await rugPullDetector.getAddress()}`);

  // Deploy WalletDrainerDetector
  const walletDrainerDetector = await WalletDrainerDetector.deploy();
  await walletDrainerDetector.waitForDeployment();
  console.log(`WalletDrainerDetector deployed to: ${await walletDrainerDetector.getAddress()}`);

  // Deploy SWatchdogRegistry with references to the other contracts
  const registry = await SWatchdogRegistry.deploy(
    await transactionMonitor.getAddress(),
    await rugPullDetector.getAddress(),
    await walletDrainerDetector.getAddress()
  );
  await registry.waitForDeployment();
  console.log(`SWatchdogRegistry deployed to: ${await registry.getAddress()}`);

  console.log("Deployment complete!");

  // Write deployment addresses to a file for the backend to use
  const fs = require("fs");
  const deploymentInfo = {
    transactionMonitor: await transactionMonitor.getAddress(),
    rugPullDetector: await rugPullDetector.getAddress(),
    walletDrainerDetector: await walletDrainerDetector.getAddress(),
    registry: await registry.getAddress(),
    chainId: hre.network.config.chainId,
    network: hre.network.name
  };

  // Determine filename based on network
  const isTestnet = hre.network.name === 'sonic_testnet';
  const filename = isTestnet ? 'deployment-info-testnet.json' : 'deployment-info.json';

  fs.writeFileSync(
    filename,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`Deployment info saved to ${filename}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 