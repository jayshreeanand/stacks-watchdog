// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const { StacksTestnet, StacksMainnet } = require('@stacks/network');
const { 
    makeContractDeploy,
    AnchorMode,
    PostConditionMode,
    broadcastTransaction,
    standardPrincipalCV,
    bufferCV,
    uintCV,
    FungibleConditionCode,
    makeStandardSTXPostCondition,
    createStacksPrivateKey,
    getAddressFromPrivateKey,
    TransactionVersion
} = require('@stacks/transactions');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Determine network based on environment
const isTestnet = process.env.NETWORK_CHAIN_ID === '2147483648';
const network = isTestnet ? new StacksTestnet() : new StacksMainnet();

const privateKey = process.env.PRIVATE_KEY;
const senderAddress = process.env.SENDER_ADDRESS;

if (!privateKey || !senderAddress) {
    throw new Error('PRIVATE_KEY and SENDER_ADDRESS must be set in .env file');
}

console.log('Deploying with address:', senderAddress);

function hexToDecimal(hex) {
    return parseInt(hex, 16);
}

async function getAccountNonce(address) {
    try {
        const response = await fetch(`${network.getAccountApiUrl(address)}`);
        const data = await response.json();
        return data.nonce;
    } catch (error) {
        console.error('Error fetching nonce:', error);
        return null;
    }
}

async function checkBalance(address) {
    try {
        const response = await fetch(`${network.getAccountApiUrl(address)}`);
        const data = await response.json();
        console.log('Account data:', data);
        const balance = hexToDecimal(data.balance);
        console.log(`Balance in STX: ${balance / 1000000}`);
        return balance;
    } catch (error) {
        console.error('Error fetching balance:', error);
        return null;
    }
}

async function deployContract(contractName, contractPath, nonce) {
    const contractContent = fs.readFileSync(contractPath, 'utf8');
    
    // Check balance before deployment
    const balance = await checkBalance(senderAddress);
    if (!balance) {
        throw new Error('Could not fetch balance');
    }

    const requiredAmount = 10000; // 0.01 STX in microSTX
    if (balance < requiredAmount) {
        throw new Error(`Insufficient balance. Current balance: ${balance / 1000000} STX, Required: ${requiredAmount / 1000000} STX`);
    }

    console.log(`Deploying ${contractName} with ${balance / 1000000} STX available... (nonce: ${nonce})`);

    const transaction = await makeContractDeploy({
        codeBody: contractContent,
        contractName: contractName,
        senderKey: privateKey,
        network: network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        fee: requiredAmount,
        nonce: nonce,
        senderAddress: senderAddress,
        version: TransactionVersion.Testnet,
        memo: `Deploying ${contractName}`,
        sponsored: false,
        sponsoredAddress: undefined,
        sponsoredNonce: undefined,
        sponsoredFee: undefined,
        sponsoredMemo: undefined
    });

    console.log(`Broadcasting transaction for ${contractName}...`);
    const result = await broadcastTransaction(transaction, network);
    console.log(`Deployment result for ${contractName}:`, result);
    
    if (result.error) {
        throw new Error(`Failed to deploy ${contractName}: ${result.error} - ${result.reason}`);
    }
    
    return result;
}

async function deployAll() {
    try {
        // Check initial balance
        console.log('Checking initial balance...');
        const initialBalance = await checkBalance(senderAddress);
        if (!initialBalance) {
            throw new Error('Could not fetch initial balance');
        }
        console.log(`Initial balance: ${initialBalance / 1000000} STX`);

        // Get initial nonce
        const initialNonce = await getAccountNonce(senderAddress);
        if (initialNonce === null) {
            throw new Error('Could not fetch initial nonce');
        }
        console.log(`Initial nonce: ${initialNonce}`);

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
        let currentNonce = initialNonce;

        for (const contract of contracts) {
            const result = await deployContract(contract.name, contract.path, currentNonce);
            deploymentInfo[contract.name] = result.txId;
            currentNonce++;
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
