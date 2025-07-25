import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StockChart from './components/StockChart';

const sectors = ['All Sectors', 'IT', 'Banking', 'Pharma', 'FMCG', 'Oil & Gas', 'Industrial', 'Telecom', 'Auto', 'Finance'];
const sentiments = ['all', 'positive', 'negative', 'neutral'];
const priceCategories = [
  { value: 'all', label: 'All Prices' },
  { value: 'low', label: 'Under ₹1000' },
  { value: 'medium', label: '₹1000 - ₹5000' },
  { value: 'high', label: 'Above ₹5000' }
];

function Portfolio() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sector, setSector] = useState('all');
  const [sentiment, setSentiment] = useState('all');
  const [priceCategory, setPriceCategory] = useState('all');
  const [buyModal, setBuyModal] = useState({ show: false, stock: null, quantity: 1 });
  const [chartModal, setChartModal] = useState({ show: false, stock: null, period: 'daily' });
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [portfolioMetrics, setPortfolioMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [topN, setTopN] = useState(null); // null = default, else N
  const [topNLoading, setTopNLoading] = useState(false);
  const [viewMode, setViewMode] = useState('portfolio'); // 'portfolio' or 'top50'
  const [userPortfolio, setUserPortfolio] = useState([]); // user's actual portfolio for cross-reference
  const navigate = useNavigate();

  // Fetch real-time stock data
  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        console.log(' Portfolio data received:', data);
        setStocks(data.companies || data);
        setLastUpdated(new Date());
      } else {
        console.error('Failed to fetch portfolio');
        setStocks([]);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch top N companies
  const fetchTopN = async (n) => {
    setTopNLoading(true);
    setError(null);
    setTopN(n);
    try {
      const response = await fetch(`http://localhost:5000/api/portfolio/top?n=${n}`);
      if (response.ok) {
        const data = await response.json();
        setStocks(data);
        setLastUpdated(new Date());
      } else {
        setError('Failed to fetch top companies');
      }
    } catch (error) {
      setError('Error fetching top companies');
    } finally {
      setTopNLoading(false);
    }
  };

  // Fetch user's portfolio for cross-reference
  const fetchUserPortfolio = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setUserPortfolio(data.companies || []);
      } else {
        setUserPortfolio([]);
      }
    } catch {
      setUserPortfolio([]);
    }
  };

  // Calculate fallback metrics
  const calculateFallbackMetrics = () => {
    const fallbackStocks = getFallbackStocks();
    const totalValue = fallbackStocks.reduce((sum, stock) => sum + (stock.currentPrice || 0), 0);
    const totalChange = fallbackStocks.reduce((sum, stock) => sum + (stock.change || 0), 0);
    const totalProfitLoss = fallbackStocks.reduce((sum, stock) => sum + (stock.profitLoss || 0), 0);
    
    return {
      totalValue: totalValue,
      totalChange: totalChange,
      totalChangePercent: totalValue > 0 ? (totalChange / totalValue) * 100 : 0,
      activePositions: fallbackStocks.length,
      totalProfitLoss: totalProfitLoss,
      totalProfitLossPercent: totalValue > 0 ? (totalProfitLoss / totalValue) * 100 : 0
    };
  };

  // Stock sector mapping
  const getStockSector = (symbol) => {
    const sectors = {
      'RELIANCE': 'Oil & Gas',
      'TCS': 'IT',
      'HDFCBANK': 'Banking',
      'INFY': 'IT',
      'SUNPHARMA': 'Pharma',
      'LT': 'Industrial',
      'ITC': 'FMCG',
      'BHARTIARTL': 'Telecom',
      'ICICIBANK': 'Banking',
      'DRREDDY': 'Pharma',
      'HINDUNILVR': 'FMCG',
      'WIPRO': 'IT',
      'AXISBANK': 'Banking',
      'CIPLA': 'Pharma',
      'MARUTI': 'Auto',
      'TATAMOTORS': 'Auto',
      'ASIANPAINT': 'Industrial',
      'NESTLEIND': 'FMCG',
      'BAJFINANCE': 'Finance',
      'SBIN': 'Banking'
    };
    return sectors[symbol] || 'Unknown';
  };

  // Stock name mapping
  const getStockName = (symbol) => {
    const names = {
      'RELIANCE': 'Reliance Industries Ltd',
      'TCS': 'Tata Consultancy Services Ltd',
      'HDFCBANK': 'HDFC Bank Ltd',
      'INFY': 'Infosys Ltd',
      'SUNPHARMA': 'Sun Pharmaceutical Industries Ltd',
      'LT': 'Larsen & Toubro Ltd',
      'ITC': 'ITC Ltd',
      'BHARTIARTL': 'Bharti Airtel Ltd',
      'ICICIBANK': 'ICICI Bank Ltd',
      'DRREDDY': 'Dr. Reddy\'s Laboratories Ltd',
      'HINDUNILVR': 'Hindustan Unilever Ltd',
      'WIPRO': 'Wipro Ltd',
      'AXISBANK': 'Axis Bank Ltd',
      'CIPLA': 'Cipla Ltd',
      'MARUTI': 'Maruti Suzuki India Ltd',
      'TATAMOTORS': 'Tata Motors Ltd',
      'ASIANPAINT': 'Asian Paints Ltd',
      'NESTLEIND': 'Nestle India Ltd',
      'BAJFINANCE': 'Bajaj Finance Ltd',
      'SBIN': 'State Bank of India'
    };
    return names[symbol] || symbol;
  };

  // Fallback stock data if API is not available
  const getFallbackStocks = () => {
    return [
      { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Oil & Gas', currentPrice: 2450.50, openPrice: 2440.00, closePrice: 2430.00, change: 20.50, changePercent: 0.84, profitLoss: 150.25, profitLossPercent: 6.52, sentiment: 'positive', shares: 100, avgPrice: 2300.25, currentValue: 245050, costValue: 230025 },
      { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', sector: 'IT', currentPrice: 3850.75, openPrice: 3840.00, closePrice: 3830.00, change: 20.75, changePercent: 0.54, profitLoss: 200.50, profitLossPercent: 5.49, sentiment: 'positive', shares: 50, avgPrice: 3650.25, currentValue: 192537.5, costValue: 182512.5 },
      { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking', currentPrice: 1650.25, openPrice: 1645.00, closePrice: 1640.00, change: 10.25, changePercent: 0.62, profitLoss: 85.30, profitLossPercent: 5.45, sentiment: 'positive', shares: 200, avgPrice: 1564.95, currentValue: 330050, costValue: 312990 },
      { symbol: 'INFY', name: 'Infosys Ltd', sector: 'IT', currentPrice: 1450.80, openPrice: 1445.00, closePrice: 1440.00, change: 10.80, changePercent: 0.75, profitLoss: 75.20, profitLossPercent: 5.47, sentiment: 'positive', shares: 150, avgPrice: 1375.60, currentValue: 217620, costValue: 206340 },
      { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Banking', currentPrice: 950.20, openPrice: 945.00, closePrice: 940.00, change: 10.20, changePercent: 1.09, profitLoss: 55.10, profitLossPercent: 6.15, sentiment: 'positive', shares: 300, avgPrice: 895.10, currentValue: 285060, costValue: 268530 },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'FMCG', currentPrice: 2600.70, openPrice: 2595.00, closePrice: 2590.00, change: 10.70, changePercent: 0.41, profitLoss: 95.40, profitLossPercent: 3.81, sentiment: 'positive', shares: 75, avgPrice: 2505.30, currentValue: 195052.5, costValue: 187897.5 },
      { symbol: 'ITC', name: 'ITC Ltd', sector: 'FMCG', currentPrice: 425.60, openPrice: 424.00, closePrice: 422.00, change: 3.60, changePercent: 0.85, profitLoss: 25.30, profitLossPercent: 6.32, sentiment: 'positive', shares: 500, avgPrice: 400.30, currentValue: 212800, costValue: 200150 },
      { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', currentPrice: 650.40, openPrice: 645.00, closePrice: 640.00, change: 10.40, changePercent: 1.62, profitLoss: 50.40, profitLossPercent: 8.40, sentiment: 'positive', shares: 1000, avgPrice: 600.00, currentValue: 650400, costValue: 600000 },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecom', currentPrice: 850.40, openPrice: 845.00, closePrice: 840.00, change: 10.40, changePercent: 1.24, profitLoss: 45.20, profitLossPercent: 5.62, sentiment: 'positive', shares: 200, avgPrice: 805.20, currentValue: 170080, costValue: 161040 },
      { symbol: 'AXISBANK', name: 'Axis Bank Ltd', sector: 'Banking', currentPrice: 950.80, openPrice: 945.00, closePrice: 940.00, change: 10.80, changePercent: 1.15, profitLoss: 65.30, profitLossPercent: 7.37, sentiment: 'positive', shares: 400, avgPrice: 885.50, currentValue: 380320, costValue: 354200 }
    ];
  };

  // Fallback sector lookup
  const sectorLookup = {
    'RELIANCE': 'Oil & Gas',
    'TCS': 'IT',
    'HDFCBANK': 'Banking',
    'INFY': 'IT',
    'ICICIBANK': 'Banking',
    'HINDUNILVR': 'FMCG',
    'ITC': 'FMCG',
    'SBIN': 'Banking',
    'BHARTIARTL': 'Telecom',
    'AXISBANK': 'Banking',
    'SUNPHARMA': 'Pharma',
    'BAJFINANCE': 'Finance',
    'ASIANPAINT': 'Industrial',
    'MARUTI': 'Auto',
    'KOTAKBANK': 'Banking',
    'LT': 'Industrial',
    'ULTRACEMCO': 'Cement',
    'TITAN': 'Consumer',
    'WIPRO': 'IT',
    'POWERGRID': 'Utilities',
    'HCLTECH': 'IT',
    'HCL': 'IT',
    'NTPC': 'Utilities',
    'TATAMOTORS': 'Auto',
    'ONGC': 'Oil & Gas',
    'ADANIGREEN': 'Energy',
    'ADANIPORTS': 'Ports',
    'ADANIPOWER': 'Energy',
    'ADANITRANS': 'Energy',
    'DIVISLAB': 'Pharma',
    'GRASIM': 'Cement',
    'JSWSTEEL': 'Steel',
    'M&M': 'Auto',
    'NESTLEIND': 'FMCG',
    'TATASTEEL': 'Steel',
    'TECHM': 'IT',
    'UPL': 'Agrochem',
    'BRITANNIA': 'FMCG',
    'CIPLA': 'Pharma',
    'COALINDIA': 'Mining',
    'EICHERMOT': 'Auto',
    'HEROMOTOCO': 'Auto',
    'HDFCLIFE': 'Insurance',
    'INDUSINDBK': 'Banking',
    'IOC': 'Oil & Gas',
    'JSWENERGY': 'Energy',
    'PIDILITIND': 'Chemicals',
    'SHREECEM': 'Cement',
    'SIEMENS': 'Industrial',
    'TATACONSUM': 'FMCG',
    'TORNTPHARM': 'Pharma'
  };

  // Fetch data based on viewMode
  const fetchData = async () => {
    if (viewMode === 'portfolio') {
      await fetchPortfolio();
    } else {
      await fetchTopN(50);
      await fetchUserPortfolio(); // always update user portfolio for cross-reference
    }
  };

  // Fetch initial data and set up real-time updates
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [viewMode]);

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch =
      (stock.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (stock.symbol?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const getSector = (stock) => stock.sector || sectorLookup[(stock.symbol || '').trim().toUpperCase()] || 'Unknown';
    const matchesSector = sector === 'all' || getSector(stock) === sector;
    const matchesSentiment = sentiment === 'all' || stock.sentiment === sentiment;
    
    let matchesPrice = true;
    if (priceCategory === 'low') matchesPrice = stock.currentPrice < 1000;
    else if (priceCategory === 'medium') matchesPrice = stock.currentPrice >= 1000 && stock.currentPrice <= 5000;
    else if (priceCategory === 'high') matchesPrice = stock.currentPrice > 5000;
    
    return matchesSearch && matchesSector && matchesSentiment && matchesPrice;
  });

  // Calculate portfolio summary
  const portfolioSummary = portfolioMetrics ? {
    totalValue: portfolioMetrics.totalValue || 0,
    totalChange: portfolioMetrics.todayChange || 0,
    totalChangePercent: portfolioMetrics.todayChangePercent || 0,
    activePositions: portfolioMetrics.activePositions || 0,
    totalProfitLoss: portfolioMetrics.totalProfitLoss || 0,
    totalProfitLossPercent: portfolioMetrics.totalProfitLossPercent || 0
  } : {
    totalValue: stocks.reduce((sum, stock) => sum + (stock.currentValue || 0), 0),
    totalChange: stocks.reduce((sum, stock) => sum + (stock.change || 0), 0),
    totalChangePercent: stocks.length > 0 ? (stocks.reduce((sum, stock) => sum + (stock.change || 0), 0) / Math.max(stocks.reduce((sum, stock) => sum + (stock.closePrice || 0), 0), 1)) * 100 : 0,
    activePositions: stocks.length,
    totalProfitLoss: stocks.reduce((sum, stock) => sum + (stock.profitLoss || 0), 0),
    totalProfitLossPercent: stocks.length > 0 ? (stocks.reduce((sum, stock) => sum + (stock.profitLoss || 0), 0) / Math.max(stocks.reduce((sum, stock) => sum + (stock.costValue || 0), 0), 1)) * 100 : 0
  };

  // Calculate summary for Top 50 Companies
  const top50Summary = viewMode === 'top50' ? (() => {
    const totalValue = stocks.reduce((sum, stock) => sum + (stock.currentPrice || 0), 0);
    const totalPrevClose = stocks.reduce((sum, stock) => sum + (stock.previousClose || 0), 0);
    const totalPL = stocks.reduce((sum, stock) => sum + ((stock.currentPrice || 0) - (stock.previousClose || 0)), 0);
    const totalPLPercent = totalPrevClose > 0 ? (totalPL / totalPrevClose) * 100 : 0;
    const totalChange = stocks.reduce((sum, stock) => sum + ((stock.currentPrice || 0) - (stock.openPrice || 0)), 0);
    const totalOpen = stocks.reduce((sum, stock) => sum + (stock.openPrice || 0), 0);
    const totalChangePercent = totalOpen > 0 ? (totalChange / totalOpen) * 100 : 0;
    return {
      totalValue,
      totalPL,
      totalPLPercent,
      totalChange,
      totalChangePercent
    };
  })() : null;

  const handleBuyClick = (stock) => {
    setBuyModal({ show: true, stock, quantity: 1 });
  };

  const handleChartClick = (stock) => {
    setChartModal({ show: true, stock, period: 'daily' });
  };

  const handlePeriodChange = (period) => {
    setChartModal(prev => ({ ...prev, period }));
  };

  const handleQuantityChange = (e) => {
    setBuyModal(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }));
  };

  const handleBuyStock = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: buyModal.stock.symbol,
          quantity: buyModal.quantity,
          price: buyModal.stock.currentPrice
        })
      });

      if (response.ok) {
        // Redirect to Dashboard after successful purchase
        navigate('/dashboard');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to purchase stock: ${errorData.message || 'Server error. Please try again.'}`);
      }
    } catch (error) {
      console.error('Error purchasing stock:', error);
      alert('Network error. Please check if the backend server is running on http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0.00';
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const totalCost = buyModal.stock ? buyModal.stock.currentPrice * buyModal.quantity : 0;

  // New: Search for any stock by symbol
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setSearchError(null);
    setSearchResult(null);
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/portfolio/search/${searchTerm.trim().toUpperCase()}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
      } else {
        setSearchError('Stock not found.');
      }
    } catch (error) {
      setSearchError('Error searching for stock.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get user's avg price and P&L for a stock symbol (case-insensitive, trimmed)
  const getUserStockData = (symbol) => {
    const match = userPortfolio.find(s => (s.symbol || '').trim().toUpperCase() === (symbol || '').trim().toUpperCase());
    if (viewMode === 'top50') {
      // Debug: log matching attempts for Top 50
      if (symbol === 'TCS' || symbol === 'RELIANCE') {
        console.log('DEBUG: Matching symbol', symbol, 'with user portfolio:', userPortfolio);
        console.log('DEBUG: Matched user stock data:', match);
      }
    }
    return match;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Portfolio</h1>
        <div className="flex items-center space-x-2">
          <select
            value={viewMode}
            onChange={e => setViewMode(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="portfolio">My Portfolio</option>
            <option value="top50">Top 50 Companies</option>
          </select>
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by Company (e.g. RELIANCE)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">Search</button>
          </form>
        </div>
            </div>

      {/* Loading state for Top N */}
      {topNLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            <p className="text-gray-600">Loading top {topN} companies...</p>
          </div>
        </div>
      )}

      {/* Search Result */}
      {searchResult && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200 mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{searchResult.name || searchResult.symbol}</h3>
              <p className="text-sm text-gray-600">{searchResult.symbol}</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{searchResult.sector || '-'}</span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Current Price:</span>
              <span className="text-sm font-semibold text-gray-900">{formatCurrency(searchResult.currentPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Open Price:</span>
              <span className="text-sm">{formatCurrency(searchResult.openPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Previous Close:</span>
              <span className="text-sm">{formatCurrency(searchResult.previousClose)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Change:</span>
              <span className={`text-sm font-semibold ${searchResult.change > 0 ? 'text-green-600' : searchResult.change < 0 ? 'text-red-600' : 'text-gray-700'}`}>{searchResult.change} ({searchResult.changePercent?.toFixed(2)}%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Volume:</span>
              <span className="text-sm">{searchResult.volume?.toLocaleString()}</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => handleBuyClick(searchResult)}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Buy Stock
            </button>
            <button
              onClick={() => handleChartClick(searchResult)}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Chart
          </button>
        </div>
      </div>
      )}
      {searchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-6">{searchError}</div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && stocks.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading portfolio data...</p>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sector}
          onChange={e => setSector(e.target.value)}
          className="w-full md:w-1/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sectors.map(sec => <option key={sec} value={sec}>{sec}</option>)}
        </select>
        <select
          value={sentiment}
          onChange={e => setSentiment(e.target.value)}
          className="w-full md:w-1/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sentiments.map(sent => <option key={sent} value={sent}>{sent.charAt(0).toUpperCase() + sent.slice(1)}</option>)}
        </select>
        <select
          value={priceCategory}
          onChange={e => setPriceCategory(e.target.value)}
          className="w-full md:w-1/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {priceCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
        </select>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Value</h3>
          <p className="text-2xl font-bold text-blue-600">
            {viewMode === 'top50'
              ? formatCurrency(top50Summary.totalValue)
              : formatCurrency(portfolioSummary.totalValue)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Change</h3>
          <p className={`text-2xl font-bold ${viewMode === 'top50'
            ? (top50Summary.totalChange >= 0 ? 'text-green-600' : 'text-red-600')
            : (portfolioSummary.totalChangePercent >= 0 ? 'text-green-600' : 'text-red-600')}`}
          >
            {viewMode === 'top50'
              ? `${top50Summary.totalChange >= 0 ? '+' : ''}${formatCurrency(top50Summary.totalChange)} (${top50Summary.totalChangePercent >= 0 ? '+' : ''}${top50Summary.totalChangePercent.toFixed(2)}%)`
              : `${portfolioSummary.totalChange >= 0 ? '+' : ''}${formatCurrency(portfolioSummary.totalChange)} (${portfolioSummary.totalChangePercent >= 0 ? '+' : ''}${portfolioSummary.totalChangePercent.toFixed(2)}%)`}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total P&L</h3>
          <p className={`text-2xl font-bold ${viewMode === 'top50'
            ? (top50Summary.totalPL >= 0 ? 'text-green-600' : 'text-red-600')
            : (portfolioSummary.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600')}`}
          >
            {viewMode === 'top50'
              ? `${top50Summary.totalPL >= 0 ? '+' : ''}${formatCurrency(top50Summary.totalPL)} (${top50Summary.totalPLPercent >= 0 ? '+' : ''}${top50Summary.totalPLPercent.toFixed(2)}%)`
              : `${portfolioSummary.totalProfitLoss >= 0 ? '+' : ''}${formatCurrency(portfolioSummary.totalProfitLoss)} (${portfolioSummary.totalProfitLossPercent >= 0 ? '+' : ''}${portfolioSummary.totalProfitLossPercent.toFixed(2)}%)`}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Active Positions</h3>
          <p className="text-2xl font-bold text-purple-600">{portfolioSummary.activePositions}</p>
        </div>
      </div>

      {/* Data Source Indicator */}
      {!error && stocks.length > 0 && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg mb-6">
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span> Real-time data from Yahoo Finance API</span>
          </div>
        </div>
      )}

      {/* Stocks Grid */}
      {!loading && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStocks.map((stock) => (
          <div key={stock.symbol} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{stock.name}</h3>
                <p className="text-sm text-gray-600">{stock.symbol}</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {stock.sector || sectorLookup[(stock.symbol || '').trim().toUpperCase()] || 'Unknown'}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Current Price:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(stock.currentPrice)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Avg Price:</span>
                <span className="text-sm font-medium text-gray-700">
                  {viewMode === 'top50' ? (
                    typeof stock.previousClose === 'number'
                      ? formatCurrency(stock.previousClose)
                      : 'N/A'
                  ) : formatCurrency(stock.avgPrice)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Open Price:</span>
                <span className="text-sm font-medium text-gray-700">{formatCurrency(stock.openPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Close Price:</span>
                <span className="text-sm font-medium text-gray-700">{formatCurrency(stock.previousClose)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">P&L:</span>
                <span className={`text-sm font-semibold ${(() => {
                  if (viewMode === 'top50') {
                    const pnl = typeof stock.currentPrice === 'number' && typeof stock.previousClose === 'number'
                      ? stock.currentPrice - stock.previousClose
                      : null;
                    return pnl !== null && pnl > 0 ? 'text-green-600' : 'text-red-600';
                  } else {
                    return typeof stock.profitLossPercent === 'number' && stock.profitLossPercent > 0 ? 'text-green-600' : 'text-red-600';
                  }
                })()}`}>{viewMode === 'top50' ? (
                  (() => {
                    if (typeof stock.currentPrice === 'number' && typeof stock.previousClose === 'number') {
                      const pnl = stock.currentPrice - stock.previousClose;
                      const pnlPercent = stock.previousClose !== 0 ? (pnl / stock.previousClose) * 100 : 0;
                      return `${pnl > 0 ? '+' : ''}${formatCurrency(pnl)} (${pnlPercent > 0 ? '+' : ''}${pnlPercent.toFixed(2)}%)`;
                    }
                    return 'N/A';
                  })()
                ) : (
                  `${typeof stock.profitLoss === 'number' && stock.profitLoss > 0 ? '+' : ''}${formatCurrency(stock.profitLoss)}${typeof stock.profitLossPercent === 'number' ? ` (${stock.profitLossPercent > 0 ? '+' : ''}${stock.profitLossPercent.toFixed(2)}%)` : ''}`
                )}
                </span>
              </div>
            </div>

            {/* Change and P&L */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Today's Change:</span>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${typeof stock.changePercent === 'number' && stock.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {typeof stock.change === 'number' && stock.change > 0 ? '+' : ''}{formatCurrency(stock.change)} {typeof stock.changePercent === 'number' ? `(${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)` : ''}
                  </div>
                </div>
              </div>
              {/*
                NOTE: P&L and Avg Price will only show real values for stocks in your actual portfolio (from /api/portfolio).
                For top N companies (from /api/portfolio/top), these values may be 0.00 because there is no purchase data.
              */}
            </div>

            {/* Sentiment and Action */}
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded text-xs font-medium ${stock.sentiment === 'positive' ? 'bg-green-100 text-green-700' : stock.sentiment === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                {stock.sentiment}
              </span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleBuyClick(stock)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Buy Stock
                </button>
                <button 
                  onClick={() => handleChartClick(stock)}
                  className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Chart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {!loading && filteredStocks.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No stocks found matching your search.
        </div>
      )}

      {/* Buy Modal */}
      {buyModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Buy {buyModal.stock?.name}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Price</label>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(buyModal.stock?.currentPrice)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={buyModal.quantity}
                  onChange={handleQuantityChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Cost</label>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(totalCost)}</p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setBuyModal({ show: false, stock: null, quantity: 1 })}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleBuyStock}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Buy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chart Modal */}
      {chartModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Stock Chart - {chartModal.stock?.name}</h2>
              <button
                onClick={() => setChartModal({ show: false, stock: null, period: 'daily' })}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <div className="flex space-x-2">
                {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      chartModal.period === period
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-96">
              <StockChart symbol={chartModal.stock?.symbol} period={chartModal.period} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio; 