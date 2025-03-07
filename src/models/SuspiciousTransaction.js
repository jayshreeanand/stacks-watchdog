const mongoose = require('mongoose');

const SuspiciousTransactionSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  reason: {
    type: String,
    required: true
  },
  aiAnalysis: {
    isSuspicious: {
      type: Boolean,
      default: false
    },
    reason: {
      type: String,
      required: false
    },
    confidence: {
      type: Number,
      required: false
    }
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
  }
});

module.exports = mongoose.model('SuspiciousTransaction', SuspiciousTransactionSchema); 