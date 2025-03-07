# ETN Watchdog: AI Security Bot for Electroneum Blockchain

ETN Watchdog is a decentralized application that provides real-time security monitoring for the Electroneum blockchain. It uses AI to detect suspicious transactions, wallet drainers, and potential rug-pull risks.

## Features

- **Real-time Transaction Monitoring**: Monitors Electroneum blockchain transactions in real-time
- **AI-Powered Analysis**: Uses machine learning to detect suspicious patterns
- **Rug-Pull Detection**: Identifies potential rug-pull risks by analyzing contract code and token movements
- **Wallet Drainer Detection**: Detects malicious contracts that may drain user wallets
- **Alert System**: Sends notifications through web interface and optional Telegram integration
- **Dashboard**: Visual representation of blockchain security status

## Architecture

- **Smart Contracts**: Solidity contracts deployed on Electroneum blockchain for on-chain monitoring
- **Backend API**: Node.js server with AI integration for transaction analysis
- **Frontend**: React-based dashboard for monitoring and alerts
- **Database**: MongoDB for storing historical data and analysis results

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB
- Electroneum wallet with ETN for contract deployment

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/etn-watchdog.git
   cd etn-watchdog
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```
   cp .env.example .env
   ```

   Then fill in your configuration details.

4. Compile smart contracts:

   ```
   npm run compile
   ```

5. Deploy smart contracts:

   ```
   npm run deploy
   ```

6. Start the application:
   ```
   npm start
   ```

## Running on Testnet

To run ETN Watchdog on the Electroneum testnet instead of mainnet, follow these steps:

1. Update your `.env` file to use testnet configuration:

   ```
   # Comment out mainnet URLs
   # ELECTRONEUM_RPC_URL=https://rpc.electroneum.com
   # WEB3_PROVIDER_URL=https://rpc.electroneum.com

   # Uncomment testnet URLs
   ELECTRONEUM_RPC_URL=https://testnet-rpc.electroneum.com
   WEB3_PROVIDER_URL=https://testnet-rpc.electroneum.com

   # Set chain ID to testnet
   NETWORK_CHAIN_ID=1991
   ```

2. Get testnet ETN from the Electroneum testnet faucet (if available) or request from the Electroneum team.

3. Deploy the contracts to testnet:

   ```
   npm run deploy:testnet
   ```

4. Start the application:
   ```
   npm start
   ```

The application will now connect to the Electroneum testnet instead of mainnet.

## Usage

1. Access the dashboard at `http://localhost:3000`
2. Connect your Electroneum wallet
3. Set up alert preferences
4. Monitor the dashboard for security alerts

## Development

- `npm run dev`: Start the application in development mode
- `npm test`: Run tests
- `npm run compile`: Compile smart contracts

## License

MIT

## Disclaimer

This tool is provided for informational purposes only. Always do your own research before making investment decisions on the Electroneum blockchain.
