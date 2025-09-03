
import React, { useState } from 'react';

const ServiceManagement = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Limpeza Residencial',
      description: 'Limpeza completa de residências incluindo todos os cômodos',
      category: 'Residencial',
      basePrice: 150,
      duration: 4,
      status: 'ativo',
      features: ['Limpeza de todos os cômodos', 'Produtos inclusos', 'Equipe qualificada'],
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Limpeza Pós-Obra',
      description: 'Limpeza especializada para imóveis após reforma ou construção',
      category: 'Especializada',
      basePrice: 320,
      duration: 8,
      status: 'ativo',
      features: ['Remoção de entulho leve', 'Limpeza profunda', 'Equipamentos especializados'],
      createdAt: '2024-01-01'
    },
    {
      id: 3,
      name: 'Limpeza de Escritório',
      description: 'Serviço de limpeza para ambientes corporativos',
      category: 'Comercial',
      basePrice: 280,
      duration: 6,
      status: 'ativo',
      features: ['Limpeza de estações de trabalho', 'Sanitização', 'Limpeza de vidros'],
      createdAt: '2024-01-01'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todas');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: 'Residencial',
    basePrice: '',
    duration: '',
    status: 'ativo',
    features: ['']
  });

  const categories = ['Residencial', 'Comercial', 'Especializada', 'Industrial'];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'todas' || service.category === filterCategory;
    const matchesStatus = filterStatus === 'todos' || service.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddService = () => {
    const id = Math.max(...services.map(s => s.id)) + 1;
    const service = {
      ...newService,
      id,
      basePrice: parseFloat(newService.basePrice),
      duration: parseInt(newService.duration),
      features: newService.features.filter(feature => feature.trim() !== ''),
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setServices([...services, service]);
    setNewService({
      name: '',
      description: '',
      category: 'Residencial',
      basePrice: '',
      duration: '',
      status: 'ativo',
      features: ['']
    });
    setShowAddModal(false);
  };

  const handleUpdateService = () => {
    const updatedService = {
      ...editingService,
      basePrice: parseFloat(editingService.basePrice),
      duration: parseInt(editingService.duration),
      features: editingService.features.filter(feature => feature.trim() !== '')
    };
    
    setServices(services.map(service => 
      service.id === editingService.id ? updatedService : service
    ));
    setEditingService(null);
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      setServices(services.filter(service => service.id !== serviceId));
    }
  };

  const addFeature = (service, setService) => {
    setService({
      ...service,
      features: [...service.features, '']
    });
  };

  const updateFeature = (service, setService, index, value) => {
    const updatedFeatures = [...service.features];
    updatedFeatures[index] = value;
    setService({
      ...service,
      features: updatedFeatures
    });
  };

  const removeFeature = (service, setService, index) => {
    setService({
      ...service,
      features: service.features.filter((_, i) => i !== index)
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Residencial': return 'bg-green-100 text-green-800';
      case 'Comercial': return 'bg-blue-100 text-blue-800';
      case 'Especializada': return 'bg-purple-100 text-purple-800';
      case 'Industrial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'ativo' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const ServiceModal = ({ service, isEdit = false, onSave, onClose, setService }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {isEdit ? 'Editar Serviço' : 'Adicionar Serviço'}
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Serviço</label>
              <input
                type="text"
                value={service.name}
                onChange={(e) => setService({ ...service, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={service.category}
                onChange={(e) => setService({ ...service, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={service.description}
              onChange={(e) => setService({ ...service, description: e.target.value })}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço Base (R$)</label>
              <input
                type="number"
                value={service.basePrice}
                onChange={(e) => setService({ ...service, basePrice: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duração (horas)</label>
              <input
                type="number"
                value={service.duration}
                onChange={(e) => setService({ ...service, duration: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={service.status}
                onChange={(e) => setService({ ...service, status: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Características</label>
            {service.features.map((feature, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(service, setService, index, e.target.value)}
                  placeholder="Digite uma característica"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(service, setService, index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addFeature(service, setService)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              + Adicionar Característica
            </button>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onSave}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {isEdit ? 'Atualizar' : 'Adicionar'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestão de Serviços</h2>
          <p className="text-gray-600 mt-1">Gerencie todos os serviços oferecidos</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Adicionar Serviço
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Total de Serviços</p>
          <p className="text-2xl font-bold text-gray-900">{services.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Serviços Ativos</p>
          <p className="text-2xl font-bold text-green-600">
            {services.filter(s => s.status === 'ativo').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Preço Médio</p>
          <p className="text-2xl font-bold text-blue-600">
            R$ {Math.round(services.reduce((acc, s) => acc + s.basePrice, 0) / services.length)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-600">Categorias</p>
          <p className="text-2xl font-bold text-purple-600">
            {new Set(services.map(s => s.category)).size}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              placeholder="Nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="todas">Todas</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="todos">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('todas');
                setFilterStatus('todos');
              }}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(service.category)}`}>
                    {service.category}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Preço Base</p>
                  <p className="text-lg font-bold text-gray-900">R$ {service.basePrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duração</p>
                  <p className="text-lg font-bold text-gray-900">{service.duration}h</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Características:</p>
                <ul className="text-sm text-gray-600">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1 h-1 bg-primary-600 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                  {service.features.length > 3 && (
                    <li className="text-primary-600">+{service.features.length - 3} mais...</li>
                  )}
                </ul>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingService(service)}
                  className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum serviço encontrado com os filtros aplicados.</p>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddModal && (
        <ServiceModal
          service={newService}
          onSave={handleAddService}
          onClose={() => {
            setShowAddModal(false);
            setNewService({
              name: '',
              description: '',
              category: 'Residencial',
              basePrice: '',
              duration: '',
              status: 'ativo',
              features: ['']
            });
          }}
          setService={setNewService}
        />
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <ServiceModal
          service={editingService}
          isEdit={true}
          onSave={handleUpdateService}
          onClose={() => setEditingService(null)}
          setService={setEditingService}
        />
      )}
    </div>
  );
};

export default ServiceManagement;
