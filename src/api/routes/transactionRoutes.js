const express = require('express');
const router = express.Router();
const transactionService = require('../services/transactionService');

/**
 * @route GET /api/transactions
 * @desc Get all suspicious transactions
 */
router.get('/', async (req, res) => {
  try {
    const transactions = await transactionService.getSuspiciousTransactions();
    res.json(transactions);
  } catch (error) {
    console.error('Error getting suspicious transactions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/transactions/recent
 * @desc Get recent suspicious transactions
 */
router.get('/recent', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const transactions = await transactionService.getRecentTransactions(limit);
    res.json(transactions);
  } catch (error) {
    console.error('Error getting recent transactions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/transactions/:hash
 * @desc Get suspicious transaction by hash
 */
router.get('/:hash', async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionByHash(req.params.hash);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error(`Error getting transaction ${req.params.hash}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /api/transactions
 * @desc Create a new suspicious transaction
 */
router.post('/', async (req, res) => {
  try {
    const transaction = await transactionService.saveSuspiciousTransaction(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating suspicious transaction:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route PUT /api/transactions/:hash
 * @desc Update a suspicious transaction
 */
router.put('/:hash', async (req, res) => {
  try {
    const transaction = await transactionService.updateTransaction(req.params.hash, req.body);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error(`Error updating transaction ${req.params.hash}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route PUT /api/transactions/:hash/verify
 * @desc Verify a suspicious transaction
 */
router.put('/:hash/verify', async (req, res) => {
  try {
    const { verifiedBy, isVerified } = req.body;
    
    const transaction = await transactionService.verifyTransaction(
      req.params.hash,
      verifiedBy,
      isVerified !== undefined ? isVerified : true
    );
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error(`Error verifying transaction ${req.params.hash}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route DELETE /api/transactions/:hash
 * @desc Delete a suspicious transaction
 */
router.delete('/:hash', async (req, res) => {
  try {
    const transaction = await transactionService.deleteTransaction(req.params.hash);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error(`Error deleting transaction ${req.params.hash}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/transactions/address/:address
 * @desc Get suspicious transactions by address
 */
router.get('/address/:address', async (req, res) => {
  try {
    const role = req.query.role || 'both';
    let transactions;
    
    if (role === 'from') {
      transactions = await transactionService.getTransactionsByAddress(req.params.address, 'from');
    } else if (role === 'to') {
      transactions = await transactionService.getTransactionsByAddress(req.params.address, 'to');
    } else {
      // Get transactions where address is either sender or recipient
      const fromTransactions = await transactionService.getTransactionsByAddress(req.params.address, 'from');
      const toTransactions = await transactionService.getTransactionsByAddress(req.params.address, 'to');
      
      // Combine and remove duplicates
      const transactionMap = new Map();
      [...fromTransactions, ...toTransactions].forEach(tx => {
        transactionMap.set(tx.hash, tx);
      });
      
      transactions = Array.from(transactionMap.values());
    }
    
    res.json(transactions);
  } catch (error) {
    console.error(`Error getting transactions for address ${req.params.address}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 