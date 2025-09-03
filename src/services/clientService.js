
import emailService from './emailService';
import staffService from './staffService';
import providerService from './providerService';

// Simulação de backend para dados do cliente
class ClientService {
  constructor() {
    this.storageKey = 'clientData';
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialData = {
        users: {},
        bookings: {},
        payments: {},
        loyalty: {},
        referrals: {}
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Métodos para agendamentos
  getUserBookings(userId) {
    const data = this.getData();
    return data.bookings[userId] || [];
  }

  async addBooking(userId, booking) {
    const data = this.getData();
    if (!data.bookings[userId]) {
      data.bookings[userId] = [];
    }
    
    const newBooking = {
      ...booking,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    data.bookings[userId].push(newBooking);
    this.saveData(data);
    
    // Enviar email de confirmação automaticamente
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.email) {
      try {
        await emailService.sendBookingConfirmation(userData.email, newBooking);
        
        // Tentar atribuir funcionário/prestador automaticamente
        try {
          const serviceData = {
            service: newBooking.service,
            address: newBooking.address,
            date: newBooking.date,
            time: newBooking.time,
            clientName: userData.name || 'Cliente',
            clientEmail: userData.email,
            clientPhone: userData.phone || '',
            observations: newBooking.details || '',
            value: newBooking.value
          };
          
          // Primeiro tentar encontrar prestadores próximos
          const nearbyProviders = await providerService.findNearbyProviders(
            newBooking.service, 
            newBooking.address
          );
          
          if (nearbyProviders.length > 0) {
            // Usar o melhor prestador disponível
            const bestProvider = nearbyProviders[0];
            await staffService.assignStaffToService(newBooking.id, serviceData, bestProvider);
            newBooking.status = 'confirmado';
            newBooking.assignedProvider = bestProvider;
          } else {
            // Fallback para staff tradicional
            await staffService.assignStaffToService(newBooking.id, serviceData);
            newBooking.status = 'confirmado';
          }
        } catch (staffError) {
          console.log('Nenhum prestador/funcionário disponível automaticamente, será atribuído manualmente');
        }
      } catch (error) {
        console.error('Erro ao enviar email de confirmação:', error);
      }
    }
    
    return newBooking;
  }

  updateBooking(userId, bookingId, updates) {
    const data = this.getData();
    if (data.bookings[userId]) {
      const bookingIndex = data.bookings[userId].findIndex(b => b.id === bookingId);
      if (bookingIndex !== -1) {
        data.bookings[userId][bookingIndex] = {
          ...data.bookings[userId][bookingIndex],
          ...updates
        };
        this.saveData(data);
        return data.bookings[userId][bookingIndex];
      }
    }
    return null;
  }

  // Métodos para pagamentos
  getUserPayments(userId) {
    const data = this.getData();
    return data.payments[userId] || [];
  }

  addPayment(userId, payment) {
    const data = this.getData();
    if (!data.payments[userId]) {
      data.payments[userId] = [];
    }
    data.payments[userId].push({
      ...payment,
      id: Date.now(),
      createdAt: new Date().toISOString()
    });
    this.saveData(data);
    return payment;
  }

  processPayment(userId, paymentId, method) {
    const data = this.getData();
    if (data.payments[userId]) {
      const paymentIndex = data.payments[userId].findIndex(p => p.id === paymentId);
      if (paymentIndex !== -1) {
        data.payments[userId][paymentIndex] = {
          ...data.payments[userId][paymentIndex],
          status: 'pago',
          method: method,
          paidAt: new Date().toISOString()
        };
        this.saveData(data);
        return data.payments[userId][paymentIndex];
      }
    }
    return null;
  }

  // Métodos para fidelidade
  getUserLoyalty(userId) {
    const data = this.getData();
    return data.loyalty[userId] || {
      currentPoints: 0,
      totalEarned: 0,
      totalRedeemed: 0,
      level: 'Bronze',
      history: []
    };
  }

  addLoyaltyPoints(userId, points, description, type = 'ganho') {
    const data = this.getData();
    if (!data.loyalty[userId]) {
      data.loyalty[userId] = {
        currentPoints: 0,
        totalEarned: 0,
        totalRedeemed: 0,
        level: 'Bronze',
        history: []
      };
    }

    const loyaltyData = data.loyalty[userId];
    loyaltyData.currentPoints += points;
    
    if (points > 0) {
      loyaltyData.totalEarned += points;
    } else {
      loyaltyData.totalRedeemed += Math.abs(points);
    }

    loyaltyData.history.unshift({
      id: Date.now(),
      points,
      description,
      type,
      date: new Date().toISOString().split('T')[0]
    });

    // Atualizar nível
    loyaltyData.level = this.calculateLevel(loyaltyData.totalEarned);

    this.saveData(data);
    return loyaltyData;
  }

  calculateLevel(totalEarned) {
    if (totalEarned >= 5000) return 'Platinum';
    if (totalEarned >= 2000) return 'Ouro';
    if (totalEarned >= 500) return 'Prata';
    return 'Bronze';
  }

  // Métodos para indicações
  getUserReferrals(userId) {
    const data = this.getData();
    return data.referrals[userId] || [];
  }

  addReferral(userId, referral) {
    const data = this.getData();
    if (!data.referrals[userId]) {
      data.referrals[userId] = [];
    }
    data.referrals[userId].push({
      ...referral,
      id: Date.now(),
      status: 'pendente',
      dateReferred: new Date().toISOString().split('T')[0]
    });
    this.saveData(data);
    return referral;
  }

  confirmReferral(userId, referralId, serviceHired) {
    const data = this.getData();
    if (data.referrals[userId]) {
      const referralIndex = data.referrals[userId].findIndex(r => r.id === referralId);
      if (referralIndex !== -1) {
        data.referrals[userId][referralIndex] = {
          ...data.referrals[userId][referralIndex],
          status: 'confirmado',
          serviceHired,
          pointsEarned: 200,
          dateConverted: new Date().toISOString().split('T')[0]
        };

        // Adicionar pontos de fidelidade
        this.addLoyaltyPoints(userId, 200, 'Indicação confirmada', 'bonus');

        this.saveData(data);
        return data.referrals[userId][referralIndex];
      }
    }
    return null;
  }

  // Método para estatísticas do usuário
  getUserStats(userId) {
    const bookings = this.getUserBookings(userId);
    const payments = this.getUserPayments(userId);
    const loyalty = this.getUserLoyalty(userId);
    const referrals = this.getUserReferrals(userId);

    return {
      totalServices: bookings.length,
      completedServices: bookings.filter(b => b.status === 'concluido').length,
      cancelledServices: bookings.filter(b => b.status === 'cancelado').length,
      totalSpent: payments.filter(p => p.status === 'pago').reduce((sum, p) => sum + p.value, 0),
      pendingPayments: payments.filter(p => p.status === 'pendente').length,
      loyaltyPoints: loyalty.currentPoints,
      totalReferrals: referrals.length,
      successfulReferrals: referrals.filter(r => r.status === 'confirmado').length
    };
  }

  // Método para gerar dados de exemplo
  generateSampleData(userId) {
    // Adicionar agendamentos de exemplo
    const sampleBookings = [
      {
        service: 'Limpeza Residencial Completa',
        date: '2024-02-15',
        time: '14:00',
        status: 'agendado',
        address: 'Rua das Flores, 123 - São Paulo, SP',
        professional: 'Maria Silva',
        value: 180,
        details: 'Limpeza completa de apartamento 2 quartos'
      },
      {
        service: 'Limpeza Pós-Obra',
        date: '2024-01-20',
        time: '09:00',
        status: 'concluido',
        address: 'Av. Paulista, 456 - São Paulo, SP',
        professional: 'João Santos',
        value: 350,
        details: 'Limpeza após reforma da cozinha',
        rating: 5
      }
    ];

    sampleBookings.forEach(booking => this.addBooking(userId, booking));

    // Adicionar pagamentos de exemplo
    const samplePayments = [
      {
        service: 'Limpeza Residencial Completa',
        date: '2024-01-20',
        dueDate: '2024-01-27',
        value: 180,
        status: 'pago',
        method: 'Cartão de Crédito',
        invoice: 'INV-2024-001'
      },
      {
        service: 'Limpeza de Escritório',
        date: '2024-02-15',
        dueDate: '2024-02-22',
        value: 220,
        status: 'pendente',
        invoice: 'INV-2024-002'
      }
    ];

    samplePayments.forEach(payment => this.addPayment(userId, payment));

    // Adicionar pontos de fidelidade
    this.addLoyaltyPoints(userId, 180, 'Limpeza Residencial Completa', 'ganho');
    this.addLoyaltyPoints(userId, 350, 'Limpeza Pós-Obra', 'ganho');
    this.addLoyaltyPoints(userId, 50, 'Bônus de Aniversário', 'bonus');
  }
}

export default new ClientService();
