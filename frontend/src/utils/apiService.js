import axios from 'axios';
import { mockApiService } from './mockData';

// API base URL - will be dynamically set based on data source
let API_BASE_URL = '/api';
let CURRENT_DATA_SOURCE = 'mock';

// Block explorer URLs
export const explorerUrls = {
  mock: process.env.REACT_APP_TESTNET_EXPLORER_URL || 'https://testnet.sonicscan.org/',
  testnet: process.env.REACT_APP_TESTNET_EXPLORER_URL || 'https://testnet.sonicscan.org/',
  mainnet: process.env.REACT_APP_MAINNET_EXPLORER_URL || 'https://sonicscan.org/'
};

// API endpoints
const ENDPOINTS = {
  WALLET_DRAINERS: `${API_BASE_URL}/walletdrainer`,
  RECENT_WALLET_DRAINERS: `${API_BASE_URL}/walletdrainer/recent`,
  WALLET_DRAINER_BY_ADDRESS: (address) => `${API_BASE_URL}/walletdrainer/${address}`,
  ANALYZE_CONTRACT: `${API_BASE_URL}/walletdrainer/analyze`,
  STATS: `${API_BASE_URL}/stats`,
};

// Function to update the API base URL based on data source
export const setApiBaseUrl = (dataSource) => {
  console.log(`Switching data source to: ${dataSource}`);
  CURRENT_DATA_SOURCE = dataSource;
  
  switch (dataSource) {
    case 'mock':
      API_BASE_URL = process.env.REACT_APP_MOCK_API_URL || '/api';
      console.log(`Using Mock API URL: ${API_BASE_URL}`);
      break;
    case 'testnet':
      API_BASE_URL = process.env.REACT_APP_TESTNET_API_URL || '/api';
      console.log(`Using Testnet API URL: ${API_BASE_URL}`);
      break;
    case 'mainnet':
      API_BASE_URL = process.env.REACT_APP_MAINNET_API_URL || '/api';
      console.log(`Using Mainnet API URL: ${API_BASE_URL}`);
      break;
    default:
      API_BASE_URL = '/api';
      console.log(`Using default API URL: ${API_BASE_URL}`);
  }
  
  // Update all endpoints with the new base URL
  ENDPOINTS.WALLET_DRAINERS = `${API_BASE_URL}/walletdrainer`;
  ENDPOINTS.RECENT_WALLET_DRAINERS = `${API_BASE_URL}/walletdrainer/recent`;
  ENDPOINTS.ANALYZE_CONTRACT = `${API_BASE_URL}/walletdrainer/analyze`;
  ENDPOINTS.STATS = `${API_BASE_URL}/stats`;
  
  console.log('Updated endpoints:', ENDPOINTS);
};

// Get the current block explorer URL
export const getExplorerUrl = () => {
  return explorerUrls[CURRENT_DATA_SOURCE] || explorerUrls.testnet;
};

// Get transaction URL in block explorer
export const getTransactionUrl = (txHash) => {
  return `${getExplorerUrl()}tx/${txHash}`;
};

// Get address URL in block explorer
export const getAddressUrl = (address) => {
  return `${getExplorerUrl()}address/${address}`;
};

// Get token URL in block explorer
export const getTokenUrl = (tokenAddress) => {
  return `${getExplorerUrl()}token/${tokenAddress}`;
};

