
import React, { useState } from 'react';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'Maria Silva',
      email: 'maria@email.com',
      service: 'Limpeza Residencial',
      rating: 5,
      comment: 'Excelente serviço! Equipe muito profissional.',
      date: '2024-01-20',
      status: 'aprovado',
      helpful: 12
    },
    {
      id: 2,
      user: 'João Santos',
      email: 'joao@email.com',
      service: 'Limpeza Pós-Obra',
      rating: 4,
      comment: 'Bom trabalho, mas chegaram um pouco atrasados.',
      date: '2024-01-19',
      status: 'pendente',
      helpful: 8
    },
    {
      id: 3,
      user: 'Ana Costa',
      email: 'ana@email.com',
      service: 'Limpeza de Escritório',
      rating: 1,
      comment: 'Péssimo atendimento, não recomendo.',
      date: '2024-01-18',
      status: 'rejeitado',
      helpful: 2
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterRating, setFilterRating] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReviews = reviews.filter(review => {
    const matchesStatus = filterStatus === 'todos' || review.status === filterStatus;
    const matchesRating = filterRating === 'todas' || review.rating.toString() === filterRating;
    const matchesSearch = review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesRating && matchesSearch;
  });

  const handleStatusChange = (reviewId, newStatus) => {
    setReviews(reviews =>
      reviews.map(review =>
        review.id === reviewId ? { ...review, status: newStatus } : review
      )
    );
  };

  const deleteReview = (reviewId) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      setReviews(reviews => reviews.filter(review => review.id !== reviewId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const averageRating = reviews.filter(r => r.status === 'aprovado').reduce((acc, r) => acc + r.rating, 0) / reviews.filter(r => r.status === 'aprovado').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Avaliações</h2>
        <p className="text-gray-600 mt-1">Gerencie avaliações e depoimentos dos clientes</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aprovadas</p>
              <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.status === 'aprovado').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.status === 'pendente').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Buscar por nome ou comentário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="todos">Todos os Status</option>
            <option value="aprovado">Aprovado</option>
            <option value="pendente">Pendente</option>
            <option value="rejeitado">Rejeitado</option>
          </select>

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="todas">Todas as Estrelas</option>
            <option value="5">5 Estrelas</option>
            <option value="4">4 Estrelas</option>
            <option value="3">3 Estrelas</option>
            <option value="2">2 Estrelas</option>
            <option value="1">1 Estrela</option>
          </select>
        </div>
      </div>

      {/* Lista de Avaliações */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Avaliações ({filteredReviews.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReviews.map((review) => (
            <div key={review.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h4 className="font-medium text-gray-900">{review.user}</h4>
                    <span className="text-xl">{getRatingStars(review.rating)}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(review.status)}`}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    Serviço: {review.service} • {new Date(review.date).toLocaleDateString('pt-BR')}
                  </p>
                  
                  <p className="text-gray-800 mb-3">{review.comment}</p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <span>👍 {review.helpful} pessoas acharam útil</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  {review.status === 'pendente' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(review.id, 'aprovado')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleStatusChange(review.id, 'rejeitado')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Rejeitar
                      </button>
                    </>
                  )}
                  
                  {review.status !== 'pendente' && (
                    <select
                      value={review.status}
                      onChange={(e) => handleStatusChange(review.id, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="aprovado">Aprovado</option>
                      <option value="pendente">Pendente</option>
                      <option value="rejeitado">Rejeitado</option>
                    </select>
                  )}
                  
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredReviews.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma avaliação encontrada com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsManagement;
