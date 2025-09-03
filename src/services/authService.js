
import apiService from './apiService';
import API_CONFIG from '../config/apiConfig';

class AuthService {
  constructor() {
    this.config = API_CONFIG;
    this.isProduction = !API_CONFIG.isDevelopment;
    this.tokenKey = 'authToken';
    this.userKey = 'user';
  }

  // ========== MÉTODOS PARA PRODUÇÃO (JWT/OAuth) ==========
  
  async loginWithAPI(email, password) {
    try {
      const url = apiService.buildUrl('auth', 'login');
      const response = await apiService.post(url, { email, password });
      
      if (response.token) {
        this.setAuthToken(response.token);
        this.setUser(response.user);
        return { success: true, user: response.user };
      }
      
      throw new Error('Token não recebido');
    } catch (error) {
      console.error('Erro no login via API:', error);
      throw error;
    }
  }

  async registerWithAPI(userData) {
    try {
      const url = apiService.buildUrl('auth', 'register');
      const response = await apiService.post(url, userData);
      
      if (response.token) {
        this.setAuthToken(response.token);
        this.setUser(response.user);
        return { success: true, user: response.user };
      }
      
      throw new Error('Registro falhou');
    } catch (error) {
      console.error('Erro no registro via API:', error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado');
      }
      
      const url = apiService.buildUrl('auth', 'refresh');
      const response = await apiService.post(url, { refresh_token: refreshToken });
      
      if (response.token) {
        this.setAuthToken(response.token);
        return response.token;
      }
      
      throw new Error('Refresh falhou');
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      this.logout();
      throw error;
    }
  }

  async resetPasswordWithAPI(email) {
    try {
      const url = apiService.buildUrl('auth', 'resetPassword');
      const response = await apiService.post(url, { email });
      return response;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw error;
    }
  }

  async verifyEmailWithAPI(token) {
    try {
      const url = apiService.buildUrl('auth', 'verifyEmail');
      const response = await apiService.post(url, { token });
      return response;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      throw error;
    }
  }

  // ========== MÉTODOS SIMULADOS (DESENVOLVIMENTO) ==========
  
  async loginSimulated(email, password) {
    await apiService.simulateApiDelay(1500);
    
    // Super admin hardcoded
    if (email === 'williamiurd.ramos@gmail.com' && password === '153020william') {
      const adminUser = {
        id: 1,
        name: 'William Ramos',
        email: email,
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=William+Ramos&background=dc2626&color=ffffff'
      };
      
      this.setUser(adminUser);
      this.setAuthToken('simulated_admin_token');
      return { success: true, user: adminUser };
    }
    
    // Funcionários (emails com "admin")
    if (email.includes('admin') && password.length >= 6) {
      const adminUser = {
        id: Date.now(),
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: email,
        role: 'admin',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3b82f6&color=ffffff`
      };
      
      this.setUser(adminUser);
      this.setAuthToken('simulated_staff_token');
      return { success: true, user: adminUser };
    }
    
    // Usuários regulares
    if (email && password && email.includes('@') && password.length >= 6) {
      const user = {
        id: Date.now(),
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: email,
        role: 'user',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=10b981&color=ffffff`
      };
      
      this.setUser(user);
      this.setAuthToken('simulated_user_token');
      return { success: true, user: user };
    }
    
    throw new Error('Credenciais inválidas');
  }

