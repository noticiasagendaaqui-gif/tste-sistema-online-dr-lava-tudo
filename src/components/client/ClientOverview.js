
import React, { useState, useEffect } from 'react';
import PWAFeatures from './PWAFeatures';

const ClientOverview = ({ user }) => {
  const [stats, setStats] = useState({
    totalServices: 8,
    totalSpent: 1250,
    loyaltyPoints: 875,
    nextService: '2024-02-15',
    pendingPayments: 0,
    completedServices: 6,
    cancelledServices: 2,
    referrals: 3
  });

  const [recentBookings, setRecentBookings] = useState([
    {
      id: 1,
      service: 'Limpeza Residencial Completa',
      date: '2024-01-20',
      status: 'concluido',
      value: 180
    },
    {
      id: 2,
      service: 'Limpeza Pós-Obra',
      date: '2024-01-15',
      status: 'concluido',
      value: 350
    },
    {
      id: 3,
      service: 'Limpeza de Escritório',
      date: '2024-02-15',
      status: 'agendado',
      value: 220
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Bem-vindo de volta, {user?.name}!</h2>
        <p className="text-primary-100">Aqui está um resumo da sua conta e atividades recentes.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">🧹</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Serviços</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Gasto</p>
              <p className="text-2xl font-bold text-gray-900">R$ {stats.totalSpent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">🎁</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pontos de Fidelidade</p>
              <p className="text-2xl font-bold text-gray-900">{stats.loyaltyPoints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-orange-600 text-xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Indicações</p>
              <p className="text-2xl font-bold text-gray-900">{stats.referrals}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2">
              <span>📅</span>
              <span>Agendar Novo Serviço</span>
            </button>
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <span>💳</span>
              <span>Ver Faturas Pendentes</span>
            </button>
            <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <span>🎁</span>
              <span>Usar Pontos de Fidelidade</span>
            </button>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Serviços Recentes</h3>
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{booking.service}</h4>
                  <p className="text-sm text-gray-600">{booking.date}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 mt-1">R$ {booking.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Meu Progresso</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>Pontos para Próxima Recompensa</span>
              <span>{stats.loyaltyPoints}/1000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${(stats.loyaltyPoints / 1000) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>Serviços para Cliente VIP</span>
              <span>{stats.completedServices}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(stats.completedServices / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* PWA Features */}
        <div className="lg:col-span-1">
          <PWAFeatures user={user} />
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;
