import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Menu, 
  X, 
  Home, 
  Cpu, 
  BarChart3, 
  FileText, 
  Info,
  Wallet,
  CheckCircle,
  LogOut,
  ChevronDown,
  DollarSign
} from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false)
  const location = useLocation()
  const { walletConnected, walletAddress, connectWallet, disconnectWallet, isLoading, balance } = useWallet()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsMenuOpen(false)
        setIsWalletMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Services', href: '/services', icon: Cpu },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Docs', href: '/documentation', icon: FileText },
    { name: 'About', href: '/about', icon: Info },
  ]

  const isActive = (path) => location.pathname === path

  // Remove all Home-specific logic - use same style as Services
  const getDropdownStyles = () => {
    // Same style for all pages with very high z-index
    return {
      backgroundColor: '#0f172a',
      border: '1px solid #475569',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
      zIndex: 9999
    }
  }

  const getDropdownClassName = (baseClass) => {
    // Same classes for all pages
    return `${baseClass} bg-slate-900 border border-slate-600`
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance) => {
    if (!balance) return '0.00'
    return parseFloat(balance).toFixed(4)
  }

  return (
    <nav className="w-full z-[9998] bg-slate-900 border-b border-slate-700">
      <div className="px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">
              0x<span className="gradient-text">Decodex</span>
            </span>
          </Link>

          <div className="flex items-center space-x-3">
            {/* Navigation Menu Button */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Menu className="h-4 w-4 text-white" />
                 <span className="text-sm text-white">Menu</span>
                 <ChevronDown className={`h-3 w-3 text-white transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
               </button>

               {/* Dropdown Menu */}
               <AnimatePresence>
                 {isMenuOpen && (
                   <motion.div
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className={getDropdownClassName("absolute right-0 mt-2 w-48 rounded-lg overflow-hidden")}
                     style={getDropdownStyles()}
                   >
                    {navigation.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                            isActive(item.href)
                              ? 'bg-primary-500/20 text-primary-400 border-r-2 border-primary-500'
                              : 'text-slate-300 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wallet Section */}
            {walletConnected ? (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600/20 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                >
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-green-400 font-medium">
                      {formatAddress(walletAddress)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatBalance(balance)} ETH
                    </span>
                  </div>
                  <ChevronDown className={`h-3 w-3 text-green-400 transition-transform ${isWalletMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Wallet Dropdown */}
                 <AnimatePresence>
                   {isWalletMenuOpen && (
                     <motion.div
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       className={getDropdownClassName("absolute right-0 mt-2 w-56 rounded-lg overflow-hidden")}
                       style={getDropdownStyles()}
                     >
                       <div className="px-4 py-3 border-b border-slate-700">
                         <div className="flex items-center space-x-2 mb-2">
                           <Wallet className="h-4 w-4 text-green-400" />
                           <span className="text-sm font-medium text-white">Connected Wallet</span>
                         </div>
                         <p className="text-xs text-slate-400 break-all">{walletAddress}</p>
                         <div className="flex items-center space-x-2 mt-2">
                           <DollarSign className="h-3 w-3 text-slate-400" />
                           <span className="text-xs text-slate-300">{formatBalance(balance)} ETH</span>
                         </div>
                       </div>
                       <button
                         onClick={() => {
                           disconnectWallet()
                           setIsWalletMenuOpen(false)
                         }}
                         className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors"
                       >
                         <LogOut className="h-4 w-4" />
                         <span>Disconnect Wallet</span>
                       </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                   <Wallet className="h-4 w-4" />
                 )}
                 <span>{isLoading ? 'Connecting...' : 'Connect'}</span>
               </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar