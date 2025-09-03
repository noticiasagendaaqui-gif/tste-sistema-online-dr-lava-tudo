
import React, { useState, useEffect } from 'react';

const Reviews = () => {
  const [reviews] = useState([
    {
      id: 1,
      name: "Maria Silva",
      rating: 5,
      comment: "Excelente serviço! Equipe pontual e muito cuidadosa. Recomendo!",
      service: "Limpeza Residencial",
      date: "2024-01-15",
      verified: true
    },
    {
      id: 2,
      name: "João Santos",
      rating: 5,
      comment: "Profissionais muito competentes. Minha empresa ficou impecável!",
      service: "Limpeza Comercial",
      date: "2024-01-10",
      verified: true
    },
    {
      id: 3,
      name: "Ana Costa",
      rating: 4,
      comment: "Ótimo custo-benefício. Voltarei a contratar com certeza.",
      service: "Limpeza Pós-Obra",
      date: "2024-01-08",
      verified: true
    },
    {
      id: 4,
      name: "Carlos Oliveira",
      rating: 5,
      comment: "Superou minhas expectativas. Trabalho muito bem feito!",
      service: "Limpeza Residencial",
      date: "2024-01-05",
      verified: true
    }
  ]);

  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: '',
    service: ''
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, []);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Aqui você integraria com a API para salvar a avaliação
    console.log('Nova avaliação:', newReview);
    setNewReview({ name: '', rating: 5, comment: '', service: '' });
    setShowForm(false);
    alert('Obrigado pela sua avaliação! Ela será analisada antes da publicação.');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        data-feather="star"
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      ></i>
    ));
  };

  const getAverageRating = () => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex space-x-1">
              {renderStars(5)}
            </div>
            <span className="text-2xl font-bold text-secondary-900">{getAverageRating()}</span>
            <span className="text-secondary-600">({reviews.length} avaliações)</span>
          </div>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Mais de 1000 clientes satisfeitos compartilharam suas experiências
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 rounded-full p-2">
                    <i data-feather="user" className="w-5 h-5 text-primary-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-900">{review.name}</h4>
                    <p className="text-sm text-secondary-500">{review.service}</p>
                  </div>
                </div>
                {review.verified && (
                  <div className="flex items-center text-green-600">
                    <i data-feather="check-circle" className="w-4 h-4 mr-1"></i>
                    <span className="text-xs">Verificado</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1 mb-3">
                {renderStars(review.rating)}
              </div>
              
              <p className="text-secondary-700 mb-4">{review.comment}</p>
              
              <p className="text-xs text-secondary-400">
                {new Date(review.date).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>

        {/* Add Review Button */}
        <div className="text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            <i data-feather="plus" className="w-5 h-5 inline-block mr-2"></i>
            Deixar Avaliação
          </button>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="max-w-2xl mx-auto mt-8 bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-secondary-900 mb-6">Compartilhe sua Experiência</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Serviço Contratado
                  </label>
                  <select
                    required
                    value={newReview.service}
                    onChange={(e) => setNewReview({...newReview, service: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Selecione o serviço</option>
                    <option value="Limpeza Residencial">Limpeza Residencial</option>
                    <option value="Limpeza Comercial">Limpeza Comercial</option>
                    <option value="Limpeza Pós-Obra">Limpeza Pós-Obra</option>
                    <option value="Limpeza de Carpetes">Limpeza de Carpetes</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Avaliação
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className="focus:outline-none"
                      >
                        <i
                          data-feather="star"
                          className={`w-8 h-8 ${
                            star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        ></i>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Comentário
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    placeholder="Conte-nos sobre sua experiência..."
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2 flex space-x-4">
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Enviar Avaliação
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="border border-secondary-300 text-secondary-700 hover:bg-secondary-50 px-6 py-3 rounded-lg font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
