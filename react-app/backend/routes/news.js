const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');

// Get all news
router.get('/', async (req, res) => {
  try {
    const { limit = 20, category } = req.query;
    const data = await newsService.fetchNews(parseInt(limit), category);
    res.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news data' });
  }
});

// Get news by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;
    const data = await newsService.fetchNewsByCategory(category, parseInt(limit));
    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${req.params.category} news:`, error);
    res.status(500).json({ error: `Failed to fetch ${req.params.category} news` });
  }
});

// Get news by stock symbol
router.get('/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { limit = 10 } = req.query;
    const data = await newsService.fetchNewsByStock(symbol.toUpperCase(), parseInt(limit));
    res.json(data);
  } catch (error) {
    console.error(`Error fetching news for ${req.params.symbol}:`, error);
    res.status(500).json({ error: `Failed to fetch news for ${req.params.symbol}` });
  }
});

// Sentiment and impact analysis for a single stock
router.get('/stock/:symbol/sentiment', async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log(`🔍 Analyzing sentiment for ${symbol}...`);
    
    const news = await newsService.fetchNewsByStock(symbol.toUpperCase(), 10);
    
    // Analyze sentiment and impact for each news item
    let sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    let impactCounts = { high: 0, medium: 0, low: 0 };
    
    for (const item of news) {
      let sentiment = item.sentiment;
      let impact = item.impact;
      
      if (!sentiment) {
        sentiment = newsService.analyzeSentiment(item.title + ' ' + (item.summary || ''));
        item.sentiment = sentiment;
      }
      if (!impact) {
        // Enhanced impact calculation
        const text = (item.title + ' ' + (item.summary || '')).toLowerCase();
        if (text.includes('strong') || text.includes('record') || text.includes('surge') || text.includes('plunge') || text.includes('earnings')) impact = 'high';
        else if (text.includes('growth') || text.includes('decline') || text.includes('expands') || text.includes('partnership')) impact = 'medium';
        else impact = 'low';
        item.impact = impact;
      }
      
      sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;
      impactCounts[impact] = (impactCounts[impact] || 0) + 1;
    }
    
    // Determine overall sentiment and impact
    const sentiment = Object.entries(sentimentCounts).sort((a, b) => b[1] - a[1])[0][0];
    const impact = Object.entries(impactCounts).sort((a, b) => b[1] - a[1])[0][0];
    
    console.log(`✅ Sentiment analysis for ${symbol}: ${sentiment}, Impact: ${impact}, News: ${news.length} articles`);
    
    res.json({ sentiment, impact, news });
  } catch (error) {
    console.error('Error in stock sentiment analysis:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment for stock' });
  }
});

// Aggregate sentiment and impact for a portfolio
router.post('/portfolio/sentiment', async (req, res) => {
  try {
    const { symbols } = req.body;
    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ error: 'symbols array required' });
    }
    let allNews = [];
    for (const symbol of symbols) {
      const news = await newsService.fetchNewsByStock(symbol.toUpperCase(), 5);
      allNews = allNews.concat(news);
    }
    let sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    let impactCounts = { high: 0, medium: 0, low: 0 };
    for (const item of allNews) {
      let sentiment = item.sentiment;
      let impact = item.impact;
      if (!sentiment) {
        sentiment = await newsService.analyzeSentiment(item.title + ' ' + (item.summary || ''));
        item.sentiment = sentiment;
      }
      if (!impact) {
        const text = (item.title + ' ' + (item.summary || '')).toLowerCase();
        if (text.includes('strong') || text.includes('record') || text.includes('surge') || text.includes('plunge')) impact = 'high';
        else if (text.includes('growth') || text.includes('decline') || text.includes('expands')) impact = 'medium';
        else impact = 'low';
        item.impact = impact;
      }
      sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;
      impactCounts[impact] = (impactCounts[impact] || 0) + 1;
    }
    const sentiment = Object.entries(sentimentCounts).sort((a, b) => b[1] - a[1])[0][0];
    const impact = Object.entries(impactCounts).sort((a, b) => b[1] - a[1])[0][0];
    res.json({ sentiment, impact });
  } catch (error) {
    console.error('Error in portfolio sentiment analysis:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment for portfolio' });
  }
});

module.exports = router; 