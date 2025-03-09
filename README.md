# ETN Watchdog: AI Security Bot for Electroneum Blockchain

ETN Watchdog is a comprehensive security monitoring platform for the Electroneum blockchain. It uses advanced AI algorithms to detect suspicious transactions, wallet drainers, potential rug-pulls, and other security threats in real-time.

![ETN Watchdog](https://via.placeholder.com/800x400?text=ETN+Watchdog+Dashboard)

## 🛡️ Key Features

### Core Security Features

- **Real-time Transaction Monitoring**: Continuously monitors Electroneum blockchain transactions to detect suspicious patterns and potential threats
- **AI-Powered Analysis**: Leverages machine learning algorithms to analyze contracts and transactions for security vulnerabilities
- **Rug-Pull Detection**: Identifies potential rug-pull risks by analyzing token contract code, liquidity patterns, and ownership structures
- **Wallet Drainer Detection**: Detects malicious contracts designed to drain user wallets through sophisticated techniques
- **Alert System**: Sends real-time notifications through multiple channels when potential threats are detected

### Advanced Security Tools

- **Security Scanner**: Comprehensive wallet security analysis tool that checks for vulnerabilities, suspicious approvals, and risky interactions
- **Token Approvals Manager**: View and manage all token spending permissions with risk indicators and one-click revocation
- **Contract Analysis**: Deep analysis of smart contract code to identify potential vulnerabilities before interaction
- **Phishing Detection**: Identifies potential phishing attempts targeting your wallet

### User Experience

- **Modern Dashboard**: Intuitive dashboard providing a comprehensive overview of your security status
- **Customizable Notifications**: Configure how and when you want to be alerted about security events
- **Multi-channel Alerts**: Receive notifications via email, browser, mobile app, or Telegram
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

## 📊 Dashboard Sections

### Main Dashboard

The main dashboard provides an at-a-glance view of your security status, including:

- Security score and risk assessment
- Recent alerts and notifications
- Transaction monitoring statistics
- Network security status

### Wallet Drainers

The wallet drainers section displays:

- List of known wallet drainer contracts
- Risk level and threat assessment
- Number of victims and total value stolen
- Detailed analysis of each drainer's techniques

### Security Scanner

The security scanner allows you to:

- Scan any wallet address for vulnerabilities
- Identify high-risk token approvals
- Detect interactions with suspicious contracts
- Receive personalized security recommendations

### Token Approvals

The token approvals manager helps you:

- View all token spending permissions granted by your wallet
- Identify high-risk and unlimited approvals
- Filter and search through approvals
- Revoke unnecessary permissions with one click

### Notification Settings

Customize your security alerts:

- Configure multiple notification channels
- Set alert thresholds for transaction amounts
- Choose alert frequency and risk level sensitivity
- Enable/disable specific types of security alerts

## 🏗️ Architecture

- **Smart Contracts**: Solidity contracts deployed on Electroneum blockchain for on-chain monitoring and analysis
- **Backend API**: Node.js server with AI integration for transaction and contract analysis
- **Frontend**: React-based dashboard built with Chakra UI for a modern, responsive interface
- **Database**: MongoDB for storing historical data, analysis results, and user preferences
- **Notification System**: Multi-channel alert system for real-time security notifications

## Screenshots

<img width="1006" alt="Screenshot 2025-03-07 at 8 29 39 PM" src="https://github.com/user-attachments/assets/b79b6f1d-7f35-4278-9550-41898868b74c" />

<img width="1637" alt="Screenshot 2025-03-07 at 9 37 17 PM" src="https://github.com/user-attachments/assets/6212c502-a98a-4a39-9015-4bd2eeb0ed4a" />

<img width="1672" alt="Screenshot 2025-03-07 at 9 37 41 PM" src="https://github.com/user-attachments/assets/51289bb4-cb52-4b71-8428-d6e17bce810c" />

<img width="1410" alt="Screenshot 2025-03-07 at 9 39 06 PM" src="https://github.com/user-attachments/assets/e19d9bd4-fe11-4afe-821d-e2474ef3d359" />

<img width="1680" alt="Screenshot 2025-03-07 at 9 39 16 PM" src="https://github.com/user-attachments/assets/c760bbb7-f965-45a7-a332-617d3f7988f8" />

<img width="1674" alt="Screenshot 2025-03-07 at 9 39 24 PM" src="https://github.com/user-attachments/assets/2350b9ab-f160-4224-9aa3-e40c6c1d4b35" />

<img width="1680" alt="Screenshot 2025-03-07 at 9 39 36 PM" src="https://github.com/user-attachments/assets/f72860d4-d41a-4bc8-b1ce-01910eaed64a" />

<img width="1416" alt="Screenshot 2025-03-07 at 9 39 46 PM" src="https://github.com/user-attachments/assets/b4379959-d583-4d9c-9e82-433f63cd80c7" />

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional, for full functionality)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/etn-watchdog.git
   cd etn-watchdog
   ```

2. Install dependencies:

   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Running the Application

#### With Mock Data (Default)

This mode uses mock data and doesn't require a connection to the Electroneum blockchain:

```bash
./start-app.sh --mock
```

#### With Testnet Data

This mode connects to the Electroneum testnet and uses real blockchain data:

```bash
./start-app.sh --testnet
```

#### With Mainnet Data

This mode connects to the Electroneum mainnet and uses real blockchain data:

```bash
./start-app.sh --mainnet
```

### Switching Data Sources in the UI

You can also switch between data sources directly in the UI:

1. Look for the "Data Source" dropdown in the top-right corner of the dashboard
2. Select your preferred data source:
   - Mock Data: Uses locally generated mock data
   - Electroneum Testnet: Connects to the Electroneum testnet
   - Electroneum Mainnet: Connects to the Electroneum mainnet

Note: Switching data sources in the UI will reload the page to refresh the data.

## 🚀 Setup Instructions

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
   cd frontend && npm install
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
   npm run start:all
   ```

