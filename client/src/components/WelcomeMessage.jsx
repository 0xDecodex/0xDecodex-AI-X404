import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  Wallet,
  DollarSign
} from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

const WelcomeMessage = ({ onComplete }) => {
  const { walletAddress, balance } = useWallet()
  const [showMessage, setShowMessage] = useState(true)

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance) => {
    if (!balance) return '0.00'
    return parseFloat(balance).toFixed(4)
  }

  const handleContinue = () => {
    setShowMessage(false)
    setTimeout(() => {
      onComplete()
    }, 300)
  }

  useEffect(() => {
    // Auto-continue after 5 seconds
    const timer = setTimeout(() => {
      handleContinue()
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {showMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl"
          >
            {/* Success Icon */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 border-2 border-green-500 rounded-full mb-4"
              >
                <CheckCircle className="h-8 w-8 text-green-400" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-white mb-2"
              >
                Wallet Connected!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-slate-400"
              >
                Welcome to 0xDecodex x402
              </motion.p>
            </div>

            {/* Wallet Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4 mb-6"
            >
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-3 mb-3">
                  <Wallet className="h-5 w-5 text-primary-400" />
                  <span className="text-white font-medium">Your Wallet</span>
                </div>
                <p className="text-slate-300 text-sm font-mono break-all">
                  {formatAddress(walletAddress)}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-300 text-sm">
                    {formatBalance(balance)} ETH
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 p-4 rounded-lg border border-primary-500/20">
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-primary-400 mt-0.5" />
                  <div>
                    <h3 className="text-white font-medium mb-1">You're ready to start!</h3>
                    <p className="text-slate-300 text-sm">
                      You now have full access to all our AI services. 
                      Explore, experiment and discover the power of artificial intelligence.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <button
                onClick={handleContinue}
                className="flex items-center space-x-2 w-full justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-lg transition-all"
              >
                <span>Continue to App</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <p className="text-slate-500 text-xs mt-2">
                Will continue automatically in 5 seconds
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default WelcomeMessage