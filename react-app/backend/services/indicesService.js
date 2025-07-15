const axios = require('axios');

// Function to generate realistic mock data with some randomness
function generateMockIndicesData() {
  // Base values for indices
  const baseIndices = {
    nifty50: { base: 19500, volatility: 0.02 },
    sensex: { base: 64500, volatility: 0.02 },
    bankNifty: { base: 44500, volatility: 0.03 }
  };

  const indices = {};
  Object.keys(baseIndices).forEach(key => {
    const base = baseIndices[key];
    const changePercent = (Math.random() - 0.5) * base.volatility * 2; // -volatility to +volatility
    const change = (base.base * changePercent) / 100;
    const newValue = base.base + change;
    
    indices[key] = {
      value: parseFloat(newValue.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      trend: changePercent >= 0 ? 'up' : 'down',
      timestamp: new Date().toISOString()
    };
  });
  
  return indices;
}

// Real API integration (uncomment and configure when you have API keys)
async function fetchFromRealAPI() {
  try {
    // Example using Alpha Vantage API (you'll need to sign up for a free API key)
    // const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    // const niftyResponse = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=^NSEI&apikey=${apiKey}`);
    // const sensexResponse = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=^BSESN&apikey=${apiKey}`);
    // const bankNiftyResponse = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=^NSEBANK&apikey=${apiKey}`);
    
    // For now, return mock data
    return generateMockIndicesData();
  } catch (error) {
    console.error('Error fetching from real API:', error);
    // Fallback to mock data
    return generateMockIndicesData();
  }
}

// Main function to fetch indices data
async function fetchIndices() {
  try {
    // Check if we have API keys configured
    if (process.env.ALPHA_VANTAGE_API_KEY) {
      return await fetchFromRealAPI();
    } else {
      // Use mock data for development
      console.log('Using mock data for indices (configure API keys for real data)');
      return generateMockIndicesData();
    }
  } catch (error) {
    console.error('Error in fetchIndices:', error);
    return generateMockIndicesData();
  }
}

// Function to fetch specific index
async function fetchSpecificIndex(indexName) {
  try {
    const allIndices = await fetchIndices();
    const index = allIndices[indexName.toLowerCase()];
    
    if (!index) {
      throw new Error(`Index ${indexName} not found`);
    }
    
    return index;
  } catch (error) {
    console.error(`Error fetching ${indexName}:`, error);
    throw error;
  }
}

module.exports = {
  fetchIndices,
  fetchSpecificIndex
}; 