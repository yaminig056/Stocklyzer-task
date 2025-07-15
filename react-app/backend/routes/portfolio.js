const express = require('express');
const router = express.Router();
const { getPortfolioData, getPortfolioSummary, getPortfolioWithLivePrices } = require('../services/portfolioService');

// Get complete portfolio data with real-time prices
router.get('/', async (req, res) => {
  try {
    const { companies, metrics } = await getPortfolioData();
    res.json({ companies, metrics });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// Get portfolio summary (metrics only)
router.get('/summary', async (req, res) => {
  try {
    const portfolioSummary = await getPortfolioSummary();
    res.json(portfolioSummary);
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio summary' });
  }
});

// Get specific stock data
router.get('/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const stockData = await getPortfolioData(symbol);
    
    if (!stockData) {
      return res.status(404).json({ error: 'Stock not found in portfolio' });
    }
    
    res.json(stockData);
  } catch (error) {
    console.error(`Error fetching stock data for ${req.params.symbol}:`, error);
    res.status(500).json({ error: `Failed to fetch stock data for ${req.params.symbol}` });
  }
});

// Get portfolio companies list
router.get('/companies', async (req, res) => {
  try {
    const companies = getPortfolioData().map(company => ({
      symbol: company.symbol,
      name: company.name,
      sector: 'Unknown' // You can add sector mapping if needed
    }));
    res.json(companies);
  } catch (error) {
    console.error('Error fetching portfolio companies:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio companies' });
  }
});

module.exports = router;