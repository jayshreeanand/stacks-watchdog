const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    required: false
  },
  type: {
    type: String,
    enum: ['suspicious_transaction', 'rug_pull', 'wallet_drainer'],
    required: true
  },
  targetAddress: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  transactionHash: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date,
    required: false
  },
  resolvedBy: {
    type: String,
    required: false
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  }
});

module.exports = mongoose.model('Alert', AlertSchema); 