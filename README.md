# Stacks Watchdog: AI agent for security monitoring

# Stacks Watchdog AI: AI agent for security monitoring

Stacks Watchdog AI is an intelligent blockchain security monitoring agent built for the Stacks blockchain. It uses advanced AI algorithms to detect suspicious transactions, wallet drainers, potential rug-pulls, and other security threats in real-time. It also analyses smart contracts using various AI models and scans the blockchain realtime for vulnerabilities. Gamified Learning modules are also included to educate users about common security issues. Real time alerts using telegram bots and email to keep users updated.

Demo URL (frontend): [https://stacks-watchdog.vercel.app/](https://stacks-watchdog.vercel.app/)

Backend server URL (api server): [https://stacks-watchdog-backend.vercel.app/](https://stacks-watchdog-backend.vercel.app/)

<img width="1610" alt="Screenshot 2025-03-17 at 8 21 41 PM" src="https://github.com/user-attachments/assets/ebfd20d3-c8bd-47d9-9c42-ecf3adb1a0d6" />

**Motivation**

The rise in cryptocurrency thefts, with over $2.2 billion stolen in 2024 alone [reuters.com](https://www.reuters.com/technology/losses-crypto-hacks-jump-22-bln-2024-report-says-2024-12-19/?utm_source=chatgpt.com) underscores the critical need for enhanced security in blockchain ecosystems. Recognizing the vulnerabilities with blockchain transactions, I developed Stacks Watchdog AI to proactively address these challenges. The goal is to safeguard users' assets and bolster trust in the platform by providing real-time threat detection and comprehensive security education.

## Architecture

- **Smart Contracts**: Clarity contracts deployed on Stacks blockchain for on-chain monitoring and analysis
- **Backend API**: Node.js server with AI integration for transaction and contract analysis
- **Frontend**: React-based dashboard built with Chakra UI for a modern, responsive interface
- **Database**: MongoDB for storing historical data, analysis results, and user preferences
- **AI Integration**: OpenAI API integration for advanced security analysis
- **Notification System**: Multi-channel alert system for real-time security notifications
- **Block Explorer Integration**: Direct integration with Stacks block explorer

### Agent's Architecture Flow

<img width="1462" alt="flow_chart" src="https://github.com/user-attachments/assets/43372fad-d6ef-4e93-9941-03c5394e0db0" />

### Key Features

<img width="1165" alt="features" src="https://github.com/user-attachments/assets/579a1146-3188-41a7-bd40-9dab41449f88" />

### Core Security Features

- **Real-time Transaction Monitoring**: Continuously monitors Stacks blockchain transactions to detect suspicious patterns and potential threats
- **AI-Powered Analysis**: Leverages advanced AI models (GPT 4.5) to analyze contracts and transactions for security vulnerabilities
- **Rug-Pull Detection**: Identifies potential rug-pull risks by analyzing token contract code, liquidity patterns, and ownership structures
- **Wallet Drainer Detection**: Detects malicious contracts designed to drain user wallets through sophisticated techniques
- **Alert System**: Sends real-time notifications through multiple channels like telegram bots, email when potential threats are detected
- **Learning Modules**: Gamified learning modules for various common security risks and precautions to help users understand risks better.

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
- **Stacks Block Explorer Integration**: Direct links to the Stacks block explorer for transactions, addresses, and contracts

## Dashboard Sections

### Main Dashboard

<img width="1680" alt="Screenshot 2025-03-17 at 9 12 54 PM" src="https://github.com/user-attachments/assets/04a9cd9f-1bcb-4c74-a4e1-509599ae6314" />

The main dashboard provides an at-a-glance view of your security status, including:

- Security score and risk assessment
- Recent alerts and notifications
- Transaction monitoring statistics
- Network security status
- Data source selector (Mock/Testnet)

### Vulnerability Scanner Dashboard

<img width="1418" alt="vulnerability-scanner" src="https://github.com/user-attachments/assets/799e01d9-7978-46ee-b257-44f146309c4a" />

The vulnerability scanner dashboard provides comprehensive contract security analysis:

- Real-time contract scanning interface
- Sample vulnerable contracts for testing
- Dark-themed UI components for optimal visibility
- Detailed scan results with severity indicators
- Interactive vulnerability exploration tools
- Contract search and history tracking
- One-click sample contract loading
- Vulnerability statistics and trends

### AI Smart Contract Analyzer

<img width="1368" alt="Screenshot 2025-03-17 at 9 15 11 PM" src="https://github.com/user-attachments/assets/b29d51f0-bcde-4841-8f86-3cdce6906a8f" />

<img width="1124" alt="AI smart contract analyzer" src="https://github.com/user-attachments/assets/014dfdd1-c8c0-4e00-a1d5-fcf1a936d6e7" />

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

### Wallet Security Scanner

<img width="1403" alt="Wallet security scanner" src="https://github.com/user-attachments/assets/348312ae-b39f-4570-bad3-ab51d8704c9d" />

The wallet security scanner allows you to:

- Scan any wallet address for vulnerabilities using AI
- Identify high-risk token approvals
- Detect interactions with suspicious contracts
- Analyze transaction patterns for suspicious activity
- Receive personalized security recommendations

### Token Approvals

<img width="1173" alt="tokens approval manager" src="https://github.com/user-attachments/assets/93472437-9335-4942-b83f-d2be74885fff" />

The token approvals manager helps you:

- View all token spending permissions granted by your wallet
- Identify high-risk and unlimited approvals
- Filter and search through approvals
- Revoke unnecessary permissions with one click

### Notification Settings

<img width="1091" alt="Screenshot 2025-03-17 at 8 40 14 PM" src="https://github.com/user-attachments/assets/02503664-ba85-414c-b94d-ae8d500d78d0" />

Customize your security alerts:

- Configure multiple notification channels
- Set alert thresholds for transaction amounts
- Choose alert frequency and risk level sensitivity
- Enable/disable specific types of security alerts

### Gamified Learning modules

<img width="1222" alt="interactive learning modules" src="https://github.com/user-attachments/assets/ee5eb8ad-5b04-45ec-bdb0-eb28801365e4" />

The learning center dashboard offers interactive security education:

- Progress tracking overview
- Current module status
- Recommended learning paths
- Achievement badges display
- Interactive learning exercises
- Practice vulnerability detection
- Real-world case studies
- Quiz scores and certifications
- Customized learning recommendations

Learning progress tracker

<img width="1162" alt="learning-progress" src="https://github.com/user-attachments/assets/1f04b977-61c2-414b-82fc-887f3cea788d" />

## AI-Powered Security Features

Stacks Watchdog AI leverages advanced AI models to provide cutting-edge security analysis:

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

<img width="1116" alt="AI smart contract recommendations" src="https://github.com/user-attachments/assets/8ab6410c-e22b-4103-a4a5-057d6951b485" />

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

## Telegram Integration

Stacks Watchdog AI integrates with Telegram for real-time alerts and interactions:

### Setup Instructions

1. Find our bot: @StacksWatchdogBot
2. Start a chat and click "Start"
3. Complete the authentication process
4. Configure your alert preferences

### Features

- **Real-time Alerts**: Instant notifications for:
- Detected vulnerabilities
- Suspicious transactions
- Wallet drainer detection
- High-risk contract interactions
- **Interactive Commands**:
- `/scan <address>`: Quick contract security scan
- `/check <tx>`: Transaction risk assessment
- `/alerts`: Manage alert settings
- `/status`: Check system status
- `/help`: List available commands
- **Custom Notifications**:
- Set threshold amounts for alerts
- Choose alert categories
- Configure quiet hours
- Customize alert format
- **Security Reports**:
- Daily security summaries
- Weekly risk assessments
- Monthly activity reports
- Custom report scheduling

## AI-Powered Security Features

Stacks Watchdog leverages advanced AI models to provide cutting-edge security analysis:

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

<img width="1116" alt="AI smart contract recommendations" src="https://github.com/user-attachments/assets/8ab6410c-e22b-4103-a4a5-057d6951b485" />

### Address Analysis

The AI Address Analyzer examines wallet addresses for:

- **Suspicious Transaction Patterns**: Identifies unusual transaction behavior
- **Connections to Known Malicious Addresses**: Detects interactions with known scammers
- **Potential Wallet Drainer Behavior**: Identifies patterns consistent with wallet drainers
- **Money Laundering Indicators**: Detects patterns that may indicate money laundering
- **Risk Scoring**: Provides a comprehensive risk score and security assessment

### Transaction Analysis

<img width="1677" alt="Screenshot 2025-03-11 at 12 46 25 AM" src="https://github.com/user-attachments/assets/45193f12-9aed-4737-a7e4-b2389c29baf6" />

The AI Transaction Analyzer monitors transactions for:

- **Unusual Transaction Amounts**: Identifies transactions with suspicious values
- **Suspicious Contract Interactions**: Detects interactions with potentially malicious contracts
- **Phishing Indicators**: Identifies transactions that may be part of phishing attempts
- **Scam Patterns**: Detects patterns consistent with known scams
- **Real-time Alerts**: Provides immediate notifications for high-risk transactions

### Smart Contract Vulnerability Scanner

The vulnerability scanner provides real-time security analysis of smart contracts on the Stacks blockchain:

#### Features

- Dark theme UI for optimal visibility and reduced eye strain
- Real-time contract scanning and analysis
- Sample contract testing capabilities
- Detailed vulnerability reporting
- Interactive contract search interface

#### Configuration

The vulnerability scanner requires the following environment variables:

```env
STACK_TESTNET_RPC_URL=your_stacks_testnet_url
MONGODB_URI=your_mongodb_connection_string
API_KEY=your_api_key
```

To initialize the vulnerability scanner:

1. Ensure all environment variables are properly set
2. Start the server using `npm start`
3. Monitor the logs for successful connection to the Stacks testnet
4. Verify the network ID and block number in the initialization logs

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional, for full functionality)
- OpenAI API key (for AI-powered features)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/stacks-watchdog-ai.git
   cd stacks-watchdog-ai
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
   REACT_APP_OPENAI_API_KEY=your_openai_api_key
   REACT_APP_USE_MOCK_AI=false  # Set to true to use mock AI responses instead of real API
   ```

### Running the Application

#### With Mock Data (Default)

This mode uses mock data and doesn't require a connection to the Stacks blockchain:

```bash
./start-app.sh --mock
```

#### With Testnet Data

This mode connects to the Stacks Testnet and uses real blockchain data:

```bash
./start-app.sh --testnet
```

#### With Mainnet Data

This mode connects to the Stacks mainnet and uses real blockchain data:

```bash
./start-app.sh --mainnet
```

### Switching Data Sources in the UI

You can also switch between data sources directly in the UI:

1. Look for the "Data Source" dropdown in the top-right corner of the dashboard
2. Select your preferred data source:
   - Mock Data: Uses locally generated mock data
   - Stacks Testnet: Connects to the Stacks Testnet
   - Stacks Mainnet: Connects to the Stacks mainnet

Note: Switching data sources in the UI will reload the page to refresh the data.

## 🔧 Configuration Options

### Environment Variables

The application uses the following environment variables:

#### Backend Configuration

```
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


# AI Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_USE_MOCK_AI=false
```

## 🧪 Running on Testnet

To run Stacks Watchdog on the Stacks Testnet instead of mainnet, follow these steps:

1. Update your `.env` file to use testnet configuration:

2. Get testnet STX from the Stacks Testnet faucet:

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

Stacks Watchdog is provided for informational purposes only. While we strive to provide accurate and up-to-date security information, we cannot guarantee the identification of all security threats. Always do your own research before making investment decisions or interacting with smart contracts on the Stacks blockchain.

## 📞 Support

If you encounter any issues or have questions, please:

- Open an issue on GitHub
- Contact us at ping.jayshree@gmail.com

---

Built with ❤️ for the Stacks community
