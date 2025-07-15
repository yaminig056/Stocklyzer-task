# StockAnalyser - React Application

A modern, responsive React application for live market intelligence and portfolio tracking with real-time stock analysis and sentiment analysis.

## 🚀 Features

### 📰 **Homepage**
- **Live Market News** with sentiment analysis (Positive/Negative/Neutral)
- **Market Overview** showing NIFTY 50, SENSEX, and BANK NIFTY indices
- **Top Gainers & Losers** with real-time price changes
- **News Filtering** by sentiment and impact level
- **Market Status** indicator (Live/Closed)

### 💼 **Portfolio Tracker**
- **25 Companies** with comprehensive stock data
- **Real-time Stock Prices** (Open, Current, High, Low, Volume)
- **Impact News** for each company with related company tracking
- **Sentiment Analysis** with visual breakdown and scores
- **Search & Filter** functionality by company, sector, and sentiment
- **Detailed Modal** for each company with complete information

### 🎨 **Design Features**
- **Modern Glassmorphism UI** with blur effects and gradients
- **Responsive Design** for desktop, tablet, and mobile
- **Smooth Animations** and hover effects
- **Interactive Components** with real-time updates
- **Professional Color Scheme** with sentiment-based indicators

## 📁 Project Structure

```
stockanalyser/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navigation.js
│   │   ├── Navigation.css
│   │   ├── CompanyModal.js
│   │   └── CompanyModal.css
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── HomePage.css
│   │   ├── PortfolioPage.js
│   │   └── PortfolioPage.css
│   ├── data/
│   │   └── mockData.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing
- **Chart.js & React-Chartjs-2** - Data visualization
- **Font Awesome** - Icons
- **CSS3** - Modern styling with Flexbox, Grid, and animations
- **JavaScript ES6+** - Modern JavaScript features

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stockanalyser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The application will automatically reload when you make changes

## 🎯 Key Components

### **Navigation Component**
- Responsive navigation bar with mobile hamburger menu
- Active route highlighting
- Smooth scroll effects

### **HomePage Component**
- Hero section with market status
- Market indices overview
- Live news feed with filtering
- Top gainers and losers section

### **PortfolioPage Component**
- 25 company cards with detailed information
- Search and filter functionality
- Sentiment analysis visualization
- Impact news display

### **CompanyModal Component**
- Detailed company information
- Stock performance metrics
- Impact analysis with news
- Sentiment breakdown with visual charts
- Related companies tracking

## 📊 Data Structure

### **Company Data**
Each company includes:
- Basic info (name, symbol, sector)
- Stock prices (current, open, high, low)
- Volume and price changes
- Sentiment analysis (score and breakdown)
- Impact news
- Related companies

### **News Data**
Each news item includes:
- Title and summary
- Sentiment classification
- Impact level (high/medium/low)
- Category and timestamp

## 🎨 Styling Features

### **Design System**
- **Color Palette**: Professional blues, greens, and grays
- **Typography**: Segoe UI font family
- **Spacing**: Consistent 8px grid system
- **Shadows**: Layered shadow system for depth

### **Responsive Breakpoints**
- **Desktop**: 1200px+ (3-column layout)
- **Tablet**: 768px-1024px (2-column layout)
- **Mobile**: <768px (1-column layout)

### **Animations**
- Fade-in effects for cards
- Slide-in animations for lists
- Hover transformations
- Smooth transitions

## 🔧 Customization

### **Adding New Companies**
Edit `src/data/mockData.js`:
```javascript
{
  id: 26,
  name: "New Company",
  symbol: "NEWCOMP",
  sector: "Technology",
  // ... other properties
}
```

### **Modifying Styles**
- Global styles: `src/App.css`
- Component-specific styles: Individual `.css` files
- Responsive design: Media queries in each component

### **Adding New Features**
- Create new components in `src/components/`
- Add new pages in `src/pages/`
- Update routing in `src/App.js`

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (limited support)

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Deploy to Netlify**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`

### **Deploy to Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

## 🔮 Future Enhancements

### **Backend Integration**
- Real-time stock data APIs
- News API integration
- User authentication
- Portfolio management

### **Advanced Features**
- Real-time WebSocket connections
- Email/SMS notifications
- Technical indicators (RSI, MACD)
- Price prediction models

### **Additional Pages**
- Detailed analysis page
- Alert management
- User dashboard
- Settings page

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add feature'`
6. Push: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

- **Email**: info@stockanalyser.com
- **Documentation**: [Link to docs]
- **Issues**: [GitHub Issues]

---

**Built with ❤️ using React and modern web technologies** 