
import React, { useState } from 'react';

const StaffManagement = () => {
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'Felipe Silva',
      email: 'felipe@agendaaqui.online',
      phone: '(31) 99888-7777',
      specialties: ['Limpeza Residencial', 'Limpeza Comercial'],
      region: 'Zona Sul',
      coordinates: { lat: -19.9191, lng: -43.9386 },
      status: 'ativo',
      rating: 4.8,
      completedServices: 145,
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      name: 'Ana Costa',
      email: 'ana@agendaaqui.online',
      phone: '(31) 99777-6666',
      specialties: ['Limpeza Pós-Obra', 'Limpeza Comercial'],
      region: 'Centro',
      coordinates: { lat: -19.9245, lng: -43.9352 },
      status: 'ativo',
      rating: 4.9,
      completedServices: 89,
      createdAt: '2024-01-15'
    },
    {
      id: 3,
      name: 'João Santos',
      email: 'joao@agendaaqui.online',
      phone: '(31) 99666-5555',
      specialties: ['Limpeza Residencial', 'Limpeza de Escritório'],
      region: 'Zona Norte',
      coordinates: { lat: -19.8157, lng: -43.9542 },
      status: 'ativo',
      rating: 4.7,
      completedServices: 203,
      createdAt: '2024-01-08'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('todas');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    specialties: [],
    region: '',
    coordinates: { lat: '', lng: '' },
    status: 'ativo'
  });

  const regions = ['Centro', 'Zona Sul', 'Zona Norte', 'Zona Leste', 'Zona Oeste'];
  const serviceTypes = ['Limpeza Residencial', 'Limpeza Comercial', 'Limpeza Pós-Obra', 'Limpeza de Escritório'];

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'todas' || member.region === filterRegion;
    const matchesStatus = filterStatus === 'todos' || member.status === filterStatus;
    
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const handleAddStaff = () => {
    const id = Math.max(...staff.map(s => s.id)) + 1;
    const staffMember = {
      ...newStaff,
      id,
      coordinates: {
        lat: parseFloat(newStaff.coordinates.lat),
        lng: parseFloat(newStaff.coordinates.lng)
      },
      rating: 0,
      completedServices: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setStaff([...staff, staffMember]);
    setNewStaff({
      name: '',
      email: '',
      phone: '',
      specialties: [],
      region: '',
      coordinates: { lat: '', lng: '' },
      status: 'ativo'
    });
    setShowAddModal(false);
  };

  const handleUpdateStaff = () => {
    setStaff(staff.map(member => 
      member.id === editingStaff.id ? editingStaff : member
    ));
    setEditingStaff(null);
  };

  const handleDeleteStaff = (staffId) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      setStaff(staff.filter(member => member.id !== staffId));
    }
  };

  const toggleSpecialty = (specialty, isEdit = false) => {
    const target = isEdit ? editingStaff : newStaff;
    const setter = isEdit ? setEditingStaff : setNewStaff;
    
    const currentSpecialties = target.specialties || [];
    const updatedSpecialties = currentSpecialties.includes(specialty)
      ? currentSpecialties.filter(s => s !== specialty)
      : [...currentSpecialties, specialty];
    
    setter({ ...target, specialties: updatedSpecialties });
  };

  const getStatusColor = (status) => {
    return status === 'ativo' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const StaffModal = ({ staffMember, isEdit = false, onSave, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {isEdit ? 'Editar Funcionário' : 'Adicionar Funcionário'}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={staffMember.name}
              onChange={(e) => {
                if (isEdit) {
                  setEditingStaff({ ...editingStaff, name: e.target.value });
                } else {
                  setNewStaff({ ...newStaff, name: e.target.value });
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={staffMember.email}
              onChange={(e) => {
                if (isEdit) {
                  setEditingStaff({ ...editingStaff, email: e.target.value });
                } else {
                  setNewStaff({ ...newStaff, email: e.target.value });
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              value={staffMember.phone}
              onChange={(e) => {
                if (isEdit) {
                  setEditingStaff({ ...editingStaff, phone: e.target.value });
                } else {
                  setNewStaff({ ...newStaff, phone: e.target.value });
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
            <select
              value={staffMember.region}
              onChange={(e) => {
                if (isEdit) {
                  setEditingStaff({ ...editingStaff, region: e.target.value });
                } else {
                  setNewStaff({ ...newStaff, region: e.target.value });
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Selecione uma região</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={staffMember.coordinates.lat}
              onChange={(e) => {
                if (isEdit) {
                  setEditingStaff({ 
                    ...editingStaff, 
                    coordinates: { ...editingStaff.coordinates, lat: e.target.value }
                  });
                } else {
                  setNewStaff({ 
                    ...newStaff, 
                    coordinates: { ...newStaff.coordinates, lat: e.target.value }
                  });
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={staffMember.coordinates.lng}
              onChange={(e) => {
                if (isEdit) {
                  setEditingStaff({ 
                    ...editingStaff, 
                    coordinates: { ...editingStaff.coordinates, lng: e.target.value }
                  });
                } else {
                  setNewStaff({ 
                    ...newStaff, 
                    coordinates: { ...newStaff.coordinates, lng: e.target.value }
                  });
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label>
          <div className="grid grid-cols-2 gap-2">
            {serviceTypes.map(service => (
              <label key={service} className="flex items-center">
                <input
                  type="checkbox"
                  checked={staffMember.specialties?.includes(service) || false}
                  onChange={() => toggleSpecialty(service, isEdit)}
                  className="mr-2"
                />
                {service}
              </label>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={staffMember.status}
            onChange={(e) => {
              if (isEdit) {
                setEditingStaff({ ...editingStaff, status: e.target.value });
              } else {
                setNewStaff({ ...newStaff, status: e.target.value });
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
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
          <h2 className="text-3xl font-bold text-gray-900">Gestão de Funcionários</h2>
          <p className="text-gray-600 mt-1">Gerencie a equipe de prestadores de serviço</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Adicionar Funcionário
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              placeholder="Nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="todas">Todas</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
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
                setFilterRegion('todas');
                setFilterStatus('todos');
              }}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p><strong>Email:</strong> {member.email}</p>
              <p><strong>Telefone:</strong> {member.phone}</p>
              <p><strong>Região:</strong> {member.region}</p>
              <p><strong>Avaliação:</strong> ⭐ {member.rating}/5</p>
              <p><strong>Serviços:</strong> {member.completedServices}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Especialidades:</p>
              <div className="flex flex-wrap gap-1">
                {member.specialties.map((specialty, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingStaff(member)}
                className="flex-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteStaff(member.id)}
                className="flex-1 text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum funcionário encontrado com os filtros aplicados.</p>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <StaffModal
          staffMember={newStaff}
          onSave={handleAddStaff}
          onClose={() => {
            setShowAddModal(false);
            setNewStaff({
              name: '',
              email: '',
              phone: '',
              specialties: [],
              region: '',
              coordinates: { lat: '', lng: '' },
              status: 'ativo'
            });
          }}
        />
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <StaffModal
          staffMember={editingStaff}
          isEdit={true}
          onSave={handleUpdateStaff}
          onClose={() => setEditingStaff(null)}
        />
      )}
    </div>
  );
};

export default StaffManagement;
