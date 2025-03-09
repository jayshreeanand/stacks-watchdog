const express = require('express');
const router = express.Router();
const userSettingsService = require('../services/userSettingsService');
const telegramService = require('../../utils/telegramService');

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
 * @route PUT /api/notifications/telegram/:userId
 * @desc Update Telegram notification settings for a user
 * @access Private
 */
router.put('/telegram/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { enabled, chatId, username } = req.body;
    
    const settings = await userSettingsService.updateTelegramSettings(userId, {
      enabled,
      chatId,
      username
    });
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating Telegram settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /api/notifications/telegram/test
 * @desc Test Telegram notification
 * @access Private
 */
router.post('/telegram/test', async (req, res) => {
  try {
    const { chatId } = req.body;
    
    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }
    
    const result = await telegramService.testConnection(chatId);
    
    if (!result.success) {
      return res.status(400).json({ message: result.error });
    }
    
    res.json({ message: 'Test message sent successfully' });
  } catch (error) {
    console.error('Error sending test message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route PUT /api/notifications/alert-types/:userId
 * @desc Update alert type settings for a user
 * @access Private
 */
router.put('/alert-types/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const settings = await userSettingsService.updateAlertTypeSettings(userId, req.body);
    res.json(settings);
  } catch (error) {
    console.error('Error updating alert type settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route PUT /api/notifications/severity/:userId
 * @desc Update severity threshold for a user
 * @access Private
 */
router.put('/severity/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { threshold } = req.body;
    
    if (!['low', 'medium', 'high', 'critical'].includes(threshold)) {
      return res.status(400).json({ message: 'Invalid severity threshold' });
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

module.exports = router; 