
import React, { useState, useEffect } from 'react';
import coverageService from '../../services/coverageService';

const ExpansionManagement = () => {
  const [expansionPlan, setExpansionPlan] = useState(null);
  const [waitlist, setWaitlist] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  useEffect(() => {
    loadExpansionData();
  }, []);

  const loadExpansionData = () => {
    setExpansionPlan(coverageService.getExpansionPlan());
    setWaitlist(coverageService.getWaitlist());
  };

  const handlePhaseUpdate = (phase, newStatus) => {
    coverageService.updateExpansionStatus(phase, newStatus);
    loadExpansionData();
  };

  const handleNotifyCity = (city) => {
    const notifiedCount = coverageService.notifyWaitlistForCity(city);
    alert(`${notifiedCount} pessoas foram notificadas sobre a expansão para ${city}`);
    loadExpansionData();
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'planned': 'bg-blue-100 text-blue-800',
      'research': 'bg-yellow-100 text-yellow-800',
      'delayed': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'active': 'Ativo',
      'planned': 'Planejado',
      'research': 'Pesquisa',
      'delayed': 'Adiado'
    };
    return texts[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestão de Expansão</h2>
          <p className="text-gray-600 mt-1">Planeje e gerencie a expansão para novas regiões</p>
        </div>
        <button
          onClick={() => setShowWaitlistModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Ver Lista de Espera
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Total na Lista de Espera</p>
          <p className="text-2xl font-bold text-blue-600">{waitlist.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Cidades Solicitadas</p>
          <p className="text-2xl font-bold text-purple-600">
            {expansionPlan ? Object.keys(expansionPlan.demandByCity).length : 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Próxima Expansão</p>
          <p className="text-lg font-bold text-green-600">
            {expansionPlan?.nextExpansionTargets?.[0]?.city || 'N/A'}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Fases Planejadas</p>
          <p className="text-2xl font-bold text-orange-600">4</p>
        </div>
      </div>

      {/* Fases de Expansão */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Fases de Expansão</h3>
        <div className="space-y-4">
          {Object.entries(coverageService.getExpansionPhases()).map(([phaseKey, phase]) => (
            <div key={phaseKey} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{phase.name}</h4>
                  <p className="text-sm text-gray-600">ETA: {phase.eta}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(phase.status)}`}>
                    {getStatusText(phase.status)}
                  </span>
                  <select
                    value={phase.status}
                    onChange={(e) => handlePhaseUpdate(phaseKey, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="research">Pesquisa</option>
                    <option value="planned">Planejado</option>
                    <option value="active">Ativo</option>
                    <option value="delayed">Adiado</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {phase.cities.map(city => {
                  const cityDemand = expansionPlan?.demandByCity?.[city];
                  return (
                    <span
                      key={city}
                      className={`px-2 py-1 text-xs rounded-full border ${
                        cityDemand 
                          ? 'bg-blue-50 border-blue-200 text-blue-800' 
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      {city} {cityDemand && `(${cityDemand.count})`}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Próximos Alvos de Expansão */}
      {expansionPlan?.nextExpansionTargets && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Próximos Alvos de Expansão</h3>
          <div className="space-y-3">
            {expansionPlan.nextExpansionTargets.map((target, index) => (
              <div key={target.city} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-medium text-gray-900">{target.city}</span>
                    <div className="text-xs text-gray-600">
                      Demanda: {target.demand} • Prioridade: {target.priority} • Score: {target.score.toFixed(2)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleNotifyCity(target.city)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Notificar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal da Lista de Espera */}
      {showWaitlistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Lista de Espera para Expansão</h3>
              <button
                onClick={() => setShowWaitlistModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Nome</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Cidade</th>
                    <th className="text-left py-2">CEP</th>
                    <th className="text-left py-2">Prioridade</th>
                    <th className="text-left py-2">Data</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((entry) => (
                    <tr key={entry.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{entry.name || 'N/A'}</td>
                      <td className="py-2">{entry.email}</td>
                      <td className="py-2">{entry.city}</td>
                      <td className="py-2">{entry.cep}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          entry.priority === 1 ? 'bg-red-100 text-red-800' :
                          entry.priority === 2 ? 'bg-orange-100 text-orange-800' :
                          entry.priority === 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.priority === 1 ? 'Alta' :
                           entry.priority === 2 ? 'Média' :
                           entry.priority === 3 ? 'Normal' : 'Baixa'}
                        </span>
                      </td>
                      <td className="py-2">
                        {new Date(entry.requestedAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          entry.notified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.notified ? 'Notificado' : 'Aguardando'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpansionManagement;
