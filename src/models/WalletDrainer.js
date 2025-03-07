const mongoose = require('mongoose');

const WalletDrainerSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  detectedPatterns: {
    type: [String],
    required: false
  },
  transactionHash: {
    type: String,
    required: false
  },
  blockNumber: {
    type: Number,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  contractCode: {
    type: String,
    required: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: String,
    required: false
  },
  verifiedAt: {
    type: Date,
    required: false
  },
  notes: {
    type: String,
    required: false
  },
  victims: {
    type: [String],
    required: false
  },
  totalDrained: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('WalletDrainer', WalletDrainerSchema); 