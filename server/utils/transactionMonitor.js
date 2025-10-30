const EventEmitter = require('events');

class TransactionMonitor extends EventEmitter {
  constructor() {
    super();
    this.pendingTransactions = new Map();
    this.timeoutDuration = 10 * 60 * 1000; // 10 minutos por defecto
    this.cleanupInterval = 60 * 1000; // Limpiar cada minuto
    
    // Iniciar limpieza automática
    this.startCleanup();
  }

  // Agregar una transacción para monitoreo
  addTransaction(transactionHash, metadata = {}) {
    const transaction = {
      hash: transactionHash,
      timestamp: Date.now(),
      status: 'pending',
      metadata: metadata,
      timeoutId: null
    };

    // Configurar timeout
    transaction.timeoutId = setTimeout(() => {
      this.handleTimeout(transactionHash);
    }, this.timeoutDuration);

    this.pendingTransactions.set(transactionHash, transaction);
    
    console.log(`Monitoring transaction: ${transactionHash}`);
    this.emit('transactionAdded', transaction);
    
    return transaction;
  }

  // Marcar transacción como confirmada
  confirmTransaction(transactionHash, receipt = null) {
    const transaction = this.pendingTransactions.get(transactionHash);
    
    if (transaction) {
      // Cancelar timeout
      if (transaction.timeoutId) {
        clearTimeout(transaction.timeoutId);
      }
      
      transaction.status = 'confirmed';
      transaction.confirmedAt = Date.now();
      transaction.receipt = receipt;
      
      console.log(`Transaction confirmed: ${transactionHash}`);
      this.emit('transactionConfirmed', transaction);
      
      // Remover de pendientes después de un tiempo
      setTimeout(() => {
        this.pendingTransactions.delete(transactionHash);
      }, 5 * 60 * 1000); // 5 minutos
      
      return transaction;
    }
    
    return null;
  }

  // Marcar transacción como cancelada
  cancelTransaction(transactionHash, reason = 'User cancelled') {
    const transaction = this.pendingTransactions.get(transactionHash);
    
    if (transaction) {
      // Cancelar timeout
      if (transaction.timeoutId) {
        clearTimeout(transaction.timeoutId);
      }
      
      transaction.status = 'cancelled';
      transaction.cancelledAt = Date.now();
      transaction.cancelReason = reason;
      
      console.log(`Transaction cancelled: ${transactionHash} - ${reason}`);
      this.emit('transactionCancelled', transaction);
      
      // Remover inmediatamente
      this.pendingTransactions.delete(transactionHash);
      
      return transaction;
    }
    
    return null;
  }

  // Manejar timeout de transacción
  handleTimeout(transactionHash) {
    const transaction = this.pendingTransactions.get(transactionHash);
    
    if (transaction && transaction.status === 'pending') {
      transaction.status = 'timeout';
      transaction.timeoutAt = Date.now();
      
      console.log(`Transaction timeout: ${transactionHash}`);
      this.emit('transactionTimeout', transaction);
      
      // Remover de pendientes
      this.pendingTransactions.delete(transactionHash);
    }
  }

  // Obtener estado de transacción
  getTransactionStatus(transactionHash) {
    const transaction = this.pendingTransactions.get(transactionHash);
    
    if (transaction) {
      return {
        hash: transaction.hash,
        status: transaction.status,
        timestamp: transaction.timestamp,
        age: Date.now() - transaction.timestamp,
        metadata: transaction.metadata
      };
    }
    
    return null;
  }

  // Obtener todas las transacciones pendientes
  getPendingTransactions() {
    const pending = [];
    
    for (const [hash, transaction] of this.pendingTransactions) {
      if (transaction.status === 'pending') {
        pending.push({
          hash: hash,
          timestamp: transaction.timestamp,
          age: Date.now() - transaction.timestamp,
          metadata: transaction.metadata
        });
      }
    }
    
    return pending;
  }

  // Limpiar transacciones antiguas
  cleanup() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas
    
    for (const [hash, transaction] of this.pendingTransactions) {
      const age = now - transaction.timestamp;
      
      if (age > maxAge) {
        console.log(`Cleaning up old transaction: ${hash}`);
        
        // Cancelar timeout si existe
        if (transaction.timeoutId) {
          clearTimeout(transaction.timeoutId);
        }
        
        this.pendingTransactions.delete(hash);
        this.emit('transactionCleaned', transaction);
      }
    }
  }

  // Iniciar limpieza automática
  startCleanup() {
    setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  // Configurar duración de timeout
  setTimeoutDuration(duration) {
    this.timeoutDuration = duration;
  }

  // Obtener estadísticas
  getStats() {
    let pending = 0;
    let confirmed = 0;
    let cancelled = 0;
    let timeout = 0;
    
    for (const transaction of this.pendingTransactions.values()) {
      switch (transaction.status) {
        case 'pending':
          pending++;
          break;
        case 'confirmed':
          confirmed++;
          break;
        case 'cancelled':
          cancelled++;
          break;
        case 'timeout':
          timeout++;
          break;
      }
    }
    
    return {
      total: this.pendingTransactions.size,
      pending,
      confirmed,
      cancelled,
      timeout
    };
  }
}

// Singleton instance
const transactionMonitor = new TransactionMonitor();

module.exports = transactionMonitor;