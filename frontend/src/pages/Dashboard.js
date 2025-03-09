import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Link,
  Button,
  useColorModeValue,
  Skeleton,
  HStack,
} from '@chakra-ui/react';
import { FiAlertTriangle, FiTrendingUp, FiUsers, FiShield, FiExternalLink } from 'react-icons/fi';
import apiService, { getExplorerUrl } from '../utils/apiService';
import { mockDashboardStats } from '../utils/mockData';
import { useDataSource } from '../context/DataSourceContext';
import BlockExplorerLink from '../components/BlockExplorerLink';

// Components
import StatCard from '../components/Dashboard/StatCard';
import RecentDrainersTable from '../components/Dashboard/RecentDrainersTable';
import DataSourceSelector from '../components/DataSourceSelector';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDrainers: 0,
    activeDrainers: 0,
    totalVictims: 0,
    totalLost: 0,
  });
  const [recentDrainers, setRecentDrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dataSource, isUsingMockData } = useDataSource();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`Dashboard fetching data with source: ${dataSource}, isUsingMockData: ${isUsingMockData}`);
        
        // Set whether to force mock data based on data source
        apiService.setForceMockData(isUsingMockData);
        
        // Fetch dashboard stats
        console.log('Fetching dashboard stats...');
        const dashboardStats = await apiService.getDashboardStats();
        console.log('Received dashboard stats:', dashboardStats);
        setStats(dashboardStats);

        // Fetch recent drainers
        console.log('Fetching recent drainers...');
        const drainers = await apiService.getRecentWalletDrainers(5);
        console.log('Received recent drainers:', drainers);
        setRecentDrainers(drainers);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataSource, isUsingMockData]);

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="xl" color="white">
          Dashboard
        </Heading>
        <HStack spacing={4}>
          <BlockExplorerLink 
            type="explorer" 
            label="Block Explorer" 
            linkProps={{ 
              bg: 'gray.700', 
              px: 3, 
              py: 2, 
              borderRadius: 'md',
              _hover: { bg: 'gray.600' }
            }}
          />
          <DataSourceSelector />
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard
          title="Total Drainers"
          value={stats.totalDrainers}
          icon={FiAlertTriangle}
          color="red.500"
          loading={loading}
        />
        <StatCard
          title="Active Drainers"
          value={stats.activeDrainers}
          icon={FiShield}
          color="orange.500"
          loading={loading}
        />
        <StatCard
          title="Total Victims"
          value={stats.totalVictims}
          icon={FiUsers}
          color="blue.500"
          loading={loading}
        />
        <StatCard
          title="Total ETN Lost"
          value={`${stats.totalLost.toLocaleString()} ETN`}
          icon={FiTrendingUp}
          color="purple.500"
          loading={loading}
        />
      </SimpleGrid>

      <Box
        bg="gray.800"
        borderRadius="lg"
        p={6}
        boxShadow="md"
        mb={8}
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h2" size="md" color="white">
            Recent Wallet Drainers
          </Heading>
          <Button
            as={RouterLink}
            to="/wallet-drainers"
            size="sm"
            colorScheme="electroneum"
          >
            View All
          </Button>
        </Flex>
        <RecentDrainersTable drainers={recentDrainers} loading={loading} />
      </Box>
    </Box>
  );
};

export default Dashboard; 