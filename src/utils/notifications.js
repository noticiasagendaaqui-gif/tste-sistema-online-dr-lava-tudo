
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const showLocalNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      ...options
    });
  }
};

export const scheduleNotification = (title, options = {}, delay = 0) => {
  setTimeout(() => {
    showLocalNotification(title, options);
  }, delay);
};

// Notification templates for LimpaBrasil
export const notificationTemplates = {
  bookingConfirmed: (serviceName, date) => ({
    title: 'Agendamento Confirmado! ✅',
    body: `Seu serviço de ${serviceName} foi confirmado para ${date}`,
    data: { type: 'booking', action: 'confirmed' }
  }),
  
  serviceReminder: (serviceName, time) => ({
    title: 'Lembrete de Serviço 🧽',
    body: `Seu serviço de ${serviceName} está agendado para ${time}`,
    data: { type: 'reminder', action: 'service' }
  }),
  
  serviceCompleted: (serviceName) => ({
    title: 'Serviço Concluído! ✨',
    body: `Seu serviço de ${serviceName} foi finalizado. Avalie nossa equipe!`,
    data: { type: 'service', action: 'completed' }
  }),
  
  loyaltyPoints: (points) => ({
    title: 'Pontos de Fidelidade! 🎉',
    body: `Você ganhou ${points} pontos! Confira suas recompensas disponíveis`,
    data: { type: 'loyalty', action: 'earned' }
  }),
  
  paymentDue: (amount, dueDate) => ({
    title: 'Pagamento Pendente 💳',
    body: `Você tem um pagamento de R$ ${amount} com vencimento em ${dueDate}`,
    data: { type: 'payment', action: 'due' }
  })
};
