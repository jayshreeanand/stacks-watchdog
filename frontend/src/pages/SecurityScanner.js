import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaLock, FaSearch, FaWallet } from 'react-icons/fa';
import { useWallet } from '../context/WalletContext';

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
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Security Scanner
          </Heading>
          <Text color={textColor}>
            Scan your wallet for potential security vulnerabilities and get recommendations
          </Text>
        </Box>

        <Card variant="outline" bg={cardBg}>
          <CardHeader>
            <Heading size="md">Scan Configuration</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel>Wallet Address</FormLabel>
                <Input
                  placeholder={account ? account : "Enter wallet address to scan"}
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  isDisabled={!!account || isScanning}
                />
                {account && (
                  <Text fontSize="sm" color="green.500" mt={1}>
                    Using connected wallet address
                  </Text>
                )}
              </FormControl>

              <Box>
                <Text fontWeight="medium" mb={2}>
                  Scan Options
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  <Checkbox
                    isChecked={scanOptions.checkTokenApprovals}
                    onChange={() => handleOptionChange('checkTokenApprovals')}
                    isDisabled={isScanning}
                  >
                    Check Token Approvals
                  </Checkbox>
                  <Checkbox
                    isChecked={scanOptions.checkInteractions}
                    onChange={() => handleOptionChange('checkInteractions')}
                    isDisabled={isScanning}
                  >
                    Check Contract Interactions
                  </Checkbox>
                  <Checkbox
                    isChecked={scanOptions.checkPhishing}
                    onChange={() => handleOptionChange('checkPhishing')}
                    isDisabled={isScanning}
                  >
                    Check Phishing Vulnerability
                  </Checkbox>
                  <Checkbox
                    isChecked={scanOptions.checkPermissions}
                    onChange={() => handleOptionChange('checkPermissions')}
                    isDisabled={isScanning}
                  >
                    Check Wallet Permissions
                  </Checkbox>
                </SimpleGrid>
              </Box>
            </VStack>
          </CardBody>
          <CardFooter>
            <Button
              leftIcon={<Icon as={FaShieldAlt} />}
              colorScheme="blue"
              isLoading={isScanning}
              loadingText="Scanning..."
              onClick={handleScan}
              width="full"
            >
              Start Security Scan
            </Button>
          </CardFooter>
        </Card>

        {isScanning && (
          <Box>
            <Text mb={2} fontWeight="medium">
              Scanning wallet for vulnerabilities...
            </Text>
            <Progress
              value={scanProgress}
              size="sm"
              colorScheme="blue"
              hasStripe
              isAnimated
              borderRadius="md"
            />
            <HStack mt={2} justify="space-between">
              <Text fontSize="sm">Analyzing transactions</Text>
              <Text fontSize="sm">{Math.round(scanProgress)}%</Text>
            </HStack>
          </Box>
        )}

        {scanComplete && scanResults && (
          <VStack spacing={6} align="stretch">
            <Card variant="outline" bg={cardBg}>
              <CardHeader>
                <Heading size="md">Scan Results</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  <Stat>
                    <StatLabel>Security Score</StatLabel>
                    <StatNumber color={getScoreColor(scanResults.securityScore)}>
                      {scanResults.securityScore}/100
                    </StatNumber>
                    <StatHelpText>
                      {scanResults.securityScore >= 90
                        ? 'Excellent'
                        : scanResults.securityScore >= 70
                        ? 'Good'
                        : 'Needs Improvement'}
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Issues Found</StatLabel>
                    <StatNumber>{scanResults.issues.length}</StatNumber>
                    <StatHelpText>
                      {scanResults.issues.filter((i) => i.severity === 'high').length} high,{' '}
                      {scanResults.issues.filter((i) => i.severity === 'medium').length} medium
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Scan Date</StatLabel>
                    <StatNumber fontSize="lg">
                      {new Date(scanResults.scanDate).toLocaleDateString()}
                    </StatNumber>
                    <StatHelpText>
                      {new Date(scanResults.scanDate).toLocaleTimeString()}
                    </StatHelpText>
                  </Stat>
                </SimpleGrid>
              </CardBody>
            </Card>

            {scanResults.issues.length > 0 && (
              <Card variant="outline" bg={cardBg}>
                <CardHeader>
                  <Heading size="md">Security Issues</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {scanResults.issues.map((issue) => (
                      <Box
                        key={issue.id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        borderLeftWidth="4px"
                        borderLeftColor={getSeverityColor(issue.severity) + '.500'}
                      >
                        <HStack mb={2}>
                          <Badge colorScheme={getSeverityColor(issue.severity)}>
                            {issue.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{issue.affectedAsset}</Badge>
                        </HStack>
                        <Heading size="sm" mb={2}>
                          {issue.title}
                        </Heading>
                        <Text mb={2}>{issue.description}</Text>
                        <Text fontWeight="medium">Recommendation: {issue.recommendation}</Text>
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            )}

            <Card variant="outline" bg={cardBg}>
              <CardHeader>
                <Heading size="md">Recommendations</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={3} align="stretch">
                  {scanResults.recommendations.map((rec, index) => (
                    <HStack key={index} spacing={3}>
                      <Icon as={FaCheckCircle} color="green.500" />
                      <Text>{rec}</Text>
                    </HStack>
                  ))}
                </VStack>
              </CardBody>
              <CardFooter>
                <Button
                  leftIcon={<Icon as={FaSearch} />}
                  colorScheme="blue"
                  onClick={handleScan}
                  width="full"
                >
                  Scan Again
                </Button>
              </CardFooter>
            </Card>
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default SecurityScanner; 