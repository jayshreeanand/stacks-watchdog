import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Textarea,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Badge,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  useToast,
  Code,
  VStack,
  HStack,
  Checkbox,
  Container,
} from '@chakra-ui/react';
import { FiAlertTriangle, FiCheckCircle, FiCode, FiSearch } from 'react-icons/fi';
import aiAnalyzer from '../utils/aiAnalyzer';
import BlockExplorerLink from '../components/BlockExplorerLink';
import { useDataSource } from '../context/DataSourceContext';

const SAMPLE_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    string public name = "Simple Token";
    string public symbol = "SMPL";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;
    
    address public owner;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        owner = msg.sender;
        balanceOf[msg.sender] = totalSupply;
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        
        emit Transfer(from, to, value);
        return true;
    }
    
    // Owner can withdraw all ETH from the contract
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
    
    // Dangerous function that doesn't check return value
    function unsafeCall(address target, bytes memory data) public returns (bool) {
        require(msg.sender == owner, "Only owner can call");
        (bool success, ) = target.call(data);
        return success;
    }
}`;

const VULNERABLE_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableToken {
    string public name = "Vulnerable Token";
    string public symbol = "VULN";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;
    
    address public owner;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        owner = msg.sender;
        balanceOf[msg.sender] = totalSupply;
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        balanceOf[msg.sender] -= value;  // Missing check for sufficient balance
        balanceOf[to] += value;
        
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        balanceOf[from] -= value;  // Missing check for sufficient balance
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;  // Missing check for sufficient allowance
        
        emit Transfer(from, to, value);
        return true;
    }
    
    // Reentrancy vulnerability
    function withdraw(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        (bool success, ) = msg.sender.call{value: amount}("");  // Vulnerable to reentrancy
        require(success, "Transfer failed");
        
        balanceOf[msg.sender] -= amount;  // State change after external call
    }
    
    // Backdoor function
    function setBalance(address account, uint256 amount) public {
        require(msg.sender == owner, "Only owner can set balance");
        balanceOf[account] = amount;  // Owner can arbitrarily set anyone's balance
    }
    
    // Dangerous function with unchecked return value
    function unsafeCall(address target, bytes memory data) public {
        require(msg.sender == owner, "Only owner can call");
        target.call(data);  // Unchecked return value
    }
    
    // Owner can withdraw all ETH
    function withdrawAll() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}`;

