import React, { useState, useRef } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  Text,
  Icon,
  Badge,
  useColorModeValue,
  useToast,
  Box,
  HStack,
  VStack
} from '@chakra-ui/react';
import { FiDatabase, FiChevronDown, FiCheck, FiCode, FiGlobe } from 'react-icons/fi';
import { useDataSource, DATA_SOURCES } from '../context/DataSourceContext';
import { setApiBaseUrl } from '../utils/apiService';

const DataSourceSelector = () => {
  const { dataSource, changeDataSource, getNetworkName } = useDataSource();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Get badge color based on data source
  const getBadgeColor = () => {
    switch (dataSource) {
      case DATA_SOURCES.MOCK:
        return 'gray';
      case DATA_SOURCES.TESTNET:
        return 'orange';
      case DATA_SOURCES.MAINNET:
        return 'green';
      default:
        return 'gray';
    }
  };
  
  // Handle data source change
  const handleDataSourceChange = (newSource) => {
    if (newSource === dataSource) {
      console.log(`Already using ${newSource} data source`);
      return;
    }
    
    console.log(`DataSourceSelector: Changing data source to ${newSource}`);
    
    // Change the data source in the context
    changeDataSource(newSource);
    
    // Update the API base URL
    setApiBaseUrl(newSource);
    
    // Show a toast notification
    toast({
      title: 'Data Source Changed',
      description: `Switched to ${getDataSourceName(newSource)}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    // Force reload the page to ensure all components update
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  
  // Get data source name
  const getDataSourceName = (source) => {
    switch (source) {
      case DATA_SOURCES.MOCK:
        return 'Mock Data';
      case DATA_SOURCES.TESTNET:
        return 'Sonic Blaze Testnet';
      case DATA_SOURCES.MAINNET:
        return 'Sonic Mainnet';
      default:
        return 'Unknown';
    }
  };
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSelect = (newSource) => {
    handleDataSourceChange(newSource);
    setIsOpen(false);
  };
  
  const getStatusColor = () => {
    switch (dataSource) {
      case DATA_SOURCES.MOCK:
        return 'gray';
      case DATA_SOURCES.TESTNET:
        return 'orange';
      case DATA_SOURCES.MAINNET:
        return 'green';
      default:
        return 'gray';
    }
  };
  
  return (
    <Box position="relative" ref={menuRef}>
      <Button
        onClick={toggleMenu}
        size="sm"
        variant="ghost"
        rightIcon={<FiChevronDown />}
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
        </HStack>
      </Button>
      
      {isOpen && (
        <Box
          position="absolute"
          right="0"
          mt="2"
          w="200px"
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
              Mock Data
            </MenuItem>
            <MenuItem
              isActive={dataSource === DATA_SOURCES.TESTNET}
              onClick={() => handleSelect(DATA_SOURCES.TESTNET)}
              icon={<FiCode />}
            >
              Sonic Blaze Testnet
            </MenuItem>
            <MenuItem
              isActive={dataSource === DATA_SOURCES.MAINNET}
              onClick={() => handleSelect(DATA_SOURCES.MAINNET)}
              icon={<FiGlobe />}
            >
              Sonic Mainnet
            </MenuItem>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default DataSourceSelector; 