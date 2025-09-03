import React, { useState, useEffect } from 'react';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import BookingManagement from '../components/admin/BookingManagement';
import ServiceManagement from '../components/admin/ServiceManagement';
import Reports from '../components/admin/Reports';
import Settings from '../components/admin/Settings';
import ChatManagement from '../components/admin/ChatManagement';
import ReviewsManagement from '../components/admin/ReviewsManagement';
import BlogManagement from '../components/admin/BlogManagement';
import LoyaltyManagement from '../components/admin/LoyaltyManagement';
import QuoteManagement from '../components/admin/QuoteManagement';
import EmailManagement from '../components/admin/EmailManagement'; // Importe o EmailManagement
import StaffManagement from '../components/admin/StaffManagement'; // Import StaffManagement
import ProviderApplications from '../components/admin/ProviderApplications'; // Import ProviderApplications
import TutorialSystem from '../components/admin/TutorialSystem'; // Import Tutorial System
import TutorialHelp from '../components/admin/TutorialHelp';
import PaymentGateway from '../components/admin/PaymentGateway';
import CoverageManagement from '../components/admin/CoverageManagement';
import ExpansionManagement from '../components/admin/ExpansionManagement'; // Import ExpansionManagement

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar se usuário está logado e é admin
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        // Redirecionar se não for admin
        window.location.href = '/';
        return;
      }
      setUser(parsedUser);
    } else {
      // Redirecionar se não estiver logado
      window.location.href = '/';
    }
  }, []);

  const allMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      component: <AdminDashboard />,
      roles: ['admin', 'funcionario']
    },
    {
      id: 'bookings',
      label: 'Agendamentos',
      icon: '📅',
      component: <BookingManagement />,
      roles: ['admin', 'funcionario']
    },
    {
      id: 'services',
      label: 'Serviços',
      icon: '🧹',
      component: <ServiceManagement />,
      roles: ['admin', 'funcionario']
    },
    {
      id: 'quotes',
      label: 'Orçamentos',
      icon: '💰',
      component: <QuoteManagement />,
      roles: ['admin', 'funcionario']
    },
    {
      id: 'coverage',
      label: 'Cobertura',
      icon: '🗺️',
      component: <CoverageManagement />,
      roles: ['admin', 'funcionario']
    },
    { id: 'expansion', label: 'Expansão', icon: 'trending-up' },
    {
      id: 'chat',
      label: 'Chat ao Vivo',
      icon: '💬',
      component: <ChatManagement />,
      roles: ['admin', 'funcionario']
    },
    {
      id: 'reviews',
      label: 'Avaliações',
      icon: '⭐',
      component: <ReviewsManagement />,
      roles: ['admin', 'funcionario']
    },
    {
      id: 'tutorial',
      label: 'Tutorial do Sistema',
      icon: '🎓',
      component: <TutorialSystem />,
      roles: ['admin', 'funcionario']
    },
    { 
      id: 'help', 
      label: 'Ajuda', 
      icon: '❓', 
      component: <TutorialHelp />,
      roles: ['admin', 'funcionario']
    },
    // Itens apenas para admin
    {
      id: 'users',
      label: 'Usuários',
      icon: '👥',
      component: <UserManagement />,
      roles: ['admin']
    },
    { 
      id: 'emails', 
      label: 'Gestão de Emails', 
      icon: '📧', 
      component: EmailManagement,
      roles: ['admin']
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: '📝',
      component: <BlogManagement />,
      roles: ['admin']
    },
    { 
      id: 'loyalty', 
      label: 'Programa Fidelidade', 
      icon: '🎁', 
      component: <LoyaltyManagement />,
      roles: ['admin']
    },
    { 
      id: 'provider-applications', 
      label: 'Solicitações Prestadores', 
      icon: '🙋‍♂️', 
      component: <ProviderApplications />,
      roles: ['admin']
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: '📈',
      component: <Reports />,
      roles: ['admin']
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: '⚙️',
      component: <Settings />,
      roles: ['admin']
    },
    {
      id: 'staff',
      label: 'Funcionários',
      icon: '👷',
      component: <StaffManagement />,
      roles: ['admin']
    },
    { 
      id: 'payment-gateway', 
      label: 'Gateway Pagamento', 
      icon: '💳', 
      component: PaymentGateway,
      roles: ['admin']
    }
  ];

  // Filtrar itens baseado no papel do usuário
  const menuItems = allMenuItems.filter(item => 
    item.roles.includes(user?.role || 'funcionario')
  );

  const renderComponent = (tabId) => {
    switch (tabId) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'bookings':
        return <BookingManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'quotes':
        return <QuoteManagement />;
      case 'coverage':
        return <CoverageManagement />;
      case 'expansion':
        return <ExpansionManagement />;
      case 'chat':
        return <ChatManagement />;
      case 'reviews':
        return <ReviewsManagement />;
      case 'tutorial':
        return <TutorialSystem />;
      case 'help':
        return <TutorialHelp />;
      case 'users':
        return <UserManagement />;
      case 'emails':
        return <EmailManagement />;
      case 'blog':
        return <BlogManagement />;
      case 'loyalty':
        return <LoyaltyManagement />;
      case 'provider-applications':
        return <ProviderApplications />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'staff':
        return <StaffManagement />;
      case 'payment-gateway':
        return <PaymentGateway />;
      default:
        return <AdminDashboard />;
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              Admin
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
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderComponent(activeTab)}
        </main>
      </div>
    </div>
  );
};

export default Admin;