const SmartContractAnalyzer = () => {
  const [contractCode, setContractCode] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { useRealAIAnalysis, toggleRealAIAnalysis } = useDataSource();

  // Function to load a sample contract
  const loadSampleContract = (type) => {
    if (type === 'vulnerable') {
      setContractCode(VULNERABLE_CONTRACT);
      toast({
        title: 'Vulnerable Contract Loaded',
        description: 'A sample vulnerable contract has been loaded for analysis',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setContractCode(SAMPLE_CONTRACT);
      toast({
        title: 'Sample Contract Loaded',
        description: 'A sample contract has been loaded for analysis',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Function to analyze contract code
  const analyzeContractCode = async () => {
    if (!contractCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter contract code to analyze',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      
      console.log(`Analyzing contract code with useRealAIAnalysis: ${useRealAIAnalysis}`);
      const result = await aiAnalyzer.analyzeSmartContract(contractCode, contractAddress || null, !useRealAIAnalysis);
      
      setAnalysisResult(result);
      
      toast({
        title: 'Analysis Complete',
        description: `Found ${result.vulnerabilities?.length || 0} potential vulnerabilities`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error analyzing contract:', err);
      setError('Failed to analyze contract. Please try again.');
      
      toast({
        title: 'Analysis Failed',
        description: 'An error occurred while analyzing the contract',
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
        return { colorScheme: 'red', children: 'Critical' };
      case 'high':
        return { colorScheme: 'orange', children: 'High' };
      case 'medium':
        return { colorScheme: 'yellow', children: 'Medium' };
      case 'low':
        return { colorScheme: 'green', children: 'Low' };
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
    <Container maxW="container.xl" py={8}>
      <Box>
        <Heading as="h1" size="xl" mb={6} color="white">
          AI Smart Contract Analyzer
        </Heading>
        
        <Text color="gray.400" mb={6}>
          Analyze smart contracts for security vulnerabilities using advanced AI. 
          Paste your contract code or enter a contract address to get started.
        </Text>
        
        <Tabs variant="enclosed" colorScheme="sonic" mb={8}>
          <TabList>
            <Tab>Analyze Code</Tab>
            <Tab>Results</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <Box bg="gray.800" p={6} borderRadius="md" mb={6}>
                <FormControl mb={4}>
                  <FormLabel color="white">Contract Address (Optional)</FormLabel>
                  <Input 
                    placeholder="ST..." 
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    bg="gray.700"
                    color="white"
                    borderColor="gray.600"
                    _hover={{ borderColor: 'sonic.400' }}
                    _focus={{ borderColor: 'sonic.400', boxShadow: '0 0 0 1px var(--chakra-colors-sonic-400)' }}
                  />
                  <FormHelperText>Enter a Stacks contract address to include in the analysis report</FormHelperText>
                </FormControl>
                
                <FormControl mb={4}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <FormLabel color="white" mb={0}>Contract Code</FormLabel>
                    <HStack>
                      <Button 
                        size="sm" 
                        colorScheme="blue" 
                        onClick={() => loadSampleContract('normal')}
                      >
                        Load Sample
                      </Button>
                      <Button 
                        size="sm" 
                        colorScheme="red" 
                        onClick={() => loadSampleContract('vulnerable')}
                      >
                        Load Vulnerable Sample
                      </Button>
                    </HStack>
                  </Flex>
                  <Textarea 
                    placeholder="Paste your Clarity contract code here..." 
                    value={contractCode}
                    onChange={(e) => setContractCode(e.target.value)}
                    minHeight="300px"
                    bg="gray.700"
                    color="white"
                    borderColor="gray.600"
                    _hover={{ borderColor: 'sonic.400' }}
                    _focus={{ borderColor: 'sonic.400', boxShadow: '0 0 0 1px var(--chakra-colors-sonic-400)' }}
                    fontFamily="monospace"
                  />
                </FormControl>
                
                <Box mb={4}>
                  <Flex align="center" mb={2}>
                    <Checkbox 
                      isChecked={useRealAIAnalysis} 
                      onChange={toggleRealAIAnalysis}
                      colorScheme="teal"
                      mr={2}
                    />
                    <Text color="gray.600" fontSize="sm">
                      Use real AI analysis {!useRealAIAnalysis && '(currently using simulated AI)'}
                    </Text>
                  </Flex>
                  <Text fontSize="xs" color="gray.500">
                    Real AI analysis uses OpenAI's GPT-4 to analyze the contract code for vulnerabilities.
                  </Text>
                </Box>
                
                <Button 
                  leftIcon={<FiCode />}
                  colorScheme="sonic" 
                  onClick={analyzeContractCode}
                  isLoading={isAnalyzing}
                  loadingText="Analyzing..."
                  isDisabled={!contractCode.trim()}
                >
                  Analyze Contract
                </Button>
              </Box>
              
              {error && (
                <Alert status="error" borderRadius="md" mb={6}>
                  <AlertIcon />
                  <AlertTitle mr={2}>Error!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </TabPanel>
            
            <TabPanel>
              {isAnalyzing ? (
                <Box textAlign="center" py={10}>
                  <Spinner size="xl" color="sonic.500" mb={4} />
                  <Text color="white">Analyzing smart contract...</Text>
                  <Text color="gray.400" fontSize="sm" mt={2}>This may take a few moments</Text>
                </Box>
              ) : analysisResult ? (
                <Box>
                  <Box bg="gray.800" p={6} borderRadius="md" mb={6}>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Heading as="h2" size="md" color="white">
                        Analysis Summary
                      </Heading>
                      
                      <HStack>
                        <Badge {...getRiskBadgeProps(analysisResult.riskLevel)} fontSize="md" py={1} px={2}>
                          {analysisResult.riskLevel} Risk
                        </Badge>
                        
                        {analysisResult.source && (
                          <Badge 
                            colorScheme={analysisResult.source === 'openai' ? 'green' : 'gray'} 
                            variant="outline" 
                            fontSize="xs"
                          >
                            {analysisResult.source === 'openai' ? 'AI Analysis' : 'Mock Data'}
                          </Badge>
                        )}
                        
                        {analysisResult.contractAddress && (
                          <BlockExplorerLink 
                            type="address" 
                            value={analysisResult.contractAddress}
                            linkProps={{ 
                              bg: 'gray.700', 
                              px: 3, 
                              py: 2, 
                              borderRadius: 'md',
                              _hover: { bg: 'gray.600' }
                            }}
                          />
                        )}
                      </HStack>
                    </Flex>
                    
                    <Text color="white" mb={4}>
                      {analysisResult.summary}
                    </Text>
                    
                    <Box mb={4}>
                      <Text color="gray.400" mb={2}>Risk Score</Text>
                      <Progress 
                        value={analysisResult.overallRiskScore} 
                        colorScheme={
                          analysisResult.overallRiskScore >= 75 ? 'red' :
                          analysisResult.overallRiskScore >= 50 ? 'orange' :
                          analysisResult.overallRiskScore >= 25 ? 'yellow' : 'green'
                        }
                        borderRadius="md"
                        height="24px"
                      />
                      <Flex justify="space-between" mt={1}>
                        <Text color="gray.400" fontSize="sm">Safe</Text>
                        <Text color="white" fontWeight="bold">
                          {analysisResult.overallRiskScore}/100
                        </Text>
                        <Text color="gray.400" fontSize="sm">Critical</Text>
                      </Flex>
                    </Box>
                  </Box>
                  
                  <Box bg="gray.800" p={6} borderRadius="md" mb={6}>
                    <Heading as="h2" size="md" color="white" mb={4}>
                      Vulnerabilities ({analysisResult.vulnerabilities?.length || 0})
                    </Heading>
                    
                    {analysisResult.vulnerabilities?.length > 0 ? (
                      <Table variant="simple" color="gray.200">
                        <Thead>
                          <Tr>
                            <Th color="gray.400">Type</Th>
                            <Th color="gray.400">Severity</Th>
                            <Th color="gray.400">Description</Th>
                            <Th color="gray.400">Location</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {analysisResult.vulnerabilities.map((vuln, index) => (
                            <Tr key={index} _hover={{ bg: 'gray.700' }}>
                              <Td fontWeight="medium">{vuln.type}</Td>
                              <Td>
                                <Badge {...getSeverityBadgeProps(vuln.severity)} />
                              </Td>
                              <Td>{vuln.description}</Td>
                              <Td fontFamily="monospace">{vuln.location}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    ) : (
                      <Alert status="success" borderRadius="md">
                        <AlertIcon />
                        <AlertTitle mr={2}>No vulnerabilities found!</AlertTitle>
                        <AlertDescription>The contract appears to be secure based on our analysis.</AlertDescription>
                      </Alert>
                    )}
                  </Box>
                  
                  {analysisResult.vulnerabilities?.length > 0 && (
                    <Box bg="gray.800" p={6} borderRadius="md">
                      <Heading as="h2" size="md" color="white" mb={4}>
                        Recommendations
                      </Heading>
                      
                      <VStack align="stretch" spacing={4}>
                        {analysisResult.vulnerabilities.map((vuln, index) => (
                          <Box key={index} p={4} bg="gray.700" borderRadius="md">
                            <Flex align="center" mb={2}>
                              <Badge {...getSeverityBadgeProps(vuln.severity)} mr={2} />
                              <Text color="white" fontWeight="bold">{vuln.type}</Text>
                            </Flex>
                            <Text color="gray.300" mb={2}>{vuln.description}</Text>
                            <Divider my={2} borderColor="gray.600" />
                            <Text color="white" fontWeight="bold" mb={1}>Recommendation:</Text>
                            <Text color="sonic.300">{vuln.recommendation}</Text>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box textAlign="center" py={10} bg="gray.800" borderRadius="md">
                  <FiCode size={48} color="var(--chakra-colors-gray-400)" style={{ margin: '0 auto 1rem' }} />
                  <Text color="white" fontSize="lg" mb={2}>No analysis results yet</Text>
                  <Text color="gray.400">
                    Go to the "Analyze Code" tab to analyze a smart contract
                  </Text>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default SmartContractAnalyzer; 