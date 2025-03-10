import React, { createContext, useState, useContext, useEffect } from 'react';
import { setApiBaseUrl } from '../utils/apiService';

// Data source options
export const DATA_SOURCES = {
  MOCK: 'mock',
  TESTNET: 'testnet',
  MAINNET: 'mainnet'
};

// Create context
const DataSourceContext = createContext();

// Custom hook to use the data source context
export const useDataSource = () => {
  return useContext(DataSourceContext);
};

// Provider component
export const DataSourceProvider = ({ children }) => {
  // Check if there's a data source in localStorage or use testnet as default
  const savedDataSource = localStorage.getItem('sonic_watchdog_data_source');
  const initialDataSource = savedDataSource || DATA_SOURCES.TESTNET;
  
  console.log(`DataSourceProvider initializing with data source: ${initialDataSource}`);
  
  const [dataSource, setDataSource] = useState(initialDataSource);
  const [useRealWalletData, setUseRealWalletData] = useState(true);
  
  // Initialize API URL when the component mounts
  useEffect(() => {
    console.log(`DataSourceProvider: Setting API base URL to ${dataSource}`);
    setApiBaseUrl(dataSource);
  }, []);
  
  // Update localStorage when data source changes
  useEffect(() => {
    console.log(`DataSourceProvider: Data source changed to ${dataSource}`);
    localStorage.setItem('sonic_watchdog_data_source', dataSource);
    
    // Also update the API base URL when the data source changes
    setApiBaseUrl(dataSource);
  }, [dataSource]);
  
  // Function to change data source
  const changeDataSource = (newSource) => {
    console.log(`DataSourceProvider: Changing data source from ${dataSource} to ${newSource}`);
    
    if (Object.values(DATA_SOURCES).includes(newSource)) {
      // Update the data source state
      setDataSource(newSource);
      
      // Show a message to the user
      alert(`Switching to ${newSource === 'mock' ? 'Mock Data' : 
             newSource === 'testnet' ? 'Sonic Blaze Testnet' : 'Sonic Mainnet'}`);
      
      // Reload the page to ensure all components update
      window.location.reload();
    } else {
      console.error(`DataSourceProvider: Invalid data source: ${newSource}`);
    }
  };
  
  // Function to toggle real wallet data usage
  const toggleRealWalletData = () => {
    console.log(`DataSourceProvider: Toggling real wallet data from ${useRealWalletData} to ${!useRealWalletData}`);
    setUseRealWalletData(!useRealWalletData);
  };
  
  // Function to get the network name based on data source
  const getNetworkName = () => {
    if (dataSource === DATA_SOURCES.MOCK) {
      return 'Mock Data';
    } else if (dataSource === DATA_SOURCES.TESTNET) {
      return 'Sonic Blaze Testnet';
    } else {
      return 'Sonic Mainnet';
    }
  };
  
  const contextValue = {
    dataSource,
    changeDataSource,
    getNetworkName,
    useRealWalletData,
    toggleRealWalletData,
    isMockData: dataSource === DATA_SOURCES.MOCK,
    isTestnet: dataSource === DATA_SOURCES.TESTNET,
    isMainnet: dataSource === DATA_SOURCES.MAINNET
  };
  
  return (
    <DataSourceContext.Provider value={contextValue}>
      {children}
    </DataSourceContext.Provider>
  );
};

export default DataSourceContext; 