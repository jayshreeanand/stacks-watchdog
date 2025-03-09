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
} from '@chakra-ui/react';
import { FiAlertTriangle, FiTrendingUp, FiUsers, FiShield } from 'react-icons/fi';
import apiService from '../utils/apiService';
import { mockDashboardStats } from '../utils/mockData';
import { useDataSource } from '../context/DataSourceContext';

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
        
        // Set whether to force mock data based on data source
        apiService.setForceMockData(isUsingMockData);
        
        // Fetch dashboard stats
        const dashboardStats = await apiService.getDashboardStats();
        setStats(dashboardStats);

        // Fetch recent drainers
        const drainers = await apiService.getRecentWalletDrainers(5);
        setRecentDrainers(drainers);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isUsingMockData]);

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="xl" color="white">
          Dashboard
        </Heading>
        <DataSourceSelector />
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