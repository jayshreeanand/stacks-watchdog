import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  useToast,
  SimpleGrid,
  Icon,
  Badge,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Input,
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaLock, FaSearch, FaWallet } from 'react-icons/fa';
import { FiShield, FiAlertTriangle, FiSearch, FiCode } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import AddressAnalyzer from '../components/AddressAnalyzer';
import BlockExplorerLink from '../components/BlockExplorerLink';
import { useDataSource } from '../context/DataSourceContext';

const SecurityScanner = () => {
  const { account } = useWallet();
  const toast = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [customAddress, setCustomAddress] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [scanOptions, setScanOptions] = useState({
    checkPermissions: true,
    checkInteractions: true,
    checkTokenApprovals: true,
    checkPhishing: true,
  });
  
  const { dataSource, getNetworkName } = useDataSource();
  
  // Move useColorModeValue calls outside of conditional rendering
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleScan = () => {
    // Validate if we have an address to scan
    const addressToScan = account || customAddress;
    
    // Check if MetaMask is installed if no custom address is provided
    if (!addressToScan) {
      if (!window.ethereum && !customAddress) {
        toast({
          title: 'Wallet not available',
          description: 'MetaMask or compatible wallet not detected. Please install a wallet extension or enter a custom address to scan.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      toast({
        title: 'No address provided',
        description: 'Please connect your wallet or enter a custom address to scan',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Start scanning
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    setScanResults(null);

    try {
      // Simulate scanning process
      const interval = setInterval(() => {
        setScanProgress((prevProgress) => {
          const newProgress = prevProgress + Math.random() * 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            setScanComplete(true);
            // Generate mock scan results
            generateMockResults(addressToScan);
            // Set tab index to the scan results tab (index 3)
            setTabIndex(3);
            // Show toast notification
            toast({
              title: 'Scan complete',
              description: 'Redirecting to scan results',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            return 100;
          }
          return newProgress;
        });
      }, 300);
    } catch (error) {
      console.error('Error during wallet scan:', error);
      setIsScanning(false);
      toast({
        title: 'Scan failed',
        description: error.message || 'An error occurred during the wallet scan',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const generateMockResults = (address) => {
    // Generate a more realistic security score based on the address
    const addressSum = address.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const securityScore = Math.max(30, Math.min(95, (addressSum % 65) + 30));
    
    // Create wallet drainer addresses for reference
    const drainerAddresses = [
      '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      '0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
      '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
      '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
    ];
    
    // Mock security scan results
    const results = {
      address: address,
      scanDate: new Date().toISOString(),
      securityScore: securityScore,
      networkInfo: {
        name: 'Sonic Mainnet',
        chainId: '1',
        lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      balances: [
        { token: 'S', balance: (Math.random() * 1000).toFixed(2), value: (Math.random() * 10000).toFixed(2) },
        { token: 'USDT', balance: (Math.random() * 5000).toFixed(2), value: (Math.random() * 5000).toFixed(2) },
        { token: 'WETH', balance: (Math.random() * 10).toFixed(4), value: (Math.random() * 20000).toFixed(2) },
      ],
      walletDrainers: [
        {
          id: 'wd1',
          address: drainerAddresses[0],
          name: 'SeaPort Exploiter',
          type: 'Approval Drainer',
          riskLevel: 'critical',
          detectedAt: new Date(2025, 2, 5).toISOString(),
          description: 'This contract exploits unlimited token approvals to drain assets from wallets. It mimics the SeaPort protocol interface but contains malicious code.',
          indicators: [
            'Requests unlimited token approvals',
            'Contains obfuscated code',
            'Transfers assets to hardcoded addresses',
            'Recently deployed contract with suspicious activity'
          ],
          recommendation: 'Revoke all approvals to this contract immediately and monitor your wallet for unauthorized transactions.'
        },
        {
          id: 'wd2',
          address: drainerAddresses[1],
          name: 'S Swap Scam',
          type: 'Phishing Drainer',
          riskLevel: 'high',
          detectedAt: new Date(2025, 2, 1).toISOString(),
          description: 'This contract presents itself as a token swap service but contains hidden functions that can steal tokens when approvals are granted.',
          indicators: [
            'Misleading function names',
            'Hidden admin functions',
            'No security audit',
            'Connected to known scam addresses'
          ],
          recommendation: 'Do not interact with this contract and revoke any existing approvals.'
        },
        {
          id: 'wd3',
          address: drainerAddresses[2],
          name: 'Flash Loan Exploiter',
          type: 'Smart Contract Exploit',
          riskLevel: 'high',
          detectedAt: new Date(2025, 1, 26).toISOString(),
          description: 'This contract uses flash loans to manipulate prices and drain liquidity pools. It has been involved in several DeFi exploits.',
          indicators: [
            'Uses flash loans for price manipulation',
            'Contains reentrancy vulnerabilities',
            'Interacts with multiple DeFi protocols in single transactions',
            'Abnormal gas usage patterns'
          ],
          recommendation: 'Avoid providing liquidity to pools that interact with this contract.'
        },
        {
          id: 'wd4',
          address: drainerAddresses[3],
          name: 'NFT Approval Scam',
          type: 'NFT Drainer',
          riskLevel: 'medium',
          detectedAt: new Date(2025, 1, 20).toISOString(),
          description: 'This contract requests approvals for NFT collections but transfers them to attacker wallets instead of performing the advertised service.',
          indicators: [
            'Requests approvals for entire NFT collections',
            'Suspicious transfer patterns',
            'Unverified contract code',
            'Connected to known scam websites'
          ],
          recommendation: 'Revoke NFT approvals and use item-by-item approvals instead of collection-wide approvals.'
        },
        {
          id: 'wd5',
          address: drainerAddresses[4],
          name: 'Fake Airdrop Distributor',
          type: 'Signature Exploiter',
          riskLevel: 'medium',
          detectedAt: new Date(2025, 1, 13).toISOString(),
          description: 'This contract claims to distribute airdrops but tricks users into signing malicious transactions that authorize token transfers.',
          indicators: [
            'Requests signatures for unclear purposes',
            'Misleading transaction data',
            'Unusual permission requests',
            'Links to phishing websites'
          ],
          recommendation: 'Never sign transactions or messages without understanding exactly what permissions you are granting.'
        }
      ],
      drainerInteractions: [
        {
          id: 'di1',
          drainerAddress: drainerAddresses[0],
          drainerName: 'SeaPort Exploiter',
          interactionType: 'Approval',
          asset: 'USDT',
          amount: 'Unlimited',
          timestamp: new Date(2025, 2, 5).toISOString(),
          transactionHash: '0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
          riskLevel: 'critical',
          status: 'Active',
          recommendation: 'Revoke this approval immediately using a service like revoke.cash'
        },
        {
          id: 'di2',
          drainerAddress: drainerAddresses[1],
          drainerName: 'S Swap Scam',
          interactionType: 'Swap',
          asset: 'S',
          amount: '50',
          timestamp: new Date(2025, 2, 1).toISOString(),
          transactionHash: '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
          riskLevel: 'high',
          status: 'Completed',
          recommendation: 'Monitor your wallet for unauthorized transactions and avoid further interactions'
        },
        {
          id: 'di3',
          drainerAddress: drainerAddresses[3],
          drainerName: 'NFT Approval Scam',
          interactionType: 'NFT Approval',
          asset: 'S NFT Collection',
          amount: 'All NFTs',
          timestamp: new Date(2025, 1, 23).toISOString(),
          transactionHash: '0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
          riskLevel: 'medium',
          status: 'Active',
          recommendation: 'Revoke this approval and use item-by-item approvals in the future'
        }
      ],
      issues: [
        {
          id: 1,
          severity: 'high',
          title: 'Unlimited Token Approval',
          description: `You have approved unlimited spending for USDT to contract ${address.substring(0, 10)}...${address.substring(address.length - 8)}`,
          recommendation: 'Revoke this approval or set a specific limit using a service like revoke.cash',
          affectedAsset: 'USDT',
          detectedAt: new Date(2025, 1, 23).toISOString(),
        },
        {
          id: 2,
          severity: 'high',
          title: 'Interaction with Flagged Contract',
          description: `You have interacted with a contract flagged for malicious activity: 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063`,
          recommendation: 'Avoid further interactions with this contract and revoke any approvals',
          affectedAsset: 'S',
          detectedAt: new Date(2025, 2, 3).toISOString(),
        },
        {
          id: 3,
          severity: 'medium',
          title: 'Unverified Smart Contract Interaction',
          description: `You have interacted with an unverified smart contract at 0x742d35Cc6634C0532925a3b844Bc454e4438f44e`,
          recommendation: 'Only interact with verified contracts and check their security audits',
          affectedAsset: 'Multiple',
          detectedAt: new Date(2025, 1, 16).toISOString(),
        },
        {
          id: 4,
          severity: 'medium',
          title: 'Vulnerable Transaction Patterns',
          description: 'Your transaction patterns might make you susceptible to front-running attacks',
          recommendation: 'Consider using private transactions or transaction batching',
          affectedAsset: 'S',
          detectedAt: new Date(2025, 1, 28).toISOString(),
        },
        {
          id: 5,
          severity: 'low',
          title: 'Inactive Security Features',
          description: 'Your wallet has not enabled available security features like multi-signature or time-locks',
          recommendation: 'Enable additional security features for your wallet',
          affectedAsset: 'Wallet',
          detectedAt: new Date(2025, 1, 8).toISOString(),
        },
        {
          id: 6,
          severity: 'low',
          title: 'Frequent Small Transactions',
          description: 'You have many small transactions which may lead to unnecessary gas fees',
          recommendation: 'Batch transactions when possible to save on gas fees',
          affectedAsset: 'S',
          detectedAt: new Date(2025, 1, 20).toISOString(),
        },
      ],
      recentTransactions: [
        {
          hash: '0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
          type: 'Transfer',
          asset: 'S',
          amount: '25.5',
          timestamp: new Date(2025, 2, 6).toISOString(),
          to: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
          status: 'Confirmed',
          risk: 'low',
        },
        {
          hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
          type: 'Approval',
          asset: 'USDT',
          amount: 'Unlimited',
          timestamp: new Date(2025, 1, 23).toISOString(),
          to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          status: 'Confirmed',
          risk: 'high',
        },
        {
          hash: '0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
          type: 'Swap',
          asset: 'S → WETH',
          amount: '100 → 0.05',
          timestamp: new Date(2025, 2, 1).toISOString(),
          to: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          status: 'Confirmed',
          risk: 'medium',
        },
      ],
      recommendations: [
        'Revoke unnecessary token approvals, especially unlimited approvals',
        'Use hardware wallets like Ledger or Trezor for large holdings',
        'Enable multi-signature for critical operations',
        'Regularly check for phishing attempts and suspicious websites',
        'Monitor your wallet activity with a blockchain explorer',
        'Use a dedicated security tool like Sonic Watchdog AI regularly',
        'Consider using a time-lock for large transactions',
        'Verify smart contract addresses before interacting with them',
        'Keep your private keys secure and never share them',
        'Use different wallets for different purposes (trading, holding, etc.)',
      ],
      securityTips: [
        'Never share your seed phrase or private keys with anyone',
        'Be cautious of phishing attempts via email or social media',
        'Verify all transaction details before confirming',
        'Keep your software and wallet applications updated',
        'Use strong, unique passwords for exchange accounts',
      ],
    };

    // Filter issues based on scan options
    const filteredIssues = results.issues.filter((issue) => {
      if (issue.title.includes('Token Approval') && !scanOptions.checkTokenApprovals) return false;
      if (issue.title.includes('Interaction') && !scanOptions.checkInteractions) return false;
      if (issue.title.includes('Phishing') && !scanOptions.checkPhishing) return false;
      if (issue.title.includes('Permission') && !scanOptions.checkPermissions) return false;
      return true;
    });

    results.issues = filteredIssues;
    
    // Log the number of wallet drainers for debugging
    console.log(`Number of wallet drainers in mock data: ${results.walletDrainers.length}`);
    
    setScanResults(results);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'yellow';
      default:
        return 'green';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'green';
    if (score >= 70) return 'yellow';
    return 'red';
  };

  const handleOptionChange = (option) => {
    setScanOptions({
      ...scanOptions,
      [option]: !scanOptions[option],
    });
  };

  return (
    <Box>
      <Heading as="h1" size="xl" mb={2} color="white">
        Security Scanner
      </Heading>
      
      <Flex align="center" mb={6}>
        <Text color="gray.400">
          Advanced security tools for the Sonic blockchain
        </Text>
        <BlockExplorerLink 
          type="explorer" 
          label={`${getNetworkName()} Explorer`}
          linkProps={{ 
            ml: 4,
            bg: 'gray.700', 
            px: 3, 
            py: 1,
            borderRadius: 'md',
            fontSize: 'sm',
            _hover: { bg: 'gray.600' }
          }}
        />
      </Flex>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
        <Box
          bg="gray.800"
          p={6}
          borderRadius="lg"
          boxShadow="md"
          _hover={{ transform: 'translateY(-5px)', transition: 'transform 0.3s' }}
        >
          <Flex align="center" mb={4}>
            <Icon as={FiShield} boxSize={6} color="sonic.400" mr={3} />
            <Heading as="h2" size="md" color="white">
              Wallet Security Check
            </Heading>
          </Flex>
          <Text color="gray.400" mb={4}>
            Analyze your wallet for security vulnerabilities, suspicious approvals, and risky interactions.
          </Text>
          <Button
            onClick={handleScan}
            rightIcon={<FiSearch />}
            colorScheme="sonic"
            variant="outline"
            mb={4}
            isLoading={isScanning}
            loadingText="Scanning"
          >
            Scan Wallet
          </Button>
          
          <FormControl>
            <Input
              placeholder="Or enter a custom address to scan"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleScan();
                }
              }}
              bg="gray.700"
              border="none"
              _focus={{ borderColor: "sonic.400" }}
              size="sm"
            />
          </FormControl>
          
          {isScanning && (
            <Box mt={4}>
              <Text color="gray.400" fontSize="sm" mb={2}>
                Scanning wallet... {Math.round(scanProgress)}%
              </Text>
              <Progress 
                value={scanProgress} 
                size="sm" 
                colorScheme="sonic" 
                borderRadius="md"
                hasStripe
                isAnimated
              />
            </Box>
          )}
        </Box>
        
        <Box
          bg="gray.800"
          p={6}
          borderRadius="lg"
          boxShadow="md"
          _hover={{ transform: 'translateY(-5px)', transition: 'transform 0.3s' }}
        >
          <Flex align="center" mb={4}>
            <Icon as={FiCode} boxSize={6} color="sonic.400" mr={3} />
            <Heading as="h2" size="md" color="white">
              Smart Contract Analyzer
            </Heading>
          </Flex>
          <Text color="gray.400" mb={4}>
            Analyze smart contracts for security vulnerabilities, rug pull risks, and potential exploits.
          </Text>
          <Button
            as={RouterLink}
            to="/app/smart-contract-analyzer"
            rightIcon={<FiCode />}
            colorScheme="sonic"
            variant="outline"
          >
            Analyze Contract
          </Button>
        </Box>
      </SimpleGrid>
      
      <Tabs 
        variant="enclosed" 
        colorScheme="sonic" 
        id="wallet" 
        index={tabIndex} 
        onChange={(index) => setTabIndex(index)}
      >
        <TabList>
          <Tab>Address Analyzer</Tab>
          <Tab>Token Approvals</Tab>
          <Tab>Transaction History</Tab>
          {scanComplete && (
            <Tab>
              Scan Results
              <Badge ml={2} colorScheme="green" variant="solid">
                New
              </Badge>
            </Tab>
          )}
        </TabList>
        
        <TabPanels>
          <TabPanel px={0}>
            <AddressAnalyzer />
          </TabPanel>
          
          <TabPanel>
            <Box bg="gray.800" p={6} borderRadius="md">
              <Heading as="h2" size="md" color="white" mb={4}>
                Token Approvals
              </Heading>
              
              <Text color="gray.400" mb={6}>
                View and manage your token approvals. Revoke unnecessary permissions to improve security.
              </Text>
              
              <Button
                as={RouterLink}
                to="/app/token-approvals"
                rightIcon={<FiAlertTriangle />}
                colorScheme="sonic"
              >
                Manage Approvals
              </Button>
            </Box>
          </TabPanel>
          
          <TabPanel>
            <Box bg="gray.800" p={6} borderRadius="md">
              <Heading as="h2" size="md" color="white" mb={4}>
                Transaction History Analysis
              </Heading>
              
              <Text color="gray.400" mb={6}>
                Analyze your transaction history for suspicious patterns and potential security risks.
              </Text>
              
              <Text color="gray.500" fontStyle="italic">
                Connect your wallet to analyze your transaction history.
              </Text>
            </Box>
          </TabPanel>
          
          {scanComplete && (
            <TabPanel>
              <Box bg="gray.800" p={6} borderRadius="md">
                <Heading as="h2" size="md" color="white" mb={4}>
                  Wallet Security Scan Results
                </Heading>
                
                {scanResults && (
                  <>
                    <Flex justify="space-between" align="center" mb={6}>
                      <Box>
                        <Text color="gray.400" mb={2}>
                          Address: {scanResults.address}
                        </Text>
                        <Text color="gray.400" fontSize="sm">
                          Scan completed on {new Date(scanResults.scanDate).toLocaleString()}
                        </Text>
                        {scanResults.networkInfo && (
                          <Text color="gray.400" fontSize="sm">
                            Network: {scanResults.networkInfo.name} (Chain ID: {scanResults.networkInfo.chainId})
                          </Text>
                        )}
                      </Box>
                      <Stat textAlign="right">
                        <StatLabel color="gray.400">Security Score</StatLabel>
                        <StatNumber color={getScoreColor(scanResults.securityScore)}>
                          {scanResults.securityScore}/100
                        </StatNumber>
                      </Stat>
                    </Flex>
                    
                    {/* Wallet Balances */}
                    {scanResults.balances && scanResults.balances.length > 0 && (
                      <Box mb={6}>
                        <Heading as="h3" size="sm" color="white" mb={3}>
                          Wallet Balances
                        </Heading>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                          {scanResults.balances.map((balance, index) => (
                            <Box 
                              key={index} 
                              p={4} 
                              bg="gray.700" 
                              borderRadius="md"
                              borderLeft="4px solid"
                              borderLeftColor="sonic.400"
                            >
                              <Stat>
                                <StatLabel color="gray.400">{balance.token}</StatLabel>
                                <StatNumber color="white" fontSize="xl">{balance.balance}</StatNumber>
                                <StatHelpText color="gray.400">≈ ${balance.value}</StatHelpText>
                              </Stat>
                            </Box>
                          ))}
                        </SimpleGrid>
                      </Box>
                    )}
                    
                    {/* Wallet Drainers */}
                    {scanResults.walletDrainers && scanResults.walletDrainers.length > 0 && (
                      <Box mb={6}>
                        <Heading as="h3" size="sm" color="white" mb={3}>
                          Detected Wallet Drainers ({scanResults.walletDrainers.length})
                        </Heading>
                        
                        {console.log('Rendering wallet drainers in SecurityScanner:', scanResults.walletDrainers)}
                        
                        <VStack spacing={4} align="stretch" width="100%">
                          {scanResults.walletDrainers.map((drainer, index) => {
                            console.log(`Rendering drainer ${index + 1} in SecurityScanner:`, drainer.name);
                            return (
                              <Box 
                                key={drainer.id || index}
                                p={4} 
                                bg="gray.700" 
                                borderRadius="md"
                                borderLeft="4px solid"
                                borderLeftColor={
                                  drainer.riskLevel === 'critical' ? 'red.500' : 
                                  drainer.riskLevel === 'high' ? 'orange.500' : 'yellow.500'
                                }
                                width="100%"
                              >
                                <Flex justify="space-between" align="center" mb={3}>
                                  <Heading as="h4" size="sm" color="white">
                                    {index + 1}. {drainer.name}
                                  </Heading>
                                  <Badge 
                                    colorScheme={
                                      drainer.riskLevel === 'critical' ? 'red' : 
                                      drainer.riskLevel === 'high' ? 'orange' : 'yellow'
                                    }
                                    fontSize="sm"
                                  >
                                    {drainer.riskLevel.toUpperCase()}
                                  </Badge>
                                </Flex>
                                
                                <Flex mb={3} flexWrap="wrap">
                                  <Text color="gray.400" fontSize="sm" mr={4}>
                                    <strong>Type:</strong> {drainer.type}
                                  </Text>
                                  <Text color="gray.400" fontSize="sm" mr={4}>
                                    <strong>Address:</strong> {drainer.address}
                                  </Text>
                                  <Text color="gray.400" fontSize="sm">
                                    <strong>Detected:</strong> {new Date(drainer.detectedAt).toLocaleDateString()}
                                  </Text>
                                </Flex>
                                
                                <Text color="gray.300" fontSize="sm" mb={3}>
                                  {drainer.description}
                                </Text>
                                
                                <Box bg="gray.800" p={3} borderRadius="md" mb={3}>
                                  <Text color="white" fontSize="sm" fontWeight="bold" mb={2}>
                                    Risk Indicators:
                                  </Text>
                                  {drainer.indicators.map((indicator, idx) => (
                                    <Flex key={idx} align="center" mb={idx < drainer.indicators.length - 1 ? 2 : 0}>
                                      <Icon as={FiAlertTriangle} color="red.400" mr={2} />
                                      <Text color="gray.300" fontSize="sm">{indicator}</Text>
                                    </Flex>
                                  ))}
                                </Box>
                                
                                <Box bg="gray.800" p={3} borderRadius="md">
                                  <Text color="white" fontSize="sm" fontWeight="bold" mb={1}>
                                    Recommendation:
                                  </Text>
                                  <Text color="gray.300" fontSize="sm">
                                    {drainer.recommendation}
                                  </Text>
                                </Box>
                                
                                <Flex justify="flex-end" mt={3}>
                                  <Button 
                                    size="sm" 
                                    colorScheme="red" 
                                    variant="outline"
                                    leftIcon={<Icon as={FiAlertTriangle} />}
                                  >
                                    Report False Positive
                                  </Button>
                                </Flex>
                              </Box>
                            );
                          })}
                        </VStack>
                      </Box>
                    )}
                    
                    {/* Wallet Drainer Interactions */}
                    {scanResults.drainerInteractions && scanResults.drainerInteractions.length > 0 && (
                      <Box mb={6}>
                        <Heading as="h3" size="sm" color="white" mb={3}>
                          <Flex align="center">
                            <Icon as={FaExclamationTriangle} color="red.500" mr={2} />
                            Your Interactions with Wallet Drainers
                          </Flex>
                        </Heading>
                        
                        <Alert status="error" bg="red.900" color="white" mb={4} borderRadius="md">
                          <AlertIcon color="red.200" />
                          <Box>
                            <AlertTitle>Critical Security Alert</AlertTitle>
                            <AlertDescription>
                              We've detected {scanResults.drainerInteractions.length} interactions with known wallet drainers. 
                              Immediate action is recommended to secure your assets.
                            </AlertDescription>
                          </Box>
                        </Alert>
                        
                        {scanResults.drainerInteractions.map((interaction) => (
                          <Box 
                            key={interaction.id} 
                            p={4} 
                            bg="gray.700" 
                            borderRadius="md" 
                            mb={4}
                            borderLeft="4px solid"
                            borderLeftColor={
                              interaction.riskLevel === 'critical' ? 'red.500' : 
                              interaction.riskLevel === 'high' ? 'orange.500' : 'yellow.500'
                            }
                          >
                            <Flex justify="space-between" align="center" mb={3}>
                              <Heading as="h4" size="sm" color="white">
                                {interaction.interactionType} with {interaction.drainerName}
                              </Heading>
                              <HStack>
                                <Badge 
                                  colorScheme={
                                    interaction.riskLevel === 'critical' ? 'red' : 
                                    interaction.riskLevel === 'high' ? 'orange' : 'yellow'
                                  }
                                >
                                  {interaction.riskLevel.toUpperCase()}
                                </Badge>
                                <Badge 
                                  colorScheme={interaction.status === 'Active' ? 'red' : 'gray'}
                                >
                                  {interaction.status}
                                </Badge>
                              </HStack>
                            </Flex>
                            
                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={3}>
                              <Box>
                                <Text color="gray.400" fontSize="xs">Asset</Text>
                                <Text color="white" fontWeight="medium">{interaction.asset}</Text>
                              </Box>
                              <Box>
                                <Text color="gray.400" fontSize="xs">Amount</Text>
                                <Text color="white" fontWeight="medium">{interaction.amount}</Text>
                              </Box>
                              <Box>
                                <Text color="gray.400" fontSize="xs">Date</Text>
                                <Text color="white" fontWeight="medium">
                                  {new Date(interaction.timestamp).toLocaleDateString()}
                                </Text>
                              </Box>
                            </SimpleGrid>
                            
                            <Flex mb={3} flexWrap="wrap">
                              <Text color="gray.400" fontSize="sm" mr={4}>
                                <strong>Drainer Address:</strong> {interaction.drainerAddress}
                              </Text>
                              <Text color="gray.400" fontSize="sm">
                                <strong>Transaction:</strong> {interaction.transactionHash}
                              </Text>
                            </Flex>
                            
                            <Box bg="gray.800" p={3} borderRadius="md" mb={3}>
                              <Text color="white" fontSize="sm" fontWeight="bold" mb={1}>
                                Recommendation:
                              </Text>
                              <Text color="gray.300" fontSize="sm">
                                {interaction.recommendation}
                              </Text>
                            </Box>
                            
                            <Flex justify="flex-end" mt={3}>
                              <Button 
                                size="sm" 
                                colorScheme="red"
                                mr={2}
                              >
                                Revoke Approval
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                colorScheme="gray"
                              >
                                View Transaction
                              </Button>
                            </Flex>
                          </Box>
                        ))}
                      </Box>
                    )}
                    
                    {/* Security Issues */}
                    <Heading as="h3" size="sm" color="white" mb={3}>
                      Detected Issues
                    </Heading>
                    
                    {scanResults.issues.length > 0 ? (
                      scanResults.issues.map((issue) => (
                        <Box 
                          key={issue.id} 
                          p={4} 
                          bg="gray.700" 
                          borderRadius="md" 
                          mb={3}
                          borderLeft="4px solid"
                          borderLeftColor={getSeverityColor(issue.severity)}
                        >
                          <Flex justify="space-between" align="center" mb={2}>
                            <Heading as="h4" size="xs" color="white">
                              {issue.title}
                            </Heading>
                            <Badge colorScheme={getSeverityColor(issue.severity)}>
                              {issue.severity}
                            </Badge>
                          </Flex>
                          <Text color="gray.400" fontSize="sm" mb={2}>
                            {issue.description}
                          </Text>
                          <Flex justify="space-between" align="center">
                            <Text color="gray.300" fontSize="sm" fontWeight="bold">
                              Recommendation: {issue.recommendation}
                            </Text>
                            {issue.detectedAt && (
                              <Text color="gray.500" fontSize="xs">
                                Detected: {new Date(issue.detectedAt).toLocaleDateString()}
                              </Text>
                            )}
                          </Flex>
                        </Box>
                      ))
                    ) : (
                      <Text color="green.400">No issues detected!</Text>
                    )}
                    
                    {/* Recent Transactions */}
                    {scanResults.recentTransactions && scanResults.recentTransactions.length > 0 && (
                      <Box mt={6} mb={6}>
                        <Heading as="h3" size="sm" color="white" mb={3}>
                          Recent Transactions
                        </Heading>
                        <Box overflowX="auto">
                          <Table size="sm" variant="simple">
                            <Thead>
                              <Tr>
                                <Th color="gray.400">Type</Th>
                                <Th color="gray.400">Asset</Th>
                                <Th color="gray.400">Amount</Th>
                                <Th color="gray.400">Date</Th>
                                <Th color="gray.400">Risk</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {scanResults.recentTransactions.map((tx, index) => (
                                <Tr key={index}>
                                  <Td color="white">{tx.type}</Td>
                                  <Td color="white">{tx.asset}</Td>
                                  <Td color="white">{tx.amount}</Td>
                                  <Td color="gray.400">{new Date(tx.timestamp).toLocaleDateString()}</Td>
                                  <Td>
                                    <Badge 
                                      colorScheme={
                                        tx.risk === 'high' ? 'red' : 
                                        tx.risk === 'medium' ? 'orange' : 'green'
                                      }
                                      size="sm"
                                    >
                                      {tx.risk}
                                    </Badge>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </Box>
                      </Box>
                    )}
                    
                    {/* Security Recommendations */}
                    <Heading as="h3" size="sm" color="white" mt={6} mb={3}>
                      Security Recommendations
                    </Heading>
                    
                    <Box p={4} bg="gray.700" borderRadius="md" mb={6}>
                      {scanResults.recommendations.map((rec, index) => (
                        <Flex key={index} align="center" mb={index < scanResults.recommendations.length - 1 ? 2 : 0}>
                          <Icon as={FaCheckCircle} color="green.400" mr={2} />
                          <Text color="gray.300">{rec}</Text>
                        </Flex>
                      ))}
                    </Box>
                    
                    {/* Security Tips */}
                    {scanResults.securityTips && scanResults.securityTips.length > 0 && (
                      <>
                        <Heading as="h3" size="sm" color="white" mt={6} mb={3}>
                          Security Tips
                        </Heading>
                        
                        <Box p={4} bg="gray.700" borderRadius="md">
                          {scanResults.securityTips.map((tip, index) => (
                            <Flex key={index} align="center" mb={index < scanResults.securityTips.length - 1 ? 2 : 0}>
                              <Icon as={FiAlertTriangle} color="yellow.400" mr={2} />
                              <Text color="gray.300">{tip}</Text>
                            </Flex>
                          ))}
                        </Box>
                      </>
                    )}
                    
                    <Flex justify="center" mt={8}>
                      <Button
                        colorScheme="sonic"
                        leftIcon={<FiSearch />}
                        onClick={() => {
                          setScanComplete(false);
                          setScanResults(null);
                          setTabIndex(0);
                          setCustomAddress('');
                        }}
                      >
                        Scan Another Address
                      </Button>
                    </Flex>
                  </>
                )}
              </Box>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SecurityScanner; 