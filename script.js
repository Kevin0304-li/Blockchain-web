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