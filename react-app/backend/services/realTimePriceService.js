const yahooFinance = require('yahoo-finance2').default;

// NSE-compatible stock symbols
const STOCK_SYMBOLS = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'SUNPHARMA',
  'LT', 'ITC', 'BHARTIARTL', 'ICICIBANK', 'DRREDDY',
  'HINDUNILVR', 'WIPRO', 'AXISBANK', 'CIPLA', 'MARUTI',
  'TATAMOTORS', 'ASIANPAINT', 'NESTLEIND', 'BAJFINANCE'
];

// Optional: Map symbols to sectors
const SYMBOL_SECTORS = {
  RELIANCE: 'Oil & Gas',
  TCS: 'IT',
  HDFCBANK: 'Banking',
  INFY: 'IT',
  SUNPHARMA: 'Pharma',
  LT: 'Industrial',
  ITC: 'FMCG',
  BHARTIARTL: 'Telecom',
  ICICIBANK: 'Banking',
  DRREDDY: 'Pharma',
  HINDUNILVR: 'FMCG',
  WIPRO: 'IT',
  AXISBANK: 'Banking',
  CIPLA: 'Pharma',
  MARUTI: 'Auto',
  TATAMOTORS: 'Auto',
  ASIANPAINT: 'Industrial',
  NESTLEIND: 'FMCG',
  BAJFINANCE: 'Finance'
};

// Fetch price for a single stock with enhanced error handling
async function getRealTimePrice(symbol) {
  try {
    console.log(`📈 Fetching real-time price for ${symbol}...`);
    const yahooSymbol = `${symbol}.NS`; // NSE format
    const quote = await yahooFinance.quote(yahooSymbol);

    if (!quote || !quote.regularMarketPrice) {
      console.error(`❌ No price data received for ${symbol}`);
      return null;
    }

    const stockData = {
      symbol: symbol,
      currentPrice: quote.regularMarketPrice,
      openPrice: quote.regularMarketOpen || 0,
      previousClose: quote.regularMarketPreviousClose || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      high: quote.regularMarketDayHigh || 0,
      low: quote.regularMarketDayLow || 0,
      volume: quote.regularMarketVolume || 0,
      sector: SYMBOL_SECTORS[symbol] || "Unknown",
      lastUpdated: new Date().toISOString(),
      marketCap: quote.marketCap || 0,
      peRatio: quote.trailingPE || 0,
      dividendYield: quote.trailingAnnualDividendYield || 0
    };

    console.log(`✅ ${symbol}: ₹${stockData.currentPrice} (${stockData.changePercent > 0 ? '+' : ''}${stockData.changePercent.toFixed(2)}%)`);
    return stockData;
  } catch (err) {
    console.error(`❌ Error fetching price for ${symbol}:`, err.message);
    return null;
  }
}

// Fetch prices for all stocks with progress tracking
async function getAllRealTimePrices() {
  console.log('🔄 Fetching real-time prices for all stocks...');
  const startTime = Date.now();
  
  const results = await Promise.allSettled(
    STOCK_SYMBOLS.map(symbol => getRealTimePrice(symbol))
  );
  
  const data = {};
  let successCount = 0;
  let errorCount = 0;
  
  results.forEach((result, index) => {
    const symbol = STOCK_SYMBOLS[index];
    if (result.status === 'fulfilled' && result.value) {
      data[symbol] = result.value;
      successCount++;
    } else {
      console.error(`❌ Failed to fetch data for ${symbol}`);
      errorCount++;
    }
  });
  
  const endTime = Date.now();
  console.log(`✅ Fetched ${successCount}/${STOCK_SYMBOLS.length} stocks in ${endTime - startTime}ms`);
  
  if (errorCount > 0) {
    console.warn(`⚠️ ${errorCount} stocks failed to fetch`);
  }
  
  return data;
}

// Get a specific stock's detailed information
async function getStockDetails(symbol) {
  try {
    console.log(`📊 Fetching detailed info for ${symbol}...`);
    const yahooSymbol = `${symbol}.NS`;
    const quote = await yahooFinance.quote(yahooSymbol);
    
    return {
      symbol: symbol,
      name: quote.longName || quote.shortName || symbol,
      currentPrice: quote.regularMarketPrice,
      openPrice: quote.regularMarketOpen,
      previousClose: quote.regularMarketPreviousClose,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      volume: quote.regularMarketVolume,
      marketCap: quote.marketCap,
      peRatio: quote.trailingPE,
      dividendYield: quote.trailingAnnualDividendYield,
      sector: quote.sector || SYMBOL_SECTORS[symbol] || "Unknown",
      industry: quote.industry || "Unknown",
      lastUpdated: new Date().toISOString()
    };
  } catch (err) {
    console.error(`❌ Error fetching details for ${symbol}:`, err.message);
    return null;
  }
}

// Initialize price data (can be called on server start)
async function initializePriceData() {
  console.log('🚀 Initializing real-time price data...');
  try {
    const initialData = await getAllRealTimePrices();
    console.log(`✅ Initialized with ${Object.keys(initialData).length} stocks`);
    return initialData;
  } catch (error) {
    console.error('❌ Error initializing price data:', error);
    return {};
  }
}

module.exports = {
  getRealTimePrice,
  getAllRealTimePrices,
  getStockDetails,
  initializePriceData,
  STOCK_SYMBOLS
};
