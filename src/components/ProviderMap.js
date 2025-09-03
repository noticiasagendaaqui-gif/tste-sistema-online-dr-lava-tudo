
import React, { useState, useEffect } from 'react';
import providerService from '../services/providerService';

const ProviderMap = ({ selectedService, clientAddress }) => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedService && clientAddress) {
      loadNearbyProviders();
    }
  }, [selectedService, clientAddress]);

  const loadNearbyProviders = async () => {
    setLoading(true);
    try {
      const nearbyProviders = await providerService.findNearbyProviders(
        selectedService, 
        clientAddress, 
        30 // máximo 30km
      );
      setProviders(nearbyProviders);
    } catch (error) {
      console.error('Erro ao carregar prestadores:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Prestadores Disponíveis para {selectedService}
        </h3>
        <button
          onClick={loadNearbyProviders}
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Buscando prestadores próximos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <div 
              key={provider.id}
              className={`bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
                selectedProvider?.id === provider.id ? 'border-primary-500 bg-primary-50' : ''
              }`}
              onClick={() => setSelectedProvider(provider)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                  <p className="text-sm text-gray-600">{provider.distance} km de distância</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-500 text-sm">
                    ⭐ {provider.rating.toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-500">{provider.completedServices} serviços</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {provider.specialties.slice(0, 2).map((specialty, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {provider.ownTransport ? '🚗' : ''} 
                    {provider.ownTools ? '🛠️' : ''} 
                    {provider.expectedPrice ? `R$ ${provider.expectedPrice}/h` : ''}
                  </span>
                  <span className="text-green-600 font-medium">Disponível</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {providers.length === 0 && !loading && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Nenhum prestador encontrado para este serviço na sua região.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Nossos funcionários internos poderão atender sua solicitação.
          </p>
        </div>
      )}

      {selectedProvider && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <h4 className="font-semibold text-primary-900 mb-2">
            Prestador Selecionado: {selectedProvider.name}
          </h4>
          <p className="text-sm text-primary-800">
            Este prestador será notificado automaticamente quando você confirmar o agendamento.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProviderMap;
