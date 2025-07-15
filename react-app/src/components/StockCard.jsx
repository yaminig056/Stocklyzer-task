import React from 'react';

const StockCard = ({ stock, onSelect, isSelected }) => {
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatPercent = (percent) => {
    return `${Math.abs(percent).toFixed(2)}%`;
  };

  const formatNumber = (num) => {
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(1)}Cr`;
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(1)}L`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <div 
      className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105 ${
        isSelected 
          ? 'ring-4 ring-blue-500 shadow-2xl border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50' 
          : 'hover:border-gray-300 hover:shadow-lg border-gray-100'
      }`}
      onClick={() => onSelect(stock)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">{stock.symbol.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{stock.symbol}</h3>
            <p className="text-sm text-gray-600 truncate max-w-32">{stock.name || stock.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stock.currentPrice)}
          </p>
          <div className={`flex items-center justify-end space-x-2 text-sm font-semibold ${
            stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {stock.changePercent >= 0 ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            )}
            <span>
              {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
            </span>
            <span className="text-xs">
              ({stock.changePercent >= 0 ? '+' : ''}{formatPercent(stock.changePercent)})
            </span>
          </div>
        </div>
      </div>

      {/* Stock Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Open</p>
          <p className="text-sm font-bold text-gray-900 mt-1">
            {formatCurrency(stock.openPrice)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Previous Close</p>
          <p className="text-sm font-bold text-gray-900 mt-1">
            {formatCurrency(stock.previousClose)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">High</p>
          <p className="text-sm font-bold text-gray-900 mt-1">
            {formatCurrency(stock.high)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Low</p>
          <p className="text-sm font-bold text-gray-900 mt-1">
            {formatCurrency(stock.low)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Volume</p>
          <p className="text-sm font-bold text-gray-900 mt-1">
            {formatNumber(stock.volume)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Sector</p>
          <p className="text-sm font-bold text-gray-900 mt-1">
            {stock.sector || 'N/A'}
          </p>
        </div>
      </div>

      {/* Portfolio Information */}
      <div className="border-t-2 border-gray-200 pt-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Quantity</p>
            <p className="text-sm font-bold text-blue-900 mt-1">
              {stock.quantity.toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Avg Price</p>
            <p className="text-sm font-bold text-purple-900 mt-1">
              {formatCurrency(stock.avgPrice)}
            </p>
          </div>
        </div>

        {/* Current Value and P&L */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Current Value</p>
            <p className="text-sm font-bold text-green-900 mt-1">
              {formatCurrency(stock.currentValue)}
            </p>
          </div>
          <div className={`rounded-lg p-3 border ${
            stock.profitLoss >= 0 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <p className="text-xs font-medium uppercase tracking-wide ${
              stock.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }">P&L</p>
            <div className={`text-sm font-bold mt-1 ${
              stock.profitLoss >= 0 ? 'text-green-900' : 'text-red-900'
            }`}>
              <div>
                {stock.profitLoss >= 0 ? '+' : ''}{formatCurrency(stock.profitLoss)}
              </div>
              <div className="text-xs">
                ({stock.profitLossPercent >= 0 ? '+' : ''}{formatPercent(stock.profitLossPercent)})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      {stock.lastUpdated && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-gray-500">
              Last updated: {new Date(stock.lastUpdated).toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockCard; 