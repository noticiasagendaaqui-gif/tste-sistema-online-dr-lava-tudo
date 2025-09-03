
class CoverageService {
  constructor() {
    this.coverageAreas = this.loadCoverageAreas();
  }

  loadCoverageAreas() {
    const stored = localStorage.getItem('coverageAreas');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Cidades do Vetor Norte de BH (área inicial de cobertura)
    return [
      {
        id: 1,
        name: 'Belo Horizonte',
        type: 'city',
        status: 'active',
        region: 'Vetor Norte',
        coordinates: { lat: -19.9191, lng: -43.9386 },
        radius: 20, // km
        neighborhoods: ['Venda Nova', 'Norte', 'Pampulha'],
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Ribeirão das Neves',
        type: 'city',
        status: 'active',
        region: 'Vetor Norte',
        coordinates: { lat: -19.7667, lng: -44.0833 },
        radius: 15,
        neighborhoods: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Vespasiano',
        type: 'city',
        status: 'active',
        region: 'Vetor Norte',
        coordinates: { lat: -19.6919, lng: -43.9231 },
        radius: 10,
        neighborhoods: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Pedro Leopoldo',
        type: 'city',
        status: 'active',
        region: 'Vetor Norte',
        coordinates: { lat: -19.6178, lng: -44.0428 },
        radius: 12,
        neighborhoods: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        name: 'Lagoa Santa',
        type: 'city',
        status: 'active',
        region: 'Vetor Norte',
        coordinates: { lat: -19.6269, lng: -43.8897 },
        radius: 15,
        neighborhoods: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 6,
        name: 'Confins',
        type: 'city',
        status: 'active',
        region: 'Vetor Norte',
        coordinates: { lat: -19.6333, lng: -43.9667 },
        radius: 8,
        neighborhoods: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 7,
        name: 'Funilândia',
        type: 'city',
        status: 'active',
        region: 'Vetor Norte',
        coordinates: { lat: -19.2944, lng: -44.0756 },
        radius: 10,
        neighborhoods: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 8,
        name: 'Matozinhos',
        type: 'city',
        status: 'active',
        region: 'Vetor Norte',
        coordinates: { lat: -19.5589, lng: -44.0822 },
        radius: 12,
        neighborhoods: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 9,
        name: 'Prudente de Morais',
        type: 'city',
        status: 'active',
        region: 'Vetor Norte',
        coordinates: { lat: -19.4717, lng: -44.1589 },
        radius: 8,
        neighborhoods: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 10,
        name: 'Capim Branco',
        type: 'city',
        status: 'active',
        region: 'Vetor Norte',
        coordinates: { lat: -19.5389, lng: -44.0889 },
        radius: 10,
        neighborhoods: [],
        createdAt: new Date().toISOString()
      }
    ];
  }

  saveCoverageAreas() {
    localStorage.setItem('coverageAreas', JSON.stringify(this.coverageAreas));
  }

  // Calcular distância entre dois pontos usando fórmula de Haversine
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Verificar se uma localização está na área de cobertura
  checkCoverage(lat, lng, address = '') {
    const activeCities = this.coverageAreas.filter(area => area.status === 'active');
    
    for (const city of activeCities) {
      const distance = this.calculateDistance(lat, lng, city.coordinates.lat, city.coordinates.lng);
      if (distance <= city.radius) {
        return {
          covered: true,
          city: city.name,
          region: city.region,
          distance: Math.round(distance * 10) / 10
        };
      }
    }

    // Verificar se é uma cidade conhecida não coberta
    const knownCities = [
      'Contagem', 'Betim', 'Nova Lima', 'Sabará', 'Santa Luzia', 
      'Ibirité', 'São José da Lapa', 'Esmeraldas', 'Florestal',
      'Jaboticatubas', 'Taquaraçu de Minas', 'Santana de Pirapama'
    ];

    const cityMentioned = knownCities.find(city => 
      address.toLowerCase().includes(city.toLowerCase())
    );

    return {
      covered: false,
      suggestedCity: cityMentioned || null,
      message: cityMentioned 
        ? `${cityMentioned} ainda não está em nossa área de cobertura` 
        : 'Esta localização ainda não está em nossa área de cobertura'
    };
  }

