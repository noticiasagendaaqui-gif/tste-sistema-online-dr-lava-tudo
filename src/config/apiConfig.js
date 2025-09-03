
// Configuração centralizada de APIs
const API_CONFIG = {
  // Configurações de desenvolvimento/produção
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // URLs base das APIs
  baseUrls: {
    main: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    auth: process.env.REACT_APP_AUTH_API_URL || 'http://localhost:5000/api/auth',
    payment: process.env.REACT_APP_PAYMENT_API_URL || 'https://api.stripe.com/v1',
    mercadoPago: process.env.REACT_APP_MERCADO_PAGO_URL || 'https://api.mercadopago.com',
    maps: process.env.REACT_APP_MAPS_API_URL || 'https://maps.googleapis.com/maps/api',
    email: process.env.REACT_APP_EMAIL_API_URL || 'http://localhost:5000/api/email',
    sms: process.env.REACT_APP_SMS_API_URL || 'https://api.twilio.com/2010-04-01',
    whatsapp: process.env.REACT_APP_WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0'
  },

  // Chaves de API (usar variáveis de ambiente)
  apiKeys: {
    googleMaps: process.env.REACT_APP_GOOGLE_MAPS_KEY || 'ADICIONAR_CHAVE_GOOGLE_MAPS',
    stripe: process.env.REACT_APP_STRIPE_KEY || 'ADICIONAR_CHAVE_STRIPE',
    mercadoPagoPublic: process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY || 'ADICIONAR_CHAVE_PUBLICA_MERCADO_PAGO',
    mercadoPagoPublicSandbox: process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY_SANDBOX || 'TEST-ADICIONAR_CHAVE_SANDBOX',
    twilio: process.env.REACT_APP_TWILIO_KEY || 'ADICIONAR_CHAVE_TWILIO',
    whatsapp: process.env.REACT_APP_WHATSAPP_TOKEN || 'ADICIONAR_TOKEN_WHATSAPP',
    pusher: process.env.REACT_APP_PUSHER_KEY || 'ADICIONAR_CHAVE_PUSHER'
  },

  // Configurações de timeout
  timeouts: {
    default: 10000, // 10 segundos
    upload: 30000,  // 30 segundos
    payment: 20000  // 20 segundos
  },

  // Headers padrão
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },

  // Configurações específicas por serviço
  services: {
    auth: {
      endpoints: {
        login: '/login',
        register: '/register',
        refresh: '/refresh',
        logout: '/logout',
        resetPassword: '/reset-password',
        verifyEmail: '/verify-email'
      }
    },
    
    booking: {
      endpoints: {
        create: '/bookings',
        list: '/bookings',
        update: '/bookings/:id',
        cancel: '/bookings/:id/cancel',
        confirm: '/bookings/:id/confirm'
      }
    },

    payment: {
      endpoints: {
        createIntent: '/payment-intents',
        confirm: '/payment-intents/:id/confirm',
        refund: '/refunds',
        webhooks: '/webhooks/stripe'
      }
    },

    maps: {
      endpoints: {
        geocode: '/geocode/json',
        directions: '/directions/json',
        places: '/place/nearbysearch/json'
      }
    },

    email: {
      endpoints: {
        send: '/send',
        templates: '/templates',
        logs: '/logs'
      }
    },

    sms: {
      endpoints: {
        send: '/Accounts/:accountSid/Messages.json'
      }
    },

    whatsapp: {
      endpoints: {
        send: '/:phoneNumberId/messages',
        webhooks: '/webhooks'
      }
    }
  }
};

export default API_CONFIG;
