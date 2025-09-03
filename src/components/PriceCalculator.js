import React, { useState, useEffect, useCallback } from 'react';
import coverageService from '../services/coverageService';

const PriceCalculator = () => {
  const [formData, setFormData] = useState({
    serviceType: '',
    area: '',
    frequency: 'unica',
    rooms: '1',
    bathrooms: '1',
    extras: [],
    cep: '',
    address: '',
    waitlistName: '',
    waitlistEmail: '',
    waitlistPhone: ''
  });

  const [price, setPrice] = useState(0);
  const [breakdown, setBreakdown] = useState({});
  const [coverageCheck, setCoverageCheck] = useState(null);
  const [showCoverageModal, setShowCoverageModal] = useState(false);

  const servicePrices = {
    residencial: { name: 'Limpeza Residencial', base: 80, perM2: 3 },
    comercial: { name: 'Limpeza Comercial', base: 120, perM2: 4 },
    'pos-obra': { name: 'Limpeza Pós-Obra', base: 200, perM2: 8 },
    carpetes: { name: 'Limpeza de Carpetes', base: 60, perM2: 12 },
    vidros: { name: 'Limpeza de Vidros', base: 40, perM2: 6 }
  };

  const frequencyMultipliers = {
    unica: 1,
    semanal: 0.8,
    quinzenal: 0.85,
    mensal: 0.9
  };

  const extraServices = {
    'limpeza-geladeira': { name: 'Limpeza de Geladeira', price: 30 },
    'limpeza-forno': { name: 'Limpeza de Forno', price: 25 },
    'lavagem-roupas': { name: 'Lavagem de Roupas', price: 40 },
    'organizacao': { name: 'Organização de Ambientes', price: 50 },
    'cera-chao': { name: 'Enceramento do Chão', price: 35 },
    'limpeza-cortinas': { name: 'Limpeza de Cortinas', price: 60 }
  };

  const calculatePrice = useCallback(() => {
    if (!formData.serviceType || !formData.area) {
      setPrice(0);
      setBreakdown({});
      return;
    }

    const service = servicePrices[formData.serviceType];
    const area = parseInt(formData.area) || 0;

    let basePrice = service.base;
    let areaPrice = area * service.perM2;

    // Ajuste por número de cômodos
    const roomMultiplier = Math.max(1, parseInt(formData.rooms) * 0.1);
    const bathroomMultiplier = Math.max(1, parseInt(formData.bathrooms) * 0.15);

    let subtotal = (basePrice + areaPrice) * (1 + roomMultiplier + bathroomMultiplier);

    // Aplicar multiplicador de frequência
    const frequencyMultiplier = frequencyMultipliers[formData.frequency];
    subtotal *= frequencyMultiplier;

    // Calcular extras
    const extrasTotal = formData.extras.reduce((total, extraId) => {
      return total + (extraServices[extraId]?.price || 0);
    }, 0);

    const finalPrice = subtotal + extrasTotal;

    setPrice(finalPrice);
    setBreakdown({
      base: basePrice,
      area: areaPrice,
      frequency: frequencyMultiplier,
      extras: extrasTotal,
      subtotal: subtotal,
      total: finalPrice
    });

    // Track quote calculation
    if (window.gtag) {
      window.gtag('event', 'quote_request', {
        event_category: 'Calculator',
        event_label: service.name,
        value: finalPrice
      });
    }
  }, [formData]);

  useEffect(() => {
    calculatePrice();
  }, [formData.serviceType, formData.area, formData.frequency, formData.rooms, formData.bathrooms, formData.extras]);

  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === 'extras') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          extras: [...prev.extras, value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          extras: prev.extras.filter(extra => extra !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleServiceChange = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      serviceType: serviceId,
      // Reset extras when service type changes to avoid confusion
      extras: []
    }));
    const service = servicePrices[serviceId];
    if (service && window.gtag) {
      // Track service selection
      window.gtag('event', 'service_selection', {
        event_category: 'Calculator',
        event_label: service.name,
        value: service.base
      });
    }
  };

  const formatCep = (cep) => {
    cep = cep.replace(/\D/g, '');
    cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
    return cep;
  };

  const handleCepCheck = async () => {
    if (!formData.cep) {
      setCoverageCheck(null);
      return;
    }

    try {
      const result = await coverageService.checkCoverage(formData.cep);
      setCoverageCheck(result);
      if (!result.covered) {
        setShowCoverageModal(true);
      }
    } catch (error) {
      console.error("Erro ao verificar cobertura:", error);
      setCoverageCheck({ covered: false, message: "Falha ao verificar a cobertura. Tente novamente." });
      setShowCoverageModal(true);
    }
  };

  const checkCoverageByAddress = useCallback(async () => {
    if (!formData.address && !formData.cep) {
      setCoverageCheck(null);
      return;
    }

    try {
      let result;
      if (formData.cep) {
        result = await coverageService.checkCoverage(formData.cep); // Changed from checkCoverageByZip to checkCoverage as per original
      } else {
        // For address without CEP, we'll simulate a check
        result = { covered: false, message: "Por favor, informe o CEP para verificar a cobertura." };
      }
      setCoverageCheck(result);
      if (!result.covered) {
        setShowCoverageModal(true);
      }
    } catch (error) {
      console.error("Erro ao verificar cobertura:", error);
      setCoverageCheck({ covered: false, message: "Falha ao verificar a cobertura. Tente novamente." });
      setShowCoverageModal(true);
    }
  }, [formData.cep, formData.address]); // Added formData.address as it's used in the condition

  useEffect(() => {
    checkCoverageByAddress();
  }, [formData.cep, formData.address]);

  const handleCloseCoverageModal = () => {
    setShowCoverageModal(false);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Calculadora de <span className="text-primary-600">Preços</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Calcule o valor estimado do seu serviço de limpeza de forma rápida e fácil
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="space-y-6">
              {/* Location and Service Selection */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                {/* CEP Check */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Verificar Cobertura</h3>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="00000-000"
                      value={formData.cep}
                      onChange={(e) => setFormData(prev => ({ ...prev, cep: formatCep(e.target.value) }))}
                      maxLength="9"
                      className="flex-1 px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={handleCepCheck}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Verificar
                    </button>
                  </div>

                  {coverageCheck && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      coverageCheck.covered ? 'bg-green-100 border border-green-200' : 'bg-yellow-100 border border-yellow-200'
                    }`}>
                      <div className={`font-medium ${coverageCheck.covered ? 'text-green-800' : 'text-yellow-800'}`}>
                        {coverageCheck.covered ? '✓ Área Atendida!' : '⚠️ Área em Expansão'}
                      </div>
                      <div className="text-sm mt-1">
                        {coverageCheck.covered ? (
                          <span>Atendemos {coverageCheck.city} - {coverageCheck.region}</span>
                        ) : (
                          <span>{coverageCheck.message}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Tipo de Serviço</h3>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Selecione o serviço</option>
                  <option value="residencial">Limpeza Residencial</option>
                  <option value="comercial">Limpeza Comercial</option>
                  <option value="pos-obra">Limpeza Pós-Obra</option>
                  <option value="carpetes">Limpeza de Carpetes</option>
                  <option value="vidros">Limpeza de Vidros</option>
                </select>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Área Total (m²) *
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Ex: 100"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Cômodos
                    </label>
                    <select
                      name="rooms"
                      value={formData.rooms}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Banheiros
                    </label>
                    <select
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Frequência
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="unica">Única vez</option>
                    <option value="semanal">Semanal (20% desconto)</option>
                    <option value="quinzenal">Quinzenal (15% desconto)</option>
                    <option value="mensal">Mensal (10% desconto)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    Serviços Extras
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(extraServices).map(([id, service]) => (
                      <label key={id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="extras"
                          value={id}
                          checked={formData.extras.includes(id)}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                        />
                        <span className="text-sm text-secondary-700">
                          {service.name} (+R$ {service.price})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resultado */}
          <div className="bg-primary-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-secondary-900 mb-6">
              Orçamento Estimado
            </h3>

            {price > 0 ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary-600 mb-2">
                      R$ {price.toFixed(2)}
                    </div>
                    <p className="text-secondary-600">
                      {formData.frequency !== 'unica' ? `Por ${formData.frequency === 'semanal' ? 'semana' : formData.frequency === 'quinzenal' ? 'quinzena' : 'mês'}` : 'Serviço único'}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <h4 className="font-semibold text-secondary-900 mb-4">Detalhamento:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Taxa base:</span>
                      <span>R$ {breakdown.base?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Área ({formData.area}m²):</span>
                      <span>R$ {breakdown.area?.toFixed(2)}</span>
                    </div>
                    {breakdown.extras > 0 && (
                      <div className="flex justify-between">
                        <span>Serviços extras:</span>
                        <span>R$ {breakdown.extras?.toFixed(2)}</span>
                      </div>
                    )}
                    {formData.frequency !== 'unica' && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto por frequência:</span>
                        <span>-
                          {((1 - frequencyMultipliers[formData.frequency]) * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                    <hr className="my-2"/>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>R$ {price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => {
                      if (!coverageCheck || !coverageCheck.covered) {
                        setShowCoverageModal(true);
                      } else {
                        // Proceed with quote request
                        alert('Solicitando orçamento...');
                      }
                    }}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      (!coverageCheck || !coverageCheck.covered)
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                    disabled={!coverageCheck || !coverageCheck.covered}
                  >
                    Solicitar Orçamento Oficial
                  </button>
                  <button className="w-full border border-primary-600 text-primary-600 hover:bg-primary-50 py-3 px-4 rounded-lg font-medium transition-colors">
                    Agendar Visita Técnica
                  </button>
                </div>

                <div className="text-xs text-secondary-500 text-center">
                  * Valores estimados. Orçamento final sujeito a avaliação técnica.
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <i data-feather="calculator" className="w-16 h-16 text-secondary-300 mx-auto mb-4"></i>
                <p className="text-secondary-500">
                  Preencha os dados ao lado para calcular o orçamento
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCoverageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-secondary-900 mb-4 text-center">
              {coverageCheck?.covered ? 'Nossa Cobertura' : 'Aguarde Novidades!'}
            </h3>
            <p className="text-secondary-700 mb-6 text-center">
              {coverageCheck?.covered
                ? `Atendemos sua região! Em breve expandiremos para outras áreas.`
                : `No momento, nosso foco principal é o ${coverageCheck?.region || 'Vetor Norte de BH'}. Estamos expandindo nossos serviços e em breve atenderemos a sua região.`}
            </p>

            {!coverageCheck?.covered && (
              <div className="mb-6 space-y-3">
                <h4 className="font-semibold text-secondary-900">Cadastre-se para ser notificado:</h4>
                <input
                  type="text"
                  placeholder="Seu nome"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  onChange={(e) => setFormData(prev => ({ ...prev, waitlistName: e.target.value }))}
                />
                <input
                  type="email"
                  placeholder="Seu email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  onChange={(e) => setFormData(prev => ({ ...prev, waitlistEmail: e.target.value }))}
                />
                <input
                  type="tel"
                  placeholder="Telefone (opcional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  onChange={(e) => setFormData(prev => ({ ...prev, waitlistPhone: e.target.value }))}
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleCloseCoverageModal}
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Fechar
              </button>
              {!coverageCheck?.covered && (
                <button
                  onClick={() => {
                    if (formData.waitlistEmail) {
                      coverageService.addToWaitlist(
                        formData.waitlistEmail,
                        formData.cep,
                        coverageCheck?.suggestedCity || 'Região não identificada',
                        formData.waitlistName || '',
                        formData.waitlistPhone || ''
                      );
                      alert('Cadastro realizado! Te avisaremos quando expandirmos para sua região.');
                      handleCloseCoverageModal();
                    } else {
                      alert('Por favor, preencha seu email.');
                    }
                  }}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Me Avise
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PriceCalculator;