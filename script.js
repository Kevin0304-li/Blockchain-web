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
            
            showChart(coinName, coinDisplayNames[index]);
        });
    });
});

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

        // Fetch historical price data
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30&interval=daily`);
        const data = await response.json();
        
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
        
        // Determine chart color based on price trend
        const startPrice = prices[0];
        const endPrice = prices[prices.length - 1];
        const priceChange = endPrice - startPrice;
        const chartColor = priceChange >= 0 ? 'rgba(46, 213, 115, 1)' : 'rgba(235, 77, 75, 1)';
        const chartBgColor = priceChange >= 0 ? 'rgba(46, 213, 115, 0.1)' : 'rgba(235, 77, 75, 0.1)';
        
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
        
        // Create chart with adjusted maintainAspectRatio
        const ctx = chartCanvas.getContext('2d');
        priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${coinName} (${symbol}) Price`,
                    data: prices,
                    borderColor: chartColor,
                    backgroundColor: chartBgColor,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: chartColor,
                    pointHoverBackgroundColor: '#FFFFFF',
                    pointHoverBorderWidth: 2,
                    pointHoverBorderColor: chartColor,
                    fill: true,
                    tension: 0.2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // This is important to ensure chart fits container
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        padding: 10,
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
                                
                                return `Price: $${formattedValue}`;
                            },
                            afterLabel: function(context) {
                                // Show percent change from start if available
                                if (context.dataIndex > 0) {
                                    const currentValue = context.parsed.y;
                                    const firstValue = prices[0];
                                    const percentChange = ((currentValue - firstValue) / firstValue) * 100;
                                    const sign = percentChange >= 0 ? '+' : '';
                                    return `${sign}${percentChange.toFixed(2)}% from start`;
                                }
                                return '';
                            }
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            maxRotation: 45,
                            minRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 12
                        }
                    },
                    y: {
                        min: minPrice,
                        max: maxPrice,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        border: {
                            dash: [5, 5]
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            padding: 8,
                            callback: function(value) {
                                // Format price labels based on magnitude
                                if (value < 1) {
                                    return '$' + value.toFixed(4);
                                } else if (value < 10) {
                                    return '$' + value.toFixed(2);
                                } else if (value < 1000) {
                                    return '$' + value.toFixed(0);
                                } else if (value < 1000000) {
                                    return '$' + (value / 1000).toFixed(1) + 'K';
                                } else {
                                    return '$' + (value / 1000000).toFixed(1) + 'M';
                                }
                            }
                        }
                    }
                },
                hover: {
                    mode: 'index',
                    intersect: false
                },
                animation: {
                    duration: 800, // Slightly faster animation
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
        
        // Create compact price summary
        const chartInfoEl = document.createElement('div');
        chartInfoEl.className = 'chart-price-info';
        
        // Format min/max prices
        const formatPrice = (price) => {
            if (price < 1) return '$' + price.toFixed(4);
            if (price < 1000) return '$' + price.toFixed(2);
            return '$' + price.toLocaleString('en-US', {maximumFractionDigits: 2});
        };
        
        const minPriceFormatted = formatPrice(Math.min(...prices));
        const maxPriceFormatted = formatPrice(Math.max(...prices));
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
        
        // Show more compact error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chart-error';
        errorDiv.innerHTML = `
            <p>Sorry, we couldn't load the price data.</p>
            <p>Please try again later.</p>
        `;
        
        // Replace canvas with error message
        chartCanvas.style.display = 'none';
        chartCanvas.parentNode.appendChild(errorDiv);
    }
}

// Resources toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking for resource toggles');
    
    // Initialize resource toggles if they exist
    const resourceToggles = document.querySelectorAll('.resources-toggle');
    console.log('Found resource toggles:', resourceToggles.length);
    
    if (resourceToggles.length > 0) {
        resourceToggles.forEach(toggle => {
            // Get the content section that follows this toggle
            const content = toggle.nextElementSibling;
            
            // Initialize all content sections to be hidden
            if (content && content.classList.contains('resources-content')) {
                content.style.display = 'none';
                console.log('Initialized a resource toggle section to hidden');
            }
            
            // Add click event listener
            toggle.addEventListener('click', function() {
                console.log('Toggle clicked');
                
                // Get the content section and icon
                const content = this.nextElementSibling;
                const toggleIcon = this.querySelector('.toggle-icon i');
                
                if (!content || !toggleIcon) {
                    console.error('Missing content or toggle icon element');
                    return;
                }
                
                // Toggle visibility
                if (content.style.display === 'block') {
                    console.log('Hiding content');
                    content.style.display = 'none';
                    toggleIcon.classList.remove('fa-chevron-up');
                    toggleIcon.classList.add('fa-chevron-down');
                } else {
                    console.log('Showing content');
                    content.style.display = 'block';
                    toggleIcon.classList.remove('fa-chevron-down');
                    toggleIcon.classList.add('fa-chevron-up');
                }
            });
        });
    }
}); 