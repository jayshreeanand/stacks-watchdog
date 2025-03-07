const Alert = require('../../models/Alert');

// In-memory storage for when MongoDB is not available
const inMemoryAlerts = [];

/**
 * Check if MongoDB is available
 * @returns {Boolean} Whether MongoDB is available
 */
const isMongoAvailable = () => {
  try {
    return require('mongoose').connection.readyState === 1;
  } catch (error) {
    return false;
  }
};

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
    
    const alertWithSeverity = {
      ...alertData,
      severity,
      timestamp: alertData.timestamp || Date.now()
    };
    
    // If MongoDB is not available, store in memory
    if (!isMongoAvailable()) {
      const id = inMemoryAlerts.length > 0 
        ? Math.max(...inMemoryAlerts.map(a => a.id || 0)) + 1 
        : 1;
      
      const inMemoryAlert = {
        ...alertWithSeverity,
        id,
        _id: `mem_${id}`
      };
      
      inMemoryAlerts.push(inMemoryAlert);
      console.log(`Alert stored in memory: ${inMemoryAlert.type} - ${inMemoryAlert.details}`);
      return inMemoryAlert;
    }
    
    // Store in MongoDB
    const alert = new Alert(alertWithSeverity);
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
    // If MongoDB is not available, return from memory
    if (!isMongoAvailable()) {
      return inMemoryAlerts;
    }
    
    return await Alert.find(filter).sort({ timestamp: -1 });
  } catch (error) {
    console.error('Error getting alerts:', error);
    return inMemoryAlerts; // Fallback to in-memory alerts
  }
};

/**
 * Get alert by ID
 * @param {String} id Alert ID
 * @returns {Promise<Object>} Alert
 */
const getAlertById = async (id) => {
  try {
    // If MongoDB is not available, return from memory
    if (!isMongoAvailable()) {
      return inMemoryAlerts.find(a => a._id === id || a.id === parseInt(id));
    }
    
    return await Alert.findById(id);
  } catch (error) {
    console.error(`Error getting alert ${id}:`, error);
    return inMemoryAlerts.find(a => a._id === id || a.id === parseInt(id));
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
    // If MongoDB is not available, update in memory
    if (!isMongoAvailable()) {
      const index = inMemoryAlerts.findIndex(a => a._id === id || a.id === parseInt(id));
      if (index !== -1) {
        inMemoryAlerts[index] = { ...inMemoryAlerts[index], ...updateData };
        return inMemoryAlerts[index];
      }
      return null;
    }
    
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
    // If MongoDB is not available, resolve in memory
    if (!isMongoAvailable()) {
      const index = inMemoryAlerts.findIndex(a => a._id === id || a.id === parseInt(id));
      if (index !== -1) {
        inMemoryAlerts[index] = { 
          ...inMemoryAlerts[index], 
          resolved: true,
          resolvedAt: Date.now(),
          resolvedBy
        };
        return inMemoryAlerts[index];
      }
      return null;
    }
    
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
    // If MongoDB is not available, delete from memory
    if (!isMongoAvailable()) {
      const index = inMemoryAlerts.findIndex(a => a._id === id || a.id === parseInt(id));
      if (index !== -1) {
        const deleted = inMemoryAlerts[index];
        inMemoryAlerts.splice(index, 1);
        return deleted;
      }
      return null;
    }
    
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
    // If MongoDB is not available, filter from memory
    if (!isMongoAvailable()) {
      return inMemoryAlerts.filter(a => a.type === type);
    }
    
    return await Alert.find({ type }).sort({ timestamp: -1 });
  } catch (error) {
    console.error(`Error getting alerts by type ${type}:`, error);
    return inMemoryAlerts.filter(a => a.type === type);
  }
};

/**
 * Get alerts by target address
 * @param {String} address Target address
 * @returns {Promise<Array>} Array of alerts
 */
const getAlertsByAddress = async (address) => {
  try {
    // If MongoDB is not available, filter from memory
    if (!isMongoAvailable()) {
      return inMemoryAlerts.filter(a => a.targetAddress === address);
    }
    
    return await Alert.find({ targetAddress: address }).sort({ timestamp: -1 });
  } catch (error) {
    console.error(`Error getting alerts by address ${address}:`, error);
    return inMemoryAlerts.filter(a => a.targetAddress === address);
  }
};

/**
 * Get active (unresolved) alerts
 * @returns {Promise<Array>} Array of active alerts
 */
const getActiveAlerts = async () => {
  try {
    // If MongoDB is not available, filter from memory
    if (!isMongoAvailable()) {
      return inMemoryAlerts.filter(a => !a.resolved);
    }
    
    return await Alert.find({ resolved: false }).sort({ timestamp: -1 });
  } catch (error) {
    console.error('Error getting active alerts:', error);
    return inMemoryAlerts.filter(a => !a.resolved);
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