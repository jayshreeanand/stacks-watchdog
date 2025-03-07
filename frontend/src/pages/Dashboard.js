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
import axios from 'axios';

// Components
import StatCard from '../components/Dashboard/StatCard';
import RecentDrainersTable from '../components/Dashboard/RecentDrainersTable';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDrainers: 0,
    activeDrainers: 0,
    totalVictims: 0,
    totalLost: 0,
  });
  const [recentDrainers, setRecentDrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would fetch actual stats from your API
        // For now, we'll use mock data
        setStats({
          totalDrainers: 156,
          activeDrainers: 42,
          totalVictims: 328,
          totalLost: 1250000,
        });

        // Fetch recent drainers
        const response = await axios.get('/api/walletdrainer/recent?limit=5');
        setRecentDrainers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Use mock data for demonstration
        setRecentDrainers([
          {
            address: '0x1234567890abcdef1234567890abcdef12345678',
            name: 'Fake ETN Airdrop',
            riskLevel: 'high',
            victims: 12,
            totalStolen: 45000,
            lastActive: '2023-03-05T12:30:45Z',
          },
          {
            address: '0xabcdef1234567890abcdef1234567890abcdef12',
            name: 'ETN Staking Scam',
            riskLevel: 'critical',
            victims: 28,
            totalStolen: 120000,
            lastActive: '2023-03-04T18:15:22Z',
          },
          {
            address: '0x7890abcdef1234567890abcdef1234567890abcd',
            name: 'Fake DEX Frontend',
            riskLevel: 'medium',
            victims: 5,
            totalStolen: 18000,
            lastActive: '2023-03-03T09:45:11Z',
          },
        ]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6} color="white">
        Dashboard
      </Heading>

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