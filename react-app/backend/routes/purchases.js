const express = require('express');
const router = express.Router();
const purchaseService = require('../services/purchaseService');
const { getPortfolioData } = require('../services/portfolioService');

// Add a new stock purchase
router.post('/', async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body;
    
    // Validate input
    if (!symbol || !quantity || !price) {
      return res.status(400).json({ 
        error: 'Missing required fields: symbol, quantity, and price are required' 
      });
    }

    if (quantity <= 0 || price <= 0) {
      return res.status(400).json({ 
        error: 'Quantity and price must be positive numbers' 
      });
    }

    // Add purchase
    const result = await purchaseService.addPurchase({
      symbol: symbol.toUpperCase(),
      quantity: parseInt(quantity),
      price: parseFloat(price),
      avgPrice: parseFloat(price) // For new purchases, avg price = purchase price
    });

    res.status(201).json({
      success: true,
      message: `Successfully purchased ${quantity} shares of ${symbol.toUpperCase()} at ₹${price}`,
      purchase: result.purchases.find(p => p.symbol === symbol.toUpperCase())
    });
  } catch (error) {
    console.error('Error adding purchase:', error);
    res.status(500).json({ 
      error: 'Failed to purchase stock. Please try again.' 
    });
  }
});

// Get all purchases
router.get('/', async (req, res) => {
  try {
    const purchases = await purchaseService.getPurchases();
    res.json(purchases);
  } catch (error) {
    console.error('Error getting purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

// Get portfolio data
router.get('/portfolio', async (req, res) => {
  try {
    console.log('📊 Fetching portfolio with live prices...');
    const { companies, metrics } = await getPortfolioData();
    console.log(`✅ Portfolio fetched: ${companies.length} stocks with live prices`);
    res.json({ companies, metrics });
  } catch (error) {
    console.error('❌ Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

// Real-time portfolio updates using Server-Sent Events
router.get('/portfolio/stream', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  const sendUpdate = async () => {
    try {
      const portfolio = await purchaseService.getPortfolioWithPrices();
      res.write(`data: ${JSON.stringify(portfolio)}\n\n`);
    } catch (error) {
      console.error('Error sending portfolio update:', error);
    }
  };

  // Send initial data
  await sendUpdate();

  // Send updates every 30 seconds
  const interval = setInterval(sendUpdate, 30000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
  });
});

// Get purchase by symbol
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const purchase = await purchaseService.getPurchaseBySymbol(symbol.toUpperCase());
    
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    res.json(purchase);
  } catch (error) {
    console.error('Error getting purchase:', error);
    res.status(500).json({ error: 'Failed to fetch purchase' });
  }
});

// Update purchase quantity (sell shares)
router.put('/:symbol/sell', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }
    
    const result = await purchaseService.updatePurchaseQuantity(symbol.toUpperCase(), parseInt(quantity));
    
    res.json({
      success: true,
      message: `Successfully sold ${quantity} shares of ${symbol.toUpperCase()}`,
      purchases: result.purchases
    });
  } catch (error) {
    console.error('Error selling shares:', error);
    res.status(500).json({ error: error.message || 'Failed to sell shares' });
  }
});

// Delete purchase (sell all shares)
router.delete('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const purchase = await purchaseService.getPurchaseBySymbol(symbol.toUpperCase());
    
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    const result = await purchaseService.updatePurchaseQuantity(symbol.toUpperCase(), purchase.quantity);
    
    res.json({
      success: true,
      message: `Successfully sold all shares of ${symbol.toUpperCase()}`,
      purchases: result.purchases
    });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    res.status(500).json({ error: 'Failed to delete purchase' });
  }
});

module.exports = router; 