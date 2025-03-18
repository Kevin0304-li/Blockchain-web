// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Connect Wallet Button
const connectBtn = document.querySelector('.connect-btn');
connectBtn.addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            connectBtn.textContent = 'Connected';
            connectBtn.style.background = 'var(--secondary-color)';
        } catch (error) {
            console.error('User denied account access');
        }
    } else {
        alert('Please install MetaMask or another Web3 wallet to connect!');
    }
});

// Fetch real-time cryptocurrency prices
async function fetchCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true');
        const data = await response.json();
        
        // Update Bitcoin price
        const btcPrice = document.querySelector('.market-card:nth-child(1) .price');
        const btcChange = document.querySelector('.market-card:nth-child(1) .change');
        const btcVolume = document.querySelector('.market-card:nth-child(1) .volume');
        const btcMarketCap = document.querySelector('.market-card:nth-child(1) .market-cap');
        
        btcPrice.textContent = `$${data.bitcoin.usd.toLocaleString()}`;
        btcChange.textContent = `${data.bitcoin.usd_24h_change.toFixed(2)}%`;
        btcChange.className = `change ${data.bitcoin.usd_24h_change >= 0 ? 'positive' : 'negative'}`;
        btcVolume.textContent = `$${formatLargeNumber(data.bitcoin.usd_24h_vol)}`;
        btcMarketCap.textContent = `$${formatLargeNumber(data.bitcoin.usd_market_cap)}`;

        // Update Ethereum price
        const ethPrice = document.querySelector('.market-card:nth-child(2) .price');
        const ethChange = document.querySelector('.market-card:nth-child(2) .change');
        const ethVolume = document.querySelector('.market-card:nth-child(2) .volume');
        const ethMarketCap = document.querySelector('.market-card:nth-child(2) .market-cap');
        
        ethPrice.textContent = `$${data.ethereum.usd.toLocaleString()}`;
        ethChange.textContent = `${data.ethereum.usd_24h_change.toFixed(2)}%`;
        ethChange.className = `change ${data.ethereum.usd_24h_change >= 0 ? 'positive' : 'negative'}`;
        ethVolume.textContent = `$${formatLargeNumber(data.ethereum.usd_24h_vol)}`;
        ethMarketCap.textContent = `$${formatLargeNumber(data.ethereum.usd_market_cap)}`;

        // Update Cardano price
        const adaPrice = document.querySelector('.market-card:nth-child(3) .price');
        const adaChange = document.querySelector('.market-card:nth-child(3) .change');
        const adaVolume = document.querySelector('.market-card:nth-child(3) .volume');
        const adaMarketCap = document.querySelector('.market-card:nth-child(3) .market-cap');
        
        adaPrice.textContent = `$${data.cardano.usd.toLocaleString()}`;
        adaChange.textContent = `${data.cardano.usd_24h_change.toFixed(2)}%`;
        adaChange.className = `change ${data.cardano.usd_24h_change >= 0 ? 'positive' : 'negative'}`;
        adaVolume.textContent = `$${formatLargeNumber(data.cardano.usd_24h_vol)}`;
        adaMarketCap.textContent = `$${formatLargeNumber(data.cardano.usd_market_cap)}`;
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
    }
}

// Format large numbers to readable format (e.g. 1.2B, 350M)
function formatLargeNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(2);
}

// Update prices every 30 seconds
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 30000);

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    if (email) {
        alert('Thank you for subscribing! We\'ll keep you updated.');
        newsletterForm.reset();
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.feature-card, .market-card, .learn-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease-out';
    observer.observe(card);
});

// Chart Modal Functionality
let chartModal;
let chartModalClose;
let chartCanvas;
let priceChart;

// Create the chart modal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Create modal elements
    chartModal = document.createElement('div');
    chartModal.className = 'chart-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'chart-modal-content';
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'chart-modal-header';
    
    const modalTitle = document.createElement('h2');
    modalTitle.className = 'chart-modal-title';
    modalTitle.textContent = 'Price Chart';
    
    chartModalClose = document.createElement('span');
    chartModalClose.className = 'chart-modal-close';
    chartModalClose.innerHTML = '&times;';
    
    chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'price-chart';
    
    // Assemble modal structure
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(chartModalClose);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(chartCanvas);
    chartModal.appendChild(modalContent);
    
    // Add to document
    document.body.appendChild(chartModal);
    
    // Add event listeners
    chartModalClose.addEventListener('click', () => {
        chartModal.style.display = 'none';
        if (priceChart) {
            priceChart.destroy();
        }
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === chartModal) {
            chartModal.style.display = 'none';
            if (priceChart) {
                priceChart.destroy();
            }
        }
    });
    
    // Add event listeners to "View Chart" links
    const chartLinks = document.querySelectorAll('.chart-link');
    chartLinks.forEach((link, index) => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const coins = ['bitcoin', 'ethereum', 'cardano'];
            const coinName = coins[index];
            const coinDisplayNames = ['Bitcoin', 'Ethereum', 'Cardano'];
            
            showChart(coins[index], coinDisplayNames[index]);
        });
    });
});