  // Verificar cobertura por CEP (simulação)
  checkCoverageByZip(cep) {
    // CEPs do Vetor Norte (simulação - em produção usaria API dos Correios)
    const vetorNorteCeps = [
      // Belo Horizonte - Região Norte/Venda Nova/Pampulha
      { start: '31000', end: '31999', city: 'Belo Horizonte' },
      { start: '30000', end: '32999', city: 'Belo Horizonte' },
      // Ribeirão das Neves
      { start: '33800', end: '33899', city: 'Ribeirão das Neves' },
      // Vespasiano
      { start: '33200', end: '33299', city: 'Vespasiano' },
      // Pedro Leopoldo
      { start: '33600', end: '33699', city: 'Pedro Leopoldo' },
      // Lagoa Santa
      { start: '33400', end: '33499', city: 'Lagoa Santa' },
      // Confins
      { start: '33500', end: '33599', city: 'Confins' },
      // Matozinhos
      { start: '35720', end: '35799', city: 'Matozinhos' }
    ];

    const cleanCep = cep.replace(/\D/g, '');
    const cepNum = parseInt(cleanCep.substring(0, 5));

    for (const range of vetorNorteCeps) {
      if (cepNum >= parseInt(range.start) && cepNum <= parseInt(range.end)) {
        return {
          covered: true,
          city: range.city,
          region: 'Vetor Norte',
          cep: cleanCep
        };
      }
    }

    return {
      covered: false,
      message: 'CEP fora da área de cobertura atual',
      cep: cleanCep
    };
  }

