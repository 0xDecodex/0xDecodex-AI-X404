const fs = require('fs').promises;
const path = require('path');

class AnalyticsStorage {
  constructor() {
    this.dataPath = path.join(__dirname, '../data');
    this.analyticsFile = path.join(this.dataPath, 'analytics.json');
    this.servicesFile = path.join(this.dataPath, 'services.json');
    this.dailyFile = path.join(this.dataPath, 'daily.json');
    
    this.initializeStorage();
  }

  async initializeStorage() {
    try {
      // Crear directorio de datos si no existe
      await fs.mkdir(this.dataPath, { recursive: true });
      
      // Inicializar archivos si no existen
      await this.ensureFileExists(this.analyticsFile, {
        totalRequests: 0,
        totalRevenue: 0,
        activeServices: 5,
        startDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });

      await this.ensureFileExists(this.servicesFile, {
        services: {
          'text-analysis': { name: 'Análisis de Sentimientos', requests: 0, revenue: 0, errors: 0 },
          'image-resize': { name: 'Redimensionar Imagen', requests: 0, revenue: 0, errors: 0 },
          'ocr': { name: 'OCR', requests: 0, revenue: 0, errors: 0 },
          'text-translate': { name: 'Traducción de Texto', requests: 0, revenue: 0, errors: 0 },
          'image-optimize': { name: 'Optimización de Imagen', requests: 0, revenue: 0, errors: 0 }
        }
      });

      await this.ensureFileExists(this.dailyFile, {
        stats: []
      });

    } catch (error) {
      console.error('Error initializing analytics storage:', error);
    }
  }

  async ensureFileExists(filePath, defaultData) {
    try {
      await fs.access(filePath);
    } catch (error) {
      // Archivo no existe, crearlo con datos por defecto
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
    }
  }

