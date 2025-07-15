const express = require('express');
const cors = require('cors');
const portfolioService = require('./services/portfolioService');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Portfolio route
app.use('/api/portfolio', require('./routes/portfolio'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test server is running!', 
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Test server running at http://localhost:${PORT}`);
  console.log(`📊 Portfolio API: http://localhost:${PORT}/api/portfolio`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
}); 