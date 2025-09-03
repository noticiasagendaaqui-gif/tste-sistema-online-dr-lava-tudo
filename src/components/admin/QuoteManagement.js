
import React, { useState } from 'react';

const QuoteManagement = () => {
  const [quotes, setQuotes] = useState([
    {
      id: 1,
      clientName: 'Maria Silva',
      clientEmail: 'maria@email.com',
      clientPhone: '(11) 99999-9999',
      service: 'Limpeza Residencial',
      description: 'Casa de 150m² com 3 quartos',
      status: 'pendente',
      value: 0,
      validUntil: '2024-02-20',
      createdAt: '2024-01-20',
      sentAt: null,
      acceptedAt: null
    },
    {
      id: 2,
      clientName: 'João Santos',
      clientEmail: 'joao@email.com',
      clientPhone: '(11) 88888-8888',
      service: 'Limpeza Pós-Obra',
      description: 'Apartamento novo de 80m²',
      status: 'enviado',
      value: 450.00,
      validUntil: '2024-02-25',
      createdAt: '2024-01-18',
      sentAt: '2024-01-19',
      acceptedAt: null
    },
    {
      id: 3,
      clientName: 'Ana Costa',
      clientEmail: 'ana@email.com',
      clientPhone: '(11) 77777-7777',
      service: 'Limpeza de Escritório',
      description: 'Escritório comercial 200m²',
      status: 'aceito',
      value: 800.00,
      validUntil: '2024-02-15',
      createdAt: '2024-01-15',
      sentAt: '2024-01-16',
      acceptedAt: '2024-01-18'
    }
  ]);

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const [newQuote, setNewQuote] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    service: '',
    description: '',
    value: '',
    validUntil: ''
  });

  const services = [
    'Limpeza Residencial',
    'Limpeza Comercial',
    'Limpeza Pós-Obra',
    'Limpeza de Escritório',
    'Limpeza de Condomínio',
    'Limpeza Hospitalar'
  ];

  const filteredQuotes = quotes.filter(quote => {
    const matchesStatus = filterStatus === 'todos' || quote.status === filterStatus;
    const matchesSearch = quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleAddQuote = () => {
    const quote = {
      id: quotes.length + 1,
      ...newQuote,
      value: parseFloat(newQuote.value) || 0,
      status: 'pendente',
      createdAt: new Date().toISOString().split('T')[0],
      sentAt: null,
      acceptedAt: null
    };
    
    setQuotes([...quotes, quote]);
    setNewQuote({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      service: '',
      description: '',
      value: '',
      validUntil: ''
    });
    setShowQuoteModal(false);
  };

  const handleUpdateQuote = () => {
    setQuotes(quotes.map(quote => 
      quote.id === editingQuote.id ? editingQuote : quote
    ));
    setEditingQuote(null);
  };

  const sendQuote = (quoteId) => {
    setQuotes(quotes.map(quote => 
      quote.id === quoteId 
        ? { ...quote, status: 'enviado', sentAt: new Date().toISOString().split('T')[0] }
        : quote
    ));
    
    // Simular envio de email
    alert('Orçamento enviado por email com sucesso!');
  };

  const deleteQuote = (quoteId) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      setQuotes(quotes.filter(quote => quote.id !== quoteId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'enviado': return 'bg-blue-100 text-blue-800';
      case 'aceito': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      case 'expirado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateQuoteEmail = (quote) => {
    return `
Prezado(a) ${quote.clientName},

Segue orçamento solicitado:

SERVIÇO: ${quote.service}
DESCRIÇÃO: ${quote.description}
VALOR: R$ ${quote.value.toFixed(2).replace('.', ',')}
VALIDADE: ${new Date(quote.validUntil).toLocaleDateString('pt-BR')}

Para aceitar este orçamento, entre em contato conosco.

Atenciosamente,
Equipe LimpaBrasil
    `.trim();
  };

  const QuoteModal = ({ quote, onSave, onClose, isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {isEdit ? 'Editar Orçamento' : 'Novo Orçamento'}
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
              <input
                type="text"
                value={quote.clientName}
                onChange={(e) => isEdit 
                  ? setEditingQuote({...quote, clientName: e.target.value})
                  : setNewQuote({...quote, clientName: e.target.value})
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={quote.clientEmail}
                onChange={(e) => isEdit 
                  ? setEditingQuote({...quote, clientEmail: e.target.value})
                  : setNewQuote({...quote, clientEmail: e.target.value})
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="tel"
                value={quote.clientPhone}
                onChange={(e) => isEdit 
                  ? setEditingQuote({...quote, clientPhone: e.target.value})
                  : setNewQuote({...quote, clientPhone: e.target.value})
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
              <select
                value={quote.service}
                onChange={(e) => isEdit 
                  ? setEditingQuote({...quote, service: e.target.value})
                  : setNewQuote({...quote, service: e.target.value})
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Selecione...</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Serviço</label>
            <textarea
              value={quote.description}
              onChange={(e) => isEdit 
                ? setEditingQuote({...quote, description: e.target.value})
                : setNewQuote({...quote, description: e.target.value})
              }
              className="w-full border rounded-lg px-3 py-2"
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                value={quote.value}
                onChange={(e) => isEdit 
                  ? setEditingQuote({...quote, value: e.target.value})
                  : setNewQuote({...quote, value: e.target.value})
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Válido até</label>
              <input
                type="date"
                value={quote.validUntil}
                onChange={(e) => isEdit 
                  ? setEditingQuote({...quote, validUntil: e.target.value})
                  : setNewQuote({...quote, validUntil: e.target.value})
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prévia do Email</label>
              <textarea
                value={generateQuoteEmail(quote)}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                rows="8"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {isEdit ? 'Atualizar' : 'Criar'} Orçamento
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Orçamentos</h2>
          <p className="text-gray-600 mt-1">Gerencie orçamentos e propostas para clientes</p>
        </div>
        <button
          onClick={() => setShowQuoteModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          Novo Orçamento
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{quotes.filter(q => q.status === 'pendente').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📤</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enviados</p>
              <p className="text-2xl font-bold text-gray-900">{quotes.filter(q => q.status === 'enviado').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aceitos</p>
              <p className="text-2xl font-bold text-gray-900">{quotes.filter(q => q.status === 'aceito').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {quotes.filter(q => q.status === 'aceito').reduce((acc, q) => acc + q.value, 0).toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Buscar por cliente, email ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="todos">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="enviado">Enviado</option>
            <option value="aceito">Aceito</option>
            <option value="rejeitado">Rejeitado</option>
            <option value="expirado">Expirado</option>
          </select>
        </div>
      </div>

      {/* Lista de Orçamentos */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{quote.clientName}</div>
                      <div className="text-sm text-gray-500">{quote.clientEmail}</div>
                      <div className="text-sm text-gray-500">{quote.clientPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{quote.service}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{quote.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    R$ {quote.value.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(quote.validUntil).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingQuote(quote)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Editar
                      </button>
                      {quote.status === 'pendente' && (
                        <button
                          onClick={() => sendQuote(quote.id)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Enviar
                        </button>
                      )}
                      <button
                        onClick={() => deleteQuote(quote.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredQuotes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum orçamento encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showQuoteModal && (
        <QuoteModal
          quote={newQuote}
          onSave={handleAddQuote}
          onClose={() => {
            setShowQuoteModal(false);
            setNewQuote({
              clientName: '',
              clientEmail: '',
              clientPhone: '',
              service: '',
              description: '',
              value: '',
              validUntil: ''
            });
          }}
        />
      )}

      {editingQuote && (
        <QuoteModal
          quote={editingQuote}
          isEdit={true}
          onSave={handleUpdateQuote}
          onClose={() => setEditingQuote(null)}
        />
      )}
    </div>
  );
};

export default QuoteManagement;