  // Gerenciamento de áreas (para admin)
  addCoverageArea(area) {
    const newArea = {
      ...area,
      id: Math.max(...this.coverageAreas.map(a => a.id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    this.coverageAreas.push(newArea);
    this.saveCoverageAreas();
    return newArea;
  }

  updateCoverageArea(id, updates) {
    const index = this.coverageAreas.findIndex(area => area.id === id);
    if (index !== -1) {
      this.coverageAreas[index] = { ...this.coverageAreas[index], ...updates };
      this.saveCoverageAreas();
      return this.coverageAreas[index];
    }
    return null;
  }

  deleteCoverageArea(id) {
    this.coverageAreas = this.coverageAreas.filter(area => area.id !== id);
    this.saveCoverageAreas();
  }

  getAllAreas() {
    return this.coverageAreas;
  }

  getActiveAreas() {
    return this.coverageAreas.filter(area => area.status === 'active');
  }

  getExpansionMessage() {
    return {
      title: 'Em Breve na Sua Região!',
      message: 'Atualmente atendemos o Vetor Norte de Belo Horizonte. Em breve expandiremos para toda Minas Gerais e depois para todo o Brasil.',
      contact: 'Deixe seu contato e te avisaremos quando chegarmos na sua região!',
      regions: [
        { name: 'Vetor Norte BH', status: 'active', eta: 'Disponível agora' },
        { name: 'Grande BH', status: 'planned', eta: 'Próximos 3 meses' },
        { name: 'Interior de MG', status: 'planned', eta: 'Próximos 6 meses' },
        { name: 'Todo o Brasil', status: 'planned', eta: 'Próximo ano' }
      ]
    };
  }

  // Gestão de lista de espera para expansão
  addToWaitlist(email, cep, city, name = '', phone = '') {
    const waitlist = this.getWaitlist();
    const waitlistEntry = {
      id: Date.now(),
      email,
      cep,
      city,
      name,
      phone,
      requestedAt: new Date().toISOString(),
      priority: this.calculateExpansionPriority(cep, city),
      notified: false
    };
    
    waitlist.push(waitlistEntry);
    localStorage.setItem('expansionWaitlist', JSON.stringify(waitlist));
    return waitlistEntry;
  }

  getWaitlist() {
    const stored = localStorage.getItem('expansionWaitlist');
    return stored ? JSON.parse(stored) : [];
  }

  calculateExpansionPriority(cep, city) {
    // Prioridade baseada na proximidade com áreas atuais
    const priorityAreas = {
      'Contagem': 1, 'Betim': 1, 'Sabará': 1, 'Santa Luzia': 1,
      'Nova Lima': 2, 'Ibirité': 2, 'São José da Lapa': 2,
      'Esmeraldas': 3, 'Florestal': 3, 'Jaboticatubas': 3
    };
    
    return priorityAreas[city] || 4; // 1 = alta prioridade, 4 = baixa prioridade
  }

  // Planejamento de expansão
  getExpansionPlan() {
    const waitlist = this.getWaitlist();
    const demandByCity = {};
    
    waitlist.forEach(entry => {
      if (!demandByCity[entry.city]) {
        demandByCity[entry.city] = { count: 0, avgPriority: 0, entries: [] };
      }
      demandByCity[entry.city].count++;
      demandByCity[entry.city].entries.push(entry);
    });

    // Calcular prioridade média por cidade
    Object.keys(demandByCity).forEach(city => {
      const entries = demandByCity[city].entries;
      demandByCity[city].avgPriority = 
        entries.reduce((sum, entry) => sum + entry.priority, 0) / entries.length;
    });

    return {
      totalDemand: waitlist.length,
      demandByCity,
      nextExpansionTargets: this.getNextExpansionTargets(demandByCity),
      expansionPhases: this.getExpansionPhases()
    };
  }

  getNextExpansionTargets(demandByCity) {
    return Object.entries(demandByCity)
      .map(([city, data]) => ({
        city,
        demand: data.count,
        priority: data.avgPriority,
        score: data.count / data.avgPriority // Mais demanda + menor prioridade = maior score
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  getExpansionPhases() {
    return {
      phase1: {
        name: 'Grande BH',
        cities: ['Contagem', 'Betim', 'Sabará', 'Santa Luzia', 'Nova Lima'],
        eta: '3 meses',
        status: 'planned'
      },
      phase2: {
        name: 'Região Metropolitana Estendida',
        cities: ['Ibirité', 'São José da Lapa', 'Esmeraldas', 'Sete Lagoas'],
        eta: '6 meses',
        status: 'planned'
      },
      phase3: {
        name: 'Interior de MG',
        cities: ['Uberlândia', 'Juiz de Fora', 'Montes Claros', 'Uberaba'],
        eta: '12 meses',
        status: 'research'
      },
      phase4: {
        name: 'Outros Estados',
        cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
        eta: '18-24 meses',
        status: 'research'
      }
    };
  }

  // Atualizar status de expansão
  updateExpansionStatus(phase, status) {
    const plan = this.getExpansionPhases();
    if (plan[phase]) {
      plan[phase].status = status;
      localStorage.setItem('expansionPlan', JSON.stringify(plan));
    }
  }

  // Notificar lista de espera quando expandir
  notifyWaitlistForCity(city) {
    const waitlist = this.getWaitlist();
    const cityEntries = waitlist.filter(entry => 
      entry.city.toLowerCase() === city.toLowerCase() && !entry.notified
    );

    cityEntries.forEach(entry => {
      entry.notified = true;
      entry.notifiedAt = new Date().toISOString();
      // Aqui você integraria com serviço de email
      console.log(`Notificando ${entry.email} sobre expansão para ${city}`);
    });

    localStorage.setItem('expansionWaitlist', JSON.stringify(waitlist));
    return cityEntries.length;
  }
}

export default new CoverageService();
