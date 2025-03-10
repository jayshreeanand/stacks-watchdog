/**
 * Mock data for the Sonic Shield AI application
 * This is used when the API is not available
 */

// Mock wallet drainers
export const mockWalletDrainers = [
  {
    id: 1,
    address: '0x1234567890abcdef1234567890abcdef12345678',
    name: '[MOCK] Fake Sonic Airdrop',
    type: 'Approval Drainer',
    riskLevel: 'high',
    victims: 12,
    totalStolen: 25000,
    lastActive: '2025-03-05T12:30:45Z',
    isVerified: true,
    description: 'This contract pretends to be an official Sonic airdrop but steals user funds when they approve token transfers.',
    createdAt: '2025-02-28T10:15:30Z',
    verifiedBy: 'SecurityTeam',
    techniques: [
      'Approval phishing',
      'Fake airdrop claims',
      'Social engineering'
    ]
  },
  {
    id: 2,
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    name: '[MOCK] S Staking Scam',
    type: 'Phishing Site',
    riskLevel: 'critical',
    victims: 47,
    totalStolen: 120000,
    lastActive: '2025-03-07T08:45:12Z',
    isVerified: true,
    description: 'Fake staking platform that promises high returns but steals deposited S tokens.',
    createdAt: '2025-01-15T14:22:10Z',
    verifiedBy: 'SecurityTeam',
    techniques: [
      'Fake staking platform',
      'Unlimited token approvals',
      'Honeypot contract'
    ]
  },
  {
    address: '0x7890abcdef1234567890abcdef1234567890abcd',
    name: 'Fake DEX Frontend',
    riskLevel: 'medium',
    victims: 5,
    totalStolen: 18000,
    lastActive: '2025-03-03T09:45:11Z',
    isVerified: false,
    description: 'Cloned DEX interface that routes transactions through malicious contracts.',
    createdAt: '2025-03-01T11:20:45Z',
  },
  {
    address: '0x567890abcdef1234567890abcdef1234567890ab',
    name: 'Sonic Token Bridge Scam',
    riskLevel: 'high',
    victims: 9,
    totalStolen: 67000,
    lastActive: '2025-03-02T14:22:33Z',
    isVerified: true,
    description: 'Fake bridge that claims to transfer Sonic between chains but steals the tokens.',
    createdAt: '2025-02-27T16:40:10Z',
    verifiedBy: 'CommunityMember',
    verificationNotes: 'Contract analysis shows no actual bridge functionality.',
  },
  {
    address: '0x90abcdef1234567890abcdef1234567890abcdef',
    name: 'Fake Wallet App',
    riskLevel: 'low',
    victims: 2,
    totalStolen: 5000,
    lastActive: '2025-03-01T08:11:05Z',
    isVerified: false,
    description: 'Mobile app that claims to be an Sonic wallet but steals private keys.',
    createdAt: '2025-03-01T07:55:30Z',
  },
];

// Mock dashboard stats
export const mockDashboardStats = {
  totalDrainers: 156,
  activeDrainers: 42,
  totalVictims: 328,
  totalLost: 1250000,
  source: 'MOCK DATA'
};

// Mock contract analysis result
export const mockContractAnalysis = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  riskLevel: 'high',
  riskScore: 85,
  name: 'Suspicious Token Contract',
  isKnownDrainer: false,
  findings: [
    { type: 'high', message: 'Contains approval frontrunning vulnerability' },
    { type: 'high', message: 'Unauthorized token transfer functions detected' },
    { type: 'medium', message: 'Owner has excessive privileges' },
    { type: 'low', message: 'Missing input validation' },
  ],
  recommendations: [
    'Do not approve tokens to this contract',
    'Avoid any interaction with this contract',
    'Report to the Sonic security team',
  ],
};

// Mock API service
export const mockApiService = {
  // Get all wallet drainers
  getAllWalletDrainers: () => {
    return Promise.resolve(mockWalletDrainers);
  },
  
  // Get recent wallet drainers
  getRecentWalletDrainers: (limit = 5) => {
    return Promise.resolve(mockWalletDrainers.slice(0, limit));
  },
  
  // Get wallet drainer by address
  getWalletDrainerByAddress: (address) => {
    const drainer = mockWalletDrainers.find(d => d.address.toLowerCase() === address.toLowerCase());
    if (drainer) {
      // Add mock victims data
      return Promise.resolve({
        ...drainer,
        victims: [
          {
            address: '0xf5a3467b6bb35c9619310e213c413c7f614a1d33',
            amount: 12000,
            timestamp: '2025-03-05T12:30:45Z',
          },
          {
            address: '0x3a2c7b4e3b3e3b3e3b3e3b3e3b3e3b3e3b3e3b3e',
            amount: 8000,
            timestamp: '2025-03-04T09:22:15Z',
          },
          {
            address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
            amount: 25000,
            timestamp: '2025-03-01T14:45:33Z',
          },
        ]
      });
    }
    return Promise.reject(new Error('Wallet drainer not found'));
  },
  
  // Analyze contract
  analyzeContract: (contractAddress) => {
    return Promise.resolve({
      ...mockContractAnalysis,
      address: contractAddress
    });
  },
  
  // Get dashboard stats
  getDashboardStats: () => {
    return Promise.resolve(mockDashboardStats);
  }
};

// Mock security recommendations
export const mockSecurityRecommendations = [
  'Use a hardware wallet for storing significant amounts of crypto',
  'Enable two-factor authentication on all exchange accounts',
  'Never share your private keys or seed phrases with anyone',
  'Be cautious of projects offering unrealistic returns',
  'Verify smart contract addresses before interacting',
  'Report suspicious activities to the Sonic security team',
  'Keep your software and firmware updated',
  'Use different passwords for different platforms',
  'Check token approvals regularly and revoke unnecessary ones',
  'Research projects thoroughly before investing'
]; 