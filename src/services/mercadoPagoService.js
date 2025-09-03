import { apiService } from './apiService';

class MercadoPagoService {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.baseURL = this.isProduction 
      ? 'https://api.mercadopago.com' 
      : 'https://api.mercadopago.com'; // Mesmo endpoint, diferencia por credenciais
  }

  // Criar preferência de pagamento para um serviço
  async createPaymentPreference(serviceData) {
    if (!this.isProduction) {
      // Simulação para desenvolvimento
      return {
        success: true,
        id: `PREF_${Date.now()}`,
        init_point: `https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=PREF_${Date.now()}`,
        sandbox_init_point: `https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=PREF_${Date.now()}`,
        qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        pix_qr_code: '00020126580014br.gov.bcb.pix013636ed6c8c-2e93-4c35-9470-c4e2b5e6a1ee5204000053039865802BR5925MERCADO PAGO IP LTDA6009SAO PAULO62140510MP240110936304EC95'
      };
    }

    try {
      const preference = {
        items: [{
          title: serviceData.title,
          description: serviceData.description,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: serviceData.amount
        }],
        payer: {
          name: serviceData.customer.name,
          email: serviceData.customer.email,
          phone: {
            number: serviceData.customer.phone
          },
          address: {
            street_name: serviceData.customer.address?.street,
            street_number: serviceData.customer.address?.number,
            zip_code: serviceData.customer.address?.zipCode
          }
        },
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: serviceData.maxInstallments || 12
        },
        notification_url: serviceData.webhookUrl,
        external_reference: serviceData.bookingId,
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
      };

      const response = await fetch(`${this.baseURL}/checkout/preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceData.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preference)
      });

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar preferência de pagamento:', error);
      throw error;
    }
  }

  // Criar assinatura recorrente
  async createSubscription(planData) {
    if (!this.isProduction) {
      // Simulação para desenvolvimento
      return {
        success: true,
        id: `SUB_${Date.now()}`,
        status: 'pending',
        init_point: `https://sandbox.mercadopago.com.br/subscription/v1/redirect?sub_id=SUB_${Date.now()}`,
        preapproval_plan_id: `PLAN_${Date.now()}`
      };
    }

    try {
      const subscription = {
        reason: planData.title,
        auto_recurring: {
          frequency: planData.frequency, // 1 para mensal
          frequency_type: planData.frequencyType, // 'months'
          transaction_amount: planData.amount,
          currency_id: 'BRL'
        },
        payer_email: planData.customer.email,
        back_url: planData.backUrl,
        external_reference: planData.planId,
        notification_url: planData.webhookUrl
      };

      const response = await fetch(`${this.baseURL}/preapproval`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${planData.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      throw error;
    }
  }

  // Processar webhook
  async processWebhook(webhookData) {
    try {
      const { topic, id } = webhookData;

      switch (topic) {
        case 'payment':
          return await this.handlePaymentNotification(id);
        case 'merchant_order':
          return await this.handleOrderNotification(id);
        case 'preapproval':
          return await this.handleSubscriptionNotification(id);
        default:
          console.log('Tópico de webhook não tratado:', topic);
          return { success: true, message: 'Webhook recebido' };
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      throw error;
    }
  }

  // Buscar informações de pagamento
  async getPaymentInfo(paymentId, accessToken) {
    if (!this.isProduction) {
      // Simulação para desenvolvimento
      return {
        id: paymentId,
        status: 'approved',
        status_detail: 'accredited',
        transaction_amount: 150.00,
        currency_id: 'BRL',
        payment_method_id: 'pix',
        external_reference: 'BOOKING_123'
      };
    }

    try {
      const response = await fetch(`${this.baseURL}/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar informações do pagamento:', error);
      throw error;
    }
  }

  // Estornar pagamento
  async refundPayment(paymentId, amount, accessToken) {
    if (!this.isProduction) {
      // Simulação para desenvolvimento
      return {
        success: true,
        id: `REFUND_${Date.now()}`,
        amount: amount,
        status: 'approved'
      };
    }

    try {
      const refundData = amount ? { amount } : {}; // Estorno parcial ou total

      const response = await fetch(`${this.baseURL}/v1/payments/${paymentId}/refunds`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(refundData)
      });

      return await response.json();
    } catch (error) {
      console.error('Erro ao processar estorno:', error);
      throw error;
    }
  }

  // Cartões de teste para sandbox
  getTestCards() {
    return {
      approved: {
        number: '5031 4332 1540 6351',
        cvv: '123',
        expiry: '11/25',
        name: 'APRO'
      },
      rejected: {
        number: '5031 4332 1540 6353',
        cvv: '123',
        expiry: '11/25',
        name: 'OTHE'
      },
      pending: {
        number: '5031 4332 1540 6351',
        cvv: '123',
        expiry: '11/25',
        name: 'CONT'
      }
    };
  }

  // Validar configuração
  validateConfig(config) {
    const errors = [];

    if (!config.publicKey) {
      errors.push('Public Key é obrigatória');
    }

    if (!config.accessToken) {
      errors.push('Access Token é obrigatório');
    }

    if (config.environment === 'sandbox') {
      if (!config.publicKey.startsWith('TEST-')) {
        errors.push('Public Key deve começar com TEST- no ambiente sandbox');
      }
      if (!config.accessToken.startsWith('TEST-')) {
        errors.push('Access Token deve começar com TEST- no ambiente sandbox');
      }
    } else {
      if (!config.publicKey.startsWith('APP_USR-')) {
        errors.push('Public Key deve começar com APP_USR- no ambiente produção');
      }
      if (!config.accessToken.startsWith('APP_USR-')) {
        errors.push('Access Token deve começar com APP_USR- no ambiente produção');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Handlers privados
  async handlePaymentNotification(paymentId) {
    // Implementar lógica de atualização do status do pagamento
    console.log(`Pagamento ${paymentId} atualizado`);
    return { success: true, message: 'Pagamento processado' };
  }

  async handleOrderNotification(orderId) {
    // Implementar lógica de atualização do pedido
    console.log(`Pedido ${orderId} atualizado`);
    return { success: true, message: 'Pedido processado' };
  }

  async handleSubscriptionNotification(subscriptionId) {
    // Implementar lógica de atualização da assinatura
    console.log(`Assinatura ${subscriptionId} atualizada`);
    return { success: true, message: 'Assinatura processada' };
  }
}

export default new MercadoPagoService();