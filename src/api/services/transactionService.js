const SuspiciousTransaction = require('../../models/SuspiciousTransaction');

/**
 * Save a suspicious transaction
 * @param {Object} transactionData Transaction data
 * @returns {Promise<Object>} Saved transaction
 */
const saveSuspiciousTransaction = async (transactionData) => {
  try {
    // Check if transaction already exists
    const existingTransaction = await SuspiciousTransaction.findOne({ hash: transactionData.hash });
    
    if (existingTransaction) {
      // Update existing transaction
      return await SuspiciousTransaction.findOneAndUpdate(
        { hash: transactionData.hash },
        transactionData,
        { new: true }
      );
    }
    
    // Create new transaction
    const transaction = new SuspiciousTransaction(transactionData);
    await transaction.save();
    return transaction;
  } catch (error) {
    console.error('Error saving suspicious transaction:', error);
    throw error;
  }
};

/**
 * Get all suspicious transactions
 * @param {Object} filter Filter criteria
 * @returns {Promise<Array>} Array of suspicious transactions
 */
const getSuspiciousTransactions = async (filter = {}) => {
  try {
    return await SuspiciousTransaction.find(filter).sort({ timestamp: -1 });
  } catch (error) {
    console.error('Error getting suspicious transactions:', error);
    throw error;
  }
};

/**
 * Get suspicious transaction by hash
 * @param {String} hash Transaction hash
 * @returns {Promise<Object>} Suspicious transaction
 */
const getTransactionByHash = async (hash) => {
  try {
    return await SuspiciousTransaction.findOne({ hash });
  } catch (error) {
    console.error(`Error getting transaction ${hash}:`, error);
    throw error;
  }
};

/**
 * Update suspicious transaction
 * @param {String} hash Transaction hash
 * @param {Object} updateData Update data
 * @returns {Promise<Object>} Updated transaction
 */
const updateTransaction = async (hash, updateData) => {
  try {
    return await SuspiciousTransaction.findOneAndUpdate(
      { hash },
      updateData,
      { new: true }
    );
  } catch (error) {
    console.error(`Error updating transaction ${hash}:`, error);
    throw error;
  }
};

/**
 * Verify suspicious transaction
 * @param {String} hash Transaction hash
 * @param {String} verifiedBy User who verified the transaction
 * @param {Boolean} isVerified Whether the transaction is verified as suspicious
 * @returns {Promise<Object>} Verified transaction
 */
const verifyTransaction = async (hash, verifiedBy, isVerified = true) => {
  try {
    return await SuspiciousTransaction.findOneAndUpdate(
      { hash },
      {
        verified: isVerified,
        verifiedBy,
        verifiedAt: Date.now()
      },
      { new: true }
    );
  } catch (error) {
    console.error(`Error verifying transaction ${hash}:`, error);
    throw error;
  }
};

/**
 * Delete suspicious transaction
 * @param {String} hash Transaction hash
 * @returns {Promise<Object>} Deletion result
 */
const deleteTransaction = async (hash) => {
  try {
    return await SuspiciousTransaction.findOneAndDelete({ hash });
  } catch (error) {
    console.error(`Error deleting transaction ${hash}:`, error);
    throw error;
  }
};

/**
 * Get suspicious transactions by address
 * @param {String} address Address to search for
 * @param {String} role Role of the address ('from' or 'to')
 * @returns {Promise<Array>} Array of suspicious transactions
 */
const getTransactionsByAddress = async (address, role) => {
  try {
    const filter = role === 'from' ? { from: address } : { to: address };
    return await SuspiciousTransaction.find(filter).sort({ timestamp: -1 });
  } catch (error) {
    console.error(`Error getting transactions for address ${address}:`, error);
    throw error;
  }
};

/**
 * Get recent suspicious transactions
 * @param {Number} limit Number of transactions to return
 * @returns {Promise<Array>} Array of recent suspicious transactions
 */
const getRecentTransactions = async (limit = 10) => {
  try {
    return await SuspiciousTransaction.find()
      .sort({ timestamp: -1 })
      .limit(limit);
  } catch (error) {
    console.error('Error getting recent transactions:', error);
    throw error;
  }
};

module.exports = {
  saveSuspiciousTransaction,
  getSuspiciousTransactions,
  getTransactionByHash,
  updateTransaction,
  verifyTransaction,
  deleteTransaction,
  getTransactionsByAddress,
  getRecentTransactions
}; 