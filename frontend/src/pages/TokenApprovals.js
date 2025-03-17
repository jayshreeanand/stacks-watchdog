import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Spinner,
  Icon,
  Flex,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { 
  FaSearch, 
  FaExclamationTriangle, 
  FaShieldAlt, 
  FaFilter, 
  FaChevronDown, 
  FaExternalLinkAlt, 
  FaTrash 
} from 'react-icons/fa';
import { useWallet } from '../context/WalletContext';

const TokenApprovals = () => {
  const { account } = useWallet();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const tableHeaderBg = useColorModeValue('gray.50', 'gray.700');
  const warningBg = useColorModeValue('yellow.50', 'yellow.900');
  
  const [isLoading, setIsLoading] = useState(true);
  const [approvals, setApprovals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, high, unlimited
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const cancelRef = React.useRef();

  // Mock data for token approvals
  const mockApprovals = [
    {
      id: 1,
      token: {
        symbol: 'S',
        name: 'Stacks',
        logo: 'https://cryptologos.cc/logos/sonic-s-logo.png',
        address: '0x4a8f5f96d5436e43112c2fbc6a9f70da9e4e16d4',
      },
      spender: {
        name: 'Uniswap V3',
        address: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
        verified: true,
      },
      allowance: 'Unlimited',
      riskLevel: 'high',
      lastUsed: '2023-02-15T14:30:00Z',
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
        name: 'PancakeSwap',
        address: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
        verified: true,
      },
      allowance: '1,000 USDT',
      riskLevel: 'medium',
      lastUsed: '2023-03-01T09:15:00Z',
    },
    {
      id: 3,
      token: {
        symbol: 'WETH',
        name: 'Wrapped Ether',
        logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      },
      spender: {
        name: 'Unknown Contract',
        address: '0x742d35cc6634c0532925a3b844bc454e4438f44e',
        verified: false,
      },
      allowance: 'Unlimited',
      riskLevel: 'high',
      lastUsed: '2023-01-20T11:45:00Z',
    },
    {
      id: 4,
      token: {
        symbol: 'LINK',
        name: 'Chainlink',
        logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
        address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      },
      spender: {
        name: 'Aave V2',
        address: '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9',
        verified: true,
      },
      allowance: '50 LINK',
      riskLevel: 'low',
      lastUsed: '2023-02-28T16:20:00Z',
    },
    {
      id: 5,
      token: {
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      },
      spender: {
        name: 'Compound',
        address: '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b',
        verified: true,
      },
      allowance: 'Unlimited',
      riskLevel: 'medium',
      lastUsed: '2023-03-05T08:30:00Z',
    },
  ];

  // Load approvals data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApprovals(mockApprovals);
      setIsLoading(false);
    }, 1500);
  }, []);

  // Filter approvals based on search and filter
  const filteredApprovals = approvals.filter((approval) => {
    const matchesSearch = 
      approval.token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.spender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.spender.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'high') return matchesSearch && approval.riskLevel === 'high';
    if (filterStatus === 'unlimited') return matchesSearch && approval.allowance === 'Unlimited';
    
    return matchesSearch;
  });

  const handleRevokeClick = (approval) => {
    setSelectedApproval(approval);
    setIsRevokeDialogOpen(true);
  };

  const handleRevokeConfirm = () => {
    // In a real app, this would call the blockchain to revoke the approval
    toast({
      title: 'Approval revoked',
      description: `Successfully revoked approval for ${selectedApproval.token.symbol} to ${selectedApproval.spender.name}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    // Update the local state to remove the revoked approval
    setApprovals(approvals.filter(a => a.id !== selectedApproval.id));
    setIsRevokeDialogOpen(false);
  };

  const getRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return <Badge colorScheme="red">High Risk</Badge>;
      case 'medium':
        return <Badge colorScheme="orange">Medium Risk</Badge>;
      case 'low':
        return <Badge colorScheme="green">Low Risk</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Token Approvals Manager
          </Heading>
          <Text color={textColor}>
            View and manage your token approvals to enhance your wallet security
          </Text>
        </Box>

        {!account ? (
          <Box textAlign="center" p={8} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
            <Icon as={FaShieldAlt} w={12} h={12} color="blue.400" mb={4} />
            <Heading size="md" mb={2}>Connect Your Wallet</Heading>
            <Text mb={4}>Connect your wallet to view and manage your token approvals</Text>
          </Box>
        ) : isLoading ? (
          <Flex justify="center" align="center" p={8}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Flex>
        ) : (
          <>
            <HStack spacing={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input 
                  placeholder="Search by token or spender" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  bg={bgColor}
                />
              </InputGroup>
              
              <Menu>
                <MenuButton as={Button} rightIcon={<FaChevronDown />} variant="outline">
                  <Icon as={FaFilter} mr={2} />
                  Filter
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setFilterStatus('all')}>
                    All Approvals
                  </MenuItem>
                  <MenuItem onClick={() => setFilterStatus('high')}>
                    High Risk Only
                  </MenuItem>
                  <MenuItem onClick={() => setFilterStatus('unlimited')}>
                    Unlimited Approvals
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>

            {filteredApprovals.length === 0 ? (
              <Box textAlign="center" p={8} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
                <Text>No token approvals found matching your criteria</Text>
              </Box>
            ) : (
              <Box overflowX="auto" borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
                <Table variant="simple">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>Token</Th>
                      <Th>Spender</Th>
                      <Th>Allowance</Th>
                      <Th>Risk Level</Th>
                      <Th>Last Used</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredApprovals.map((approval) => (
                      <Tr key={approval.id}>
                        <Td>
                          <HStack>
                            <Box boxSize="30px" borderRadius="full" overflow="hidden" bg="gray.100">
                              {approval.token.logo && (
                                <img src={approval.token.logo} alt={approval.token.symbol} />
                              )}
                            </Box>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="bold">{approval.token.symbol}</Text>
                              <Text fontSize="xs" color="gray.500">{approval.token.name}</Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <HStack>
                              <Text fontWeight="medium">{approval.spender.name}</Text>
                              {!approval.spender.verified && (
                                <Tooltip label="Unverified contract">
                                  <span>
                                    <Icon as={FaExclamationTriangle} color="orange.500" />
                                  </span>
                                </Tooltip>
                              )}
                            </HStack>
                            <Text fontSize="xs" color="gray.500">
                              {approval.spender.address.substring(0, 6)}...
                              {approval.spender.address.substring(approval.spender.address.length - 4)}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Text fontWeight={approval.allowance === 'Unlimited' ? 'bold' : 'normal'} color={approval.allowance === 'Unlimited' ? 'red.500' : 'inherit'}>
                            {approval.allowance}
                          </Text>
                        </Td>
                        <Td>{getRiskBadge(approval.riskLevel)}</Td>
                        <Td>{formatDate(approval.lastUsed)}</Td>
                        <Td>
                          <HStack spacing={2}>
                            <Tooltip label="View in Explorer">
                              <Button size="sm" variant="ghost" colorScheme="blue">
                                <Icon as={FaExternalLinkAlt} />
                              </Button>
                            </Tooltip>
                            <Tooltip label="Revoke Approval">
                              <Button 
                                size="sm" 
                                colorScheme="red" 
                                variant="outline"
                                onClick={() => handleRevokeClick(approval)}
                              >
                                <Icon as={FaTrash} />
                              </Button>
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}

            <Box p={4} borderWidth="1px" borderRadius="lg" borderColor={borderColor} bg={warningBg}>
              <HStack spacing={3}>
                <Icon as={FaExclamationTriangle} color="yellow.500" boxSize={6} />
                <Box>
                  <Heading size="sm" mb={1}>Security Recommendation</Heading>
                  <Text fontSize="sm">
                    Unlimited token approvals can pose a security risk. Consider revoking unused approvals or setting specific allowance limits.
                  </Text>
                </Box>
              </HStack>
            </Box>
          </>
        )}
      </VStack>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog
        isOpen={isRevokeDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsRevokeDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Revoke Token Approval
            </AlertDialogHeader>

            <AlertDialogBody>
              {selectedApproval && (
                <>
                  <Text mb={4}>
                    Are you sure you want to revoke the approval for <strong>{selectedApproval.token.symbol}</strong> to <strong>{selectedApproval.spender.name}</strong>?
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    This will prevent {selectedApproval.spender.name} from spending your {selectedApproval.token.symbol} tokens.
                  </Text>
                </>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsRevokeDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleRevokeConfirm} ml={3}>
                Revoke
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default TokenApprovals; 