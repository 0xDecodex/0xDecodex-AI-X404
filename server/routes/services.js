const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const Sentiment = require('sentiment');
const rateLimit = require('express-rate-limit');
const X402Middleware = require('../middleware/x402');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const analyticsStorage = require('../utils/analyticsStorage');

const router = express.Router();
const sentiment = new Sentiment();
const x402 = new X402Middleware();

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 requests por ventana de tiempo
  message: 'Demasiadas solicitudes, inténtalo más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

// Configurar multer para uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Middleware de rate limiting ya está configurado con express-rate-limit
// Se aplicará directamente en las rutas usando limiter

// Listar todos los servicios disponibles
router.get('/', (req, res) => {
  const services = [
    {
      id: 'text-analysis',
      name: 'Sentiment Analysis',
      description: 'Analyzes the sentiment of text (positive, negative, neutral)',
      price: '0.005',
      currency: 'USDC',
      endpoint: '/api/services/text-analysis',
      method: 'POST',
      parameters: ['text']
    },
    {
      id: 'image-resize',
      name: 'Image Resize',
      description: 'Resizes images to specified dimensions',
      price: '0.01',
      currency: 'USDC',
      endpoint: '/api/services/image-resize',
      method: 'POST',
      parameters: ['image', 'width', 'height']
    },
    {
      id: 'ocr',
      name: 'Text Recognition (OCR)',
      description: 'Extracts text from images using OCR technology',
      price: '0.02',
      currency: 'USDC',
      endpoint: '/api/services/ocr',
      method: 'POST',
      parameters: ['image']
    },
    {
      id: 'text-translate',
      name: 'Text Translation',
      description: 'Translates text between different languages',
      price: '0.008',
      currency: 'USDC',
      endpoint: '/api/services/text-translate',
      method: 'POST',
      parameters: ['text', 'from', 'to']
    },
    {
      id: 'image-optimize',
      name: 'Image Optimization',
      description: 'Optimizes images for web by reducing size without losing quality',
      price: '0.015',
      currency: 'USDC',
      endpoint: '/api/services/image-optimize',
      method: 'POST',
      parameters: ['image', 'quality']
    }
  ];

  res.json({
    services,
    total: services.length,
    network: 'Base',
    facilitator: process.env.X402_FACILITATOR_URL
  });
});

