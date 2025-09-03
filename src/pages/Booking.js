import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import AdvancedBooking from '../components/AdvancedBooking';
import { seoPages } from '../utils/seoData';

const Booking = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    tipo_servico: '',
    frequencia: 'unica',
    data_preferida: '',
    horario_preferido: 'manha',
    area_m2: '',
    observacoes: '',
    aceite: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('data_preferida')?.setAttribute('min', today);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMessage({
        type: 'success',
        text: 'Agendamento enviado com sucesso! Entraremos em contato em breve.'
      });

      // Reset form
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cep: '',
        endereco: '',
        tipo_servico: '',
        frequencia: 'unica',
        data_preferida: '',
        horario_preferido: 'manha',
        area_m2: '',
        observacoes: '',
        aceite: false
      });

    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Ocorreu um erro. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <SEOHead {...seoPages.booking} />
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Agendar <span className="text-primary-600">Serviço</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Preencha o formulário abaixo para agendar seu serviço de limpeza. 
              Entraremos em contato em até 2 horas úteis.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-secondary-200 rounded-2xl shadow-lg p-8">
              {/* Success/Error Messages */}
              {message.text && (
                <div className={`mb-6 p-4 rounded ${
                  message.type === 'success' 
                    ? 'bg-green-100 border border-green-400 text-green-700' 
                    : 'bg-red-100 border border-red-400 text-red-700'
                }`}>
                  <div className="flex items-center">
                    <i data-feather={message.type === 'success' ? 'check-circle' : 'alert-circle'} className="w-5 h-5 mr-2"></i>
                    <span>{message.text}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Data */}
                  <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                      <i data-feather="user" className="w-6 h-6 mr-2 text-primary-600"></i>
                      Dados Pessoais
                    </h3>
                  </div>

                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-secondary-700 mb-2">
                      Nome Completo *
                    </label>
                    <input 
                      type="text" 
                      id="nome" 
                      name="nome" 
                      required
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                      E-mail *
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-secondary-700 mb-2">
                      Telefone *
                    </label>
                    <input 
                      type="tel" 
                      id="telefone" 
                      name="telefone" 
                      required
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="tipo_servico" className="block text-sm font-medium text-secondary-700 mb-2">
                      Tipo de Serviço *
                    </label>
                    <select 
                      id="tipo_servico" 
                      name="tipo_servico" 
                      required
                      value={formData.tipo_servico}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Selecione o serviço</option>
                      <option value="residencial">Limpeza Residencial</option>
                      <option value="comercial">Limpeza Comercial</option>
                      <option value="pos-obra">Limpeza Pós-Obra</option>
                      <option value="carpetes">Limpeza de Carpetes</option>
                      <option value="vidros">Limpeza de Vidros</option>
                      <option value="higienizacao">Higienização</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="data_preferida" className="block text-sm font-medium text-secondary-700 mb-2">
                      Data Preferida *
                    </label>
                    <input 
                      type="date" 
                      id="data_preferida" 
                      name="data_preferida" 
                      required
                      value={formData.data_preferida}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="observacoes" className="block text-sm font-medium text-secondary-700 mb-2">
                      Observações Adicionais
                    </label>
                    <textarea 
                      id="observacoes" 
                      name="observacoes" 
                      rows="4"
                      value={formData.observacoes}
                      onChange={handleChange}
                      placeholder="Descreva detalhes específicos, acesso ao local, ou qualquer informação importante..."
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-vertical"
                    ></textarea>
                  </div>

                  {/* Terms */}
                  <div className="md:col-span-2">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="aceite" 
                        name="aceite" 
                        required
                        checked={formData.aceite}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                      />
                      <span className="text-sm text-secondary-600">
                        Aceito os termos e condições e autorizo o contato da LimpaBrasil para 
                        confirmação do agendamento e detalhes do serviço. *
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-2 text-center pt-6">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <i data-feather="loader" className="w-5 h-5 inline-block animate-spin mr-2"></i>
                          Enviando...
                        </>
                      ) : (
                        'Agendar Serviço'
                      )}
                    </button>
                    <p className="text-sm text-secondary-500 mt-3">
                      Entraremos em contato em até 2 horas úteis para confirmar o agendamento
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;