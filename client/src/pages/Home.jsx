import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Brain, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight, 
  Sparkles,
  Code,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  FileText
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Automatic micropayments with x402 without friction or required accounts',
      color: 'text-green-400'
    },
    {
      icon: Shield,
      title: 'Secure and Reliable',
      description: 'Built on Base Network with integrated KYT/OFAC verifications',
      color: 'text-primary-400'
    },
    {
      icon: Brain,
      title: 'AI Optimized',
      description: 'Specifically designed for AI agents and machine-to-machine payments',
      color: 'text-secondary-400'
    },
    {
      icon: Code,
      title: 'Easy Integration',
      description: 'Simple APIs and ready-to-use SDKs in multiple languages',
      color: 'text-green-400'
    },
    {
      icon: DollarSign,
      title: 'No Fees',
      description: 'Free USDC transactions using the CDP facilitator',
      color: 'text-primary-400'
    },
    {
      icon: Globe,
      title: 'Scalable',
      description: 'Supports millions of transactions with ultra-low latency',
      color: 'text-secondary-400'
    }
  ]

  const stats = [
    { label: 'Active Services', value: '5+', icon: Code },
    { label: 'Transactions', value: '1.2K+', icon: TrendingUp },
    { label: 'Users', value: '89', icon: Users },
    { label: 'Average Time', value: '<200ms', icon: Clock }
  ]

  const services = [
    {
      name: 'Sentiment Analysis',
      description: 'Analyze emotions in text with advanced AI',
      icon: Brain,
      price: '0.01'
    },
    {
      name: 'OCR Text Recognition',
      description: 'Extract text from images with precision',
      icon: FileText,
      price: '0.02'
    },
    {
      name: 'Automatic Translation',
      description: 'Translate between multiple languages',
      icon: Globe,
      price: '0.015'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-8 px-4 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 pointer-events-none"></div>
        
        <div className="relative">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-3 py-1.5 mb-4">
                <Sparkles className="h-3 w-3 text-primary-400" />
                <span className="text-xs text-primary-300">Powered by x402 Protocol</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">0xDecodex x402</span>
                <br />
                <span className="text-white">for AI Agents</span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-300 mb-8 leading-relaxed px-4 max-w-2xl mx-auto">
                Intelligent services platform with automatic payments using x402. 
                Build, monetize and scale AI services frictionlessly on Base Network.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-3 mb-8 pointer-events-auto"
            >
              <Link to="/services" className="btn-primary inline-flex items-center justify-center space-x-2 py-2.5">
                <span>Explore Services</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link to="/docs" className="btn-outline inline-flex items-center justify-center space-x-2 py-2.5">
                <Code className="h-4 w-4" />
                <span>View Documentation</span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="text-center">
                    <div className="flex justify-center mb-1">
                      <Icon className="h-4 w-4 text-primary-400" />
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs md:text-sm text-slate-400">{stat.label}</div>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 px-6 bg-slate-800">
        <div className="">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Why Choose 0xDecodex x402?
            </h2>
            <p className="text-base md:text-lg text-slate-300 px-4 max-w-3xl mx-auto">
              We combine the power of AI with the simplicity of micropayments 
              to create the most advanced automated services platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card card-hover group"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-slate-600 transition-colors duration-200">
                      <Icon className={`h-4 w-4 ${feature.color}`} />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-8 px-4">
        <div className="">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-xl font-bold text-white mb-3">
              Featured Services
            </h2>
            <p className="text-sm text-slate-300 px-2">
              Discover some of our most popular services, 
              ready to integrate into your applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card card-hover relative ${
                  service.popular ? 'ring-2 ring-primary-500/50' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
                  <p className="text-sm text-slate-300 mb-3">{service.description}</p>
                  <div className="text-xl font-bold gradient-text mb-3">{service.price}</div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>Pay per use</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center pointer-events-auto"
          >
            <Link to="/services" className="btn-primary inline-flex items-center space-x-2">
              <span>View All Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Join the AI services revolution with automatic payments. 
              Start building today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/services" 
                className="bg-white text-primary-600 hover:bg-slate-100 font-medium px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center space-x-2"
              >
                <span>Start Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link 
                to="/docs" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium px-8 py-3 rounded-lg transition-all duration-200 inline-flex items-center space-x-2"
              >
                <Code className="h-4 w-4" />
                <span>View Documentation</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home