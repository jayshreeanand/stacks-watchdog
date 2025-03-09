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
    // Mock security scan results
    const results = {
      address: address,
      scanDate: new Date().toISOString(),
      securityScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
      issues: [
        {
          id: 1,
          severity: 'high',
          title: 'High Token Approval',
          description: 'You have approved unlimited spending for USDT to contract 0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          recommendation: 'Revoke this approval or set a specific limit',
          affectedAsset: 'USDT',
        },
        {
          id: 2,
          severity: 'medium',
          title: 'Interaction with Unverified Contract',
          description: 'You have interacted with an unverified contract at 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          recommendation: 'Avoid further interactions with this contract',
          affectedAsset: 'ETN',
        },
        {
          id: 3,
          severity: 'low',
          title: 'Old Transaction Patterns',
          description: 'Your transaction patterns might make you susceptible to front-running attacks',
          recommendation: 'Consider using private transactions or transaction batching',
          affectedAsset: 'Multiple',
        },
      ],
      recommendations: [
        'Revoke unnecessary token approvals',
        'Use hardware wallets for large holdings',
        'Enable multi-signature for critical operations',
        'Regularly check for phishing attempts',
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
          Advanced security tools for the Electroneum blockchain
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
            <Icon as={FiShield} boxSize={6} color="electroneum.400" mr={3} />
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
            colorScheme="electroneum"
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
              _focus={{ borderColor: "electroneum.400" }}
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
                colorScheme="electroneum" 
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
            <Icon as={FiCode} boxSize={6} color="electroneum.400" mr={3} />
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
            colorScheme="electroneum"
            variant="outline"
          >
            Analyze Contract
          </Button>
        </Box>
      </SimpleGrid>
      
      <Tabs 
        variant="enclosed" 
        colorScheme="electroneum" 
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
                colorScheme="electroneum"
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
                      </Box>
                      <Stat textAlign="right">
                        <StatLabel color="gray.400">Security Score</StatLabel>
                        <StatNumber color={getScoreColor(scanResults.securityScore)}>
                          {scanResults.securityScore}/100
                        </StatNumber>
                      </Stat>
                    </Flex>
                    
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
                          <Text color="gray.300" fontSize="sm" fontWeight="bold">
                            Recommendation: {issue.recommendation}
                          </Text>
                        </Box>
                      ))
                    ) : (
                      <Text color="green.400">No issues detected!</Text>
                    )}
                    
                    <Heading as="h3" size="sm" color="white" mt={6} mb={3}>
                      Security Recommendations
                    </Heading>
                    
                    <Box p={4} bg="gray.700" borderRadius="md">
                      {scanResults.recommendations.map((rec, index) => (
                        <Flex key={index} align="center" mb={index < scanResults.recommendations.length - 1 ? 2 : 0}>
                          <Icon as={FaCheckCircle} color="green.400" mr={2} />
                          <Text color="gray.300">{rec}</Text>
                        </Flex>
                      ))}
                    </Box>
                  </>
                )}
                
                <Flex justify="center" mt={8}>
                  <Button
                    colorScheme="electroneum"
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
              </Box>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SecurityScanner; 