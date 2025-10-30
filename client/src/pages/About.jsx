import { motion } from 'framer-motion'
import { 
  Brain, 
  Zap, 
  Shield, 
  Globe,
  Code,
  Cpu,
  Network,
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ExternalLink,
  Award,
  Target,
  Users
} from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'Artificial Intelligence',
      description: 'Cutting-edge AI services for text analysis, image processing and more.',
      color: 'text-primary-400'
    },
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Automatic micropayments using x402 on Base network for fast and economical transactions.',
      color: 'text-green-400'
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'All transactions are secured by Base blockchain, ensuring transparency.',
      color: 'text-secondary-400'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'RESTful API accessible from anywhere in the world with complete documentation.',
      color: 'text-primary-400'
    }
  ]

  const technologies = [
    {
      category: 'Frontend',
      items: [
        { name: 'React 18', description: 'Modern UI library' },
        { name: 'Vite', description: 'Ultra-fast build tool' },
        { name: 'Tailwind CSS', description: 'Framework CSS utility-first' },
        { name: 'Framer Motion', description: 'Smooth animations' }
      ]
    },
    {
      category: 'Backend',
      items: [
        { name: 'Node.js', description: 'JavaScript runtime' },
        { name: 'Express.js', description: 'Minimalist web framework' },
        { name: 'x402', description: 'Micropayment protocol' },
        { name: 'Base Network', description: 'Ethereum L2 blockchain' }
      ]
    },
    {
      category: 'AI & Services',
      items: [
        { name: 'Sentiment Analysis', description: 'Sentiment analysis' },
        { name: 'Sharp', description: 'Image processing' },
        { name: 'Tesseract.js', description: 'OCR in JavaScript' },
        { name: 'Google Translate', description: 'Text translation' }
      ]
    }
  ]

  const stats = [
    { label: 'AI Services', value: '5+', icon: Brain },
    { label: 'Transactions/sec', value: '100+', icon: Zap },
    { label: 'Uptime', value: '99.9%', icon: Shield },
    { label: 'Countries', value: '50+', icon: Globe }
  ]

  const team = [
    {
      name: 'AI Agent Services',
      role: 'AI Services Platform',
      description: 'Democratizing access to artificial intelligence services through automatic micropayments.',
      avatar: '🤖',
      social: {
        github: '#',
        twitter: '#',
        linkedin: '#'
      }
    }
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About <span className="gradient-text">Us</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            0xDecodex x402 is a revolutionary platform that combines 
            cutting-edge artificial intelligence with automatic blockchain payments, 
            democratizing access to AI services for developers and businesses.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="card text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Make artificial intelligence services accessible, 
              affordable and easy to use for everyone. We eliminate 
              traditional barriers like expensive subscriptions and complex configurations, 
              allowing anyone to access enterprise-quality AI 
              with just a few clicks.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why choose our platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="card card-hover"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <div className="card">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Platform Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="card"
              >
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                  <Code className="h-5 w-5 text-primary-400" />
                  <span>{tech.category}</span>
                </h3>
                <div className="space-y-4">
                  {tech.items.map((item) => (
                    <div key={item.name} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">{item.name}</div>
                        <div className="text-sm text-slate-400">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How Does It Work?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Select Service</h3>
              <p className="text-slate-300">
                Choose the AI service you need: text analysis, 
                image processing, OCR, translation, etc.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Automatic Payment</h3>
              <p className="text-slate-300">
                The system automatically processes the micropayment using x402 
                on the Base network. No manual configuration required.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Get Results</h3>
              <p className="text-slate-300">
                Receive AI-processed results in seconds. 
                Pay only for what you use, no subscriptions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Nuestro Proyecto
          </h2>
          <div className="max-w-2xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="card text-center"
              >
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-primary-400 font-medium mb-4">{member.role}</p>
                <p className="text-slate-300 mb-6 leading-relaxed">{member.description}</p>
                <div className="flex items-center justify-center space-x-4">
                  <a
                    href={member.social.github}
                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <Github className="h-5 w-5 text-slate-400 hover:text-white" />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <Twitter className="h-5 w-5 text-slate-400 hover:text-white" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <Linkedin className="h-5 w-5 text-slate-400 hover:text-white" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Vision Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mb-20"
        >
          <div className="card bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Vision</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
                We envision a future where artificial intelligence is as accessible 
                as browsing the internet. Where any developer, startup or company 
                can integrate world-class AI services without financial 
                or technical barriers. We are building the infrastructure that will make 
                this future possible, one micropayment at a time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="text-center"
        >
          <div className="card">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to get started?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join the AI services revolution with micropayments. 
              Start using our services today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="btn-primary flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Try Services</span>
              </button>
              <button className="btn-outline flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Contact</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About