  async readFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return null;
    }
  }

  async writeFile(filePath, data) {
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing file ${filePath}:`, error);
    }
  }

  // Registrar una nueva solicitud de servicio
  async recordServiceRequest(serviceId, revenue = 0.01, success = true) {
    try {
      // Actualizar estadísticas generales
      const analytics = await this.readFile(this.analyticsFile);
      if (analytics) {
        analytics.totalRequests += 1;
        if (success) {
          analytics.totalRevenue += parseFloat(revenue);
        }
        analytics.lastUpdated = new Date().toISOString();
        await this.writeFile(this.analyticsFile, analytics);
      }

      // Actualizar estadísticas del servicio
      const services = await this.readFile(this.servicesFile);
      if (services && services.services[serviceId]) {
        services.services[serviceId].requests += 1;
        if (success) {
          services.services[serviceId].revenue += parseFloat(revenue);
        } else {
          services.services[serviceId].errors += 1;
        }
        await this.writeFile(this.servicesFile, services);
      }

      // Actualizar estadísticas diarias
      await this.updateDailyStats(revenue, success);

    } catch (error) {
      console.error('Error recording service request:', error);
    }
  }

  async updateDailyStats(revenue, success) {
    try {
      const daily = await this.readFile(this.dailyFile);
      if (!daily) return;

      const today = new Date().toISOString().split('T')[0];
      const todayIndex = daily.stats.findIndex(stat => stat.date === today);

      if (todayIndex !== -1) {
        // Actualizar estadísticas del día actual
        daily.stats[todayIndex].requests += 1;
        if (success) {
          daily.stats[todayIndex].revenue += parseFloat(revenue);
        }
      } else {
        // Crear nueva entrada para hoy
        daily.stats.push({
          date: today,
          requests: 1,
          revenue: success ? parseFloat(revenue) : 0
        });
      }

      // Mantener solo los últimos 30 días
      if (daily.stats.length > 30) {
        daily.stats = daily.stats.slice(-30);
      }

      await this.writeFile(this.dailyFile, daily);
    } catch (error) {
      console.error('Error updating daily stats:', error);
    }
  }

  // Obtener estadísticas generales
  async getOverview() {
    const analytics = await this.readFile(this.analyticsFile);
    if (!analytics) return null;

    return {
      totalRequests: analytics.totalRequests,
      totalRevenue: analytics.totalRevenue,
      activeServices: analytics.activeServices,
      avgResponseTime: Math.floor(Math.random() * 100) + 50, // Simulado por ahora
      averageRequestValue: analytics.totalRequests > 0 ? 
        (analytics.totalRevenue / analytics.totalRequests).toFixed(4) : '0.0000',
      currency: 'USDC',
      network: 'Base',
      lastUpdated: analytics.lastUpdated
    };
  }

  // Obtener estadísticas de servicios
  async getServicesStats() {
    const services = await this.readFile(this.servicesFile);
    const analytics = await this.readFile(this.analyticsFile);
    
    if (!services || !analytics) return null;

    const topServices = Object.entries(services.services)
      .map(([id, service]) => ({
        id,
        name: service.name,
        requests: service.requests,
        revenue: parseFloat(service.revenue.toFixed(2)),
        successRate: service.requests > 0 ? 
          (((service.requests - service.errors) / service.requests) * 100).toFixed(1) : '100.0',
        avgTime: Math.floor(Math.random() * 200) + 100, // Simulado por ahora
        color: this.getServiceColor(id)
      }))
      .sort((a, b) => b.requests - a.requests);

    return {
      topServices,
      totalServices: analytics.activeServices,
      totalRequests: analytics.totalRequests,
      totalRevenue: analytics.totalRevenue
    };
  }

  // Obtener estadísticas diarias
  async getDailyStats(days = 7) {
    const daily = await this.readFile(this.dailyFile);
    if (!daily) return null;

    const requestedDays = Math.min(parseInt(days), 30);
    const recentStats = daily.stats.slice(-requestedDays);

    return {
      period: `${requestedDays} days`,
      stats: recentStats,
      totals: {
        requests: recentStats.reduce((sum, day) => sum + day.requests, 0),
        revenue: recentStats.reduce((sum, day) => sum + day.revenue, 0).toFixed(2)
      },
      averages: {
        requestsPerDay: recentStats.length > 0 ? 
          (recentStats.reduce((sum, day) => sum + day.requests, 0) / recentStats.length).toFixed(1) : '0.0',
        revenuePerDay: recentStats.length > 0 ? 
          (recentStats.reduce((sum, day) => sum + day.revenue, 0) / recentStats.length).toFixed(3) : '0.000'
      }
    };
  }

  // Obtener estadísticas de usuarios (simuladas por ahora)
  async getUserStats() {
    const analytics = await this.readFile(this.analyticsFile);
    if (!analytics) return null;

    // Estimaciones basadas en las solicitudes totales
    const estimatedUsers = Math.max(1, Math.floor(analytics.totalRequests / 10));
    const activeUsers = Math.max(1, Math.floor(estimatedUsers * 0.4));
    const newUsers = Math.max(1, Math.floor(estimatedUsers * 0.2));
    const returningUsers = activeUsers - newUsers;

    return {
      totalUsers: estimatedUsers,
      activeUsers,
      newUsers,
      returningUsers,
      avgSessionTime: '5m 30s', // Simulado
      conversionRate: '85.2%', // Simulado
      retentionRate: ((returningUsers / estimatedUsers) * 100).toFixed(1),
      newUserRate: ((newUsers / estimatedUsers) * 100).toFixed(1),
      activeUserRate: ((activeUsers / estimatedUsers) * 100).toFixed(1)
    };
  }

  getServiceColor(serviceId) {
    const colors = {
      'text-analysis': '#3B82F6',
      'image-resize': '#10B981',
      'ocr': '#F59E0B',
      'text-translate': '#EF4444',
      'image-optimize': '#8B5CF6'
    };
    return colors[serviceId] || '#6B7280';
  }
}

// Crear una instancia única
const analyticsStorage = new AnalyticsStorage();

module.exports = analyticsStorage;