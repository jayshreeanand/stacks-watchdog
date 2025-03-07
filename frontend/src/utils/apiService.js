import axios from 'axios';
import { mockApiService } from './mockData';

// API base URL
const API_BASE_URL = '/api';

// API endpoints
const ENDPOINTS = {
  WALLET_DRAINERS: `${API_BASE_URL}/walletdrainer`,
  RECENT_WALLET_DRAINERS: `${API_BASE_URL}/walletdrainer/recent`,
  WALLET_DRAINER_BY_ADDRESS: (address) => `${API_BASE_URL}/walletdrainer/${address}`,
  ANALYZE_CONTRACT: `${API_BASE_URL}/walletdrainer/analyze`,
};

// API service with fallback to mock data
const apiService = {
  // Get all wallet drainers
  getAllWalletDrainers: async () => {
    try {
      const response = await axios.get(ENDPOINTS.WALLET_DRAINERS);
      // If the API returns an empty array, use mock data
      if (Array.isArray(response.data) && response.data.length === 0) {
        console.log('API returned empty array, using mock data');
        return mockApiService.getAllWalletDrainers();
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet drainers:', error);
      console.log('Falling back to mock data');
      return mockApiService.getAllWalletDrainers();
    }
  },
  
  // Get recent wallet drainers
  getRecentWalletDrainers: async (limit = 5) => {
    try {
      const response = await axios.get(`${ENDPOINTS.RECENT_WALLET_DRAINERS}?limit=${limit}`);
      // If the API returns an empty array, use mock data
      if (Array.isArray(response.data) && response.data.length === 0) {
        console.log('API returned empty array, using mock data');
        return mockApiService.getRecentWalletDrainers(limit);
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching recent wallet drainers:', error);
      console.log('Falling back to mock data');
      return mockApiService.getRecentWalletDrainers(limit);
    }
  },
  
  // Get wallet drainer by address
  getWalletDrainerByAddress: async (address) => {
    try {
      const response = await axios.get(ENDPOINTS.WALLET_DRAINER_BY_ADDRESS(address));
      return response.data;
    } catch (error) {
      console.error(`Error fetching wallet drainer for ${address}:`, error);
      console.log('Falling back to mock data');
      return mockApiService.getWalletDrainerByAddress(address);
    }
  },
  
  // Analyze contract
  analyzeContract: async (contractAddress) => {
    try {
      const response = await axios.post(ENDPOINTS.ANALYZE_CONTRACT, { contractAddress });
      return response.data;
    } catch (error) {
      console.error('Error analyzing contract:', error);
      console.log('Falling back to mock data');
      return mockApiService.analyzeContract(contractAddress);
    }
  },
  
  // Save wallet drainer
  saveWalletDrainer: async (drainerData) => {
    try {
      const response = await axios.post(ENDPOINTS.WALLET_DRAINERS, drainerData);
      return response.data;
    } catch (error) {
      console.error('Error saving wallet drainer:', error);
      throw error;
    }
  },
  
  // Update wallet drainer
  updateWalletDrainer: async (address, drainerData) => {
    try {
      const response = await axios.put(ENDPOINTS.WALLET_DRAINER_BY_ADDRESS(address), drainerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating wallet drainer for ${address}:`, error);
      throw error;
    }
  },
  
  // Verify wallet drainer
  verifyWalletDrainer: async (address, verifiedBy, isVerified = true, notes = '') => {
    try {
      const response = await axios.put(`${ENDPOINTS.WALLET_DRAINER_BY_ADDRESS(address)}/verify`, {
        verifiedBy,
        isVerified,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error(`Error verifying wallet drainer for ${address}:`, error);
      throw error;
    }
  },
  
  // Delete wallet drainer
  deleteWalletDrainer: async (address) => {
    try {
      const response = await axios.delete(ENDPOINTS.WALLET_DRAINER_BY_ADDRESS(address));
      return response.data;
    } catch (error) {
      console.error(`Error deleting wallet drainer for ${address}:`, error);
      throw error;
    }
  },
  
  // Add victim to wallet drainer
  addVictimToWalletDrainer: async (address, victimAddress, amount) => {
    try {
      const response = await axios.post(`${ENDPOINTS.WALLET_DRAINER_BY_ADDRESS(address)}/victim`, {
        victimAddress,
        amount,
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding victim to drainer ${address}:`, error);
      throw error;
    }
  },
};

export default apiService; 