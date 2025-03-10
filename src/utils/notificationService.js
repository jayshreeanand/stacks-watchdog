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
  
  try {
    // Get user settings for the wallet address
    const userSettings = await userSettingsService.getUserSettingsByWallet(walletAddress);
    
    if (!userSettings) {
      console.log(`No notification settings found for wallet: ${walletAddress}`);
      return { success: false, error: 'No notification settings found' };
    }
    
    const results = {
      telegram: false,
      email: false,
      browser: false,
      mobile: false
    };
    
    // Check if wallet scan notifications are enabled
    if (!userSettings.notifications?.alertTypes?.wallet_scan) {
      console.log(`Wallet scan notifications disabled for wallet: ${walletAddress}`);
      return { success: false, error: 'Wallet scan notifications disabled' };
    }
    
    // Send Telegram notification if enabled
    if (userSettings.notifications?.telegram?.enabled && userSettings.notifications?.telegram?.chatId) {
      try {
        const telegramResult = await telegramService.sendWalletScanAlert(
          scanData, 
          userSettings.notifications.telegram.chatId
        );
        results.telegram = telegramResult.success;
      } catch (error) {
        console.error('Error sending Telegram notification:', error);
        results.telegram = false;
      }
    }
    
    // TODO: Implement other notification channels (email, browser, mobile)
    
    return {
      success: Object.values(results).some(result => result),
      results
    };
  } catch (error) {
    console.error('Error sending wallet scan notification:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWalletScanNotification
}; 