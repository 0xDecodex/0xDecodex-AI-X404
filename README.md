# AI Agent Services Hub

Un hub de servicios de IA descentralizado construido con x402 para pagos automáticos en la red Base. Esta aplicación permite a los usuarios acceder a diversos servicios de IA mediante micropagos automáticos.

## 🚀 Características

- **Servicios de IA Integrados**: Análisis de sentimientos, redimensionamiento de imágenes, OCR, traducción de texto y optimización de imágenes
- **Pagos Automáticos x402**: Micropagos automáticos usando USDC en la red Base
- **Dashboard de Analytics**: Métricas en tiempo real de uso y ingresos
- **Interfaz Moderna**: UI responsive con diseño AI-themed usando React y Tailwind CSS
- **Rate Limiting**: Protección contra abuso con límites de velocidad configurables
- **Health Monitoring**: Endpoints de salud para monitoreo del sistema

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** con Express.js
- **x402** para pagos automáticos
- **Base Network** (Ethereum L2)
- **USDC** como moneda de pago
- Middleware de seguridad (Helmet, CORS)
- Rate limiting con `rate-limiter-flexible`

### Frontend
- **React 18** con Vite
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **React Router** para navegación
- **Lucide React** para iconos
- **React Hot Toast** para notificaciones

### Servicios de IA
- **Sentiment Analysis** - Análisis de sentimientos de texto
- **Image Resizing** - Redimensionamiento de imágenes con Sharp
- **OCR** - Reconocimiento óptico de caracteres con Tesseract.js
- **Text Translation** - Traducción de texto
- **Image Optimization** - Optimización de imágenes

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Wallet con USDC en Base Network (para usar servicios)

### Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd x402_base
```

2. **Instalar dependencias**
```bash
# Instalar dependencias principales
npm install

# Instalar dependencias del servidor
cd server && npm install

# Instalar dependencias del cliente
cd ../client && npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp server/.env.example server/.env
```

Editar `server/.env` con tus configuraciones:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# x402 Configuration
X402_FACILITATOR_URL=https://facilitator.x402.org
WALLET_ADDRESS=tu_direccion_de_wallet
PRIVATE_KEY=tu_clave_privada

# Base Network Configuration
BASE_RPC_URL=https://mainnet.base.org
BASE_TESTNET_RPC_URL=https://goerli.base.org

# Optional API Keys
OPENAI_API_KEY=tu_api_key_de_openai
GOOGLE_TRANSLATE_API_KEY=tu_api_key_de_google_translate

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. **Ejecutar la aplicación**
```bash
# Desde el directorio raíz
npm run dev
```

Esto iniciará:
- Backend en `http://localhost:3001`
- Frontend en `http://localhost:3000`

## 🔧 Scripts Disponibles

### Directorio Raíz
- `npm run dev` - Inicia backend y frontend simultáneamente
- `npm run server:dev` - Solo backend en modo desarrollo
- `npm run client:dev` - Solo frontend en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run install:all` - Instala dependencias en todos los directorios

### Backend (server/)
- `npm run dev` - Servidor en modo desarrollo con nodemon
- `npm start` - Servidor en modo producción

### Frontend (client/)
- `npm run dev` - Servidor de desarrollo Vite
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecutar ESLint

## 📡 API Endpoints

### Servicios
- `GET /api/services` - Lista todos los servicios disponibles
- `POST /api/services/text-analysis` - Análisis de sentimientos (0.005 USDC)
- `POST /api/services/image-resize` - Redimensionar imagen (0.01 USDC)
- `POST /api/services/ocr` - OCR de imagen (0.015 USDC)
- `POST /api/services/translate` - Traducir texto (0.008 USDC)
- `POST /api/services/image-optimize` - Optimizar imagen (0.012 USDC)

### Analytics
- `GET /api/analytics/overview` - Resumen general de métricas
- `GET /api/analytics/services` - Estadísticas por servicio
- `GET /api/analytics/daily` - Estadísticas diarias
- `GET /api/analytics/network` - Estado de la red Base
- `GET /api/analytics/users` - Estadísticas de usuarios
- `GET /api/analytics/realtime` - Métricas en tiempo real

### Health
- `GET /api/health` - Health check básico
- `GET /api/health/detailed` - Health check detallado
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe

## 💰 Sistema de Pagos x402

Los servicios utilizan el protocolo x402 para pagos automáticos:

1. **Solicitud inicial**: El cliente hace una petición al servicio
2. **Respuesta 402**: Si no hay pago válido, se devuelve código 402 con instrucciones de pago
3. **Procesamiento de pago**: El cliente procesa el pago automáticamente
4. **Retry con token**: Se reintenta la petición con el token de pago
5. **Servicio ejecutado**: Se ejecuta el servicio y se devuelve el resultado

### Ejemplo de uso con JavaScript:
```javascript
const response = await fetch('/api/services/text-analysis', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Este es un texto de ejemplo para analizar'
  })
});

if (response.status === 402) {
  // Manejar pago x402
  const paymentInfo = await response.json();
  // Procesar pago y reintentar...
}
```

## 🔒 Seguridad

- **Helmet.js**: Headers de seguridad HTTP
- **CORS**: Configuración de CORS para desarrollo y producción
- **Rate Limiting**: Límites de velocidad por IP
- **Input Validation**: Validación de entrada en todos los endpoints
- **Environment Variables**: Configuración sensible en variables de entorno

## 📊 Monitoreo

La aplicación incluye endpoints de health check para monitoreo:

- **Basic Health**: Estado básico del servidor
- **Detailed Health**: Incluye conectividad con facilitador x402 y red Base
- **Readiness**: Para orquestadores como Kubernetes
- **Liveness**: Para detectar si la aplicación está funcionando

## 🚀 Deployment

### Docker (Recomendado)
```bash
# Construir imagen
docker build -t ai-agent-services-hub .

# Ejecutar contenedor
docker run -p 3000:3000 -p 3001:3001 --env-file server/.env ai-agent-services-hub
```

### Vercel/Netlify (Frontend)
1. Construir el frontend: `cd client && npm run build`
2. Desplegar la carpeta `client/dist`
3. Configurar proxy para API calls al backend

### Railway/Heroku (Backend)
1. Configurar variables de entorno
2. Desplegar desde `server/` directory
3. Asegurar que `PORT` esté configurado correctamente

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación en `/documentation`
2. Verifica los logs del servidor
3. Asegúrate de que las variables de entorno estén configuradas correctamente
4. Verifica que tengas USDC en tu wallet para usar los servicios

## 🔮 Roadmap

- [ ] Más servicios de IA (GPT, DALL-E, etc.)
- [ ] Soporte para más redes blockchain
- [ ] Sistema de suscripciones
- [ ] API de webhooks
- [ ] Dashboard de administración
- [ ] Métricas avanzadas con Grafana
- [ ] Tests automatizados
- [ ] Documentación interactiva con Swagger