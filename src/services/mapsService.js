
import apiService from './apiService';
import API_CONFIG from '../config/apiConfig';

class MapsService {
  constructor() {
    this.config = API_CONFIG;
    this.isProduction = !API_CONFIG.isDevelopment;
  }

  // ========== MÉTODOS PARA PRODUÇÃO (GOOGLE MAPS API) ==========
  
  async geocodeAddress(address) {
    try {
      if (this.isProduction && this.config.apiKeys.googleMaps !== 'ADICIONAR_CHAVE_GOOGLE_MAPS') {
        const url = `${this.config.baseUrls.maps}/geocode/json`;
        const params = new URLSearchParams({
          address: address,
          key: this.config.apiKeys.googleMaps,
          language: 'pt-BR',
          region: 'BR'
        });
        
        const response = await fetch(`${url}?${params}`);
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
          const result = data.results[0];
          return {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
            formatted_address: result.formatted_address,
            place_id: result.place_id,
            address_components: result.address_components
          };
        }
        
        throw new Error(`Geocoding failed: ${data.status}`);
      }
      
      // Fallback para simulação
      return this.simulateGeocode(address);
    } catch (error) {
      console.error('Erro ao geocodificar endereço:', error);
      return this.simulateGeocode(address);
    }
  }

  async reverseGeocode(lat, lng) {
    try {
      if (this.isProduction && this.config.apiKeys.googleMaps !== 'ADICIONAR_CHAVE_GOOGLE_MAPS') {
        const url = `${this.config.baseUrls.maps}/geocode/json`;
        const params = new URLSearchParams({
          latlng: `${lat},${lng}`,
          key: this.config.apiKeys.googleMaps,
          language: 'pt-BR',
          region: 'BR'
        });
        
        const response = await fetch(`${url}?${params}`);
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
          return data.results[0].formatted_address;
        }
        
        throw new Error(`Reverse geocoding failed: ${data.status}`);
      }
      
      // Fallback para simulação
      return this.simulateReverseGeocode(lat, lng);
    } catch (error) {
      console.error('Erro ao fazer geocodificação reversa:', error);
      return 'Endereço não encontrado';
    }
  }

  async calculateDistance(origin, destination) {
    try {
      if (this.isProduction && this.config.apiKeys.googleMaps !== 'ADICIONAR_CHAVE_GOOGLE_MAPS') {
        const url = `${this.config.baseUrls.maps}/distancematrix/json`;
        const params = new URLSearchParams({
          origins: origin,
          destinations: destination,
          units: 'metric',
          key: this.config.apiKeys.googleMaps,
          language: 'pt-BR'
        });
        
        const response = await fetch(`${url}?${params}`);
        const data = await response.json();
        
        if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
          const element = data.rows[0].elements[0];
          return {
            distance: element.distance.text,
            duration: element.duration.text,
            distance_value: element.distance.value, // metros
            duration_value: element.duration.value  // segundos
          };
        }
        
        throw new Error('Distance calculation failed');
      }
      
      // Fallback para simulação
      return this.simulateDistance(origin, destination);
    } catch (error) {
      console.error('Erro ao calcular distância:', error);
      return this.simulateDistance(origin, destination);
    }
  }

  async findNearbyPlaces(location, type = 'establishment', radius = 5000) {
    try {
      if (this.isProduction && this.config.apiKeys.googleMaps !== 'ADICIONAR_CHAVE_GOOGLE_MAPS') {
        const url = `${this.config.baseUrls.maps}/place/nearbysearch/json`;
        const params = new URLSearchParams({
          location: `${location.lat},${location.lng}`,
          radius: radius,
          type: type,
          key: this.config.apiKeys.googleMaps,
          language: 'pt-BR'
        });
        
        const response = await fetch(`${url}?${params}`);
        const data = await response.json();
        
        if (data.status === 'OK') {
          return data.results.map(place => ({
            place_id: place.place_id,
            name: place.name,
            rating: place.rating,
            types: place.types,
            vicinity: place.vicinity,
            geometry: place.geometry,
            photos: place.photos
          }));
        }
        
        throw new Error(`Places search failed: ${data.status}`);
      }
      
      // Fallback para simulação
      return this.simulateNearbyPlaces(location, type);
    } catch (error) {
      console.error('Erro ao buscar lugares próximos:', error);
      return [];
    }
  }

  // ========== MÉTODOS SIMULADOS (DESENVOLVIMENTO) ==========
  
  async simulateGeocode(address) {
    await apiService.simulateApiDelay(800);
    
    // Mapeamento simulado de endereços de Belo Horizonte
    const addressMapping = {
      'centro': { lat: -19.9245, lng: -43.9352, formatted_address: 'Centro, Belo Horizonte - MG, Brasil' },
      'savassi': { lat: -19.9386, lng: -43.9276, formatted_address: 'Savassi, Belo Horizonte - MG, Brasil' },
      'funcionários': { lat: -19.9311, lng: -43.9378, formatted_address: 'Funcionários, Belo Horizonte - MG, Brasil' },
      'zona sul': { lat: -19.9191, lng: -43.9386, formatted_address: 'Zona Sul, Belo Horizonte - MG, Brasil' },
      'zona norte': { lat: -19.8157, lng: -43.9542, formatted_address: 'Zona Norte, Belo Horizonte - MG, Brasil' },
      'zona leste': { lat: -19.8968, lng: -43.8821, formatted_address: 'Zona Leste, Belo Horizonte - MG, Brasil' },
      'zona oeste': { lat: -19.9397, lng: -44.0012, formatted_address: 'Zona Oeste, Belo Horizonte - MG, Brasil' }
    };

    const addressLower = address.toLowerCase();
    for (const [key, coords] of Object.entries(addressMapping)) {
      if (addressLower.includes(key)) {
        return {
          ...coords,
          place_id: `simulated_${key.replace(' ', '_')}`,
          address_components: []
        };
      }
    }

    // Coordenadas padrão (centro de BH)
    return {
      lat: -19.9245,
      lng: -43.9352,
      formatted_address: 'Belo Horizonte - MG, Brasil',
      place_id: 'simulated_default',
      address_components: []
    };
  }

  async simulateReverseGeocode(lat, lng) {
    await apiService.simulateApiDelay(800);
    return `Rua Simulada, ${Math.floor(Math.random() * 9999)}, Belo Horizonte - MG, Brasil`;
  }

  async simulateDistance(origin, destination) {
    await apiService.simulateApiDelay(1000);
    
    // Simular distância aleatória entre 2-25 km
    const distanceKm = Math.floor(Math.random() * 23) + 2;
    const durationMinutes = Math.floor(distanceKm * 2.5 + Math.random() * 10);
    
    return {
      distance: `${distanceKm} km`,
      duration: `${durationMinutes} min`,
      distance_value: distanceKm * 1000,
      duration_value: durationMinutes * 60
    };
  }

  async simulateNearbyPlaces(location, type) {
    await apiService.simulateApiDelay(1200);
    
    const mockPlaces = [
      { name: 'Shopping Local', rating: 4.2, types: ['shopping_mall'] },
      { name: 'Supermercado Central', rating: 4.0, types: ['supermarket'] },
      { name: 'Farmácia 24h', rating: 4.5, types: ['pharmacy'] },
      { name: 'Banco do Brasil', rating: 3.8, types: ['bank'] },
      { name: 'Hospital Municipal', rating: 4.1, types: ['hospital'] }
    ];
    
    return mockPlaces.map((place, index) => ({
      ...place,
      place_id: `simulated_place_${index}`,
      vicinity: `Próximo a ${location.lat}, ${location.lng}`,
      geometry: {
        location: {
          lat: location.lat + (Math.random() - 0.5) * 0.01,
          lng: location.lng + (Math.random() - 0.5) * 0.01
        }
      }
    }));
  }

  // ========== UTILITÁRIOS ==========
  
  // Calcular distância usando fórmula de Haversine
  calculateHaversineDistance(lat1, lng1, lat2, lng2) {
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

  // Verificar se uma localização está dentro da área de cobertura
  isLocationInCoverage(lat, lng, coverageAreas = []) {
    // Se não há áreas definidas, assumir cobertura em toda BH
    if (coverageAreas.length === 0) {
      const bhBounds = {
        north: -19.7,
        south: -20.1,
        east: -43.7,
        west: -44.1
      };
      
      return lat >= bhBounds.south && lat <= bhBounds.north &&
             lng >= bhBounds.west && lng <= bhBounds.east;
    }
    
    // Verificar se está dentro de alguma área de cobertura
    return coverageAreas.some(area => {
      const distance = this.calculateHaversineDistance(
        lat, lng, area.center.lat, area.center.lng
      );
      return distance <= area.radius;
    });
  }

  // Obter endereços de exemplo para autocomplete
  getExampleAddresses() {
    return [
      'Centro, Belo Horizonte - MG',
      'Savassi, Belo Horizonte - MG',
      'Funcionários, Belo Horizonte - MG',
      'Lourdes, Belo Horizonte - MG',
      'Santo Antônio, Belo Horizonte - MG',
      'Zona Sul, Belo Horizonte - MG',
      'Zona Norte, Belo Horizonte - MG'
    ];
  }

  // Formatar endereço para exibição
  formatAddress(addressComponents) {
    if (!addressComponents || !Array.isArray(addressComponents)) {
      return 'Endereço não disponível';
    }
    
    const street = addressComponents.find(c => c.types.includes('route'))?.long_name || '';
    const number = addressComponents.find(c => c.types.includes('street_number'))?.long_name || '';
    const neighborhood = addressComponents.find(c => c.types.includes('sublocality'))?.long_name || '';
    const city = addressComponents.find(c => c.types.includes('locality'))?.long_name || '';
    const state = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.short_name || '';
    
    return `${street}${number ? `, ${number}` : ''}, ${neighborhood}, ${city} - ${state}`;
  }
}

export default new MapsService();
