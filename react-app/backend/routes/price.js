const express = require('express');
const router = express.Router();
const {
  getRealTimePrice,
  getAllRealTimePrices
} = require('../services/realTimePriceService');

// GET /api/realtime/prices - Get all stock prices
router.get('/realtime/prices', async (req, res) => {
  try {
    const prices = await getAllRealTimePrices();
    res.json(prices);
  } catch (error) {
    console.error('Error fetching all prices:', error.message);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

// GET /api/realtime/price/:symbol - Get price for a specific symbol
router.get('/realtime/price/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  try {
    const price = await getRealTimePrice(symbol);
    if (!price) {
      return res.status(404).json({ error: `Stock symbol "${symbol}" not found` });
    }
    res.json(price);
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error.message);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

module.exports = router;

