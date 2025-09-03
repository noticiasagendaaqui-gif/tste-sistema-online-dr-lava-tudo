
import React, { useState } from 'react';

const ClientPayments = ({ user }) => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      service: 'Limpeza Residencial Completa',
      date: '2024-01-20',
      dueDate: '2024-01-27',
      value: 180,
      status: 'pago',
      method: 'Cartão de Crédito',
      invoice: 'INV-2024-001'
    },
    {
      id: 2,
      service: 'Limpeza Pós-Obra',
      date: '2024-01-15',
      dueDate: '2024-01-22',
      value: 350,
      status: 'pago',
      method: 'PIX',
      invoice: 'INV-2024-002'
    },
    {
      id: 3,
      service: 'Limpeza de Escritório',
      date: '2024-02-15',
      dueDate: '2024-02-22',
      value: 220,
      status: 'pendente',
      method: null,
      invoice: 'INV-2024-003'
    },
    {
      id: 4,
      service: 'Limpeza Residencial',
      date: '2024-02-10',
      dueDate: '2024-02-17',
      value: 150,
      status: 'vencido',
      method: null,
      invoice: 'INV-2024-004'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('todos');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  const filteredPayments = payments.filter(payment => 
    filterStatus === 'todos' || payment.status === filterStatus
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pago': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'vencido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalByStatus = (status) => {
    return payments
      .filter(payment => payment.status === status)
      .reduce((total, payment) => total + payment.value, 0);
  };

  const handlePayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    setPayments(payments.map(payment => 
      payment.id === selectedPayment.id 
        ? { ...payment, status: 'pago', method: paymentMethod }
        : payment
    ));
    setShowPaymentModal(false);
    setSelectedPayment(null);
    setPaymentMethod('');
  };

  const downloadInvoice = (invoice) => {
    // Simular download de fatura
    alert(`Download da fatura ${invoice} iniciado!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Pagamentos</h2>
          <p className="text-gray-600 mt-1">Gerencie suas faturas e histórico de pagamentos</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pago</p>
              <p className="text-2xl font-bold text-green-600">R$ {getTotalByStatus('pago')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendente</p>
              <p className="text-2xl font-bold text-yellow-600">R$ {getTotalByStatus('pendente')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-red-600 text-xl">🚨</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vencido</p>
              <p className="text-2xl font-bold text-red-600">R$ {getTotalByStatus('vencido')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Geral</p>
              <p className="text-2xl font-bold text-blue-600">
                R$ {payments.reduce((total, payment) => total + payment.value, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="todos">Todos os Status</option>
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fatura</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{payment.invoice}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.service}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.dueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">R$ {payment.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.method || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {payment.status !== 'pago' && (
                        <button
                          onClick={() => handlePayment(payment)}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Pagar
                        </button>
                      )}
                      <button
                        onClick={() => downloadInvoice(payment.invoice)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum pagamento encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Realizar Pagamento</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Fatura: {selectedPayment?.invoice}</p>
              <p className="text-sm text-gray-600 mb-2">Serviço: {selectedPayment?.service}</p>
              <p className="text-lg font-semibold text-gray-900">Valor: R$ {selectedPayment?.value}</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Selecione o método</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="PIX">PIX</option>
                <option value="Boleto">Boleto Bancário</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={processPayment}
                disabled={!paymentMethod}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirmar Pagamento
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPayment(null);
                  setPaymentMethod('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPayments;
