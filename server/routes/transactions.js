const express = require('express');
const router = express.Router();
const transactionMonitor = require('../utils/transactionMonitor');

// Endpoint para confirmar una transacción
router.post('/confirm/:txHash', (req, res) => {
  try {
    const { txHash } = req.params;
    const { receipt } = req.body;
    
    const transaction = transactionMonitor.confirmTransaction(txHash, receipt);
    
    if (transaction) {
      res.json({
        success: true,
        message: 'Transaction confirmed',
        transaction: {
          hash: transaction.hash,
          status: transaction.status,
          confirmedAt: transaction.confirmedAt
        }
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
  } catch (error) {
    console.error('Error confirming transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Endpoint para cancelar una transacción
router.post('/cancel/:txHash', (req, res) => {
  try {
    const { txHash } = req.params;
    const { reason } = req.body;
    
    const transaction = transactionMonitor.cancelTransaction(txHash, reason || 'User cancelled');
    
    if (transaction) {
      res.json({
        success: true,
        message: 'Transaction cancelled',
        transaction: {
          hash: transaction.hash,
          status: transaction.status,
          cancelledAt: transaction.cancelledAt,
          cancelReason: transaction.cancelReason
        }
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
  } catch (error) {
    console.error('Error cancelling transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Endpoint para obtener el estado de una transacción
router.get('/status/:txHash', (req, res) => {
  try {
    const { txHash } = req.params;
    
    const status = transactionMonitor.getTransactionStatus(txHash);
    
    if (status) {
      res.json({
        success: true,
        transaction: status
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
  } catch (error) {
    console.error('Error getting transaction status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Endpoint para obtener todas las transacciones pendientes
router.get('/pending', (req, res) => {
  try {
    const pending = transactionMonitor.getPendingTransactions();
    
    res.json({
      success: true,
      count: pending.length,
      transactions: pending
    });
  } catch (error) {
    console.error('Error getting pending transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Endpoint para obtener estadísticas del monitor
router.get('/stats', (req, res) => {
  try {
    const stats = transactionMonitor.getStats();
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Error getting transaction stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Endpoint para webhook de actualizaciones de blockchain
router.post('/webhook/update', (req, res) => {
  try {
    const { txHash, status, receipt } = req.body;
    
    if (!txHash || !status) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: txHash, status'
      });
    }
    
    let transaction = null;
    
    switch (status) {
      case 'confirmed':
        transaction = transactionMonitor.confirmTransaction(txHash, receipt);
        break;
      case 'failed':
      case 'cancelled':
        transaction = transactionMonitor.cancelTransaction(txHash, `Transaction ${status}`);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid status'
        });
    }
    
    res.json({
      success: true,
      message: `Transaction ${status}`,
      transaction: transaction ? {
        hash: transaction.hash,
        status: transaction.status
      } : null
    });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;