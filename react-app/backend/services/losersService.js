const axios = require('axios');

// Mock data for top losers
const mockLosersData = [
  {
    symbol: 'WIPRO',
    name: 'Wipro',
    price: 450.25,
    change: -35.75,
    changePercent: -7.36,
    volume: 18000000,
    marketCap: 250000000000,
    sector: 'IT',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'TECHM',
    name: 'Tech Mahindra',
    price: 1250.50,
    change: -85.25,
    changePercent: -6.38,
    volume: 9500000,
    marketCap: 120000000000,
    sector: 'IT',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'LT',
    name: 'Larsen & Toubro',
    price: 2850.75,
    change: -125.50,
    changePercent: -4.22,
    volume: 6500000,
    marketCap: 400000000000,
    sector: 'Engineering',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'MARUTI',
    name: 'Maruti Suzuki',
    price: 11500.25,
    change: -450.75,
    changePercent: -3.77,
    volume: 3500000,
    marketCap: 350000000000,
    sector: 'Automobile',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors',
    price: 850.50,
    change: -35.25,
    changePercent: -3.98,
    volume: 12000000,
    marketCap: 280000000000,
    sector: 'Automobile',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'NESTLEIND',
    name: 'Nestle India',
    price: 2250.75,
    change: -75.50,
    changePercent: -3.25,
    volume: 4500000,
    marketCap: 220000000000,
    sector: 'FMCG',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'POWERGRID',
    name: 'Power Grid Corporation',
    price: 250.25,
    change: -8.75,
    changePercent: -3.38,
    volume: 25000000,
    marketCap: 230000000000,
    sector: 'Power',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'ONGC',
    name: 'Oil & Natural Gas Corporation',
    price: 185.50,
    change: -6.25,
    changePercent: -3.26,
    volume: 30000000,
    marketCap: 230000000000,
    sector: 'Oil & Gas',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'COALINDIA',
    name: 'Coal India',
    price: 350.75,
    change: -12.50,
    changePercent: -3.44,
    volume: 18000000,
    marketCap: 220000000000,
    sector: 'Mining',
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'NTPC',
    name: 'NTPC',
    price: 285.25,
    change: -9.75,
    changePercent: -3.30,
    volume: 20000000,
    marketCap: 280000000000,
    sector: 'Power',
    timestamp: new Date().toISOString()
  }
];

// Function to generate realistic mock data with some randomness
function generateMockLosersData(limit = 10) {
  const baseData = [...mockLosersData];
  
  // Add some randomness to make it look more realistic
  baseData.forEach(stock => {
    const randomChange = -(Math.random() * 50 + 25); // Random negative change between -25 and -75
    const randomPercent = -(Math.random() * 3 + 2); // Random negative percent between -2% and -5%
    
    stock.change = randomChange;
    stock.changePercent = randomPercent;
    stock.price += randomChange;
    stock.timestamp = new Date().toISOString();
  });
  
  // Sort by change percent (most negative first) and return limited results
  return baseData
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, limit);
}

// Real API integration (uncomment and configure when you have API keys)
async function fetchFromRealAPI(limit = 10) {
  try {
    // Example using Alpha Vantage API (you'll need to sign up for a free API key)
    // const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    // const response = await axios.get(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`);
    
    // For now, return mock data
    return generateMockLosersData(limit);
  } catch (error) {
    console.error('Error fetching from real API:', error);
    // Fallback to mock data
    return generateMockLosersData(limit);
  }
}

// Main function to fetch losers data
async function fetchLosers(limit = 10) {
  try {
    // Check if we have API keys configured
    if (process.env.ALPHA_VANTAGE_API_KEY) {
      return await fetchFromRealAPI(limit);
    } else {
      // Use mock data for development
      console.log('Using mock data for losers (configure API keys for real data)');
      return generateMockLosersData(limit);
    }
  } catch (error) {
    console.error('Error in fetchLosers:', error);
    return generateMockLosersData(limit);
  }
}

module.exports = {
  fetchLosers
}; 