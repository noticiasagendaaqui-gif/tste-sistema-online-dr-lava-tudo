
import React, { useState, useEffect } from 'react';
import { useEmail } from '../../hooks/useEmail';

const ProviderApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const { sendEmail } = useEmail();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    const storedApplications = JSON.parse(localStorage.getItem('providerApplications') || '[]');
    setApplications(storedApplications);
  };

  const updateApplicationStatus = async (applicationId, status, observations = '') => {
    const updatedApplications = applications.map(app => 
      app.id === applicationId 
        ? { ...app, status, observations, reviewedAt: new Date().toISOString() }
        : app
    );
    
    setApplications(updatedApplications);
    localStorage.setItem('providerApplications', JSON.stringify(updatedApplications));

    const application = applications.find(app => app.id === applicationId);
    
    if (status === 'aprovado') {
      // Adicionar ao staff
      const staffData = JSON.parse(localStorage.getItem('staffData') || '{"staff": [], "assignments": []}');
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
        providerData: application
      };
      
      staffData.staff.push(newStaff);
      localStorage.setItem('staffData', JSON.stringify(staffData));

      // Enviar email de aprovação
      await sendEmail(
        application.personalInfo.email,
        'Parabéns! Sua solicitação foi aprovada - AgendaAqui',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5;">AgendaAqui</h1>
            <h2 style="color: #10B981;">Bem-vindo à Equipe!</h2>
          </div>
          
          <div style="background-color: #f0fdf4; border: 2px solid #10B981; padding: 25px; border-radius: 10px;">
            <p style="color: #065f46; font-size: 18px; margin-top: 0;">
              Parabéns <strong>${application.personalInfo.fullName}</strong>!
            </p>
            <p style="color: #065f46; font-size: 16px; line-height: 1.6;">
              Sua solicitação para se tornar um prestador de serviços da AgendaAqui foi aprovada!
            </p>
            <p style="color: #065f46; font-size: 16px; line-height: 1.6;">
              Você já pode começar a receber solicitações de serviços. Nossa equipe entrará em contato 
              com mais detalhes sobre o processo.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              Bem-vindo à família AgendaAqui!<br>
              Equipe AgendaAqui
            </p>
          </div>
        </div>
        `
      );
    } else if (status === 'rejeitado') {
      // Enviar email de rejeição
      await sendEmail(
        application.personalInfo.email,
        'Solicitação de Prestador - AgendaAqui',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5;">AgendaAqui</h1>
            <h2 style="color: #EF4444;">Solicitação Não Aprovada</h2>
          </div>
          
          <div style="background-color: #fef2f2; border: 2px solid #EF4444; padding: 25px; border-radius: 10px;">
            <p style="color: #7f1d1d; font-size: 18px; margin-top: 0;">
              Olá <strong>${application.personalInfo.fullName}</strong>,
            </p>
            <p style="color: #7f1d1d; font-size: 16px; line-height: 1.6;">
              Infelizmente, sua solicitação para se tornar prestador de serviços não foi aprovada neste momento.
            </p>
            ${observations ? `<p style="color: #7f1d1d; font-size: 16px;"><strong>Observações:</strong> ${observations}</p>` : ''}
            <p style="color: #7f1d1d; font-size: 16px; line-height: 1.6;">
              Você pode tentar novamente no futuro ou entrar em contato conosco para mais informações.
            </p>
          </div>
        </div>
        `
      );
    }

    setShowDetails(false);
    setSelectedApplication(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente_aprovacao': return 'bg-yellow-100 text-yellow-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'todos') return true;
    return app.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Solicitações de Prestadores</h2>
          <p className="text-gray-600">Gerencie as solicitações para se tornar prestador de serviços</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="todos">Todos</option>
            <option value="pendente_aprovacao">Pendente</option>
            <option value="aprovado">Aprovado</option>
            <option value="rejeitado">Rejeitado</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600">⏳</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'pendente_aprovacao').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Aprovados</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'aprovado').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-red-600">❌</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Rejeitados</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'rejeitado').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600">📊</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidades
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experiência
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.personalInfo.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.personalInfo.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.personalInfo.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {application.professionalInfo.specialties.slice(0, 2).map((specialty, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">
                          {specialty}
                        </span>
                      ))}
                      {application.professionalInfo.specialties.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{application.professionalInfo.specialties.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.professionalInfo.experience}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.personalInfo.city}, {application.personalInfo.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                      {application.status === 'pendente_aprovacao' ? 'Pendente' : 
                       application.status === 'aprovado' ? 'Aprovado' :
                       application.status === 'rejeitado' ? 'Rejeitado' : application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.appliedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowDetails(true);
                      }}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma solicitação encontrada.</p>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showDetails && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Detalhes da Solicitação - {selectedApplication.personalInfo.fullName}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações Pessoais */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Informações Pessoais</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <p><strong>Nome:</strong> {selectedApplication.personalInfo.fullName}</p>
                    <p><strong>Email:</strong> {selectedApplication.personalInfo.email}</p>
                    <p><strong>Telefone:</strong> {selectedApplication.personalInfo.phone}</p>
                    <p><strong>CPF:</strong> {selectedApplication.personalInfo.cpf}</p>
                    <p><strong>RG:</strong> {selectedApplication.personalInfo.rg}</p>
                    <p><strong>Data de Nascimento:</strong> {new Date(selectedApplication.personalInfo.birthDate).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Endereço:</strong> {selectedApplication.personalInfo.address}</p>
                    <p><strong>Cidade:</strong> {selectedApplication.personalInfo.city} - {selectedApplication.personalInfo.state}</p>
                  </div>
                </div>

                {/* Informações Profissionais */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Informações Profissionais</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <p><strong>Especialidades:</strong></p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {selectedApplication.professionalInfo.specialties.map((specialty, index) => (
                        <span key={index} className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <p><strong>Experiência:</strong> {selectedApplication.professionalInfo.experience}</p>
                    <p><strong>Raio de Atendimento:</strong> {selectedApplication.professionalInfo.serviceRadius} km</p>
                    <p><strong>Ferramentas Próprias:</strong> {selectedApplication.professionalInfo.ownTools ? 'Sim' : 'Não'}</p>
                    <p><strong>Transporte Próprio:</strong> {selectedApplication.professionalInfo.ownTransport ? 'Sim' : 'Não'}</p>
                    {selectedApplication.professionalInfo.expectedPrice && (
                      <p><strong>Preço Esperado/Hora:</strong> R$ {selectedApplication.professionalInfo.expectedPrice}</p>
                    )}
                  </div>
                </div>

                {/* Disponibilidade */}
                <div className="col-span-1 md:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-3">Disponibilidade</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {Object.entries(selectedApplication.professionalInfo.availability).map(([day, data]) => {
                        const dayNames = {
                          monday: 'Segunda', tuesday: 'Terça', wednesday: 'Quarta',
                          thursday: 'Quinta', friday: 'Sexta', saturday: 'Sábado', sunday: 'Domingo'
                        };
                        
                        return (
                          <div key={day} className="text-center">
                            <p className="font-medium">{dayNames[day]}</p>
                            {data.available ? (
                              <p className="text-green-600">{data.start} - {data.end}</p>
                            ) : (
                              <p className="text-red-600">Indisponível</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Localização */}
                {selectedApplication.coordinates && (
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-3">Localização</h4>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm">
                      <p><strong>Coordenadas:</strong> {selectedApplication.coordinates.lat.toFixed(4)}, {selectedApplication.coordinates.lng.toFixed(4)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedApplication.status === 'pendente_aprovacao' && (
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'rejeitado')}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Rejeitar
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'aprovado')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Aprovar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderApplications;