// Get mock data based on current data source
const getMockData = (type) => {
  // Create distinct mock data for each data source to make it obvious which one is being used
  const mockPrefix = CURRENT_DATA_SOURCE === 'mock' ? '[MOCK]' : 
                    CURRENT_DATA_SOURCE === 'testnet' ? '[TESTNET]' : '[MAINNET]';
  
  // Get the appropriate explorer URL
  const explorerUrl = getExplorerUrl();
  
  switch (type) {
    case 'stats':
      return {
        totalDrainers: CURRENT_DATA_SOURCE === 'mock' ? 156 : 
                       CURRENT_DATA_SOURCE === 'testnet' ? 42 : 78,
        activeDrainers: CURRENT_DATA_SOURCE === 'mock' ? 42 : 
                        CURRENT_DATA_SOURCE === 'testnet' ? 12 : 23,
        totalVictims: CURRENT_DATA_SOURCE === 'mock' ? 328 : 
                      CURRENT_DATA_SOURCE === 'testnet' ? 89 : 156,
        totalLost: CURRENT_DATA_SOURCE === 'mock' ? 1250000 : 
                  CURRENT_DATA_SOURCE === 'testnet' ? 350000 : 750000,
        source: `${mockPrefix} DATA`,
        explorerUrl: explorerUrl
      };
    case 'drainers':
      return [
        {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          name: `${mockPrefix} Fake Sonic Airdrop`,
          riskLevel: 'high',
          victims: CURRENT_DATA_SOURCE === 'mock' ? 12 : 
                  CURRENT_DATA_SOURCE === 'testnet' ? 5 : 18,
          totalStolen: CURRENT_DATA_SOURCE === 'mock' ? 45000 : 
                      CURRENT_DATA_SOURCE === 'testnet' ? 15000 : 75000,
          lastActive: '2025-03-05T12:30:45Z',
          isVerified: true,
          description: `${mockPrefix} This contract pretends to be an official Sonic airdrop but steals user funds when they approve token transfers.`,
          createdAt: '2025-02-28T10:15:30Z',
          verifiedBy: 'SecurityTeam',
          verificationNotes: 'Confirmed malicious behavior through code analysis and victim reports.',
        },
        {
          address: '0xabcdef1234567890abcdef1234567890abcdef12',
          name: `${mockPrefix} Sonic Staking Scam`,
          riskLevel: 'critical',
          victims: CURRENT_DATA_SOURCE === 'mock' ? 28 : 
                  CURRENT_DATA_SOURCE === 'testnet' ? 8 : 35,
          totalStolen: CURRENT_DATA_SOURCE === 'mock' ? 120000 : 
                      CURRENT_DATA_SOURCE === 'testnet' ? 40000 : 180000,
          lastActive: '2025-03-04T18:15:22Z',
          isVerified: true,
          description: `${mockPrefix} Fake staking platform that promises high returns but steals deposited Sonic tokens.`,
          createdAt: '2025-02-25T08:30:15Z',
          verifiedBy: 'SecurityTeam',
          verificationNotes: 'Multiple victim reports confirmed. Contract has backdoor functions.',
        },
        {
          address: '0x7890abcdef1234567890abcdef1234567890abcd',
          name: `${mockPrefix} Fake DEX Frontend`,
          riskLevel: 'medium',
          victims: CURRENT_DATA_SOURCE === 'mock' ? 5 : 
                  CURRENT_DATA_SOURCE === 'testnet' ? 3 : 8,
          totalStolen: CURRENT_DATA_SOURCE === 'mock' ? 18000 : 
                      CURRENT_DATA_SOURCE === 'testnet' ? 9000 : 27000,
          lastActive: '2025-03-03T09:45:11Z',
          isVerified: false,
          description: `${mockPrefix} Cloned DEX interface that routes transactions through malicious contracts.`,
          createdAt: '2025-03-01T11:20:45Z',
        },
        {
          address: '0x567890abcdef1234567890abcdef1234567890ab',
          name: `${mockPrefix} Sonic Token Bridge Scam`,
          riskLevel: 'high',
          victims: CURRENT_DATA_SOURCE === 'mock' ? 9 : 
                  CURRENT_DATA_SOURCE === 'testnet' ? 4 : 14,
          totalStolen: CURRENT_DATA_SOURCE === 'mock' ? 67000 : 
                      CURRENT_DATA_SOURCE === 'testnet' ? 30000 : 95000,
          lastActive: '2025-03-02T14:22:33Z',
          isVerified: true,
          description: `${mockPrefix} Fake bridge that claims to transfer ETN between chains but steals the tokens.`,
          createdAt: '2025-02-27T16:40:10Z',
          verifiedBy: 'CommunityMember',
          verificationNotes: 'Contract analysis shows no actual bridge functionality.',
        },
        {
          address: '0x90abcdef1234567890abcdef1234567890abcdef',
          name: `${mockPrefix} Fake Wallet App`,
          riskLevel: 'low',
          victims: CURRENT_DATA_SOURCE === 'mock' ? 2 : 
                  CURRENT_DATA_SOURCE === 'testnet' ? 1 : 3,
          totalStolen: CURRENT_DATA_SOURCE === 'mock' ? 5000 : 
                      CURRENT_DATA_SOURCE === 'testnet' ? 2000 : 8000,
          lastActive: '2025-03-01T08:11:05Z',
          isVerified: false,
          description: `${mockPrefix} Mobile app that claims to be an Sonic wallet but steals private keys.`,
          createdAt: '2025-03-01T07:55:30Z',
        }
      ];
    default:
      return null;
  }
};