// Function to generate fallback data when API fails
function generateFallbackData(coinId) {
    // Generate 30 days of mock data
    const prices = [];
    const labels = [];
    const today = new Date();
    
    // Seed values based on coin type
    let basePrice;
    let volatility;
    
    switch(coinId) {
        case 'bitcoin':
            basePrice = 50000;
            volatility = 1500;
            break;
        case 'ethereum':
            basePrice = 3000;
            volatility = 150;
            break;
        case 'cardano':
            basePrice = 0.5;
            volatility = 0.05;
            break;
        default:
            basePrice = 100;
            volatility = 10;
    }
    
    // Generate price points with random but somewhat realistic movements
    let currentPrice = basePrice;
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Add some randomness to price
        const change = (Math.random() - 0.5) * volatility;
        currentPrice = Math.max(currentPrice + change, basePrice * 0.7); // Prevent going too low
        prices.push(currentPrice);
    }
    
    return {
        prices: prices.map((price, index) => [Date.now() - (29 - index) * 86400000, price]),
        labels: labels
    };
}

// Function to fetch historical price data and display chart
async function showChart(coinId, coinName) {
    try {
        // Clear any previous chart elements
        while (chartCanvas.nextSibling) {
            if (chartCanvas.nextSibling.classList && 
                (chartCanvas.nextSibling.classList.contains('chart-price-info') || 
                chartCanvas.nextSibling.classList.contains('chart-error'))) {
                chartCanvas.nextSibling.remove();
            } else {
                break;
            }
        }
        
        // Reset canvas display in case it was hidden
        chartCanvas.style.display = 'block';
        
        // Show loading state
        chartModal.style.display = 'block';
        const modalTitle = document.querySelector('.chart-modal-title');
        modalTitle.textContent = `${coinName} Price Chart (Loading...)`;

        // Fetch historical price data with better error handling and retry logic
        let response;
        let data;
        let fetchSuccess = false;
        
        // First attempt with primary API endpoint
        try {
            response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30&interval=daily`);
            
            // Check if we got rate limited
            if (response.status === 429) {
                throw new Error('Rate limited');
            }
            
            data = await response.json();
            fetchSuccess = true;
        } catch (fetchError) {
            console.warn('Primary API fetch failed:', fetchError);
            
            // Try a fallback API or endpoint
            try {
                // Try with a different endpoint or with a proxy
                response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=14&interval=daily`);
                data = await response.json();
                fetchSuccess = true;
            } catch (fallbackError) {
                console.error('Fallback API fetch also failed:', fallbackError);
                
                // Generate fallback data as last resort
                console.warn('Using fallback generated data');
                const fallbackData = generateFallbackData(coinId);
                data = {
                    prices: fallbackData.prices
                };
                
                // Show indicator that data is simulated
                modalTitle.textContent = `${coinName} Price Chart (Simulated Data)`;
                fetchSuccess = true;
            }
        }
        
        if (!fetchSuccess || !data || !data.prices || data.prices.length === 0) {
            throw new Error('Invalid or empty price data received');
        }
        
        // Update modal title
        modalTitle.textContent = `${coinName} Price Chart (Last 30 Days)`;
        
        // Format data for chart
        const labels = data.prices.map(price => {
            const date = new Date(price[0]);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        const prices = data.prices.map(price => price[1]);
        
        // Create or update chart
        if (priceChart) {
            priceChart.destroy();
        }
        
        // Calculate min and max for better Y-axis scaling
        const minPrice = Math.min(...prices) * 0.95; // Add 5% padding below
        const maxPrice = Math.max(...prices) * 1.05; // Add 5% padding above
        
        // Get coin symbol for better labeling
        const coinSymbols = {
            'bitcoin': 'BTC',
            'ethereum': 'ETH',
            'cardano': 'ADA'
        };
        const symbol = coinSymbols[coinId] || '';
        
        // Set up the dark background
        chartModal.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        const modalContent = document.querySelector('.chart-modal-content');
        modalContent.style.backgroundColor = '#0e1217';
        modalContent.style.color = '#ffffff';
        
        // Create chart with adjusted maintainAspectRatio
        const ctx = chartCanvas.getContext('2d');
        
        // Create gradient for DeFiLlama style
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(56, 97, 251, 0.8)');
        gradient.addColorStop(1, 'rgba(56, 97, 251, 0.1)');
        
        priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${coinName} (${symbol}) Price`,
                    data: prices,
                    borderColor: 'rgb(56, 97, 251)',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    tooltip: {
                        backgroundColor: 'rgba(14, 18, 23, 0.9)',
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        padding: 10,
                        borderColor: 'rgba(56, 97, 251, 0.3)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            title: function(tooltipItems) {
                                return tooltipItems[0].label;
                            },
                            label: function(context) {
                                const value = context.parsed.y;
                                let formattedValue;
                                
                                // Format based on price magnitude
                                if (value < 1) {
                                    formattedValue = value.toFixed(4);
                                } else if (value < 1000) {
                                    formattedValue = value.toFixed(2);
                                } else {
                                    formattedValue = value.toLocaleString('en-US', { 
                                        minimumFractionDigits: 2, 
                                        maximumFractionDigits: 2 
                                    });
                                }
                                
                                return `$${formattedValue}`;
                            }
                        }
                    },
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: 'rgba(255, 255, 255, 0.5)',
                            maxRotation: 0,
                            minRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        border: {
                            dash: [5, 5]
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: 'rgba(255, 255, 255, 0.5)',
                            padding: 8,
                            callback: function(value) {
                                if (value >= 1000000000) {
                                    return (value / 1000000000).toFixed(0) + 'b USD';
                                } else if (value >= 1000000) {
                                    return (value / 1000000).toFixed(0) + 'm USD';
                                }
                                return value + ' USD';
                            }
                        }
                    }
                },
                hover: {
                    mode: 'index',
                    intersect: false
                },
                animation: {
                    duration: 800,
                    easing: 'easeOutQuart'
                },
                elements: {
                    point: {
                        hoverRadius: 7,
                        hitRadius: 30
                    }
                },
                layout: {
                    padding: { 
                        bottom: 10
                    }
                }
            }
        });
        
        // Create compact price summary with DeFiLlama styled colors
        const chartInfoEl = document.createElement('div');
        chartInfoEl.className = 'chart-price-info';
        chartInfoEl.style.backgroundColor = '#0e1217';
        chartInfoEl.style.color = '#ffffff';
        chartInfoEl.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
        
        // Format min/max prices
        const formatPrice = (price) => {
            if (price < 1) return '$' + price.toFixed(4);
            if (price < 1000) return '$' + price.toFixed(2);
            return '$' + price.toLocaleString('en-US', {maximumFractionDigits: 2});
        };
        
        const minPriceFormatted = formatPrice(Math.min(...prices));
        const maxPriceFormatted = formatPrice(Math.max(...prices));
        const startPrice = prices[0];
        const endPrice = prices[prices.length - 1];
        const priceChange = endPrice - startPrice;
        const changePercent = ((endPrice - startPrice) / startPrice * 100).toFixed(2);
        const changeClass = priceChange >= 0 ? 'positive' : 'negative';
        const changeSign = priceChange >= 0 ? '+' : '';
        
        chartInfoEl.innerHTML = `
            <div class="chart-price-summary">
                <div class="chart-price-range">
                    <span>Range:</span> 
                    <span class="min-price">${minPriceFormatted}</span> - 
                    <span class="max-price">${maxPriceFormatted}</span>
                </div>
                <div class="chart-price-change ${changeClass}">
                    <span>30d:</span> 
                    <span>${changeSign}${changePercent}%</span>
                </div>
            </div>
        `;
        
        // Remove any existing chart info
        const existingInfo = document.querySelector('.chart-price-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        // Add new info after the canvas
        chartCanvas.parentNode.insertBefore(chartInfoEl, chartCanvas.nextSibling);
        
    } catch (error) {
        console.error('Error fetching chart data:', error);
        const modalTitle = document.querySelector('.chart-modal-title');
        modalTitle.textContent = `Error loading chart data`;
        
        // Show more compact error message with DeFiLlama style
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chart-error';
        errorDiv.style.backgroundColor = '#0e1217';
        errorDiv.style.color = '#ffffff';
        errorDiv.style.padding = '20px';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.margin = '20px auto';
        errorDiv.style.maxWidth = '80%';
        errorDiv.style.textAlign = 'center';
        
        // Create error message with a retry button
        errorDiv.innerHTML = `
            <div style="margin-bottom: 15px;">
                <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #ff6b6b; margin-bottom: 15px;"></i>
                <p style="font-size: 18px; margin: 10px 0;">Sorry, we couldn't load the price data.</p>
                <p style="color: #999; margin-bottom: 20px;">Please try again later.</p>
            </div>
            <button id="retry-chart-btn" style="background: #3861fb; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500;">Try Again</button>
        `;
        
        // Replace canvas with error message
        chartCanvas.style.display = 'none';
        chartCanvas.parentNode.appendChild(errorDiv);
        
        // Add retry functionality
        setTimeout(() => {
            const retryBtn = document.getElementById('retry-chart-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    // Remove error message
                    errorDiv.remove();
                    // Try loading the chart again
                    showChart(coinId, coinName);
                });
            }
        }, 0);
    }
}

// Resources toggle functionality - simplified version
document.addEventListener('DOMContentLoaded', function() {
    // Add the toggle functionality directly to each toggle element
    const resourceToggles = document.querySelectorAll('.resources-toggle');
    
    if (resourceToggles.length > 0) {
        resourceToggles.forEach(toggle => {
            const content = toggle.nextElementSibling;
            const icon = toggle.querySelector('.toggle-icon i');
            
            // Initialize all to hidden
            if (content) {
                content.style.display = 'none';
            }
            
            // Add click handler
            toggle.onclick = function() {
                if (content.style.display === 'block') {
                    content.style.display = 'none';
                    icon.className = 'fas fa-chevron-down';
                } else {
                    content.style.display = 'block';
                    icon.className = 'fas fa-chevron-up';
                }
            };
        });
    }
}); 