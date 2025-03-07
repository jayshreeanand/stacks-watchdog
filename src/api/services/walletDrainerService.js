const WalletDrainer = require('../../models/WalletDrainer');
const { ethers } = require('ethers');
const aiAnalyzer = require('../../utils/aiAnalyzer');

/**
 * Save wallet drainer
 * @param {Object} drainerData Drainer data
 * @returns {Promise<Object>} Saved drainer
 */
const saveDrainer = async (drainerData) => {
  try {
    // Check if drainer already exists
    const existingDrainer = await WalletDrainer.findOne({ address: drainerData.address });
    
    if (existingDrainer) {
      // Update existing drainer
      return await WalletDrainer.findOneAndUpdate(
        { address: drainerData.address },
        drainerData,
        { new: true }
      );
    }
    
    // Create new drainer
    const drainer = new WalletDrainer(drainerData);
    await drainer.save();
    return drainer;
  } catch (error) {
    console.error('Error saving wallet drainer:', error);
    throw error;
  }
};

/**
 * Get all wallet drainers
 * @param {Object} filter Filter criteria
 * @returns {Promise<Array>} Array of wallet drainers
 */
const getDrainers = async (filter = {}) => {
  try {
    return await WalletDrainer.find(filter).sort({ timestamp: -1 });
  } catch (error) {
    console.error('Error getting wallet drainers:', error);
    throw error;
  }
};

/**
 * Get wallet drainer by address
 * @param {String} address Drainer address
 * @returns {Promise<Object>} Wallet drainer
 */
const getDrainerByAddress = async (address) => {
  try {
    return await WalletDrainer.findOne({ address });
  } catch (error) {
    console.error(`Error getting wallet drainer for ${address}:`, error);
    throw error;
  }
};

/**
 * Update wallet drainer
 * @param {String} address Drainer address
 * @param {Object} updateData Update data
 * @returns {Promise<Object>} Updated wallet drainer
 */
const updateDrainer = async (address, updateData) => {
  try {
    return await WalletDrainer.findOneAndUpdate(
      { address },
      updateData,
      { new: true }
    );
  } catch (error) {
    console.error(`Error updating wallet drainer for ${address}:`, error);
    throw error;
  }
};

/**
 * Verify wallet drainer
 * @param {String} address Drainer address
 * @param {String} verifiedBy User who verified the drainer
 * @param {Boolean} isVerified Whether the contract is verified as a drainer
 * @param {String} notes Additional notes
 * @returns {Promise<Object>} Verified wallet drainer
 */
const verifyDrainer = async (address, verifiedBy, isVerified = true, notes = '') => {
  try {
    return await WalletDrainer.findOneAndUpdate(
      { address },
      {
        verified: isVerified,
        verifiedBy,
        verifiedAt: Date.now(),
        notes
      },
      { new: true }
    );
  } catch (error) {
    console.error(`Error verifying wallet drainer for ${address}:`, error);
    throw error;
  }
};

/**
 * Delete wallet drainer
 * @param {String} address Drainer address
 * @returns {Promise<Object>} Deletion result
 */
const deleteDrainer = async (address) => {
  try {
    return await WalletDrainer.findOneAndDelete({ address });
  } catch (error) {
    console.error(`Error deleting wallet drainer for ${address}:`, error);
    throw error;
  }
};

/**
 * Analyze contract for wallet drainer potential
 * @param {String} contractAddress Contract address
 * @param {Object} provider Ethers provider
 * @returns {Promise<Object>} Analysis result
 */
const analyzeContractForDrainer = async (contractAddress, provider) => {
  try {
    // Get contract code
    const contractCode = await aiAnalyzer.getContractCode(contractAddress, provider);
    
    if (!contractCode || contractCode === '0x') {
      throw new Error('Contract code not found');
    }
    
    // Analyze contract code for wallet drainer potential
    const analysis = await aiAnalyzer.analyzeContractForWalletDrainer(contractAddress, contractCode);
    
    if (analysis.isDrainer) {
      // Save drainer to database
      const drainerData = {
        address: contractAddress,
        type: analysis.drainerType,
        detectedPatterns: analysis.detectedPatterns.map(pattern => pattern.name),
        contractCode,
        timestamp: Date.now()
      };
      
      return await saveDrainer(drainerData);
    }
    
    return { isDrainer: false, address: contractAddress };
  } catch (error) {
    console.error(`Error analyzing contract for drainer ${contractAddress}:`, error);
    throw error;
  }
};

/**
 * Add victim to wallet drainer
 * @param {String} drainerAddress Drainer address
 * @param {String} victimAddress Victim address
 * @param {String} amount Amount drained
 * @returns {Promise<Object>} Updated wallet drainer
 */
const addVictim = async (drainerAddress, victimAddress, amount = '') => {
  try {
    const drainer = await WalletDrainer.findOne({ address: drainerAddress });
    
    if (!drainer) {
      throw new Error(`Drainer ${drainerAddress} not found`);
    }
    
    // Add victim if not already in the list
    if (!drainer.victims || !drainer.victims.includes(victimAddress)) {
      const victims = drainer.victims || [];
      victims.push(victimAddress);
      
      // Update drainer
      return await WalletDrainer.findOneAndUpdate(
        { address: drainerAddress },
        {
          victims,
          totalDrained: amount ? amount : drainer.totalDrained
        },
        { new: true }
      );
    }
    
    return drainer;
  } catch (error) {
    console.error(`Error adding victim ${victimAddress} to drainer ${drainerAddress}:`, error);
    throw error;
  }
};

/**
 * Get recent wallet drainers
 * @param {Number} limit Number of drainers to return
 * @returns {Promise<Array>} Array of recent wallet drainers
 */
const getRecentDrainers = async (limit = 10) => {
  try {
    return await WalletDrainer.find()
      .sort({ timestamp: -1 })
      .limit(limit);
  } catch (error) {
    console.error('Error getting recent wallet drainers:', error);
    throw error;
  }
};

module.exports = {
  saveDrainer,
  getDrainers,
  getDrainerByAddress,
  updateDrainer,
  verifyDrainer,
  deleteDrainer,
  analyzeContractForDrainer,
  addVictim,
  getRecentDrainers
}; 