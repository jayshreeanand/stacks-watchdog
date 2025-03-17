const express = require('express');
const router = express.Router();
const rugPullService = require('../services/rugPullService');
const { ethers } = require('ethers');

/**
 * @route GET /api/rugpull
 * @desc Get all token analyses
 */
router.get('/', async (req, res) => {
  try {
    const analyses = await rugPullService.getTokenAnalyses();
    res.json(analyses);
  } catch (error) {
    console.error('Error getting token analyses:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/rugpull/recent
 * @desc Get recent token analyses
 */
router.get('/recent', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const analyses = await rugPullService.getRecentAnalyses(limit);
    res.json(analyses);
  } catch (error) {
    console.error('Error getting recent token analyses:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/rugpull/potential
 * @desc Get potential rug pulls
 */
router.get('/potential', async (req, res) => {
  try {
    const rugPulls = await rugPullService.getPotentialRugPulls();
    res.json(rugPulls);
  } catch (error) {
    console.error('Error getting potential rug pulls:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/rugpull/:address
 * @desc Get token analysis by address
 */
router.get('/:address', async (req, res) => {
  try {
    const analysis = await rugPullService.getTokenAnalysisByAddress(req.params.address);
    
    if (!analysis) {
      return res.status(404).json({ error: 'Token analysis not found' });
    }
    
    res.json(analysis);
  } catch (error) {
    console.error(`Error getting token analysis for ${req.params.address}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /api/rugpull/analyze
 * @desc Analyze a token contract for rug pull potential
 */
router.post('/analyze', async (req, res) => {
  try {
    const { tokenAddress } = req.body;
    
    if (!tokenAddress || !ethers.isAddress(tokenAddress)) {
      return res.status(400).json({ error: 'Invalid token address' });
    }
    
    // Create provider
    const provider = new ethers.JsonRpcProvider(process.env.Stacks_RPC_URL);
    
    // Analyze token contract
    const analysis = await rugPullService.analyzeTokenContract(tokenAddress, provider);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing token contract:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

/**
 * @route POST /api/rugpull
 * @desc Create a new token analysis
 */
router.post('/', async (req, res) => {
  try {
    const analysis = await rugPullService.saveTokenAnalysis(req.body);
    res.status(201).json(analysis);
  } catch (error) {
    console.error('Error creating token analysis:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route PUT /api/rugpull/:address
 * @desc Update a token analysis
 */
router.put('/:address', async (req, res) => {
  try {
    const analysis = await rugPullService.updateTokenAnalysis(req.params.address, req.body);
    
    if (!analysis) {
      return res.status(404).json({ error: 'Token analysis not found' });
    }
    
    res.json(analysis);
  } catch (error) {
    console.error(`Error updating token analysis for ${req.params.address}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route PUT /api/rugpull/:address/verify
 * @desc Verify a token analysis
 */
router.put('/:address/verify', async (req, res) => {
  try {
    const { verifiedBy, isVerified, notes } = req.body;
    
    const analysis = await rugPullService.verifyTokenAnalysis(
      req.params.address,
      verifiedBy,
      isVerified !== undefined ? isVerified : true,
      notes
    );
    
    if (!analysis) {
      return res.status(404).json({ error: 'Token analysis not found' });
    }
    
    res.json(analysis);
  } catch (error) {
    console.error(`Error verifying token analysis for ${req.params.address}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route DELETE /api/rugpull/:address
 * @desc Delete a token analysis
 */
router.delete('/:address', async (req, res) => {
  try {
    const analysis = await rugPullService.deleteTokenAnalysis(req.params.address);
    
    if (!analysis) {
      return res.status(404).json({ error: 'Token analysis not found' });
    }
    
    res.json({ message: 'Token analysis deleted' });
  } catch (error) {
    console.error(`Error deleting token analysis for ${req.params.address}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 