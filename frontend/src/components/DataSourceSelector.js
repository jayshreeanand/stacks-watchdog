import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Badge,
  useOutsideClick,
  Tooltip
} from '@chakra-ui/react';
import { FiDatabase, FiChevronDown, FiCode, FiGlobe, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { useDataSource, DATA_SOURCES } from '../context/DataSourceContext';

// MenuItem component
const MenuItem = ({ children, isActive, icon, onClick, ...rest }) => {
  return (
    <Box
      px={3}
      py={2}
      borderRadius="md"
      cursor="pointer"
      bg={isActive ? 'blue.500' : 'transparent'}
      color={isActive ? 'white' : 'gray.200'}
      _hover={{ bg: isActive ? 'blue.600' : 'gray.700' }}
      onClick={onClick}
      {...rest}
    >
      <HStack spacing={2}>
        {icon && <Box>{icon}</Box>}
        <Text flex="1">{children}</Text>
        {isActive && <FiCheck />}
      </HStack>
    </Box>
  );
};

const DataSourceSelector = () => {
  const { dataSource, changeDataSource, getNetworkName, isMockData } = useDataSource();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Close menu when clicking outside
  useOutsideClick({
    ref: menuRef,
    handler: () => setIsOpen(false),
  });
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSelect = (newSource) => {
    if (newSource !== dataSource) {
      changeDataSource(newSource);
    }
    setIsOpen(false);
  };
  
  const getStatusColor = () => {
    switch (dataSource) {
      case DATA_SOURCES.MOCK:
        return 'gray.500';
      case DATA_SOURCES.TESTNET:
        return 'orange.400';
      case DATA_SOURCES.MAINNET:
        return 'green.400';
      default:
        return 'gray.500';
    }
  };
  
  return (
    <Box position="relative" ref={menuRef}>
      <Tooltip 
        label={isMockData ? "Currently using mock data. Switch to testnet for real data." : "Data source"} 
        hasArrow
      >
        <Button
          onClick={toggleMenu}
          size="sm"
          variant="ghost"
          rightIcon={<FiChevronDown />}
          leftIcon={isMockData ? <FiAlertTriangle color="yellow.400" /> : null}
          _hover={{ bg: 'gray.700' }}
        >
          <HStack spacing={2}>
            <Box 
              w="10px" 
              h="10px" 
              borderRadius="full" 
              bg={getStatusColor()} 
            />
            <Text>{getNetworkName()}</Text>
            {isMockData && (
              <Badge colorScheme="yellow" variant="solid" fontSize="xs">
                MOCK
              </Badge>
            )}
          </HStack>
        </Button>
      </Tooltip>
      
      {isOpen && (
        <Box
          position="absolute"
          right="0"
          mt="2"
          w="220px"
          bg="gray.800"
          borderRadius="md"
          boxShadow="lg"
          zIndex="dropdown"
          p="2"
        >
          <VStack align="stretch" spacing="1">
            <MenuItem
              isActive={dataSource === DATA_SOURCES.MOCK}
              onClick={() => handleSelect(DATA_SOURCES.MOCK)}
              icon={<FiDatabase />}
            >
              <HStack>
                <Text>Mock Data</Text>
                <Badge colorScheme="yellow" size="sm">Testing</Badge>
              </HStack>
            </MenuItem>
            <MenuItem
              isActive={dataSource === DATA_SOURCES.TESTNET}
              onClick={() => handleSelect(DATA_SOURCES.TESTNET)}
              icon={<FiCode />}
            >
              <HStack>
                <Text>Stacks Testnet</Text>
                <Badge colorScheme="green" size="sm">Recommended</Badge>
              </HStack>
            </MenuItem>
            <MenuItem
              isActive={dataSource === DATA_SOURCES.MAINNET}
              onClick={() => handleSelect(DATA_SOURCES.MAINNET)}
              icon={<FiGlobe />}
            >
              Stacks Mainnet
            </MenuItem>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default DataSourceSelector; 