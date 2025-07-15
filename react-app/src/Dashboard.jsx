import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PortfolioSummary from './components/PortfolioSummary';
import StockCard from './components/StockCard';
import StockChart from './components/StockChart';
import StockNews from './components/StockNews';
import LivePriceTicker from './components/LivePriceTicker';

function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    totalChange: 0,
    totalChangePercent: 0,
    positions: 0
  });
  const [lastUpdate, setLastUpdate] = useState(null);
  const [analysisModal, setAnalysisModal] = useState({ show: false, stock: null, sentiment: null, impact: null, news: [] });
  const [portfolioSentiment, setPortfolioSentiment] = useState(null);
  const [portfolioImpact, setPortfolioImpact] = useState(null);

  // Sample data for testing
  const samplePortfolio = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      currentPrice: 2450.50,
      openPrice: 2440.00,
      previousClose: 2430.00,
      high: 2460.00,
      low: 2420.00,
      volume: 15000000,
      sector: 'Oil & Gas',
      change: 20.50,
      changePercent: 0.84,
      quantity: 100,
      avgPrice: 2400.00,
      currentValue: 245050.00,
      costValue: 240000.00,
      profitLoss: 5050.00,
      profitLossPercent: 2.10,
      lastUpdated: new Date()
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services Ltd',
      currentPrice: 3850.75,
      openPrice: 3840.00,
      previousClose: 3830.00,
      high: 3870.00,
      low: 3820.00,
      volume: 8000000,
      sector: 'IT',
      change: 20.75,
      changePercent: 0.54,
      quantity: 50,
      avgPrice: 3800.00,
      currentValue: 192537.50,
      costValue: 190000.00,
      profitLoss: 2537.50,
      profitLossPercent: 1.34,
      lastUpdated: new Date()
    }
  ];

  // Fetch portfolio data
  useEffect(() => {
    fetchPortfolio();
    // setupRealTimeUpdates(); // Commented out for now
  }, []);

  // Update portfolio stats when portfolio changes
  useEffect(() => {
    if (portfolio.length > 0) {
      const totalValue = portfolio.reduce((sum, stock) => sum + stock.currentValue, 0);
      const totalCost = portfolio.reduce((sum, stock) => sum + stock.costValue, 0);
      const totalChange = totalValue - totalCost;
      const totalChangePercent = totalCost > 0 ? (totalChange / totalCost) * 100 : 0;

      setPortfolioStats({
        totalValue,
        totalChange,
        totalChangePercent,
        positions: portfolio.length
      });
    }
  }, [portfolio]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data.companies);
        setPortfolioStats(data.metrics);
        if (data.companies.length > 0) {
          setSelectedStock(data.companies[0]);
        }
        setLastUpdate(new Date());
        await fetchPortfolioSentiment(data.companies);
      } else {
        // If backend fails, use sample data
        console.log('Backend not available, using sample data');
        setPortfolio(samplePortfolio);
        setPortfolioStats({
          totalValue: 0,
          totalChange: 0,
          totalChangePercent: 0,
          positions: samplePortfolio.length
        });
        setSelectedStock(samplePortfolio[0]);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      // Use sample data on error
      setPortfolio(samplePortfolio);
      setPortfolioStats({
        totalValue: 0,
        totalChange: 0,
        totalChangePercent: 0,
        positions: samplePortfolio.length
      });
      setSelectedStock(samplePortfolio[0]);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    try {
      const eventSource = new EventSource('http://localhost:5000/api/purchases/portfolio/stream');
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setPortfolio(data);
          setLastUpdate(new Date());
        } catch (error) {
          console.error('Error parsing real-time update:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        eventSource.close();
        // Retry connection after 5 seconds
        setTimeout(() => {
          setupRealTimeUpdates();
        }, 5000);
      };

      // Cleanup on component unmount
      return () => {
        eventSource.close();
      };
    } catch (error) {
      console.error('Error setting up real-time updates:', error);
    }
  };

  const handleRefresh = async () => {
    await fetchPortfolio();
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  const handlePeriodChange = (period) => {
    setChartPeriod(period);
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // Fetch sentiment/impact for the entire portfolio
  const fetchPortfolioSentiment = async (portfolioData) => {
    try {
      const symbols = portfolioData.map(stock => stock.symbol);
      const response = await fetch(`http://localhost:5000/api/news/portfolio/sentiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols })
      });
      if (response.ok) {
        const data = await response.json();
        setPortfolioSentiment(data.sentiment);
        setPortfolioImpact(data.impact);
      } else {
        setPortfolioSentiment(null);
        setPortfolioImpact(null);
      }
    } catch (error) {
      setPortfolioSentiment(null);
      setPortfolioImpact(null);
    }
  };

  // Fetch sentiment/impact for a single stock
  const handleAnalysisClick = async (stock) => {
    setAnalysisModal({ show: true, stock, sentiment: null, impact: null, news: [] });
    try {
      const response = await fetch(`http://localhost:5000/api/news/stock/${stock.symbol}/sentiment`);
      if (response.ok) {
        const data = await response.json();
        setAnalysisModal({ show: true, stock, sentiment: data.sentiment, impact: data.impact, news: data.news });
      } else {
        setAnalysisModal({ show: true, stock, sentiment: 'N/A', impact: 'N/A', news: [] });
      }
    } catch (error) {
      setAnalysisModal({ show: true, stock, sentiment: 'N/A', impact: 'N/A', news: [] });
    }
  };

  const handleCloseModal = () => {
    setAnalysisModal({ show: false, stock: null, sentiment: null, impact: null, news: [] });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Portfolio Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Real-time portfolio analytics and insights</p>
          </div>
          <div className="flex items-center space-x-4">
            {lastUpdate && (
              <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Last updated: {formatTime(lastUpdate)}</span>
                </div>
              </div>
            )}
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="mb-8">
          <PortfolioSummary stats={portfolioStats} formatCurrency={formatCurrency} />
        </div>

        {/* Live Price Ticker */}
        <div className="mb-8">
          <LivePriceTicker portfolio={portfolio} formatCurrency={formatCurrency} />
        </div>

        {/* Portfolio-wide Sentiment/Impact Cards */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-700 font-semibold text-lg">Portfolio Sentiment</div>
                  <div className="text-3xl font-bold text-green-600 mt-2">{portfolioSentiment || 'N/A'}</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-700 font-semibold text-lg">Portfolio Impact</div>
                  <div className="text-3xl font-bold text-purple-600 mt-2">{portfolioImpact || 'N/A'}</div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Portfolio Holdings</h2>
            <p className="text-gray-600 text-sm mt-1">Live prices and real-time analytics</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sector</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Live Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Change</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Latest Value</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Invested Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Day's Gain %</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Overall Gain %</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sentiment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Impact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Analysis</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {portfolio.map((stock, idx) => (
                  <tr key={stock.symbol} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                          {stock.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{stock.name || stock.symbol}</div>
                          <div className="text-sm text-gray-500">{stock.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {stock.sector || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(stock.currentPrice)}</td>
                    <td className={`px-6 py-4 font-medium ${stock.change > 0 ? 'text-green-600' : stock.change < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                      <div className="flex items-center space-x-1">
                        {stock.change > 0 ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        ) : stock.change < 0 ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        ) : null}
                        <span>{stock.change > 0 ? '+' : ''}{formatCurrency(stock.change)}</span>
                        <span className="text-sm">({stock.changePercent > 0 ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{stock.quantity}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(stock.currentValue)}</td>
                    <td className="px-6 py-4 text-gray-700">{formatCurrency(stock.costValue)}</td>
                    <td className={`px-6 py-4 font-medium ${stock.changePercent > 0 ? 'text-green-600' : stock.changePercent < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                      {(stock.changePercent || 0).toFixed(2)}%
                    </td>
                    <td className={`px-6 py-4 font-medium ${stock.profitLossPercent > 0 ? 'text-green-600' : stock.profitLossPercent < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                      {(stock.profitLossPercent || 0).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        stock.sentiment === 'positive' ? 'bg-green-100 text-green-800 border border-green-200' : 
                        stock.sentiment === 'negative' ? 'bg-red-100 text-red-800 border border-red-200' : 
                        'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {stock.sentiment || 'neutral'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        stock.impact === 'high' ? 'bg-red-100 text-red-800 border border-red-200' : 
                        stock.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                        'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {stock.impact || 'low'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={() => handleAnalysisClick(stock)}
                      >
                        Analysis
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analysis Modal */}
        {analysisModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Analysis - {analysisModal.stock?.name || analysisModal.stock?.symbol}</h2>
                  <button onClick={handleCloseModal} className="text-white hover:text-gray-200 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <div className="text-gray-700 font-semibold mb-2">Sentiment</div>
                    <div className="text-2xl font-bold text-green-600">{analysisModal.sentiment || 'N/A'}</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                    <div className="text-gray-700 font-semibold mb-2">Impact</div>
                    <div className="text-2xl font-bold text-purple-600">{analysisModal.impact || 'N/A'}</div>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent News Headlines</h3>
                  <div className="space-y-3">
                    {analysisModal.news.map((news, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                        <a
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-700 underline mb-1 block hover:text-blue-900"
                        >
                          {news.title}
                        </a>
                        <div className="text-sm text-gray-600 mb-2">{news.summary.replace(/<[^>]+>/g, '')}</div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            news.sentiment === 'positive' ? 'bg-green-100 text-green-700' : 
                            news.sentiment === 'negative' ? 'bg-red-100 text-red-700' : 
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {news.sentiment || 'neutral'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            news.impact === 'high' ? 'bg-red-100 text-red-700' : 
                            news.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {news.impact || 'low'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={handleCloseModal} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard; 