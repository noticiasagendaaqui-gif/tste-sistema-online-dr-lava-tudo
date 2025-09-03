
import emailService from './emailService';

class StaffService {
  constructor() {
    this.storageKey = 'staffData';
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialData = {
        staff: [
          {
            id: 1,
            name: 'Felipe Silva',
            email: 'felipe@agendaaqui.online',
            phone: '(31) 99888-7777',
            specialties: ['Limpeza Residencial', 'Limpeza Comercial'],
            region: 'Zona Sul',
            coordinates: { lat: -19.9191, lng: -43.9386 },
            status: 'ativo',
            rating: 4.8,
            completedServices: 145,
            availability: true
          },
          {
            id: 2,
            name: 'Ana Costa',
            email: 'ana@agendaaqui.online',
            phone: '(31) 99777-6666',
            specialties: ['Limpeza Pós-Obra', 'Limpeza Comercial'],
            region: 'Centro',
            coordinates: { lat: -19.9245, lng: -43.9352 },
            status: 'ativo',
            rating: 4.9,
            completedServices: 89,
            availability: true
          },
          {
            id: 3,
            name: 'João Santos',
            email: 'joao@agendaaqui.online',
            phone: '(31) 99666-5555',
            specialties: ['Limpeza Residencial', 'Limpeza de Escritório'],
            region: 'Zona Norte',
            coordinates: { lat: -19.8157, lng: -43.9542 },
            status: 'ativo',
            rating: 4.7,
            completedServices: 203,
            availability: true
          }
        ],
        assignments: []
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

  // Calcular distância entre duas coordenadas usando fórmula de Haversine
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distância em km
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Geocodificar endereço para coordenadas (simulado)
  async geocodeAddress(address) {
    // Em produção, seria uma chamada para API de geocodificação (Google Maps, etc.)
    // Simulando coordenadas baseadas em bairros de Belo Horizonte
    const addressMapping = {
      'centro': { lat: -19.9245, lng: -43.9352 },
      'zona sul': { lat: -19.9191, lng: -43.9386 },
      'zona norte': { lat: -19.8157, lng: -43.9542 },
      'zona leste': { lat: -19.9208, lng: -43.8947 },
      'zona oeste': { lat: -19.9167, lng: -43.9833 },
      'savassi': { lat: -19.9325, lng: -43.9352 },
      'funcionários': { lat: -19.9312, lng: -43.9347 },
      'lourdes': { lat: -19.9281, lng: -43.9429 },
      'santo antônio': { lat: -19.9186, lng: -43.9398 }
    };

    const addressLower = address.toLowerCase();
    for (const [key, coords] of Object.entries(addressMapping)) {
      if (addressLower.includes(key)) {
        return coords;
      }
    }

    // Coordenadas padrão (centro de BH)
    return { lat: -19.9245, lng: -43.9352 };
  }

  // Encontrar o melhor funcionário para um serviço
  async findBestStaff(serviceType, address, date, time) {
    const data = this.getData();
    const serviceCoords = await this.geocodeAddress(address);
    
    // Filtrar funcionários disponíveis (incluindo prestadores aprovados)
    const availableStaff = data.staff.filter(staff => 
      staff.status === 'ativo' &&
      staff.specialties.includes(serviceType)
    );

    if (availableStaff.length === 0) {
      return null;
    }

    // Calcular pontuação para cada funcionário
    const staffScores = availableStaff.map(staff => {
      const distance = this.calculateDistance(
        serviceCoords.lat, serviceCoords.lng,
        staff.coordinates.lat, staff.coordinates.lng
      );

      // Pontuação baseada em: proximidade (peso 40%), avaliação (peso 30%), experiência (peso 30%)
      const proximityScore = Math.max(0, 10 - distance); // Quanto menor a distância, maior a pontuação
      const ratingScore = staff.rating * 2; // Avaliação de 0-5 convertida para 0-10
      const experienceScore = Math.min(10, staff.completedServices / 20); // Experiência limitada a 10

      const totalScore = (proximityScore * 0.4) + (ratingScore * 0.3) + (experienceScore * 0.3);

      return {
        ...staff,
        distance: distance.toFixed(1),
        score: totalScore,
        proximityScore,
        ratingScore,
        experienceScore
      };
    });

    // Ordenar por pontuação (maior primeiro)
    staffScores.sort((a, b) => b.score - a.score);

    return staffScores[0];
  }

  // Atribuir funcionário a um serviço
  async assignStaffToService(serviceId, serviceData) {
    const bestStaff = await this.findBestStaff(
      serviceData.service, 
      serviceData.address, 
      serviceData.date, 
      serviceData.time
    );

    if (!bestStaff) {
      throw new Error('Nenhum funcionário disponível para este serviço');
    }

    const data = this.getData();
    const assignment = {
      id: Date.now(),
      serviceId,
      staffId: bestStaff.id,
      staffName: bestStaff.name,
      staffEmail: bestStaff.email,
      staffPhone: bestStaff.phone,
      serviceData,
      assignedAt: new Date().toISOString(),
      status: 'atribuido'
    };

    data.assignments.push(assignment);
    this.saveData(data);

    // Enviar emails de notificação
    await this.sendAssignmentNotifications(assignment);

    return assignment;
  }

  // Enviar notificações por email
  async sendAssignmentNotifications(assignment) {
    const { serviceData, staffName, staffEmail } = assignment;
    
    // Email para o cliente
    if (serviceData.clientEmail) {
      await emailService.sendStaffAssignmentToClient(
        serviceData.clientEmail,
        serviceData.clientName,
        staffName,
        serviceData
      );
    }

    // Email para o funcionário
    await emailService.sendServiceAssignmentToStaff(
      staffEmail,
      staffName,
      serviceData
    );

    return true;
  }

  // Obter atribuições
  getAssignments() {
    const data = this.getData();
    return data.assignments || [];
  }

  // Obter funcionários
  getStaff() {
    const data = this.getData();
    return data.staff || [];
  }

  // Atualizar status de atribuição
  updateAssignmentStatus(assignmentId, status) {
    const data = this.getData();
    const assignmentIndex = data.assignments.findIndex(a => a.id === assignmentId);
    
    if (assignmentIndex !== -1) {
      data.assignments[assignmentIndex].status = status;
      data.assignments[assignmentIndex].updatedAt = new Date().toISOString();
      this.saveData(data);
      return data.assignments[assignmentIndex];
    }
    
    return null;
  }

  // Obter estatísticas de funcionários
  getStaffStats() {
    const data = this.getData();
    const assignments = data.assignments || [];
    
    return data.staff.map(staff => {
      const staffAssignments = assignments.filter(a => a.staffId === staff.id);
      const completedAssignments = staffAssignments.filter(a => a.status === 'concluido');
      
      return {
        ...staff,
        totalAssignments: staffAssignments.length,
        completedAssignments: completedAssignments.length,
        pendingAssignments: staffAssignments.filter(a => a.status === 'atribuido').length,
        successRate: staffAssignments.length > 0 ? (completedAssignments.length / staffAssignments.length * 100).toFixed(1) : 0
      };
    });
  }
}

export default new StaffService();