  async registerSimulated(userData) {
    await apiService.simulateApiDelay(2000);
    
    const { name, email, password, confirmPassword } = userData;
    
    // Validações
    if (!name || !email || !password) {
      throw new Error('Todos os campos são obrigatórios');
    }
    
    if (password !== confirmPassword) {
      throw new Error('Senhas não coincidem');
    }
    
    if (!email.includes('@')) {
      throw new Error('Email inválido');
    }
    
    if (password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }
    
    // Simular usuário já existente (às vezes)
    if (email === 'teste@existe.com') {
      throw new Error('Email já cadastrado');
    }
    
    const user = {
      id: Date.now(),
      name: name,
      email: email,
      role: 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=ffffff`,
      emailVerified: false,
      createdAt: new Date().toISOString()
    };
    
    this.setUser(user);
    this.setAuthToken('simulated_new_user_token');
    
    // Simular envio de email de boas-vindas
    setTimeout(() => {
      console.log('📧 Email de boas-vindas enviado para:', email);
    }, 1000);
    
    return { success: true, user: user };
  }

  // ========== MÉTODO PRINCIPAL (ADAPTATIVO) ==========
  
  async login(email, password) {
    try {
      // TODO: CONFIGURAR PARA PRODUÇÃO
      // Descomente a linha abaixo quando tiver API real configurada
      // if (this.isProduction) {
      //   return await this.loginWithAPI(email, password);
      // }

      // Por enquanto, usar método simulado
      return await this.loginSimulated(email, password);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      // TODO: CONFIGURAR PARA PRODUÇÃO
      // Descomente a linha abaixo quando tiver API real configurada
      // if (this.isProduction) {
      //   return await this.registerWithAPI(userData);
      // }

      // Por enquanto, usar método simulado
      return await this.registerSimulated(userData);
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  async resetPassword(email) {
    try {
      if (this.isProduction) {
        return await this.resetPasswordWithAPI(email);
      }
      
      // Simulação
      await apiService.simulateApiDelay(1500);
      console.log('📧 Email de recuperação enviado para:', email);
      return { success: true, message: 'Email de recuperação enviado' };
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw error;
    }
  }

  // ========== GESTÃO DE TOKEN E SESSÃO ==========
  
  setAuthToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  getAuthToken() {
    return localStorage.getItem(this.tokenKey);
  }

  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated() {
    const token = this.getAuthToken();
    const user = this.getUser();
    return !!(token && user);
  }

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('refreshToken');
    
    // Limpar outros dados relacionados ao usuário
    localStorage.removeItem('clientData');
    
    // Redirecionar para home
    window.location.href = '/';
  }

  // Verificar se token está expirado (para JWT real)
  isTokenExpired(token = null) {
    const authToken = token || this.getAuthToken();
    
    if (!authToken || authToken.startsWith('simulated_')) {
      return false; // Tokens simulados não expiram
    }
    
    try {
      // Decodificar JWT (apenas para verificação básica)
      const payload = JSON.parse(atob(authToken.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch (error) {
      return true; // Se não conseguir decodificar, considerar expirado
    }
  }

  // Middleware para verificar autenticação em rotas protegidas
  requireAuth() {
    if (!this.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }
    
    const token = this.getAuthToken();
    if (this.isTokenExpired(token)) {
      this.logout();
      throw new Error('Sessão expirada');
    }
    
    return true;
  }

  // Middleware para verificar se é admin
  requireAdmin() {
    this.requireAuth();
    
    if (!this.isAdmin()) {
      throw new Error('Acesso negado: privilégios de administrador necessários');
    }
    
    return true;
  }

  // ========== OAUTH (PREPARAÇÃO PARA FUTURO) ==========
  
  // Configurações para OAuth
  getOAuthConfig() {
    return {
      google: {
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'ADICIONAR_GOOGLE_CLIENT_ID',
        redirectUri: `${window.location.origin}/auth/google/callback`,
        scope: 'openid profile email'
      },
      facebook: {
        appId: process.env.REACT_APP_FACEBOOK_APP_ID || 'ADICIONAR_FACEBOOK_APP_ID',
        redirectUri: `${window.location.origin}/auth/facebook/callback`,
        scope: 'email,public_profile'
      }
    };
  }

  // Placeholder para login OAuth
  async loginWithOAuth(provider) {
    console.log(`OAuth login com ${provider} será implementado quando APIs estiverem configuradas`);
    // TODO: Implementar quando OAuth estiver configurado
    throw new Error('OAuth não configurado ainda');
  }
}

export default new AuthService();