// API service with fallback to mock data
const apiService = {
  // Flag to force using mock data
  forceMockData: false,
  
  // Set whether to force mock data
  setForceMockData: (force) => {
    console.log(`Setting forceMockData to ${force}`);
    apiService.forceMockData = force;
  },
  
  // Get all wallet drainers
  getAllWalletDrainers: async () => {
    // If forcing mock data, return mock data immediately
    if (apiService.forceMockData) {
      console.log('Forcing mock data for getAllWalletDrainers');
      return getMockData('drainers');
    }
    
    try {
      console.log(`Fetching wallet drainers from ${ENDPOINTS.WALLET_DRAINERS}`);
      const response = await axios.get(ENDPOINTS.WALLET_DRAINERS);
      // If the API returns an empty array, use mock data
      if (Array.isArray(response.data) && response.data.length === 0) {
        console.log('API returned empty array, using mock data');
        return getMockData('drainers');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet drainers:', error);
      console.log('Falling back to mock data');
      return getMockData('drainers');
    }
  },
  
  // Get recent wallet drainers
  getRecentWalletDrainers: async (limit = 5) => {
    // If forcing mock data, return mock data immediately
    if (apiService.forceMockData) {
      console.log('Forcing mock data for getRecentWalletDrainers');
      return getMockData('drainers').slice(0, limit);
    }
    
    try {
      console.log(`Fetching recent wallet drainers from ${ENDPOINTS.RECENT_WALLET_DRAINERS}?limit=${limit}`);
      const response = await axios.get(`${ENDPOINTS.RECENT_WALLET_DRAINERS}?limit=${limit}`);
      // If the API returns an empty array, use mock data
      if (Array.isArray(response.data) && response.data.length === 0) {
        console.log('API returned empty array, using mock data');
        return getMockData('drainers').slice(0, limit);
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching recent wallet drainers:', error);
      console.log('Falling back to mock data');
      return getMockData('drainers').slice(0, limit);
    }
  },
  
  // Get dashboard stats
  getDashboardStats: async () => {
    // If forcing mock data, return mock data immediately
    if (apiService.forceMockData) {
      console.log('Forcing mock data for getDashboardStats');
      return getMockData('stats');
    }
    
    try {
      console.log(`Fetching dashboard stats from ${ENDPOINTS.STATS}`);
      const response = await axios.get(ENDPOINTS.STATS);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      console.log('Falling back to mock data');
      return getMockData('stats');
    }
  },
  
  // Get wallet drainer by address
  getWalletDrainerByAddress: async (address) => {
    // If forcing mock data, return mock data immediately
    if (apiService.forceMockData) {
      return mockApiService.getWalletDrainerByAddress(address);
    }
    
    try {
      const response = await axios.get(ENDPOINTS.WALLET_DRAINER_BY_ADDRESS(address));
      return response.data;
    } catch (error) {
      console.error(`Error fetching wallet drainer for ${address}:`, error);
      console.log('Falling back to mock data');
      return mockApiService.getWalletDrainerByAddress(address);
    }
  },
  
  // Analyze contract
  analyzeContract: async (contractAddress) => {
    try {
      const response = await axios.post(ENDPOINTS.ANALYZE_CONTRACT, { contractAddress });
      return response.data;
    } catch (error) {
      console.error('Error analyzing contract:', error);
      console.log('Falling back to mock data');
      return mockApiService.analyzeContract(contractAddress);
    }
  },
  
  // Save wallet drainer
  saveWalletDrainer: async (drainerData) => {
    try {
      const response = await axios.post(ENDPOINTS.WALLET_DRAINERS, drainerData);
      return response.data;
    } catch (error) {
      console.error('Error saving wallet drainer:', error);
      throw error;
    }
  },
  
  // Update wallet drainer
  updateWalletDrainer: async (address, drainerData) => {
    try {
      const response = await axios.put(ENDPOINTS.WALLET_DRAINER_BY_ADDRESS(address), drainerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating wallet drainer for ${address}:`, error);
      throw error;
    }
  },
  
  // Verify wallet drainer
  verifyWalletDrainer: async (address, verifiedBy, isVerified = true, notes = '') => {
    try {
      const response = await axios.put(`${ENDPOINTS.WALLET_DRAINER_BY_ADDRESS(address)}/verify`, {
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
      const response = await axios.delete(ENDPOINTS.WALLET_DRAINER_BY_ADDRESS(address));
      return response.data;
    } catch (error) {
      console.error(`Error deleting wallet drainer for ${address}:`, error);
      throw error;
    }
  },
  
  // Add victim to wallet drainer
  addVictimToWalletDrainer: async (address, victimAddress, amount) => {
    try {
      const response = await axios.post(`${ENDPOINTS.WALLET_DRAINER_BY_ADDRESS(address)}/victim`, {
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