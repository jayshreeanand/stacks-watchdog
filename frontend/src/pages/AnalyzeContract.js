import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Progress,
  Divider,
  List,
  ListItem,
  ListIcon,
  Badge,
  useToast,
  Checkbox,
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiAlertTriangle, 
  FiCheck, 
  FiX, 
  FiInfo,
  FiShield
} from 'react-icons/fi';
import { ethers } from 'ethers';
import apiService from '../utils/apiService';
import { useDataSource } from '../context/DataSourceContext';

const AnalyzeContract = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { useRealAIAnalysis, toggleRealAIAnalysis } = useDataSource();
  
  const [contractAddress, setContractAddress] = useState('');
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const validateAddress = (address) => {
    return ethers.isAddress(address);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setContractAddress(value);
    setIsAddressValid(value === '' || validateAddress(value));
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!contractAddress) {
      setIsAddressValid(false);
      setError('Please enter a contract address');
      return;
    }

    if (!validateAddress(contractAddress)) {
      setIsAddressValid(false);
      setError('Invalid Ethereum address format');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setAnalysisProgress(0);

    // Start progress animation
    const interval = setInterval(() => {
      setAnalysisProgress((prevProgress) => {
        const newProgress = prevProgress + 5;
        if (newProgress >= 90) {
          clearInterval(interval);
          return 90; // Hold at 90% until the actual analysis completes
        }
        return newProgress;
      });
    }, 500);

    try {
      console.log(`Analyzing contract ${contractAddress} with useRealAIAnalysis: ${useRealAIAnalysis}`);
      const result = await apiService.analyzeContract(contractAddress, useRealAIAnalysis);
      
      // Complete the progress bar
      clearInterval(interval);
      setAnalysisProgress(100);
      
      setAnalysisResult(result);
      
      // If high risk, show a toast notification
      if (result.riskLevel === 'high' || result.riskLevel === 'critical') {
        toast({
          title: 'High Risk Detected',
          description: 'This contract has been identified as a potential wallet drainer.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error analyzing contract:', error);
      setError(error.message || 'Failed to analyze contract. Please try again.');
      clearInterval(interval);
      setAnalysisProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDrainer = async () => {
    if (!analysisResult) return;
    
    try {
      await apiService.saveWalletDrainer({
        address: analysisResult.address,
        name: analysisResult.name || 'Unknown Contract',
        riskLevel: analysisResult.riskLevel,
        description: `Automatically added via contract analysis. Risk score: ${analysisResult.riskScore}/100`,
      });
      
      toast({
        title: 'Success',
        description: 'Contract saved as wallet drainer.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate(`/wallet-drainers/${analysisResult.address}`);
    } catch (error) {
      console.error('Error saving contract as drainer:', error);
      toast({
        title: 'Error',
        description: 'Could not save contract as wallet drainer. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'green';
      case 'medium': return 'orange';
      case 'high': return 'red';
      case 'critical': return 'red.900';
      default: return 'gray';
    }
  };

  const getFindingIcon = (type) => {
    switch (type) {
      case 'high': return FiAlertTriangle;
      case 'medium': return FiInfo;
      case 'low': return FiCheck;
      default: return FiInfo;
    }
  };

  const getFindingColor = (type) => {
    switch (type) {
      case 'high': return 'red.500';
      case 'medium': return 'orange.500';
      case 'low': return 'green.500';
      default: return 'gray.500';
    }
  };

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6} color="white">
        Analyze Contract
      </Heading>
      
      <Box bg="gray.800" p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <Text color="gray.300" mb={4}>
          Enter a contract address to analyze it for potential wallet drainer behavior.
        </Text>
        
        <FormControl isInvalid={!isAddressValid} mb={4}>
          <FormLabel color="gray.300">Contract Address</FormLabel>
          <Flex>
            <Input
              placeholder="0x..."
              value={contractAddress}
              onChange={handleInputChange}
              bg="gray.700"
              border="1px solid"
              borderColor={isAddressValid ? "gray.600" : "red.500"}
              color="white"
              mr={2}
              fontFamily="monospace"
            />
            <Button
              colorScheme="sonic"
              leftIcon={<FiSearch />}
              onClick={handleAnalyze}
              isLoading={loading}
              loadingText="Analyzing"
            >
              Analyze
            </Button>
          </Flex>
          {!isAddressValid && (
            <FormErrorMessage>{error || 'Invalid Ethereum address'}</FormErrorMessage>
          )}
          <FormHelperText color="gray.400">
            Enter the address of the contract you want to analyze for malicious behavior.
          </FormHelperText>
        </FormControl>
        
        {/* Add toggle for real AI analysis */}
        <Flex mb={4} align="center">
          <Checkbox 
            isChecked={useRealAIAnalysis} 
            onChange={toggleRealAIAnalysis}
            colorScheme="teal"
            mr={2}
          />
          <Text color="gray.600" fontSize="sm">
            Use real AI analysis
          </Text>
        </Flex>
        
        {loading && (
          <Box my={6}>
            <Text color="gray.300" mb={2}>Analyzing contract... {Math.round(analysisProgress)}%</Text>
            <Progress value={analysisProgress} size="sm" colorScheme="teal" hasStripe isAnimated />
          </Box>
        )}
        
        {error && !loading && (
          <Alert status="error" borderRadius="md" mt={4}>
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </Box>
      
      {analysisResult && (
        <Box bg="gray.800" p={6} borderRadius="lg" boxShadow="md">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h2" size="md" color="white">
              Analysis Results
            </Heading>
            <Badge 
              bg={getRiskColor(analysisResult.riskLevel)} 
              color="white" 
              px={3} 
              py={1} 
              borderRadius="md"
            >
              {analysisResult.riskLevel.toUpperCase()} RISK
            </Badge>
          </Flex>
          
          <Flex direction={{ base: 'column', md: 'row' }} mb={6}>
            <Box flex="1" mr={{ base: 0, md: 6 }} mb={{ base: 4, md: 0 }}>
              <Text color="gray.400" fontSize="sm">Contract Address</Text>
              <Text color="white" fontFamily="monospace" mb={4}>
                {analysisResult.address}
              </Text>
              
              <Text color="gray.400" fontSize="sm">Contract Name</Text>
              <Text color="white" mb={4}>
                {analysisResult.name || 'Unknown'}
              </Text>
              
              <Text color="gray.400" fontSize="sm">Risk Score</Text>
              <Flex align="center" mb={4}>
                <Text color="white" fontWeight="bold" mr={2}>
                  {analysisResult.riskScore}/100
                </Text>
                <Progress 
                  value={analysisResult.riskScore} 
                  max={100}
                  min={0}
                  size="sm"
                  colorScheme={analysisResult.riskScore > 75 ? 'red' : analysisResult.riskScore > 50 ? 'orange' : 'green'}
                  flex="1"
                  borderRadius="full"
                />
              </Flex>
              
              {analysisResult.isKnownDrainer && (
                <Alert status="error" borderRadius="md" mb={4}>
                  <AlertIcon />
                  <AlertTitle mr={2}>Warning!</AlertTitle>
                  <AlertDescription>This is a known wallet drainer contract.</AlertDescription>
                </Alert>
              )}
            </Box>
            
            <Divider orientation="vertical" display={{ base: 'none', md: 'block' }} />
            <Divider orientation="horizontal" display={{ base: 'block', md: 'none' }} my={4} />
            
            <Box flex="1" ml={{ base: 0, md: 6 }}>
              <Text color="gray.400" fontSize="sm" mb={2}>Findings</Text>
              <List spacing={2}>
                {analysisResult.findings.map((finding, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <ListIcon as={getFindingIcon(finding.type)} color={getFindingColor(finding.type)} />
                    <Text color="white">{finding.message}</Text>
                  </ListItem>
                ))}
              </List>
              
              {analysisResult.recommendations && (
                <>
                  <Text color="gray.400" fontSize="sm" mt={4} mb={2}>Recommendations</Text>
                  <List spacing={2}>
                    {analysisResult.recommendations.map((rec, index) => (
                      <ListItem key={index} display="flex" alignItems="center">
                        <ListIcon as={FiShield} color="sonic.400" />
                        <Text color="white">{rec}</Text>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Box>
          </Flex>
          
          <Divider my={4} borderColor="gray.700" />
          
          <Flex justify="flex-end">
            <Button
              colorScheme="red"
              leftIcon={<FiAlertTriangle />}
              onClick={handleSaveAsDrainer}
              isDisabled={analysisResult.riskLevel === 'low'}
            >
              Save as Wallet Drainer
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default AnalyzeContract; 