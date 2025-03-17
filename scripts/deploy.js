// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const hre = require("hardhat");
const { StacksTestnetDevnet, StacksMainnet } = require('@stacks/network');
const { StacksWallet } = require('@stacks/wallet-sdk');
const { makeContractDeploy } = require('@stacks/transactions');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Determine network based on environment
const isTestnet = process.env.NETWORK_CHAIN_ID === '2147483648';
const network = isTestnet ? new StacksTestnetDevnet() : new StacksMainnet();

const senderKey = process.env.PRIVATE_KEY;
const senderAddress = process.env.SENDER_ADDRESS;

if (!senderKey || !senderAddress) {
    throw new Error('PRIVATE_KEY and SENDER_ADDRESS must be set in .env file');
}

async function deployContract(contractName, contractPath) {
    const contractContent = fs.readFileSync(contractPath, 'utf8');
    
    const transaction = await makeContractDeploy({
        contractName,
        contractContent,
        senderAddress,
        senderKey,
        network,
        fee: 1000000,
        nonce: 0,
    });

    console.log(`Deploying ${contractName} to ${isTestnet ? 'testnet' : 'mainnet'}...`);
    const result = await network.broadcastTransaction(transaction);
    console.log(`Deployment result for ${contractName}:`, result);
    return result;
}

async function deployAll() {
    try {
        // Deploy contracts in order
        const contracts = [
            {
                name: 'transaction-monitor',
                path: path.join(__dirname, '../contracts/transaction-monitor.clar')
            },
            {
                name: 'rug-pull-detector',
                path: path.join(__dirname, '../contracts/rug-pull-detector.clar')
            },
            {
                name: 'wallet-drainer-detector',
                path: path.join(__dirname, '../contracts/wallet-drainer-detector.clar')
            },
            {
                name: 'stacks-watchdog-registry',
                path: path.join(__dirname, '../contracts/stacks-watchdog-registry.clar')
            }
        ];

        const deploymentInfo = {};

        for (const contract of contracts) {
            const result = await deployContract(contract.name, contract.path);
            deploymentInfo[contract.name] = result.contractAddress;
        }

        // Save deployment info
        const filename = isTestnet ? 'deployment-info-testnet.json' : 'deployment-info.json';
        fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
        console.log(`Deployment info saved to ${filename}`);

        console.log('All contracts deployed successfully!');
    } catch (error) {
        console.error('Deployment failed:', error);
        process.exit(1);
    }
}

// Run deployment
deployAll();
