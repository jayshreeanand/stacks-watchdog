const express = require('express');
const router = express.Router();
const walletDrainerService = require('../services/walletDrainerService');
const { ethers } = require('ethers');

/**
 * @route GET /api/walletdrainer
 * @desc Get all wallet drainers
 */
router.get('/', async (req, res) => {
  try {
    const drainers = await walletDrainerService.getDrainers();
    res.json(drainers);
  } catch (error) {
    console.error('Error getting wallet drainers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/walletdrainer/recent
 * @desc Get recent wallet drainers
 */
router.get('/recent', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const drainers = await walletDrainerService.getRecentDrainers(limit);
    res.json(drainers);
  } catch (error) {
    console.error('Error getting recent wallet drainers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/walletdrainer/:address
 * @desc Get wallet drainer by address
 */
router.get('/:address', async (req, res) => {
  try {
    const drainer = await walletDrainerService.getDrainerByAddress(req.params.address);
    
    if (!drainer) {
      return res.status(404).json({ error: 'Wallet drainer not found' });
    }
    
    res.json(drainer);
  } catch (error) {
    console.error(`Error getting wallet drainer for ${req.params.address}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /api/walletdrainer/analyze
 * @desc Analyze a contract for wallet drainer potential
 */
router.post('/analyze', async (req, res) => {
  try {
    const { contractAddress } = req.body;
    
    if (!contractAddress || !ethers.isAddress(contractAddress)) {
      return res.status(400).json({ error: 'Invalid contract address' });
    }
    
    // Create provider
    const provider = new ethers.JsonRpcProvider(process.env.ELECTRONEUM_RPC_URL);
    
    // Analyze contract
    const analysis = await walletDrainerService.analyzeContractForDrainer(contractAddress, provider);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing contract for drainer:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

/**
 * @route POST /api/walletdrainer
 * @desc Create a new wallet drainer
 */
router.post('/', async (req, res) => {
  try {
    const drainer = await walletDrainerService.saveDrainer(req.body);
    res.status(201).json(drainer);
  } catch (error) {
    console.error('Error creating wallet drainer:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route PUT /api/walletdrainer/:address
 * @desc Update a wallet drainer
 */
router.put('/:address', async (req, res) => {
  try {
    const drainer = await walletDrainerService.updateDrainer(req.params.address, req.body);
    
    if (!drainer) {
      return res.status(404).json({ error: 'Wallet drainer not found' });
    }
    
    res.json(drainer);
  } catch (error) {
    console.error(`Error updating wallet drainer for ${req.params.address}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route PUT /api/walletdrainer/:address/verify
 * @desc Verify a wallet drainer
 */
router.put('/:address/verify', async (req, res) => {
  try {
    const { verifiedBy, isVerified, notes } = req.body;
    
    const drainer = await walletDrainerService.verifyDrainer(
      req.params.address,
      verifiedBy,
      isVerified !== undefined ? isVerified : true,
      notes
    );
    
    if (!drainer) {
      return res.status(404).json({ error: 'Wallet drainer not found' });
    }
    
    res.json(drainer);
  } catch (error) {
    console.error(`Error verifying wallet drainer for ${req.params.address}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /api/walletdrainer/:address/victim
 * @desc Add a victim to a wallet drainer
 */
router.post('/:address/victim', async (req, res) => {
  try {
    const { victimAddress, amount } = req.body;
    
    if (!victimAddress || !ethers.isAddress(victimAddress)) {
      return res.status(400).json({ error: 'Invalid victim address' });
    }
    
    const drainer = await walletDrainerService.addVictim(
      req.params.address,
      victimAddress,
      amount
    );
    
    res.json(drainer);
  } catch (error) {
    console.error(`Error adding victim to drainer ${req.params.address}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route DELETE /api/walletdrainer/:address
 * @desc Delete a wallet drainer
 */
router.delete('/:address', async (req, res) => {
  try {
    const drainer = await walletDrainerService.deleteDrainer(req.params.address);
    
    if (!drainer) {
      return res.status(404).json({ error: 'Wallet drainer not found' });
    }
    
    res.json({ message: 'Wallet drainer deleted' });
  } catch (error) {
    console.error(`Error deleting wallet drainer for ${req.params.address}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 