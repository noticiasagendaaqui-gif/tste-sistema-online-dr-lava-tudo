
import apiService from './apiService';
import API_CONFIG from '../config/apiConfig';

// Serviço de Email preparado para integração com API real
class EmailService {
  constructor() {
    this.config = API_CONFIG;
    this.isProduction = !API_CONFIG.isDevelopment;
  }

  // ========== MÉTODOS PARA PRODUÇÃO (API REAL) ==========
  
  async sendEmailViaAPI(emailData) {
    try {
      const url = apiService.buildUrl('email', 'send');
      const response = await apiService.post(url, emailData);
      
      // Salvar log do email enviado
      this.saveEmailLog({
        ...emailData,
        timestamp: new Date().toISOString(),
        status: 'enviado',
        response: response
      });
      
      return { success: true, data: response };
    } catch (error) {
      console.error('Erro ao enviar email via API:', error);
      
      // Em caso de erro, tentar método de fallback (simulado)
      if (this.config.isDevelopment) {
        console.log('Usando método simulado como fallback...');
        return this.sendEmailSimulated(emailData);
      }
      
      return { success: false, error: error.message };
    }
  }

  // ========== MÉTODOS SIMULADOS (DESENVOLVIMENTO) ==========
  
  async sendEmailSimulated(emailData) {
    try {
      // Simular delay de API
      await apiService.simulateApiDelay(1000);
      
      const emailLog = {
        ...emailData,
        timestamp: new Date().toISOString(),
        status: 'enviado_simulado',
        method: 'simulation'
      };

      this.saveEmailLog(emailLog);
      
      console.log(`📧 Email simulado enviado para ${emailData.to}: ${emailData.subject}`);
      return { success: true, data: emailLog };
    } catch (error) {
      console.error('Erro ao simular envio de email:', error);
      return { success: false, error: error.message };
    }
  }

  // ========== MÉTODO PRINCIPAL (ADAPTATIVO) ==========
  
  async sendEmail(to, subject, content, type = 'html') {
    const emailData = {
      from: 'admin@agendaaqui.online',
      to: to,
      subject: subject,
      content: content,
      type: type
    };

    // TODO: CONFIGURAR PARA PRODUÇÃO
    // Descomente a linha abaixo quando tiver API real configurada
    // if (this.isProduction) {
    //   return await this.sendEmailViaAPI(emailData);
    // }

    // Por enquanto, usar método simulado
    return await this.sendEmailSimulated(emailData);
  }

  // ========== CONFIGURAÇÕES PARA API REAL ==========
  
  // Configurar credenciais para API real (Titan Email via backend)
  getEmailApiConfig() {
    return {
      host: 'smtp.titan.email',
      port: 465,
      secure: true,
      auth: {
        user: process.env.REACT_APP_EMAIL_USER || 'admin@agendaaqui.online',
        pass: process.env.REACT_APP_EMAIL_PASS || 'ADICIONAR_SENHA_EMAIL'
      }
    };
  }

  // Configurar templates de email para API
  async getEmailTemplate(templateName) {
    try {
      if (this.isProduction) {
        const url = apiService.buildUrl('email', 'templates');
        return await apiService.get(`${url}/${templateName}`);
      }
      
      // Retornar template simulado para desenvolvimento
      return this.getSimulatedTemplate(templateName);
    } catch (error) {
      console.error('Erro ao buscar template:', error);
      return null;
    }
  }

  getSimulatedTemplate(templateName) {
    const templates = {
      welcome: { subject: 'Bem-vindo!', html: '<h1>Bem-vindo!</h1>' },
      booking: { subject: 'Agendamento Confirmado', html: '<h1>Confirmado!</h1>' }
    };
    return templates[templateName] || null;
  }

  // ========== MÉTODOS UTILITÁRIOS ==========
  
  saveEmailLog(emailData) {
    const logs = JSON.parse(localStorage.getItem('emailLogs') || '[]');
    logs.unshift(emailData);
    
    // Manter apenas os últimos 100 logs
    if (logs.length > 100) {
      logs.splice(100);
    }
    
    localStorage.setItem('emailLogs', JSON.stringify(logs));
  }

  getEmailLogs() {
    return JSON.parse(localStorage.getItem('emailLogs') || '[]');
  }

