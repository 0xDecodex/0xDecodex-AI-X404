const express = require('express');
const router = express.Router();

// Health check básico
router.get('/', (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };

  res.json(healthData);
});

// Health check detallado
router.get('/detailed', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Verificar conectividad con facilitador x402
    const facilitatorStatus = await checkFacilitatorHealth();
    
    // Verificar servicios internos
    const servicesStatus = checkInternalServices();
    
    const responseTime = Date.now() - startTime;
    
    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      system: {
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024)
        },
        cpu: process.cpuUsage(),
        platform: process.platform,
        nodeVersion: process.version
      },
      services: servicesStatus,
      external: {
        x402Facilitator: facilitatorStatus,
        baseNetwork: await checkBaseNetworkHealth()
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3001,
        facilitatorUrl: process.env.X402_FACILITATOR_URL || 'https://x402.org'
      }
    };

    res.json(detailedHealth);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      responseTime: `${Date.now() - startTime}ms`
    });
  }
});

// Verificar estado del facilitador x402
async function checkFacilitatorHealth() {
  try {
    const axios = require('axios');
    const facilitatorUrl = process.env.X402_FACILITATOR_URL || 'https://x402.org';
    
    const response = await axios.get(`${facilitatorUrl}/health`, {
      timeout: 5000
    });
    
    return {
      status: 'healthy',
      url: facilitatorUrl,
      responseTime: response.headers['x-response-time'] || 'unknown',
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      url: process.env.X402_FACILITATOR_URL || 'https://x402.org',
      error: error.message,
      lastCheck: new Date().toISOString()
    };
  }
}

// Verificar servicios internos
function checkInternalServices() {
  const services = [
    'text-analysis',
    'image-resize',
    'ocr',
    'text-translate',
    'image-optimize'
  ];

  return services.map(service => ({
    name: service,
    status: 'healthy',
    endpoint: `/api/services/${service}`,
    lastCheck: new Date().toISOString()
  }));
}

// Verificar estado de la red Base
async function checkBaseNetworkHealth() {
  try {
    const axios = require('axios');
    const baseRpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
    
    // Hacer una llamada RPC simple para verificar conectividad
    const response = await axios.post(baseRpcUrl, {
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 1
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const blockNumber = parseInt(response.data.result, 16);
    
    return {
      status: 'healthy',
      network: 'Base Mainnet',
      rpcUrl: baseRpcUrl,
      latestBlock: blockNumber,
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      network: 'Base Mainnet',
      rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
      error: error.message,
      lastCheck: new Date().toISOString()
    };
  }
}

// Endpoint de readiness (para Kubernetes/Docker)
router.get('/ready', (req, res) => {
  // Verificar que todos los servicios críticos estén listos
  const isReady = process.env.X402_WALLET_ADDRESS && 
                  process.env.X402_FACILITATOR_URL;
  
  if (isReady) {
    res.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      message: 'Service is ready to accept requests'
    });
  } else {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      message: 'Service is not ready - missing configuration'
    });
  }
});

// Endpoint de liveness (para Kubernetes/Docker)
router.get('/live', (req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;