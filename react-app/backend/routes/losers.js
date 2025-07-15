const express = require('express');
const router = express.Router();
const losersService = require('../services/losersService');

// Get top losers
router.get('/', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const data = await losersService.fetchLosers(parseInt(limit));
    res.json(data);
  } catch (error) {
    console.error('Error fetching losers:', error);
    res.status(500).json({ error: 'Failed to fetch losers data' });
  }
});

module.exports = router; 