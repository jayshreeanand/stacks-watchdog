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
  const context = useContext(DataSourceContext);
  if (!context) {
    throw new Error('useDataSource must be used within a DataSourceProvider');
  }
  return context;
};

// Provider component
export const DataSourceProvider = ({ children }) => {
  // Check if there's a data source in localStorage
  const savedDataSource = localStorage.getItem('sonic_watchdog_data_source');
  const [dataSource, setDataSource] = useState(savedDataSource || 'mock');

  // Initialize API URL when the app loads
  useEffect(() => {
    console.log('DataSourceProvider initialized with data source:', dataSource);
    setApiBaseUrl(dataSource);
  }, []);

  // Save data source preference to localStorage when it changes
  useEffect(() => {
    console.log('Data source changed to:', dataSource);
    localStorage.setItem('sonic_watchdog_data_source', dataSource);
  }, [dataSource]);

  // Function to change data source
  const changeDataSource = (newDataSource) => {
    if (newDataSource === dataSource) return;
    
    setDataSource(newDataSource);
    localStorage.setItem('sonic_watchdog_data_source', newDataSource);
    
    // Reload the page to apply the new data source
    window.location.reload();
  };

  // Function to get the network name based on data source
  const getNetworkName = () => {
    if (dataSource === 'mock') {
      return 'Mock Data';
    } else if (dataSource === 'testnet') {
      return 'Sonic Blaze Testnet';
    } else {
      return 'Sonic Mainnet';
    }
  };

  // Context value
  const value = {
    dataSource,
    changeDataSource,
    getNetworkName,
    isUsingMockData: dataSource === DATA_SOURCES.MOCK,
    isUsingTestnet: dataSource === DATA_SOURCES.TESTNET,
    isUsingMainnet: dataSource === DATA_SOURCES.MAINNET
  };

  return (
    <DataSourceContext.Provider value={value}>
      {children}
    </DataSourceContext.Provider>
  );
};

export default DataSourceContext; 