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
  CloseButton,
} from '@chakra-ui/react';
import { 
  FiHome, 
  FiAlertTriangle, 
  FiSearch, 
  FiShield,
  FiExternalLink,
  FiBell,
  FiLock,
  FiKey,
  FiCode,
  FiBookOpen,
  FiActivity
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
          bg={isActive ? 'sonic.500' : 'transparent'}
          color={isActive ? 'white' : 'gray.300'}
          _hover={{
            bg: 'sonic.400',
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

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <Box
      bg="gray.800"
      borderRight="1px"
      borderRightColor="gray.700"
      w={{ base: 'full', md: '240px' }}
      pos="fixed"
      h="full"
      zIndex="docked"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
          Sonic Shield AI
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <VStack spacing={1} align="stretch" mt={6}>
        <NavItem to="/app/dashboard" icon={FiHome}>
          Dashboard
        </NavItem>
        <NavItem to="/app/wallet-drainers" icon={FiAlertTriangle}>
          Wallet Drainers
        </NavItem>
        <NavItem to="/app/analyze" icon={FiSearch}>
          Analyze Contract
        </NavItem>
        <NavItem to="/app/smart-contract-analyzer" icon={FiCode}>
          AI Contract Analyzer
        </NavItem>
        <NavItem to="/app/security-scanner" icon={FiShield}>
          Security Scanner
        </NavItem>
        <NavItem to="/app/vulnerability-scanner" icon={FiActivity}>
          Vulnerability Scanner
        </NavItem>
        <NavItem to="/app/token-approvals" icon={FiKey}>
          Token Approvals
        </NavItem>
        <NavItem to="/app/learning-modules" icon={FiBookOpen}>
          Learning Modules
        </NavItem>
        <NavItem to="/app/notification-settings" icon={FiBell}>
          Notifications
        </NavItem>
        <NavItem to="/" icon={FiExternalLink}>
          Home Page
        </NavItem>
        <Divider my={4} borderColor="gray.700" />
        <Box px={8} py={4}>
          <Text color="gray.400" fontSize="sm">
            Sonic Shield v0.1.0
          </Text>
          <Text color="gray.500" fontSize="xs" mt={1}>
            Protecting the Sonic ecosystem
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar; 