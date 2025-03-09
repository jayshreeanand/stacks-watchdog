import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Link,
  Text,
  Skeleton,
  SkeletonText,
  Box,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { getAddressUrl } from '../../utils/apiService';
import BlockExplorerLink from '../BlockExplorerLink';

// Helper function to format address
const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Helper function to get badge color based on risk level
const getRiskBadgeProps = (riskLevel) => {
  switch (riskLevel) {
    case 'low':
      return { colorScheme: 'green', children: 'Low' };
    case 'medium':
      return { colorScheme: 'orange', children: 'Medium' };
    case 'high':
      return { colorScheme: 'red', children: 'High' };
    case 'critical':
      return { bg: 'red.900', color: 'white', children: 'Critical' };
    default:
      return { colorScheme: 'gray', children: 'Unknown' };
  }
};

const RecentDrainersTable = ({ drainers, loading }) => {
  if (loading) {
    return (
      <Box>
        <SkeletonText mt="4" noOfLines={5} spacing="4" skeletonHeight="10" />
      </Box>
    );
  }

  if (!drainers || drainers.length === 0) {
    return (
      <Text color="gray.400" textAlign="center" py={4}>
        No wallet drainers found.
      </Text>
    );
  }

  return (
    <Table variant="simple" size="md" color="gray.200">
      <Thead>
        <Tr>
          <Th color="gray.400">Address</Th>
          <Th color="gray.400">Name</Th>
          <Th color="gray.400">Risk Level</Th>
          <Th color="gray.400" isNumeric>Victims</Th>
          <Th color="gray.400" isNumeric>Total Stolen (ETN)</Th>
          <Th color="gray.400">Last Active</Th>
        </Tr>
      </Thead>
      <Tbody>
        {drainers.map((drainer) => (
          <Tr key={drainer.address} _hover={{ bg: 'gray.700' }}>
            <Td>
              <Flex align="center">
                <Link
                  as={RouterLink}
                  to={`/app/wallet-drainers/${drainer.address}`}
                  color="electroneum.400"
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
            <Td>{formatDate(drainer.lastActive)}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default RecentDrainersTable; 