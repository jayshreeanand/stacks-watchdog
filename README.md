# ETN Watchdog: AI Security Monitoring Bot for Electroneum

ETN Watchdog is a comprehensive security monitoring platform for the Electroneum blockchain. It uses advanced AI algorithms to detect suspicious transactions, wallet drainers, potential rug-pulls, and other security threats in real-time.

Demo URL: https://etn-watchdog.vercel.app/

Backend server URL: https://etn-watchdog-production.up.railway.app/

<img width="600" alt="Screenshot 2025-03-09 at 8 31 50 PM" src="https://github.com/user-attachments/assets/68ead615-de87-45f0-8011-e6c153013653" />

## 🛡️ Key Features

### Core Security Features

- **Real-time Transaction Monitoring**: Continuously monitors Electroneum blockchain transactions to detect suspicious patterns and potential threats
- **AI-Powered Analysis**: Leverages advanced AI models to analyze contracts and transactions for security vulnerabilities
- **Rug-Pull Detection**: Identifies potential rug-pull risks by analyzing token contract code, liquidity patterns, and ownership structures
- **Wallet Drainer Detection**: Detects malicious contracts designed to drain user wallets through sophisticated techniques
- **Alert System**: Sends real-time notifications through multiple channels when potential threats are detected

### Advanced AI Security Tools

- **AI Smart Contract Analyzer**: Deep analysis of smart contract code using AI to identify vulnerabilities, backdoors, and security risks
- **AI Address Analyzer**: AI-powered analysis of wallet addresses to detect suspicious activity and potential security threats
- **AI Transaction Analysis**: Real-time analysis of transactions to identify unusual patterns and potential scams
- **Security Scanner**: Comprehensive wallet security analysis tool that checks for vulnerabilities, suspicious approvals, and risky interactions
- **Token Approvals Manager**: View and manage all token spending permissions with risk indicators and one-click revocation
- **Phishing Detection**: Identifies potential phishing attempts targeting your wallet

### User Experience

- **Modern Dashboard**: Intuitive dashboard providing a comprehensive overview of your security status
- **Customizable Notifications**: Configure how and when you want to be alerted about security events
- **Multi-channel Alerts**: Receive notifications via email, browser, mobile app, or Telegram
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Electroneum Block Explorer Integration**: Direct links to the Electroneum block explorer for transactions, addresses, and contracts

## 📊 Dashboard Sections

### Main Dashboard

The main dashboard provides an at-a-glance view of your security status, including:

- Security score and risk assessment
- Recent alerts and notifications
- Transaction monitoring statistics
- Network security status
- Data source selector (Mock/Testnet/Mainnet)

### AI Smart Contract Analyzer

The AI-powered smart contract analyzer provides:

- Deep security analysis of smart contract code
- Vulnerability detection with severity ratings
- Detailed explanations of security issues
- Specific recommendations for fixing vulnerabilities
- Risk scoring and overall security assessment
- Sample contracts for testing and learning

### Wallet Drainers

The wallet drainers section displays:

- List of known wallet drainer contracts
- Risk level and threat assessment
- Number of victims and total value stolen
- Detailed analysis of each drainer's techniques
- Direct links to block explorer for verification

### Security Scanner

The security scanner allows you to:

- Scan any wallet address for vulnerabilities using AI
- Identify high-risk token approvals
- Detect interactions with suspicious contracts
- Analyze transaction patterns for suspicious activity
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

## 🧠 AI-Powered Security Features

ETN Watchdog leverages advanced AI models to provide cutting-edge security analysis:

### Smart Contract Vulnerability Detection

The AI Smart Contract Analyzer can detect various vulnerabilities including:

- **Reentrancy Vulnerabilities**: Identifies functions vulnerable to reentrancy attacks
- **Access Control Issues**: Detects improper access controls and authorization flaws
- **Integer Overflow/Underflow**: Finds potential arithmetic vulnerabilities
- **Unchecked External Calls**: Identifies unsafe external calls without proper error handling
- **Front-running Vulnerabilities**: Detects transactions vulnerable to front-running
- **Logic Errors**: Identifies logical flaws in contract code
- **Rug Pull Mechanisms**: Detects backdoors and mechanisms that could enable rug pulls
- **Gas Optimization Issues**: Identifies inefficient code that could lead to high gas costs

