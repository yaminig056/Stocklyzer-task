const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const realTimePriceService = require('./realTimePriceService');

// File to store user purchases
const PURCHASES_FILE = path.join(__dirname, '../data/purchases.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(PURCHASES_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Load purchases from file
async function loadPurchases() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(PURCHASES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Save purchases to file
async function savePurchases(purchases) {
  await ensureDataDirectory();
  await fs.writeFile(PURCHASES_FILE, JSON.stringify(purchases, null, 2));
}

// Add a new stock purchase
async function addPurchase(purchaseData) {
  try {
    const purchases = await loadPurchases();
    
    // Check if stock already exists in portfolio
    const existingIndex = purchases.findIndex(p => p.symbol === purchaseData.symbol);
    
    if (existingIndex !== -1) {
      // Update existing purchase (average the price)
      const existing = purchases[existingIndex];
      const totalShares = existing.quantity + purchaseData.quantity;
      const totalCost = (existing.avgPrice * existing.quantity) + (purchaseData.price * purchaseData.quantity);
      const newAvgPrice = totalCost / totalShares;
      
      purchases[existingIndex] = {
        ...existing,
        quantity: totalShares,
        avgPrice: newAvgPrice,
        lastUpdated: new Date().toISOString()
      };
    } else {
      // Add new purchase
      purchases.push({
        ...purchaseData,
        id: Date.now().toString(),
        purchaseDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
    }
    
    await savePurchases(purchases);
    return { success: true, purchases };
  } catch (error) {
    console.error('Error adding purchase:', error);
    throw new Error('Failed to add purchase');
  }
}

// Get all purchases
async function getPurchases() {
  try {
    return await loadPurchases();
  } catch (error) {
    console.error('Error loading purchases:', error);
    return [];
  }
}

// Get purchase by symbol
async function getPurchaseBySymbol(symbol) {
  try {
    const purchases = await loadPurchases();
    return purchases.find(p => p.symbol === symbol);
  } catch (error) {
    console.error('Error getting purchase by symbol:', error);
    return null;
  }
}

// Update purchase quantity (sell some shares)
async function updatePurchaseQuantity(symbol, quantityToSell) {
  try {
    const purchases = await loadPurchases();
    const purchaseIndex = purchases.findIndex(p => p.symbol === symbol);
    
    if (purchaseIndex === -1) {
      throw new Error('Purchase not found');
    }
    
    const purchase = purchases[purchaseIndex];
    const newQuantity = purchase.quantity - quantityToSell;
    
    if (newQuantity < 0) {
      throw new Error('Insufficient shares to sell');
    }
    
    if (newQuantity === 0) {
      // Remove purchase if all shares sold
      purchases.splice(purchaseIndex, 1);
    } else {
      // Update quantity
      purchases[purchaseIndex] = {
        ...purchase,
        quantity: newQuantity,
        lastUpdated: new Date().toISOString()
      };
    }
    
    await savePurchases(purchases);
    return { success: true, purchases };
  } catch (error) {
    console.error('Error updating purchase quantity:', error);
    throw error;
  }
}

// Get portfolio with current prices
async function getPortfolioWithPrices() {
  try {
    const purchases = await loadPurchases();
    const portfolioWithPrices = [];
    
    for (const purchase of purchases) {
      try {
        // Get real-time stock data
        const stockData = await realTimePriceService.getRealTimePrice(purchase.symbol);
        
        if (stockData) {
          const currentValue = stockData.currentPrice * purchase.quantity;
          const costValue = purchase.avgPrice * purchase.quantity;
          const profitLoss = currentValue - costValue;
          const profitLossPercent = (profitLoss / costValue) * 100;
          
          portfolioWithPrices.push({
            ...purchase,
            ...stockData,
            currentValue,
            costValue,
            profitLoss,
            profitLossPercent
          });
        } else {
          // Fallback to mock data if real-time data not available
          const mockData = generateMockStockData(purchase.symbol);
          const currentValue = mockData.currentPrice * purchase.quantity;
          const costValue = purchase.avgPrice * purchase.quantity;
          const profitLoss = currentValue - costValue;
          const profitLossPercent = (profitLoss / costValue) * 100;
          
          portfolioWithPrices.push({
            ...purchase,
            ...mockData,
            currentValue,
            costValue,
            profitLoss,
            profitLossPercent
          });
        }
      } catch (error) {
        console.error(`Error fetching data for ${purchase.symbol}:`, error);
        // Add purchase with mock data if API fails
        const mockData = generateMockStockData(purchase.symbol);
        const currentValue = mockData.currentPrice * purchase.quantity;
        const costValue = purchase.avgPrice * purchase.quantity;
        const profitLoss = currentValue - costValue;
        const profitLossPercent = (profitLoss / costValue) * 100;
        
        portfolioWithPrices.push({
          ...purchase,
          ...mockData,
          currentValue,
          costValue,
          profitLoss,
          profitLossPercent
        });
      }
    }
    
    return portfolioWithPrices;
  } catch (error) {
    console.error('Error getting portfolio with prices:', error);
    throw error;
  }
}

// Generate realistic mock stock data with price movements
function generateMockStockData(symbol) {
  // Base prices for different stocks
  const basePrices = {
    'RELIANCE': 2450,
    'TCS': 3850,
    'HDFCBANK': 1650,
    'INFY': 1450,
    'SUNPHARMA': 1050,
    'LT': 2850,
    'ITC': 425,
    'BHARTIARTL': 850,
    'ICICIBANK': 950,
    'DRREDDY': 5400,
    'HINDUNILVR': 2600,
    'WIPRO': 600,
    'AXISBANK': 950,
    'CIPLA': 1200,
    'MARUTI': 9500,
    'TATAMOTORS': 750,
    'ASIANPAINT': 3200,
    'NESTLEIND': 24000,
    'BAJFINANCE': 7000
  };

  const basePrice = basePrices[symbol] || 1000;
  
  // Generate realistic price movement (small random change)
  const changePercent = (Math.random() - 0.5) * 4; // -2% to +2%
  const change = (basePrice * changePercent) / 100;
  const currentPrice = basePrice + change;
  const openPrice = basePrice + (Math.random() - 0.5) * 20;
  const previousClose = basePrice;
  const high = Math.max(currentPrice, openPrice) + Math.random() * 10;
  const low = Math.min(currentPrice, openPrice) - Math.random() * 10;
  const volume = Math.floor(Math.random() * 10000000) + 1000000;

  return {
    symbol: symbol,
    currentPrice: parseFloat(currentPrice.toFixed(2)),
    openPrice: parseFloat(openPrice.toFixed(2)),
    previousClose: parseFloat(previousClose.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    volume: volume,
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  addPurchase,
  getPurchases,
  getPurchaseBySymbol,
  updatePurchaseQuantity,
  getPortfolioWithPrices,
  generateMockStockData
}; 