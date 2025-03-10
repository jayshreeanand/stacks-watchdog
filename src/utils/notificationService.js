const telegramService = require('./telegramService');
const userSettingsService = require('../api/services/userSettingsService');

/**
 * Send wallet scan notification to all enabled channels
 * @param {Object} scanData - The wallet scan data
 * @returns {Promise<Object>} - The result of sending notifications
 */
const sendWalletScanNotification = async (scanData) => {
  const { walletAddress } = scanData;
  
  if (!walletAddress) {
    console.error('Wallet address is required for scan notification');
    return { success: false, error: 'Wallet address is required' };
  }
  
  console.log(`[NotificationService] Sending wallet scan notification for address: ${walletAddress}`);
  
  try {
    // Get user settings for the wallet address
    const userSettings = await userSettingsService.getUserSettingsByWallet(walletAddress);
    
    if (!userSettings) {
      console.log(`[NotificationService] No notification settings found for wallet: ${walletAddress}`);
      
      // Try to get settings by userId (wallet address) as fallback
      console.log(`[NotificationService] Trying to get settings by userId: ${walletAddress}`);
      const settingsByUserId = await userSettingsService.getUserSettings(walletAddress);
      
      if (settingsByUserId) {
        console.log(`[NotificationService] Found settings by userId`);
        return sendNotificationsWithSettings(scanData, settingsByUserId);
      }
      
      return { success: false, error: 'No notification settings found' };
    }
    
    return sendNotificationsWithSettings(scanData, userSettings);
  } catch (error) {
    console.error('[NotificationService] Error sending wallet scan notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send notifications using the provided user settings
 * @param {Object} scanData - The wallet scan data
 * @param {Object} userSettings - The user settings
 * @returns {Promise<Object>} - The result of sending notifications
 */
const sendNotificationsWithSettings = async (scanData, userSettings) => {
  const { walletAddress } = scanData;
  const results = {
    telegram: false,
    email: false,
    browser: false,
    mobile: false
  };
  
  console.log(`[NotificationService] User settings:`, JSON.stringify({
    userId: userSettings.userId,
    walletAddress: userSettings.walletAddress,
    telegramEnabled: userSettings.notifications?.telegram?.enabled,
    telegramChatId: userSettings.notifications?.telegram?.chatId,
    walletScanEnabled: userSettings.notifications?.alertTypes?.wallet_scan
  }));
  
  // Check if wallet scan notifications are enabled
  if (!userSettings.notifications?.alertTypes?.wallet_scan) {
    console.log(`[NotificationService] Wallet scan notifications disabled for wallet: ${walletAddress}`);
    return { success: false, error: 'Wallet scan notifications disabled' };
  }
  
  // Send Telegram notification if enabled
  if (userSettings.notifications?.telegram?.enabled && userSettings.notifications?.telegram?.chatId) {
    try {
      console.log(`[NotificationService] Sending Telegram notification to chat ID: ${userSettings.notifications.telegram.chatId}`);
      const telegramResult = await telegramService.sendWalletScanAlert(
        scanData, 
        userSettings.notifications.telegram.chatId
      );
      results.telegram = telegramResult.success;
      console.log(`[NotificationService] Telegram notification result:`, telegramResult);
    } catch (error) {
      console.error('[NotificationService] Error sending Telegram notification:', error);
      results.telegram = false;
    }
  } else {
    console.log(`[NotificationService] Telegram notifications not enabled or chat ID not set`);
  }
  
  // TODO: Implement other notification channels (email, browser, mobile)
  
  return {
    success: Object.values(results).some(result => result),
    results
  };
};

module.exports = {
  sendWalletScanNotification
}; 