import React, { useState, useEffect } from 'react';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        showNotification('Notificações ativadas!', 'Agora você receberá atualizações sobre seus agendamentos.');
      }
    }
  };

  const showNotification = (title, body, icon = '/favicon.ico') => {
    if (permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon,
        badge: '/favicon.ico',
        tag: 'limpabrasil',
        requireInteraction: false,
        silent: false,
        vibrate: [200, 100, 200],
        actions: [
          {
            action: 'view',
            title: 'Visualizar'
          },
          {
            action: 'dismiss',
            title: 'Dispensar'
          }
        ]
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  };

  const addLocalNotification = (title, message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 10));
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return 'check-circle';
      case 'warning': return 'alert-triangle';
      case 'error': return 'x-circle';
      default: return 'bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  // Simulate notifications for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        { title: 'Agendamento Confirmado', message: 'Seu serviço foi confirmado para amanhã às 14h', type: 'success' },
        { title: 'Lembrete', message: 'Serviço de limpeza agendado para hoje às 16h', type: 'info' },
        { title: 'Promoção', message: 'Desconto especial de 20% em limpeza pós-obra!', type: 'warning' },
        { title: 'Avaliação', message: 'Como foi nosso serviço? Deixe sua avaliação!', type: 'info' }
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      if (Math.random() > 0.7) { // 30% chance every interval
        addLocalNotification(randomMessage.title, randomMessage.message, randomMessage.type);

        if (permission === 'granted') {
          showNotification(randomMessage.title, randomMessage.message);
        }
      }
    }, 30000); // Every 30 seconds for demo

    return () => clearInterval(interval);
  }, [permission]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed top-20 right-4 z-40">
      {/* Notification Button */}
      <div className="relative">
        <button
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-3 shadow-lg transition-colors"
          onClick={() => {
            const panel = document.getElementById('notification-panel');
            panel.classList.toggle('hidden');
          }}
        >
          <i data-feather="bell" className="w-6 h-6 text-gray-600"></i>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        <div
          id="notification-panel"
          className="hidden absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notificações</h3>
              {permission !== 'granted' && (
                <button
                  onClick={requestPermission}
                  className="text-xs bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded transition-colors"
                >
                  Ativar
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="space-y-1">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`rounded-full p-2 ${getNotificationColor(notification.type)}`}>
                        <i data-feather={getNotificationIcon(notification.type)} className="w-4 h-4"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <i data-feather="x" className="w-4 h-4"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <i data-feather="bell-off" className="w-12 h-12 text-gray-300 mx-auto mb-3"></i>
                <p className="text-gray-500">Nenhuma notificação</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setNotifications([])}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-800"
              >
                Limpar todas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export functions for external use
export const useNotifications = () => {
  const showSuccess = (title, message) => {
    window.dispatchEvent(new CustomEvent('show-notification', {
      detail: { title, message, type: 'success' }
    }));
  };

  const showError = (title, message) => {
    window.dispatchEvent(new CustomEvent('show-notification', {
      detail: { title, message, type: 'error' }
    }));
  };

  const showWarning = (title, message) => {
    window.dispatchEvent(new CustomEvent('show-notification', {
      detail: { title, message, type: 'warning' }
    }));
  };

  const showInfo = (title, message) => {
    window.dispatchEvent(new CustomEvent('show-notification', {
      detail: { title, message, type: 'info' }
    }));
  };

  return { showSuccess, showError, showWarning, showInfo };
};

export default NotificationSystem;