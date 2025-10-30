const http = require('http');

const API_BASE = 'http://localhost:3001/api';

function makeRequest(method, url, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ data: jsonData, status: res.statusCode });
        } catch (e) {
          resolve({ data: body, status: res.statusCode });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testTransactionFlow() {
  console.log('🧪 Testing Transaction Flow...\n');

  try {
    // 1. Verificar estadísticas iniciales
    console.log('1. Checking initial stats...');
    const initialStats = await makeRequest('GET', `${API_BASE}/transactions/stats`);
    console.log('Initial stats:', initialStats.data);
    console.log('');

    // 2. Simular una transacción pendiente (esto normalmente lo haría el cliente)
    const testTxHash = '0x' + Math.random().toString(16).substr(2, 40);
    console.log(`2. Simulating pending transaction: ${testTxHash}`);
    
    // Simular que el monitor detecta una nueva transacción
    const transactionMonitor = require('./server/utils/transactionMonitor');
    transactionMonitor.addTransaction(testTxHash, {
      amount: '1.00',
      currency: 'USDC',
      service: 'text-analysis'
    });
    console.log('Transaction added to monitor');
    console.log('');

    // 3. Verificar transacciones pendientes
    console.log('3. Checking pending transactions...');
    const pendingTxs = await makeRequest('GET', `${API_BASE}/transactions/pending`);
    console.log('Pending transactions:', pendingTxs.data);
    console.log('');

    // 4. Verificar estado de la transacción específica
    console.log('4. Checking transaction status...');
    const txStatus = await makeRequest('GET', `${API_BASE}/transactions/status/${testTxHash}`);
    console.log('Transaction status:', txStatus.data);
    console.log('');

    // 5. Simular confirmación de transacción
    console.log('5. Confirming transaction...');
    const confirmResult = await makeRequest('POST', `${API_BASE}/transactions/confirm/${testTxHash}`, {
      receipt: {
        status: '0x1',
        blockNumber: '0x123456',
        gasUsed: '0x5208'
      }
    });
    console.log('Confirmation result:', confirmResult.data);
    console.log('');

    // 6. Verificar estadísticas finales
    console.log('6. Checking final stats...');
    const finalStats = await makeRequest('GET', `${API_BASE}/transactions/stats`);
    console.log('Final stats:', finalStats.data);
    console.log('');

    // 7. Probar cancelación con otra transacción
    const testTxHash2 = '0x' + Math.random().toString(16).substr(2, 40);
    console.log(`7. Testing cancellation with: ${testTxHash2}`);
    
    transactionMonitor.addTransaction(testTxHash2, {
      amount: '0.01',
      currency: 'USDC',
      service: 'image-resize'
    });
    
    const cancelResult = await makeRequest('POST', `${API_BASE}/transactions/cancel/${testTxHash2}`, {
      reason: 'User cancelled transaction'
    });
    console.log('Cancellation result:', cancelResult.data);
    console.log('');

    // 8. Verificar estadísticas después de cancelación
    console.log('8. Stats after cancellation...');
    const statsAfterCancel = await makeRequest('GET', `${API_BASE}/transactions/stats`);
    console.log('Stats after cancellation:', statsAfterCancel.data);
    console.log('');

    console.log('✅ All transaction flow tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Ejecutar las pruebas
testTransactionFlow();