import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Link,
  Skeleton,
  SkeletonText,
  useToast,
  Icon,
  TableContainer,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiSearch, FiPlus, FiFilter, FiExternalLink } from 'react-icons/fi';
import apiService, { getAddressUrl } from '../utils/apiService';
import { useDataSource } from '../context/DataSourceContext';
import BlockExplorerLink from '../components/BlockExplorerLink';

// Helper functions
import { formatAddress, formatDate, getRiskBadgeProps } from '../utils/formatters';

const WalletDrainers = () => {
  const [drainers, setDrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const { dataSource } = useDataSource();
  const toast = useToast();

  useEffect(() => {
    const fetchDrainers = async () => {
      try {
        setLoading(true);
        const data = await apiService.getWalletDrainers();
        setDrainers(data);
      } catch (error) {
        console.error('Error fetching wallet drainers:', error);
        toast({
          title: 'Error fetching data',
          description: 'Could not load wallet drainers. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDrainers();
  }, [toast, dataSource]);

  // Filter drainers based on search term and risk filter
  const filteredDrainers = drainers.filter((drainer) => {
    const matchesSearch = 
      drainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drainer.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === 'all' || drainer.riskLevel === riskFilter;
    
    return matchesSearch && matchesRisk;
  });

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="xl" color="white">
          Wallet Drainers
        </Heading>
        <Button
          as={RouterLink}
          to="/analyze"
          colorScheme="sonic"
          leftIcon={<FiPlus />}
        >
          Analyze New Contract
        </Button>
      </Flex>

      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        mb={6} 
        gap={4}
        align={{ base: 'stretch', md: 'center' }}
      >
        <InputGroup maxW={{ base: '100%', md: '400px' }}>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search by name or address"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="gray.800"
            border="1px solid"
            borderColor="gray.700"
            _hover={{ borderColor: 'gray.600' }}
            _focus={{ borderColor: 'sonic.500', boxShadow: '0 0 0 1px var(--chakra-colors-sonic-500)' }}
          />
        </InputGroup>

        <HStack spacing={4}>
          <Flex align="center">
            <FiFilter color="gray.400" style={{ marginRight: '8px' }} />
            <Select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              bg="gray.800"
              border="1px solid"
              borderColor="gray.700"
              _hover={{ borderColor: 'gray.600' }}
              _focus={{ borderColor: 'sonic.500' }}
              w={{ base: '100%', md: '150px' }}
            >
              <option value="all">All Risks</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
          </Flex>
        </HStack>
      </Flex>

      <Box
        bg="gray.800"
        borderRadius="lg"
        p={6}
        boxShadow="md"
        overflowX="auto"
      >
        {loading ? (
          <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="10" />
        ) : filteredDrainers.length === 0 ? (
          <Text color="gray.400" textAlign="center" py={8}>
            No wallet drainers found matching your criteria.
          </Text>
        ) : (
          <TableContainer mt={6}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Address</Th>
                  <Th>Type</Th>
                  <Th>Risk Level</Th>
                  <Th isNumeric>Victims</Th>
                  <Th color="gray.400" isNumeric>Total Stolen (STX)</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredDrainers.map((drainer) => (
                  <Tr key={drainer.address} _hover={{ bg: 'gray.700' }}>
                    <Td>
                      <Flex align="center">
                        <Link
                          as={RouterLink}
                          to={`/app/wallet-drainers/${drainer.address}`}
                          color="sonic.400"
                          fontWeight="medium"
                          mr={2}
                        >
                          {formatAddress(drainer.address)}
                        </Link>
                        <BlockExplorerLink 
                          type="address" 
                          value={drainer.address} 
                          showExternalIcon={true}
                          truncate={false}
                          label=""
                        />
                      </Flex>
                    </Td>
                    <Td>{drainer.name}</Td>
                    <Td>
                      <Badge {...getRiskBadgeProps(drainer.riskLevel)} />
                    </Td>
                    <Td isNumeric>{drainer.victims}</Td>
                    <Td isNumeric>{drainer.totalStolen.toLocaleString()}</Td>
                    <Td>
                      <Badge
                        colorScheme={drainer.isVerified ? 'green' : 'gray'}
                      >
                        {drainer.isVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default WalletDrainers; 