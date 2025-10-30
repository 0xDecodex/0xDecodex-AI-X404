const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const transactionMonitor = require('../utils/transactionMonitor');

class X402Middleware {
  constructor(options = {}) {
    this.facilitatorUrl = options.facilitatorUrl || process.env.X402_FACILITATOR_URL || 'https://x402.org';
    this.walletAddress = options.walletAddress || process.env.X402_WALLET_ADDRESS;
    this.defaultPrice = options.defaultPrice || '0.01'; // USDC
    this.currency = options.currency || 'USDC';
    this.network = options.network || 'base';
  }

  // Middleware para requerir pago x402
  requirePayment(price = null, metadata = {}) {
    return async (req, res, next) => {
      try {
        const paymentPrice = price || this.defaultPrice;
        const paymentId = uuidv4();
        
        // Verificar si ya hay un pago válido
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          const verificationResult = await this.verifyPayment(token);
          
          if (verificationResult.valid) {
            req.paymentVerified = true;
            req.paymentInfo = verificationResult;
            return next();
          }
        }

        // Generar instrucciones de pago x402
        const paymentInstructions = {
          id: paymentId,
          amount: paymentPrice,
          currency: this.currency,
          network: this.network,
          recipient: this.walletAddress,
          facilitator: this.facilitatorUrl,
          metadata: {
            service: req.path,
            timestamp: new Date().toISOString(),
            ...metadata
          }
        };

        // Responder con 402 Payment Required
        res.status(402).json({
          error: 'Payment Required',
          payment: paymentInstructions,
          message: `This service requires a payment of ${paymentPrice} ${this.currency}`,
          instructions: 'Send payment using x402 protocol and retry with payment proof'
        });

      } catch (error) {
        console.error('X402 Middleware Error:', error);
        res.status(500).json({
          error: 'Payment processing error',
          message: 'Unable to process payment request'
        });
      }
    };
  }

  // Verificar pago con el facilitador
  async verifyPayment(paymentToken) {
    try {
      // Verificar si es un token simulado para desarrollo/demo
      if (paymentToken.startsWith('sim_')) {
        console.log('Using simulated payment token for development');
        return {
          valid: true,
          type: 'simulated',
          timestamp: Date.now(),
          amount: '1.00',
          currency: 'USDC'
        };
      }

      // Decodificar el token de pago (formato: txHash_timestamp_signature)
      const tokenParts = paymentToken.split('_');
      if (tokenParts.length < 2) {
        return { valid: false, error: 'Invalid token format' };
      }

      const txHash = tokenParts[0];
      const timestamp = parseInt(tokenParts[1]);
      const now = Date.now();

      // Verificar si el token no ha expirado (30 minutos)
      const tokenAge = now - timestamp;
      const maxAge = 30 * 60 * 1000; // 30 minutos
      
      if (tokenAge > maxAge) {
        return { valid: false, error: 'Token expired' };
      }

      // Verificar estado de la transacción en el monitor
      const monitoredTx = transactionMonitor.getTransactionStatus(txHash);
      
      if (monitoredTx) {
        switch (monitoredTx.status) {
          case 'confirmed':
            return {
              valid: true,
              type: 'blockchain',
              txHash: txHash,
              timestamp: timestamp,
              confirmedAt: monitoredTx.confirmedAt || timestamp
            };
          case 'cancelled':
            return { valid: false, error: 'Transaction was cancelled' };
          case 'timeout':
            return { valid: false, error: 'Transaction timed out' };
          case 'pending':
            // Dar un período de gracia para transacciones pendientes
            const gracePeriod = 5 * 60 * 1000; // 5 minutos
            if (tokenAge < gracePeriod) {
              return {
                valid: true,
                type: 'pending',
                txHash: txHash,
                timestamp: timestamp,
                note: 'Transaction pending confirmation'
              };
            } else {
              return { valid: false, error: 'Transaction pending too long' };
            }
        }
      }

      // Si no está en el monitor, agregar para seguimiento
      transactionMonitor.addTransaction(txHash, {
        tokenTimestamp: timestamp,
        paymentToken: paymentToken
      });

      // TODO: Implementar verificación real en blockchain
      // Por ahora, aceptar transacciones nuevas con período de gracia
      const gracePeriod = 5 * 60 * 1000; // 5 minutos
      if (tokenAge < gracePeriod) {
        return {
          valid: true,
          type: 'pending',
          txHash: txHash,
          timestamp: timestamp,
          note: 'Transaction added to monitoring'
        };
      }

      return { valid: false, error: 'Unable to verify transaction' };

    } catch (error) {
      console.error('Error verifying payment:', error);
      return { valid: false, error: 'Verification failed' };
    }
  }

  // Método para verificar transacciones en blockchain (placeholder)
  async verifyBlockchainTransaction(transactionHash) {
    // TODO: Implementar verificación real usando Web3 o RPC
    // Por ahora, simulamos la verificación
    
    try {
      // En producción, aquí haríamos:
      // 1. Conectar a un nodo de Base Network
      // 2. Obtener la transacción por hash
      // 3. Verificar que sea una transferencia USDC
      // 4. Verificar el monto y destinatario
      // 5. Verificar que esté confirmada
      
      // Simulación: aceptar cualquier hash que parezca válido
      if (transactionHash && transactionHash.length === 66 && transactionHash.startsWith('0x')) {
        return true
      }
      
      return false
    } catch (error) {
      console.error('Blockchain verification error:', error)
      return false
    }
  }

  // Método para limpiar tokens expirados (opcional)
  cleanupExpiredTokens() {
    // Este método podría ejecutarse periódicamente para limpiar
    // tokens expirados de cualquier caché o base de datos
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 horas
    
    // TODO: Implementar limpieza de tokens expirados si se usa caché
    console.log('Cleaning up expired tokens older than', new Date(now - maxAge))
  }

  // Generar recibo de pago
  generateReceipt(paymentData) {
    return {
      id: paymentData.id,
      amount: paymentData.amount,
      currency: paymentData.currency,
      network: paymentData.network,
      timestamp: new Date().toISOString(),
      status: 'completed',
      txHash: paymentData.txHash || null
    };
  }
}

module.exports = X402Middleware;