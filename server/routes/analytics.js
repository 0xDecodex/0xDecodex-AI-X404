const express = require('express');
const analyticsStorage = require('../utils/analyticsStorage');
const router = express.Router();

// Obtener resumen general de analytics
router.get('/overview', async (req, res) => {
  try {
    const overview = await analyticsStorage.getOverview();
    if (!overview) {
      return res.status(500).json({ error: 'Failed to fetch analytics overview' });
    }
    res.json(overview);
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Obtener estadísticas de servicios
router.get('/services', async (req, res) => {
  try {
    const servicesStats = await analyticsStorage.getServicesStats();
    if (!servicesStats) {
      return res.status(500).json({ error: 'Failed to fetch services statistics' });
    }
    res.json(servicesStats);
  } catch (error) {
    console.error('Error fetching services stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Obtener estadísticas diarias
router.get('/daily', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const dailyStats = await analyticsStorage.getDailyStats(days);
    if (!dailyStats) {
      return res.status(500).json({ error: 'Failed to fetch daily statistics' });
    }
    res.json(dailyStats);
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Obtener estadísticas de red (Base)
router.get('/network', async (req, res) => {
  try {
    const overview = await analyticsStorage.getOverview();
    if (!overview) {
      return res.status(500).json({ error: 'Failed to fetch network statistics' });
    }

    const networkData = {
      transactions: overview.totalRequests,
      totalVolume: overview.totalRevenue,
      averageGasUsed: 0.0001, // Simulado
      successRate: 99.2, // Simulado
      network: 'Base',
      currency: 'USDC',
      facilitator: process.env.X402_FACILITATOR_URL || 'https://x402.org',
      lastBlock: Math.floor(Math.random() * 1000000) + 5000000, // Simulado
      timestamp: new Date().toISOString()
    };

    res.json(networkData);
  } catch (error) {
    console.error('Error fetching network stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Obtener estadísticas de usuarios
router.get('/users', async (req, res) => {
  try {
    const userStats = await analyticsStorage.getUserStats();
    if (!userStats) {
      return res.status(500).json({ error: 'Failed to fetch user statistics' });
    }

    const userAnalytics = {
      ...userStats,
      metrics: {
        retentionRate: userStats.retentionRate,
        newUserRate: userStats.newUserRate,
        activeUserRate: userStats.activeUserRate
      },
      timestamp: new Date().toISOString()
    };

    res.json(userAnalytics);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Obtener métricas en tiempo real
router.get('/realtime', async (req, res) => {
  try {
    const [overview, servicesStats, userStats] = await Promise.all([
      analyticsStorage.getOverview(),
      analyticsStorage.getServicesStats(),
      analyticsStorage.getUserStats()
    ]);

    if (!overview) {
      return res.status(500).json({ error: 'Failed to fetch realtime metrics' });
    }

    // Calcular métricas en tiempo real basadas en datos reales
    const topService = servicesStats?.topServices?.[0]?.name || 'N/A';
    const avgResponseTime = overview.avgResponseTime || 0;
    
    // Usar datos reales con algunas métricas calculadas
    const realtimeData = {
      activeUsers: userStats?.activeUsers || 0,
      requestsPerSecond: overview.totalRequests > 0 ? Math.ceil(overview.totalRequests / 3600) : 0, // Estimación basada en total
      avgResponseTime: avgResponseTime,
      currentRequests: overview.totalRequests,
      requestsLastHour: overview.totalRequests, // En un sistema real, esto sería filtrado por hora
      revenueLastHour: overview.totalRevenue,
      activeConnections: userStats?.activeUsers || 0,
      averageResponseTime: avgResponseTime,
      errorRate: servicesStats?.topServices?.length > 0 ? 
        (100 - (servicesStats.topServices.reduce((acc, s) => acc + s.successRate, 0) / servicesStats.topServices.length)).toFixed(2) : '0.00',
      topServiceNow: topService,
      networkStatus: 'healthy',
      totalRequests: overview.totalRequests,
      totalRevenue: overview.totalRevenue,
      timestamp: new Date().toISOString()
    };

    res.json(realtimeData);
  } catch (error) {
    console.error('Error fetching realtime stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint para actualizar analytics (ahora automático a través del sistema de storage)
router.post('/update', async (req, res) => {
  try {
    const { service, revenue, success = true } = req.body;
    
    if (!service) {
      return res.status(400).json({ error: 'Service parameter is required' });
    }

    // El tracking ahora se hace automáticamente en las rutas de servicios
    // Este endpoint se mantiene para compatibilidad pero ya no es necesario
    await analyticsStorage.recordServiceRequest(service, parseFloat(revenue) || 0.01, success);
    
    res.json({
      success: true,
      message: 'Analytics updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating analytics:', error);
    res.status(500).json({ error: 'Failed to update analytics' });
  }
});

module.exports = router;