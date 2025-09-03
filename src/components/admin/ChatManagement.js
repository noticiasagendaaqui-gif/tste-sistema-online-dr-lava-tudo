
import React, { useState } from 'react';

const ChatManagement = () => {
  const [activeChats, setActiveChats] = useState([
    {
      id: 1,
      user: 'Maria Silva',
      email: 'maria@email.com',
      status: 'ativo',
      startTime: '2024-01-20 14:30',
      messages: 15,
      lastMessage: 'Preciso de um orçamento para limpeza'
    },
    {
      id: 2,
      user: 'João Santos',
      email: 'joao@email.com',
      status: 'pendente',
      startTime: '2024-01-20 15:15',
      messages: 8,
      lastMessage: 'Quando vocês podem atender?'
    }
  ]);

  const [chatSettings, setChatSettings] = useState({
    autoResponse: true,
    workingHours: { start: '08:00', end: '18:00' },
    maxConcurrentChats: 5,
    responseTemplates: [
      'Olá! Como posso ajudar você hoje?',
      'Obrigado por entrar em contato conosco!',
      'Um momento, vou verificar isso para você.',
      'Você gostaria de agendar uma visita?'
    ]
  });

  const [newTemplate, setNewTemplate] = useState('');

  const handleStatusChange = (chatId, newStatus) => {
    setActiveChats(chats =>
      chats.map(chat =>
        chat.id === chatId ? { ...chat, status: newStatus } : chat
      )
    );
  };

  const addTemplate = () => {
    if (newTemplate.trim()) {
      setChatSettings(prev => ({
        ...prev,
        responseTemplates: [...prev.responseTemplates, newTemplate.trim()]
      }));
      setNewTemplate('');
    }
  };

  const removeTemplate = (index) => {
    setChatSettings(prev => ({
      ...prev,
      responseTemplates: prev.responseTemplates.filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'finalizado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Chat ao Vivo</h2>
        <p className="text-gray-600 mt-1">Gerencie conversas e configurações do chat</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">💬</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chats Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{activeChats.filter(c => c.status === 'ativo').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{activeChats.filter(c => c.status === 'pendente').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hoje</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Satisfação</p>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chats Ativos */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Conversas Ativas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Início</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mensagens</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Mensagem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeChats.map((chat) => (
                <tr key={chat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{chat.user}</div>
                      <div className="text-sm text-gray-500">{chat.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(chat.status)}`}>
                      {chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {chat.startTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {chat.messages}
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                    {chat.lastMessage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Responder
                      </button>
                      <select
                        value={chat.status}
                        onChange={(e) => handleStatusChange(chat.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="ativo">Ativo</option>
                        <option value="pendente">Pendente</option>
                        <option value="finalizado">Finalizado</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Configurações do Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-medium text-gray-700">Resposta Automática</label>
              <input
                type="checkbox"
                checked={chatSettings.autoResponse}
                onChange={(e) => setChatSettings(prev => ({ ...prev, autoResponse: e.target.checked }))}
                className="rounded"
              />
            </div>
            
            <div>
              <label className="block font-medium text-gray-700 mb-2">Horário de Funcionamento</label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  value={chatSettings.workingHours.start}
                  onChange={(e) => setChatSettings(prev => ({
                    ...prev,
                    workingHours: { ...prev.workingHours, start: e.target.value }
                  }))}
                  className="flex-1 border rounded-lg px-3 py-2"
                />
                <span className="flex items-center">até</span>
                <input
                  type="time"
                  value={chatSettings.workingHours.end}
                  onChange={(e) => setChatSettings(prev => ({
                    ...prev,
                    workingHours: { ...prev.workingHours, end: e.target.value }
                  }))}
                  className="flex-1 border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Máx. Chats Simultâneos</label>
              <input
                type="number"
                value={chatSettings.maxConcurrentChats}
                onChange={(e) => setChatSettings(prev => ({ ...prev, maxConcurrentChats: parseInt(e.target.value) }))}
                className="w-full border rounded-lg px-3 py-2"
                min="1"
                max="20"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates de Resposta</h3>
          <div className="space-y-3">
            {chatSettings.responseTemplates.map((template, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{template}</span>
                <button
                  onClick={() => removeTemplate(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remover
                </button>
              </div>
            ))}
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTemplate}
                onChange={(e) => setNewTemplate(e.target.value)}
                placeholder="Novo template..."
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button
                onClick={addTemplate}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatManagement;
