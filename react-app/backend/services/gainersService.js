const axios = require('axios');

// Mock data for top gainers
const mockGainersData = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    price: 2850.75,
    change: 125.50,
    changePercent: 4.61,
    volume: 12500000,
    marketCap: 1920000000000,
    sector: 'Oil & Gas',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 3850.25,
    change: 95.75,
    changePercent: 2.55,
    volume: 8500000,
    marketCap: 1420000000000,
    sector: 'IT',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank',
    price: 1650.50,
    change: 75.25,
    changePercent: 4.78,
    volume: 15000000,
    marketCap: 980000000000,
    sector: 'Banking',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'INFY',
    name: 'Infosys',
    price: 1450.75,
    change: 65.50,
    changePercent: 4.73,
    volume: 12000000,
    marketCap: 620000000000,
    sector: 'IT',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank',
    price: 950.25,
    change: 55.75,
    changePercent: 6.23,
    volume: 18000000,
    marketCap: 680000000000,
    sector: 'Banking',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever',
    price: 2850.50,
    change: 85.25,
    changePercent: 3.08,
    volume: 6500000,
    marketCap: 670000000000,
    sector: 'FMCG',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'ITC',
    name: 'ITC',
    price: 450.75,
    change: 35.50,
    changePercent: 8.54,
    volume: 25000000,
    marketCap: 570000000000,
    sector: 'FMCG',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    price: 650.25,
    change: 45.75,
    changePercent: 7.57,
    volume: 22000000,
    marketCap: 580000000000,
    sector: 'Banking',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel',
    price: 1150.50,
    change: 65.25,
    changePercent: 6.01,
    volume: 9500000,
    marketCap: 650000000000,
    sector: 'Telecom',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'AXISBANK',
    name: 'Axis Bank',
    price: 950.75,
    change: 55.50,
    changePercent: 6.20,
    volume: 12000000,
    marketCap: 290000000000,
    sector: 'Banking',
    timestamp: new Date().toISOString()
  }
];

// Function to generate realistic mock data with some randomness
function generateMockGainersData(limit = 10) {
  const baseData = [...mockGainersData];
  
  // Add some randomness to make it look more realistic
  baseData.forEach(stock => {
    const randomChange = Math.random() * 50 + 25; // Random change between 25 and 75
    const randomPercent = Math.random() * 3 + 2; // Random percent between 2% and 5%
    
    stock.change = randomChange;
    stock.changePercent = randomPercent;
    stock.price += randomChange;
    stock.timestamp = new Date().toISOString();
  });
  
  // Sort by change percent and return limited results
  return baseData
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, limit);
}

// Real API integration (uncomment and configure when you have API keys)
async function fetchFromRealAPI(limit = 10) {
  try {
    // Example using Alpha Vantage API (you'll need to sign up for a free API key)
    // const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    // const response = await axios.get(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`);
    
    // For now, return mock data
    return generateMockGainersData(limit);
  } catch (error) {
    console.error('Error fetching from real API:', error);
    // Fallback to mock data
    return generateMockGainersData(limit);
  }
}

// Main function to fetch gainers data
async function fetchGainers(limit = 10) {
  try {
    // Check if we have API keys configured
    if (process.env.ALPHA_VANTAGE_API_KEY) {
      return await fetchFromRealAPI(limit);
    } else {
      // Use mock data for development
      console.log('Using mock data for gainers (configure API keys for real data)');
      return generateMockGainersData(limit);
    }
  } catch (error) {
    console.error('Error in fetchGainers:', error);
    return generateMockGainersData(limit);
  }
}

module.exports = {
  fetchGainers
}; 