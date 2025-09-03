import React, { useState, useEffect } from 'react';

// Mock staffService - replace with your actual service implementation
const staffService = {
  staff: [
    { id: 1, name: 'Felipe Silva', email: 'felipe.silva@example.com', phone: '11987654321', region: 'Centro', rating: 4.8, completedServices: 50, specialties: ['Limpeza Residencial', 'Limpeza Pós-Obra'], status: 'ativo' },
    { id: 2, name: 'Ana Souza', email: 'ana.souza@example.com', phone: '11912345678', region: 'Zona Sul', rating: 4.5, completedServices: 35, specialties: ['Limpeza de Escritório', 'Limpeza Residencial'], status: 'ativo' },
    { id: 3, name: 'Carlos Pereira', email: 'carlos.pereira@example.com', phone: '11999887766', region: 'Zona Leste', rating: 4.7, completedServices: 60, specialties: ['Limpeza Industrial', 'Limpeza Pós-Obra'], status: 'ativo' },
    { id: 4, name: 'Mariana Lima', email: 'mariana.lima@example.com', phone: '11988776655', region: 'Zona Oeste', rating: 4.6, completedServices: 45, specialties: ['Limpeza Residencial', 'Limpeza de Escritório'], status: 'inativo' }
  ],
  assignments: [
    { id: 101, serviceId: 1, staffId: 1, staffName: 'Felipe Silva', staffEmail: 'felipe.silva@example.com', staffPhone: '11987654321', serviceData: {}, assignedAt: '2024-01-20T10:00:00Z', status: 'atribuido' }
  ],
  getStaff: () => staffService.staff,
  getAssignments: () => staffService.assignments,
  assignStaffToService: async (serviceId, serviceData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const availableStaff = staffService.staff.filter(s => s.status === 'ativo' && s.specialties.includes(serviceData.service));
    if (!availableStaff.length) throw new Error('Nenhum funcionário ativo encontrado para este serviço.');

    // Simple logic: assign the first available staff member
    const assignedStaff = availableStaff[0];
    const newAssignment = {
      id: Date.now(),
      serviceId: serviceId,
      staffId: assignedStaff.id,
      staffName: assignedStaff.name,
      staffEmail: assignedStaff.email,
      staffPhone: assignedStaff.phone,
      serviceData,
      assignedAt: new Date().toISOString(),
      status: 'atribuido'
    };
    staffService.assignments.push(newAssignment);

    // Simulate email notification
    console.log(`Email sent to client: ${serviceData.clientEmail} about ${assignedStaff.name}`);
    console.log(`Email sent to staff: ${assignedStaff.email} about service ${serviceId}`);

    return { ...assignedStaff, ...newAssignment };
  },
  findBestStaff: async (service, address, date, time) => {
    // Simulate API call to find the best staff based on proximity, rating, availability etc.
    await new Promise(resolve => setTimeout(resolve, 500));
    const availableStaff = staffService.staff.filter(s => 
      s.status === 'ativo' && s.specialties.includes(service)
    );
    // For simplicity, return the first available staff if any
    return availableStaff.length > 0 ? availableStaff[0] : null;
  },
  sendAssignmentNotifications: async (assignment) => {
    // Simulate sending email notifications
    console.log(`Notification email sent to client: ${assignment.serviceData.clientEmail} for ${assignment.staffName}`);
    console.log(`Notification email sent to staff: ${assignment.staffEmail} for service ID: ${assignment.serviceId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};

// Mock BookingModal component - replace with your actual component
const BookingModal = ({ booking, isEdit, onSave, onClose }) => {
  const [editedBooking, setEditedBooking] = useState(booking);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">{isEdit ? 'Editar Agendamento' : 'Detalhes do Agendamento'} #{booking.id}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Informações do Cliente</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Nome:</strong> {editedBooking.client}</p>
                <p><strong>Email:</strong> {editedBooking.clientEmail}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Serviço</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Tipo:</strong> {editedBooking.service}</p>
                <p><strong>Valor:</strong> R$ {editedBooking.value}</p>
              </div>
            </div>

            {isEdit && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                <select
                  name="status"
                  value={editedBooking.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="agendado">Agendado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Agendamento</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Data:</strong> {new Date(editedBooking.date).toLocaleDateString('pt-BR')}</p>
                <p><strong>Horário:</strong> {editedBooking.time}</p>
                <p><strong>Criado em:</strong> {new Date(editedBooking.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Endereço</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p>{editedBooking.address}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p>{editedBooking.observations || 'Nenhuma observação'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          {isEdit && (
            <button
              onClick={handleSave}
              className="bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Salvar Alterações
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Imprimir
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};


const BookingManagement = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      client: 'Maria Silva',
      clientEmail: 'maria@email.com',
      service: 'Limpeza Residencial',
      date: '2024-01-22',
      time: '14:00',
      address: 'Rua das Flores, 123 - São Paulo',
      status: 'confirmado',
      value: 150,
      observations: 'Apartamento de 2 quartos',
      createdAt: '2024-01-20',
      assignedStaff: null
    },
    {
      id: 2,
      client: 'João Santos',
      clientEmail: 'joao@email.com',
      service: 'Limpeza Pós-Obra',
      date: '2024-01-23',
      time: '09:00',
      address: 'Av. Paulista, 456 - São Paulo',
      status: 'pendente',
      value: 320,
      observations: 'Casa recém construída',
      createdAt: '2024-01-20',
      assignedStaff: null
    },
    {
      id: 3,
      client: 'Ana Costa',
      clientEmail: 'ana@email.com',
      service: 'Limpeza de Escritório',
      date: '2024-01-24',
      time: '18:00',
      address: 'Rua Augusta, 789 - São Paulo',
      status: 'em_andamento',
      value: 280,
      observations: 'Escritório com 5 salas',
      createdAt: '2024-01-19',
      assignedStaff: null
    }
  ]);

  const [assignments, setAssignments] = useState([]);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterDate, setFilterDate] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);

  const statusOptions = [
    { value: 'pendente', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmado', label: 'Confirmado', color: 'bg-green-100 text-green-800' },
    { value: 'em_andamento', label: 'Em Andamento', color: 'bg-blue-100 text-blue-800' },
    { value: 'concluido', label: 'Concluído', color: 'bg-purple-100 text-purple-800' },
    { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || booking.status === filterStatus;
    const matchesDate = !filterDate || booking.date === filterDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.label : status;
  };

  const BookingDetailsModal = ({ booking, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Detalhes do Agendamento #{booking.id}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Informações do Cliente</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Nome:</strong> {booking.client}</p>
                <p><strong>Email:</strong> {booking.clientEmail}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Serviço</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Tipo:</strong> {booking.service}</p>
                <p><strong>Valor:</strong> R$ {booking.value}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Status</h4>
              <select
                value={booking.status}
                onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Agendamento</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Data:</strong> {new Date(booking.date).toLocaleDateString('pt-BR')}</p>
                <p><strong>Horário:</strong> {booking.time}</p>
                <p><strong>Criado em:</strong> {new Date(booking.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Endereço</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p>{booking.address}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p>{booking.observations || 'Nenhuma observação'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Imprimir
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    }
  };

  const handleUpdateBooking = (updatedBooking) => {
    setBookings(bookings.map(booking =>
      booking.id === updatedBooking.id ? updatedBooking : booking
    ));
    setEditingBooking(null);
  };

  const handleAutoAssignStaff = async (booking) => {
    try {
      const serviceData = {
        service: booking.service,
        address: booking.address,
        date: booking.date,
        time: booking.time,
        clientName: booking.client,
        clientEmail: booking.clientEmail || '', // Use clientEmail from booking
        clientPhone: booking.clientPhone || '', // Assuming booking might have phone, if not, adjust
        observations: booking.observations,
        value: booking.value
      };

      const assignment = await staffService.assignStaffToService(booking.id, serviceData);

      // Atualizar status do agendamento
      setBookings(bookings.map(b =>
        b.id === booking.id
          ? { ...b, status: 'confirmado', assignedStaff: assignment.staffName }
          : b
      ));

      loadAssignments();
      alert(`Funcionário ${assignment.staffName} atribuído com sucesso! Emails de notificação foram enviados.`);
    } catch (error) {
      alert(`Erro ao atribuir funcionário: ${error.message}`);
    }
  };

  const handleManualAssignStaff = async (booking) => {
    try {
      const bestStaff = await staffService.findBestStaff(
        booking.service,
        booking.address,
        booking.date,
        booking.time
      );

      if (bestStaff) {
        const allStaff = staffService.getStaff();
        const availableForService = allStaff.filter(staff =>
          staff.status === 'ativo' && staff.specialties.includes(booking.service)
        );
        setAvailableStaff(availableForService);
        setSelectedBooking(booking);
        setShowAssignModal(true);
      } else {
        alert('Nenhum funcionário disponível para este serviço');
      }
    } catch (error) {
      alert(`Erro ao buscar funcionários: ${error.message}`);
    }
  };

  const confirmManualAssignment = async (staffId) => {
    try {
      const serviceData = {
        service: selectedBooking.service,
        address: selectedBooking.address,
        date: selectedBooking.date,
        time: selectedBooking.time,
        clientName: selectedBooking.client,
        clientEmail: selectedBooking.clientEmail || '', // Use clientEmail from selectedBooking
        clientPhone: selectedBooking.clientPhone || '',
        observations: selectedBooking.observations,
        value: selectedBooking.value
      };

      const selectedStaff = availableStaff.find(s => s.id === staffId);

      // Criar atribuição manual
      const assignment = {
        id: Date.now(),
        serviceId: selectedBooking.id,
        staffId: staffId,
        staffName: selectedStaff.name,
        staffEmail: selectedStaff.email,
        staffPhone: selectedStaff.phone,
        serviceData,
        assignedAt: new Date().toISOString(),
        status: 'atribuido'
      };

      // Salvar e notificar
      await staffService.sendAssignmentNotifications(assignment);

      // Atualizar agendamento
      setBookings(bookings.map(b =>
        b.id === selectedBooking.id
          ? { ...b, status: 'confirmado', assignedStaff: selectedStaff.name }
          : b
      ));

      setShowAssignModal(false);
      loadAssignments();
      alert(`Funcionário ${selectedStaff.name} atribuído com sucesso!`);
    } catch (error) {
      alert(`Erro ao atribuir funcionário: ${error.message}`);
    }
  };

  const getAssignedStaff = (bookingId) => {
    const assignment = assignments.find(a => a.serviceId === bookingId);
    return assignment ? assignment.staffName : null;
  };

  // Load assignments on component mount
  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = () => {
    const staffAssignments = staffService.getAssignments();
    setAssignments(staffAssignments);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Gestão de Agendamentos</h2>
        <p className="text-gray-600 mt-1">Gerencie todos os agendamentos do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statusOptions.map(status => {
          const count = bookings.filter(b => b.status === status.value).length;
          return (
            <div key={status.value} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{status.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              placeholder="Cliente ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="todos">Todos</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('todos');
                setFilterDate('');
              }}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Funcionário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.client}</div>
                    <div className="text-sm text-gray-500">{booking.clientEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div>{new Date(booking.date).toLocaleDateString('pt-BR')}</div>
                    <div>{booking.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {getAssignedStaff(booking.id) || booking.assignedStaff || (
                      <span className="text-gray-400 italic">Não atribuído</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    R$ {booking.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetailsModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => setEditingBooking(booking)}
                        className="text-yellow-600 hover:text-yellow-700 font-medium"
                      >
                        Editar
                      </button>
                      {!getAssignedStaff(booking.id) && !booking.assignedStaff && (
                        <>
                          <button
                            onClick={() => handleAutoAssignStaff(booking)}
                            className="text-green-600 hover:text-green-700 font-medium"
                            title="Atribuir automaticamente o melhor funcionário"
                          >
                            Auto
                          </button>
                          <button
                            onClick={() => handleManualAssignStaff(booking)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                            title="Escolher funcionário manualmente"
                          >
                            Manual
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
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

        {filteredBookings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum agendamento encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedBooking(null);
          }}
        />
      )}

      {/* Edit Booking Modal */}
      {editingBooking && (
        <BookingModal
          booking={editingBooking}
          isEdit={true}
          onSave={handleUpdateBooking}
          onClose={() => setEditingBooking(null)}
        />
      )}

      {/* Staff Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Atribuir Funcionário</h3>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Serviço: {selectedBooking?.service}</h4>
              <p className="text-sm text-gray-600">
                {selectedBooking?.address} - {new Date(selectedBooking?.date).toLocaleDateString('pt-BR')} às {selectedBooking?.time}
              </p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableStaff.map(staff => (
                <div key={staff.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium">{staff.name}</h5>
                      <p className="text-sm text-gray-600">{staff.email} | {staff.phone}</p>
                      <p className="text-sm text-gray-600">Região: {staff.region}</p>
                      <p className="text-sm text-gray-600">
                        Avaliação: ⭐ {staff.rating}/5 | {staff.completedServices} serviços
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {staff.specialties.map((specialty, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => confirmManualAssignment(staff.id)}
                      className="ml-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    >
                      Atribuir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {availableStaff.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Nenhum funcionário disponível para este tipo de serviço.
              </p>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
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

export default BookingManagement;