### Address Analysis

The AI Address Analyzer examines wallet addresses for:

- **Suspicious Transaction Patterns**: Identifies unusual transaction behavior
- **Connections to Known Malicious Addresses**: Detects interactions with known scammers
- **Potential Wallet Drainer Behavior**: Identifies patterns consistent with wallet drainers
- **Money Laundering Indicators**: Detects patterns that may indicate money laundering
- **Risk Scoring**: Provides a comprehensive risk score and security assessment

### Transaction Analysis

The AI Transaction Analyzer monitors transactions for:

- **Unusual Transaction Amounts**: Identifies transactions with suspicious values
- **Suspicious Contract Interactions**: Detects interactions with potentially malicious contracts
- **Phishing Indicators**: Identifies transactions that may be part of phishing attempts
- **Scam Patterns**: Detects patterns consistent with known scams
- **Real-time Alerts**: Provides immediate notifications for high-risk transactions

## 🏗️ Architecture

- **Smart Contracts**: Solidity contracts deployed on Electroneum blockchain for on-chain monitoring and analysis
- **Backend API**: Node.js server with AI integration for transaction and contract analysis
- **Frontend**: React-based dashboard built with Chakra UI for a modern, responsive interface
- **Database**: MongoDB for storing historical data, analysis results, and user preferences
- **AI Integration**: OpenAI API integration for advanced security analysis
- **Notification System**: Multi-channel alert system for real-time security notifications
- **Block Explorer Integration**: Direct integration with Electroneum block explorer

---

## 🔍 Using the AI Security Features

### Smart Contract Analyzer

1. Navigate to "AI Contract Analyzer" in the sidebar
2. Enter a contract address or paste contract code
   - Use the "Load Sample" button to test with a sample contract
   - Use the "Load Vulnerable Sample" to see how vulnerabilities are detected
3. Click "Analyze Contract"
4. Review the detailed security analysis:
   - Overall risk score and risk level
   - List of vulnerabilities with severity ratings
   - Detailed descriptions and recommendations
   - Links to the contract on the block explorer

### Address Analyzer

1. Go to "Security Scanner" in the sidebar
2. Use the "Address Analyzer" tab
3. Enter an Electroneum address
4. Click "Analyze"
5. Review the security assessment:
   - Risk score and risk level
   - Suspicious activity findings
   - Recommended security actions
   - Links to the address on the block explorer

### Transaction Monitoring

The system automatically monitors transactions for suspicious activity:

1. Transactions are analyzed in real-time as they occur
2. AI models assess each transaction for security risks
3. Suspicious transactions trigger alerts
4. Details are displayed in the dashboard and notifications

## 🔄 API Integration

ETN Watchdog provides a REST API for integration with other services:

- **Authentication**: JWT-based authentication for secure API access
- **Endpoints**: Comprehensive endpoints for accessing security data
- **Documentation**: Detailed API documentation available at `/api/docs`
- **Rate Limiting**: Fair usage policies to ensure service availability

## Contract details

