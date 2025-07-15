import React, { useState, useEffect } from 'react';
import MarketIndices from './components/MarketIndices';

function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);

  // Fetch news from backend API
  useEffect(() => {
    fetchNews();
    fetchGainers();
    fetchLosers();
    // Refresh news every 5 minutes
    const interval = setInterval(() => {
      fetchNews();
      fetchGainers();
      fetchLosers();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/news?limit=6');
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      } else {
        throw new Error('Failed to fetch news');
      }
    } catch (error) {
      setError('Failed to load news. Using sample data.');
      setNews(getSampleNews());
    } finally {
      setLoading(false);
    }
  };

  const fetchGainers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/gainers?limit=5');
      if (response.ok) {
        const data = await response.json();
        setGainers(data);
      } else {
        setGainers([]);
      }
    } catch (error) {
      setGainers([]);
    }
  };

  const fetchLosers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/losers?limit=5');
      if (response.ok) {
        const data = await response.json();
        setLosers(data);
      } else {
        setLosers([]);
      }
    } catch (error) {
      setLosers([]);
    }
  };

  // Sample news data as fallback
  const getSampleNews = () => [
    {
      id: 1,
      title: "Reliance Industries Reports Strong Q3 Results with 15% Revenue Growth",
      summary: "Reliance Industries posted better-than-expected quarterly results with revenue growth of 15% year-over-year.",
      source: "Economic Times",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive",
      url: "#",
      category: "Earnings",
      impact: "High",
      relatedStocks: ["RELIANCE", "RIL"]
    },
    {
      id: 2,
      title: "TCS Announces Major Digital Transformation Deal with European Bank",
      summary: "Tata Consultancy Services secures a $500 million digital transformation deal with a European bank.",
      source: "Business Standard",
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive",
      url: "#",
      category: "Deals",
      impact: "Medium",
      relatedStocks: ["TCS"]
    },
    {
      id: 3,
      title: "HDFC Bank Faces Regulatory Scrutiny Over Digital Banking Practices",
      summary: "RBI raises concerns over HDFC Bank's digital banking services, asks for compliance report.",
      source: "Financial Express",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      sentiment: "negative",
      url: "#",
      category: "Regulatory",
      impact: "High",
      relatedStocks: ["HDFCBANK", "HDFC"]
    },
    {
      id: 4,
      title: "Sun Pharma Launches New Cancer Treatment Drug in Indian Market",
      summary: "Sun Pharmaceutical Industries launches breakthrough cancer treatment drug in Indian market.",
      source: "Mint",
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive",
      url: "#",
      category: "Product Launch",
      impact: "Medium",
      relatedStocks: ["SUNPHARMA"]
    },
    {
      id: 5,
      title: "IT Sector Shows Mixed Results as Global Tech Spending Slows",
      summary: "Indian IT companies show mixed quarterly results as global technology spending slows down.",
      source: "Business Today",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      sentiment: "neutral",
      url: "#",
      category: "Sector Analysis",
      impact: "Medium",
      relatedStocks: ["TCS", "INFY", "WIPRO"]
    },
    {
      id: 6,
      title: "Nifty 50 Hits New All-Time High as Banking Stocks Rally",
      summary: "Nifty 50 index reaches new all-time high driven by strong performance in banking sector stocks.",
      source: "Moneycontrol",
      publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive",
      url: "#",
      category: "Market Update",
      impact: "High",
      relatedStocks: ["NIFTY50", "BANKNIFTY"]
    }
  ];

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInMinutes = Math.floor((now - published) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Earnings': 'bg-blue-100 text-blue-800 border-blue-200',
      'Deals': 'bg-green-100 text-green-800 border-green-200',
      'Regulatory': 'bg-red-100 text-red-800 border-red-200',
      'Product Launch': 'bg-purple-100 text-purple-800 border-purple-200',
      'Sector Analysis': 'bg-orange-100 text-orange-800 border-orange-200',
      'Market Update': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'company': 'bg-blue-100 text-blue-800 border-blue-200',
      'competitor': 'bg-orange-100 text-orange-800 border-orange-200',
      'supplier': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getImpactColor = (impact) => {
    const colors = {
      'High': 'bg-red-100 text-red-700 border-red-200',
      'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Low': 'bg-green-100 text-green-700 border-green-200',
      'high': 'bg-red-100 text-red-700 border-red-200',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'low': 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[impact] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Stocklyzer</h1>
      <p className="text-xl text-gray-600 mb-8">Your comprehensive stock analysis platform</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">Market Overview</h3>
          <p className="text-gray-600">Get real-time market data and insights</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-green-600 mb-2">Portfolio Management</h3>
          <p className="text-gray-600">Track and manage your stock investments</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-purple-600 mb-2">Analytics</h3>
          <p className="text-gray-600">Advanced charts and analysis tools</p>
        </div>
      </div>

      {/* Live Market Indices */}
      <MarketIndices />

      {/* News Section */}
      <div className="flex-1 min-w-0 mb-8">
        {/* Enhanced News Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-white">Latest Market News</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100 text-sm font-medium">LIVE</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-100 text-sm">Last Updated:</span>
                <span className="text-white text-sm font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading latest news...</span>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <div className="text-yellow-600 text-sm mb-2">⚠️ {error}</div>
              </div>
            ) : null}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map((item, idx) => (
                <div key={item.id || idx} className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-5 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getImpactColor(item.impact)}`}>
                        {item.impact} Impact
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      item.sentiment === 'positive' ? 'bg-green-100 text-green-700 border-green-200' : 
                      item.sentiment === 'negative' ? 'bg-red-100 text-red-700 border-red-200' : 
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {item.sentiment}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-3 line-clamp-3">
                    <a href={item.url} className="hover:text-blue-600 transition-colors">
                      {item.title}
                    </a>
                  </h3>
                  {item.summary && (
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                      {item.summary}
                    </p>
                  )}
                  {item.relatedStocks && item.relatedStocks.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {item.relatedStocks.map((stock, stockIdx) => (
                          <span key={stockIdx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
                            {stock}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">{item.source}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">{formatTimeAgo(item.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button 
                onClick={fetchNews}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                {loading ? 'Refreshing...' : 'Refresh News'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gainers and Losers Tables Below News */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Gainers */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold text-green-700 mb-4">Top Gainers</h2>
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1">Symbol</th>
                <th className="px-2 py-1">Price</th>
                <th className="px-2 py-1">% Chg</th>
              </tr>
            </thead>
            <tbody>
              {gainers.map((stock) => (
                <tr key={stock.symbol} className="hover:bg-green-50">
                  <td className="px-2 py-1 font-semibold">{stock.symbol}</td>
                  <td className="px-2 py-1">₹{stock.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="px-2 py-1 text-green-700">+{stock.changePercent?.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Top Losers */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold text-red-700 mb-4">Top Losers</h2>
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1">Symbol</th>
                <th className="px-2 py-1">Price</th>
                <th className="px-2 py-1">% Chg</th>
              </tr>
            </thead>
            <tbody>
              {losers.map((stock) => (
                <tr key={stock.symbol} className="hover:bg-red-50">
                  <td className="px-2 py-1 font-semibold">{stock.symbol}</td>
                  <td className="px-2 py-1">₹{stock.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="px-2 py-1 text-red-700">{stock.changePercent?.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home; 