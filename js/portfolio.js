// Portfolio Tracker functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mock data for 25 companies
    const companies = [
        {
            id: 1,
            name: "HDFC Bank",
            symbol: "HDFCBANK",
            sector: "Banking",
            currentPrice: 1567.80,
            openPrice: 1590.50,
            dayHigh: 1595.20,
            dayLow: 1550.30,
            volume: 12500000,
            change: -22.70,
            changePercent: -1.43,
            sentiment: "negative",
            sentimentScore: 35,
            sentimentBreakdown: { positive: 30, negative: 45, neutral: 25 },
            impactNews: [
                "RBI imposes restrictions on digital banking operations",
                "Q3 results show strong retail banking performance",
                "Analysts maintain 'Buy' rating despite regulatory concerns"
            ],
            relatedCompanies: ["AXISBANK", "ICICIBANK", "KOTAKBANK"]
        },
        {
            id: 2,
            name: "Reliance Industries",
            symbol: "RELIANCE",
            sector: "Energy",
            currentPrice: 2456.90,
            openPrice: 2400.20,
            dayHigh: 2470.50,
            dayLow: 2395.80,
            volume: 8900000,
            change: 56.70,
            changePercent: 2.36,
            sentiment: "positive",
            sentimentScore: 78,
            sentimentBreakdown: { positive: 65, negative: 15, neutral: 20 },
            impactNews: [
                "Record quarterly revenue reported",
                "Jio platform shows strong growth",
                "Retail segment expansion plans announced"
            ],
            relatedCompanies: ["ONGC", "BPCL", "IOC"]
        },
        {
            id: 3,
            name: "TCS",
            symbol: "TCS",
            sector: "Technology",
            currentPrice: 3890.50,
            openPrice: 3850.30,
            dayHigh: 3910.20,
            dayLow: 3830.40,
            volume: 3200000,
            change: 40.20,
            changePercent: 1.04,
            sentiment: "positive",
            sentimentScore: 82,
            sentimentBreakdown: { positive: 70, negative: 10, neutral: 20 },
            impactNews: [
                "Major European banking deal secured",
                "AI and cloud services expansion",
                "Strong Q3 performance reported"
            ],
            relatedCompanies: ["INFY", "WIPRO", "HCLTECH"]
        },
        {
            id: 4,
            name: "Infosys",
            symbol: "INFY",
            sector: "Technology",
            currentPrice: 1567.30,
            openPrice: 1540.80,
            dayHigh: 1580.50,
            dayLow: 1535.20,
            volume: 5800000,
            change: 26.50,
            changePercent: 1.72,
            sentiment: "positive",
            sentimentScore: 75,
            sentimentBreakdown: { positive: 60, negative: 20, neutral: 20 },
            impactNews: [
                "New AI-powered healthcare solutions launched",
                "Digital transformation projects increase",
                "Employee retention initiatives announced"
            ],
            relatedCompanies: ["TCS", "WIPRO", "HCLTECH"]
        },
        {
            id: 5,
            name: "ITC",
            symbol: "ITC",
            sector: "FMCG",
            currentPrice: 456.80,
            openPrice: 450.20,
            dayHigh: 460.50,
            dayLow: 448.90,
            volume: 8900000,
            change: 6.60,
            changePercent: 1.47,
            sentiment: "positive",
            sentimentScore: 68,
            sentimentBreakdown: { positive: 55, negative: 25, neutral: 20 },
            impactNews: [
                "Strong FMCG segment performance",
                "New product launches in premium segment",
                "Sustainability initiatives expanded"
            ],
            relatedCompanies: ["HINDUNILVR", "MARICO", "DABUR"]
        },
        {
            id: 6,
            name: "Hindustan Unilever",
            symbol: "HINDUNILVR",
            sector: "FMCG",
            currentPrice: 2345.60,
            openPrice: 2320.40,
            dayHigh: 2350.80,
            dayLow: 2315.20,
            volume: 2100000,
            change: 25.20,
            changePercent: 1.09,
            sentiment: "positive",
            sentimentScore: 72,
            sentimentBreakdown: { positive: 58, negative: 22, neutral: 20 },
            impactNews: [
                "Premium product portfolio expansion",
                "Digital transformation in distribution",
                "ESG initiatives receive recognition"
            ],
            relatedCompanies: ["ITC", "MARICO", "DABUR"]
        },
        {
            id: 7,
            name: "Bharti Airtel",
            symbol: "BHARTIARTL",
            sector: "Telecom",
            currentPrice: 890.40,
            openPrice: 910.20,
            dayHigh: 915.60,
            dayLow: 885.30,
            volume: 7800000,
            change: -19.80,
            changePercent: -2.18,
            sentiment: "negative",
            sentimentScore: 42,
            sentimentBreakdown: { positive: 25, negative: 55, neutral: 20 },
            impactNews: [
                "Spectrum auction challenges faced",
                "5G rollout plans delayed",
                "ARPU improvement continues"
            ],
            relatedCompanies: ["RELIANCE", "IDEA", "VODAFONE"]
        },
        {
            id: 8,
            name: "Axis Bank",
            symbol: "AXISBANK",
            sector: "Banking",
            currentPrice: 1234.50,
            openPrice: 1260.80,
            dayHigh: 1265.40,
            dayLow: 1225.60,
            volume: 6500000,
            change: -26.30,
            changePercent: -2.09,
            sentiment: "negative",
            sentimentScore: 38,
            sentimentBreakdown: { positive: 20, negative: 60, neutral: 20 },
            impactNews: [
                "NPA concerns in corporate portfolio",
                "Digital banking initiatives continue",
                "Branch expansion plans announced"
            ],
            relatedCompanies: ["HDFCBANK", "ICICIBANK", "KOTAKBANK"]
        },
        {
            id: 9,
            name: "Kotak Mahindra Bank",
            symbol: "KOTAKBANK",
            sector: "Banking",
            currentPrice: 1890.30,
            openPrice: 1920.50,
            dayHigh: 1925.80,
            dayLow: 1885.40,
            volume: 3200000,
            change: -30.20,
            changePercent: -1.57,
            sentiment: "negative",
            sentimentScore: 45,
            sentimentBreakdown: { positive: 30, negative: 50, neutral: 20 },
            impactNews: [
                "Regulatory compliance challenges",
                "Wealth management growth strong",
                "Digital transformation progress"
            ],
            relatedCompanies: ["HDFCBANK", "AXISBANK", "ICICIBANK"]
        },
        {
            id: 10,
            name: "ICICI Bank",
            symbol: "ICICIBANK",
            sector: "Banking",
            currentPrice: 987.60,
            openPrice: 1005.40,
            dayHigh: 1010.20,
            dayLow: 980.80,
            volume: 8900000,
            change: -17.80,
            changePercent: -1.77,
            sentiment: "negative",
            sentimentScore: 40,
            sentimentBreakdown: { positive: 25, negative: 55, neutral: 20 },
            impactNews: [
                "Retail banking growth strong",
                "Digital initiatives expand",
                "Asset quality improves"
            ],
            relatedCompanies: ["HDFCBANK", "AXISBANK", "KOTAKBANK"]
        },
        {
            id: 11,
            name: "Wipro",
            symbol: "WIPRO",
            sector: "Technology",
            currentPrice: 456.80,
            openPrice: 450.20,
            dayHigh: 460.50,
            dayLow: 448.90,
            volume: 5800000,
            change: 6.60,
            changePercent: 1.47,
            sentiment: "positive",
            sentimentScore: 65,
            sentimentBreakdown: { positive: 50, negative: 30, neutral: 20 },
            impactNews: [
                "Cloud services growth strong",
                "New client acquisitions",
                "Employee development programs"
            ],
            relatedCompanies: ["TCS", "INFY", "HCLTECH"]
        },
        {
            id: 12,
            name: "HCL Technologies",
            symbol: "HCLTECH",
            sector: "Technology",
            currentPrice: 1234.50,
            openPrice: 1220.80,
            dayHigh: 1240.40,
            dayLow: 1215.60,
            volume: 3200000,
            change: 13.70,
            changePercent: 1.12,
            sentiment: "positive",
            sentimentScore: 70,
            sentimentBreakdown: { positive: 55, negative: 25, neutral: 20 },
            impactNews: [
                "Product engineering services expand",
                "Digital transformation projects",
                "Innovation labs launched"
            ],
            relatedCompanies: ["TCS", "INFY", "WIPRO"]
        },
        {
            id: 13,
            name: "ONGC",
            symbol: "ONGC",
            sector: "Energy",
            currentPrice: 234.50,
            openPrice: 230.20,
            dayHigh: 236.80,
            dayLow: 228.90,
            volume: 12500000,
            change: 4.30,
            changePercent: 1.87,
            sentiment: "positive",
            sentimentScore: 68,
            sentimentBreakdown: { positive: 55, negative: 25, neutral: 20 },
            impactNews: [
                "Oil production targets met",
                "Exploration activities increase",
                "Green energy initiatives"
            ],
            relatedCompanies: ["RELIANCE", "BPCL", "IOC"]
        },
        {
            id: 14,
            name: "BPCL",
            symbol: "BPCL",
            sector: "Energy",
            currentPrice: 456.80,
            openPrice: 450.20,
            dayHigh: 460.50,
            dayLow: 448.90,
            volume: 7800000,
            change: 6.60,
            changePercent: 1.47,
            sentiment: "positive",
            sentimentScore: 62,
            sentimentBreakdown: { positive: 45, negative: 35, neutral: 20 },
            impactNews: [
                "Refinery efficiency improves",
                "Retail network expansion",
                "Clean energy investments"
            ],
            relatedCompanies: ["RELIANCE", "ONGC", "IOC"]
        },
        {
            id: 15,
            name: "IOC",
            symbol: "IOC",
            sector: "Energy",
            currentPrice: 123.40,
            openPrice: 120.80,
            dayHigh: 125.60,
            dayLow: 119.90,
            volume: 15800000,
            change: 2.60,
            changePercent: 2.15,
            sentiment: "positive",
            sentimentScore: 65,
            sentimentBreakdown: { positive: 50, negative: 30, neutral: 20 },
            impactNews: [
                "Petrochemical expansion plans",
                "Digital transformation initiatives",
                "Sustainability goals achieved"
            ],
            relatedCompanies: ["RELIANCE", "ONGC", "BPCL"]
        },
        {
            id: 16,
            name: "Maruti Suzuki",
            symbol: "MARUTI",
            sector: "Automobile",
            currentPrice: 9876.50,
            openPrice: 9800.20,
            dayHigh: 9920.80,
            dayLow: 9785.40,
            volume: 1200000,
            change: 76.30,
            changePercent: 0.78,
            sentiment: "positive",
            sentimentScore: 72,
            sentimentBreakdown: { positive: 58, negative: 22, neutral: 20 },
            impactNews: [
                "SUV segment growth strong",
                "Electric vehicle plans announced",
                "Export markets expand"
            ],
            relatedCompanies: ["TATAMOTORS", "M&M", "HEROMOTOCO"]
        },
        {
            id: 17,
            name: "Tata Motors",
            symbol: "TATAMOTORS",
            sector: "Automobile",
            currentPrice: 678.90,
            openPrice: 670.50,
            dayHigh: 685.20,
            dayLow: 665.80,
            volume: 8900000,
            change: 8.40,
            changePercent: 1.25,
            sentiment: "positive",
            sentimentScore: 75,
            sentimentBreakdown: { positive: 60, negative: 20, neutral: 20 },
            impactNews: [
                "JLR performance improves",
                "Electric vehicle launches",
                "Cost optimization measures"
            ],
            relatedCompanies: ["MARUTI", "M&M", "HEROMOTOCO"]
        },
        {
            id: 18,
            name: "Mahindra & Mahindra",
            symbol: "M&M",
            sector: "Automobile",
            currentPrice: 1456.70,
            openPrice: 1440.30,
            dayHigh: 1465.80,
            dayLow: 1435.20,
            volume: 3200000,
            change: 16.40,
            changePercent: 1.14,
            sentiment: "positive",
            sentimentScore: 68,
            sentimentBreakdown: { positive: 55, negative: 25, neutral: 20 },
            impactNews: [
                "SUV segment leadership",
                "Electric mobility initiatives",
                "Farm equipment growth"
            ],
            relatedCompanies: ["MARUTI", "TATAMOTORS", "HEROMOTOCO"]
        },
        {
            id: 19,
            name: "Hero MotoCorp",
            symbol: "HEROMOTOCO",
            sector: "Automobile",
            currentPrice: 3456.80,
            openPrice: 3420.50,
            dayHigh: 3470.20,
            dayLow: 3410.80,
            volume: 1800000,
            change: 36.30,
            changePercent: 1.06,
            sentiment: "positive",
            sentimentScore: 65,
            sentimentBreakdown: { positive: 50, negative: 30, neutral: 20 },
            impactNews: [
                "Premium motorcycle launches",
                "Electric scooter plans",
                "Rural market expansion"
            ],
            relatedCompanies: ["MARUTI", "TATAMOTORS", "M&M"]
        },
        {
            id: 20,
            name: "Sun Pharmaceutical",
            symbol: "SUNPHARMA",
            sector: "Healthcare",
            currentPrice: 1234.50,
            openPrice: 1220.80,
            dayHigh: 1240.40,
            dayLow: 1215.60,
            volume: 4500000,
            change: 13.70,
            changePercent: 1.12,
            sentiment: "positive",
            sentimentScore: 70,
            sentimentBreakdown: { positive: 55, negative: 25, neutral: 20 },
            impactNews: [
                "US FDA approvals received",
                "Specialty drug launches",
                "R&D investments increase"
            ],
            relatedCompanies: ["DRREDDY", "CIPLA", "DIVISLAB"]
        },
        {
            id: 21,
            name: "Dr Reddy's",
            symbol: "DRREDDY",
            sector: "Healthcare",
            currentPrice: 5678.90,
            openPrice: 5650.20,
            dayHigh: 5690.80,
            dayLow: 5635.40,
            volume: 1200000,
            change: 28.70,
            changePercent: 0.51,
            sentiment: "positive",
            sentimentScore: 68,
            sentimentBreakdown: { positive: 55, negative: 25, neutral: 20 },
            impactNews: [
                "Generic drug approvals",
                "Emerging markets growth",
                "Biosimilar development"
            ],
            relatedCompanies: ["SUNPHARMA", "CIPLA", "DIVISLAB"]
        },
        {
            id: 22,
            name: "Cipla",
            symbol: "CIPLA",
            sector: "Healthcare",
            currentPrice: 1234.50,
            openPrice: 1220.80,
            dayHigh: 1240.40,
            dayLow: 1215.60,
            volume: 3200000,
            change: 13.70,
            changePercent: 1.12,
            sentiment: "positive",
            sentimentScore: 65,
            sentimentBreakdown: { positive: 50, negative: 30, neutral: 20 },
            impactNews: [
                "Respiratory portfolio growth",
                "US market expansion",
                "Innovation pipeline"
            ],
            relatedCompanies: ["SUNPHARMA", "DRREDDY", "DIVISLAB"]
        },
        {
            id: 23,
            name: "Divi's Laboratories",
            symbol: "DIVISLAB",
            sector: "Healthcare",
            currentPrice: 3456.70,
            openPrice: 3420.30,
            dayHigh: 3465.80,
            dayLow: 3415.20,
            volume: 800000,
            change: 36.40,
            changePercent: 1.06,
            sentiment: "positive",
            sentimentScore: 72,
            sentimentBreakdown: { positive: 58, negative: 22, neutral: 20 },
            impactNews: [
                "API manufacturing growth",
                "Custom synthesis projects",
                "Capacity expansion plans"
            ],
            relatedCompanies: ["SUNPHARMA", "DRREDDY", "CIPLA"]
        },
        {
            id: 24,
            name: "Larsen & Toubro",
            symbol: "LT",
            sector: "Infrastructure",
            currentPrice: 2345.60,
            openPrice: 2320.40,
            dayHigh: 2350.80,
            dayLow: 2315.20,
            volume: 2100000,
            change: 25.20,
            changePercent: 1.09,
            sentiment: "positive",
            sentimentScore: 75,
            sentimentBreakdown: { positive: 60, negative: 20, neutral: 20 },
            impactNews: [
                "Infrastructure projects win",
                "Defense contracts secured",
                "Digital transformation"
            ],
            relatedCompanies: ["ADANIENT", "ULTRACEMCO", "ACC"]
        },
        {
            id: 25,
            name: "UltraTech Cement",
            symbol: "ULTRACEMCO",
            sector: "Infrastructure",
            currentPrice: 8765.40,
            openPrice: 8700.20,
            dayHigh: 8780.80,
            dayLow: 8685.40,
            volume: 800000,
            change: 65.20,
            changePercent: 0.75,
            sentiment: "positive",
            sentimentScore: 68,
            sentimentBreakdown: { positive: 55, negative: 25, neutral: 20 },
            impactNews: [
                "Capacity expansion plans",
                "Green cement initiatives",
                "Market share growth"
            ],
            relatedCompanies: ["LT", "ADANIENT", "ACC"]
        }
    ];

    // Render portfolio grid
    function renderPortfolio() {
        const portfolioGrid = document.getElementById('portfolio-grid');
        portfolioGrid.innerHTML = '';

        companies.forEach(company => {
            const card = document.createElement('div');
            card.className = 'portfolio-card';
            card.innerHTML = `
                <div class="company-header">
                    <div class="company-info">
                        <h3>${company.name}</h3>
                        <div class="sector">${company.sector}</div>
                    </div>
                    <div class="stock-price">
                        <div class="current-price">₹${company.currentPrice.toLocaleString()}</div>
                        <div class="price-change ${company.change >= 0 ? 'positive' : 'negative'}">
                            ${company.change >= 0 ? '+' : ''}₹${company.change.toFixed(2)} (${company.changePercent >= 0 ? '+' : ''}${company.changePercent.toFixed(2)}%)
                        </div>
                    </div>
                </div>
                
                <div class="stock-details">
                    <div class="detail-item">
                        <span class="detail-label">Open</span>
                        <span class="detail-value">₹${company.openPrice.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">High</span>
                        <span class="detail-value">₹${company.dayHigh.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Low</span>
                        <span class="detail-value">₹${company.dayLow.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Volume</span>
                        <span class="detail-value">${(company.volume / 1000000).toFixed(1)}M</span>
                    </div>
                </div>

                ${company.impactNews.length > 0 ? `
                    <div class="impact-news">
                        <h4><i class="fas fa-exclamation-triangle"></i> Impact News</h4>
                        <div class="news-item">${company.impactNews[0]}</div>
                        ${company.impactNews.length > 1 ? `<div class="news-item">${company.impactNews[1]}</div>` : ''}
                    </div>
                ` : ''}

                <div class="sentiment-analysis">
                    <div class="sentiment-score ${company.sentiment}">
                        <div class="score">${company.sentimentScore}%</div>
                        <div class="label">${company.sentiment.charAt(0).toUpperCase() + company.sentiment.slice(1)}</div>
                    </div>
                    <div class="sentiment-breakdown">
                        <div class="sentiment-bars">
                            <div class="sentiment-bar positive-bar" style="width: ${company.sentimentBreakdown.positive}%"></div>
                            <div class="sentiment-bar negative-bar" style="width: ${company.sentimentBreakdown.negative}%"></div>
                            <div class="sentiment-bar neutral-bar" style="width: ${company.sentimentBreakdown.neutral}%"></div>
                        </div>
                        <div class="sentiment-labels">
                            <span>${company.sentimentBreakdown.positive}%</span>
                            <span>${company.sentimentBreakdown.negative}%</span>
                            <span>${company.sentimentBreakdown.neutral}%</span>
                        </div>
                    </div>
                </div>
            `;

            // Add click event for modal
            card.addEventListener('click', () => openCompanyModal(company));
            portfolioGrid.appendChild(card);
        });
    }

    // Modal functionality
    function openCompanyModal(company) {
        const modal = document.getElementById('company-modal');
        const modalContent = modal.querySelector('.modal-content');

        // Populate modal content
        document.getElementById('modal-company-name').textContent = company.name;
        document.getElementById('modal-current-price').textContent = `₹${company.currentPrice.toLocaleString()}`;
        document.getElementById('modal-price-change').textContent = `${company.change >= 0 ? '+' : ''}₹${company.change.toFixed(2)} (${company.changePercent >= 0 ? '+' : ''}${company.changePercent.toFixed(2)}%)`;
        document.getElementById('modal-price-change').className = `price-change ${company.change >= 0 ? 'positive' : 'negative'}`;

        // Stock details
        document.getElementById('modal-open-price').textContent = `₹${company.openPrice.toLocaleString()}`;
        document.getElementById('modal-current-price-detail').textContent = `₹${company.currentPrice.toLocaleString()}`;
        document.getElementById('modal-day-high').textContent = `₹${company.dayHigh.toLocaleString()}`;
        document.getElementById('modal-day-low').textContent = `₹${company.dayLow.toLocaleString()}`;
        document.getElementById('modal-volume').textContent = `${(company.volume / 1000000).toFixed(1)}M`;

        // Impact news
        const impactNewsContainer = document.getElementById('modal-impact-news');
        impactNewsContainer.innerHTML = '';
        company.impactNews.forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.textContent = news;
            impactNewsContainer.appendChild(newsItem);
        });

        // Sentiment analysis
        document.getElementById('modal-sentiment-score').textContent = `${company.sentimentScore}%`;
        document.getElementById('modal-sentiment-label').textContent = company.sentiment.charAt(0).toUpperCase() + company.sentiment.slice(1);
        document.getElementById('positive-bar').style.width = `${company.sentimentBreakdown.positive}%`;
        document.getElementById('negative-bar').style.width = `${company.sentimentBreakdown.negative}%`;
        document.getElementById('neutral-bar').style.width = `${company.sentimentBreakdown.neutral}%`;

        // Show modal
        modal.style.display = 'block';
        modalContent.style.animation = 'slideIn 0.3s ease-out';
    }

    // Close modal
    function closeModal() {
        const modal = document.getElementById('company-modal');
        modal.style.display = 'none';
    }

    // Search functionality
    function setupSearch() {
        const searchInput = document.getElementById('company-search');
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.portfolio-card');

            cards.forEach(card => {
                const companyName = card.querySelector('h3').textContent.toLowerCase();
                const sector = card.querySelector('.sector').textContent.toLowerCase();
                
                if (companyName.includes(searchTerm) || sector.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Filter functionality
    function setupFilters() {
        const sectorFilter = document.getElementById('sector-filter');
        const sentimentFilter = document.getElementById('sentiment-filter');

        function applyFilters() {
            const selectedSector = sectorFilter.value;
            const selectedSentiment = sentimentFilter.value;
            const cards = document.querySelectorAll('.portfolio-card');

            cards.forEach(card => {
                const sector = card.querySelector('.sector').textContent;
                const sentiment = card.querySelector('.sentiment-score').classList.contains('positive') ? 'positive' : 
                                card.querySelector('.sentiment-score').classList.contains('negative') ? 'negative' : 'neutral';

                const sectorMatch = !selectedSector || sector === selectedSector;
                const sentimentMatch = !selectedSentiment || sentiment === selectedSentiment;

                if (sectorMatch && sentimentMatch) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        sectorFilter.addEventListener('change', applyFilters);
        sentimentFilter.addEventListener('change', applyFilters);
    }

    // Initialize portfolio
    function initPortfolio() {
        renderPortfolio();
        setupSearch();
        setupFilters();

        // Modal close events
        document.querySelector('.close').addEventListener('click', closeModal);
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('company-modal');
            if (event.target === modal) {
                closeModal();
            }
        });

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .portfolio-card {
                animation: fadeIn 0.5s ease-in;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // Start auto-refresh
    function startAutoRefresh() {
        setInterval(() => {
            // Simulate real-time updates
            companies.forEach(company => {
                // Random price changes
                const change = (Math.random() - 0.5) * 20;
                company.currentPrice += change;
                company.change += change;
                company.changePercent = (company.change / (company.currentPrice - company.change)) * 100;
            });

            // Re-render with updated data
            renderPortfolio();
        }, 30000); // Update every 30 seconds
    }

    // Initialize everything
    initPortfolio();
    startAutoRefresh();
}); 