const yahooFinance = require('yahoo-finance2').default;
const purchaseService = require('./purchaseService');

// Fetch real-time stock data from Yahoo Finance
async function fetchStockData(symbol) {
  try {
    console.log(`Fetching live data for ${symbol}...`);
    const yahooSymbol = `${symbol}.NS`; // NSE format
    const quote = await yahooFinance.quote(yahooSymbol);

    console.log(`✅ Live data for ${symbol}: ₹${quote.regularMarketPrice} (${quote.regularMarketChange > 0 ? '+' : ''}${quote.regularMarketChangePercent.toFixed(2)}%)`);

    return {
      symbol: symbol,
      currentPrice: quote.regularMarketPrice,
      openPrice: quote.regularMarketOpen,
      previousClose: quote.regularMarketPreviousClose,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      volume: quote.regularMarketVolume,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Error fetching live data for ${symbol}:`, error.message);
    // Return mock data as fallback
    return generateMockStockData(symbol);
  }
}

// Generate mock data for fallback
function generateMockStockData(symbol) {
  const basePrice = Math.random() * 2000 + 500;
  const change = (Math.random() - 0.5) * 100;
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol: symbol,
    currentPrice: basePrice + change,
    openPrice: basePrice,
    previousClose: basePrice - (Math.random() - 0.5) * 50,
    change: change,
    changePercent: changePercent,
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    high: basePrice + Math.random() * 100,
    low: basePrice - Math.random() * 100,
    timestamp: new Date().toISOString()
  };
}

// Calculate portfolio metrics
function calculatePortfolioMetrics(portfolioData) {
  let totalValue = 0;
  let totalCost = 0;
  let totalChange = 0;
  let activePositions = 0;

  portfolioData.forEach(item => {
    const currentValue = item.currentPrice * item.shares;
    const costValue = item.avgPrice * item.shares;
    const profitLoss = currentValue - costValue;
    
    totalValue += currentValue;
    totalCost += costValue;
    totalChange += (item.currentPrice - item.previousClose) * item.shares;
    
    if (item.shares > 0) {
      activePositions++;
    }
  });

  const totalProfitLoss = totalValue - totalCost;
  const totalProfitLossPercent = (totalProfitLoss / totalCost) * 100;
  const todayChangePercent = (totalChange / (totalValue - totalChange)) * 100;

  return {
    totalValue: totalValue,
    totalCost: totalCost,
    totalProfitLoss: totalProfitLoss,
    totalProfitLossPercent: totalProfitLossPercent,
    todayChange: totalChange,
    todayChangePercent: todayChangePercent,
    activePositions: activePositions,
    timestamp: new Date().toISOString()
  };
}

// Calculate sentiment and impact based on stock performance
function calculateStockSentimentAndImpact(stock) {
  let sentiment = 'neutral';
  let impact = 'low';
  
  // Calculate sentiment based on overall gain percentage
  if (stock.profitLossPercent > 5) {
    sentiment = 'positive';
  } else if (stock.profitLossPercent < -5) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  // Calculate impact based on multiple factors
  const dayChangeMagnitude = Math.abs(stock.changePercent || 0);
  const overallGainMagnitude = Math.abs(stock.profitLossPercent || 0);
  const portfolioWeight = (stock.currentValue || 0) / 1000000; // Weight in portfolio (assuming 1M total)
  
  let impactScore = 0;
  
  // Day's change impact (0-3 points)
  if (dayChangeMagnitude > 10) impactScore += 3;
  else if (dayChangeMagnitude > 5) impactScore += 2;
  else if (dayChangeMagnitude > 2) impactScore += 1;
  
  // Overall gain/loss impact (0-3 points)
  if (overallGainMagnitude > 20) impactScore += 3;
  else if (overallGainMagnitude > 10) impactScore += 2;
  else if (overallGainMagnitude > 5) impactScore += 1;
  
  // Portfolio weight impact (0-2 points)
  if (portfolioWeight > 0.1) impactScore += 2; // More than 10% of portfolio
  else if (portfolioWeight > 0.05) impactScore += 1; // More than 5% of portfolio
  
  // Determine impact level based on total score
  if (impactScore >= 6) impact = 'high';
  else if (impactScore >= 3) impact = 'medium';
  else impact = 'low';
  
  return { sentiment, impact };
}

// Add sector lookup for each company in the portfolio
const fs = require('fs');
const path = require('path');
const niftyFilePath = path.join(__dirname, '../data/nifty500.json');
let niftyCompanies = [];
try {
  niftyCompanies = JSON.parse(fs.readFileSync(niftyFilePath, 'utf8'));
} catch (e) {
  niftyCompanies = [];
}

// Get portfolio data with real-time prices (from purchases.json, not just hardcoded)
async function getPortfolioData() {
  try {
    // Get all user purchases with live prices
    const portfolioData = await purchaseService.getPortfolioWithPrices();
    // Attach sector from nifty500.json if available
    for (const stock of portfolioData) {
      const match = niftyCompanies.find(c => c.symbol.toUpperCase() === stock.symbol.toUpperCase());
      if (match && match.sector) {
        stock.sector = match.sector;
      }
      const { sentiment, impact } = calculateStockSentimentAndImpact(stock);
      stock.sentiment = sentiment;
      stock.impact = impact;
    }
    const metrics = calculatePortfolioMetrics(
      portfolioData.map(item => ({
        ...item,
        shares: item.quantity || item.shares || 0,
        avgPrice: item.avgPrice || item.price || 0,
        currentPrice: item.currentPrice || 0,
        previousClose: item.previousClose || 0
      }))
    );
    return {
      companies: portfolioData,
      metrics: metrics
    };
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw error;
  }
}

// Get specific stock data
async function getStockData(symbol) {
  return await fetchStockData(symbol);
}

// Get portfolio summary (metrics only)
async function getPortfolioSummary() {
  const portfolioData = await getPortfolioData();
  return portfolioData.metrics;
}

async function getPortfolioWithLivePrices(portfolio) {
  const updatedPortfolio = [];
  for (const stock of portfolio) {
    try {
      const quote = await yahooFinance.quote(`${stock.symbol}.NS`);
      stock.currentPrice = quote.regularMarketPrice;
      stock.change = quote.regularMarketChange;
      stock.changePercent = quote.regularMarketChangePercent;
      stock.currentValue = stock.currentPrice * stock.quantity;
      stock.costValue = stock.avgPrice * stock.quantity;
      stock.profitLoss = stock.currentValue - stock.costValue;
      stock.profitLossPercent = stock.costValue > 0 ? (stock.profitLoss / stock.costValue) * 100 : 0;
    } catch (e) {
      console.error(`Error fetching live price for ${stock.symbol}:`, e.message);
    }
    updatedPortfolio.push(stock);
  }
  return updatedPortfolio;
}

module.exports = {
  getPortfolioData,
  getStockData,
  getPortfolioSummary,
  getPortfolioWithLivePrices,
  fetchStockData
}; 