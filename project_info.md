# Chain Shield AI: AI agent for security monitoring

Chain Shield AI is an intelligent blockchain security monitoring agent. It uses advanced AI algorithms to detect suspicious transactions, wallet drainers, potential rug-pulls, and other security threats in real-time. It also analyses smart contracts using various AI models and scans the blockchain realtime for vulnerabilities. Gamified Learning modules are also included to educate users about common security issues. Real time alerts using telegram bots and email to keep users updated.

Demo URL (frontend): [https://chain-shield.vercel.app/](https://chain-shield.vercel.app/)

Backend server URL (api server): [https://chain-shield-backend.up.railway.app/](https://chain-shield-backend.up.railway.app/)

<img width="1601" alt="Screenshot 2025-03-10 at 11 51 04 PM" src="https://github.com/user-attachments/assets/bea148b1-8a79-44c7-b080-a98080c43ca1" />

**Motivation**

The rise in cryptocurrency thefts, with over $2.2 billion stolen in 2024 alone [reuters.com](https://www.reuters.com/technology/losses-crypto-hacks-jump-22-bln-2024-report-says-2024-12-19/?utm_source=chatgpt.com) underscores the critical need for enhanced security in blockchain ecosystems. Recognizing the vulnerabilities with blockchain transactions, I developed Chain Shield AI to proactively address these challenges. The goal is to safeguard users' assets and bolster trust in the platform by providing real-time threat detection and comprehensive security education.

## Architecture

- **Smart Contracts**: Solidity contracts deployed on Sonic blockchain for on-chain monitoring and analysis
- **Backend API**: Node.js server with AI integration for transaction and contract analysis
- **Frontend**: React-based dashboard built with Chakra UI for a modern, responsive interface
- **Database**: MongoDB for storing historical data, analysis results, and user preferences
- **AI Integration**: OpenAI API integration for advanced security analysis
- **Notification System**: Multi-channel alert system for real-time security notifications
- **Block Explorer Integration**: Direct integration with Sonic block explorer

### Agent's Architecture Flow

<img width="1462" alt="flow_chart" src="https://github.com/user-attachments/assets/43372fad-d6ef-4e93-9941-03c5394e0db0" />

### Key Features

<img width="1165" alt="features" src="https://github.com/user-attachments/assets/579a1146-3188-41a7-bd40-9dab41449f88" />

### Core Security Features

- **Real-time Transaction Monitoring**: Continuously monitors Sonic blockchain transactions to detect suspicious patterns and potential threats
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
- **Sonic Block Explorer Integration**: Direct links to the Sonic block explorer for transactions, addresses, and contracts

## Dashboard Sections

### Main Dashboard

<img width="1672" alt="Screenshot 2025-03-11 at 12 46 10 AM" src="https://github.com/user-attachments/assets/e5b3cc56-f527-4bf3-9b4c-e71ac19abe91" />

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

<img width="1350" alt="Load sample contract" src="https://github.com/user-attachments/assets/d6d88489-c76f-4b63-8e4e-bc2b3caeacbd" />

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

<img width="1249" alt="NOTIFICATION settings" src="https://github.com/user-attachments/assets/824739cf-e88a-4dae-9435-981c17b45937" />

Customize your security alerts:

- Configure multiple notification channels
- Set alert thresholds for transaction amounts
- Choose alert frequency and risk level sensitivity
- Enable/disable specific types of security alerts

<img width="200" alt="Telegram bot alerts" src="https://github.com/user-attachments/assets/6812b858-d40b-4ffe-a9ee-44ebdaa3e694" />

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

Chain Shield AI leverages advanced AI models to provide cutting-edge security analysis:

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

## Telegram Integration

Chain Shield AI integrates with Telegram for real-time alerts and interactions:

### Setup Instructions

1. Find our bot: @SonicShieldBot
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

### Contract Address

- Network: sonic_testnet (Chain RPC: [https://rpc.blaze.soniclabs.com)](https://rpc.blaze.soniclabs.com)) (Chain ID: 57054)
- TransactionMonitor deployed to: 0x5870daE1dA84864fBC2A7fbDF2B599aB3CEf2183
- RugPullDetector deployed to: 0x151910d2B019d38623eE7DE0f7705b5F819792c8
- WalletDrainerDetector deployed to: 0xc91bc914DF0C8b76b1DED07823e259c8B04b0Fd6
- SWatchdogRegistry deployed to: 0x6e808c5A0A3ed300F3d8B3119D37d20d762E858f

**Future Plans for Chain Shield AI:**

- **Enhanced AI Capabilities:** Integrate machine learning models to improve threat detection accuracy and adapt to emerging security challenges.
- **User Education:** Expand educational modules to include interactive tutorials and real-time alerts, fostering a more security-conscious user base.
- **Community Engagement:** Establish forums and feedback channels to involve the community in identifying threats and suggesting improvements.
- **Cross-Platform Integration:** Develop plugins and APIs to extend Chain Shield AI's security features to wallets, exchanges, and other platforms within the Sonic ecosystem.

These initiatives aim to position Chain Shield AI as a comprehensive security solution, enhancing trust and safety within the Sonic blockchain community.
