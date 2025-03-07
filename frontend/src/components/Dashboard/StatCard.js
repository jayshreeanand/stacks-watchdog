import React from 'react';
import {
  Box,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
  Skeleton,
} from '@chakra-ui/react';

const StatCard = ({ title, value, icon, color, loading }) => {
  return (
    <Box
      bg="gray.800"
      p={5}
      borderRadius="lg"
      boxShadow="md"
      transition="transform 0.3s"
      _hover={{ transform: 'translateY(-5px)' }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <StatLabel color="gray.400" fontSize="sm" fontWeight="medium">
            {title}
          </StatLabel>
          <Skeleton isLoaded={!loading} mt={2}>
            <StatNumber color="white" fontSize="2xl" fontWeight="bold">
              {value}
            </StatNumber>
          </Skeleton>
        </Box>
        <Box
          p={2}
          bg={`${color}20`}
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={icon} boxSize={6} color={color} />
        </Box>
      </Flex>
    </Box>
  );
};

export default StatCard; 