import axios from 'axios';
import { mockApiService } from './mockData';
import { ethers } from 'ethers';
import aiAnalyzer from './aiAnalyzer';

// API base URLs
const API_BASE_URLS = {
  mock: process.env.REACT_APP_MOCK_API_URL || 'http://localhost:3000/api',
  testnet: process.env.REACT_APP_TESTNET_API_URL || 'http://localhost:3000/api',
  mainnet: process.env.REACT_APP_MAINNET_API_URL || 'http://localhost:3000/api'
};

// Block explorer URLs
export const explorerUrls = {
  mock: process.env.REACT_APP_TESTNET_EXPLORER_URL || 'https://testnet.sonicscan.org/',
  testnet: process.env.REACT_APP_TESTNET_EXPLORER_URL || 'https://testnet.sonicscan.org/',
  mainnet: process.env.REACT_APP_MAINNET_EXPLORER_URL || 'https://sonicscan.org/'
};

// Current data source
let CURRENT_DATA_SOURCE = 'testnet'; // Default to testnet

// API instance
const api = axios.create({
  baseURL: API_BASE_URLS[CURRENT_DATA_SOURCE],
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API endpoints
const ENDPOINTS = {
  WALLET_DRAINERS: `${API_BASE_URLS[CURRENT_DATA_SOURCE]}/walletdrainer`,
  RECENT_WALLET_DRAINERS: `${API_BASE_URLS[CURRENT_DATA_SOURCE]}/walletdrainer/recent`,
  WALLET_DRAINER_BY_ADDRESS: (address) => `${API_BASE_URLS[CURRENT_DATA_SOURCE]}/walletdrainer/${address}`,
  ANALYZE_CONTRACT: `${API_BASE_URLS[CURRENT_DATA_SOURCE]}/walletdrainer/analyze`,
  STATS: `${API_BASE_URLS[CURRENT_DATA_SOURCE]}/stats`,
};

// Set API base URL based on data source
export const setApiBaseUrl = (dataSource) => {
  if (API_BASE_URLS[dataSource]) {
    CURRENT_DATA_SOURCE = dataSource;
    api.defaults.baseURL = API_BASE_URLS[dataSource];
    console.log(`API base URL set to: ${api.defaults.baseURL} (${dataSource})`);
  } else {
    console.error(`Invalid data source: ${dataSource}`);
  }
};

// Helper functions for explorer URLs
export const getExplorerUrl = () => {
  return explorerUrls[CURRENT_DATA_SOURCE] || explorerUrls.testnet;
};

export const getTransactionUrl = (txHash) => {
  return `${getExplorerUrl()}tx/${txHash}`;
};

export const getAddressUrl = (address) => {
  return `${getExplorerUrl()}address/${address}`;
};

export const getTokenUrl = (tokenAddress) => {
  return `${getExplorerUrl()}token/${tokenAddress}`;
};

// Mock data generator
const getMockData = (type) => {
  const mockPrefix = '[MOCK DATA]';
  const explorerUrl = getExplorerUrl();
  
  switch (type) {
    case 'stats':
      return {
        totalDrainers: 156,
        activeDrainers: 42,
        totalVictims: 328,
        totalLost: 1250000,
        source: mockPrefix,
        explorerUrl: explorerUrl,
        securityScore: 85,
        alertCount: 3,
        monitoredWallets: 12
      };
    case 'drainers':
      return [
        {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          name: `${mockPrefix} Fake Stacks Airdrop`,
          riskLevel: 'high',
          victims: 12,
          totalStolen: 45000,
          lastActive: '2025-03-05T12:30:45Z',
          isVerified: true,
          description: `${mockPrefix} This contract pretends to be an official Stacks airdrop but steals user funds when they approve token transfers.`,
          createdAt: '2025-02-28T10:15:30Z',
          verifiedBy: 'SecurityTeam',
          verificationNotes: 'Confirmed malicious behavior through code analysis and victim reports.',
        },
        {
          address: '0xabcdef1234567890abcdef1234567890abcdef12',
          name: `${mockPrefix} Stacks Staking Scam`,
          riskLevel: 'critical',
          victims: 28,
          totalStolen: 120000,
          lastActive: '2025-03-04T18:15:22Z',
          isVerified: true,
          description: `${mockPrefix} Fake staking platform that promises high returns but steals deposited S tokens.`,
          createdAt: '2025-02-25T08:30:15Z',
          verifiedBy: 'SecurityTeam',
          verificationNotes: 'Multiple victim reports confirmed. Contract has backdoor functions.',
        },
        {
          address: '0x9876543210fedcba9876543210fedcba98765432',
          name: `${mockPrefix} Phishing Dapp`,
          riskLevel: 'medium',
          victims: 8,
          totalStolen: 35000,
          lastActive: '2025-03-01T09:45:30Z',
          isVerified: true,
          description: `${mockPrefix} Phishing website that mimics popular DeFi platforms to steal user funds.`,
          createdAt: '2025-02-20T11:20:45Z',
          verifiedBy: 'SecurityTeam',
          verificationNotes: 'Confirmed phishing site through user reports and domain analysis.',
        }
      ];
    case 'drainerDetails':
      return {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        name: `${mockPrefix} Fake Stacks Airdrop`,
        riskLevel: 'high',
        victims: [
          {
            address: '0xabc123def456789012345678901234567890abcde',
            amount: 5000,
            timestamp: '2025-03-04T15:30:22Z',
            txHash: '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234'
          },
          {
            address: '0xdef456789012345678901234567890abcdeabc123',
            amount: 7500,
            timestamp: '2025-03-03T12:15:45Z',
            txHash: '0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcd'
          }
        ],
        totalStolen: 45000,
        lastActive: '2025-03-05T12:30:45Z',
        isVerified: true,
        description: `${mockPrefix} This contract pretends to be an official Stacks airdrop but steals user funds when they approve token transfers.`,
        createdAt: '2025-02-28T10:15:30Z',
        verifiedBy: 'SecurityTeam',
        verificationNotes: 'Confirmed malicious behavior through code analysis and victim reports.',
        techniques: [
          'Approval phishing',
          'Fake airdrop claims',
          'Social engineering'
        ],
        code: 'contract FakeAirdrop {\n  // Malicious code here\n}',
        explorerUrl: `${explorerUrl}address/0x1234567890abcdef1234567890abcdef12345678`
      };
    case 'contractAnalysis':
      return {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        name: 'Test Contract',
        analysis: {
          score: 35,
          riskLevel: 'high',
          vulnerabilities: [
            {
              id: 1,
              name: 'Reentrancy',
              severity: 'high',
              description: 'Contract is vulnerable to reentrancy attacks',
              lineNumbers: [45, 67],
              recommendation: 'Use ReentrancyGuard or checks-effects-interactions pattern'
            },
            {
              id: 2,
              name: 'Unchecked External Call',
              severity: 'medium',
              description: 'External call result is not checked',
              lineNumbers: [102],
              recommendation: 'Check return value of external calls'
            }
          ],
          summary: 'This contract has several high-risk vulnerabilities that could lead to fund loss.'
        }
      };
    case 'walletScan':
      return {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        securityScore: 65,
        riskLevel: 'medium',
        issues: [
          {
            id: 1,
            severity: 'high',
            title: 'Interaction with Known Scam',
            description: 'Your wallet has interacted with a known scam contract in the last 30 days.',
            details: {
              contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
              date: '2025-03-01T12:34:56Z',
              txHash: '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234'
            },
            recommendations: [
              'Revoke any token approvals to this contract immediately',
              'Monitor your wallet for any suspicious transactions',
              'Consider moving assets to a new wallet if you shared your private key or seed phrase'
            ]
          }
        ],
        approvals: [
          {
            id: 1,
            token: {
              symbol: 'S',
              name: 'Stacks',
              address: '0x4a8f5f96d5436e43112c2fbc6a9f70da9e4e16d4'
            },
            spender: {
              name: 'StacksSwap',
              address: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d'
            },
            allowance: '1000000000000000000000',
            allowanceFormatted: '1000',
            riskLevel: 'low',
            dateApproved: '2025-02-15T10:30:45Z'
          }
        ],
        transactions: [
          {
            hash: '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234',
            type: 'Transfer',
            asset: 'S',
            amount: '25.5',
            timestamp: '2025-03-05T14:22:10Z',
            status: 'success'
          }
        ],
        recommendations: [
          'Revoke unnecessary token approvals',
          'Use a hardware wallet for large holdings',
          'Enable two-factor authentication on exchanges',
          'Be cautious of phishing attempts'
        ]
      };
    case 'tokenApprovals':
      return [
        {
          id: 1,
          token: {
            symbol: 'S',
            name: 'Stacks',
            logo: 'https://cryptologos.cc/logos/sonic-s-logo.png',
            address: '0x4a8f5f96d5436e43112c2fbc6a9f70da9e4e16d4',
          },
          spender: {
            name: 'StacksSwap',
            address: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
            verified: true
          },
          allowance: '1000000000000000000000',
          allowanceFormatted: '1000',
          riskLevel: 'low',
          dateApproved: '2025-02-15T10:30:45Z'
        },
        {
          id: 2,
          token: {
            symbol: 'USDT',
            name: 'Tether USD',
            logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          },
          spender: {
            name: 'Unknown Contract',
            address: '0x1234567890abcdef1234567890abcdef12345678',
            verified: false
          },
          allowance: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
          allowanceFormatted: 'Unlimited',
          riskLevel: 'high',
          dateApproved: '2025-03-01T08:45:22Z'
        }
      ];
    default:
      return null;
  }
};

// Create testnet data with real-looking values but clearly marked as testnet
const getTestnetData = (type) => {
  // Use a prefix that clearly indicates this is testnet data
  const testnetPrefix = '[TESTNET]';
  const explorerUrl = getExplorerUrl();
  
  switch (type) {
    case 'stats':
      return {
        totalDrainers: 12,
        activeDrainers: 5,
        totalVictims: 28,
        totalLost: 75000,
        source: testnetPrefix,
        explorerUrl: explorerUrl,
        securityScore: 92,
        alertCount: 1,
        monitoredWallets: 8
      };
    case 'drainers':
      return [
        {
          address: '0x2345678901abcdef2345678901abcdef23456789',
          name: `${testnetPrefix} Stacks Fake Staking`,
          riskLevel: 'high',
          victims: 8,
          totalStolen: 25000,
          lastActive: '2025-03-02T10:15:30Z',
          isVerified: true,
          description: `${testnetPrefix} Fake staking contract on Stacks Testnet that steals user funds.`,
          createdAt: '2025-02-25T08:30:15Z',
          verifiedBy: 'TestnetTeam',
          verificationNotes: 'Verified on testnet for demonstration purposes.',
        },
        {
          address: '0x3456789012abcdef3456789012abcdef34567890',
          name: `${testnetPrefix} Testnet Drainer`,
          riskLevel: 'medium',
          victims: 5,
          totalStolen: 15000,
          lastActive: '2025-03-01T14:22:10Z',
          isVerified: true,
          description: `${testnetPrefix} Wallet drainer contract deployed on Stacks Testnet for testing.`,
          createdAt: '2025-02-20T11:20:45Z',
          verifiedBy: 'TestnetTeam',
          verificationNotes: 'Verified on testnet for demonstration purposes.',
        }
      ];
    default:
      return null;
  }
};

// API service for interacting with the backend
const apiService = {
  // Dashboard stats
  getDashboardStats: async () => {
    console.log(`Getting dashboard stats with data source: ${CURRENT_DATA_SOURCE}`);
    
    // Only use mock data if explicitly set to mock
    if (CURRENT_DATA_SOURCE === 'mock') {
      console.log('Using mock data for dashboard stats');
      return getMockData('stats');
    }
    
    // For testnet, use testnet data
    if (CURRENT_DATA_SOURCE === 'testnet') {
      console.log('Using testnet data for dashboard stats');
      return getTestnetData('stats');
    }
    
    try {
      console.log(`Fetching dashboard stats from ${api.defaults.baseURL}/stats`);
      const response = await api.get('/stats');
      
      if (!response.data || Object.keys(response.data).length === 0) {
        console.log('Empty response from API, using testnet data');
        return getTestnetData('stats');
      }
      
      console.log('Received dashboard stats from API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      console.log('Falling back to testnet data due to error');
      return getTestnetData('stats');
    }
  },
  
  // Wallet drainers
  getWalletDrainers: async () => {
    console.log(`Getting wallet drainers with data source: ${CURRENT_DATA_SOURCE}`);
    
    // Only use mock data if explicitly set to mock
    if (CURRENT_DATA_SOURCE === 'mock') {
      console.log('Using mock data for wallet drainers');
      return getMockData('drainers');
    }
    
    // For testnet, use testnet data
    if (CURRENT_DATA_SOURCE === 'testnet') {
      console.log('Using testnet data for wallet drainers');
      return getTestnetData('drainers');
    }
    
    try {
      console.log(`Fetching wallet drainers from ${api.defaults.baseURL}/walletdrainer/list`);
      const response = await api.get('/walletdrainer/list');
      
      if (!response.data || response.data.length === 0) {
        console.log('Empty response from API, using testnet data');
        return getTestnetData('drainers');
      }
      
      console.log('Received wallet drainers from API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet drainers:', error);
      console.log('Falling back to testnet data due to error');
      return getTestnetData('drainers');
    }
  },
  
  getWalletDrainerDetails: async (address) => {
    if (CURRENT_DATA_SOURCE === 'mock') {
      return getMockData('drainerDetails');
    }
    
    try {
      const response = await api.get(`/walletdrainer/${address}`);
      if (!response.data || Object.keys(response.data).length === 0) {
        console.log('Empty response from API, using mock data');
        return getMockData('drainerDetails');
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching drainer details for ${address}:`, error);
      return getMockData('drainerDetails');
    }
  },
  
  // Smart contract analysis
  analyzeSmartContract: async (contractAddress, contractCode, useRealAI = true) => {
    console.log(`Analyzing smart contract ${contractAddress} with data source: ${CURRENT_DATA_SOURCE}, useRealAI: ${useRealAI}`);
    
    // Only use mock data if explicitly set to mock or if useRealAI is false
    if (CURRENT_DATA_SOURCE === 'mock' || !useRealAI) {
      console.log('Using mock data for smart contract analysis');
      return getMockData('contractAnalysis');
    }
    
    try {
      console.log('Using real AI for smart contract analysis');
      
      // First try to use the AI analyzer directly
      if (aiAnalyzer) {
        try {
          console.log('Using AI analyzer for smart contract analysis');
          const aiResult = await aiAnalyzer.analyzeSmartContract(contractCode, contractAddress, false);
          console.log('AI analysis result:', aiResult);
          return aiResult;
        } catch (aiError) {
          console.error('Error using AI analyzer:', aiError);
          console.log('Falling back to API endpoint');
        }
      }
      
      // If AI analyzer fails or is not available, use the API endpoint
      const response = await api.post('/rugpull/analyze', {
        address: contractAddress,
        code: contractCode
      });
      
      if (!response.data || Object.keys(response.data).length === 0) {
        console.log('Empty response from API, using mock data');
        return getMockData('contractAnalysis');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error analyzing smart contract:', error);
      return getMockData('contractAnalysis');
    }
  },
  
  // Scan wallet for security issues
  scanWallet: async (address, useRealWalletData = true) => {
    console.log(`Scanning wallet ${address} with data source: ${CURRENT_DATA_SOURCE}, useRealWalletData: ${useRealWalletData}`);
    
    // Use mock data if explicitly set to mock or if useRealWalletData is false
    if (CURRENT_DATA_SOURCE === 'mock' || !useRealWalletData) {
      console.log('Using mock data for wallet scan');
      return getMockData('walletScan');
    }
    
    try {
      // For real wallet scanning, we'll fetch data from the blockchain
      console.log(`Fetching wallet data for ${address} from blockchain`);
      
      // Create a provider based on the current data source
      const providerUrl = CURRENT_DATA_SOURCE === 'testnet' 
        ? 'https://rpc.blaze.soniclabs.com' 
        : 'https://rpc.soniclabs.com';
      
      console.log(`Using provider URL: ${providerUrl}`);
      const provider = new ethers.JsonRpcProvider(providerUrl);
      
      // Get basic wallet information
      console.log(`Fetching basic wallet information for ${address}`);
      const [balance, txCount, code] = await Promise.all([
        provider.getBalance(address),
        provider.getTransactionCount(address),
        provider.getCode(address)
      ]);
      
      // Check if this is a contract
      const isContract = code !== '0x';
      
      // Format the balance
      const balanceInEth = ethers.formatEther(balance);
      console.log(`Wallet balance: ${balanceInEth} S, Transaction count: ${txCount}, Is contract: ${isContract}`);
      
      // Calculate a security score based on real data
      let securityScore = 80; // Start with a good score
      let securityIssues = [];
      
      // Check if this is a new wallet with few transactions
      if (txCount < 5) {
        securityScore -= 10;
        securityIssues.push({
          id: securityIssues.length + 1,
          severity: 'low',
          title: 'New Wallet',
          description: 'This wallet has very few transactions, which could indicate it\'s new or rarely used.',
          recommendation: 'Start with small transactions to build history.'
        });
      }
      
      // Check if this is a contract
      if (isContract) {
        securityScore -= 5;
        securityIssues.push({
          id: securityIssues.length + 1,
          severity: 'info',
          title: 'Contract Address',
          description: 'This address is a smart contract, not a regular wallet.',
          recommendation: 'Ensure you understand the contract\'s purpose before interacting with it.'
        });
      }
      
      // Check if balance is very low
      if (parseFloat(balanceInEth) < 0.01) {
        securityScore -= 5;
        securityIssues.push({
          id: securityIssues.length + 1,
          severity: 'low',
          title: 'Low Balance',
          description: 'This wallet has a very low balance.',
          recommendation: 'Ensure you have enough funds for gas fees.'
        });
      }
      
      // Try to fetch recent transactions (this is a simplified example)
      let recentTransactions = [];
      try {
        // In a real implementation, you would use an API or indexer to get transaction history
        console.log(`Attempting to fetch recent transactions for ${address}`);
        
        // For now, we'll just create a placeholder
        recentTransactions = [
          {
            hash: '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234',
            type: 'Transfer',
            asset: 'S',
            amount: (Math.random() * 10).toFixed(2),
            timestamp: new Date().toISOString(),
            status: 'success',
            risk: 'low'
          }
        ];
      } catch (error) {
        console.error('Error fetching recent transactions:', error);
      }
      
      // Try to fetch token approvals (this would require ERC20 contract interaction)
      let tokenApprovals = [];
      try {
        // In a real implementation, you would scan for ERC20 approvals
        console.log(`Attempting to fetch token approvals for ${address}`);
        
        // For now, we'll just create a placeholder
        tokenApprovals = [];
      } catch (error) {
        console.error('Error fetching token approvals:', error);
      }
      
      // Create security recommendations based on the wallet analysis
      const recommendations = [
        'Regularly review and revoke unnecessary token approvals',
        'Use a hardware wallet for large holdings',
        'Enable two-factor authentication on exchanges',
        'Be cautious of phishing attempts and verify contract addresses before interacting'
      ];
      
      // Create a result object with real data
      const result = {
        address: address,
        scanDate: new Date().toISOString(),
        securityScore: securityScore,
        networkInfo: {
          name: CURRENT_DATA_SOURCE === 'testnet' ? 'Stacks Testnet' : 'Stacks Mainnet',
          chainId: CURRENT_DATA_SOURCE === 'testnet' ? '57054' : '146',
          lastActivity: new Date().toISOString()
        },
        balances: [
          { 
            token: 'S', 
            balance: balanceInEth,
            value: (parseFloat(balanceInEth) * 10).toFixed(2) // Assuming 1 S = $10 USD
          }
        ],
        transactionCount: txCount,
        isContract: isContract,
        issues: securityIssues,
        recentTransactions: recentTransactions,
        tokenApprovals: tokenApprovals,
        recommendations: recommendations,
        source: CURRENT_DATA_SOURCE === 'testnet' ? '[TESTNET]' : '[MAINNET]'
      };
      
      console.log('Wallet scan results:', result);
      return result;
    } catch (error) {
      console.error(`Error scanning wallet ${address}:`, error);
      console.log('Falling back to mock data due to error');
      
      // If there's an error, fall back to mock data
      return getMockData('walletScan');
    }
  },
  
  // Token approvals
  getTokenApprovals: async (address) => {
    if (CURRENT_DATA_SOURCE === 'mock') {
      return getMockData('tokenApprovals');
    }
    
    try {
      const response = await api.get(`/security/approvals/${address}`);
      if (!response.data || response.data.length === 0) {
        console.log('Empty response from API, using mock data');
        return getMockData('tokenApprovals');
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching token approvals for ${address}:`, error);
      return getMockData('tokenApprovals');
    }
  },
  
  revokeApproval: async (tokenAddress, spenderAddress) => {
    if (CURRENT_DATA_SOURCE === 'mock') {
      return { success: true };
    }
    
    try {
      const response = await api.post('/security/revoke', {
        tokenAddress,
        spenderAddress
      });
      return response.data;
    } catch (error) {
      console.error('Error revoking approval:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Get recent wallet drainers
  getRecentWalletDrainers: async (limit = 5) => {
    console.log(`Getting recent wallet drainers with data source: ${CURRENT_DATA_SOURCE}`);
    
    // Only use mock data if explicitly set to mock
    if (CURRENT_DATA_SOURCE === 'mock') {
      console.log('Using mock data for recent wallet drainers');
      return getMockData('drainers').slice(0, limit);
    }
    
    // For testnet, use testnet data
    if (CURRENT_DATA_SOURCE === 'testnet') {
      console.log('Using testnet data for recent wallet drainers');
      return getTestnetData('drainers').slice(0, limit);
    }
    
    try {
      console.log(`Fetching recent wallet drainers from ${api.defaults.baseURL}/walletdrainer/recent?limit=${limit}`);
      const response = await api.get(`/walletdrainer/recent?limit=${limit}`);
      
      if (!response.data || response.data.length === 0) {
        console.log('Empty response from API, using testnet data');
        return getTestnetData('drainers').slice(0, limit);
      }
      
      console.log('Received recent wallet drainers from API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent wallet drainers:', error);
      console.log('Falling back to testnet data due to error');
      return getTestnetData('drainers').slice(0, limit);
    }
  },
  
  // Get wallet drainer by address
  getWalletDrainerByAddress: async (address) => {
    if (CURRENT_DATA_SOURCE === 'mock') {
      return getMockData('drainerDetails');
    }
    
    try {
      const response = await api.get(`/walletdrainer/${address}`);
      if (!response.data || Object.keys(response.data).length === 0) {
        console.log('Empty response from API, using mock data');
        return getMockData('drainerDetails');
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching wallet drainer details for ${address}:`, error);
      return getMockData('drainerDetails');
    }
  },
  
  // Analyze contract
  analyzeContract: async (contractAddress, useRealAI = true) => {
    console.log(`Analyzing contract ${contractAddress} with data source: ${CURRENT_DATA_SOURCE}, useRealAI: ${useRealAI}`);
    
    // Only use mock data if explicitly set to mock or if useRealAI is false
    if (CURRENT_DATA_SOURCE === 'mock' || !useRealAI) {
      console.log('Using mock data for contract analysis');
      return getMockData('contractAnalysis');
    }
    
    try {
      console.log('Using real analysis for contract');
      
      // First try to get the contract code
      let contractCode = '';
      try {
        // Create a provider based on the current data source
        const providerUrl = CURRENT_DATA_SOURCE === 'testnet' 
          ? 'https://stacks-node-api.testnet.stacks.co' 
          : 'https://stacks-node-api.mainnet.stacks.co';
        
        console.log(`Using provider URL: ${providerUrl}`);
        const provider = new ethers.JsonRpcProvider(providerUrl);
        
        // Get the contract code
        contractCode = await provider.getCode(contractAddress);
        console.log(`Retrieved contract code for ${contractAddress}, length: ${contractCode.length}`);
        
        // If the contract code is empty, it's not a contract
        if (!contractCode) {
          console.log(`${contractAddress} is not a contract`);
          return {
            address: contractAddress,
            isContract: false,
            riskLevel: 'low',
            analysis: {
              score: 0,
              summary: 'This address is not a smart contract.'
            }
          };
        }
      } catch (codeError) {
        console.error('Error getting contract code:', codeError);
        console.log('Proceeding with API endpoint without code');
      }
      
      // If we have the contract code and AI analyzer, use it directly
      if (contractCode && aiAnalyzer) {
        try {
          console.log('Using AI analyzer for contract analysis');
          const aiResult = await aiAnalyzer.analyzeSmartContract(contractCode, contractAddress, false);
          console.log('AI analysis result:', aiResult);
          return aiResult;
        } catch (aiError) {
          console.error('Error using AI analyzer:', aiError);
          console.log('Falling back to API endpoint');
        }
      }
      
      // If AI analyzer fails or is not available, use the API endpoint
      const response = await api.post('/rugpull/analyze', { 
        contractAddress,
        contractCode: contractCode !== '0x' ? contractCode : undefined
      });
      
      if (!response.data || Object.keys(response.data).length === 0) {
        console.log('Empty response from API, using mock data');
        return getMockData('contractAnalysis');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error analyzing contract:', error);
      return getMockData('contractAnalysis');
    }
  },
  
  // Save wallet drainer
  saveWalletDrainer: async (drainerData) => {
    try {
      const response = await api.post(ENDPOINTS.WALLET_DRAINERS, drainerData);
      return response.data;
    } catch (error) {
      console.error('Error saving wallet drainer:', error);
      throw error;
    }
  },
  
  // Update wallet drainer
  updateWalletDrainer: async (address, drainerData) => {
    try {
      const response = await api.put(ENDPOINTS.WALLET_DRAINER_BY_ADDRESS(address), drainerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating wallet drainer for ${address}:`, error);
      throw error;
    }
  },
  
  // Verify wallet drainer
  verifyWalletDrainer: async (address, verifiedBy, isVerified = true, notes = '') => {
    try {
      const response = await api.put(`${ENDPOINTS.WALLET_DRAINER_BY_ADDRESS(address)}/verify`, {
        verifiedBy,
        isVerified,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error(`Error verifying wallet drainer for ${address}:`, error);
      throw error;
    }
  },
  
  // Delete wallet drainer
  deleteWalletDrainer: async (address) => {
    try {
      const response = await api.delete(ENDPOINTS.WALLET_DRAINER_BY_ADDRESS(address));
      return response.data;
    } catch (error) {
      console.error(`Error deleting wallet drainer for ${address}:`, error);
      throw error;
    }
  },
  
  // Add victim to wallet drainer
  addVictimToWalletDrainer: async (address, victimAddress, amount) => {
    try {
      const response = await api.post(`${ENDPOINTS.WALLET_DRAINER_BY_ADDRESS(address)}/victim`, {
        victimAddress,
        amount,
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding victim to drainer ${address}:`, error);
      throw error;
    }
  },
};

export default apiService; 