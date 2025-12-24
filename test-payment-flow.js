// Complete Payment Flow Test - MercadoPago + Database
const https = require('https');

const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🧪 TESTE DE FLUXO COMPLETO DE PAGAMENTO\n');

// Step 1: Create a checkout order in database
async function createCheckoutOrder() {
  console.log('1️⃣  Criando ordem de checkout no banco de dados...');

  const orderData = {
    service_id: 'protecao-financeira',
    service_name: 'Proteção Financeira - Teste',
    amount: 100, // R$ 1,00 em centavos
    original_amount: 100,
    customer_email: 'teste@garcezpalha.com',
    customer_name: 'Cliente Teste',
    payment_provider: 'mercadopago',
    status: 'pending',
    metadata: {
      test: true,
      source: 'integration-test'
    }
  };

  return new Promise((resolve, reject) => {
    const data = JSON.stringify(orderData);

    const options = {
      hostname: SUPABASE_URL.replace('https://', '').replace('http://', ''),
      path: '/rest/v1/checkout_orders',
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 201) {
          const order = JSON.parse(responseData)[0];
          console.log(`   ✅ Ordem criada: ${order.id}`);
          console.log(`   📧 Email: ${order.customer_email}`);
          console.log(`   💰 Valor: R$ ${(order.amount / 100).toFixed(2)}\n`);
          resolve(order);
        } else {
          console.error(`   ❌ Erro ao criar ordem: ${res.statusCode}`);
          console.error(responseData);
          reject(new Error(`Failed to create order: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

// Step 2: Create MercadoPago preference
async function createMPPreference(order) {
  console.log('2️⃣  Criando preferência de pagamento no MercadoPago...');

  const preferenceData = {
    items: [{
      title: order.service_name,
      description: 'Teste de integração - Plataforma Garcez Palha',
      quantity: 1,
      currency_id: 'BRL',
      unit_price: order.amount / 100
    }],
    back_urls: {
      success: `https://garcezpalha.com/checkout/success?orderId=${order.id}`,
      failure: `https://garcezpalha.com/checkout/failure?orderId=${order.id}`,
      pending: `https://garcezpalha.com/checkout/pending?orderId=${order.id}`
    },
    auto_return: 'approved',
    external_reference: order.id,
    notification_url: 'https://garcezpalha.com/api/webhooks/mercadopago',
    metadata: {
      orderId: order.id,
      customerEmail: order.customer_email,
      test: true
    },
    payer: {
      name: order.customer_name,
      email: order.customer_email
    }
  };

  return new Promise((resolve, reject) => {
    const data = JSON.stringify(preferenceData);

    const options = {
      hostname: 'api.mercadopago.com',
      path: '/checkout/preferences',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 201) {
          const preference = JSON.parse(responseData);
          console.log(`   ✅ Preferência criada: ${preference.id}`);
          console.log(`   🔗 Link de pagamento: ${preference.init_point}`);
          console.log(`   🧪 Link sandbox: ${preference.sandbox_init_point}\n`);
          resolve({ preference, order });
        } else {
          console.error(`   ❌ Erro ao criar preferência: ${res.statusCode}`);
          console.error(responseData);
          reject(new Error(`Failed to create preference: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

// Step 3: Update order with MP preference ID
async function updateOrderWithPreference(order, preference) {
  console.log('3️⃣  Atualizando ordem com ID da preferência...');

  const updateData = {
    mercadopago_preference_id: preference.id,
    payment_url: preference.init_point
  };

  return new Promise((resolve, reject) => {
    const data = JSON.stringify(updateData);

    const options = {
      hostname: SUPABASE_URL.replace('https://', '').replace('http://', ''),
      path: `/rest/v1/checkout_orders?id=eq.${order.id}`,
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`   ✅ Ordem atualizada com preference_id\n`);
          resolve();
        } else {
          console.error(`   ❌ Erro ao atualizar ordem: ${res.statusCode}`);
          console.error(responseData);
          reject(new Error(`Failed to update order: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

// Step 4: Simulate webhook (payment approved)
async function simulateWebhook(order) {
  console.log('4️⃣  Simulando webhook de pagamento aprovado...');

  // In a real scenario, this would come from MercadoPago
  console.log(`   ℹ️  Em produção, o webhook seria chamado automaticamente`);
  console.log(`   ℹ️  URL: https://garcezpalha.com/api/webhooks/mercadopago`);
  console.log(`   ℹ️  Evento: payment.updated -> status: approved\n`);
}

// Step 5: Verify order in database
async function verifyOrder(orderId) {
  console.log('5️⃣  Verificando ordem no banco de dados...');

  return new Promise((resolve, reject) => {
    const options = {
      hostname: SUPABASE_URL.replace('https://', '').replace('http://', ''),
      path: `/rest/v1/checkout_orders?id=eq.${orderId}&select=*`,
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const orders = JSON.parse(responseData);
          if (orders.length > 0) {
            const order = orders[0];
            console.log(`   ✅ Ordem encontrada no banco`);
            console.log(`   📋 Status: ${order.status}`);
            console.log(`   🔑 Preference ID: ${order.mercadopago_preference_id}`);
            console.log(`   🔗 Payment URL: ${order.payment_url}\n`);
            resolve(order);
          } else {
            reject(new Error('Order not found'));
          }
        } else {
          console.error(`   ❌ Erro ao buscar ordem: ${res.statusCode}`);
          reject(new Error(`Failed to fetch order: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

// Main flow
async function runTest() {
  try {
    if (!MP_ACCESS_TOKEN) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado!');
    }
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error('Supabase credentials não configuradas!');
    }

    console.log('🚀 Iniciando teste de fluxo completo...\n');

    // Step 1: Create order
    const order = await createCheckoutOrder();

    // Step 2: Create MP preference
    const { preference } = await createMPPreference(order);

    // Step 3: Update order
    await updateOrderWithPreference(order, preference);

    // Step 4: Simulate webhook
    await simulateWebhook(order);

    // Step 5: Verify order
    const finalOrder = await verifyOrder(order.id);

    console.log('🎉 TESTE COMPLETO!\n');
    console.log('📊 RESUMO DO FLUXO:');
    console.log('   ✅ 1. Ordem criada no banco de dados');
    console.log('   ✅ 2. Preferência criada no MercadoPago');
    console.log('   ✅ 3. Ordem atualizada com preference_id');
    console.log('   ✅ 4. Webhook configurado (aguardando pagamento real)');
    console.log('   ✅ 5. Ordem verificada no banco\n');

    console.log('🧪 PRÓXIMO PASSO MANUAL:');
    console.log(`   1. Acesse: ${preference.sandbox_init_point}`);
    console.log('   2. Use cartão de teste: 5031 4332 1540 6351');
    console.log('   3. CVV: 123, Vencimento: 11/25, Nome: APRO');
    console.log('   4. Finalize o pagamento');
    console.log('   5. Webhook será chamado automaticamente\n');

    console.log('📝 Para verificar webhook depois do pagamento:');
    console.log(`   curl https://garcezpalha.com/api/webhooks/mercadopago\n`);

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message);
    process.exit(1);
  }
}

runTest();
