
import React, { useState, useEffect } from 'react';
import coverageService from '../services/coverageService';

const CoverageMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showZones, setShowZones] = useState(true);
  const [coverageAreas, setCoverageAreas] = useState([]);

  useEffect(() => {
    const areas = coverageService.getActiveAreas();
    // Convert to display format
    const displayAreas = areas.map((area, index) => ({
      id: area.id,
      name: area.name,
      neighborhoods: area.neighborhoods || [area.name],
      deliveryTime: '30-60 min',
      availability: '7h às 19h',
      color: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'][index % 5]
    }));
    setCoverageAreas(displayAreas);
  }, []);

  const originalCoverageAreas = [
    {
      id: 1,
      name: 'Centro',
      neighborhoods: ['Centro', 'Savassi', 'Funcionários', 'Lourdes'],
      deliveryTime: '30-45 min',
      availability: 'Disponível 24/7',
      color: '#10B981'
    },
    {
      id: 2,
      name: 'Zona Sul',
      neighborhoods: ['Belvedere', 'Mangabeiras', 'Vila da Serra', 'Bandeirantes'],
      deliveryTime: '45-60 min',
      availability: '6h às 22h',
      color: '#3B82F6'
    },
    {
      id: 3,
      name: 'Zona Norte',
      neighborhoods: ['Pampulha', 'Ouro Preto', 'Liberdade', 'Fernão Dias'],
      deliveryTime: '45-60 min',
      availability: '7h às 20h',
      color: '#8B5CF6'
    },
    {
      id: 4,
      name: 'Zona Oeste',
      neighborhoods: ['Betim', 'Contagem', 'Esmeraldas', 'Ibirité'],
      deliveryTime: '60-90 min',
      availability: '8h às 18h',
      color: '#F59E0B'
    },
    {
      id: 5,
      name: 'Zona Leste',
      neighborhoods: ['Nova Lima', 'Santa Luzia', 'Sabará', 'Rio Acima'],
      deliveryTime: '60-90 min',
      availability: '8h às 18h',
      color: '#EF4444'
    }
  ];

  const emergencyZones = [
    'Centro', 'Savassi', 'Funcionários', 'Lourdes', 'Belvedere'
  ];

  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, []);

  const checkCoverage = (cep) => {
    // Simulação de verificação de CEP
    if (cep.length === 8) {
      const randomZone = coverageAreas[Math.floor(Math.random() * coverageAreas.length)];
      setSelectedRegion(randomZone);
      return true;
    }
    return false;
  };

  const [cepInput, setCepInput] = useState('');
  const [cepResult, setCepResult] = useState(null);

  const handleCepCheck = () => {
    if (cepInput.replace(/\D/g, '').length === 8) {
      const isAvailable = checkCoverage(cepInput);
      setCepResult({
        available: isAvailable,
        cep: cepInput,
        zone: selectedRegion
      });
    } else {
      alert('Por favor, digite um CEP válido');
    }
  };

  const formatCep = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Área de <span className="text-primary-600">Cobertura</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Atendemos toda a região metropolitana de Belo Horizonte com horários flexíveis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map Visualization */}
          <div className="relative">
            <div className="bg-gray-100 rounded-xl p-8 min-h-96 relative overflow-hidden">
              {/* Simplified map representation */}
              <div className="relative h-80">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <i data-feather="map-pin" className="w-16 h-16 text-primary-600 mx-auto mb-4"></i>
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">
                      Região Metropolitana de BH
                    </h3>
                    <p className="text-secondary-600">
                      Cobertura completa em {coverageAreas.length} zonas
                    </p>
                  </div>
                </div>

                {/* Zone indicators */}
                {showZones && (
                  <div className="absolute inset-0">
                    {coverageAreas.map((area, index) => (
                      <div
                        key={area.id}
                        className={`absolute w-12 h-12 rounded-full cursor-pointer transition-all hover:scale-110 ${
                          selectedRegion?.id === area.id ? 'ring-4 ring-white ring-opacity-70' : ''
                        }`}
                        style={{
                          backgroundColor: area.color,
                          top: `${20 + (index * 15)}%`,
                          left: `${30 + (index % 3) * 20}%`
                        }}
                        onClick={() => setSelectedRegion(area)}
                        title={area.name}
                      >
                        <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                          {area.name[0]}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button
                  onClick={() => setShowZones(!showZones)}
                  className="bg-white p-2 rounded shadow hover:shadow-lg transition-shadow"
                  title="Toggle zones"
                >
                  <i data-feather="layers" className="w-5 h-5 text-secondary-600"></i>
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-secondary-900 mb-3">Legenda:</h4>
              <div className="grid grid-cols-2 gap-3">
                {coverageAreas.map(area => (
                  <div key={area.id} className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: area.color }}
                    ></div>
                    <span className="text-sm text-secondary-700">{area.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coverage Info */}
          <div className="space-y-6">
            {/* CEP Checker */}
            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                Verificar Cobertura por CEP
              </h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="00000-000"
                  value={cepInput}
                  onChange={(e) => setCepInput(formatCep(e.target.value))}
                  maxLength="9"
                  className="flex-1 px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={handleCepCheck}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Verificar
                </button>
              </div>
              
              {cepResult && (
                <div className={`mt-4 p-4 rounded-lg ${
                  cepResult.available ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
                }`}>
                  {cepResult.available ? (
                    <div>
                      <div className="flex items-center text-green-700 mb-2">
                        <i data-feather="check-circle" className="w-5 h-5 mr-2"></i>
                        <span className="font-semibold">Atendemos sua região!</span>
                      </div>
                      <div className="text-sm text-green-600">
                        <p>Zona: {cepResult.zone.name}</p>
                        <p>Tempo de chegada: {cepResult.zone.deliveryTime}</p>
                        <p>Disponibilidade: {cepResult.zone.availability}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-700">
                      <i data-feather="x-circle" className="w-5 h-5 mr-2"></i>
                      <span>Não atendemos esta região ainda</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Coverage Areas List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-secondary-900">
                Áreas de Atendimento
              </h3>
              
              {coverageAreas.map(area => (
                <div
                  key={area.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedRegion?.id === area.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-primary-300'
                  }`}
                  onClick={() => setSelectedRegion(area)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-4 h-4 rounded-full mt-1"
                      style={{ backgroundColor: area.color }}
                    ></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-secondary-900 mb-1">
                        {area.name}
                      </h4>
                      <p className="text-sm text-secondary-600 mb-2">
                        {area.neighborhoods.join(', ')}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <i data-feather="clock" className="w-3 h-3 text-secondary-400"></i>
                          <span className="text-secondary-600">{area.deliveryTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i data-feather="calendar" className="w-3 h-3 text-secondary-400"></i>
                          <span className="text-secondary-600">{area.availability}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Service */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <i data-feather="alert-circle" className="w-5 h-5 text-red-600"></i>
                <h4 className="font-semibold text-red-900">Serviço de Emergência 24h</h4>
              </div>
              <p className="text-sm text-red-700 mb-3">
                Disponível nas seguintes regiões: {emergencyZones.join(', ')}
              </p>
              <a
                href="tel:+553198025882"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors inline-flex items-center"
              >
                <i data-feather="phone" className="w-4 h-4 mr-2"></i>
                Ligar Emergência
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoverageMap;
