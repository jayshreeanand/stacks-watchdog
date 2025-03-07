const Alert = require('../../models/Alert');

/**
 * Create a new security alert
 * @param {Object} alertData Alert data
 * @returns {Promise<Object>} Created alert
 */
const createAlert = async (alertData) => {
  try {
    // Determine severity based on alert type
    let severity = 'medium';
    if (alertData.type === 'wallet_drainer') {
      severity = 'critical';
    } else if (alertData.type === 'rug_pull') {
      severity = 'high';
    }
    
    const alert = new Alert({
      ...alertData,
      severity,
      timestamp: alertData.timestamp || Date.now()
    });
    
    await alert.save();
    return alert;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

/**
 * Get all alerts
 * @param {Object} filter Filter criteria
 * @returns {Promise<Array>} Array of alerts
 */
const getAlerts = async (filter = {}) => {
  try {
    return await Alert.find(filter).sort({ timestamp: -1 });
  } catch (error) {
    console.error('Error getting alerts:', error);
    throw error;
  }
};

/**
 * Get alert by ID
 * @param {String} id Alert ID
 * @returns {Promise<Object>} Alert
 */
const getAlertById = async (id) => {
  try {
    return await Alert.findById(id);
  } catch (error) {
    console.error(`Error getting alert ${id}:`, error);
    throw error;
  }
};

/**
 * Update alert
 * @param {String} id Alert ID
 * @param {Object} updateData Update data
 * @returns {Promise<Object>} Updated alert
 */
const updateAlert = async (id, updateData) => {
  try {
    return await Alert.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    console.error(`Error updating alert ${id}:`, error);
    throw error;
  }
};

/**
 * Resolve alert
 * @param {String} id Alert ID
 * @param {String} resolvedBy User who resolved the alert
 * @returns {Promise<Object>} Resolved alert
 */
const resolveAlert = async (id, resolvedBy) => {
  try {
    return await Alert.findByIdAndUpdate(
      id,
      {
        resolved: true,
        resolvedAt: Date.now(),
        resolvedBy
      },
      { new: true }
    );
  } catch (error) {
    console.error(`Error resolving alert ${id}:`, error);
    throw error;
  }
};

/**
 * Delete alert
 * @param {String} id Alert ID
 * @returns {Promise<Object>} Deletion result
 */
const deleteAlert = async (id) => {
  try {
    return await Alert.findByIdAndDelete(id);
  } catch (error) {
    console.error(`Error deleting alert ${id}:`, error);
    throw error;
  }
};

/**
 * Get alerts by type
 * @param {String} type Alert type
 * @returns {Promise<Array>} Array of alerts
 */
const getAlertsByType = async (type) => {
  try {
    return await Alert.find({ type }).sort({ timestamp: -1 });
  } catch (error) {
    console.error(`Error getting alerts by type ${type}:`, error);
    throw error;
  }
};

/**
 * Get alerts by target address
 * @param {String} address Target address
 * @returns {Promise<Array>} Array of alerts
 */
const getAlertsByAddress = async (address) => {
  try {
    return await Alert.find({ targetAddress: address }).sort({ timestamp: -1 });
  } catch (error) {
    console.error(`Error getting alerts by address ${address}:`, error);
    throw error;
  }
};

/**
 * Get active (unresolved) alerts
 * @returns {Promise<Array>} Array of active alerts
 */
const getActiveAlerts = async () => {
  try {
    return await Alert.find({ resolved: false }).sort({ timestamp: -1 });
  } catch (error) {
    console.error('Error getting active alerts:', error);
    throw error;
  }
};

module.exports = {
  createAlert,
  getAlerts,
  getAlertById,
  updateAlert,
  resolveAlert,
  deleteAlert,
  getAlertsByType,
  getAlertsByAddress,
  getActiveAlerts
}; 