const axios = require('axios');
require('dotenv').config();
const express = require('express');
const router = express.Router();

// Load API key from environment variable
const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

// Throw an error early if the key is missing
if (!apiKey) {
  throw new Error("Alpha Vantage API key not configured in environment variables");
}

/**
 * Helper function to build Alpha Vantage API URL
 * @param {string} symbol - Stock symbol (e.g. 'TCS')
 * @param {string} functionType - Alpha Vantage function type (e.g. 'TIME_SERIES_DAILY_ADJUSTED')
 * @returns {string} - Complete API URL
 */
function buildURL(symbol, functionType) {
  return `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${apiKey}`;
}

/**
 * Fetch historical stock data for a given symbol and period
 * @param {string} symbol - Stock symbol
 * @param {string} period - Time period: daily, weekly, or monthly
 * @returns {Promise<object>} - Alpha Vantage API response data
 */
async function getChartData(symbol, period = 'daily') {
  let functionType;

  switch (period) {
    case 'daily':
      functionType = 'TIME_SERIES_DAILY_ADJUSTED';
      break;
    case 'weekly':
      functionType = 'TIME_SERIES_WEEKLY';
      break;
    case 'monthly':
      functionType = 'TIME_SERIES_MONTHLY';
      break;
    default:
      throw new Error(`Invalid period "${period}". Use: daily, weekly, or monthly.`);
  }

  try {
    const url = buildURL(symbol, functionType);
    const response = await axios.get(url);

    // Handle API error messages
    if (response.data['Error Message']) {
      throw new Error(`Alpha Vantage API error: Invalid symbol "${symbol}".`);
    }
    if (response.data['Note']) {
      // This usually means API limit exceeded
      throw new Error(`Alpha Vantage API notice: ${response.data['Note']}`);
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error.message);
    throw error;
  }
}

/**
 * Fetch company information using Alpha Vantage "OVERVIEW" endpoint
 * @param {string} symbol - Stock symbol
 * @returns {Promise<object>} - Company info data
 */
async function getCompanyInfo(symbol) {
  try {
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
    const response = await axios.get(url);

    // Alpha Vantage returns empty object if symbol is invalid
    if (Object.keys(response.data).length === 0) {
      throw new Error(`No company info found for symbol "${symbol}".`);
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching company info for ${symbol}:`, error.message);
    throw error;
  }
}

module.exports = router;
