import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  Icon,
  Text,
  Link,
  Divider,
  Image,
} from '@chakra-ui/react';
import { 
  FiHome, 
  FiAlertTriangle, 
  FiSearch, 
  FiShield 
} from 'react-icons/fi';

const NavItem = ({ icon, children, to, ...rest }) => {
  return (
    <Link
      as={RouterLink}
      to={to}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      {({ isActive }) => (
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={isActive ? 'electroneum.500' : 'transparent'}
          color={isActive ? 'white' : 'gray.300'}
          _hover={{
            bg: 'electroneum.400',
            color: 'white',
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              as={icon}
            />
          )}
          {children}
        </Flex>
      )}
    </Link>
  );
};

const Sidebar = () => {
  return (
    <Box
      bg="gray.800"
      borderRight="1px"
      borderRightColor="gray.700"
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold" color="white">
          ETN Watchdog
        </Text>
      </Flex>
      <VStack spacing={1} align="stretch" mt={6}>
        <NavItem to="/" icon={FiHome}>
          Dashboard
        </NavItem>
        <NavItem to="/wallet-drainers" icon={FiAlertTriangle}>
          Wallet Drainers
        </NavItem>
        <NavItem to="/analyze" icon={FiSearch}>
          Analyze Contract
        </NavItem>
        <Divider my={4} borderColor="gray.700" />
        <Box px={8} py={4}>
          <Text color="gray.400" fontSize="sm">
            ETN Watchdog v0.1.0
          </Text>
          <Text color="gray.500" fontSize="xs" mt={1}>
            Protecting the Electroneum ecosystem
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar; 