
import React, { useState } from 'react';

const LoginOptions = ({ onUserSelect }) => {
  const [showOptions, setShowOptions] = useState(false);

  const userTypes = [
    {
      type: 'admin',
      label: 'Administrador',
      icon: '👨‍💼',
      description: 'Acesso completo ao sistema',
      credentials: {
        email: 'williamiurd.ramos@gmail.com',
        password: '153020william'
      },
      color: 'red'
    },
    {
      type: 'client',
      label: 'Cliente',
      icon: '👤',
      description: 'Portal do cliente',
      credentials: {
        email: 'cliente@teste.com',
        password: '123456'
      },
      color: 'blue'
    },
    {
      type: 'staff',
      label: 'Funcionário',
      icon: '👷',
      description: 'Painel de funcionário',
      credentials: {
        email: 'admin@limpabrasil.com',
        password: '123456'
      },
      color: 'green'
    }
  ];

  const handleQuickLogin = async (userType) => {
    const userTypeData = userTypes.find(u => u.type === userType);
    if (userTypeData) {
      try {
        // Importar e usar o authService diretamente
        const authService = await import('../services/authService');
        const result = await authService.default.login(
          userTypeData.credentials.email, 
          userTypeData.credentials.password
        );
        
        if (result.success) {
          // Redirecionar baseado no papel do usuário
          setTimeout(() => {
            if (result.user.role === 'admin') {
              window.location.href = '/admin';
            } else {
              window.location.href = '/client';
            }
          }, 100);
        }
      } catch (error) {
        console.error('Erro no login rápido:', error);
        if (onUserSelect) {
          onUserSelect(userTypeData.credentials);
        }
      }
    }
    setShowOptions(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 font-medium transition-colors"
      >
        <i data-feather="users" className="w-4 h-4"></i>
        <span>Login Demo</span>
        <i data-feather="chevron-down" className="w-4 h-4"></i>
      </button>

      {showOptions && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Escolha o tipo de usuário:
            </h3>
            <div className="space-y-2">
              {userTypes.map((user) => (
                <button
                  key={user.type}
                  onClick={() => handleQuickLogin(user.type)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 border-${user.color}-200 bg-${user.color}-50 hover:bg-${user.color}-100 transition-colors text-left`}
                >
                  <span className="text-2xl">{user.icon}</span>
                  <div className="flex-1">
                    <div className={`font-medium text-${user.color}-700`}>
                      {user.label}
                    </div>
                    <div className={`text-sm text-${user.color}-600`}>
                      {user.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Versão de demonstração - Login automático
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginOptions;
