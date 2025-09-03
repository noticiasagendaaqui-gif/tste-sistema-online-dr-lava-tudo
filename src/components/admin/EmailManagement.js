
import React, { useState, useEffect } from 'react';
import emailService from '../../services/emailService';

const EmailManagement = () => {
  const [emailLogs, setEmailLogs] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState({
    welcome: {
      subject: 'Bem-vindo ao AgendaAqui!',
      active: true
    },
    booking_confirmation: {
      subject: 'Agendamento Confirmado',
      active: true
    },
    booking_reminder: {
      subject: 'Lembrete de Agendamento',
      active: true
    },
    quote: {
      subject: 'Seu Orçamento AgendaAqui',
      active: true
    },
    evaluation: {
      subject: 'Avalie nosso serviço',
      active: true
    }
  });
  const [emailSettings, setEmailSettings] = useState({
    serverConfig: {
      host: 'smtp.titan.email',
      port: 465,
      secure: true,
      user: 'admin@agendaaqui.online'
    },
    autoSend: {
      welcome: true,
      bookingConfirmation: true,
      bookingReminder: true,
      evaluation: true
    }
  });

  const [selectedTab, setSelectedTab] = useState('logs');
  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    loadEmailLogs();
  }, []);

  const loadEmailLogs = () => {
    const logs = emailService.getEmailLogs();
    setEmailLogs(logs);
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      alert('Digite um email para teste');
      return;
    }

    try {
      await emailService.sendWelcomeEmail(testEmail, 'Usuário Teste');
      alert('Email de teste enviado com sucesso!');
      loadEmailLogs();
    } catch (error) {
      alert('Erro ao enviar email de teste');
    }
  };

  const toggleTemplate = (template) => {
    setEmailTemplates(prev => ({
      ...prev,
      [template]: {
        ...prev[template],
        active: !prev[template].active
      }
    }));
  };

  const toggleAutoSend = (type) => {
    setEmailSettings(prev => ({
      ...prev,
      autoSend: {
        ...prev.autoSend,
        [type]: !prev.autoSend[type]
      }
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'enviado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'erro': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const tabs = [
    { id: 'logs', label: 'Logs de Email', icon: '📧' },
    { id: 'templates', label: 'Templates', icon: '📝' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' },
    { id: 'test', label: 'Teste', icon: '🧪' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Emails</h2>
        <p className="text-gray-600 mt-1">Configure e monitore o envio de emails automáticos</p>
      </div>

      {/* Configuração do Servidor */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Configuração do Servidor Email</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Servidor:</span>
            <p className="text-blue-600">{emailSettings.serverConfig.host}</p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Porta:</span>
            <p className="text-blue-600">{emailSettings.serverConfig.port}</p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Email:</span>
            <p className="text-blue-600">{emailSettings.serverConfig.user}</p>
          </div>
          <div>
            <span className="font-medium text-blue-800">SSL:</span>
            <p className="text-blue-600">{emailSettings.serverConfig.secure ? 'Ativado' : 'Desativado'}</p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emails Enviados</p>
              <p className="text-2xl font-bold text-gray-900">{emailLogs.filter(log => log.status === 'enviado').length}</p>
            </div>
            <div className="text-green-600">
              <i data-feather="mail" className="w-8 h-8"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emails Hoje</p>
              <p className="text-2xl font-bold text-gray-900">
                {emailLogs.filter(log => 
                  new Date(log.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <div className="text-blue-600">
              <i data-feather="calendar" className="w-8 h-8"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Templates Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(emailTemplates).filter(t => t.active).length}
              </p>
            </div>
            <div className="text-purple-600">
              <i data-feather="file-text" className="w-8 h-8"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-gray-900">
                {emailLogs.length > 0 ? 
                  Math.round((emailLogs.filter(log => log.status === 'enviado').length / emailLogs.length) * 100) 
                  : 0}%
              </p>
            </div>
            <div className="text-green-600">
              <i data-feather="trending-up" className="w-8 h-8"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'logs' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Histórico de Emails</h3>
                <button
                  onClick={loadEmailLogs}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Atualizar
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Para</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assunto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {emailLogs.map((log, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{log.to}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{log.subject}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(log.timestamp)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {emailLogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum email enviado ainda
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'templates' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates de Email</h3>
              <div className="space-y-4">
                {Object.entries(emailTemplates).map(([key, template]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{template.subject}</h4>
                      <p className="text-sm text-gray-600">Template: {key.replace('_', ' ')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={template.active}
                        onChange={() => toggleTemplate(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Envio Automático</h3>
              <div className="space-y-4">
                {Object.entries(emailSettings.autoSend).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {key === 'welcome' && 'Email de Boas-vindas'}
                        {key === 'bookingConfirmation' && 'Confirmação de Agendamento'}
                        {key === 'bookingReminder' && 'Lembrete de Agendamento'}
                        {key === 'evaluation' && 'Solicitação de Avaliação'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {value ? 'Enviado automaticamente' : 'Envio manual apenas'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => toggleAutoSend(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'test' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Teste de Email</h3>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email para teste
                </label>
                <div className="flex space-x-3">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendTestEmail}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                  >
                    Enviar
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Enviará um email de boas-vindas de teste para o endereço especificado
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailManagement;
