
class ProviderService {
  constructor() {
    this.storageKey = 'providerApplications';
    this.staffStorageKey = 'staffData';
  }

  // Submeter aplicação para se tornar prestador
  async submitApplication(applicationData) {
    const applications = this.getApplications();
    const newApplication = {
      ...applicationData,
      id: Date.now(),
      status: 'pendente_aprovacao',
      appliedAt: new Date().toISOString()
    };
    
    applications.push(newApplication);
    localStorage.setItem(this.storageKey, JSON.stringify(applications));
    return newApplication;
  }

  // Obter todas as aplicações
  getApplications() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // Obter aplicação por ID
  getApplicationById(id) {
    const applications = this.getApplications();
    return applications.find(app => app.id === id);
  }

  // Aprovar prestador
  async approveProvider(applicationId) {
    const applications = this.getApplications();
    const application = applications.find(app => app.id === applicationId);
    
    if (!application) {
      throw new Error('Aplicação não encontrada');
    }

    // Atualizar status da aplicação
    application.status = 'aprovado';
    application.approvedAt = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(applications));

    // Adicionar à lista de staff
    const staffData = JSON.parse(localStorage.getItem(this.staffStorageKey) || '{"staff": [], "assignments": []}');
    
    const newStaff = {
      id: Date.now(),
      name: application.personalInfo.fullName,
      email: application.personalInfo.email,
      phone: application.personalInfo.phone,
      specialties: application.professionalInfo.specialties,
      region: application.personalInfo.city,
      coordinates: application.coordinates,
      status: 'ativo',
      rating: 5.0,
      completedServices: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isProvider: true,
      availability: application.professionalInfo.availability,
      serviceRadius: application.professionalInfo.serviceRadius,
      ownTools: application.professionalInfo.ownTools,
      ownTransport: application.professionalInfo.ownTransport,
      expectedPrice: application.professionalInfo.expectedPrice,
      providerData: application
    };

    staffData.staff.push(newStaff);
    localStorage.setItem(this.staffStorageKey, JSON.stringify(staffData));

    return newStaff;
  }

  // Rejeitar prestador
  async rejectProvider(applicationId, reason = '') {
    const applications = this.getApplications();
    const application = applications.find(app => app.id === applicationId);
    
    if (!application) {
      throw new Error('Aplicação não encontrada');
    }

    application.status = 'rejeitado';
    application.rejectedAt = new Date().toISOString();
    application.rejectionReason = reason;
    
    localStorage.setItem(this.storageKey, JSON.stringify(applications));
    return application;
  }

  // Obter estatísticas
  getStats() {
    const applications = this.getApplications();
    return {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pendente_aprovacao').length,
      approved: applications.filter(app => app.status === 'aprovado').length,
      rejected: applications.filter(app => app.status === 'rejeitado').length
    };
  }

  // Buscar prestadores por localização e especialidade
  async findNearbyProviders(serviceType, clientAddress, maxDistance = 20) {
    const staffData = JSON.parse(localStorage.getItem(this.staffStorageKey) || '{"staff": []}');
    const clientCoords = await this.geocodeAddress(clientAddress);
    
    const availableProviders = staffData.staff.filter(staff => 
      staff.status === 'ativo' &&
      staff.isProvider === true &&
      staff.specialties.includes(serviceType)
    );

    // Calcular distâncias e filtrar por raio
    const nearbyProviders = availableProviders.map(provider => {
      const distance = this.calculateDistance(
        clientCoords.lat, clientCoords.lng,
        provider.coordinates.lat, provider.coordinates.lng
      );

      return {
        ...provider,
        distance: distance.toFixed(1)
      };
    }).filter(provider => 
      parseFloat(provider.distance) <= maxDistance &&
      parseFloat(provider.distance) <= provider.serviceRadius
    );

    // Ordenar por proximidade, rating e experiência
    nearbyProviders.sort((a, b) => {
      const aScore = (10 - parseFloat(a.distance)) * 0.4 + a.rating * 0.3 + (a.completedServices / 50) * 0.3;
      const bScore = (10 - parseFloat(b.distance)) * 0.4 + b.rating * 0.3 + (b.completedServices / 50) * 0.3;
      return bScore - aScore;
    });

    return nearbyProviders;
  }

  // Calcular distância entre duas coordenadas
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Geocodificar endereço
  async geocodeAddress(address) {
    const addressMapping = {
      'centro': { lat: -19.9245, lng: -43.9352 },
      'savassi': { lat: -19.9386, lng: -43.9276 },
      'funcionarios': { lat: -19.9311, lng: -43.9378 },
      'zona sul': { lat: -19.9191, lng: -43.9386 },
      'zona norte': { lat: -19.8157, lng: -43.9542 },
      'zona leste': { lat: -19.8968, lng: -43.8821 },
      'zona oeste': { lat: -19.9397, lng: -44.0012 },
      'belo horizonte': { lat: -19.9245, lng: -43.9352 }
    };

    const addressLower = address.toLowerCase();
    for (const [key, coords] of Object.entries(addressMapping)) {
      if (addressLower.includes(key)) {
        return coords;
      }
    }

    return { lat: -19.9245, lng: -43.9352 };
  }
}

export default new ProviderService();
