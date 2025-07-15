const axios = require('axios');

// Generate mock historical data for different time periods
function generateMockHistoricalData(symbol, period = 'daily') {
  const data = [];
  
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
  let currentPrice = basePrice;
  
  let days;
  switch (period) {
    case 'daily':
      days = 24; // Last 24 hours
      break;
    case 'weekly':
      days = 7; // Last 7 days
      break;
    case 'monthly':
      days = 30; // Last 30 days
      break;
    case 'yearly':
      days = 365; // Last year
      break;
    case '5year':
      days = 1825; // Last 5 years
      break;
    default:
      days = 30;
  }
  
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate more realistic price movement based on period
    let volatility;
    switch (period) {
      case 'daily':
        volatility = 0.02; // 2% daily volatility
        break;
      case 'weekly':
        volatility = 0.05; // 5% weekly volatility
        break;
      case 'monthly':
        volatility = 0.10; // 10% monthly volatility
        break;
      case 'yearly':
        volatility = 0.30; // 30% yearly volatility
        break;
      case '5year':
        volatility = 0.50; // 50% 5-year volatility
        break;
      default:
        volatility = 0.05;
    }
    
    // Generate price movement with trend and randomness
    const trend = Math.sin(i / 10) * 0.01; // Small trend component
    const randomChange = (Math.random() - 0.5) * volatility;
    const totalChange = trend + randomChange;
    
    currentPrice = Math.max(currentPrice * (1 + totalChange), basePrice * 0.5); // Don't go below 50% of base price
    
    const volume = Math.floor(Math.random() * 10000000) + 1000000;
    const high = currentPrice + Math.random() * currentPrice * 0.02;
    const low = Math.max(currentPrice - Math.random() * currentPrice * 0.02, currentPrice * 0.98);
    const open = currentPrice + (Math.random() - 0.5) * currentPrice * 0.01;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(currentPrice.toFixed(2)),
      volume: volume
    });
  }
  
  return data;
}

// Fetch real historical data from Alpha Vantage
async function fetchHistoricalData(symbol, period = 'daily') {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      throw new Error('Alpha Vantage API key not configured');
    }

    const stockSymbol = symbol.includes('.') ? symbol : `${symbol}.NSE`;
    let function_name, outputsize;
    
    switch (period) {
      case 'daily':
        function_name = 'TIME_SERIES_DAILY';
        outputsize = 'compact';
        break;
      case 'weekly':
        function_name = 'TIME_SERIES_WEEKLY';
        outputsize = 'compact';
        break;
      case 'monthly':
        function_name = 'TIME_SERIES_MONTHLY';
        outputsize = 'compact';
        break;
      default:
        function_name = 'TIME_SERIES_DAILY';
        outputsize = 'compact';
    }
    
    const url = `https://www.alphavantage.co/query?function=${function_name}&symbol=${stockSymbol}&outputsize=${outputsize}&apikey=${apiKey}`;
    const response = await axios.get(url);

    if (response.data['Error Message']) {
      throw new Error(`API Error: ${response.data['Error Message']}`);
    }

    // Parse the response based on function
    let timeSeriesKey;
    switch (function_name) {
      case 'TIME_SERIES_DAILY':
        timeSeriesKey = 'Time Series (Daily)';
        break;
      case 'TIME_SERIES_WEEKLY':
        timeSeriesKey = 'Weekly Time Series';
        break;
      case 'TIME_SERIES_MONTHLY':
        timeSeriesKey = 'Monthly Time Series';
        break;
      default:
        timeSeriesKey = 'Time Series (Daily)';
    }

    const timeSeries = response.data[timeSeriesKey];
    if (!timeSeries) {
      throw new Error(`No historical data available for ${symbol}`);
    }

    // Convert to array format
    const data = Object.keys(timeSeries).map(date => {
      const dayData = timeSeries[date];
      return {
        date: date,
        open: parseFloat(dayData['1. open']),
        high: parseFloat(dayData['2. high']),
        low: parseFloat(dayData['3. low']),
        close: parseFloat(dayData['4. close']),
        volume: parseInt(dayData['5. volume'])
      };
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    return data;
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    // Return mock data as fallback
    return generateMockHistoricalData(symbol, period);
  }
}

// Get chart data for a specific stock and period
async function getChartData(symbol, period = 'daily') {
  try {
    return await fetchHistoricalData(symbol, period);
  } catch (error) {
    console.error('Error getting chart data:', error);
    return generateMockHistoricalData(symbol, period);
  }
}

// Get company information
async function getCompanyInfo(symbol) {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      throw new Error('Alpha Vantage API key not configured');
    }

    const stockSymbol = symbol.includes('.') ? symbol : `${symbol}.NSE`;
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockSymbol}&apikey=${apiKey}`;
    const response = await axios.get(url);

    if (response.data['Error Message']) {
      throw new Error(`API Error: ${response.data['Error Message']}`);
    }

    return {
      symbol: symbol,
      name: response.data.Name || symbol,
      description: response.data.Description || 'No description available',
      sector: response.data.Sector || 'Unknown',
      industry: response.data.Industry || 'Unknown',
      marketCap: response.data.MarketCapitalization || 'Unknown',
      peRatio: response.data.PERatio || 'Unknown',
      dividendYield: response.data.DividendYield || 'Unknown',
      eps: response.data.EPS || 'Unknown',
      beta: response.data.Beta || 'Unknown'
    };
  } catch (error) {
    console.error(`Error fetching company info for ${symbol}:`, error);
    // Return mock company info
    return {
      symbol: symbol,
      name: symbol,
      description: 'Company information not available',
      sector: 'Unknown',
      industry: 'Unknown',
      marketCap: 'Unknown',
      peRatio: 'Unknown',
      dividendYield: 'Unknown',
      eps: 'Unknown',
      beta: 'Unknown'
    };
  }
}

module.exports = {
  getChartData,
  getCompanyInfo,
  generateMockHistoricalData
}; 