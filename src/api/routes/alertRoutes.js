const express = require('express');
const router = express.Router();
const alertService = require('../services/alertService');

/**
 * @route GET /api/alerts
 * @desc Get all alerts
 */
router.get('/', async (req, res) => {
  try {
    const alerts = await alertService.getAlerts();
    res.json(alerts);
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/alerts/active
 * @desc Get active (unresolved) alerts
 */
router.get('/active', async (req, res) => {
  try {
    const alerts = await alertService.getActiveAlerts();
    res.json(alerts);
  } catch (error) {
    console.error('Error getting active alerts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/alerts/:id
 * @desc Get alert by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const alert = await alertService.getAlertById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.json(alert);
  } catch (error) {
    console.error(`Error getting alert ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /api/alerts
 * @desc Create a new alert
 */
router.post('/', async (req, res) => {
  try {
    const alert = await alertService.createAlert(req.body);
    
    // Emit alert through socket.io
    const io = req.app.get('io');
    io.to('alerts').emit('newAlert', alert);
    
    res.status(201).json(alert);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route PUT /api/alerts/:id
 * @desc Update an alert
 */
router.put('/:id', async (req, res) => {
  try {
    const alert = await alertService.updateAlert(req.params.id, req.body);
    
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.json(alert);
  } catch (error) {
    console.error(`Error updating alert ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route PUT /api/alerts/:id/resolve
 * @desc Resolve an alert
 */
router.put('/:id/resolve', async (req, res) => {
  try {
    const { resolvedBy } = req.body;
    
    const alert = await alertService.resolveAlert(req.params.id, resolvedBy);
    
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    // Emit alert update through socket.io
    const io = req.app.get('io');
    io.to('alerts').emit('alertResolved', alert);
    
    res.json(alert);
  } catch (error) {
    console.error(`Error resolving alert ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route DELETE /api/alerts/:id
 * @desc Delete an alert
 */
router.delete('/:id', async (req, res) => {
  try {
    const alert = await alertService.deleteAlert(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    console.error(`Error deleting alert ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/alerts/type/:type
 * @desc Get alerts by type
 */
router.get('/type/:type', async (req, res) => {
  try {
    const alerts = await alertService.getAlertsByType(req.params.type);
    res.json(alerts);
  } catch (error) {
    console.error(`Error getting alerts by type ${req.params.type}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/alerts/address/:address
 * @desc Get alerts by target address
 */
router.get('/address/:address', async (req, res) => {
  try {
    const alerts = await alertService.getAlertsByAddress(req.params.address);
    res.json(alerts);
  } catch (error) {
    console.error(`Error getting alerts by address ${req.params.address}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 