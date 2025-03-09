const Alert = require('../../models/Alert');
const telegramService = require('../../utils/telegramService');
const UserSettings = require('../../models/UserSettings');

// In-memory storage for when MongoDB is not available
const inMemoryAlerts = [];
const inMemoryUserSettings = [];

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
    
    let savedAlert;
    
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
      savedAlert = inMemoryAlert;
    } else {
      // Store in MongoDB
      const alert = new Alert(alertWithSeverity);
      savedAlert = await alert.save();
    }
    
    // Send alert to Telegram if enabled
    await sendAlertNotifications(savedAlert);
    
    return savedAlert;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

/**
 * Send alert notifications to configured channels
 * @param {Object} alert The alert to send
 */
const sendAlertNotifications = async (alert) => {
  try {
    // Check if Telegram notifications are enabled globally
    const telegramEnabled = process.env.ENABLE_TELEGRAM_NOTIFICATIONS === 'true';
    
    if (!telegramEnabled) {
      console.log('Telegram notifications are disabled globally');
      return;
    }
    
    // Get users who have enabled Telegram notifications
    let userSettings = [];
    
    if (isMongoAvailable()) {
      userSettings = await UserSettings.find({ 
        'notifications.telegram.enabled': true 
      });
    } else {
      userSettings = inMemoryUserSettings.filter(
        settings => settings.notifications?.telegram?.enabled
      );
    }
    
    // If no users have Telegram enabled, send to default chat
    if (userSettings.length === 0) {
      console.log('No users with Telegram notifications enabled, using default chat');
      await telegramService.sendAlert(alert);
      return;
    }
    
    // Send to each user who has enabled Telegram notifications
    for (const settings of userSettings) {
      // Check if user wants to receive this type of alert
      const alertTypeEnabled = settings.notifications?.alertTypes?.[alert.type] !== false;
      
      // Check if alert severity meets user's threshold
      const severityThreshold = settings.notifications?.severityThreshold || 'low';
      const severityMet = isSeverityMet(alert.severity, severityThreshold);
      
      if (alertTypeEnabled && severityMet && settings.notifications?.telegram?.chatId) {
        await telegramService.sendAlert(alert, settings.notifications.telegram.chatId);
      }
    }
  } catch (error) {
    console.error('Error sending alert notifications:', error);
  }
};

/**
 * Check if an alert's severity meets or exceeds a threshold
 * @param {string} alertSeverity The severity of the alert
 * @param {string} threshold The threshold to check against
 * @returns {boolean} Whether the severity meets the threshold
 */
const isSeverityMet = (alertSeverity, threshold) => {
  const severityLevels = {
    'low': 1,
    'medium': 2,
    'high': 3,
    'critical': 4
  };
  
  return (severityLevels[alertSeverity] || 0) >= (severityLevels[threshold] || 0);
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