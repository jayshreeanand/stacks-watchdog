const mongoose = require('mongoose');

const TokenAnalysisSchema = new mongoose.Schema({
  tokenAddress: {
    type: String,
    required: true,
    unique: true
  },
  tokenName: {
    type: String,
    required: false
  },
  tokenSymbol: {
    type: String,
    required: false
  },
  isPotentialRugPull: {
    type: Boolean,
    required: true
  },
  riskScore: {
    type: Number,
    required: true
  },
  reasons: {
    type: [String],
    required: true
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
  }
});

module.exports = mongoose.model('TokenAnalysis', TokenAnalysisSchema); 