import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

const seoPages = {
  contact: {
    title: 'Entre em Contato | LimpaBrasil',
    description: 'Entre em contato com a LimpaBrasil para solicitar orçamentos, agendar serviços ou tirar suas dúvidas. Atendimento rápido e eficiente.',
    keywords: 'contato, LimpaBrasil, orçamento, agendamento, dúvidas, WhatsApp, telefone, e-mail',
    canonical: 'https://www.limpabrasil.com.br/contato',
    ogTitle: 'Entre em Contato Conosco | LimpaBrasil',
    ogDescription: 'Fale com a LimpaBrasil. Solicite seu orçamento gratuito e tire suas dúvidas.',
    ogImage: 'https://www.limpabrasil.com.br/images/og-image.jpg',
    ogUrl: 'https://www.limpabrasil.com.br/contato',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Entre em Contato | LimpaBrasil',
    twitterDescription: 'Estamos aqui para ajudar! Entre em contato conosco e solicite seu orçamento gratuito.',
    twitterImage: 'https://www.limpabrasil.com.br/images/twitter-image.jpg'
  }
};

const Contact = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    endereco: '',
    mensagem: '',
    aceite: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
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
        text: 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
      });

      // Reset form
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        endereco: '',
        mensagem: '',
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
    <div>
      <SEOHead {...seoPages.contact} />
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Entre em <span className="text-primary-600">Contato</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Estamos aqui para ajudar! Entre em contato conosco e solicite seu orçamento gratuito. 
              Nossa equipe responde em até 2 horas úteis.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <i data-feather="phone" className="w-8 h-8 text-primary-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">Telefone</h3>
              <p className="text-secondary-600 mb-4">Ligue agora e fale diretamente com nossa equipe</p>
              <a href="tel:+553198025882" className="text-primary-600 hover:text-primary-700 font-semibold text-xl">
                (31) 98025-2882
              </a>
              <p className="text-sm text-secondary-500 mt-2">Segunda a Sexta: 8h às 18h</p>
              <p className="text-sm text-secondary-500">Sábado: 8h às 14h</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <i data-feather="mail" className="w-8 h-8 text-primary-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">E-mail</h3>
              <p className="text-secondary-600 mb-4">Envie sua mensagem ou solicitação de orçamento</p>
              <a href="mailto:contato@limpabrasil.com.br" className="text-primary-600 hover:text-primary-700 font-semibold">
                contato@limpabrasil.com.br
              </a>
              <p className="text-sm text-secondary-500 mt-2">Respondemos em até 2 horas úteis</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <i data-feather="message-circle" className="w-8 h-8 text-primary-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">WhatsApp</h3>
              <p className="text-secondary-600 mb-4">Converse conosco pelo WhatsApp</p>
              <a href="https://wa.me/553198025882" target="_blank" rel="noopener noreferrer"
                 className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                <i data-feather="message-circle" className="w-5 h-5 inline-block mr-2"></i>
                Iniciar Conversa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Envie Sua Mensagem
              </h2>
              <p className="text-xl text-secondary-600">
                Preencha o formulário abaixo e entraremos em contato em breve
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
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
                      Telefone
                    </label>
                    <input 
                      type="tel" 
                      id="telefone" 
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="assunto" className="block text-sm font-medium text-secondary-700 mb-2">
                      Assunto *
                    </label>
                    <select 
                      id="assunto" 
                      name="assunto" 
                      required
                      value={formData.assunto}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Selecione o assunto</option>
                      <option value="orcamento">Solicitar Orçamento</option>
                      <option value="agendamento">Agendamento de Serviço</option>
                      <option value="duvidas">Dúvidas sobre Serviços</option>
                      <option value="reclamacao">Reclamação</option>
                      <option value="elogio">Elogio</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="mensagem" className="block text-sm font-medium text-secondary-700 mb-2">
                      Mensagem *
                    </label>
                    <textarea 
                      id="mensagem" 
                      name="mensagem" 
                      rows="6" 
                      required
                      value={formData.mensagem}
                      onChange={handleChange}
                      placeholder="Descreva detalhadamente sua solicitação, dúvida ou comentário..."
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-vertical"
                    ></textarea>
                  </div>

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
                        Aceito receber informações sobre os serviços da LimpaBrasil e autorizo o contato 
                        por telefone, e-mail ou WhatsApp. *
                      </span>
                    </label>
                  </div>

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
                        'Enviar Mensagem'
                      )}
                    </button>
                    <p className="text-sm text-secondary-500 mt-3">
                      Respondemos em até 2 horas úteis
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

export default Contact;