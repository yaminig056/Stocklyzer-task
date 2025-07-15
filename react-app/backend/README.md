# StockAnalyser Backend API

A Node.js/Express backend server that provides real-time stock market data, indices, gainers/losers, and news for the StockAnalyser application.

## Features

- **Real-time Indices Data**: NIFTY 50, SENSEX, BANK NIFTY
- **Top Gainers & Losers**: Live stock performance data
- **Market News**: Categorized news with sentiment analysis
- **Scheduled Updates**: Automatic data refresh every 5 minutes
- **RESTful API**: Clean, documented endpoints
- **CORS Enabled**: Frontend integration ready

## API Endpoints

### Indices
- `GET /api/indices` - Get all indices data
- `GET /api/indices/:index` - Get specific index (NIFTY, SENSEX, BANKNIFTY)

### Gainers & Losers
- `GET /api/gainers?limit=10` - Get top gainers
- `GET /api/losers?limit=10` - Get top losers

### News
- `GET /api/news?limit=20&category=company` - Get all news
- `GET /api/news/category/:category` - Get news by category

### Health Check
- `GET /api/health` - Server health status

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp env.example .env
```

3. Configure API keys in `.env` file (optional for development)

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Keys Setup (Optional)

For real-time data, sign up for free API keys:

1. **Alpha Vantage** (Stock Data)
   - Visit: https://www.alphavantage.co/support/#api-key
   - Get free API key
   - Add to `.env`: `ALPHA_VANTAGE_API_KEY=your_key_here`

2. **News API** (News Data)
   - Visit: https://newsapi.org/register
   - Get free API key
   - Add to `.env`: `NEWS_API_KEY=your_key_here`

## Data Sources

### Development Mode
- Uses realistic mock data with random variations
- Updates every 5 minutes to simulate real-time data
- No API keys required

### Production Mode
- Real API integration when keys are configured
- Automatic fallback to mock data if APIs fail
- Rate limiting and error handling

## Data Structure

### Indices Response
```json
{
  "NIFTY": {
    "name": "NIFTY 50",
    "value": 22450.25,
    "change": 125.50,
    "changePercent": 0.56,
    "high": 22500.75,
    "low": 22350.25,
    "volume": 125000000,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Gainers/Losers Response
```json
[
  {
    "symbol": "RELIANCE",
    "name": "Reliance Industries",
    "price": 2850.75,
    "change": 125.50,
    "changePercent": 4.61,
    "volume": 12500000,
    "marketCap": 1920000000000,
    "sector": "Oil & Gas",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
]
```

### News Response
```json
[
  {
    "id": 1,
    "title": "Reliance Industries Reports Strong Q3 Results",
    "summary": "Reliance Industries posted better-than-expected quarterly results...",
    "source": "Economic Times",
    "url": "https://economictimes.indiatimes.com/example-news-1",
    "publishedAt": "2024-01-15T08:30:00.000Z",
    "category": "company",
    "sentiment": "positive",
    "impact": "high",
    "relatedStocks": ["RELIANCE"]
  }
]
```

## Error Handling

- All endpoints return proper HTTP status codes
- Error responses include descriptive messages
- Automatic fallback to mock data on API failures
- Graceful handling of rate limits

## CORS Configuration

The server is configured to accept requests from:
- `http://localhost:3000` (React dev server)
- `http://localhost:5173` (Vite dev server)
- Any origin in development mode

## Scheduled Tasks

- **Market Data**: Updates every 5 minutes
- **News Data**: Updates every 15 minutes
- **Initial Load**: Fetches all data on server startup

## Future Enhancements

- Database integration for data persistence
- Redis caching for improved performance
- WebSocket support for real-time updates
- User authentication and portfolios
- Advanced analytics and predictions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License 