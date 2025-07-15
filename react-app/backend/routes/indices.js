const express = require('express');
const router = express.Router();
const indicesService = require('../services/indicesService');

// Get all indices data
router.get('/', async (req, res) => {
  try {
    const data = await indicesService.fetchIndices();
    res.json(data);
  } catch (error) {
    console.error('Error fetching indices:', error);
    res.status(500).json({ error: 'Failed to fetch indices data' });
  }
});

// Get specific index data
router.get('/:index', async (req, res) => {
  try {
    const { index } = req.params;
    const data = await indicesService.fetchSpecificIndex(index);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${req.params.index}:`, error);
    res.status(500).json({ error: `Failed to fetch ${req.params.index} data` });
  }
});

module.exports = router; 