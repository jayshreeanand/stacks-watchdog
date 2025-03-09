import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Badge,
  Flex,
  Divider,
  List,
  ListItem,
  ListIcon,
  Progress,
  useToast,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { FiAlertTriangle, FiCheckCircle, FiSearch, FiShield, FiInfo } from 'react-icons/fi';
import aiAnalyzer from '../utils/aiAnalyzer';
import BlockExplorerLink from './BlockExplorerLink';

const AddressAnalyzer = () => {
  const [address, setAddress] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Function to analyze address
  const analyzeAddress = async () => {
    if (!address.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an address to analyze',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      
      // In a real implementation, you would fetch recent transactions for this address
      // from your backend or blockchain API
      const mockTransactions = [
        { hash: '0x1234...', to: '0xabcd...', value: '100', timestamp: Date.now() - 86400000 },
        { hash: '0x5678...', to: '0xefgh...', value: '200', timestamp: Date.now() - 172800000 },
      ];
      
      const result = await aiAnalyzer.analyzeAddress(address, mockTransactions);
      
      setAnalysisResult(result);
      
      toast({
        title: 'Analysis Complete',
        description: `Address analyzed with risk score: ${result.riskScore}/100`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error analyzing address:', err);
      setError('Failed to analyze address. Please try again.');
      
      toast({
        title: 'Analysis Failed',
        description: 'An error occurred while analyzing the address',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to get badge color based on risk level
  const getRiskBadgeProps = (riskLevel) => {
    switch (riskLevel) {
      case 'critical':
        return { colorScheme: 'red', children: 'Critical Risk' };
      case 'high':
        return { colorScheme: 'orange', children: 'High Risk' };
      case 'medium':
        return { colorScheme: 'yellow', children: 'Medium Risk' };
      case 'low':
        return { colorScheme: 'yellow', children: 'Low Risk' };
      case 'safe':
        return { colorScheme: 'green', children: 'Safe' };
      default:
        return { colorScheme: 'gray', children: 'Unknown' };
    }
  };

  // Function to get severity badge color
  const getSeverityBadgeProps = (severity) => {
    switch (severity) {
      case 'critical':
        return { bg: 'red.900', color: 'white', children: 'Critical' };
      case 'high':
        return { colorScheme: 'red', children: 'High' };
      case 'medium':
        return { colorScheme: 'orange', children: 'Medium' };
      case 'low':
        return { colorScheme: 'green', children: 'Low' };
      default:
        return { colorScheme: 'gray', children: 'Unknown' };
    }
  };

  return (
    <Box bg="gray.800" p={6} borderRadius="md">
      <Heading as="h2" size="md" color="white" mb={4}>
        AI Address Analyzer
      </Heading>
      
      <Text color="gray.400" mb={6}>
        Analyze any Electroneum address for suspicious activity and security risks.
      </Text>
      
      <Box mb={6}>
        <FormControl mb={4}>
          <FormLabel color="white">Wallet Address</FormLabel>
          <Flex>
            <Input 
              placeholder="0x..." 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              bg="gray.700"
              color="white"
              borderColor="gray.600"
              _hover={{ borderColor: 'electroneum.400' }}
              _focus={{ borderColor: 'electroneum.400', boxShadow: '0 0 0 1px var(--chakra-colors-electroneum-400)' }}
              mr={2}
            />
            <Button 
              leftIcon={<FiSearch />}
              colorScheme="electroneum" 
              onClick={analyzeAddress}
              isLoading={isAnalyzing}
              loadingText="Analyzing..."
              isDisabled={!address.trim()}
            >
              Analyze
            </Button>
          </Flex>
          <FormHelperText>Enter any Electroneum address to analyze for suspicious activity</FormHelperText>
        </FormControl>
      </Box>
      
      {error && (
        <Alert status="error" borderRadius="md" mb={6}>
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isAnalyzing ? (
        <Box textAlign="center" py={6}>
          <Spinner size="xl" color="electroneum.500" mb={4} />
          <Text color="white">Analyzing address...</Text>
          <Text color="gray.400" fontSize="sm" mt={2}>This may take a few moments</Text>
        </Box>
      ) : analysisResult ? (
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h3" size="sm" color="white">
              Analysis Results
            </Heading>
            
            <HStack>
              <Badge {...getRiskBadgeProps(analysisResult.riskLevel)} fontSize="sm" py={1} px={2} />
              <BlockExplorerLink 
                type="address" 
                value={analysisResult.address}
                truncate={false}
                label="View on Explorer"
                linkProps={{ 
                  bg: 'gray.700', 
                  px: 3, 
                  py: 1, 
                  borderRadius: 'md',
                  fontSize: 'sm',
                  _hover: { bg: 'gray.600' }
                }}
              />
            </HStack>
          </Flex>
          
          <Box mb={4}>
            <Text color="white" fontWeight="bold" mb={2}>Risk Score</Text>
            <Progress 
              value={analysisResult.riskScore} 
              colorScheme={
                analysisResult.riskScore >= 75 ? 'red' :
                analysisResult.riskScore >= 50 ? 'orange' :
                analysisResult.riskScore >= 25 ? 'yellow' : 'green'
              }
              borderRadius="md"
              height="16px"
            />
            <Flex justify="space-between" mt={1}>
              <Text color="gray.400" fontSize="sm">Safe</Text>
              <Text color="white" fontWeight="bold">
                {analysisResult.riskScore}/100
              </Text>
              <Text color="gray.400" fontSize="sm">Critical</Text>
            </Flex>
          </Box>
          
          <Divider my={4} borderColor="gray.600" />
          
          <Box mb={4}>
            <Text color="white" fontWeight="bold" mb={2}>Summary</Text>
            <Text color="gray.300">{analysisResult.summary}</Text>
          </Box>
          
          {analysisResult.findings && analysisResult.findings.length > 0 && (
            <Box mb={4}>
              <Text color="white" fontWeight="bold" mb={2}>Findings</Text>
              <VStack align="stretch" spacing={2}>
                {analysisResult.findings.map((finding, index) => (
                  <Box key={index} p={3} bg="gray.700" borderRadius="md">
                    <Flex align="center" mb={1}>
                      <Badge {...getSeverityBadgeProps(finding.severity)} mr={2} />
                      <Text color="white" fontWeight="bold">{finding.type}</Text>
                    </Flex>
                    <Text color="gray.300">{finding.description}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
          
          {analysisResult.recommendedActions && analysisResult.recommendedActions.length > 0 && (
            <Box>
              <Text color="white" fontWeight="bold" mb={2}>Recommended Actions</Text>
              <List spacing={2}>
                {analysisResult.recommendedActions.map((action, index) => (
                  <ListItem key={index} color="gray.300">
                    <ListIcon as={FiShield} color="electroneum.400" />
                    {action}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      ) : null}
    </Box>
  );
};

export default AddressAnalyzer; 