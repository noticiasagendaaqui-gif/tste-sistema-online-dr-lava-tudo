
import React, { useState } from 'react';

const ClientBookings = ({ user }) => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      service: 'Limpeza Residencial Completa',
      date: '2024-02-15',
      time: '14:00',
      status: 'agendado',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      professional: 'Maria Silva',
      value: 180,
      details: 'Limpeza completa de apartamento 2 quartos',
      rating: null
    },
    {
      id: 2,
      service: 'Limpeza Pós-Obra',
      date: '2024-01-20',
      time: '09:00',
      status: 'concluido',
      address: 'Av. Paulista, 456 - São Paulo, SP',
      professional: 'João Santos',
      value: 350,
      details: 'Limpeza após reforma da cozinha',
      rating: 5
    },
    {
      id: 3,
      service: 'Limpeza de Escritório',
      date: '2024-01-15',
      time: '18:00',
      status: 'concluido',
      address: 'Rua Comercial, 789 - São Paulo, SP',
      professional: 'Ana Costa',
      value: 220,
      details: 'Limpeza semanal do escritório',
      rating: 4
    },
    {
      id: 4,
      service: 'Limpeza Residencial',
      date: '2024-01-10',
      time: '10:00',
      status: 'cancelado',
      address: 'Rua das Palmeiras, 321 - São Paulo, SP',
      professional: null,
      value: 150,
      details: 'Cancelado pelo cliente',
      rating: null
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('todos');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingBooking, setRatingBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const filteredBookings = bookings.filter(booking => 
    filterStatus === 'todos' || booking.status === filterStatus
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRateService = (booking) => {
    setRatingBooking(booking);
    setShowRatingModal(true);
  };

  const submitRating = () => {
    setBookings(bookings.map(booking => 
      booking.id === ratingBooking.id 
        ? { ...booking, rating, comment }
        : booking
    ));
    setShowRatingModal(false);
    setRating(0);
    setComment('');
    setRatingBooking(null);
  };

  const renderStars = (currentRating, interactive = false) => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        onClick={interactive ? () => setRating(index + 1) : undefined}
        className={`text-xl ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} ${
          index < currentRating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ⭐
      </button>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Meus Serviços</h2>
          <p className="text-gray-600 mt-1">Histórico completo dos seus agendamentos</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          + Agendar Novo Serviço
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="todos">Todos os Status</option>
            <option value="agendado">Agendado</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{booking.service}</h3>
                <p className="text-gray-600">{booking.details}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Data e Hora</p>
                <p className="text-gray-600">{booking.date} às {booking.time}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Endereço</p>
                <p className="text-gray-600">{booking.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Profissional</p>
                <p className="text-gray-600">{booking.professional || 'Não atribuído'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Valor</p>
                <p className="text-gray-600 font-semibold">R$ {booking.value}</p>
              </div>
            </div>

            {booking.rating && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Sua Avaliação</p>
                <div className="flex space-x-1">
                  {renderStars(booking.rating)}
                </div>
                {booking.comment && (
                  <p className="text-gray-600 mt-1">{booking.comment}</p>
                )}
              </div>
            )}

            <div className="flex space-x-3">
              {booking.status === 'agendado' && (
                <>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Reagendar
                  </button>
                  <button className="text-red-600 hover:text-red-700 font-medium">
                    Cancelar
                  </button>
                </>
              )}
              {booking.status === 'concluido' && !booking.rating && (
                <button 
                  onClick={() => handleRateService(booking)}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Avaliar Serviço
                </button>
              )}
              {booking.status === 'concluido' && (
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  Reagendar Mesmo Serviço
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum serviço encontrado com os filtros aplicados.</p>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Avaliar Serviço</h3>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Como foi o serviço?</p>
              <div className="flex space-x-1 mb-2">
                {renderStars(rating, true)}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentário (opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="3"
                placeholder="Conte-nos sobre sua experiência..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={submitRating}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Enviar Avaliação
              </button>
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setRating(0);
                  setComment('');
                  setRatingBooking(null);
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

export default ClientBookings;
