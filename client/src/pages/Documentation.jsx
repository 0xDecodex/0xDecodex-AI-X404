import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Book, 
  Code, 
  Terminal, 
  Zap,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  FileText,
  Settings,
  CreditCard,
  Shield
} from 'lucide-react'

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [copiedCode, setCopiedCode] = useState('')

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      content: {
        title: 'Quick Start Guide',
        description: 'Learn how to use AI services with x402 automatic payments',
        subsections: [
          {
            title: 'Introduction',
            content: `
0xDecodex x402 is a platform that offers artificial intelligence services 
with automatic payments using the x402 protocol on the Base network. Each service is paid 
automatically per use, without the need for subscriptions or complex configurations.

## Main Features

- **Automatic Payments**: Uses x402 for instant micropayments
- **Base Network**: Fast and economical transactions
- **AI Services**: Text analysis, image processing, OCR and more
- **RESTful API**: Easy integration with any application
- **Analytics**: Real-time monitoring of usage and performance
            `
          },
          {
            title: 'Initial Setup',
            content: `
## Requirements

1. **Compatible Wallet**: MetaMask or another Base-compatible wallet
2. **Base Network Funds**: ETH on Base network for payments
3. **API Key** (optional): For premium services

## Environment Setup

\`\`\`bash
# Clone the repository
git clone https://github.com/your-repo/0xdecodex-x402
cd 0xdecodex-x402

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
\`\`\`

## Environment Variables

\`\`\`env
# Server Configuration
PORT=3001
NODE_ENV=production

# x402 Configuration
X402_FACILITATOR_URL=https://facilitator.base.network
X402_NETWORK=base
X402_AUTO_APPROVE=true

# Base Network
BASE_RPC_URL=https://mainnet.base.org
BASE_CHAIN_ID=8453
\`\`\`
            `
          }
        ]
      }
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: Code,
      content: {
        title: 'API Reference',
      description: 'Complete documentation of all available endpoints',
        subsections: [
          {
            title: 'Authentication',
            content: `
## x402 Authentication

All services require automatic payment using x402. You don't need traditional API keys,
just a wallet with funds on Base.

### Required Headers

\`\`\`http
Content-Type: multipart/form-data
X-Wallet-Address: 0x... (optional)
\`\`\`

### Payment Flow

1. **Request**: Send request to service
2. **Payment Required**: If no valid payment, receive 402 with instructions
3. **Payment**: Your wallet processes payment automatically
4. **Service**: Service executes and returns result
            `
          },
          {
            title: 'Service Endpoints',
            content: `
## Sentiment Analysis

Analyze the sentiment of text.

\`\`\`http
POST /api/services/text-analysis
Content-Type: multipart/form-data

text=Your text here
\`\`\`

**Response:**
\`\`\`json
{
  "sentiment": "positive",
  "score": 0.8,
  "confidence": 0.95,
  "analysis": {
    "positive": 0.8,
    "negative": 0.1,
    "neutral": 0.1
  }
}
\`\`\`

## Image Resize

Resize an image.

\`\`\`http
POST /api/services/image-resize
Content-Type: multipart/form-data

image=@image.jpg
width=800
height=600
\`\`\`

**Response:** Resized image (binary)

## OCR (Text Recognition)

Extract text from an image.

\`\`\`http
POST /api/services/ocr
Content-Type: multipart/form-data

image=@document.jpg
\`\`\`

**Response:**
\`\`\`json
{
  "text": "Extracted text from image",
  "confidence": 0.92,
  "words": [
    {
      "text": "Extracted",
      "confidence": 0.95,
      "bbox": [10, 20, 50, 40]
    }
  ]
}
\`\`\`

## Text Translation

Translate text between languages.

\`\`\`http
POST /api/services/text-translate
Content-Type: multipart/form-data

text=Hello world
from=en
to=es
\`\`\`

**Response:**
\`\`\`json
{
  "translatedText": "Hola mundo",
  "sourceLanguage": "en",
  "targetLanguage": "es",
  "confidence": 0.98
}
\`\`\`

## Image Optimization

Optimize an image by reducing its size.

\`\`\`http
POST /api/services/image-optimize
Content-Type: multipart/form-data

image=@image.jpg
quality=80
\`\`\`

**Response:** Optimized image (binary)
            `
          }
        ]
      }
    },
    {
      id: 'examples',
      title: 'Examples',
      icon: Terminal,
      content: {
        title: 'Code Examples',
      description: 'Practical examples in different programming languages',
        subsections: [
          {
            title: 'JavaScript',
            content: `
## Using Fetch API

\`\`\`javascript
async function analyzeText(text) {
  try {
    const formData = new FormData();
    formData.append('text', text);

    const response = await fetch('/api/services/text-analysis', {
      method: 'POST',
      body: formData
    });

    if (response.status === 402) {
      // Handle payment required
      const paymentInfo = await response.json();
      return;
    }

    const result = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

## Image Processing

\`\`\`javascript
async function resizeImage(file, width, height) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('width', width);
  formData.append('height', height);

  const response = await fetch('/api/services/image-resize', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    const blob = await response.blob();
    return blob;
  }
}
\`\`\`

## Using Axios

\`\`\`javascript
import axios from 'axios';

// Configure interceptor to handle x402 payments
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 402) {
      // Here you can integrate with your wallet
    }
    return Promise.reject(error);
  }
);

// Use service
async function translateText(text, from, to) {
  try {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('from', from);
    formData.append('to', to);

    const response = await axios.post('/api/services/text-translate', formData);
    return response.data;
  } catch (error) {
    console.error('Translation error:', error);
  }
}
\`\`\`
            `
          },
          {
            title: 'Python',
            content: `
## Using Requests

\`\`\`python
import requests
import json

class AIServicesClient:
    def __init__(self, base_url="http://localhost:3001"):
        self.base_url = base_url
        
    def analyze_sentiment(self, text):
        """Analyze text sentiment"""
        url = f"{self.base_url}/api/services/text-analysis"
        files = {'text': (None, text)}
        
        response = requests.post(url, files=files)
        
        if response.status_code == 402:
            print("Payment required:", response.json())
            return None
            
        return response.json()
    
    def resize_image(self, image_path, width, height):
        """Resize image"""
        url = f"{self.base_url}/api/services/image-resize"
        
        with open(image_path, 'rb') as f:
            files = {
                'image': f,
                'width': (None, str(width)),
                'height': (None, str(height))
            }
            
            response = requests.post(url, files=files)
            
            if response.status_code == 200:
                return response.content
            elif response.status_code == 402:
                print("Payment required:", response.json())
                
        return None
    
    def ocr_image(self, image_path):
        """Extract text from image"""
        url = f"{self.base_url}/api/services/ocr"
        
        with open(image_path, 'rb') as f:
            files = {'image': f}
            response = requests.post(url, files=files)
            
            if response.status_code == 200:
                return response.json()
                
        return None

# Usage
client = AIServicesClient()

# Analyze sentiment
result = client.analyze_sentiment("I love this service!")
print(f"Sentiment: {result['sentiment']}")

# OCR
text_result = client.ocr_image("document.jpg")
print(f"Extracted text: {text_result['text']}")
\`\`\`
            `
          },
          {
            title: 'cURL',
            content: `
## Examples with cURL

### Text Analysis
\`\`\`bash
curl -X POST http://localhost:3001/api/services/text-analysis \\
  -F "text=This is an amazing product!"
\`\`\`

### Image Resize
\`\`\`bash
curl -X POST http://localhost:3001/api/services/image-resize \\
  -F "image=@image.jpg" \\
  -F "width=800" \\
  -F "height=600" \\
  --output resized_image.jpg
\`\`\`

### OCR
\`\`\`bash
curl -X POST http://localhost:3001/api/services/ocr \\
  -F "image=@document.jpg"
\`\`\`

### Text Translation
\`\`\`bash
curl -X POST http://localhost:3001/api/services/text-translate \\
  -F "text=Hello world" \\
  -F "from=en" \\
  -F "to=es"
\`\`\`

### Image Analysis
\`\`\`bash
curl -X POST http://localhost:3001/api/services/image-analysis \\
  -F "image=@photo.jpg"
\`\`\`

### Handling 402 Payment Required
\`\`\`bash
# If payment is required, you'll receive a 402 response
curl -X POST http://localhost:3001/api/services/text-analysis \\
  -F "text=Sample text" \\
  -w "%{http_code}" \\
  -s -o response.json

# Check the response code
if [ "$(cat response.json | jq -r '.status')" = "402" ]; then
  echo "Payment required"
  cat response.json | jq '.payment'
fi
\`\`\`
            `
          }
        ]
      }
    },
    {
      id: 'x402-integration',
      title: 'x402 Integration',
      icon: CreditCard,
      content: {
        title: 'x402 Integration',
      description: 'How the automatic payment system works',
        subsections: [
          {
            title: 'What is x402?',
            content: `
## x402 Protocol

x402 is a micropayment protocol that enables automatic payments for web services.
It allows instant, frictionless transactions without prior configuration.

## Key Benefits

- **Micropayments**: Payments of cents per use
- **Automatic**: No manual intervention required
- **Instant**: Immediate transaction processing
- **Secure**: Based on blockchain (Base Network)
- **No Subscriptions**: Pay only for what you use

## Payment Flow

1. **Service Request**: Make request to service endpoint
2. **Check Payment**: Server verifies existing payment
3. **Payment Required**: If no payment, returns 402 with instructions
4. **Auto Payment**: Wallet processes payment automatically
5. **Service Execution**: Service executes after payment confirmation
6. **Response**: Client receives result
            `
          },
          {
            title: 'Wallet Configuration',
            content: `
## Configure MetaMask for Base

### 1. Add Base Network

\`\`\`javascript
// Base network configuration
const baseNetwork = {
  chainId: '0x2105', // 8453 in hex
  chainName: 'Base',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org']
};

// Add network to MetaMask
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [baseNetwork]
});
\`\`\`

### 2. Get ETH on Base

- **Bridge**: Use the official Base bridge
- **Exchange**: Buy ETH directly on Base
- **Faucet**: For testnet, use Base Goerli faucets

### 3. Configure x402

\`\`\`javascript
// x402 configuration in your application
const x402Config = {
  facilitatorUrl: 'https://facilitator.base.network',
  network: 'base',
  walletAddress: '0x...', // Your address
  autoApprove: true // Automatically approve payments
};
\`\`\`
            `
          },
          {
            title: 'Custom Implementation',
            content: `
## Integrate x402 in your Application

### Client (Frontend)

\`\`\`javascript
class X402Client {
  constructor(config) {
    this.config = config;
    this.wallet = window.ethereum;
  }
  
  async makeRequest(url, options = {}) {
    let response = await fetch(url, options);
    
    if (response.status === 402) {
      const paymentInfo = await response.json();
      await this.processPayment(paymentInfo);
      
      // Retry request after payment
      response = await fetch(url, options);
    }
    
    return response;
  }
  
  async processPayment(paymentInfo) {
    const { amount, currency, recipient } = paymentInfo.payment;
    
    // Process payment with MetaMask
    const txHash = await this.wallet.request({
      method: 'eth_sendTransaction',
      params: [{
        from: this.config.walletAddress,
        to: recipient,
        value: this.toHex(amount),
        gas: '0x5208' // 21000 gas
      }]
    });
    
    // Wait for confirmation
    await this.waitForConfirmation(txHash);
  }
  
  toHex(amount) {
    return '0x' + parseInt(amount * 1e18).toString(16);
  }
  
  async waitForConfirmation(txHash) {
    // Implement waiting logic
    return new Promise((resolve) => {
      const checkConfirmation = async () => {
        const receipt = await this.wallet.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });
        
        if (receipt) {
          resolve(receipt);
        } else {
          setTimeout(checkConfirmation, 1000);
        }
      };
      
      checkConfirmation();
    });
  }
}

// Usage
const client = new X402Client({
  walletAddress: '0x...',
  facilitatorUrl: 'https://facilitator.base.network'
});

// Make request with automatic payment
const response = await client.makeRequest('/api/services/text-analysis', {
  method: 'POST',
  body: formData
});
\`\`\`

### Server (Backend)

\`\`\`javascript
const express = require('express');
const { X402Middleware } = require('./x402-middleware');

const app = express();

// Configure x402 middleware
const x402 = new X402Middleware({
  facilitatorUrl: process.env.X402_FACILITATOR_URL,
  walletAddress: process.env.WALLET_ADDRESS,
  privateKey: process.env.WALLET_PRIVATE_KEY
});

// Apply to routes that require payment
app.post('/api/services/:serviceId', 
  x402.requirePayment({ amount: 0.001, currency: 'ETH' }),
  (req, res) => {
    // Service logic
    res.json({ result: 'success' });
  }
);
\`\`\`
            `
          }
        ]
      }
    },
    {
      id: 'deployment',
      title: 'Deployment',
      icon: Settings,
      content: {
        title: 'Deployment Guide',
        description: 'How to deploy the application in production',
        subsections: [
          {
            title: 'Preparation',
            content: `
## Checklist Pre-Deployment

### 1. Environment Variables
- [ ] Configure all production variables
- [ ] Use mainnet URLs (not testnet)
- [ ] Configure secure private keys
- [ ] Set rate limiting limits

### 2. Security
- [ ] Enable HTTPS
- [ ] Configure CORS appropriately
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Configure security headers

### 3. Performance
- [ ] Optimize images and assets
- [ ] Configure gzip compression
- [ ] Implement caching
- [ ] Configure CDN if necessary

### 4. Monitoring
- [ ] Configure logs
- [ ] Implement health checks
- [ ] Configure alerts
- [ ] Monitor metrics
            `
          },
          {
            title: 'Docker',
            content: `
## Dockerfile

\`\`\`dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build client
RUN npm run build:client

# Production
FROM node:18-alpine AS production

WORKDIR /app

# Copy production dependencies
COPY --from=builder /app/server/package*.json ./
RUN npm ci --only=production

# Copy application
COPY --from=builder /app/server ./
COPY --from=builder /app/client/dist ./public

# Non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3001

CMD ["node", "index.js"]
\`\`\`

## docker-compose.yml

\`\`\`yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - X402_FACILITATOR_URL=https://facilitator.base.network
      - BASE_RPC_URL=https://mainnet.base.org
    env_file:
      - .env.production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
\`\`\`
            `
          },
          {
            title: 'Vercel/Netlify',
            content: `
## Vercel Deployment

### 1. vercel.json Configuration

\`\`\`json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
\`\`\`

### 2. Build Scripts

\`\`\`json
{
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm run build",
    "build:server": "cd server && npm run build",
    "vercel-build": "npm run build"
  }
}
\`\`\`

### 3. Environment Variables

Configure in the Vercel dashboard:
- \`X402_FACILITATOR_URL\`
- \`WALLET_ADDRESS\`
- \`WALLET_PRIVATE_KEY\`
- \`BASE_RPC_URL\`
- \`OPENAI_API_KEY\` (optional)

## Railway Deployment

### 1. railway.json

\`\`\`json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
\`\`\`

### 2. Nixpacks.toml

\`\`\`toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "npm-8_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
\`\`\`
            `
          }
        ]
      }
    }
  ]

  const CodeBlock = ({ code, language = 'javascript', id }) => (
    <div className="relative bg-slate-800 rounded-lg overflow-hidden my-4 shadow-lg">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-700 border-b border-slate-600">
        <span className="text-xs text-slate-400 font-medium">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
        >
          {copiedCode === id ? (
            <Check className="h-3 w-3 text-green-400" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span className="text-xs">{copiedCode === id ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-xs leading-relaxed">
        <code className="text-slate-300">{code}</code>
      </pre>
    </div>
  )

  const renderContent = (content) => {
    const lines = content.split('\n')
    const result = []
    let currentCodeBlock = null
    let currentLanguage = 'text'
    let inCodeBlock = false

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // Close code block
          result.push(
            <CodeBlock
              key={`code-${index}`}
              code={currentCodeBlock.join('\n')}
              language={currentLanguage}
              id={`code-${index}`}
            />
          )
          currentCodeBlock = null
          inCodeBlock = false
        } else {
          // Open code block
          currentLanguage = line.replace('```', '') || 'text'
          currentCodeBlock = []
          inCodeBlock = true
        }
      } else if (inCodeBlock) {
        currentCodeBlock.push(line)
      } else if (line.startsWith('## ')) {
        result.push(
          <h3 key={index} className="text-lg md:text-xl font-semibold text-white mt-8 mb-4 break-words">
            {line.replace('## ', '')}
          </h3>
        )
      } else if (line.startsWith('### ')) {
        result.push(
          <h4 key={index} className="text-base md:text-lg font-medium text-slate-200 mt-6 mb-3 break-words">
            {line.replace('### ', '')}
          </h4>
        )
      } else if (line.trim()) {
        result.push(
          <p key={index} className="text-slate-300 mb-4 leading-relaxed text-sm md:text-base break-words">
            {line}
          </p>
        )
      }
    })

    return result
  }

  const activeContent = sections.find(s => s.id === activeSection)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      {/* Container optimizado para 1080x1920 */}
      <div className="max-w-[1080px] mx-auto px-4 documentation-1080">
        {/* Header compacto y profesional */}
        <div className="documentation-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 compact-header"
          >
            <h1 className="documentation-title text-white mb-2 title-compact">
              <span className="gradient-text">Documentation</span>
            </h1>
            <p className="documentation-subtitle max-w-2xl mx-auto text-compact">
              Complete guides, API references and examples to integrate AI services with x402 payments.
            </p>
          </motion.div>
        </div>

        {/* Navegación horizontal de secciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 section-spacing"
        >
          <div className="card compact-card p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {sections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30 shadow-lg shadow-primary-500/25 scale-105'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50 hover:shadow-md hover:scale-105'
                    }`}
                    whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{section.title}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Contenido principal */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 vertical-stack"
        >
          {/* Header de sección */}
          <div className="card compact-card p-6">
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 title-compact">
                {activeContent.content.title}
              </h2>
              <p className="text-sm md:text-base text-slate-300 text-compact">
                {activeContent.content.description}
              </p>
            </div>
          </div>

          {/* Subsecciones */}
          <div className="space-y-4">
            {activeContent.content.subsections.map((subsection, index) => (
              <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="card compact-card documentation-card"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-primary-400 font-bold text-sm">{index + 1}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-white title-compact">
                      {subsection.title}
                    </h3>
                  </div>
                  <div className="prose prose-invert max-w-none documentation-prose">
                     {renderContent(subsection.content)}
                   </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enlaces útiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card compact-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 text-center title-compact">Enlaces Útiles</h3>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://base.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-all duration-300 hover:scale-105"
              >
                <ExternalLink className="h-4 w-4 text-primary-400" />
                <span className="text-slate-300 text-sm font-medium">Base Network</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-all duration-300 hover:scale-105"
              >
                <ExternalLink className="h-4 w-4 text-primary-400" />
                <span className="text-slate-300 text-sm font-medium">Source Code</span>
              </a>
              <a
                href="https://x402.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-all duration-300 hover:scale-105"
              >
                <ExternalLink className="h-4 w-4 text-primary-400" />
                <span className="text-slate-300 text-sm font-medium">x402 Protocol</span>
              </a>
              <a
                href="mailto:support@example.com"
                className="flex items-center space-x-2 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-all duration-300 hover:scale-105"
              >
                <ExternalLink className="h-4 w-4 text-primary-400" />
                <span className="text-slate-300 text-sm font-medium">Support</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Documentation