const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Ensure assets directory exists
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Resources mapping
const resources = {
  // Getting Started
  'blockchain-basics': {
    image: 'https://www.investopedia.com/thmb/O38COhzRZ5_P1qjUJvHC5kNSn5c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Blockchain_final-086b5204fe4b4d40814559cf27b9c193.png',
    link: 'https://www.investopedia.com/terms/b/blockchain.asp'
  },
  'cryptography': {
    image: 'https://www.techtarget.com/searchsecurity/wp-content/uploads/sites/14/2021/11/encryption.jpg',
    link: 'https://www.techtarget.com/searchsecurity/definition/cryptography'
  },
  'consensus': {
    image: 'https://101blockchains.com/wp-content/uploads/2020/01/Consensus_algorithm_blockchain.png',
    link: 'https://ethereum.org/en/developers/docs/consensus-mechanisms/'
  },

  // Smart Contracts
  'solidity': {
    image: 'https://soliditylang.org/images/socialcard.jpg',
    link: 'https://soliditylang.org/'
  },
  'rust': {
    image: 'https://www.rust-lang.org/static/images/rust-social-wide.jpg',
    link: 'https://www.rust-lang.org/'
  },
  'security': {
    image: 'https://www.immunebytes.com/blog/wp-content/uploads/2023/02/Smart-contract-security-audits-1400x651.jpg',
    link: 'https://consensys.io/diligence/blog/2019/09/stop-using-soliditys-transfer-now/'
  },
  'truffle': {
    image: 'https://trufflesuite.com/img/truffle-logo-dark.svg',
    link: 'https://trufflesuite.com/'
  },
  'hardhat': {
    image: 'https://hardhat.org/_next/static/media/hardhat-logo.5c5f687b.svg',
    link: 'https://hardhat.org/'
  },
  'remix': {
    image: 'https://remix-project.org/img/wordmarkLight.png',
    link: 'https://remix.ethereum.org/'
  },
  'anchor': {
    image: 'https://www.anchor-lang.com/_next/image?url=%2Flogo.png&w=256&q=75',
    link: 'https://www.anchor-lang.com/'
  },
  'ethereum': {
    image: 'https://ethereum.org/static/a110735dade3f354a46fc2446cd52476/f3a29/ethereum-logo-portrait-black-gray.webp',
    link: 'https://ethereum.org/'
  },
  'solana': {
    image: 'https://solana.com/_next/static/media/logotype.e4df684f.svg',
    link: 'https://solana.com/'
  },
  'polkadot': {
    image: 'https://polkadot.network/assets/img/logo-polkadot.svg',
    link: 'https://polkadot.network/'
  },

  // DeFi
  'yield-farming': {
    image: 'https://assets-global.website-files.com/64d1e7a51a22b6ca07db7d26/64e380f648ce9db8f58c4e9b_Liquidity-Farming-Guide.jpg',
    link: 'https://ethereum.org/en/defi/#yield-farming'
  },
  'dex': {
    image: 'https://d1-invdn-com.investing.com/content/pic7dc71a7d71f94663a28472711e7bfce3.jpg',
    link: 'https://ethereum.org/en/defi/#dex'
  },
  'lending': {
    image: 'https://cryptonews.com/wp-content/uploads/2023/06/defi-lending.jpg',
    link: 'https://ethereum.org/en/defi/#lending'
  },
  'aave': {
    image: 'https://aave.com/_next/static/media/aave.aea953c6.svg',
    link: 'https://aave.com/'
  },
  'uniswap': {
    image: 'https://uniswap.org/images/twitter-card.jpg',
    link: 'https://uniswap.org/'
  },
  'compound': {
    image: 'https://compound.finance/images/compound-logo.svg',
    link: 'https://compound.finance/'
  },
  'makerdao': {
    image: 'https://makerdao.com/dai-logo.svg',
    link: 'https://makerdao.com/'
  }
};

// Download image utility function
function downloadImage(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${destination}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {});
      console.error(`Error downloading ${url}: ${err.message}`);
      reject(err);
    });
  });
}

// Main function to download all resources
async function downloadResources() {
  console.log('Starting download of blockchain resources...');
  
  // Create necessary directories
  const dirs = [
    path.join(assetsDir, 'blockchain'),
    path.join(assetsDir, 'smart-contracts'),
    path.join(assetsDir, 'defi'),
    path.join(assetsDir, 'tools'),
    path.join(assetsDir, 'platforms')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Download all images
  const downloadPromises = [];

  for (const [key, resource] of Object.entries(resources)) {
    let category = '';
    if (['blockchain-basics', 'cryptography', 'consensus'].includes(key)) {
      category = 'blockchain';
    } else if (['solidity', 'rust', 'security'].includes(key)) {
      category = 'smart-contracts';
    } else if (['truffle', 'hardhat', 'remix', 'anchor'].includes(key)) {
      category = 'tools';
    } else if (['ethereum', 'solana', 'polkadot'].includes(key)) {
      category = 'platforms';
    } else {
      category = 'defi';
    }

    const extension = path.extname(new URL(resource.image).pathname) || '.jpg';
    const destination = path.join(assetsDir, category, `${key}${extension}`);
    
    downloadPromises.push(downloadImage(resource.image, destination));
  }

  try {
    await Promise.all(downloadPromises);
    console.log('All resources downloaded successfully!');
    
    // Update HTML files with resource links
    console.log('Updating HTML files with resource links...');
    updateHTMLFiles();
    
    console.log('Resource download and link updates completed successfully!');
  } catch (error) {
    console.error('Error downloading resources:', error);
  }
}

// Update HTML files with resource links
function updateHTMLFiles() {
  // Paths to update
  const filesToUpdate = [
    'resources/getting-started/index.html',
    'resources/smart-contracts/index.html',
    'resources/defi/index.html',
    'resources/getting-started/blockchain-basics.html'
  ];

  filesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Update image paths and add links to resources
      for (const [key, resource] of Object.entries(resources)) {
        let category = '';
        if (['blockchain-basics', 'cryptography', 'consensus'].includes(key)) {
          category = 'blockchain';
        } else if (['solidity', 'rust', 'security'].includes(key)) {
          category = 'smart-contracts';
        } else if (['truffle', 'hardhat', 'remix', 'anchor'].includes(key)) {
          category = 'tools';
        } else if (['ethereum', 'solana', 'polkadot'].includes(key)) {
          category = 'platforms';
        } else {
          category = 'defi';
        }
        
        const extension = path.extname(new URL(resource.image).pathname) || '.jpg';
        const imagePath = `../../assets/${category}/${key}${extension}`;
        
        // Update image src
        const imgRegex = new RegExp(`src="[^"]*${key}\\.(jpg|png|svg)"`, 'g');
        content = content.replace(imgRegex, `src="${imagePath}"`);
        
        // Add resource link
        const cardRegex = new RegExp(`<h3>${key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ')}</h3>`, 'gi');
        if (cardRegex.test(content)) {
          const learnMoreRegex = new RegExp(`<a href="[^"]*${key}\\.html" class="resource-button">[^<]*</a>`, 'g');
          content = content.replace(learnMoreRegex, match => {
            return match + `\n<a href="${resource.link}" class="external-resource" target="_blank">Official Resource <i class="fas fa-external-link-alt"></i></a>`;
          });
        }
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
    }
  });
}

// Run the main function
downloadResources(); 