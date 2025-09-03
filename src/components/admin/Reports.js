
import React, { useState } from 'react';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31'
  });

  const [selectedReport, setSelectedReport] = useState('overview');

  // Dados fictícios para demonstração
  const reportData = {
    overview: {
      totalRevenue: 45680,
      totalBookings: 156,
      completedServices: 142,
      cancelledBookings: 14,
      averageTicket: 293,
      customerSatisfaction: 4.8,
      growthRate: 15.2,
      returnCustomers: 68
    },
    bookings: [
      { date: '2024-01-01', count: 5, revenue: 1200 },
      { date: '2024-01-02', count: 8, revenue: 1850 },
      { date: '2024-01-03', count: 12, revenue: 2400 },
      { date: '2024-01-04', count: 6, revenue: 1680 },
      { date: '2024-01-05', count: 10, revenue: 2200 }
    ],
    services: [
      { name: 'Limpeza Residencial', bookings: 67, revenue: 18750, percentage: 43 },
      { name: 'Limpeza Pós-Obra', bookings: 28, revenue: 12320, percentage: 27 },
      { name: 'Limpeza de Escritório', bookings: 35, revenue: 9800, percentage: 22 },
      { name: 'Limpeza Industrial', bookings: 16, revenue: 4810, percentage: 8 }
    ],
    customers: [
      { name: 'Maria Silva', bookings: 8, spent: 1200, lastBooking: '2024-01-20' },
      { name: 'João Santos', bookings: 5, spent: 1600, lastBooking: '2024-01-18' },
      { name: 'Ana Costa', bookings: 6, spent: 980, lastBooking: '2024-01-19' },
      { name: 'Carlos Lima', bookings: 4, spent: 720, lastBooking: '2024-01-17' }
    ]
  };

  const generateReport = () => {
    alert('Relatório gerado! (Funcionalidade simulada)');
  };

  const exportReport = (format) => {
    alert(`Exportando relatório em formato ${format.toUpperCase()}... (Funcionalidade simulada)`);
  };

  const OverviewReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {reportData.overview.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">
            +{reportData.overview.growthRate}% vs mês anterior
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agendamentos</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.overview.totalBookings}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">📅</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {reportData.overview.completedServices} concluídos
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {reportData.overview.averageTicket}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Por agendamento
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfação</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.overview.customerSatisfaction}⭐
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <span className="text-2xl">😊</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Avaliação média
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Serviços Mais Solicitados</h3>
          <div className="space-y-4">
            {reportData.services.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{service.name}</span>
                    <span className="text-sm text-gray-600">{service.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${service.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{service.bookings} agendamentos</span>
                    <span>R$ {service.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clientes</h3>
          <div className="space-y-4">
            {reportData.customers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p className="text-sm text-gray-600">
                    {customer.bookings} agendamentos • Último: {new Date(customer.lastBooking).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ {customer.spent}</p>
                  <p className="text-sm text-gray-600">Total gasto</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const BookingsReport = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatório de Agendamentos</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agendamentos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receita</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket Médio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reportData.bookings.map((day, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(day.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {day.count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R$ {day.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R$ {Math.round(day.revenue / day.count)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const FinancialReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="font-medium text-gray-900 mb-2">Receita Bruta</h4>
          <p className="text-2xl font-bold text-green-600">R$ 45.680</p>
          <p className="text-sm text-gray-600 mt-1">+15% vs mês anterior</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="font-medium text-gray-900 mb-2">Custos Operacionais</h4>
          <p className="text-2xl font-bold text-orange-600">R$ 18.750</p>
          <p className="text-sm text-gray-600 mt-1">41% da receita</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="font-medium text-gray-900 mb-2">Lucro Líquido</h4>
          <p className="text-2xl font-bold text-blue-600">R$ 26.930</p>
          <p className="text-sm text-gray-600 mt-1">59% margem</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Breakdown de Custos</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Materiais de Limpeza</span>
            <span className="font-medium">R$ 8.500 (45%)</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Salários e Encargos</span>
            <span className="font-medium">R$ 7.200 (38%)</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Transporte</span>
            <span className="font-medium">R$ 2.050 (11%)</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Outros</span>
            <span className="font-medium">R$ 1.000 (6%)</span>
          </div>
        </div>
      </div>
    </div>
  );

  const reportTypes = [
    { id: 'overview', label: 'Visão Geral', icon: '📊' },
    { id: 'bookings', label: 'Agendamentos', icon: '📅' },
    { id: 'financial', label: 'Financeiro', icon: '💰' },
    { id: 'customers', label: 'Clientes', icon: '👥' }
  ];

  const renderReport = () => {
    switch (selectedReport) {
      case 'overview': return <OverviewReport />;
      case 'bookings': return <BookingsReport />;
      case 'financial': return <FinancialReport />;
      case 'customers': return <OverviewReport />; // Reutilizando por simplicidade
      default: return <OverviewReport />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Relatórios</h2>
          <p className="text-gray-600 mt-1">Análise detalhada do desempenho da plataforma</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => exportReport('pdf')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            📄 Exportar PDF
          </button>
          <button
            onClick={() => exportReport('excel')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            📊 Exportar Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="md:col-span-2 flex items-end">
            <button
              onClick={generateReport}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              🔄 Atualizar Relatório
            </button>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  selectedReport === type.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {renderReport()}
        </div>
      </div>
    </div>
  );
};

export default Reports;
