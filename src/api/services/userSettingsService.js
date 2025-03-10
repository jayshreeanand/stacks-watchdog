const UserSettings = require('../../models/UserSettings');
const telegramService = require('../../utils/telegramService');

// In-memory storage for when MongoDB is not available
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
 * Get user settings by user ID
 * @param {String} userId User ID
 * @returns {Promise<Object>} User settings
 */
const getUserSettings = async (userId) => {
  try {
    // If MongoDB is not available, get from memory
    if (!isMongoAvailable()) {
      return inMemoryUserSettings.find(s => s.userId === userId);
    }
    
    return await UserSettings.findOne({ userId });
  } catch (error) {
    console.error(`Error getting user settings for ${userId}:`, error);
    throw error;
  }
};

/**
 * Get user settings by wallet address
 * @param {String} walletAddress Wallet address
 * @returns {Promise<Object>} User settings
 */
const getUserSettingsByWallet = async (walletAddress) => {
  try {
    // If MongoDB is not available, get from memory
    if (!isMongoAvailable()) {
      return inMemoryUserSettings.find(s => s.walletAddress?.toLowerCase() === walletAddress.toLowerCase());
    }
    
    return await UserSettings.findOne({ walletAddress: { $regex: new RegExp(`^${walletAddress}$`, 'i') } });
  } catch (error) {
    console.error(`Error getting user settings for wallet ${walletAddress}:`, error);
    throw error;
  }
};

/**
 * Create or update user settings
 * @param {String} userId User ID
 * @param {Object} settingsData Settings data
 * @returns {Promise<Object>} Updated user settings
 */
const updateUserSettings = async (userId, settingsData) => {
  try {
    // If MongoDB is not available, update in memory
    if (!isMongoAvailable()) {
      const index = inMemoryUserSettings.findIndex(s => s.userId === userId);
      
      if (index !== -1) {
        inMemoryUserSettings[index] = { 
          ...inMemoryUserSettings[index], 
          ...settingsData,
          updatedAt: Date.now()
        };
        return inMemoryUserSettings[index];
      } else {
        const newSettings = {
          userId,
          ...settingsData,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        inMemoryUserSettings.push(newSettings);
        return newSettings;
      }
    }
    
    // Update in MongoDB (upsert)
    const settings = await UserSettings.findOneAndUpdate(
      { userId },
      { ...settingsData, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    
    return settings;
  } catch (error) {
    console.error(`Error updating user settings for ${userId}:`, error);
    throw error;
  }
};

/**
 * Update Telegram notification settings
 * @param {String} userId User ID
 * @param {Object} telegramSettings Telegram settings
 * @returns {Promise<Object>} Updated user settings
 */
const updateTelegramSettings = async (userId, telegramSettings) => {
  try {
    const currentSettings = await getUserSettings(userId);
    
    // Create settings object if it doesn't exist
    const settings = currentSettings || { userId, notifications: {} };
    
    // Update Telegram settings
    settings.notifications = {
      ...settings.notifications,
      telegram: {
        ...settings.notifications?.telegram,
        ...telegramSettings
      }
    };
    
    // Save settings
    const updatedSettings = await updateUserSettings(userId, settings);
    
    // If Telegram is enabled and chatId is provided, send a test message
    if (telegramSettings.enabled && telegramSettings.chatId) {
      await telegramService.testConnection(telegramSettings.chatId);
    }
    
    return updatedSettings;
  } catch (error) {
    console.error(`Error updating Telegram settings for ${userId}:`, error);
    throw error;
  }
};

/**
 * Update alert type settings
 * @param {String} userId User ID
 * @param {Object} alertTypes Alert type settings
 * @returns {Promise<Object>} Updated user settings
 */
const updateAlertTypeSettings = async (userId, alertTypes) => {
  try {
    const currentSettings = await getUserSettings(userId);
    
    // Create settings object if it doesn't exist
    const settings = currentSettings || { userId, notifications: {} };
    
    // Update alert type settings
    settings.notifications = {
      ...settings.notifications,
      alertTypes: {
        ...settings.notifications?.alertTypes,
        ...alertTypes
      }
    };
    
    // Save settings
    return await updateUserSettings(userId, settings);
  } catch (error) {
    console.error(`Error updating alert type settings for ${userId}:`, error);
    throw error;
  }
};

/**
 * Update severity threshold
 * @param {String} userId User ID
 * @param {String} threshold Severity threshold
 * @returns {Promise<Object>} Updated user settings
 */
const updateSeverityThreshold = async (userId, threshold) => {
  try {
    const currentSettings = await getUserSettings(userId);
    
    // Create settings object if it doesn't exist
    const settings = currentSettings || { userId, notifications: {} };
    
    // Update severity threshold
    settings.notifications = {
      ...settings.notifications,
      severityThreshold: threshold
    };
    
    // Save settings
    return await updateUserSettings(userId, settings);
  } catch (error) {
    console.error(`Error updating severity threshold for ${userId}:`, error);
    throw error;
  }
};

/**
 * Delete user settings
 * @param {String} userId User ID
 * @returns {Promise<Boolean>} Whether the settings were deleted
 */
const deleteUserSettings = async (userId) => {
  try {
    // If MongoDB is not available, delete from memory
    if (!isMongoAvailable()) {
      const index = inMemoryUserSettings.findIndex(s => s.userId === userId);
      
      if (index !== -1) {
        inMemoryUserSettings.splice(index, 1);
        return true;
      }
      
      return false;
    }
    
    // Delete from MongoDB
    const result = await UserSettings.deleteOne({ userId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error(`Error deleting user settings for ${userId}:`, error);
    throw error;
  }
};

module.exports = {
  getUserSettings,
  updateUserSettings,
  updateTelegramSettings,
  updateAlertTypeSettings,
  updateSeverityThreshold,
  deleteUserSettings,
  getUserSettingsByWallet
}; 