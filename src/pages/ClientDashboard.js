
import React, { useState, useEffect } from 'react';
import ClientSidebar from '../components/client/ClientSidebar';
import ClientOverview from '../components/client/ClientOverview';
import ClientBookings from '../components/client/ClientBookings';
import ClientPayments from '../components/client/ClientPayments';
import ClientLoyalty from '../components/client/ClientLoyalty';
import ClientReferrals from '../components/client/ClientReferrals';
import ClientProfile from '../components/client/ClientProfile';
import BecomeProvider from '../components/client/BecomeProvider';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar se usuário está logado
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      // Redirecionar se não estiver logado
      window.location.href = '/';
    }
  }, []);

  const menuItems = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: '📊',
      component: <ClientOverview user={user} />
    },
    {
      id: 'bookings',
      label: 'Meus Serviços',
      icon: '📅',
      component: <ClientBookings user={user} />
    },
    {
      id: 'payments',
      label: 'Pagamentos',
      icon: '💳',
      component: <ClientPayments user={user} />
    },
    {
      id: 'loyalty',
      label: 'Pontos & Recompensas',
      icon: '🎁',
      component: <ClientLoyalty user={user} />
    },
    {
      id: 'referrals',
      label: 'Indicações',
      icon: '👥',
      component: <ClientReferrals user={user} />
    },
    {
      id: 'profile',
      label: 'Meu Perfil',
      icon: '👤',
      component: <ClientProfile user={user} setUser={setUser} />
    },
    {
      id: 'become-provider',
      label: 'Seja um Prestador',
      icon: '💼',
      component: <BecomeProvider user={user} />
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Minha Área</h1>
            <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              Cliente
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Olá, {user.name}</span>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/';
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <ClientSidebar 
          menuItems={menuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {menuItems.find(item => item.id === activeTab)?.component}
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
