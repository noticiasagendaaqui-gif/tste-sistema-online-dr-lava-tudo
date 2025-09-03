
import apiService from './apiService';
import API_CONFIG from '../config/apiConfig';

class PaymentService {
  constructor() {
    this.config = API_CONFIG;
    this.isProduction = !API_CONFIG.isDevelopment;
  }

  // ========== MÉTODOS PARA PRODUÇÃO (STRIPE/PAGSEGURO) ==========
  
  async createPaymentIntent(amount, currency = 'brl', metadata = {}) {
    try {
      if (this.isProduction) {
        const url = apiService.buildUrl('payment', 'createIntent');
        return await apiService.post(url, {
          amount: amount * 100, // Stripe usa centavos
          currency,
          metadata
        });
      }
      
      // Simulação para desenvolvimento
      return this.simulatePaymentIntent(amount, currency, metadata);
    } catch (error) {
      console.error('Erro ao criar intenção de pagamento:', error);
      throw error;
    }
  }

  async confirmPayment(paymentIntentId, paymentMethod) {
    try {
      if (this.isProduction) {
        const url = apiService.buildUrl('payment', 'confirm', { id: paymentIntentId });
        return await apiService.post(url, { payment_method: paymentMethod });
      }
      
      // Simulação para desenvolvimento
      return this.simulatePaymentConfirmation(paymentIntentId, paymentMethod);
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      throw error;
    }
  }

  async processRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      if (this.isProduction) {
        const url = apiService.buildUrl('payment', 'refund');
        return await apiService.post(url, {
          payment_intent: paymentIntentId,
          amount: amount ? amount * 100 : undefined,
          reason
        });
      }
      
      // Simulação para desenvolvimento
      return this.simulateRefund(paymentIntentId, amount, reason);
    } catch (error) {
      console.error('Erro ao processar reembolso:', error);
      throw error;
    }
  }

  // ========== MÉTODOS PIX (PARA INTEGRAÇÃO FUTURA) ==========
  
  async createPixPayment(amount, description, customerInfo) {
    try {
      // TODO: Integrar com API do Banco ou PagSeguro/Mercado Pago
      if (this.isProduction) {
        const url = `${this.config.baseUrls.payment}/pix/create`;
        return await apiService.post(url, {
          amount,
          description,
          customer: customerInfo
        });
      }
      
      // Simulação PIX
      return this.simulatePixPayment(amount, description);
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      throw error;
    }
  }

  // ========== MÉTODOS SIMULADOS (DESENVOLVIMENTO) ==========
  
  async simulatePaymentIntent(amount, currency, metadata) {
    await apiService.simulateApiDelay(1500);
    
    return {
      id: `pi_${Date.now()}`,
      amount: amount * 100,
      currency,
      status: 'requires_payment_method',
      client_secret: `pi_${Date.now()}_secret_test`,
      metadata
    };
  }

  async simulatePaymentConfirmation(paymentIntentId, paymentMethod) {
    await apiService.simulateApiDelay(2000);
    
    // Simular 90% de sucesso
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      return {
        id: paymentIntentId,
        status: 'succeeded',
        payment_method: paymentMethod,
        charges: {
          data: [{
            id: `ch_${Date.now()}`,
            amount: 15000, // Exemplo: R$ 150,00
            status: 'succeeded',
            receipt_url: `https://pay.stripe.com/receipts/test_${Date.now()}`
          }]
        }
      };
    } else {
      throw new Error('Pagamento recusado pelo cartão');
    }
  }

  async simulateRefund(paymentIntentId, amount, reason) {
    await apiService.simulateApiDelay(1500);
    
    return {
      id: `re_${Date.now()}`,
      payment_intent: paymentIntentId,
      amount: amount ? amount * 100 : 15000,
      status: 'succeeded',
      reason
    };
  }

  async simulatePixPayment(amount, description) {
    await apiService.simulateApiDelay(1000);
    
    return {
      id: `pix_${Date.now()}`,
      amount,
      description,
      status: 'pending',
      qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      qr_code_text: '00020126330014BR.GOV.BCB.PIX0111123456789525204000053039865802BR5913FULANO DE TAL6008BRASILIA62070503***6304',
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutos
    };
  }

  // ========== CONFIGURAÇÕES E UTILITÁRIOS ==========
  
  // Configurar Stripe (quando em produção)
  initializeStripe() {
    if (this.isProduction && window.Stripe) {
      return window.Stripe(this.config.apiKeys.stripe);
    }
    return null;
  }

  // Validar dados do cartão
  validateCardData(cardData) {
    const { number, expiry, cvc, name } = cardData;
    
    const errors = {};
    
    if (!number || number.length < 13) {
      errors.number = 'Número do cartão inválido';
    }
    
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      errors.expiry = 'Data de validade inválida (MM/AA)';
    }
    
    if (!cvc || cvc.length < 3) {
      errors.cvc = 'CVC inválido';
    }
    
    if (!name || name.trim().length < 2) {
      errors.name = 'Nome do portador é obrigatório';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Formatar valor monetário
  formatCurrency(value, currency = 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(value);
  }

  // Obter métodos de pagamento disponíveis
  getAvailablePaymentMethods() {
    return [
      {
        id: 'credit_card',
        name: 'Cartão de Crédito',
        icon: '💳',
        enabled: true
      },
      {
        id: 'debit_card',
        name: 'Cartão de Débito',
        icon: '💳',
        enabled: true
      },
      {
        id: 'pix',
        name: 'PIX',
        icon: '📱',
        enabled: true
      },
      {
        id: 'bank_transfer',
        name: 'Transferência Bancária',
        icon: '🏦',
        enabled: false // Habilitar quando implementar
      }
    ];
  }

  // Calcular taxas de pagamento
  calculateFees(amount, paymentMethod) {
    const fees = {
      credit_card: amount * 0.0399, // 3.99%
      debit_card: amount * 0.0199,  // 1.99%
      pix: 0,                       // Gratuito
      bank_transfer: 2.90           // Taxa fixa
    };
    
    return fees[paymentMethod] || 0;
  }

  // Salvar transação no localStorage (desenvolvimento)
  saveTransaction(transactionData) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift({
      ...transactionData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  // Obter histórico de transações
  getTransactionHistory() {
    return JSON.parse(localStorage.getItem('transactions') || '[]');
  }
}

export default new PaymentService();