## 🧪 Running on Testnet

To run ETN Watchdog on the Electroneum testnet instead of mainnet, follow these steps:

1. Update your `.env` file to use testnet configuration:

   ```
   # Comment out mainnet URLs
   # ELECTRONEUM_RPC_URL=https://rpc.electroneum.com
   # WEB3_PROVIDER_URL=https://rpc.electroneum.com

   # Uncomment testnet URLs
   ELECTRONEUM_RPC_URL=https://rpc.ankr.com/electroneum_testnet
   WEB3_PROVIDER_URL=https://rpc.ankr.com/electroneum_testnet

   # Set chain ID to testnet
   NETWORK_CHAIN_ID=5201420
   ```

2. Get testnet ETN from the Electroneum testnet faucet (if available) or request from the Electroneum team.

3. Deploy the contracts to testnet:

   ```
   npm run deploy:testnet
   ```

4. Start the application:
   ```
   npm run start:all
   ```

The application will now connect to the Electroneum testnet instead of mainnet.

## 🔧 Development

- `npm run dev`: Start the backend in development mode
- `npm run frontend:dev`: Start the frontend in development mode
- `npm run start:all`: Start both backend and frontend
- `npm test`: Run tests
- `npm run compile`: Compile smart contracts
- `npm run lint`: Run linting checks
- `npm run format`: Format code using Prettier

## 📱 Mobile App

A mobile companion app for ETN Watchdog is currently in development. The app will provide:

- Push notifications for security alerts
- On-the-go security monitoring
- Quick actions for addressing security threats
- Biometric authentication for enhanced security

## 🔄 API Integration

ETN Watchdog provides a REST API for integration with other services:

- **Authentication**: JWT-based authentication for secure API access
- **Endpoints**: Comprehensive endpoints for accessing security data
- **Documentation**: Detailed API documentation available at `/api/docs`
- **Rate Limiting**: Fair usage policies to ensure service availability

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

ETN Watchdog is provided for informational purposes only. While we strive to provide accurate and up-to-date security information, we cannot guarantee the identification of all security threats. Always do your own research before making investment decisions or interacting with smart contracts on the Electroneum blockchain.

## 📞 Support

If you encounter any issues or have questions, please:

- Open an issue on GitHub
- Contact us at support@etnwatchdog.com
- Join our community Discord server

---

Built with ❤️ for the Electroneum community
