import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Wallet, 
  Shield, 
  Zap, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

const WelcomeScreen = () => {
  const { connectWallet, isLoading } = useWallet()
  const [currentStep, setCurrentStep] = useState(0)

  const features = [
    {
      icon: Brain,
      title: "Advanced AI",
      description: "State-of-the-art artificial intelligence services"
    },
    {
      icon: Shield,
      title: "Secure Blockchain",
      description: "Automatic and secure blockchain payments"
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Instant processing of AI services"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Available for developers worldwide"
    }
  ]

  const steps = [
    {
      title: "Welcome to 0xDecodex x402!",
      subtitle: "The revolutionary AI services platform with blockchain",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 p-4 rounded-lg border border-slate-700"
                >
                  <Icon className="h-8 w-8 text-primary-400 mb-2" />
                  <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-slate-400">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      )
    },
    {
      title: "What is 0xDecodex x402?",
      subtitle: "A platform that democratizes access to AI services",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 p-4 rounded-lg border border-primary-500/20">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-6 w-6 text-primary-400 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-2">Premium AI Services</h3>
                <p className="text-slate-300 text-sm">
                  Access advanced AI models for analysis, data processing, 
                  content generation and much more.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-4 rounded-lg border border-green-500/20">
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-green-400 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-2">Blockchain Payments</h3>
                <p className="text-slate-300 text-sm">
                  Automatic and secure payments using blockchain technology. 
                  No intermediaries, no hidden fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Connect Your Wallet",
      subtitle: "To get started, you need to connect your digital wallet",
      content: (
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-3 mb-3">
              <Wallet className="h-6 w-6 text-primary-400" />
              <h3 className="text-white font-semibold">Why do I need a wallet?</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Secure and automatic payments</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Full control of your funds</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Access to premium services</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Transparent transaction history</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
            <p className="text-yellow-200 text-sm">
              <strong>Note:</strong> You need to have MetaMask installed in your browser. 
              If you don't have it, you can download it from metamask.io
            </p>
          </div>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleConnect = async () => {
    await connectWallet()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            0x<span className="gradient-text">Decodex</span> x402
          </h1>
          <div className="flex justify-center space-x-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-slate-400 mb-4">
            {steps[currentStep].subtitle}
          </p>
          {steps[currentStep].content}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-all"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
                <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default WelcomeScreen