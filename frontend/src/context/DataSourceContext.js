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
  // Get initial data source from localStorage or default to mock
  const [dataSource, setDataSource] = useState(() => {
    const savedDataSource = localStorage.getItem('etn_watchdog_data_source');
    return savedDataSource || DATA_SOURCES.MOCK;
  });

  // Initialize API URL when the app loads
  useEffect(() => {
    console.log('DataSourceProvider initialized with data source:', dataSource);
    setApiBaseUrl(dataSource);
  }, []);

  // Save data source preference to localStorage when it changes
  useEffect(() => {
    console.log('Data source changed to:', dataSource);
    localStorage.setItem('etn_watchdog_data_source', dataSource);
  }, [dataSource]);

  // Function to change data source
  const changeDataSource = (newSource) => {
    console.log(`Changing data source from ${dataSource} to ${newSource}`);
    if (Object.values(DATA_SOURCES).includes(newSource)) {
      setDataSource(newSource);
      setApiBaseUrl(newSource);
    } else {
      console.error(`Invalid data source: ${newSource}`);
    }
  };

  // Get the current network name for display
  const getNetworkName = () => {
    switch (dataSource) {
      case DATA_SOURCES.MOCK:
        return 'Mock Data';
      case DATA_SOURCES.TESTNET:
        return 'Electroneum Testnet';
      case DATA_SOURCES.MAINNET:
        return 'Electroneum Mainnet';
      default:
        return 'Unknown Network';
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