Network: electroneum_testnet (Chain RPC: https://rpc.ankr.com/electroneum_testnet) (Chain ID: 5201420)
TransactionMonitor deployed to: https://testnet-blockexplorer.electroneum.com/address/0xda52b25ddB0e3B9CC393b0690Ac62245Ac772527
RugPullDetector deployed to: https://testnet-blockexplorer.electroneum.com/address/0x11B57FE348584f042E436c6Bf7c3c3deF171de49
WalletDrainerDetector deployed to: https://testnet-blockexplorer.electroneum.com/address/0x1294b86822ff4976BfE136cB06CF43eC7FCF2574
ETNWatchdogRegistry deployed to: https://testnet-blockexplorer.electroneum.com/address/0xA6E41fFD769491a42A6e5Ce453259b93983a22EF

## Screenshots

Deployed Contracts

<img width="900" alt="Screenshot 2025-03-09 at 1 43 59 PM" src="https://github.com/user-attachments/assets/2952d039-7681-4083-b570-aa38b99069bd" />

Features

<img width="900" alt="Screenshot 2025-03-09 at 8 31 58 PM" src="https://github.com/user-attachments/assets/c09f5b6e-ec13-4a3a-9f11-630e8ae067e0" />

How it works

<img width="900" alt="Screenshot 2025-03-09 at 8 32 06 PM" src="https://github.com/user-attachments/assets/53dd1132-b486-4975-b68d-f84cc5a629a9" />

Dashboard

<img width="900" alt="Screenshot 2025-03-09 at 8 58 01 PM" src="https://github.com/user-attachments/assets/f4087a8c-a5e1-4183-bdd8-54b9d7972706" />

AI Smart contract analyzer

<img width="900" alt="Screenshot 2025-03-09 at 8 58 22 PM" src="https://github.com/user-attachments/assets/53e7be3a-095d-4410-bc33-ac7a9513e237" />

AI analyzer results

<img width="900" alt="Screenshot 2025-03-09 at 8 59 03 PM" src="https://github.com/user-attachments/assets/a3773f19-0dae-431f-8c1b-d06835595989" />

AI security recommendations

<img width="900" alt="Screenshot 2025-03-09 at 8 59 10 PM" src="https://github.com/user-attachments/assets/c79f24f8-0596-4edf-a0c3-edaf8ab7ad4c" />

Wallet Scanner

<img width="900" alt="Screenshot 2025-03-09 at 8 59 37 PM" src="https://github.com/user-attachments/assets/a982be75-3378-4f99-855e-9d9eaaec42d0" />
<img width="900" alt="Screenshot 2025-03-09 at 9 00 10 PM" src="https://github.com/user-attachments/assets/8618b16d-d208-4faa-bce2-5cfc6ac2d530" />
<img width="900" alt="Screenshot 2025-03-09 at 9 00 21 PM" src="https://github.com/user-attachments/assets/76fc3df3-aeca-4656-8e36-5b69f7969140" />
<img width="900" alt="Screenshot 2025-03-09 at 9 00 33 PM" src="https://github.com/user-attachments/assets/64414112-acf6-4ba9-96fe-60d66ec29bf4" />
<img width="900" alt="Screenshot 2025-03-09 at 9 00 43 PM" src="https://github.com/user-attachments/assets/123a4807-28da-4497-8fa0-1325f9fe208e" />
Wallet security recommendations
<img width="900" alt="Screenshot 2025-03-09 at 9 00 55 PM" src="https://github.com/user-attachments/assets/98f0db27-9cee-481f-9318-f3b773c72076" />

Token Approvals Manager

<img width="900" alt="Screenshot 2025-03-09 at 9 01 21 PM" src="https://github.com/user-attachments/assets/51fb0462-59d8-4824-8035-acdbb17e6d16" />

Notification Settings

<img width="900" alt="Screenshot 2025-03-09 at 9 01 21 PM" src="https://github.com/user-attachments/assets/c48837c6-81ea-455f-bc7c-7e3b04f1c70b" />

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional, for full functionality)
- OpenAI API key (for AI-powered features)

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

4. Configure AI features:

   Add your OpenAI API key to the `.env` file:

   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   REACT_APP_USE_MOCK_AI=false  # Set to true to use mock AI responses instead of real API
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

## 🔧 Configuration Options

### Environment Variables

The application uses the following environment variables:

#### Backend Configuration

```
# Blockchain Configuration
ELECTRONEUM_RPC_URL=https://rpc.ankr.com/electroneum_testnet
ELECTRONEUM_TESTNET_RPC_URL=https://rpc.ankr.com/electroneum_testnet
PRIVATE_KEY=your_private_key_here
NETWORK_CHAIN_ID=5201420

# Database Configuration
MONGODB_URI=your_mongodb_uri_here
SKIP_MONGODB=false

# API Configuration
PORT=3000
API_KEY=your_api_key_for_security

# AI Model Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

#### Frontend Configuration

```
# API URLs
REACT_APP_MOCK_API_URL=http://localhost:3000/api
REACT_APP_TESTNET_API_URL=http://localhost:3000/api
REACT_APP_MAINNET_API_URL=http://localhost:3000/api

# Block explorer URLs
REACT_APP_TESTNET_EXPLORER_URL=https://testnet-blockexplorer.electroneum.com/
REACT_APP_MAINNET_EXPLORER_URL=https://blockexplorer.electroneum.com/

# AI Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_USE_MOCK_AI=false
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
- Contact us at ping.jayshree@gmail.com

---

Built with ❤️ for the Electroneum community
