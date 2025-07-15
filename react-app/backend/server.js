require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const realTimePriceService = require('./services/realTimePriceService');

// Import routes
const portfolioRoutes = require('./routes/portfolio');
const purchasesRoutes = require('./routes/purchases');
const newsRoutes = require('./routes/news');
const chartsRoutes = require('./routes/charts');
const gainersRoutes = require('./routes/gainers');
const losersRoutes = require('./routes/losers');
const indicesRoutes = require('./routes/indices');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize real-time price service
realTimePriceService.initializePriceData();

// Update prices every 30 seconds for real-time data
setInterval(async () => {
  try {
    await realTimePriceService.getAllRealTimePrices();
  } catch (error) {
    console.error('Error updating prices:', error);
  }
}, 30000);

// Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/charts', chartsRoutes);
app.use('/api/gainers', gainersRoutes);
app.use('/api/losers', losersRoutes);
app.use('/api/indices', indicesRoutes);

// Real-time price routes
app.get('/api/realtime/prices', async (req, res) => {
  try {
    const prices = await realTimePriceService.getAllRealTimePrices();
    res.json(prices);
  } catch (error) {
    console.error('Error fetching real-time prices:', error);
    res.status(500).json({ error: 'Failed to fetch real-time prices' });
  }
});

app.get('/api/realtime/price/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const price = await realTimePriceService.getRealTimePrice(symbol);
    if (price) {
      res.json(price);
    } else {
      res.status(404).json({ error: 'Stock not found' });
    }
  } catch (error) {
    console.error('Error fetching real-time price:', error);
    res.status(500).json({ error: 'Failed to fetch real-time price' });
  }
});

// SSE endpoint for real-time updates
app.get('/api/realtime/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  const sendUpdate = async () => {
    try {
      const prices = await realTimePriceService.getAllRealTimePrices();
      res.write(`data: ${JSON.stringify(prices)}\n\n`);
    } catch (error) {
      console.error('Error sending SSE update:', error);
    }
  };

  // Send initial data
  sendUpdate();

  // Send updates every 3 seconds
  const interval = setInterval(sendUpdate, 3000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend server is running!', 
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      purchases: '/api/purchases',
      portfolio: '/api/purchases/portfolio',
      news: '/api/news',
      charts: '/api/charts'
    }
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Real-time prices: http://localhost:${PORT}/api/realtime/prices`);
}); 