import React, { useState, useEffect } from 'react';

function LivePriceTicker({ portfolio, formatCurrency, onRefresh }) {
  const [tickerData, setTickerData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (portfolio.length > 0) {
      setTickerData(portfolio.map(stock => ({
        ...stock,
        animationDelay: Math.random() * 2 // Random delay for animation
      })));
      setLastUpdated(new Date());
    }
  }, [portfolio]);

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  if (tickerData.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Live Price Ticker
            </h3>
            <p className="text-sm text-gray-600">Real-time stock price updates</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">Live</span>
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 text-xs font-medium shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <svg className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-hidden">
        <div className="flex space-x-6 animate-scroll">
          {tickerData.map((stock, index) => (
            <div
              key={stock.symbol}
              className="flex-shrink-0 flex items-center space-x-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-6 py-4 min-w-max border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              style={{ animationDelay: `${stock.animationDelay}s` }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{stock.symbol.charAt(0)}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-sm truncate">{stock.symbol}</div>
                <div className="text-xs text-gray-600 truncate max-w-24">{stock.name}</div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-lg text-gray-900">
                  {formatCurrency(stock.currentPrice)}
                </div>
                <div className={`text-sm font-semibold flex items-center space-x-1 ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.changePercent >= 0 ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  <span>
                    {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
                  </span>
                  <span className="text-xs">
                    ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              
              <div className={`w-3 h-3 rounded-full ${stock.changePercent >= 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse shadow-lg`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LivePriceTicker; 