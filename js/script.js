// Mock data for demonstration
const mockData = {
    news: [
        {
            title: "HDFC Bank Q3 results: Net profit rises 2.5% to ₹16,372 crore",
            url: "#",
            timestamp: "2 hours ago",
            sentiment: "positive"
        },
        {
            title: "HDFC Bank shares fall 3% after RBI imposes restrictions",
            url: "#",
            timestamp: "4 hours ago",
            sentiment: "negative"
        },
        {
            title: "Analysts maintain 'Buy' rating on HDFC Bank despite recent volatility",
            url: "#",
            timestamp: "6 hours ago",
            sentiment: "positive"
        },
        {
            title: "HDFC Bank announces dividend of ₹19 per share",
            url: "#",
            timestamp: "8 hours ago",
            sentiment: "positive"
        },
        {
            title: "Market volatility affects HDFC Bank stock price",
            url: "#",
            timestamp: "10 hours ago",
            sentiment: "negative"
        }
    ],
    stockPrices: [
        { date: "2024-01-15", price: 1680, volume: 12500000 },
        { date: "2024-01-16", price: 1695, volume: 11800000 },
        { date: "2024-01-17", price: 1670, volume: 13200000 },
        { date: "2024-01-18", price: 1650, volume: 14500000 },
        { date: "2024-01-19", price: 1620, volume: 15800000 },
        { date: "2024-01-20", price: 1590, volume: 16700000 },
        { date: "2024-01-21", price: 1560, volume: 17500000 },
        { date: "2024-01-22", price: 1530, volume: 18200000 },
        { date: "2024-01-23", price: 1510, volume: 19000000 },
        { date: "2024-01-24", price: 1480, volume: 19500000 }
    ]
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    renderNews();
    renderStockChart();
    updateCurrentPrice();
    checkPriceAlerts();
    startAutoRefresh();
});

// Render news section
function renderNews() {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';

    mockData.news.forEach(news => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="${news.url}" target="_blank">
                <div class="news-title">${news.title}</div>
                <div class="news-meta">
                    <span class="timestamp">${news.timestamp}</span>
                    <span class="sentiment ${news.sentiment}">${news.sentiment}</span>
                </div>
            </a>
        `;
        newsList.appendChild(li);
    });
}

// Render stock price chart
function renderStockChart() {
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockData.stockPrices.map(item => {
                const date = new Date(item.date);
                return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
            }),
            datasets: [{
                label: 'HDFC Bank Stock Price (₹)',
                data: mockData.stockPrices.map(item => item.price),
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3498db',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#3498db',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Price: ₹${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#666',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#666',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Update current price display
function updateCurrentPrice() {
    const currentPrice = mockData.stockPrices[mockData.stockPrices.length - 1].price;
    const previousPrice = mockData.stockPrices[mockData.stockPrices.length - 2].price;
    const priceChange = currentPrice - previousPrice;
    const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2);

    document.getElementById('current-price').textContent = `₹${currentPrice.toLocaleString()}`;
    
    const priceChangeElement = document.getElementById('price-change');
    if (priceChange >= 0) {
        priceChangeElement.textContent = `+₹${priceChange} (+${priceChangePercent}%)`;
        priceChangeElement.className = 'price-change positive';
    } else {
        priceChangeElement.textContent = `₹${priceChange} (${priceChangePercent}%)`;
        priceChangeElement.className = 'price-change negative';
    }
}

// Check for price alerts
function checkPriceAlerts() {
    const alertMessage = document.getElementById('alert-message');
    const recentPrices = mockData.stockPrices.slice(-5);
    let alertText = '';
    let isUrgent = false;

    // Check for significant price drops
    for (let i = 1; i < recentPrices.length; i++) {
        const currentPrice = recentPrices[i].price;
        const previousPrice = recentPrices[i-1].price;
        const dropPercent = ((previousPrice - currentPrice) / previousPrice) * 100;

        if (dropPercent > 2) {
            alertText += `⚠️ Price dropped ${dropPercent.toFixed(2)}% from ₹${previousPrice.toLocaleString()} to ₹${currentPrice.toLocaleString()}<br>`;
            isUrgent = true;
        }
    }

    // Check for consecutive drops
    let consecutiveDrops = 0;
    for (let i = 1; i < recentPrices.length; i++) {
        if (recentPrices[i].price < recentPrices[i-1].price) {
            consecutiveDrops++;
        } else {
            consecutiveDrops = 0;
        }
    }

    if (consecutiveDrops >= 3) {
        alertText += `🚨 ${consecutiveDrops} consecutive days of price decline detected!<br>`;
        isUrgent = true;
    }

    // Add analysis and recommendations
    if (alertText) {
        alertText += `<br><strong>Analysis:</strong><br>`;
        alertText += `• Recent negative news about RBI restrictions may be affecting investor sentiment<br>`;
        alertText += `• High trading volume indicates increased market activity<br>`;
        alertText += `• Consider reviewing investment strategy and risk management<br><br>`;
        alertText += `<strong>Recommendation:</strong> Monitor closely and consider defensive positions.`;
        
        alertMessage.innerHTML = alertText;
        if (isUrgent) {
            alertMessage.classList.add('urgent');
        }
    } else {
        alertMessage.innerHTML = '✅ No significant price alerts at this time. Market conditions appear stable.';
        alertMessage.classList.remove('urgent');
    }
}

// Auto-refresh functionality
function startAutoRefresh() {
    // Refresh data every 5 minutes
    setInterval(() => {
        // In a real application, this would fetch new data from the backend
        console.log('Refreshing data...');
        
        // Simulate data update
        const lastPrice = mockData.stockPrices[mockData.stockPrices.length - 1].price;
        const newPrice = lastPrice + (Math.random() - 0.5) * 20; // Random price change
        
        mockData.stockPrices.push({
            date: new Date().toISOString().split('T')[0],
            price: Math.round(newPrice),
            volume: Math.floor(Math.random() * 5000000) + 15000000
        });

        // Keep only last 10 data points
        if (mockData.stockPrices.length > 10) {
            mockData.stockPrices.shift();
        }

        // Update display
        renderStockChart();
        updateCurrentPrice();
        checkPriceAlerts();
    }, 300000); // 5 minutes
}

// Add some interactive features
function addInteractivity() {
    // Add click handlers for news items
    document.querySelectorAll('#news-list li').forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Add hover effects for chart
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    chartContainer.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Initialize interactivity after DOM is loaded
setTimeout(addInteractivity, 1000); 