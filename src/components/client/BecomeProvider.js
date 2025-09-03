
import React, { useState, useEffect } from 'react';
import { useEmail } from '../../hooks/useEmail';

const BecomeProvider = ({ user }) => {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      cpf: '',
      rg: '',
      birthDate: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    professionalInfo: {
      specialties: [],
      experience: '',
      availability: {
        monday: { available: false, start: '08:00', end: '18:00' },
        tuesday: { available: false, start: '08:00', end: '18:00' },
        wednesday: { available: false, start: '08:00', end: '18:00' },
        thursday: { available: false, start: '08:00', end: '18:00' },
        friday: { available: false, start: '08:00', end: '18:00' },
        saturday: { available: false, start: '08:00', end: '18:00' },
        sunday: { available: false, start: '08:00', end: '18:00' }
      },
      serviceRadius: 10,
      ownTools: false,
      ownTransport: false,
      expectedPrice: ''
    },
    documents: {
      profilePhoto: null,
      cpfDocument: null,
      criminalRecord: null,
      workReferences: []
    },
    coordinates: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const { sendEmail } = useEmail();

  const availableServices = [
    'Limpeza Residencial',
    'Limpeza Comercial',
    'Limpeza Pós-Obra',
    'Limpeza de Escritório',
    'Limpeza de Vidros',
    'Limpeza de Estofados',
    'Organização de Ambientes',
    'Limpeza de Cozinha Industrial'
  ];

  const steps = [
    { id: 1, title: 'Informações Pessoais', icon: '👤' },
    { id: 2, title: 'Informações Profissionais', icon: '💼' },
    { id: 3, title: 'Documentos', icon: '📄' },
    { id: 4, title: 'Localização', icon: '📍' },
    { id: 5, title: 'Revisão', icon: '✅' }
  ];

  // Geolocalização
  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setLocationLoading(false);
          alert('Não foi possível obter sua localização. Por favor, insira seu endereço manualmente.');
        }
      );
    } else {
      setLocationLoading(false);
      alert('Geolocalização não é suportada pelo seu navegador.');
    }
  };

  const geocodeAddress = async (address) => {
    try {
      // Simulação de geocodificação - em produção, use Google Maps API
      const addressMapping = {
        'centro': { lat: -19.9245, lng: -43.9352 },
        'savassi': { lat: -19.9386, lng: -43.9276 },
        'funcionarios': { lat: -19.9311, lng: -43.9378 },
        'zona sul': { lat: -19.9191, lng: -43.9386 },
        'zona norte': { lat: -19.8157, lng: -43.9542 },
        'zona leste': { lat: -19.8968, lng: -43.8821 },
        'zona oeste': { lat: -19.9397, lng: -44.0012 }
      };

      const addressLower = address.toLowerCase();
      for (const [key, coords] of Object.entries(addressMapping)) {
        if (addressLower.includes(key)) {
          return coords;
        }
      }

      return { lat: -19.9245, lng: -43.9352 };
    } catch (error) {
      console.error('Erro na geocodificação:', error);
      return { lat: -19.9245, lng: -43.9352 };
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        availability: {
          ...prev.professionalInfo.availability,
          [day]: {
            ...prev.professionalInfo.availability[day],
            [field]: value
          }
        }
      }
    }));
  };

  const handleSpecialtyToggle = (specialty) => {
    setFormData(prev => {
      const currentSpecialties = prev.professionalInfo.specialties;
      const newSpecialties = currentSpecialties.includes(specialty)
        ? currentSpecialties.filter(s => s !== specialty)
        : [...currentSpecialties, specialty];
      
      return {
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          specialties: newSpecialties
        }
      };
    });
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        const personal = formData.personalInfo;
        return personal.fullName && personal.email && personal.phone && 
               personal.cpf && personal.address && personal.city;
      case 2:
        const professional = formData.professionalInfo;
        return professional.specialties.length > 0 && professional.experience;
      case 3:
        const docs = formData.documents;
        return docs.profilePhoto && docs.cpfDocument && docs.criminalRecord;
      case 4:
        return formData.coordinates !== null;
      default:
        return true;
    }
  };

  const nextStep = async () => {
    if (!validateStep(currentStep)) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (currentStep === 4 && !formData.coordinates) {
      // Tentar geocodificar endereço se não tiver coordenadas
      const coords = await geocodeAddress(formData.personalInfo.address);
      setFormData(prev => ({ ...prev, coordinates: coords }));
    }

    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Salvar dados do prestador
      const providerData = {
        ...formData,
        userId: user.id,
        status: 'pendente_aprovacao',
        appliedAt: new Date().toISOString(),
        id: Date.now()
      };

      // Salvar no localStorage (em produção seria API)
      const existingProviders = JSON.parse(localStorage.getItem('providerApplications') || '[]');
      existingProviders.push(providerData);
      localStorage.setItem('providerApplications', JSON.stringify(existingProviders));

      // Enviar email de confirmação
      await sendEmail(
        formData.personalInfo.email,
        'Solicitação de Cadastro como Prestador - AgendaAqui',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5;">AgendaAqui</h1>
            <h2 style="color: #10B981;">Solicitação Recebida!</h2>
          </div>
          
          <div style="background-color: #f0fdf4; border: 2px solid #10B981; padding: 25px; border-radius: 10px;">
            <p style="color: #065f46; font-size: 18px; margin-top: 0;">
              Olá <strong>${formData.personalInfo.fullName}</strong>!
            </p>
            <p style="color: #065f46; font-size: 16px; line-height: 1.6;">
              Recebemos sua solicitação para se tornar um prestador de serviços da AgendaAqui.
              Nossa equipe analisará seus dados e documentos em até 48 horas.
            </p>
            <p style="color: #065f46; font-size: 16px; line-height: 1.6;">
              Você receberá um email com o resultado da análise em breve.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              Atenciosamente,<br>
              Equipe AgendaAqui
            </p>
          </div>
        </div>
        `
      );

      // Notificar administradores
      await sendEmail(
        'williamiurd.ramos@gmail.com',
        'Nova Solicitação de Prestador - AgendaAqui',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4F46E5;">Nova Solicitação de Prestador</h2>
          <p><strong>Nome:</strong> ${formData.personalInfo.fullName}</p>
          <p><strong>Email:</strong> ${formData.personalInfo.email}</p>
          <p><strong>Telefone:</strong> ${formData.personalInfo.phone}</p>
          <p><strong>Especialidades:</strong> ${formData.professionalInfo.specialties.join(', ')}</p>
          <p><strong>Experiência:</strong> ${formData.professionalInfo.experience}</p>
          <p><strong>Região:</strong> ${formData.personalInfo.city}</p>
          <p>Acesse o painel administrativo para revisar e aprovar.</p>
        </div>
        `
      );

      alert('Solicitação enviada com sucesso! Você receberá um retorno em até 48 horas.');
      
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      alert('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Informações Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                <input
                  type="text"
                  value={formData.personalInfo.fullName}
                  onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                <input
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CPF *</label>
                <input
                  type="text"
                  value={formData.personalInfo.cpf}
                  onChange={(e) => handleInputChange('personalInfo', 'cpf', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">RG *</label>
                <input
                  type="text"
                  value={formData.personalInfo.rg}
                  onChange={(e) => handleInputChange('personalInfo', 'rg', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento *</label>
                <input
                  type="date"
                  value={formData.personalInfo.birthDate}
                  onChange={(e) => handleInputChange('personalInfo', 'birthDate', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Endereço Completo *</label>
              <input
                type="text"
                value={formData.personalInfo.address}
                onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Rua, número, bairro"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade *</label>
                <input
                  type="text"
                  value={formData.personalInfo.city}
                  onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                <select
                  value={formData.personalInfo.state}
                  onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RS">Rio Grande do Sul</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                <input
                  type="text"
                  value={formData.personalInfo.zipCode}
                  onChange={(e) => handleInputChange('personalInfo', 'zipCode', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Informações Profissionais</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Especialidades *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableServices.map((service) => (
                  <label key={service} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.professionalInfo.specialties.includes(service)}
                      onChange={() => handleSpecialtyToggle(service)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experiência *</label>
              <select
                value={formData.professionalInfo.experience}
                onChange={(e) => handleInputChange('professionalInfo', 'experience', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Selecione sua experiência</option>
                <option value="iniciante">Iniciante (até 1 ano)</option>
                <option value="intermediario">Intermediário (1-3 anos)</option>
                <option value="experiente">Experiente (3-5 anos)</option>
                <option value="especialista">Especialista (mais de 5 anos)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Raio de Atendimento (km)</label>
                <input
                  type="number"
                  value={formData.professionalInfo.serviceRadius}
                  onChange={(e) => handleInputChange('professionalInfo', 'serviceRadius', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="1"
                  max="50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço Esperado por Hora (R$)</label>
                <input
                  type="number"
                  value={formData.professionalInfo.expectedPrice}
                  onChange={(e) => handleInputChange('professionalInfo', 'expectedPrice', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ex: 25"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.professionalInfo.ownTools}
                  onChange={(e) => handleInputChange('professionalInfo', 'ownTools', e.target.checked)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Possuo ferramentas próprias</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.professionalInfo.ownTransport}
                  onChange={(e) => handleInputChange('professionalInfo', 'ownTransport', e.target.checked)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Possuo transporte próprio</span>
              </label>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Disponibilidade</h4>
              <div className="space-y-3">
                {Object.entries(formData.professionalInfo.availability).map(([day, dayData]) => {
                  const dayNames = {
                    monday: 'Segunda',
                    tuesday: 'Terça',
                    wednesday: 'Quarta',
                    thursday: 'Quinta',
                    friday: 'Sexta',
                    saturday: 'Sábado',
                    sunday: 'Domingo'
                  };
                  
                  return (
                    <div key={day} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <label className="flex items-center space-x-2 min-w-24">
                        <input
                          type="checkbox"
                          checked={dayData.available}
                          onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                          className="w-4 h-4 text-primary-600"
                        />
                        <span className="text-sm font-medium">{dayNames[day]}</span>
                      </label>
                      
                      {dayData.available && (
                        <>
                          <div>
                            <label className="text-xs text-gray-600">Início</label>
                            <input
                              type="time"
                              value={dayData.start}
                              onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                              className="w-20 p-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600">Fim</label>
                            <input
                              type="time"
                              value={dayData.end}
                              onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                              className="w-20 p-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Documentos Necessários</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('profilePhoto', e.target.files[0])}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Formato: JPG, PNG. Máximo 2MB</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Documento de CPF *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('cpfDocument', e.target.files[0])}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Formato: JPG, PNG, PDF. Máximo 5MB</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Atestado de Antecedentes Criminais *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('criminalRecord', e.target.files[0])}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Formato: JPG, PNG, PDF. Máximo 5MB</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">📋 Documentos Necessários</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Foto de perfil profissional</li>
                <li>• Cópia do CPF (frente e verso)</li>
                <li>• Atestado de antecedentes criminais (emitido nos últimos 6 meses)</li>
                <li>• Referências profissionais (opcional)</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Localização</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-yellow-900 mb-2">📍 Por que precisamos da sua localização?</h4>
              <p className="text-sm text-yellow-800">
                Utilizamos sua localização para conectar você com clientes próximos, 
                otimizando o tempo de deslocamento e melhorando a eficiência do serviço.
              </p>
            </div>
            
            <div className="text-center">
              <button
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {locationLoading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Obtendo Localização...
                  </>
                ) : (
                  <>
                    📍 Obter Minha Localização
                  </>
                )}
              </button>
            </div>
            
            {formData.coordinates && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">✅ Localização Confirmada</h4>
                <p className="text-sm text-green-800">
                  Latitude: {formData.coordinates.lat.toFixed(4)}<br/>
                  Longitude: {formData.coordinates.lng.toFixed(4)}
                </p>
              </div>
            )}
            
            <div className="text-center text-sm text-gray-600">
              <p>Sua localização será usada apenas para otimização de rotas e não será compartilhada com terceiros.</p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Revisão da Solicitação</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Informações Pessoais</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><strong>Nome:</strong> {formData.personalInfo.fullName}</p>
                  <p><strong>Email:</strong> {formData.personalInfo.email}</p>
                  <p><strong>Telefone:</strong> {formData.personalInfo.phone}</p>
                  <p><strong>CPF:</strong> {formData.personalInfo.cpf}</p>
                  <p className="col-span-2"><strong>Endereço:</strong> {formData.personalInfo.address}, {formData.personalInfo.city} - {formData.personalInfo.state}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Informações Profissionais</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Especialidades:</strong> {formData.professionalInfo.specialties.join(', ')}</p>
                  <p><strong>Experiência:</strong> {formData.professionalInfo.experience}</p>
                  <p><strong>Raio de Atendimento:</strong> {formData.professionalInfo.serviceRadius} km</p>
                  <p><strong>Ferramentas Próprias:</strong> {formData.professionalInfo.ownTools ? 'Sim' : 'Não'}</p>
                  <p><strong>Transporte Próprio:</strong> {formData.professionalInfo.ownTransport ? 'Sim' : 'Não'}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Documentos</h4>
                <div className="text-sm space-y-1">
                  <p>✅ Foto de perfil enviada</p>
                  <p>✅ Documento de CPF enviado</p>
                  <p>✅ Atestado de antecedentes enviado</p>
                </div>
              </div>
              
              {formData.coordinates && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Localização</h4>
                  <p className="text-sm">✅ Localização confirmada</p>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">🔍 Próximos Passos</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Sua solicitação será analisada em até 48 horas</li>
                <li>2. Verificaremos seus documentos e referências</li>
                <li>3. Você receberá um email com o resultado</li>
                <li>4. Se aprovado, você poderá começar a receber solicitações de serviço</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Torne-se um Prestador de Serviços</h2>
          <p className="text-gray-600">Junte-se à nossa equipe e comece a ganhar dinheiro prestando serviços de limpeza</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.icon}
                </div>
                <span className="text-xs text-gray-600 mt-1 text-center max-w-20">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="min-h-96">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Próximo →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                'Enviar Solicitação'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BecomeProvider;
