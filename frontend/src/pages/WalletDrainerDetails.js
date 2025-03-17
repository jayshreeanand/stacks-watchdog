import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Badge,
  Divider,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Icon,
  Skeleton,
  SkeletonText,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  SimpleGrid,
  TableContainer,
} from '@chakra-ui/react';
import { 
  FiArrowLeft, 
  FiExternalLink, 
  FiAlertTriangle, 
  FiCheck, 
  FiX, 
  FiTrash2 
} from 'react-icons/fi';
import apiService, { getAddressUrl, getTransactionUrl } from '../utils/apiService';
import { useDataSource } from '../context/DataSourceContext';
import BlockExplorerLink from '../components/BlockExplorerLink';

// Utils
import { formatDate, getRiskBadgeProps } from '../utils/formatters';

const WalletDrainerDetails = () => {
  const { address } = useParams();
  const { dataSource } = useDataSource();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const [drainer, setDrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrainerDetails = async () => {
      try {
        setLoading(true);
        const data = await apiService.getWalletDrainerByAddress(address);
        setDrainer(data);
      } catch (error) {
        console.error(`Error fetching wallet drainer details for ${address}:`, error);
        toast({
          title: 'Error fetching data',
          description: 'Could not load wallet drainer details. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDrainerDetails();
  }, [address, toast]);

  const handleVerify = async () => {
    try {
      await apiService.verifyWalletDrainer(
        address,
        'CurrentUser', // In a real app, this would be the logged-in user
        !drainer.isVerified,
        'Verification status updated via UI'
      );
      
      setDrainer({
        ...drainer,
        isVerified: !drainer.isVerified,
        verifiedBy: 'CurrentUser',
      });
      
      toast({
        title: 'Success',
        description: `Wallet drainer ${drainer.isVerified ? 'unverified' : 'verified'} successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(`Error updating verification status for ${address}:`, error);
      toast({
        title: 'Error',
        description: 'Could not update verification status. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.deleteWalletDrainer(address);
      
      toast({
        title: 'Success',
        description: 'Wallet drainer deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/wallet-drainers');
    } catch (error) {
      console.error(`Error deleting wallet drainer ${address}:`, error);
      toast({
        title: 'Error',
        description: 'Could not delete wallet drainer. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  if (loading) {
    return (
      <Box>
        <Flex align="center" mb={6}>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            color="gray.400"
            onClick={() => navigate('/wallet-drainers')}
            mr={4}
          >
            Back
          </Button>
          <Skeleton height="36px" width="300px" />
        </Flex>
        <SkeletonText mt="4" noOfLines={20} spacing="4" skeletonHeight="4" />
      </Box>
    );
  }

  if (!drainer) {
    return (
      <Box textAlign="center" py={10}>
        <Heading as="h2" size="xl" color="white" mb={6}>
          Wallet Drainer Not Found
        </Heading>
        <Text color="gray.400" mb={6}>
          The wallet drainer with address {address} could not be found.
        </Text>
        <Button
          leftIcon={<FiArrowLeft />}
          colorScheme="sonic"
          onClick={() => navigate('/wallet-drainers')}
        >
          Back to Wallet Drainers
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Flex align="center" mb={6}>
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          color="gray.400"
          onClick={() => navigate('/wallet-drainers')}
          mr={4}
        >
          Back
        </Button>
        <Heading as="h1" size="xl" color="white">
          {drainer.name}
        </Heading>
        <Badge {...getRiskBadgeProps(drainer.riskLevel)} ml={4} fontSize="md" py={1} px={2}>
          {drainer.riskLevel.charAt(0).toUpperCase() + drainer.riskLevel.slice(1)} Risk
        </Badge>
      </Flex>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        <GridItem>
          <Box bg="gray.800" p={6} borderRadius="lg" boxShadow="md" mb={6}>
            <Heading as="h2" size="md" color="white" mb={4}>
              Details
            </Heading>
            
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
              <Box>
                <Text color="gray.400" fontSize="sm">Address</Text>
                <Flex align="center" mt={1}>
                  <Text fontWeight="bold" fontSize="lg" color="white">
                    {drainer.address}
                  </Text>
                  <BlockExplorerLink 
                    type="address" 
                    value={drainer.address} 
                    truncate={false}
                    ml={2}
                  />
                </Flex>
              </Box>
              
              <Box>
                <Text color="gray.400" fontSize="sm">Status</Text>
                <Flex align="center" mt={1}>
                  <Badge colorScheme={drainer.isVerified ? 'green' : 'gray'}>
                    {drainer.isVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                  {drainer.verifiedBy && (
                    <Text color="gray.400" fontSize="xs" ml={2}>
                      by {drainer.verifiedBy}
                    </Text>
                  )}
                </Flex>
              </Box>
              
              <Box>
                <Text color="gray.400" fontSize="sm">First Detected</Text>
                <Text color="white" mt={1}>{formatDate(drainer.createdAt)}</Text>
              </Box>
              
              <Box>
                <Text color="gray.400" fontSize="sm">Last Active</Text>
                <Text color="white" mt={1}>{formatDate(drainer.lastActive)}</Text>
              </Box>
            </Grid>

            <Divider my={4} borderColor="gray.700" />
            
            <Text color="gray.400" fontSize="sm" mb={2}>Description</Text>
            <Text color="white">{drainer.description}</Text>
            
            {drainer.verificationNotes && (
              <>
                <Text color="gray.400" fontSize="sm" mt={4} mb={2}>Verification Notes</Text>
                <Text color="white">{drainer.verificationNotes}</Text>
              </>
            )}
          </Box>

          <Box bg="gray.800" p={6} borderRadius="lg" boxShadow="md">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading as="h2" size="md" color="white">
                Victims
              </Heading>
              <Badge colorScheme="red">{drainer.victims?.length || 0} Total</Badge>
            </Flex>
            
            {drainer.victims && drainer.victims.length > 0 ? (
              <Table variant="simple" size="sm" color="gray.200">
                <Thead>
                  <Tr>
                    <Th color="gray.400">Address</Th>
                    <Th color="gray.400" isNumeric>Amount (STX)</Th>
                    <Th color="gray.400">Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {drainer.victims.map((victim, index) => (
                    <Tr key={index}>
                      <Td>
                        <BlockExplorerLink 
                          type="address" 
                          value={victim.address} 
                        />
                      </Td>
                      <Td isNumeric>{victim.amount.toLocaleString()} S</Td>
                      <Td>{formatDate(victim.timestamp)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text color="gray.400" textAlign="center" py={4}>
                No victims recorded for this wallet drainer.
              </Text>
            )}
          </Box>
        </GridItem>

        <GridItem>
          <Box bg="gray.800" p={6} borderRadius="lg" boxShadow="md" mb={6}>
            <Heading as="h2" size="md" color="white" mb={4}>
              Summary
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
              <Stat>
                <StatLabel color="gray.400">Risk Level</StatLabel>
                <StatNumber>
                  <Badge {...getRiskBadgeProps(drainer.riskLevel)} />
                </StatNumber>
                <StatHelpText>Based on analysis</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel color="gray.400">Victims</StatLabel>
                <StatNumber>{drainer.victims?.length || 0}</StatNumber>
                <StatHelpText>Affected wallets</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel color="gray.400">Total S Stolen</StatLabel>
                <StatNumber>{drainer.totalStolen.toLocaleString()} S</StatNumber>
                <StatHelpText>Estimated value</StatHelpText>
              </Stat>
            </SimpleGrid>
          </Box>

          <Box bg="gray.800" p={6} borderRadius="lg" boxShadow="md">
            <Heading as="h2" size="md" color="white" mb={4}>
              Actions
            </Heading>
            
            <Flex direction="column" gap={3}>
              <Button
                leftIcon={drainer.isVerified ? <FiX /> : <FiCheck />}
                colorScheme={drainer.isVerified ? 'red' : 'green'}
                variant="outline"
                justifyContent="flex-start"
                onClick={handleVerify}
              >
                {drainer.isVerified ? 'Mark as Unverified' : 'Mark as Verified'}
              </Button>
              
              <Button
                leftIcon={<FiTrash2 />}
                colorScheme="red"
                variant="outline"
                justifyContent="flex-start"
                onClick={onOpen}
              >
                Delete Wallet Drainer
              </Button>
            </Flex>
          </Box>
        </GridItem>
      </Grid>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800" color="white">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Wallet Drainer
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this wallet drainer? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default WalletDrainerDetails; 