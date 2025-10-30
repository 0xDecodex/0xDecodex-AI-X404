import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { WalletProvider, useWallet } from './contexts/WalletContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WelcomeScreen from './components/WelcomeScreen'
import WelcomeMessage from './components/WelcomeMessage'
import Home from './pages/Home'
import Services from './pages/Services'
import Analytics from './pages/Analytics'
import Documentation from './pages/Documentation'
import About from './pages/About'

const AppContent = () => {
  const { walletConnected } = useWallet()
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false)
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false)

  useEffect(() => {
    // Check if user has already seen welcome in this session
    const hasSeenWelcomeSession = sessionStorage.getItem('hasSeenWelcome')
    if (hasSeenWelcomeSession) {
      setHasSeenWelcome(true)
    }
  }, [])

  useEffect(() => {
    // Mostrar mensaje de bienvenida cuando se conecta la wallet por primera vez
    if (walletConnected && !hasSeenWelcome) {
      setShowWelcomeMessage(true)
    }
  }, [walletConnected, hasSeenWelcome])

  const handleWelcomeComplete = () => {
    setShowWelcomeMessage(false)
    setHasSeenWelcome(true)
    sessionStorage.setItem('hasSeenWelcome', 'true')
  }

  // Si no hay wallet conectada, mostrar pantalla de bienvenida
  if (!walletConnected) {
    return <WelcomeScreen />
  }

  // Main application
  return (
    <>
      {/* Contenedor principal que simula una pantalla móvil */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto bg-slate-900 neural-network-bg min-h-screen shadow-2xl rounded-lg overflow-visible">
          <Navbar />
          
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </motion.main>

          <Footer />
        </div>
      </div>

      {/* Mensaje de bienvenida después de conectar */}
      {showWelcomeMessage && (
        <WelcomeMessage onComplete={handleWelcomeComplete} />
      )}
    </>
  )
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  )
}

export default App