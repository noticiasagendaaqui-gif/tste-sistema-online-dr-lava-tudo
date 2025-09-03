
import React, { useState, useEffect } from 'react';
import usePWA from '../../hooks/usePWA';
import { requestNotificationPermission, notificationTemplates } from '../../utils/notifications';

const PWAFeatures = ({ user }) => {
  const { isOnline, isInstalled } = usePWA();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    setNotificationsEnabled(Notification.permission === 'granted');
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    
    if (granted) {
      // Send welcome notification
      const welcomeNotification = notificationTemplates.loyaltyPoints(50);
      setTimeout(() => {
        new Notification(welcomeNotification.title, {
          body: welcomeNotification.body,
          icon: '/icons/icon-192x192.png'
        });
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
        <i data-feather="smartphone" className="w-5 h-5 mr-2 text-primary-600"></i>
        Recursos do App
      </h3>

      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
          <div className="flex items-center">
            <i 
              data-feather={isOnline ? "wifi" : "wifi-off"} 
              className={`w-5 h-5 mr-3 ${isOnline ? 'text-green-600' : 'text-red-600'}`}
            ></i>
            <div>
              <p className="font-medium text-secondary-900">Conexão</p>
              <p className="text-sm text-secondary-600">
                {isOnline ? 'Conectado' : 'Offline'}
              </p>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>

        {/* Installation Status */}
        <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
          <div className="flex items-center">
            <i data-feather="download" className="w-5 h-5 mr-3 text-primary-600"></i>
            <div>
              <p className="font-medium text-secondary-900">Instalação</p>
              <p className="text-sm text-secondary-600">
                {isInstalled ? 'App instalado' : 'Use pelo navegador'}
              </p>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${isInstalled ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
          <div className="flex items-center">
            <i data-feather="bell" className="w-5 h-5 mr-3 text-primary-600"></i>
            <div>
              <p className="font-medium text-secondary-900">Notificações</p>
              <p className="text-sm text-secondary-600">
                {notificationsEnabled ? 'Ativadas' : 'Desativadas'}
              </p>
            </div>
          </div>
          {!notificationsEnabled && (
            <button
              onClick={handleEnableNotifications}
              className="bg-primary-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-primary-700 transition-colors"
            >
              Ativar
            </button>
          )}
        </div>

        {/* PWA Benefits */}
        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <h4 className="font-medium text-primary-900 mb-2">
            💡 Benefícios do App
          </h4>
          <ul className="text-sm text-primary-800 space-y-1">
            <li>• Acesso rápido pela tela inicial</li>
            <li>• Funciona offline (consulta de dados)</li>
            <li>• Notificações de agendamentos</li>
            <li>• Interface otimizada para mobile</li>
            <li>• Atualização automática</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PWAFeatures;
