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
    if (!addressToScan) {
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
          return 100;
        }
        return newProgress;
      });
    }, 300);
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
            as={RouterLink}
            to="/app/security-scanner#wallet"
            rightIcon={<FiSearch />}
            colorScheme="electroneum"
            variant="outline"
          >
            Scan Wallet
          </Button>
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
      
      <Tabs variant="enclosed" colorScheme="electroneum" id="wallet">
        <TabList>
          <Tab>Address Analyzer</Tab>
          <Tab>Token Approvals</Tab>
          <Tab>Transaction History</Tab>
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
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SecurityScanner; 