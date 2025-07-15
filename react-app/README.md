# StockAnalyser - Real-Time Stock Market Analysis Platform

A comprehensive React-based stock analysis web application with real-time market data, live news, and portfolio management features.

## 🚀 Features

### Frontend (React + Vite)
- **Real-time Market Data**: Live indices (NIFTY, SENSEX, BANK NIFTY)
- **Top Gainers & Losers**: Live stock performance tracking
- **Live News Feed**: Categorized news with sentiment analysis
- **Portfolio Management**: Track your investments with detailed analytics
- **Interactive Charts**: Multiple time period analysis (day, week, month, year, 5 years)
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Dark Mode**: Toggle between light and dark themes

### Backend (Node.js + Express)
- **RESTful API**: Clean, documented endpoints
- **Real-time Data**: Automatic updates every 5 minutes
- **News Integration**: Live market news with categorization
- **Mock Data**: Realistic data for development
- **API Integration Ready**: Easy setup for real APIs
- **CORS Enabled**: Frontend integration ready

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **Chart.js** - Interactive charts

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client
- **node-cron** - Scheduled tasks
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm

### 1. Clone the Repository
```bash
git clone <repository-url>
cd react-app
```

### 2. Frontend Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The frontend will be available at `http://localhost:5173`

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:5000`

### 4. API Keys Setup (Optional)
For real-time data, sign up for free API keys:

1. **Alpha Vantage** (Stock Data)
   - Visit: https://www.alphavantage.co/support/#api-key
   - Get free API key
   - Add to `backend/.env`: `ALPHA_VANTAGE_API_KEY=your_key_here`

2. **News API** (News Data)
   - Visit: https://newsapi.org/register
   - Get free API key
   - Add to `backend/.env`: `NEWS_API_KEY=your_key_here`

## 🏃‍♂️ Running the Application

### Development Mode
1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend (in a new terminal):
```bash
pnpm dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Production Mode
1. Build the frontend:
```bash
pnpm build
```

2. Start the backend:
```bash
cd backend
npm start
```

## 📡 API Endpoints

### Indices
- `GET /api/indices` - Get all indices data
- `GET /api/indices/:index` - Get specific index

### Gainers & Losers
- `GET /api/gainers?limit=10` - Get top gainers
- `GET /api/losers?limit=10` - Get top losers

### News
- `GET /api/news?limit=20&category=company` - Get all news
- `GET /api/news/category/:category` - Get news by category

### Health Check
- `GET /api/health` - Server health status

## 📊 Data Sources

### Development Mode
- Uses realistic mock data with random variations
- Updates every 5 minutes to simulate real-time data
- No API keys required

### Production Mode
- Real API integration when keys are configured
- Automatic fallback to mock data if APIs fail
- Rate limiting and error handling

## 🎯 Key Features

### Home Page
- Real-time market indices (NIFTY, SENSEX, BANK NIFTY)
- Top gainers and losers tables
- Live news feed with sentiment analysis
- Filter news by sentiment (Positive, Negative, Neutral)

### Portfolio Page
- Portfolio overview with total value and daily change
- Company cards with profit/loss indicators
- Search and filter functionality
- Sector and sentiment filtering

### Portfolio Holdings (Dashboard)
- Detailed stock analysis with interactive charts
- Multiple time period views (day, week, month, year, 5 years)
- Categorized news sections (company, competitor, supplier)
- Sentiment and impact analysis

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000

# API Keys (optional)
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
NEWS_API_KEY=your_news_api_key_here
```

### Customization
- Modify mock data in `backend/services/` files
- Update API endpoints in `src/services/api.js`
- Customize UI components in `src/` directory
- Adjust update intervals in `backend/server.js`

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `pnpm build`
2. Deploy the `dist` folder to your hosting platform

### Backend (Railway/Heroku)
1. Set environment variables
2. Deploy the `backend` folder
3. Update frontend API URL to production backend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify both frontend and backend are running
3. Ensure API keys are properly configured (if using real data)
4. Check network connectivity

## 🔮 Future Enhancements

- Database integration for data persistence
- Redis caching for improved performance
- WebSocket support for real-time updates
- User authentication and portfolios
- Advanced analytics and predictions
- Mobile app development
- More chart types and indicators
- Social features and sharing
