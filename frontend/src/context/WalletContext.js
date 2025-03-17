import React, { createContext, useState, useEffect, useContext } from 'react';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { connect, disconnect, isConnected, getUserData } from '@stacks/connect-react';

// Create context
const WalletContext = createContext();

// Provider component
export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState(null);
  const [networkName, setNetworkName] = useState('');

  // Initialize network
  useEffect(() => {
    // Default to testnet for development
    setNetwork(STACKS_TESTNET);
    setNetworkName('Stacks Testnet');
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    setIsConnecting(true);

    try {
      const userSession = await connect({
        network,
        appName: 'Stacks Watchdog',
        appIcon: 'https://your-app-icon-url.com/icon.png',
      });
      
      if (userSession) {
        const userData = getUserData();
        setAccount(userData.profile.stxAddress.mainnet);
      }

      return account;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw new Error('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await disconnect();
      setAccount('');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  // Context value
  const value = {
    account,
    isConnecting,
    network,
    networkName,
    connectWallet,
    disconnectWallet,
    formatAddress,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

// Custom hook to use the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export default WalletContext; 