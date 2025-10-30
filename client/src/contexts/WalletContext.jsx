import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [balance, setBalance] = useState('0')
  const [isLoading, setIsLoading] = useState(false)

  // Check wallet connection on component mount
  useEffect(() => {
    checkWalletConnection()
    
    // Listen for account changes
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setWalletConnected(false)
      setWalletAddress('')
      setBalance('0')
    } else {
      // User switched accounts
      setWalletConnected(true)
      setWalletAddress(accounts[0])
      getBalance(accounts[0])
    }
  }

  const handleChainChanged = () => {
    // Reload the page when chain changes
    window.location.reload()
  }

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setWalletConnected(true)
          setWalletAddress(accounts[0])
          await getBalance(accounts[0])
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const getBalance = async (address) => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        })
        // Convertir de wei a ETH
        const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18)
        setBalance(balanceInEth.toString())
      }
    } catch (error) {
      console.error('Error getting balance:', error)
      setBalance('0')
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask is not installed. Please install MetaMask to connect your wallet.')
      return false
    }

    setIsLoading(true)
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts.length > 0) {
        setWalletConnected(true)
        setWalletAddress(accounts[0])
        await getBalance(accounts[0])
        toast.success('Wallet connected successfully')
        return true
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      if (error.code === 4001) {
        toast.error('Wallet connection rejected by user')
      } else {
        toast.error('Error connecting wallet')
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWalletConnected(false)
    setWalletAddress('')
    setBalance('0')
    toast.success('Wallet disconnected')
  }

  const value = {
    walletConnected,
    walletAddress,
    balance,
    isLoading,
    connectWallet,
    disconnectWallet,
    checkWalletConnection,
    getBalance
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletContext