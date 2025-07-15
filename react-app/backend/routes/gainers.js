const express = require('express');
const router = express.Router();
const gainersService = require('../services/gainersService');

// Get top gainers
router.get('/', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const data = await gainersService.fetchGainers(parseInt(limit));
    res.json(data);
  } catch (error) {
    console.error('Error fetching gainers:', error);
    res.status(500).json({ error: 'Failed to fetch gainers data' });
  }
});

module.exports = router; 