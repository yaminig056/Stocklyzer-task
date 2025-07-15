// Homepage functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mock data for live news
    const liveNews = [
        {
            id: 1,
            title: "HDFC Bank Q3 results beat estimates, net profit rises 2.5%",
            summary: "HDFC Bank reported strong quarterly results with better-than-expected performance in retail banking segment.",
            sentiment: "positive",
            timestamp: "2 hours ago",
            category: "Banking",
            impact: "high"
        },
        {
            id: 2,
            title: "RBI imposes restrictions on HDFC Bank's digital banking operations",
            summary: "Central bank cites concerns over digital banking infrastructure and customer service issues.",
            sentiment: "negative",
            timestamp: "4 hours ago",
            category: "Regulatory",
            impact: "high"
        },
        {
            id: 3,
            title: "TCS announces major deal with European banking client",
            summary: "Tata Consultancy Services secures $500 million contract for digital transformation project.",
            sentiment: "positive",
            timestamp: "6 hours ago",
            category: "Technology",
            impact: "medium"
        },
        {
            id: 4,
            title: "Reliance Industries reports record quarterly revenue",
            summary: "Oil-to-telecom conglomerate posts highest-ever quarterly revenue driven by Jio and retail segments.",
            sentiment: "positive",
            timestamp: "8 hours ago",
            category: "Energy",
            impact: "high"
        },
        {
            id: 5,
            title: "Market volatility increases amid global economic concerns",
            summary: "Indian markets face pressure due to rising inflation and global economic uncertainty.",
            sentiment: "negative",
            timestamp: "10 hours ago",
            category: "Market",
            impact: "medium"
        },
        {
            id: 6,
            title: "Infosys announces new AI-powered solutions for healthcare",
            summary: "Technology major launches innovative AI solutions to transform healthcare delivery.",
            sentiment: "positive",
            timestamp: "12 hours ago",
            category: "Technology",
            impact: "medium"
        },
        {
            id: 7,
            title: "ITC reports strong performance in FMCG segment",
            summary: "Diversified conglomerate shows robust growth in consumer goods business.",
            sentiment: "positive",
            timestamp: "14 hours ago",
            category: "FMCG",
            impact: "medium"
        },
        {
            id: 8,
            title: "Bharti Airtel faces regulatory challenges in spectrum allocation",
            summary: "Telecom major encounters hurdles in upcoming spectrum auction process.",
            sentiment: "negative",
            timestamp: "16 hours ago",
            category: "Telecom",
            impact: "medium"
        }
    ];

    // Mock data for top gainers and losers
    const marketMovers = {
        gainers: [
            { symbol: "RELIANCE", name: "Reliance Industries", change: "+4.2%", price: "₹2,456" },
            { symbol: "TCS", name: "Tata Consultancy", change: "+3.8%", price: "₹3,890" },
            { symbol: "INFY", name: "Infosys", change: "+3.1%", price: "₹1,567" },
            { symbol: "ITC", name: "ITC Limited", change: "+2.9%", price: "₹456" },
            { symbol: "HINDUNILVR", name: "Hindustan Unilever", change: "+2.7%", price: "₹2,345" }
        ],
        losers: [
            { symbol: "HDFCBANK", name: "HDFC Bank", change: "-3.2%", price: "₹1,567" },
            { symbol: "BHARTIARTL", name: "Bharti Airtel", change: "-2.8%", price: "₹890" },
            { symbol: "AXISBANK", name: "Axis Bank", change: "-2.1%", price: "₹1,234" },
            { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", change: "-1.9%", price: "₹1,890" },
            { symbol: "ICICIBANK", name: "ICICI Bank", change: "-1.7%", price: "₹987" }
        ]
    };

    // Render live news
    function renderNews() {
        const newsGrid = document.getElementById('news-grid');
        newsGrid.innerHTML = '';

        liveNews.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.className = `news-card ${news.sentiment}`;
            newsCard.innerHTML = `
                <div class="news-header">
                    <span class="news-category">${news.category}</span>
                    <span class="news-timestamp">${news.timestamp}</span>
                </div>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-summary">${news.summary}</p>
                <div class="news-footer">
                    <span class="sentiment-badge ${news.sentiment}">
                        <i class="fas fa-${getSentimentIcon(news.sentiment)}"></i>
                        ${news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
                    </span>
                    <span class="impact-badge ${news.impact}">${news.impact.toUpperCase()} IMPACT</span>
                </div>
            `;
            newsGrid.appendChild(newsCard);
        });
    }

    // Render market movers
    function renderMarketMovers() {
        const topGainers = document.getElementById('top-gainers');
        const topLosers = document.getElementById('top-losers');

        // Render gainers
        topGainers.innerHTML = '';
        marketMovers.gainers.forEach(stock => {
            const stockItem = document.createElement('div');
            stockItem.className = 'stock-item gainer';
            stockItem.innerHTML = `
                <div class="stock-info">
                    <div class="stock-symbol">${stock.symbol}</div>
                    <div class="stock-name">${stock.name}</div>
                </div>
                <div class="stock-price">
                    <div class="stock-value">${stock.price}</div>
                    <div class="stock-change positive">${stock.change}</div>
                </div>
            `;
            topGainers.appendChild(stockItem);
        });

        // Render losers
        topLosers.innerHTML = '';
        marketMovers.losers.forEach(stock => {
            const stockItem = document.createElement('div');
            stockItem.className = 'stock-item loser';
            stockItem.innerHTML = `
                <div class="stock-info">
                    <div class="stock-symbol">${stock.symbol}</div>
                    <div class="stock-name">${stock.name}</div>
                </div>
                <div class="stock-price">
                    <div class="stock-value">${stock.price}</div>
                    <div class="stock-change negative">${stock.change}</div>
                </div>
            `;
            topLosers.appendChild(stockItem);
        });
    }

    // Get sentiment icon
    function getSentimentIcon(sentiment) {
        switch(sentiment) {
            case 'positive': return 'smile';
            case 'negative': return 'frown';
            default: return 'meh';
        }
    }

    // Filter news by sentiment
    function setupNewsFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const newsCards = document.querySelectorAll('.news-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter news cards
                newsCards.forEach(card => {
                    if (filter === 'all' || card.classList.contains(filter)) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.5s ease-in';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Add CSS animations
    function addAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .news-card {
                animation: fadeIn 0.5s ease-in;
            }
            
            .stock-item {
                animation: fadeIn 0.3s ease-in;
            }
        `;
        document.head.appendChild(style);
    }

    // Update market status
    function updateMarketStatus() {
        const statusIndicator = document.querySelector('.status-indicator');
        const now = new Date();
        const marketHours = now.getHours();
        
        // Check if market is open (9:30 AM to 3:30 PM IST)
        if (marketHours >= 9 && marketHours < 16) {
            statusIndicator.classList.add('live');
            statusIndicator.classList.remove('closed');
        } else {
            statusIndicator.classList.add('closed');
            statusIndicator.classList.remove('live');
        }
    }

    // Initialize homepage
    function initHomepage() {
        renderNews();
        renderMarketMovers();
        setupNewsFilters();
        addAnimations();
        updateMarketStatus();

        // Add hover effects
        document.querySelectorAll('.news-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            });
        });

        // Add click effects for stock items
        document.querySelectorAll('.stock-item').forEach(item => {
            item.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    // Start auto-refresh for live data
    function startAutoRefresh() {
        setInterval(() => {
            // In a real application, this would fetch new data
            console.log('Refreshing live data...');
            
            // Simulate data updates
            updateMarketStatus();
            
            // Add some random news updates
            if (Math.random() > 0.7) {
                console.log('New market update available');
            }
        }, 30000); // Refresh every 30 seconds
    }

    // Initialize everything
    initHomepage();
    startAutoRefresh();
}); 