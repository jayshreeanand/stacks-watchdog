const axios = require('axios');
require('dotenv').config();

// Get Telegram bot token and default chat ID from environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_DEFAULT_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Base URL for Telegram Bot API
const TELEGRAM_API_BASE_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

/**
 * Send a message to a Telegram chat
 * @param {string} message - The message to send
 * @param {string} chatId - The chat ID to send the message to (defaults to the one in .env)
 * @returns {Promise<Object>} - The response from the Telegram API
 */
const sendMessage = async (message, chatId = TELEGRAM_DEFAULT_CHAT_ID) => {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('Telegram bot token not configured');
    return { success: false, error: 'Telegram bot token not configured' };
  }

  try {
    const response = await axios.post(`${TELEGRAM_API_BASE_URL}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    });

    console.log('Telegram message sent successfully');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending Telegram message:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.description || error.message 
    };
  }
};

/**
 * Format an alert for Telegram
 * @param {Object} alert - The alert object
 * @returns {string} - Formatted message
 */
const formatAlertMessage = (alert) => {
  const emoji = getAlertEmoji(alert.type);
  const riskLevel = alert.riskLevel ? `[${alert.riskLevel.toUpperCase()}] ` : '';
  
  let message = `${emoji} <b>${riskLevel}Sonic Watchdog Alert</b>\n\n`;
  message += `<b>Type:</b> ${formatAlertType(alert.type)}\n`;
  
  if (alert.targetAddress) {
    message += `<b>Address:</b> <code>${alert.targetAddress}</code>\n`;
  }
  
  if (alert.details) {
    message += `<b>Details:</b> ${alert.details}\n`;
  }
  
  if (alert.transactionHash) {
    message += `<b>Transaction:</b> <code>${alert.transactionHash}</code>\n`;
  }
  
  message += `\n<i>Time: ${new Date().toISOString()}</i>`;
  
  return message;
};

/**
 * Get an emoji for the alert type
 * @param {string} alertType - The type of alert
 * @returns {string} - An emoji representing the alert type
 */
const getAlertEmoji = (alertType) => {
  switch (alertType) {
    case 'suspicious_transaction':
      return '🚨';
    case 'rug_pull':
      return '💰';
    case 'wallet_drainer':
      return '🧙';
    case 'phishing':
      return '🎣';
    case 'security_vulnerability':
      return '🔓';
    default:
      return '⚠️';
  }
};

/**
 * Format the alert type for display
 * @param {string} alertType - The type of alert
 * @returns {string} - Formatted alert type
 */
const formatAlertType = (alertType) => {
  switch (alertType) {
    case 'suspicious_transaction':
      return 'Suspicious Transaction';
    case 'rug_pull':
      return 'Potential Rug Pull';
    case 'wallet_drainer':
      return 'Wallet Drainer Detected';
    case 'phishing':
      return 'Phishing Attempt';
    case 'security_vulnerability':
      return 'Security Vulnerability';
    default:
      return alertType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

/**
 * Send an alert via Telegram
 * @param {Object} alert - The alert object
 * @param {string} chatId - The chat ID to send the alert to (optional)
 * @returns {Promise<Object>} - The response from the Telegram API
 */
const sendAlert = async (alert, chatId) => {
  const message = formatAlertMessage(alert);
  return sendMessage(message, chatId);
};

/**
 * Test the Telegram bot connection
 * @param {string} chatId - The chat ID to test with (optional)
 * @returns {Promise<Object>} - The response from the Telegram API
 */
const testConnection = async (chatId = TELEGRAM_DEFAULT_CHAT_ID) => {
  const message = `
<b>🔔 Sonic Watchdog Telegram Bot Test</b>

Your Telegram alerts are now set up correctly!
You will receive security alerts in this chat.

<i>Time: ${new Date().toISOString()}</i>
  `;
  
  return sendMessage(message, chatId);
};

module.exports = {
  sendMessage,
  sendAlert,
  formatAlertMessage,
  testConnection
}; 