# ETN Watchdog Setup Guide

## Prerequisites

1. **Node.js (v16+)**

   - You're currently using Node.js v20.0.0, which is compatible

2. **MongoDB**

   - For macOS: `brew install mongodb-community`
   - For Ubuntu: `sudo apt install mongodb`
   - For Windows: Download and install from https://www.mongodb.com/try/download/community

3. **Electroneum Wallet**
   - You need a wallet with testnet ETN for contract deployment

## Setup Steps

1. **Install Dependencies**

   ```
   npm install
   ```

2. **Start MongoDB**

   - For macOS: `brew services start mongodb-community`
   - For Ubuntu: `sudo systemctl start mongodb`
   - For Windows: Start MongoDB service from Services

3. **Update Your .env File**

   - Edit the `.env` file and replace `your_wallet_private_key` with your actual private key
   - Make sure it's a 64-character hexadecimal string without the '0x' prefix
   - Example: `1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

4. **Compile Smart Contracts**

   ```
   npm run compile
   ```

5. **Deploy Smart Contracts to Testnet**

   ```
   npm run deploy:testnet
   ```

6. **Start the Application**

   ```
   npm start
   ```

7. **Access the Dashboard**
   - Open your browser and go to http://localhost:3000

## Troubleshooting

- **Compilation Errors**: Make sure you're using Node.js v16 or higher
- **Deployment Errors**: Ensure your private key is correct and you have enough testnet ETN
- **MongoDB Errors**: Verify MongoDB is running with `mongo --eval "db.version()"`
- **Connection Errors**: Check your RPC URL in the `.env` file

## Development Commands

- `npm run dev`: Start the application in development mode
- `npm test`: Run tests
- `npm run compile`: Compile smart contracts
- `npm run deploy`: Deploy to mainnet
- `npm run deploy:testnet`: Deploy to testnet
- `npm run test:connection`: Test connection to the blockchain
- `npm run switch:mainnet`: Switch to mainnet configuration
- `npm run switch:testnet`: Switch to testnet configuration
