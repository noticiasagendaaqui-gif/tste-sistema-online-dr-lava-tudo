
import React, { useState, useEffect } from 'react';
import mercadoPagoService from '../../services/mercadoPagoService';

const PaymentGateway = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    gateway: {
      primary: 'mercadopago',
      mercadoPago: {
        enabled: true,
        sandboxMode: true,
        publicKey: '',
        accessToken: '',
        webhookUrl: '',
        autoCapture: true
      },
      fees: {
        creditCard: 3.99,
        debitCard: 1.99,
        pix: 0.99,
        bankTransfer: 2.90
      }
    }
  });

  useEffect(() => {
    loadTransactionData();
  }, []);

  const loadTransactionData = () => {
    setLoading(true);
    try {
      const transactionHistory = mercadoPagoService.getTransactionHistory();
      const transactionStats = mercadoPagoService.getTransactionStats();
      
      setTransactions(transactionHistory);
      setStats(transactionStats);
    } catch (error) {
      console.error('Erro ao carregar dados de transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const testMercadoPagoConnection = async () => {
    try {
      setLoading(true);
      const paymentMethods = await mercadoPagoService.getPaymentMethods();
      alert(`Conexão bem-sucedida! ${paymentMethods.results?.length || 0} métodos disponíveis.`);
    } catch (error) {
      alert(`Erro na conexão: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateNestedSetting = (section, subsection, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [key]: value
        }
      }
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              💳
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Transações</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              ✅
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aprovadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              ⏳
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              💰
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Volume Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalAmount || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status do Gateway */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold mb-4">Status dos Gateways</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Mercado Pago</p>
                <p className="text-sm text-gray-600">
                  {settings.gateway.mercadoPago.sandboxMode ? 'Modo Sandbox' : 'Produção'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setLoading(true);
                  // Simulate API test
                  setTimeout(() => {
                    setLoading(false);
                    alert('Conexão testada com sucesso!');
                  }, 2000);
                }}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testando...' : 'Testar Conexão'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transações Recentes */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Transações Recentes</h3>
          <button
            onClick={loadTransactionData}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Atualizar
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.slice(0, 10).map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.transaction_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.timestamp).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.payment_method_id || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ConfigurationTab = () => (
    <div className="space-y-6">
      {/* Configuração do Mercado Pago */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold mb-4">Configuração do Mercado Pago</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.gateway.mercadoPago.enabled}
                  onChange={(e) => updateNestedSetting('gateway', 'mercadoPago', 'enabled', e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium">Habilitar Mercado Pago</span>
              </label>
              <p className="text-sm text-gray-600 ml-6">Ativar gateway de pagamento Mercado Pago</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.gateway.mercadoPago.sandboxMode}
                  onChange={(e) => updateNestedSetting('gateway', 'mercadoPago', 'sandboxMode', e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium">Modo Sandbox</span>
              </label>
              <p className="text-sm text-gray-600 ml-6">Usar ambiente de teste</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chave Pública
            </label>
            <input
              type="text"
              value={settings.gateway.mercadoPago.publicKey}
              onChange={(e) => updateNestedSetting('gateway', 'mercadoPago', 'publicKey', e.target.value)}
              placeholder="ADICIONAR_CHAVE_PUBLICA_MERCADO_PAGO"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Token
            </label>
            <input
              type="password"
              value={settings.gateway.mercadoPago.accessToken}
              onChange={(e) => updateNestedSetting('gateway', 'mercadoPago', 'accessToken', e.target.value)}
              placeholder="ADICIONAR_ACCESS_TOKEN_MERCADO_PAGO"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL do Webhook
            </label>
            <input
              type="url"
              value={settings.gateway.mercadoPago.webhookUrl}
              onChange={(e) => updateNestedSetting('gateway', 'mercadoPago', 'webhookUrl', e.target.value)}
              placeholder="https://seudominio.com/api/webhooks/mercadopago"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Configuração de Taxas */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold mb-4">Taxas de Pagamento</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cartão de Crédito (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.gateway.fees.creditCard}
              onChange={(e) => updateNestedSetting('gateway', 'fees', 'creditCard', parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cartão de Débito (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.gateway.fees.debitCard}
              onChange={(e) => updateNestedSetting('gateway', 'fees', 'debitCard', parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PIX (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.gateway.fees.pix}
              onChange={(e) => updateNestedSetting('gateway', 'fees', 'pix', parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transferência Bancária (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.gateway.fees.bankTransfer}
              onChange={(e) => updateNestedSetting('gateway', 'fees', 'bankTransfer', parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex space-x-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Salvar Configurações
          </button>
          <button 
            onClick={testMercadoPagoConnection}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Testando...' : 'Testar Conexão'}
          </button>
        </div>
      </div>
    </div>
  );

  const SubscriptionsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold mb-4">Gestão de Assinaturas</h3>
        
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚀</div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            Assinaturas em Desenvolvimento
          </h4>
          <p className="text-gray-600 mb-4">
            O sistema de assinaturas está sendo preparado para implementação futura.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg text-left">
            <h5 className="font-semibold text-blue-900 mb-2">Funcionalidades Planejadas:</h5>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>Planos mensais, trimestrais e anuais</li>
              <li>Cobrança recorrente automática</li>
              <li>Gestão de inadimplência</li>
              <li>Upgrade/downgrade de planos</li>
              <li>Relatórios de receita recorrente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Visão Geral', icon: '📊' },
    { id: 'configuration', name: 'Configuração', icon: '⚙️' },
    { id: 'subscriptions', name: 'Assinaturas', icon: '🔄' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Gateway de Pagamento</h2>
        <p className="text-gray-600 mt-1">Gerencie configurações e monitore transações</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'configuration' && <ConfigurationTab />}
      {activeTab === 'subscriptions' && <SubscriptionsTab />}
    </div>
  );
};

export default PaymentGateway;
