const axios = require("axios");
require("dotenv").config();
const telegramService = require("./telegramService");
const userSettingsService = require("../api/services/userSettingsService");

// Get Telegram bot token from environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Base URL for Telegram Bot API
const TELEGRAM_API_BASE_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Last processed update ID
let lastUpdateId = 0;

/**
 * Start the Telegram bot polling
 */
const startBot = () => {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error(
      "Telegram bot token not configured. Bot polling not started."
    );
    return;
  }

  console.log("Starting Telegram bot polling...");

  // Start polling for updates
  pollForUpdates();

  // Set up webhook for updates (alternative to polling)
  // setupWebhook();
};

/**
 * Poll for updates from the Telegram API
 */
const pollForUpdates = async () => {
  try {
    const response = await axios.get(`${TELEGRAM_API_BASE_URL}/getUpdates`, {
      params: {
        offset: lastUpdateId + 1,
        timeout: 30,
      },
    });

    const updates = response.data.result;

    if (updates && updates.length > 0) {
      // Process each update
      for (const update of updates) {
        await processUpdate(update);
        lastUpdateId = update.update_id;
      }
    }

    // Continue polling
    setTimeout(pollForUpdates, 1000);
  } catch (error) {
    console.error("Error polling for updates:", error.message);

    // Retry after a delay
    setTimeout(pollForUpdates, 5000);
  }
};

/**
 * Process an update from Telegram
 * @param {Object} update - The update object from Telegram
 */
const processUpdate = async (update) => {
  try {
    // Handle messages
    if (update.message) {
      await handleMessage(update.message);
    }

    // Handle callback queries (button clicks)
    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }
  } catch (error) {
    console.error("Error processing update:", error);
  }
};

/**
 * Handle a message from Telegram
 * @param {Object} message - The message object from Telegram
 */
const handleMessage = async (message) => {
  const chatId = message.chat.id;
  const text = message.text || "";

  // Handle commands
  if (text.startsWith("/")) {
    const [command, ...args] = text.split(" ");

    switch (command) {
      case "/start":
        await handleStartCommand(chatId);
        break;
      case "/connect":
        await handleConnectCommand(chatId, args[0], message);
        break;
      case "/help":
        await handleHelpCommand(chatId);
        break;
      default:
        await telegramService.sendMessage(
          "Unknown command. Type /help for available commands.",
          chatId
        );
        break;
    }
  }
};

/**
 * Handle the /start command
 * @param {string} chatId - The chat ID
 */
const handleStartCommand = async (chatId) => {
  const message = `
<b>👋 Welcome to Stacks Watchdog!</b>

I'm your security assistant for the Stacks blockchain. I can send you alerts about:
- Suspicious transactions
- Potential rug pulls
- Wallet drainers
- Phishing attempts
- Security vulnerabilities

To connect your account, please use the connection code from the Stacks Watchdog web app.

Type /help for more information.
  `;

  await telegramService.sendMessage(message, chatId);
};

/**
 * Handle the /connect command
 * @param {string} chatId - The chat ID
 * @param {string} code - The connection code
 */
const handleConnectCommand = async (chatId, code, message) => {
  if (!code) {
    await telegramService.sendMessage(
      "Please provide a connection code. Example: /connect 123456",
      chatId
    );
    return;
  }

  // Verify the connection code
  const result = telegramService.verifyConnectionCode(code, chatId);

  if (!result.success) {
    await telegramService.sendMessage(
      `❌ ${result.error}. Please try again with a valid code.`,
      chatId
    );
    return;
  }

  // Update user settings with the Telegram chat ID
  try {
    const username = message?.chat?.username || "";
    await userSettingsService.updateTelegramSettings(result.userId, {
      enabled: true,
      chatId: chatId.toString(),
      username: username,
    });

    // Send a success message
    const successMessage = `
<b>✅ Connection successful!</b>

Your Telegram account is now connected to Stacks Watchdog.
You will receive security alerts in this chat.

To test the connection, go to the Notification Settings page in the web app.
    `;

    await telegramService.sendMessage(successMessage, chatId);
  } catch (error) {
    console.error("Error updating user settings:", error);
    await telegramService.sendMessage(
      "❌ An error occurred while connecting your account. Please try again later.",
      chatId
    );
  }
};

/**
 * Handle the /help command
 * @param {string} chatId - The chat ID
 */
const handleHelpCommand = async (chatId) => {
  const message = `
<b>🔍 Stacks Watchdog Help</b>

Available commands:
/start - Start the bot
/connect [code] - Connect your account with a code from the web app
/help - Show this help message

For more information, visit the Stacks Watchdog web app.
  `;

  await telegramService.sendMessage(message, chatId);
};

/**
 * Handle a callback query (button click) from Telegram
 * @param {Object} callbackQuery - The callback query object from Telegram
 */
const handleCallbackQuery = async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  // Handle different callback data
  switch (data) {
    case "test_connection":
      await telegramService.testConnection(chatId);
      break;
    default:
      // Unknown callback data
      break;
  }

  // Answer the callback query to remove the loading state
  try {
    await axios.post(`${TELEGRAM_API_BASE_URL}/answerCallbackQuery`, {
      callback_query_id: callbackQuery.id,
    });
  } catch (error) {
    console.error("Error answering callback query:", error);
  }
};

/**
 * Set up a webhook for receiving updates
 * Note: This is an alternative to polling and requires a public HTTPS endpoint
 */
const setupWebhook = async () => {
  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("Telegram webhook URL not configured. Webhook not set up.");
    return;
  }

  try {
    const response = await axios.post(`${TELEGRAM_API_BASE_URL}/setWebhook`, {
      url: webhookUrl,
    });

    if (response.data.ok) {
      console.log("Telegram webhook set up successfully:", webhookUrl);
    } else {
      console.error(
        "Error setting up Telegram webhook:",
        response.data.description
      );
    }
  } catch (error) {
    console.error("Error setting up Telegram webhook:", error);
  }
};

module.exports = {
  startBot,
};
