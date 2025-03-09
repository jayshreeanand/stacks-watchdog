const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  walletAddress: {
    type: String,
    required: true
  },
  notifications: {
    email: {
      enabled: {
        type: Boolean,
        default: false
      },
      address: String
    },
    telegram: {
      enabled: {
        type: Boolean,
        default: false
      },
      chatId: String,
      username: String
    },
    browser: {
      enabled: {
        type: Boolean,
        default: true
      }
    },
    severityThreshold: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    alertTypes: {
      suspicious_transaction: {
        type: Boolean,
        default: true
      },
      rug_pull: {
        type: Boolean,
        default: true
      },
      wallet_drainer: {
        type: Boolean,
        default: true
      },
      phishing: {
        type: Boolean,
        default: true
      },
      security_vulnerability: {
        type: Boolean,
        default: true
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

module.exports = UserSettings; 