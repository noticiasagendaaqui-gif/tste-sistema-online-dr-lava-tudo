
import React, { useState, useEffect } from 'react';
import coverageService from '../../services/coverageService';

const CoverageManagement = () => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newArea, setNewArea] = useState({
    name: '',
    type: 'city',
    status: 'active',
    region: 'Vetor Norte',
    coordinates: { lat: '', lng: '' },
    radius: '',
    neighborhoods: []
  });
  const [testLocation, setTestLocation] = useState({ lat: '', lng: '', cep: '' });
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = () => {
    setAreas(coverageService.getAllAreas());
  };

  const handleSaveArea = () => {
    if (selectedArea) {
      coverageService.updateCoverageArea(selectedArea.id, newArea);
    } else {
      coverageService.addCoverageArea({
        ...newArea,
        coordinates: {
          lat: parseFloat(newArea.coordinates.lat),
          lng: parseFloat(newArea.coordinates.lng)
        },
        radius: parseFloat(newArea.radius)
      });
    }
    
    loadAreas();
    setShowModal(false);
    setSelectedArea(null);
    setNewArea({
      name: '',
      type: 'city',
      status: 'active',
      region: 'Vetor Norte',
      coordinates: { lat: '', lng: '' },
      radius: '',
      neighborhoods: []
    });
  };

  const handleEditArea = (area) => {
    setSelectedArea(area);
    setNewArea({
      ...area,
      coordinates: {
        lat: area.coordinates.lat.toString(),
        lng: area.coordinates.lng.toString()
      },
      radius: area.radius.toString()
    });
    setShowModal(true);
  };

  const handleDeleteArea = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta área?')) {
      coverageService.deleteCoverageArea(id);
      loadAreas();
    }
  };

  const testCoverage = () => {
    if (testLocation.cep) {
      const result = coverageService.checkCoverageByZip(testLocation.cep);
      setTestResult({ type: 'cep', result });
    } else if (testLocation.lat && testLocation.lng) {
      const result = coverageService.checkCoverage(
        parseFloat(testLocation.lat),
        parseFloat(testLocation.lng)
      );
      setTestResult({ type: 'coords', result });
    }
  };

  const expansionData = coverageService.getExpansionMessage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestão de Cobertura</h2>
          <p className="text-gray-600 mt-1">Gerencie áreas de atendimento e expansão</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Adicionar Área
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Total de Áreas</p>
          <p className="text-2xl font-bold text-gray-900">{areas.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Áreas Ativas</p>
          <p className="text-2xl font-bold text-green-600">
            {areas.filter(a => a.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Região Principal</p>
          <p className="text-lg font-bold text-blue-600">Vetor Norte BH</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Próxima Expansão</p>
          <p className="text-lg font-bold text-purple-600">Grande BH</p>
        </div>
      </div>

      {/* Teste de Cobertura */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Teste de Cobertura</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
            <input
              type="text"
              placeholder="00000-000"
              value={testLocation.cep}
              onChange={(e) => setTestLocation(prev => ({ ...prev, cep: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              placeholder="-19.9191"
              value={testLocation.lat}
              onChange={(e) => setTestLocation(prev => ({ ...prev, lat: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              placeholder="-43.9386"
              value={testLocation.lng}
              onChange={(e) => setTestLocation(prev => ({ ...prev, lng: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={testCoverage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Testar Cobertura
        </button>

        {testResult && (
          <div className={`mt-4 p-4 rounded-lg ${
            testResult.result.covered ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
          }`}>
            <div className={`font-medium ${testResult.result.covered ? 'text-green-800' : 'text-red-800'}`}>
              {testResult.result.covered ? '✓ Área Coberta' : '✗ Área Não Coberta'}
            </div>
            <div className="text-sm mt-1">
              {testResult.result.covered ? (
                <span>Cidade: {testResult.result.city} - Região: {testResult.result.region}</span>
              ) : (
                <span>{testResult.result.message}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Plano de Expansão */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Plano de Expansão</h3>
        <div className="space-y-3">
          {expansionData.regions.map((region, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-900">{region.name}</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  region.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {region.status === 'active' ? 'Ativo' : 'Planejado'}
                </span>
              </div>
              <span className="text-sm text-gray-600">{region.eta}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Áreas */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Áreas de Cobertura</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Cidade</th>
                  <th className="text-left py-3 px-4">Região</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Raio (km)</th>
                  <th className="text-left py-3 px-4">Coordenadas</th>
                  <th className="text-left py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((area) => (
                  <tr key={area.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{area.name}</td>
                    <td className="py-3 px-4">{area.region}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        area.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {area.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{area.radius}</td>
                    <td className="py-3 px-4 text-sm">
                      {area.coordinates.lat.toFixed(4)}, {area.coordinates.lng.toFixed(4)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditArea(area)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteArea(area.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Adicionar/Editar Área */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {selectedArea ? 'Editar Área' : 'Adicionar Área'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Cidade</label>
                <input
                  type="text"
                  value={newArea.name}
                  onChange={(e) => setNewArea(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
                <select
                  value={newArea.region}
                  onChange={(e) => setNewArea(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Vetor Norte">Vetor Norte</option>
                  <option value="Grande BH">Grande BH</option>
                  <option value="Interior MG">Interior MG</option>
                  <option value="Outros Estados">Outros Estados</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={newArea.coordinates.lat}
                    onChange={(e) => setNewArea(prev => ({ 
                      ...prev, 
                      coordinates: { ...prev.coordinates, lat: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={newArea.coordinates.lng}
                    onChange={(e) => setNewArea(prev => ({ 
                      ...prev, 
                      coordinates: { ...prev.coordinates, lng: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raio de Cobertura (km)</label>
                <input
                  type="number"
                  value={newArea.radius}
                  onChange={(e) => setNewArea(prev => ({ ...prev, radius: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newArea.status}
                  onChange={(e) => setNewArea(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSaveArea}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                {selectedArea ? 'Atualizar' : 'Adicionar'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedArea(null);
                  setNewArea({
                    name: '',
                    type: 'city',
                    status: 'active',
                    region: 'Vetor Norte',
                    coordinates: { lat: '', lng: '' },
                    radius: '',
                    neighborhoods: []
                  });
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverageManagement;
