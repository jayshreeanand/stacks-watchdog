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
    TransactionVersion,
    StacksNetwork,
    createStacksPublicKey,
    getPublicKey,
    privateKeyToString,
    ClarityVersion
} = require('@stacks/transactions');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const bip39 = require('bip39');

// Determine network based on environment
const isTestnet = process.env.NETWORK_CHAIN_ID === '2147483648';
const network = isTestnet ? new StacksTestnet({
    url: 'https://api.testnet.hiro.so',
    networkId: 2147483648,
    chainId: 2147483648,
    coreApiUrl: 'https://api.testnet.hiro.so',
    broadcastApiUrl: 'https://api.testnet.hiro.so/v2/transactions',
    accountApiUrl: 'https://api.testnet.hiro.so/v2/accounts'
}) : new StacksMainnet();

const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;
const senderAddress = process.env.SENDER_ADDRESS;

if (!privateKey || !publicKey || !senderAddress) {
    throw new Error('PRIVATE_KEY, PUBLIC_KEY, and SENDER_ADDRESS must be set in .env file');
}

// Log the key details for debugging
console.log('Key details:', {
    privateKeyLength: privateKey.length,
    publicKeyLength: publicKey.length,
    privateKeyFirstChars: privateKey.substring(0, 10) + '...',
    publicKeyFirstChars: publicKey.substring(0, 10) + '...'
});

// Validate key formats
if (privateKey.length !== 66) {
    throw new Error(`Invalid private key length: ${privateKey.length}. Expected 66 characters`);
}

if (publicKey.length !== 66) {
    throw new Error(`Invalid public key length: ${publicKey.length}. Expected 66 characters`);
}

console.log('Deploying with address:', senderAddress);
console.log('Using network:', network.coreApiUrl);

function hexToDecimal(hex) {
    return parseInt(hex, 16);
}

async function getBlockHeight() {
    try {
        const response = await fetch(`${network.coreApiUrl}/v2/info`);
        const data = await response.json();
        console.log('Chain info:', data);
        return data.stacks_tip_height;
    } catch (error) {
        console.error('Error fetching block height:', error);
        return null;
    }
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
        const locked = hexToDecimal(data.locked);
        const available = balance - locked;
        console.log(`Balance in STX: ${balance / 1000000}`);
        console.log(`Locked in STX: ${locked / 1000000}`);
        console.log(`Available in STX: ${available / 1000000}`);
        return available;
    } catch (error) {
        console.error('Error fetching balance:', error);
        return null;
    }
}

async function checkPendingTransactions() {
    try {
        const response = await fetch(`${network.coreApiUrl}/v2/mempool/transactions`);
        const data = await response.json();
        console.log('Pending transactions:', data);
        return data;
    } catch (error) {
        console.error('Error fetching pending transactions:', error);
        return null;
    }
}

async function getNetworkFee() {
    // Use a higher fee to ensure transaction goes through
    return 5000; // 0.005 STX
}

async function createWalletFromMnemonic(mnemonic) {
    if (!mnemonic) {
        throw new Error('MNEMONIC is required in .env file');
    }
    const seed = await bip39.mnemonicToSeed(mnemonic);
    // Take only the first 32 bytes of the seed
    const privateKeyBuffer = seed.slice(0, 32);
    const privateKey = createStacksPrivateKey(privateKeyBuffer.toString('hex'));
    const address = getAddressFromPrivateKey(privateKey.data);
    
    console.log('Wallet created with address:', address);
    return {
        address,
        privateKey: privateKey.data
    };
}

async function deployContract(contractName, contractPath, nonce) {
    try {
        const contractContent = fs.readFileSync(contractPath, 'utf8');
        
        // Get the private key
        const privateKeyString = process.env.PRIVATE_KEY;
        
        // Log the private key format for debugging (without revealing the actual key)
        console.log('Private key format:', {
            length: privateKeyString.length,
            firstChars: privateKeyString.substring(0, 2) + '...',
            lastChars: '...' + privateKeyString.substring(privateKeyString.length - 2)
        });
        
        // Try to handle the 66-character private key
        // If it's 66 characters, we'll try to use it directly
        const fee = BigInt(5500);

        const txOptions = {
            contractName,
            codeBody: contractContent,
            senderKey: privateKeyString,
            network,
            postConditionMode: PostConditionMode.Deny,
            postConditions: [],
            fee,
            nonce: BigInt(nonce),
            sponsored: false,
            clarityVersion: ClarityVersion.Clarity2,
            anchorMode: AnchorMode.Any,
            version: TransactionVersion.Testnet,
            senderAddress: process.env.SENDER_ADDRESS
        };

        console.log(`Deploying ${contractName} with fee ${fee} microSTX and nonce ${nonce}`);
        console.log('Sender address:', process.env.SENDER_ADDRESS);
        
        const transaction = await makeContractDeploy(txOptions);

        console.log('Transaction details:', {
            fee: transaction.auth?.spendingCondition?.fee?.toString(),
            nonce: transaction.auth?.spendingCondition?.nonce?.toString(),
            sender: transaction.auth?.spendingCondition?.senderAddress,
            contractName
        });

        const result = await broadcastTransaction(transaction, network);
        console.log('Broadcast result:', result);
        return result;
    } catch (error) {
        console.error('Deployment error:', error);
        throw error;
    }
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

// Export the deployment function
module.exports = {
    deployContract
};
