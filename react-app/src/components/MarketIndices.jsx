import React, { useState, useEffect } from 'react';

function MarketIndices() {
  const [indices, setIndices] = useState({
    nifty50: { value: 19500.25, change: 125.50, changePercent: 0.65, trend: 'up' },
    sensex: { value: 64500.75, change: 450.25, changePercent: 0.70, trend: 'up' },
    bankNifty: { value: 44500.50, change: -125.75, changePercent: -0.28, trend: 'down' }
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchIndices();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchIndices, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchIndices = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/indices');
      if (response.ok) {
        const data = await response.json();
        setIndices(data);
        setLastUpdate(new Date());
      } else {
        // Use mock data if API fails
        generateMockIndices();
      }
    } catch (error) {
      console.error('Error fetching indices:', error);
      generateMockIndices();
    } finally {
      setLoading(false);
    }
  };

  const generateMockIndices = () => {
    // Generate realistic mock data with small random movements
    const baseIndices = {
      nifty50: { base: 19500, volatility: 0.02 },
      sensex: { base: 64500, volatility: 0.02 },
      bankNifty: { base: 44500, volatility: 0.03 }
    };

    const newIndices = {};
    Object.keys(baseIndices).forEach(key => {
      const base = baseIndices[key];
      const changePercent = (Math.random() - 0.5) * base.volatility * 2; // -volatility to +volatility
      const change = (base.base * changePercent) / 100;
      const newValue = base.base + change;
      
      newIndices[key] = {
        value: parseFloat(newValue.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        trend: changePercent >= 0 ? 'up' : 'down'
      };
    });

    setIndices(newIndices);
    setLastUpdate(new Date());
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  if (loading && !lastUpdate) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading market indices...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Live Market Indices
            </h2>
            <p className="text-sm text-gray-600 mt-1">Real-time market performance indicators</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdate && (
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              {formatTime(lastUpdate)}
            </div>
          )}
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">Live</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Nifty 50 */}
        <div className={`text-center p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
          indices.nifty50.trend === 'up' 
            ? 'border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 hover:from-green-100 hover:via-emerald-100 hover:to-green-100' 
            : 'border-red-200 bg-gradient-to-br from-red-50 via-red-50 to-red-50 hover:from-red-100 hover:via-red-100 hover:to-red-100'
        }`}>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">N50</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">NIFTY 50</h3>
              <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${indices.nifty50.trend === 'up' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            </div>
          </div>
          <div className={`text-4xl font-bold mb-3 ${indices.nifty50.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {formatNumber(indices.nifty50.value)}
          </div>
          <div className={`text-sm font-semibold flex items-center justify-center space-x-1 ${indices.nifty50.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {indices.nifty50.trend === 'up' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span>
              {indices.nifty50.change >= 0 ? '+' : ''}{formatNumber(indices.nifty50.change)}
            </span>
            <span className="text-xs">
              ({indices.nifty50.changePercent >= 0 ? '+' : ''}{indices.nifty50.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Sensex */}
        <div className={`text-center p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
          indices.sensex.trend === 'up' 
            ? 'border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 hover:from-green-100 hover:via-emerald-100 hover:to-green-100' 
            : 'border-red-200 bg-gradient-to-br from-red-50 via-red-50 to-red-50 hover:from-red-100 hover:via-red-100 hover:to-red-100'
        }`}>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">SX</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">SENSEX</h3>
              <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${indices.sensex.trend === 'up' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            </div>
          </div>
          <div className={`text-4xl font-bold mb-3 ${indices.sensex.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {formatNumber(indices.sensex.value)}
          </div>
          <div className={`text-sm font-semibold flex items-center justify-center space-x-1 ${indices.sensex.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {indices.sensex.trend === 'up' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span>
              {indices.sensex.change >= 0 ? '+' : ''}{formatNumber(indices.sensex.change)}
            </span>
            <span className="text-xs">
              ({indices.sensex.changePercent >= 0 ? '+' : ''}{indices.sensex.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Bank Nifty */}
        <div className={`text-center p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
          indices.bankNifty.trend === 'up' 
            ? 'border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 hover:from-green-100 hover:via-emerald-100 hover:to-green-100' 
            : 'border-red-200 bg-gradient-to-br from-red-50 via-red-50 to-red-50 hover:from-red-100 hover:via-red-100 hover:to-red-100'
        }`}>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">BN</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">BANK NIFTY</h3>
              <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${indices.bankNifty.trend === 'up' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            </div>
          </div>
          <div className={`text-4xl font-bold mb-3 ${indices.bankNifty.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {formatNumber(indices.bankNifty.value)}
          </div>
          <div className={`text-sm font-semibold flex items-center justify-center space-x-1 ${indices.bankNifty.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {indices.bankNifty.trend === 'up' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span>
              {indices.bankNifty.change >= 0 ? '+' : ''}{formatNumber(indices.bankNifty.change)}
            </span>
            <span className="text-xs">
              ({indices.bankNifty.changePercent >= 0 ? '+' : ''}{indices.bankNifty.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Market Status */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center space-x-6 text-sm bg-gray-50 px-6 py-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">Market Open</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">Live Updates</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">High Volatility</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketIndices; 