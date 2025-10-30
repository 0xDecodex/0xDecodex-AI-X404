import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity,
  BarChart3,
  PieChart,
  Globe,
  Zap,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react'
import axios from 'axios'

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [overview, services, daily, network, users] = await Promise.all([
        axios.get('/api/analytics/overview'),
        axios.get('/api/analytics/services'),
        axios.get('/api/analytics/daily'),
        axios.get('/api/analytics/network'),
        axios.get('/api/analytics/users')
      ])

      setAnalytics({
        overview: overview.data,
        services: services.data,
        daily: daily.data,
        network: network.data,
        users: users.data
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
  }

  const MetricCard = ({ title, value, change, icon: Icon, color = 'primary' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/10 via-${color}-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
      
      {/* Decorative elements */}
      <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-${color}-500/15 to-transparent rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
      
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`relative p-2 rounded-lg bg-gradient-to-br from-${color}-500/25 to-${color}-600/15 border border-${color}-500/25 shadow-lg group-hover:shadow-${color}-500/20 transition-all duration-300`}>
            <Icon className={`h-4 w-4 text-${color}-400 group-hover:text-${color}-300 transition-colors duration-200`} />
          </div>
          {change && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${
                change > 0 
                  ? 'bg-green-500/15 text-green-400 border border-green-500/25' 
                  : 'bg-red-500/15 text-red-400 border border-red-500/25'
              }`}>
              {change > 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              <span>{Math.abs(change)}%</span>
            </motion.div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-slate-300 tracking-wide uppercase group-hover:text-slate-200 transition-colors duration-200">{title}</h3>
          <p className="text-lg font-bold text-white leading-tight truncate group-hover:text-slate-50 transition-colors duration-200">{value}</p>
        </div>
        
        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-${color}-500 to-${color}-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      </div>
    </motion.div>
  )

  const ServiceChart = ({ services }) => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-white truncate">Most Used Services</h3>
        <PieChart className="h-5 w-5 text-slate-400 flex-shrink-0 ml-2" />
      </div>
      <div className="space-y-4">
        {services?.map((service, index) => (
          <div key={service.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: service.color }}
              />
              <span className="text-slate-300 truncate">{service.name}</span>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-white font-medium text-sm md:text-base">{service.requests}</div>
              <div className="text-xs md:text-sm text-slate-400">{service.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const DailyChart = ({ data }) => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-white truncate">Daily Activity</h3>
        <BarChart3 className="h-5 w-5 text-slate-400 flex-shrink-0 ml-2" />
      </div>
      <div className="space-y-3">
        {data?.map((day, index) => (
          <div key={day.date} className="flex items-center space-x-2 md:space-x-4">
            <div className="text-xs md:text-sm text-slate-400 w-12 md:w-16 flex-shrink-0">{day.date}</div>
            <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden min-w-0">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
                style={{ width: `${(day.requests / Math.max(...data.map(d => d.requests))) * 100}%` }}
              />
            </div>
            <div className="text-xs md:text-sm text-white w-8 md:w-12 text-right flex-shrink-0">{day.requests}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const NetworkStatus = ({ network }) => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-white truncate">Network Status</h3>
        <Globe className="h-5 w-5 text-slate-400 flex-shrink-0 ml-2" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-300 truncate">Network</span>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white text-sm md:text-base">{network?.name || 'Base Network'}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-300 truncate">Latency</span>
          <span className="text-white text-sm md:text-base flex-shrink-0">{network?.latency || '45ms'}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-300 truncate">Gas Price</span>
          <span className="text-white text-sm md:text-base flex-shrink-0">{network?.gasPrice || '0.001 ETH'}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-300 truncate">Transactions</span>
          <span className="text-white text-sm md:text-base flex-shrink-0">{network?.transactions || '1,234'}</span>
        </div>
      </div>
    </div>
  )

  const RealtimeMetrics = () => {
    const [metrics, setMetrics] = useState({
      activeUsers: 0,
      requestsPerSecond: 0,
      avgResponseTime: 0
    })

    useEffect(() => {
      const fetchRealtimeMetrics = async () => {
        try {
          const response = await axios.get('/api/analytics/realtime')
          setMetrics({
            activeUsers: response.data.activeUsers || 0,
            requestsPerSecond: response.data.requestsPerSecond || 0,
            avgResponseTime: response.data.avgResponseTime || 0
          })
        } catch (error) {
          console.error('Error fetching realtime metrics:', error)
          // Fallback a valores por defecto en caso de error
          setMetrics({
            activeUsers: 0,
            requestsPerSecond: 0,
            avgResponseTime: 0
          })
        }
      }

      // Fetch inicial
      fetchRealtimeMetrics()

      // Actualizar cada 5 segundos
      const interval = setInterval(fetchRealtimeMetrics, 5000)

      return () => clearInterval(interval)
    }, [])

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Real-time Metrics</h3>
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/20">
            <Activity className="h-5 w-5 text-primary-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 rounded-lg bg-gradient-to-br from-primary-500/10 to-transparent border border-primary-500/20"
          >
            <div className="text-3xl font-bold text-primary-400 mb-1">{metrics.activeUsers}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wide font-medium">Active Users</div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 rounded-lg bg-gradient-to-br from-secondary-500/10 to-transparent border border-secondary-500/20"
          >
            <div className="text-3xl font-bold text-secondary-400 mb-1">{metrics.requestsPerSecond}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wide font-medium">Req/sec</div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20"
          >
            <div className="text-3xl font-bold text-green-400 mb-1">{metrics.avgResponseTime}ms</div>
            <div className="text-sm text-slate-400 uppercase tracking-wide font-medium">Response Time</div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 w-full max-w-[1080px] mx-auto">
      {/* Fixed container for 1080px width */}
      <div className="w-full px-6 py-8">
        
        {/* Compact Header - Optimized for vertical space */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Analytics <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-sm mb-4">Monitoreo en tiempo real</p>
            
            {/* Controls in horizontal layout */}
            <div className="flex items-center justify-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-slate-700/80 border border-slate-600/50 rounded-xl px-4 py-2 text-sm text-white focus:border-primary-500 focus:outline-none"
              >
                <option value="24h">24h</option>
                <option value="7d">7 días</option>
                <option value="30d">30 días</option>
              </select>
              
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm">Actualizar</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid - 2x2 layout for better vertical distribution */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Métricas <span className="gradient-text">Principales</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Solicitudes"
              value={analytics?.overview?.totalRequests?.toLocaleString() || '0'}
              change={12.5}
              icon={TrendingUp}
              color="primary"
            />
            <MetricCard
              title="Ingresos"
              value={`$${analytics?.overview?.totalRevenue?.toFixed(2) || '0.00'}`}
              change={8.3}
              icon={DollarSign}
              color="accent"
            />
            <MetricCard
              title="Usuarios"
              value={analytics?.users?.activeUsers?.toLocaleString() || '0'}
              change={-2.1}
              icon={Users}
              color="secondary"
            />
            <MetricCard
              title="Respuesta"
              value={`${analytics?.overview?.avgResponseTime || 0}ms`}
              change={-5.2}
              icon={Zap}
              color="primary"
            />
          </div>
        </motion.div>

        {/* Real-time Metrics - Compact version */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Estado <span className="gradient-text">Actual</span>
            </h2>
          </div>
          <RealtimeMetrics />
        </motion.div>

        {/* Charts Section - Stacked vertically */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Análisis <span className="gradient-text">Detallado</span>
            </h2>
          </div>
          
          <div className="space-y-6">
            <ServiceChart services={analytics?.services?.topServices} />
            <DailyChart data={analytics?.daily?.stats} />
          </div>
        </motion.div>

        {/* Statistics Grid - Stacked vertically */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8"
        >
          <div className="space-y-6">
            <NetworkStatus network={analytics?.network} />
            
            {/* User Statistics Card - Compact version */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Estadísticas de Usuario</h3>
                <Users className="h-6 w-6 text-primary-400" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">
                    {analytics?.users?.newUsers || '0'}
                  </div>
                  <div className="text-sm text-slate-400">Nuevos</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">
                    {analytics?.users?.returningUsers || '0'}
                  </div>
                  <div className="text-sm text-slate-400">Recurrentes</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">
                    {analytics?.users?.avgSessionTime || '0m'}
                  </div>
                  <div className="text-sm text-slate-400">Tiempo Prom.</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">
                    {analytics?.users?.conversionRate || '0%'}
                  </div>
                  <div className="text-sm text-slate-400">Conversión</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Service Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-12 sm:mb-14 lg:mb-16"
        >
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Detalles de <span className="gradient-text">Servicios</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto px-4">
              Análisis detallado del rendimiento de cada servicio
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl border border-slate-700/50 shadow-2xl"
          >
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-secondary-500/20 to-transparent rounded-full blur-2xl opacity-50"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">Tabla de Servicios</h3>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500/30 to-primary-600/20 border border-primary-500/30">
                  <BarChart3 className="h-6 w-6 text-primary-400" />
                </div>
              </div>
              
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="w-full min-w-[600px] sm:min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-600/50">
                        <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-300 font-semibold text-sm sm:text-base">Servicio</th>
                        <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-300 font-semibold text-sm sm:text-base">Solicitudes</th>
                        <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-300 font-semibold text-sm sm:text-base">Ingresos</th>
                        <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-300 font-semibold text-sm sm:text-base hidden sm:table-cell">Tiempo Prom.</th>
                        <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-slate-300 font-semibold text-sm sm:text-base">Éxito</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics?.services?.topServices?.map((service, index) => (
                        <motion.tr 
                          key={service.name} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors duration-200"
                        >
                          <td className="py-3 sm:py-4 px-3 sm:px-6">
                            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                              <div 
                                className="w-3 sm:w-4 h-3 sm:h-4 rounded-full flex-shrink-0 shadow-lg"
                                style={{ backgroundColor: service.color }}
                              />
                              <span className="text-white font-medium text-sm sm:text-base truncate">{service.name}</span>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6">
                            <span className="text-slate-300 font-medium text-sm sm:text-base">{service.requests}</span>
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6">
                            <span className="text-green-400 font-semibold text-sm sm:text-base">${service.revenue}</span>
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6 hidden sm:table-cell">
                            <span className="text-slate-300 font-medium text-sm sm:text-base">{service.avgTime}ms</span>
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                              <span className="text-green-400 font-semibold text-sm sm:text-base">{service.successRate}%</span>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics