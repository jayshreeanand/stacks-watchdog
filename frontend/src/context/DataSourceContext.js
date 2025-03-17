import React, { createContext, useState, useContext, useEffect } from 'react';
import { setApiBaseUrl } from '../utils/apiService';
import aiAnalyzer from '../utils/aiAnalyzer';

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
  const savedDataSource = localStorage.getItem('stacks_watchdog_data_source');
  const initialDataSource = savedDataSource || DATA_SOURCES.TESTNET;
  
  // Check if there's a useRealWalletData flag in localStorage or use true as default
  const savedUseRealWalletData = localStorage.getItem('stacks_watchdog_use_real_wallet');
  const initialUseRealWalletData = savedUseRealWalletData === null ? true : savedUseRealWalletData === 'true';
  
  // Check if there's a useRealAIAnalysis flag in localStorage or use true as default
  const savedUseRealAIAnalysis = localStorage.getItem('stacks_watchdog_use_real_ai');
  const initialUseRealAIAnalysis = savedUseRealAIAnalysis === null ? true : savedUseRealAIAnalysis === 'true';
  
  console.log(`DataSourceProvider initializing with data source: ${initialDataSource}`);
  console.log(`DataSourceProvider initializing with useRealWalletData: ${initialUseRealWalletData}`);
  console.log(`DataSourceProvider initializing with useRealAIAnalysis: ${initialUseRealAIAnalysis}`);
  
  const [dataSource, setDataSource] = useState(initialDataSource);
  const [useRealWalletData, setUseRealWalletData] = useState(initialUseRealWalletData);
  const [useRealAIAnalysis, setUseRealAIAnalysis] = useState(initialUseRealAIAnalysis);
  
  // Initialize API URL when the component mounts
  useEffect(() => {
    console.log(`DataSourceProvider: Setting API base URL to ${dataSource}`);
    setApiBaseUrl(dataSource);
  }, []);
  
  // Update localStorage when data source changes
  useEffect(() => {
    console.log(`DataSourceProvider: Data source changed to ${dataSource}`);
    localStorage.setItem('stacks_watchdog_data_source', dataSource);
    
    // Also update the API base URL when the data source changes
    setApiBaseUrl(dataSource);
  }, [dataSource]);
  
  // Update localStorage when useRealWalletData changes
  useEffect(() => {
    console.log(`DataSourceProvider: useRealWalletData changed to ${useRealWalletData}`);
    localStorage.setItem('stacks_watchdog_use_real_wallet', useRealWalletData);
  }, [useRealWalletData]);
  
  // Update localStorage when useRealAIAnalysis changes
  useEffect(() => {
    console.log(`DataSourceProvider: useRealAIAnalysis changed to ${useRealAIAnalysis}`);
    localStorage.setItem('stacks_watchdog_use_real_ai', useRealAIAnalysis);
    
    // Update the aiAnalyzer
    aiAnalyzer.setUseMockAI(!useRealAIAnalysis);
  }, [useRealAIAnalysis]);
  
  // Function to change data source
  const changeDataSource = (newSource) => {
    console.log(`DataSourceProvider: Changing data source from ${dataSource} to ${newSource}`);
    
    if (Object.values(DATA_SOURCES).includes(newSource)) {
      // Update the data source state
      setDataSource(newSource);
      
      // Show a message to the user
      alert(`Switching to ${newSource === 'mock' ? 'Mock Data' : 
             newSource === 'testnet' ? 'Stacks Testnet' : 'Stacks Mainnet'}`);
      
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
  
  // Function to toggle real AI analysis
  const toggleRealAIAnalysis = () => {
    console.log(`DataSourceProvider: Toggling real AI analysis from ${useRealAIAnalysis} to ${!useRealAIAnalysis}`);
    setUseRealAIAnalysis(!useRealAIAnalysis);
  };
  
  // Function to get the network name based on data source
  const getNetworkName = () => {
    if (dataSource === DATA_SOURCES.MOCK) {
      return 'Mock Data';
    } else if (dataSource === DATA_SOURCES.TESTNET) {
      return 'Stacks Testnet';
    } else {
      return 'Stacks Mainnet';
    }
  };
  
  const contextValue = {
    dataSource,
    changeDataSource,
    getNetworkName,
    useRealWalletData,
    toggleRealWalletData,
    useRealAIAnalysis,
    toggleRealAIAnalysis,
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