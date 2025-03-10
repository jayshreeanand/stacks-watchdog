import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="70vh"
      textAlign="center"
      px={4}
    >
      <Icon as={FiAlertTriangle} boxSize={16} color="sonic.500" mb={6} />
      
      <Heading as="h1" size="2xl" color="white" mb={4}>
        404 - Page Not Found
      </Heading>
      
      <Text color="gray.400" fontSize="xl" maxW="lg" mb={8}>
        The page you are looking for doesn't exist or has been moved.
      </Text>
      
      <Button
        as={RouterLink}
        to="/"
        colorScheme="sonic"
        size="lg"
        leftIcon={<FiHome />}
      >
        Return to Dashboard
      </Button>
    </Flex>
  );
};

export default NotFound; 