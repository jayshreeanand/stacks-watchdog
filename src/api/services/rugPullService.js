const TokenAnalysis = require('../../models/TokenAnalysis');
const { ethers } = require('ethers');
const aiAnalyzer = require('../../utils/aiAnalyzer');

/**
 * Save token analysis
 * @param {Object} analysisData Analysis data
 * @returns {Promise<Object>} Saved token analysis
 */
const saveTokenAnalysis = async (analysisData) => {
  try {
    // Check if token analysis already exists
    const existingAnalysis = await TokenAnalysis.findOne({ tokenAddress: analysisData.tokenAddress });
    
    if (existingAnalysis) {
      // Update existing analysis
      return await TokenAnalysis.findOneAndUpdate(
        { tokenAddress: analysisData.tokenAddress },
        analysisData,
        { new: true }
      );
    }
    
    // Create new analysis
    const analysis = new TokenAnalysis(analysisData);
    await analysis.save();
    return analysis;
  } catch (error) {
    console.error('Error saving token analysis:', error);
    throw error;
  }
};

/**
 * Get all token analyses
 * @param {Object} filter Filter criteria
 * @returns {Promise<Array>} Array of token analyses
 */
const getTokenAnalyses = async (filter = {}) => {
  try {
    return await TokenAnalysis.find(filter).sort({ timestamp: -1 });
  } catch (error) {
    console.error('Error getting token analyses:', error);
    throw error;
  }
};

/**
 * Get token analysis by address
 * @param {String} tokenAddress Token address
 * @returns {Promise<Object>} Token analysis
 */
const getTokenAnalysisByAddress = async (tokenAddress) => {
  try {
    return await TokenAnalysis.findOne({ tokenAddress });
  } catch (error) {
    console.error(`Error getting token analysis for ${tokenAddress}:`, error);
    throw error;
  }
};

/**
 * Update token analysis
 * @param {String} tokenAddress Token address
 * @param {Object} updateData Update data
 * @returns {Promise<Object>} Updated token analysis
 */
const updateTokenAnalysis = async (tokenAddress, updateData) => {
  try {
    return await TokenAnalysis.findOneAndUpdate(
      { tokenAddress },
      updateData,
      { new: true }
    );
  } catch (error) {
    console.error(`Error updating token analysis for ${tokenAddress}:`, error);
    throw error;
  }
};

/**
 * Verify token analysis
 * @param {String} tokenAddress Token address
 * @param {String} verifiedBy User who verified the analysis
 * @param {Boolean} isVerified Whether the token is verified as a rug pull
 * @param {String} notes Additional notes
 * @returns {Promise<Object>} Verified token analysis
 */
const verifyTokenAnalysis = async (tokenAddress, verifiedBy, isVerified = true, notes = '') => {
  try {
    return await TokenAnalysis.findOneAndUpdate(
      { tokenAddress },
      {
        verified: isVerified,
        verifiedBy,
        verifiedAt: Date.now(),
        notes
      },
      { new: true }
    );
  } catch (error) {
    console.error(`Error verifying token analysis for ${tokenAddress}:`, error);
    throw error;
  }
};

/**
 * Delete token analysis
 * @param {String} tokenAddress Token address
 * @returns {Promise<Object>} Deletion result
 */
const deleteTokenAnalysis = async (tokenAddress) => {
  try {
    return await TokenAnalysis.findOneAndDelete({ tokenAddress });
  } catch (error) {
    console.error(`Error deleting token analysis for ${tokenAddress}:`, error);
    throw error;
  }
};

/**
 * Analyze token contract for rug pull potential
 * @param {String} tokenAddress Token address
 * @param {Object} provider Ethers provider
 * @returns {Promise<Object>} Analysis result
 */
const analyzeTokenContract = async (tokenAddress, provider) => {
  try {
    // Get token contract code
    const contractCode = await aiAnalyzer.getContractCode(tokenAddress, provider);
    
    if (!contractCode || contractCode === '0x') {
      throw new Error('Contract code not found');
    }
    
    // Analyze contract code for rug pull potential
    const analysis = await aiAnalyzer.analyzeContractForRugPull(tokenAddress, contractCode);
    
    // Get token name and symbol if possible
    let tokenName = '';
    let tokenSymbol = '';
    
    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          'function name() view returns (string)',
          'function symbol() view returns (string)'
        ],
        provider
      );
      
      tokenName = await tokenContract.name();
      tokenSymbol = await tokenContract.symbol();
    } catch (error) {
      console.warn(`Could not get token name/symbol for ${tokenAddress}:`, error.message);
    }
    
    // Save analysis to database
    const analysisData = {
      tokenAddress,
      tokenName,
      tokenSymbol,
      isPotentialRugPull: analysis.isPotentialRugPull,
      riskScore: analysis.riskScore,
      reasons: analysis.detectedRiskFactors,
      contractCode,
      timestamp: Date.now()
    };
    
    return await saveTokenAnalysis(analysisData);
  } catch (error) {
    console.error(`Error analyzing token contract ${tokenAddress}:`, error);
    throw error;
  }
};

/**
 * Get potential rug pulls
 * @returns {Promise<Array>} Array of potential rug pulls
 */
const getPotentialRugPulls = async () => {
  try {
    return await TokenAnalysis.find({ isPotentialRugPull: true }).sort({ timestamp: -1 });
  } catch (error) {
    console.error('Error getting potential rug pulls:', error);
    throw error;
  }
};

/**
 * Get recent token analyses
 * @param {Number} limit Number of analyses to return
 * @returns {Promise<Array>} Array of recent token analyses
 */
const getRecentAnalyses = async (limit = 10) => {
  try {
    return await TokenAnalysis.find()
      .sort({ timestamp: -1 })
      .limit(limit);
  } catch (error) {
    console.error('Error getting recent token analyses:', error);
    throw error;
  }
};

module.exports = {
  saveTokenAnalysis,
  getTokenAnalyses,
  getTokenAnalysisByAddress,
  updateTokenAnalysis,
  verifyTokenAnalysis,
  deleteTokenAnalysis,
  analyzeTokenContract,
  getPotentialRugPulls,
  getRecentAnalyses
}; 