import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Image as ImageIcon, 
  FileText, 
  Languages, 
  Zap,
  Upload,
  Send,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Play,
  Loader,
  Download,
  Wallet
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useWallet } from '../contexts/WalletContext'

const Services = () => {
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [formData, setFormData] = useState({})
  
  // Use shared wallet context
  const { walletConnected, walletAddress, connectWallet } = useWallet()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services')
      setServices(response.data.services || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error('Error loading services')
    }
  }

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setResult(null)
    setFormData({})
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setFormData(prev => ({
        ...prev,
        image: file
      }))
      toast.success(`File selected: ${file.name}`)
    }
  }

  const validateFormData = () => {
    if (!selectedService) return false

    switch (selectedService.id) {
      case 'text-analysis':
      case 'text-translation':
        return formData.text && formData.text.trim().length > 0
      case 'image-resize':
      case 'ocr':
      case 'image-optimize':
        return formData.image
      default:
        return false
    }
  }

  // MetaMask payment execution function
  const executeMetaMaskPayment = async (paymentInfo) => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed')
    }

    let transactionHash = null;

    try {
      // Solicitar acceso a MetaMask
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      
      if (accounts.length === 0) {
        throw new Error('Could not access MetaMask')
      }

      const userAddress = accounts[0]

      // Verificar/cambiar a Base Network
      const baseChainId = '0x2105' // Base Network chain ID
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })

      if (currentChainId !== baseChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: baseChainId }],
          })
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: baseChainId,
                chainName: 'Base',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org'],
              }],
            })
          } else {
            throw switchError
          }
        }
      }

      // USDC contract address on Base Network
      const usdcContractAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
      
      // Convertir el monto a unidades USDC (6 decimales)
      const amountInUSDC = Math.round(parseFloat(paymentInfo.payment.amount) * 1000000)

      // Create transaction data to transfer USDC
      const transferMethodId = '0xa9059cbb'
      const recipientAddress = paymentInfo.payment.recipient.replace('0x', '').padStart(64, '0')
      const amountPadded = amountInUSDC.toString(16).padStart(64, '0')
      const data = transferMethodId + recipientAddress + amountPadded

      // Execute USDC transaction
      try {
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: userAddress,
            to: usdcContractAddress,
            data: data,
            gas: '0x186A0', // 100,000 gas limit
          }],
        })
        
        console.log('Transaction sent:', txHash);
        transactionHash = txHash;
      } catch (txError) {
          // Manejar diferentes tipos de errores de transacción
          console.error('Transaction error:', txError);
          
          if (txError.code === 4001) {
            // Usuario rechazó la transacción
            toast.error('Transacción cancelada por el usuario');
            throw new Error('User rejected transaction');
          } else if (txError.code === -32603) {
            // Error interno (puede ser fondos insuficientes)
            if (txError.message.includes('insufficient funds')) {
              toast.error('Fondos insuficientes para completar la transacción');
              throw new Error('Insufficient funds');
            } else {
              toast.error('Error interno de la wallet');
              throw new Error('Internal wallet error');
            }
          } else if (txError.message && txError.message.includes('User denied')) {
            toast.error('Transacción cancelada por el usuario');
            throw new Error('Transaction was cancelled by user');
          } else {
            toast.error('Error enviando la transacción: ' + txError.message);
            throw new Error(`Transaction failed: ${txError.message || 'Unknown error'}`);
          }
        }

      toast.success('Transacción enviada. Esperando confirmación...')

      // Wait for transaction confirmation with improved error handling
      let receipt = null
      let attempts = 0
      const maxAttempts = 60 // 5 minutes maximum wait time
      const pollInterval = 5000 // 5 seconds

      while (!receipt && attempts < maxAttempts) {
        try {
          receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [transactionHash],
          })
          
          if (!receipt) {
            await new Promise(resolve => setTimeout(resolve, pollInterval))
            attempts++
          } else {
            // Verificar el estado de la transacción
            if (receipt.status === '0x1') {
              // Transacción confirmada exitosamente
              console.log('Transaction confirmed:', transactionHash)
              
              // Notificar al servidor sobre la confirmación
              try {
                await axios.post(`/api/transactions/confirm/${transactionHash}`, {
                  receipt
                })
              } catch (notifyError) {
                console.warn('Failed to notify server about transaction confirmation:', notifyError)
              }
              
              break
            } else if (receipt.status === '0x0') {
              // Transacción falló
              console.error('Transaction failed:', transactionHash)
              
              // Notificar al servidor sobre la cancelación
              try {
                await axios.post(`/api/transactions/cancel/${transactionHash}`, {
                  reason: 'Transaction failed on blockchain'
                })
              } catch (notifyError) {
                console.warn('Failed to notify server about transaction failure:', notifyError)
              }
              
              throw new Error('Transaction failed on blockchain')
            }
          }
        } catch (error) {
          // Si hay error obteniendo el receipt, podría ser que la transacción esté pendiente
          await new Promise(resolve => setTimeout(resolve, pollInterval))
          attempts++
          
          // En el último intento, verificar si la transacción existe
          if (attempts >= maxAttempts) {
            try {
              const tx = await window.ethereum.request({
                method: 'eth_getTransactionByHash',
                params: [transactionHash],
              })
              
              if (!tx) {
                throw new Error('Transaction not found - may have been cancelled or dropped')
              } else {
                throw new Error('Transaction timeout - please check your wallet or blockchain explorer')
              }
            } catch (txCheckError) {
              throw new Error('Transaction verification failed - transaction may have been cancelled')
            }
          }
        }
      }

      if (!receipt) {
        console.error('Transaction timeout:', transactionHash)
        
        // Notificar al servidor sobre el timeout
        try {
          await axios.post(`/api/transactions/cancel/${transactionHash}`, {
            reason: 'Transaction timeout'
          })
        } catch (notifyError) {
          console.warn('Failed to notify server about transaction timeout:', notifyError)
        }
        
        throw new Error('Transaction confirmation timeout')
      }

      if (receipt.status === '0x0') {
        throw new Error('Transaction failed on blockchain')
      }

      toast.success('Payment completed successfully')

      // Generate real payment token based on transaction
      return `real_${transactionHash}_${Date.now()}`
      
    } catch (error) {
      // Si tenemos un hash de transacción pero falló la confirmación, 
      // aún podríamos tener una transacción válida pendiente
      if (transactionHash && error.message.includes('timeout')) {
        toast.warning('Transaction may still be processing. Please check your wallet.')
        // Retornar el token pero con advertencia
        return `real_${transactionHash}_${Date.now()}_pending`
      }
      
      // Re-lanzar el error para que sea manejado por el código que llama
      throw error
    }
  }

  // Function to retry service with payment token
  const retryServiceWithToken = async (paymentToken) => {
    try {
      let response
      const formDataToSend = new FormData()

      // Prepare form data based on service type - same as executeService
      switch (selectedService.id) {
        case 'text-analysis':
          formDataToSend.append('text', formData.text)
          response = await axios.post('/api/services/text-analysis', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${paymentToken}`
            }
          })
          break

        case 'text-translation':
          formDataToSend.append('text', formData.text)
          formDataToSend.append('from', formData.sourceLanguage || 'auto')
          formDataToSend.append('to', formData.targetLanguage || 'en')
          response = await axios.post('/api/services/text-translate', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${paymentToken}`
            }
          })
          break

        case 'image-resize':
          formDataToSend.append('image', formData.image)
          formDataToSend.append('width', formData.width || '800')
          formDataToSend.append('height', formData.height || '600')
          response = await axios.post('/api/services/image-resize', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${paymentToken}`
            },
            responseType: 'blob'
          })
          break

        case 'ocr':
          formDataToSend.append('image', formData.image)
          response = await axios.post('/api/services/ocr', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${paymentToken}`
            }
          })
          break

        case 'image-optimize':
          formDataToSend.append('image', formData.image)
          formDataToSend.append('quality', formData.quality || '80')
          response = await axios.post('/api/services/image-optimize', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${paymentToken}`
            },
            responseType: 'blob'
          })
          break

        default:
          throw new Error('Unknown service type')
      }

      // Handle response based on service type - same as executeService
      if (selectedService.id === 'image-resize' || selectedService.id === 'image-optimize') {
        // For image services, create a download URL
        const blob = response.data
        const url = window.URL.createObjectURL(blob)
        setResult({
          type: 'image',
          url: url,
          fileName: `processed_${formData.image?.name || 'image.jpg'}`,
          originalFileName: formData.image?.name || 'image.jpg'
        })
      } else {
        // For text services, use JSON response
        setResult(response.data)
      }

      toast.success('Service executed successfully after payment')
      
    } catch (retryError) {
      console.error('Error retrying service:', retryError)
      throw new Error('Service execution failed after payment')
    }
  }

  const executeService = async () => {
    if (!validateFormData()) {
      toast.error('Please complete all required fields')
      return
    }

    if (!walletConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    setLoading(true)
    
    try {
      let response
      const formDataToSend = new FormData()

      // Prepare form data based on service type
      switch (selectedService.id) {
        case 'text-analysis':
          formDataToSend.append('text', formData.text)
          response = await axios.post('/api/services/text-analysis', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': walletAddress ? `Bearer ${walletAddress}` : undefined
            }
          })
          break

        case 'text-translation':
          formDataToSend.append('text', formData.text)
          formDataToSend.append('from', formData.sourceLanguage || 'auto')
          formDataToSend.append('to', formData.targetLanguage || 'en')
          response = await axios.post('/api/services/text-translate', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': walletAddress ? `Bearer ${walletAddress}` : undefined
            }
          })
          break

        case 'image-resize':
          formDataToSend.append('image', formData.image)
          formDataToSend.append('width', formData.width || '800')
          formDataToSend.append('height', formData.height || '600')
          response = await axios.post('/api/services/image-resize', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': walletAddress ? `Bearer ${walletAddress}` : undefined
            },
            responseType: 'blob'
          })
          break

        case 'ocr':
          formDataToSend.append('image', formData.image)
          response = await axios.post('/api/services/ocr', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': walletAddress ? `Bearer ${walletAddress}` : undefined
            }
          })
          break

        case 'image-optimize':
          formDataToSend.append('image', formData.image)
          formDataToSend.append('quality', formData.quality || '80')
          response = await axios.post('/api/services/image-optimize', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': walletAddress ? `Bearer ${walletAddress}` : undefined
            },
            responseType: 'blob'
          })
          break

        default:
          throw new Error('Unknown service type')
      }

      // Handle response based on service type
      if (selectedService.id === 'image-resize' || selectedService.id === 'image-optimize') {
        // For image services, create a download URL
        const blob = response.data
        const url = window.URL.createObjectURL(blob)
        setResult({
          type: 'image',
          url: url,
          fileName: `processed_${formData.image?.name || 'image.jpg'}`,
          originalFileName: formData.image?.name || 'image.jpg'
        })
      } else {
        // For text services, use JSON response
        setResult(response.data)
      }

      toast.success('Service executed successfully')
      
    } catch (error) {
      console.error('Error executing service:', error)
      
      // Handle x402 payment required - Execute payment directly
      if (error.response?.status === 402) {
        const paymentInfo = error.response.data
        toast('Payment required. Opening MetaMask...', { icon: '💳' })
        
        try {
          const paymentToken = await executeMetaMaskPayment(paymentInfo)
          
          // Retry the service with the payment token
          await retryServiceWithToken(paymentToken)
          
        } catch (paymentError) {
          console.error('Payment failed:', paymentError)
          toast.error('Payment failed: ' + paymentError.message)
        }
      } else {
        toast.error(error.response?.data?.message || 'Error executing service')
      }
    } finally {
      setLoading(false)
    }
  }

  // Service icons mapping
  const serviceIcons = {
    'text-analysis': Brain,
    'image-resize': ImageIcon,
    'ocr': FileText,
    'text-translation': Languages,
    'image-optimize': Zap
  }

  // Memoize the dropzone to avoid hook issues
  const dropzoneConfig = useMemo(() => ({
    onDrop: handleFileUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: false
  }), [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneConfig)

  const renderServiceForm = () => {
    if (!selectedService) return null

    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-3">
          {selectedService.name}
        </h3>
        <p className="text-slate-300 mb-4 text-sm">{selectedService.description}</p>

        {/* Service-specific form */}
        {(selectedService.id === 'text-analysis' || selectedService.id === 'text-translation') && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Text to process
            </label>
            <textarea
              value={formData.text || ''}
              onChange={(e) => handleInputChange('text', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={3}
              placeholder="Enter text here..."
            />
          </div>
        )}

        {/* Translation specific fields */}
        {selectedService.id === 'text-translation' && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                From Language
              </label>
              <select
                value={formData.sourceLanguage || 'auto'}
                onChange={(e) => handleInputChange('sourceLanguage', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="auto">Auto-detect</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                To Language
              </label>
              <select
                value={formData.targetLanguage || 'en'}
                onChange={(e) => handleInputChange('targetLanguage', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
        )}

        {/* Image resize specific fields */}
        {selectedService.id === 'image-resize' && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Width (px)
              </label>
              <input
                type="number"
                value={formData.width || '800'}
                onChange={(e) => handleInputChange('width', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Height (px)
              </label>
              <input
                type="number"
                value={formData.height || '600'}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="600"
              />
            </div>
          </div>
        )}

        {/* Image optimization specific fields */}
        {selectedService.id === 'image-optimize' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Quality: {formData.quality || 80}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={formData.quality || 80}
              onChange={(e) => handleInputChange('quality', e.target.value)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        {/* File upload for image services */}
        {(selectedService.id === 'image-resize' || selectedService.id === 'ocr' || selectedService.id === 'image-optimize') && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Upload Image
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              {formData.image ? (
                <div>
                  <p className="text-green-400 font-medium text-sm">{formData.image.name}</p>
                  <p className="text-slate-400 text-xs">Click or drag to replace</p>
                </div>
              ) : (
                <div>
                  <p className="text-slate-300 mb-1 text-sm">
                    {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                  </p>
                  <p className="text-slate-400 text-xs">or click to select</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Price display */}
        <div className="flex items-center justify-between mb-4 p-3 bg-slate-700/50 rounded-lg">
          <span className="text-slate-300 text-sm">Service Price:</span>
          <span className="text-green-400 font-semibold">
            {selectedService.price} {selectedService.currency}
          </span>
        </div>

        {/* Execute button */}
        <button
          onClick={executeService}
          disabled={loading || !validateFormData()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Execute Service
            </>
          )}
        </button>
      </div>
    )
  }

  const renderResult = () => {
    if (!result) return null

    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mt-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-400" />
          Service Result
        </h3>

        {result.type === 'image' ? (
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-lg p-4">
              <img 
                src={result.url} 
                alt="Processed" 
                className="max-w-full h-auto rounded-lg"
              />
            </div>
            <button
              onClick={() => {
                const link = document.createElement('a')
                link.href = result.url
                link.download = result.fileName
                link.click()
              }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download {result.fileName}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedService.id === 'text-analysis' && result.result && (
              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-2">Sentiment Analysis</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400">Sentiment:</span>
                    <span className={`ml-2 font-semibold ${
                      result.result.sentiment === 'positive' ? 'text-green-400' :
                      result.result.sentiment === 'negative' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {result.result.sentiment}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Score:</span>
                    <span className="ml-2 text-white font-semibold">{result.result.score}</span>
                  </div>
                </div>
              </div>
            )}

            {selectedService.id === 'text-translation' && result.result && (
              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-2">Translation Result</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400">Original:</span>
                    <p className="text-white mt-1">{result.input.text}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Translated:</span>
                    <p className="text-green-400 mt-1 font-medium">{result.result.translatedText}</p>
                  </div>
                  <div className="text-sm text-slate-400">
                    Detected language: {result.result.detectedLanguage} → {result.input.to}
                  </div>
                </div>
              </div>
            )}

            {selectedService.id === 'ocr' && result.result && (
              <div className="bg-slate-900 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-2">Extracted Text</h4>
                <div className="bg-slate-800 rounded p-3">
                  <pre className="text-slate-300 whitespace-pre-wrap">{result.result.text}</pre>
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  Confidence: {Math.round(result.result.confidence * 100)}%
                </div>
              </div>
            )}

            <div className="bg-slate-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-medium text-white">Raw Response</h4>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
                    toast.success('Copied to clipboard')
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Copy JSON
                </button>
              </div>
              <pre className="text-slate-300 text-sm overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="px-5 py-4">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white mb-3"
          >
            AI Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-slate-300"
          >
            Choose from our AI-powered services. Pay only for what you use.
          </motion.p>

          {/* Wallet Status */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4"
          >
            {walletConnected ? (
              <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-600/30 rounded-lg px-3 py-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium text-sm">
                  Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </motion.div>
        </div>

        {/* Services Grid - Mobile Layout */}
        <div className="space-y-6">
          {/* Available Services */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Available Services</h2>
            <div className="space-y-3">
              {services.map((service) => {
                const IconComponent = serviceIcons[service.id] || Brain
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-slate-800 rounded-lg border p-4 cursor-pointer transition-all ${
                      selectedService?.id === service.id
                        ? 'border-blue-500 ring-2 ring-blue-500/20'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 p-2 rounded-lg">
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-white mb-1">
                          {service.name}
                        </h3>
                        <p className="text-slate-300 mb-2 text-sm">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-green-400 font-semibold text-sm">
                            {service.price} {service.currency}
                          </span>
                          {selectedService?.id === service.id && (
                            <span className="text-blue-400 text-xs font-medium">
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Selected Service Panel */}
          <div>
            {selectedService ? (
              <>
                {renderServiceForm()}
                {renderResult()}
              </>
            ) : (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 text-center">
                <Brain className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Select a Service
                </h3>
                <p className="text-slate-300 text-sm">
                  Choose an AI service from the list to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services