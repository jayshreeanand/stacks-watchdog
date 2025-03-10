const axios = require("axios");
require("dotenv").config();

// Get Telegram bot token and default chat ID from environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_DEFAULT_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Base URL for Telegram Bot API
const TELEGRAM_API_BASE_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Store active connection codes
const activeConnectionCodes = new Map();

/**
 * Generate a unique connection code for a user
 * @param {string} userId - The user ID
 * @returns {string} - A unique connection code
 */
const generateConnectionCode = (userId) => {
  // Generate a random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the code with the user ID and expiration time (10 minutes)
  activeConnectionCodes.set(code, {
    userId,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  // Return the code
  return code;
};

/**
 * Verify a connection code and associate it with a Telegram chat ID
 * @param {string} code - The connection code
 * @param {string} chatId - The Telegram chat ID
 * @returns {Object} - The result of the verification
 */
const verifyConnectionCode = (code, chatId) => {
  // Check if the code exists and is valid
  if (!activeConnectionCodes.has(code)) {
    return { success: false, error: "Invalid connection code" };
  }

  const connection = activeConnectionCodes.get(code);

  // Check if the code has expired
  if (connection.expiresAt < Date.now()) {
    activeConnectionCodes.delete(code);
    return { success: false, error: "Connection code has expired" };
  }

  // Return the user ID and chat ID
  const result = {
    success: true,
    userId: connection.userId,
    chatId,
  };

  // Remove the code from active connections
  activeConnectionCodes.delete(code);

  return result;
};

/**
 * Send a message to a Telegram chat
 * @param {string} message - The message to send
 * @param {string} chatId - The chat ID to send the message to (defaults to the one in .env)
 * @returns {Promise<Object>} - The response from the Telegram API
 */
const sendMessage = async (message, chatId = TELEGRAM_DEFAULT_CHAT_ID) => {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error("[TelegramService] Telegram bot token not configured");
    return { success: false, error: "Telegram bot token not configured" };
  }

  if (!chatId) {
    console.error("[TelegramService] Chat ID not provided");
    return { success: false, error: "Chat ID not provided" };
  }

  console.log(`[TelegramService] Sending message to chat ID: ${chatId}`);

  try {
    const response = await axios.post(`${TELEGRAM_API_BASE_URL}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    });

    console.log("[TelegramService] Message sent successfully");
    return { success: true, data: response.data };
  } catch (error) {
    console.error(
      "[TelegramService] Error sending message:",
      error.response?.data || error.message
    );

    // Log more detailed error information
    if (error.response) {
      console.error(
        "[TelegramService] Response status:",
        error.response.status
      );
      console.error(
        "[TelegramService] Response data:",
        JSON.stringify(error.response.data)
      );
    }

    return {
      success: false,
      error: error.response?.data?.description || error.message,
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
  const riskLevel = alert.riskLevel
    ? `[${alert.riskLevel.toUpperCase()}] `
    : "";

  let message = `${emoji} <b>${riskLevel}Chain Shield Alert</b>\n\n`;
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
    case "suspicious_transaction":
      return "🚨";
    case "rug_pull":
      return "💰";
    case "wallet_drainer":
      return "🧙";
    case "phishing":
      return "🎣";
    case "security_vulnerability":
      return "🔓";
    default:
      return "⚠️";
  }
};

/**
 * Format the alert type for display
 * @param {string} alertType - The type of alert
 * @returns {string} - Formatted alert type
 */
const formatAlertType = (alertType) => {
  switch (alertType) {
    case "suspicious_transaction":
      return "Suspicious Transaction";
    case "rug_pull":
      return "Potential Rug Pull";
    case "wallet_drainer":
      return "Wallet Drainer Detected";
    case "phishing":
      return "Phishing Attempt";
    case "security_vulnerability":
      return "Security Vulnerability";
    default:
      return alertType
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
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
<b>🔔 Chain Shield Telegram Bot Test</b>

Your Telegram alerts are now set up correctly!
You will receive security alerts in this chat.

<i>Time: ${new Date().toISOString()}</i>
  `;

  return sendMessage(message, chatId);
};

/**
 * Get the Telegram bot information
 * @returns {Promise<Object>} - The bot information
 */
const getBotInfo = async () => {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error("Telegram bot token not configured");
    return { success: false, error: "Telegram bot token not configured" };
  }

  try {
    const response = await axios.get(`${TELEGRAM_API_BASE_URL}/getMe`);
    return { success: true, data: response.data.result };
  } catch (error) {
    console.error(
      "Error getting bot info:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.description || error.message,
    };
  }
};

/**
 * Send connection instructions to a user
 * @param {string} userId - The user ID
 * @returns {Object} - The connection code and instructions
 */
const getConnectionInstructions = (userId) => {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error("Telegram bot token not configured");
    return { success: false, error: "Telegram bot token not configured" };
  }

  // Generate a connection code
  const code = generateConnectionCode(userId);

  // Get the bot username (async, but we'll return the code immediately)
  getBotInfo().then((result) => {
    if (!result.success) {
      console.error("Error getting bot info:", result.error);
    }
  });

  return {
    success: true,
    code,
    expiresIn: "10 minutes",
    instructions: `To connect your Telegram account, send the following message to our bot:\n\n/connect ${code}`,
  };
};

/**
 * Send a wallet scan alert via Telegram
 * @param {Object} scanData - The wallet scan data
 * @param {string} chatId - The chat ID to send the alert to (optional)
 * @returns {Promise<Object>} - The response from the Telegram API
 */
const sendWalletScanAlert = async (scanData, chatId) => {
  const { walletAddress, scanTime, scanType } = scanData;

  const message = `
<b>🔍 Chain Shield Wallet Scan Alert</b>

Your wallet has been scanned:
<b>Address:</b> <code>${walletAddress}</code>
<b>Scan Type:</b> ${scanType || "Security Scan"}
<b>Time:</b> ${new Date(scanTime || Date.now()).toISOString()}

This is an automated security alert from Chain Shield.
  `;

  return sendMessage(message, chatId);
};

module.exports = {
  sendMessage,
  sendAlert,
  formatAlertMessage,
  testConnection,
  generateConnectionCode,
  verifyConnectionCode,
  getBotInfo,
  getConnectionInstructions,
  sendWalletScanAlert,
};
