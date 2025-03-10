const express = require('express');
const router = express.Router();
const userSettingsService = require('../services/userSettingsService');
const telegramService = require('../../utils/telegramService');
const notificationService = require('../../utils/notificationService');

/**
 * @route GET /api/notifications/settings/:userId
 * @desc Get notification settings for a user
 * @access Private
 */
router.get('/settings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const settings = await userSettingsService.getUserSettings(userId);
    
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error getting notification settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route PUT /api/notifications/settings/:userId
 * @desc Update notification settings for a user
 * @access Private
 */
router.put('/settings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const settings = await userSettingsService.updateUserSettings(userId, req.body);
    res.json(settings);
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /api/notifications/telegram/connect
 * @desc Generate a Telegram connection code
 * @access Private
 */
router.post('/telegram/connect', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    
    // Get connection instructions
    const result = telegramService.getConnectionInstructions(userId);
    
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }
    
    // Get bot info for username
    const botInfo = await telegramService.getBotInfo();
    const botUsername = botInfo.success ? botInfo.data.username : null;
    
    res.json({
      success: true,
      code: result.code,
      instructions: result.instructions,
      expiresIn: result.expiresIn,
      botUsername
    });
  } catch (error) {
    console.error('Error generating Telegram connection code:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * @route POST /api/notifications/telegram/disconnect
 * @desc Disconnect Telegram
 * @access Private
 */
router.post('/telegram/disconnect', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    
    // Update Telegram settings
    await userSettingsService.updateTelegramSettings(userId, {
      enabled: false,
      chatId: '',
      username: ''
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting Telegram:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * @route POST /api/notifications/telegram/test
 * @desc Send a test message to Telegram
 * @access Private
 */
router.post('/telegram/test', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    
    // Get user settings
    const settings = await userSettingsService.getUserSettings(userId);
    
    if (!settings || !settings.notifications || !settings.notifications.telegram || !settings.notifications.telegram.enabled) {
      return res.status(400).json({ success: false, error: 'Telegram notifications are not enabled' });
    }
    
    const chatId = settings.notifications.telegram.chatId;
    
    if (!chatId) {
      return res.status(400).json({ success: false, error: 'Telegram chat ID not found' });
    }
    
    // Send test message
    const result = await telegramService.testConnection(chatId);
    
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending test message to Telegram:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * @route PUT /api/notifications/alert-types/:userId
 * @desc Update alert type settings
 * @access Private
 */
router.put('/alert-types/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const alertTypes = req.body;
    
    const settings = await userSettingsService.updateAlertTypeSettings(userId, alertTypes);
    res.json(settings);
  } catch (error) {
    console.error('Error updating alert type settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route PUT /api/notifications/severity-threshold/:userId
 * @desc Update severity threshold
 * @access Private
 */
router.put('/severity-threshold/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { threshold } = req.body;
    
    if (!threshold) {
      return res.status(400).json({ message: 'Threshold is required' });
    }
    
    const settings = await userSettingsService.updateSeverityThreshold(userId, threshold);
    res.json(settings);
  } catch (error) {
    console.error('Error updating severity threshold:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route DELETE /api/notifications/settings/:userId
 * @desc Delete notification settings for a user
 * @access Private
 */
router.delete('/settings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const deleted = await userSettingsService.deleteUserSettings(userId);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    
    res.json({ message: 'Settings deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /api/notifications/wallet-scan
 * @desc Send a notification when a wallet is scanned
 * @access Private
 */
router.post('/wallet-scan', async (req, res) => {
  try {
    const { walletAddress, scanType } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ success: false, error: 'Wallet address is required' });
    }
    
    const scanData = {
      walletAddress,
      scanType: scanType || 'Security Scan',
      scanTime: Date.now()
    };
    
    const result = await notificationService.sendWalletScanNotification(scanData);
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        error: result.error || 'Failed to send wallet scan notification' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Wallet scan notification sent',
      results: result.results
    });
  } catch (error) {
    console.error('Error sending wallet scan notification:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router; 