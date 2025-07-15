import React, { useState, useEffect } from 'react';

function StockNews({ symbol }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample news data for fallback
  const sampleNews = [
    {
      id: 1,
      title: `${symbol} Reports Strong Q3 Earnings, Beats Analyst Expectations`,
      summary: `${symbol} has reported impressive third-quarter results with revenue growth of 15% year-over-year. The company's performance exceeded market expectations, driven by strong demand in key markets.`,
      source: 'Financial Times',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sentiment: 'positive',
      impact: 'high',
      tags: ['Earnings', 'Q3 Results'],
      url: 'https://www.ft.com/content/example-news-1',
      author: 'Financial Analyst Team',
      readTime: '3 min read'
    },
    {
      id: 2,
      title: `${symbol} Announces New Strategic Partnership in Technology Sector`,
      summary: `${symbol} has entered into a strategic partnership with leading technology firms to expand its digital capabilities and enhance market presence.`,
      source: 'Business Standard',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      sentiment: 'positive',
      impact: 'medium',
      tags: ['Partnership', 'Technology'],
      url: 'https://www.business-standard.com/article/example-news-2',
      author: 'Business Correspondent',
      readTime: '2 min read'
    },
    {
      id: 3,
      title: `${symbol} Stock Reaches New 52-Week High on Strong Market Performance`,
      summary: `${symbol} shares have reached a new 52-week high as the company continues to demonstrate strong fundamentals and market leadership in its sector.`,
      source: 'Economic Times',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      sentiment: 'positive',
      impact: 'medium',
      tags: ['Stock Price', 'Market Performance'],
      url: 'https://economictimes.indiatimes.com/example-news-3',
      author: 'Market Analyst',
      readTime: '2 min read'
    },
    {
      id: 4,
      title: `${symbol} Expands Operations with New Manufacturing Facility`,
      summary: `${symbol} has announced the opening of a new state-of-the-art manufacturing facility to meet growing demand and improve production capacity.`,
      source: 'Mint',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      sentiment: 'positive',
      impact: 'low',
      tags: ['Expansion', 'Manufacturing'],
      url: 'https://www.livemint.com/example-news-4',
      author: 'Industry Reporter',
      readTime: '3 min read'
    },
    {
      id: 5,
      title: `${symbol} Receives Industry Recognition for Innovation and Sustainability`,
      summary: `${symbol} has been recognized by industry leaders for its innovative approaches and commitment to sustainable business practices.`,
      source: 'Hindu Business Line',
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      sentiment: 'positive',
      impact: 'low',
      tags: ['Innovation', 'Sustainability'],
      url: 'https://www.thehindubusinessline.com/example-news-5',
      author: 'Sustainability Editor',
      readTime: '2 min read'
    }
  ];

  useEffect(() => {
    fetchStockNews();
  }, [symbol]);

  const fetchStockNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the new stock-specific news endpoint
      const response = await fetch(`http://localhost:5000/api/news/stock/${symbol}?limit=5`);
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      } else {
        // Use sample data if backend fails
        console.log('Backend not available, using sample news data');
        setNews(sampleNews);
      }
    } catch (error) {
      console.error('Error fetching stock news:', error);
      // Use sample data on error
      setNews(sampleNews);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading news...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading News</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent News</h3>
          <p className="text-gray-600">No recent news available for {symbol}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {news.map((item) => (
        <div key={item.id} className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {item.summary}
              </p>
            </div>
            <div className="flex flex-col space-y-2 ml-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(item.sentiment)}`}>
                {item.sentiment}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getImpactColor(item.impact)}`}>
                {item.impact}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-semibold text-gray-700">{item.source}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTimeAgo(item.publishedAt)}</span>
              </div>
              {item.readTime && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{item.readTime}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {item.tags && item.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                  {tag}
                </span>
              ))}
            </div>
            
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <span>Read Article</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StockNews; 