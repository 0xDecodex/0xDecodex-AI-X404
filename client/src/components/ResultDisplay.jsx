import { motion } from 'framer-motion'
import { Download, Copy, CheckCircle, Image as ImageIcon, FileText, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'

const ResultDisplay = ({ result, service }) => {
  if (!result) return null

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Result copied to clipboard')
  }

  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = filename || 'processed-image.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Image downloaded')
  }

  const renderTextAnalysisResult = (data) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary-400" />
        <h3 className="text-lg font-semibold text-white">Sentiment Analysis</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${
              data.result.sentiment === 'positive' ? 'text-green-400' :
              data.result.sentiment === 'negative' ? 'text-red-400' :
              'text-yellow-400'
            }`}>
              {data.result.sentiment === 'positive' ? '😊' :
               data.result.sentiment === 'negative' ? '😞' : '😐'}
            </div>
            <div className="text-sm text-slate-400">Sentiment</div>
            <div className={`font-semibold capitalize ${
              data.result.sentiment === 'positive' ? 'text-green-400' :
              data.result.sentiment === 'negative' ? 'text-red-400' :
              'text-yellow-400'
            }`}>
              {data.result.sentiment}
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {data.result.score}
            </div>
            <div className="text-sm text-slate-400">Score</div>
            <div className="text-xs text-slate-500">
              (-5 a +5)
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {data.result.comparative.toFixed(3)}
            </div>
            <div className="text-sm text-slate-400">Comparative</div>
            <div className="text-xs text-slate-500">
              Per word
            </div>
          </div>
        </div>
      </div>
      
      {(data.result.positive.length > 0 || data.result.negative.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.result.positive.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="text-green-400 font-medium mb-2">Positive Words</h4>
              <div className="flex flex-wrap gap-2">
                {data.result.positive.map((word, index) => (
                  <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 text-sm rounded">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {data.result.negative.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h4 className="text-red-400 font-medium mb-2">Negative Words</h4>
              <div className="flex flex-wrap gap-2">
                {data.result.negative.map((word, index) => (
                  <span key={index} className="px-2 py-1 bg-red-500/20 text-red-300 text-sm rounded">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderOCRResult = (data) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary-400" />
        <h3 className="text-lg font-semibold text-white">Extracted Text</h3>
      </div>
      
      <div className="bg-slate-900 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-slate-400">OCR Result:</span>
          <button
            onClick={() => copyToClipboard(data.result.text)}
            className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 max-h-64 overflow-y-auto">
          <pre className="text-slate-300 whitespace-pre-wrap text-sm">
            {data.result.text || 'Could not extract text from image'}
          </pre>
        </div>
        
        {data.result.confidence && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-slate-400">Confidence:</span>
            <div className="flex-1 bg-slate-800 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${data.result.confidence}%` }}
              />
            </div>
            <span className="text-sm text-primary-400">{data.result.confidence}%</span>
          </div>
        )}
      </div>
    </div>
  )

  const renderTranslationResult = (data) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary-400" />
        <h3 className="text-lg font-semibold text-white">Translation</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 rounded-lg p-4">
          <h4 className="text-slate-400 text-sm mb-2">Original Text ({data.result.from}):</h4>
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-slate-300">{data.result.originalText}</p>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-slate-400 text-sm">Translation ({data.result.to}):</h4>
            <button
              onClick={() => copyToClipboard(data.result.translatedText)}
              className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-slate-300">{data.result.translatedText}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderImageResult = (imageUrl) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">Processed Image</h3>
        </div>
        <button
          onClick={() => downloadImage(imageUrl, `processed-${service?.id}-${Date.now()}.jpg`)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
      
      <div className="bg-slate-900 rounded-lg p-4">
        <img
          src={imageUrl}
          alt="Processed result"
          className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-xl p-6 border border-slate-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <h2 className="text-xl font-semibold text-white">Service Result</h2>
      </div>
      
      {result.type === 'json' && service?.id === 'text-analysis' && renderTextAnalysisResult(result.data)}
      {result.type === 'json' && service?.id === 'ocr' && renderOCRResult(result.data)}
      {result.type === 'json' && service?.id === 'text-translate' && renderTranslationResult(result.data)}
      {result.type === 'image' && renderImageResult(result.data)}
      
      {/* Metadata */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Service: {service?.name}</span>
          <span>Processed: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default ResultDisplay