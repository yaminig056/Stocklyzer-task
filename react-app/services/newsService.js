const axios = require('axios');

// Mock data for news
const mockNewsData = [
  // ... (existing mock data)
];

function generateMockNewsData(limit = 20, category = null) {
  let baseData = [...mockNewsData];
  if (category) {
    baseData = baseData.filter(news => news.category === category);
  }
  baseData.forEach(news => {
    const randomHours = Math.floor(Math.random() * 24);
    news.publishedAt = new Date(Date.now() - randomHours * 60 * 60 * 1000).toISOString();
  });
  return baseData
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit);
}

// Fetch news from GNews API
async function fetchFromGNews(limit = 20, category = null) {
  try {
    const apiKey = process.env.GNEWS_API_KEY;
    let topic = 'business';
    if (category) {
      topic = category;
    }
    const url = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&topic=${topic}&lang=en&country=in&max=${limit}`;
    const response = await axios.get(url);
    return response.data.articles.map(article => ({
      title: article.title,
      summary: article.description,
      source: article.source.name,
      url: article.url,
      publishedAt: article.publishedAt,
      category: topic,
      sentiment: 'neutral', // Sentiment analysis can be added later
      impact: 'medium', // Placeholder
      relatedStocks: [],
      tags: []
    }));
  } catch (error) {
    console.error('Error fetching from GNews API:', error);
    return generateMockNewsData(limit, category);
  }
}

// Fetch news from NewsAPI (fallback)
async function fetchFromNewsAPI(limit = 20, category = null) {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    let query = 'business';
    if (category) {
      query = category;
    }
    const url = `https://newsapi.org/v2/top-headlines?q=${query}&language=en&country=in&pageSize=${limit}&apiKey=${apiKey}`;
    const response = await axios.get(url);
    return response.data.articles.map(article => ({
      title: article.title,
      summary: article.description,
      source: article.source.name,
      url: article.url,
      publishedAt: article.publishedAt,
      category: query,
      sentiment: 'neutral',
      impact: 'medium',
      relatedStocks: [],
      tags: []
    }));
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return generateMockNewsData(limit, category);
  }
}

// Main function to fetch news data
async function fetchNews(limit = 20, category = null) {
  try {
    if (process.env.GNEWS_API_KEY) {
      return await fetchFromGNews(limit, category);
    } else if (process.env.NEWS_API_KEY) {
      return await fetchFromNewsAPI(limit, category);
    } else {
      console.log('Using mock data for news (configure API keys for real data)');
      return generateMockNewsData(limit, category);
    }
  } catch (error) {
    console.error('Error in fetchNews:', error);
    return generateMockNewsData(limit, category);
  }
}

async function fetchNewsByCategory(category, limit = 10) {
  return await fetchNews(limit, category);
}

module.exports = {
  fetchNews,
  fetchNewsByCategory
}; 