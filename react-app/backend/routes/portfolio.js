const express = require('express');
const router = express.Router();
const { getPortfolioData, getPortfolioSummary, getPortfolioWithLivePrices, fetchStockData } = require('../services/portfolioService');
const fs = require('fs');
const path = require('path');

// Get complete portfolio data with real-time prices
router.get('/', async (req, res) => {
  try {
    const { companies, metrics } = await getPortfolioData();
    console.log('DEBUG: Returning companies to frontend:', JSON.stringify(companies, null, 2));
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

// Search for any stock by symbol or company name (not limited to portfolio)
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../data/nifty500.json');
    const companies = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let symbol = query.toUpperCase();
    let stockData = await require('../services/portfolioService').getStockData(symbol);
    // If not found, try searching by company name (case-insensitive, partial match)
    if (!stockData || !stockData.currentPrice) {
      const match = companies.find(c => c.name.toLowerCase().includes(query.toLowerCase()));
      if (match) {
        symbol = match.symbol;
        stockData = await require('../services/portfolioService').getStockData(symbol);
      }
    }
    if (!stockData || !stockData.currentPrice) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json(stockData);
  } catch (error) {
    console.error(`Error searching stock data for ${req.params.query}:`, error);
    res.status(500).json({ error: `Failed to fetch stock data for ${req.params.query}` });
  }
});

// Get top N companies (e.g., NIFTY 100/500)
router.get('/top', async (req, res) => {
  try {
    const n = parseInt(req.query.n) || 50;
    const filePath = path.join(__dirname, '../data/nifty500.json');
    const allCompanies = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const topCompanies = allCompanies.slice(0, n);
    // Fetch real-time data for each symbol
    const stockData = await Promise.all(topCompanies.map(async (company) => {
      const data = await fetchStockData(company.symbol);
      return {
        ...company,
        ...data
      };
    }));
    res.json(stockData);
  } catch (error) {
    console.error('Error fetching top N companies:', error);
    res.status(500).json({ error: 'Failed to fetch top companies' });
  }
});

module.exports = router;