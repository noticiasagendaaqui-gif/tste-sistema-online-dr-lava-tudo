
import API_CONFIG from '../config/apiConfig';

class ApiService {
  constructor() {
    this.config = API_CONFIG;
  }

  // Método base para fazer requisições HTTP
  async request(url, options = {}) {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.config.timeouts.default,
      ...otherOptions
    } = options;

    const requestOptions = {
      method,
      headers: {
        ...this.config.defaultHeaders,
        ...headers
      },
      ...otherOptions
    };

    if (body && method !== 'GET') {
      requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // Adicionar token de autenticação se disponível
    const token = localStorage.getItem('authToken');
    if (token) {
      requestOptions.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Response is not JSON, use default message
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Métodos auxiliares
  get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  post(url, body, options = {}) {
    return this.request(url, { ...options, method: 'POST', body });
  }

  put(url, body, options = {}) {
    return this.request(url, { ...options, method: 'PUT', body });
  }

  patch(url, body, options = {}) {
    return this.request(url, { ...options, method: 'PATCH', body });
  }

  delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }

  // Construir URL completa
  buildUrl(service, endpoint, params = {}) {
    const baseUrl = this.config.baseUrls[service];
    const endpointPath = this.config.services[service]?.endpoints[endpoint];
    
    if (!baseUrl || !endpointPath) {
      throw new Error(`Invalid service or endpoint: ${service}.${endpoint}`);
    }

    let url = `${baseUrl}${endpointPath}`;
    
    // Substituir parâmetros na URL
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, params[key]);
    });

    return url;
  }

  // Verificar se está em modo de desenvolvimento
  isDevelopment() {
    return this.config.isDevelopment;
  }

  // Simular delay para desenvolvimento
  async simulateApiDelay(ms = 1000) {
    if (this.isDevelopment()) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }
}

export default new ApiService();