  // Obter estatísticas de email
  async getEmailStats() {
    try {
      if (this.isProduction) {
        const url = apiService.buildUrl('email', 'logs');
        return await apiService.get(`${url}/stats`);
      }
      
      // Retornar estatísticas simuladas
      const logs = this.getEmailLogs();
      return {
        total: logs.length,
        sent: logs.filter(log => log.status.includes('enviado')).length,
        failed: logs.filter(log => log.status === 'erro').length,
        pending: logs.filter(log => log.status === 'pendente').length
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return null;
    }
  }

  // ========== MÉTODOS DE EMAIL ESPECÍFICOS ==========
  
  // Email de boas-vindas para novos usuários
  async sendWelcomeEmail(userEmail, userName) {
    const subject = 'Bem-vindo ao AgendaAqui!';
    const content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5;">AgendaAqui</h1>
          <h2 style="color: #333;">Bem-vindo, ${userName}!</h2>
        </div>
        
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Obrigado por se cadastrar no AgendaAqui! Estamos muito felizes em tê-lo(a) conosco.
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Agora você pode agendar serviços de limpeza profissional com facilidade e acompanhar todos os seus agendamentos em um só lugar.
          </p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h3 style="color: #333;">O que você pode fazer agora:</h3>
          <ul style="color: #555; line-height: 1.8;">
            <li>Agendar seu primeiro serviço de limpeza</li>
            <li>Explorar nossos diferentes tipos de serviços</li>
            <li>Calcular preços online</li>
            <li>Acompanhar seus agendamentos no painel do cliente</li>
            <li>Participar do programa de fidelidade</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Fazer Primeiro Agendamento
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; color: #666; font-size: 14px;">
          <p>Se você tiver alguma dúvida, entre em contato conosco:</p>
          <p>📧 admin@agendaaqui.online</p>
          <p>📱 WhatsApp: (31) 99999-9999</p>
        </div>
      </div>
    `;
    
    return await this.sendEmail(userEmail, subject, content);
  }

  // Email de confirmação de agendamento
  async sendBookingConfirmation(userEmail, bookingData) {
    const subject = `Agendamento Confirmado - ${bookingData.service}`;
    const content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5;">AgendaAqui</h1>
          <h2 style="color: #10B981;">Agendamento Confirmado!</h2>
        </div>
        
        <div style="background-color: #f0fdf4; border: 2px solid #10B981; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
          <h3 style="color: #065f46; margin-top: 0;">Detalhes do Agendamento:</h3>
          <p><strong>Serviço:</strong> ${bookingData.service}</p>
          <p><strong>Data:</strong> ${new Date(bookingData.date).toLocaleDateString('pt-BR')}</p>
          <p><strong>Horário:</strong> ${bookingData.time}</p>
          <p><strong>Endereço:</strong> ${bookingData.address}</p>
          <p><strong>Valor:</strong> R$ ${bookingData.value?.toFixed(2)}</p>
        </div>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h4 style="color: #92400e; margin-top: 0;">Instruções Importantes:</h4>
          <ul style="color: #92400e; margin: 0;">
            <li>Certifique-se de que alguém esteja presente no local</li>
            <li>Deixe as áreas acessíveis para nossa equipe</li>
            <li>Em caso de cancelamento, avise com 24h de antecedência</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #666;">Acompanhe seu agendamento no painel do cliente</p>
          <a href="#" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Ver Meus Agendamentos
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; color: #666; font-size: 14px;">
          <p>Dúvidas? Entre em contato:</p>
          <p>📧 admin@agendaaqui.online | 📱 (31) 99999-9999</p>
        </div>
      </div>
    `;
    
    return await this.sendEmail(userEmail, subject, content);
  }

  // Email de lembrete de agendamento
  async sendBookingReminder(userEmail, bookingData) {
    const subject = `Lembrete: Serviço agendado para amanhã`;
    const content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5;">AgendaAqui</h1>
          <h2 style="color: #F59E0B;">Lembrete de Agendamento</h2>
        </div>
        
        <div style="background-color: #fef3c7; border-left: 4px solid #F59E0B; padding: 25px; margin-bottom: 25px;">
          <p style="color: #92400e; font-size: 18px; margin: 0;">
            <strong>Seu serviço está agendado para amanhã!</strong>
          </p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Detalhes:</h3>
          <p><strong>Serviço:</strong> ${bookingData.service}</p>
          <p><strong>Data:</strong> ${new Date(bookingData.date).toLocaleDateString('pt-BR')}</p>
          <p><strong>Horário:</strong> ${bookingData.time}</p>
          <p><strong>Endereço:</strong> ${bookingData.address}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background-color: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Ver Detalhes
          </a>
        </div>
      </div>
    `;
    
    return await this.sendEmail(userEmail, subject, content);
  }

  // Outros métodos de email...
  async sendQuote(userEmail, quoteData) {
    const subject = `Orçamento AgendaAqui - ${quoteData.service}`;
    // ... conteúdo do email ...
    return await this.sendEmail(userEmail, subject, 'conteúdo do orçamento');
  }

  async sendServiceEvaluation(userEmail, bookingData) {
    const subject = 'Como foi nosso serviço? Deixe sua avaliação';
    // ... conteúdo do email ...
    return await this.sendEmail(userEmail, subject, 'conteúdo da avaliação');
  }

  async sendStaffAssignmentToClient(clientEmail, clientName, staffName, serviceData) {
    const subject = `Prestador de Serviço Atribuído - ${serviceData.service}`;
    // ... conteúdo do email ...
    return await this.sendEmail(clientEmail, subject, 'conteúdo da atribuição');
  }

  async sendServiceAssignmentToStaff(staffEmail, staffName, serviceData) {
    const subject = `Novo Serviço Atribuído - ${serviceData.service}`;
    // ... conteúdo do email ...
    return await this.sendEmail(staffEmail, subject, 'conteúdo do novo serviço');
  }
}

export default new EmailService();