// Servicio: Análisis de Sentimientos
router.post('/text-analysis', 
  limiter,
  upload.none(), // Para procesar FormData sin archivos
  x402.requirePayment('0.005', { service: 'text-analysis' }),
  async (req, res) => {
    let success = false;
    try {
      const { text } = req.body;
      
      if (!text || typeof text !== 'string') {
        await analyticsStorage.recordServiceRequest('text-analysis', 0.005, false);
        return res.status(400).json({
          error: 'Invalid input',
          message: 'Text parameter is required and must be a string'
        });
      }

      const result = sentiment.analyze(text);
      success = true;
      
      // Registrar métricas reales
      await analyticsStorage.recordServiceRequest('text-analysis', 0.005, true);
      
      res.json({
        service: 'text-analysis',
        input: text,
        result: {
          score: result.score,
          comparative: result.comparative,
          sentiment: result.score > 0 ? 'positive' : result.score < 0 ? 'negative' : 'neutral',
          words: result.words,
          positive: result.positive,
          negative: result.negative
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (!success) {
        await analyticsStorage.recordServiceRequest('text-analysis', 0.005, false);
      }
      res.status(500).json({
        error: 'Service error',
        message: 'Failed to analyze text sentiment'
      });
    }
  }
);

// Servicio: Redimensionar Imagen
router.post('/image-resize',
  limiter,
  upload.single('image'),
  x402.requirePayment('0.01', { service: 'image-resize' }),
  async (req, res) => {
    let success = false;
    try {
      if (!req.file) {
        await analyticsStorage.recordServiceRequest('image-resize', 0.01, false);
        return res.status(400).json({
          error: 'No image provided',
          message: 'Please upload an image file'
        });
      }

      const { width, height } = req.body;
      const targetWidth = parseInt(width) || 800;
      const targetHeight = parseInt(height) || 600;

      const resizedImage = await sharp(req.file.buffer)
        .resize(targetWidth, targetHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      success = true;
      
      // Registrar métricas reales
      await analyticsStorage.recordServiceRequest('image-resize', 0.01, true);

      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Length': resizedImage.length,
        'X-Service': 'image-resize',
        'X-Original-Size': req.file.size,
        'X-New-Size': resizedImage.length,
        'X-Dimensions': `${targetWidth}x${targetHeight}`
      });

      res.send(resizedImage);
    } catch (error) {
      if (!success) {
        await analyticsStorage.recordServiceRequest('image-resize', 0.01, false);
      }
      res.status(500).json({
        error: 'Service error',
        message: 'Failed to resize image'
      });
    }
  }
);

// Servicio: OCR (Reconocimiento de Texto)
router.post('/ocr',
  limiter,
  upload.single('image'),
  x402.requirePayment('0.02', { service: 'ocr' }),
  async (req, res) => {
    let success = false;
    try {
      if (!req.file) {
        await analyticsStorage.recordServiceRequest('ocr', 0.02, false);
        return res.status(400).json({
          error: 'No image provided',
          message: 'Please upload an image file'
        });
      }

      const { data: { text, confidence } } = await Tesseract.recognize(
        req.file.buffer,
        'eng+spa'
      );

      success = true;
      
      // Registrar métricas reales
      await analyticsStorage.recordServiceRequest('ocr', 0.02, true);

      res.json({
        service: 'ocr',
        result: {
          text: text.trim(),
          confidence: Math.round(confidence),
          wordCount: text.trim().split(/\s+/).length,
          language: 'auto-detected'
        },
        metadata: {
          imageSize: req.file.size,
          mimeType: req.file.mimetype,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      if (!success) {
        await analyticsStorage.recordServiceRequest('ocr', 0.02, false);
      }
      res.status(500).json({
        error: 'Service error',
        message: 'Failed to perform OCR on image'
      });
    }
  }
);

// Servicio: Traducción de Texto (simulado)
router.post('/text-translate',
  limiter,
  upload.none(), // Para procesar FormData sin archivos
  x402.requirePayment('0.008', { service: 'text-translate' }),
  async (req, res) => {
    let success = false;
    try {
      const { text, from = 'auto', to = 'en' } = req.body;
      
      if (!text || typeof text !== 'string') {
        await analyticsStorage.recordServiceRequest('text-translate', 0.008, false);
        return res.status(400).json({
          error: 'Invalid input',
          message: 'Text parameter is required and must be a string'
        });
      }

      // Simulación de traducción (en producción usarías Google Translate API u otro servicio)
      const translations = {
        'es-en': {
          'hola': 'hello',
          'mundo': 'world',
          'gracias': 'thank you',
          'por favor': 'please',
          'adiós': 'goodbye'
        },
        'en-es': {
          'hello': 'hola',
          'world': 'mundo',
          'thank you': 'gracias',
          'please': 'por favor',
          'goodbye': 'adiós'
        }
      };

      const translationKey = `${from}-${to}`;
      let translatedText = text.toLowerCase();
      
      if (translations[translationKey]) {
        Object.entries(translations[translationKey]).forEach(([original, translated]) => {
          translatedText = translatedText.replace(new RegExp(original, 'gi'), translated);
        });
      }

      success = true;
      
      // Registrar métricas reales
      await analyticsStorage.recordServiceRequest('text-translate', 0.008, true);

      res.json({
        service: 'text-translate',
        input: {
          text,
          from,
          to
        },
        result: {
          translatedText,
          detectedLanguage: from === 'auto' ? 'es' : from,
          confidence: 0.95
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (!success) {
        await analyticsStorage.recordServiceRequest('text-translate', 0.008, false);
      }
      res.status(500).json({
        error: 'Service error',
        message: 'Failed to translate text'
      });
    }
  }
);

// Servicio: Optimización de Imagen
router.post('/image-optimize',
  limiter,
  upload.single('image'),
  x402.requirePayment('0.015', { service: 'image-optimize' }),
  async (req, res) => {
    let success = false;
    try {
      if (!req.file) {
        await analyticsStorage.recordServiceRequest('image-optimize', 0.015, false);
        return res.status(400).json({
          error: 'No image provided',
          message: 'Please upload an image file'
        });
      }

      const quality = parseInt(req.body.quality) || 80;
      const validQuality = Math.max(10, Math.min(100, quality));

      const optimizedImage = await sharp(req.file.buffer)
        .jpeg({ 
          quality: validQuality,
          progressive: true,
          mozjpeg: true
        })
        .toBuffer();

      const compressionRatio = ((req.file.size - optimizedImage.length) / req.file.size * 100).toFixed(2);

      success = true;
      
      // Registrar métricas reales
      await analyticsStorage.recordServiceRequest('image-optimize', 0.015, true);

      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Length': optimizedImage.length,
        'X-Service': 'image-optimize',
        'X-Original-Size': req.file.size,
        'X-Optimized-Size': optimizedImage.length,
        'X-Compression-Ratio': `${compressionRatio}%`,
        'X-Quality': validQuality
      });

      res.send(optimizedImage);
    } catch (error) {
      if (!success) {
        await analyticsStorage.recordServiceRequest('image-optimize', 0.015, false);
      }
      res.status(500).json({
        error: 'Service error',
        message: 'Failed to optimize image'
      });
    }
  }
);

module.exports = router;