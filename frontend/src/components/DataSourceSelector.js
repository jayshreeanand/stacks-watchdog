import React from 'react';
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
  useToast
} from '@chakra-ui/react';
import { FiDatabase, FiChevronDown, FiCheck } from 'react-icons/fi';
import { useDataSource, DATA_SOURCES } from '../context/DataSourceContext';
import { setApiBaseUrl } from '../utils/apiService';

const DataSourceSelector = () => {
  const { dataSource, changeDataSource, getNetworkName } = useDataSource();
  const toast = useToast();
  
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
        return 'Electroneum Testnet';
      case DATA_SOURCES.MAINNET:
        return 'Electroneum Mainnet';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<FiChevronDown />}
        leftIcon={<FiDatabase />}
        variant="outline"
        size="sm"
        borderColor={useColorModeValue('gray.300', 'gray.600')}
        _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
      >
        <Flex align="center">
          <Text mr={2}>Data Source</Text>
          <Badge colorScheme={getBadgeColor()} variant="solid" fontSize="xs">
            {getNetworkName()}
          </Badge>
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem 
          onClick={() => handleDataSourceChange(DATA_SOURCES.MOCK)}
          icon={dataSource === DATA_SOURCES.MOCK ? <Icon as={FiCheck} color="green.500" /> : null}
        >
          Mock Data
        </MenuItem>
        <MenuItem 
          onClick={() => handleDataSourceChange(DATA_SOURCES.TESTNET)}
          icon={dataSource === DATA_SOURCES.TESTNET ? <Icon as={FiCheck} color="green.500" /> : null}
        >
          Electroneum Testnet
        </MenuItem>
        <MenuItem 
          onClick={() => handleDataSourceChange(DATA_SOURCES.MAINNET)}
          icon={dataSource === DATA_SOURCES.MAINNET ? <Icon as={FiCheck} color="green.500" /> : null}
        >
          Electroneum Mainnet
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default DataSourceSelector; 