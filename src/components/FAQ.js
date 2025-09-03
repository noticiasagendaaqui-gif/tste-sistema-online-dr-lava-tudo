
import React, { useState, useEffect } from 'react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [openItems, setOpenItems] = useState({});

  const faqData = [
    {
      id: 1,
      category: 'servicos',
      question: 'Quais tipos de serviços de limpeza vocês oferecem?',
      answer: 'Oferecemos limpeza residencial, comercial, pós-obra, limpeza de carpetes, vidros, higienização de estofados e muito mais. Cada serviço é personalizado conforme suas necessidades.'
    },
    {
      id: 2,
      category: 'precos',
      question: 'Como são calculados os preços dos serviços?',
      answer: 'Os preços são calculados com base no tipo de serviço, área total, frequência e serviços extras. Use nossa calculadora online para ter uma estimativa ou solicite um orçamento personalizado.'
    },
    {
      id: 3,
      category: 'agendamento',
      question: 'Como posso agendar um serviço?',
      answer: 'Você pode agendar através do nosso formulário online, pelo WhatsApp (31) 98025-2882 ou ligando diretamente. Atendemos de segunda a sábado.'
    },
    {
      id: 4,
      category: 'pagamento',
      question: 'Quais formas de pagamento vocês aceitam?',
      answer: 'Aceitamos dinheiro, cartão de débito/crédito, PIX e transferência bancária. Para contratos mensais, oferecemos desconto no pagamento à vista.'
    },
    {
      id: 5,
      category: 'servicos',
      question: 'Vocês trazem os produtos de limpeza?',
      answer: 'Sim! Levamos todos os produtos e equipamentos necessários. Utilizamos produtos profissionais e ecológicos para garantir a melhor limpeza sem agredir o meio ambiente.'
    },
    {
      id: 6,
      category: 'tempo',
      question: 'Quanto tempo demora um serviço de limpeza?',
      answer: 'O tempo varia conforme o tipo e tamanho do ambiente. Uma casa de 100m² leva cerca de 3-4 horas. Apartamentos menores, 2-3 horas. Sempre informamos o tempo estimado no agendamento.'
    },
    {
      id: 7,
      category: 'frequencia',
      question: 'Posso contratar serviços regulares?',
      answer: 'Claro! Oferecemos planos semanais, quinzenais e mensais com descontos especiais. Contratos regulares têm prioridade no agendamento e preços reduzidos.'
    },
    {
      id: 8,
      category: 'garantia',
      question: 'Vocês oferecem garantia nos serviços?',
      answer: 'Sim! Oferecemos 100% de garantia de satisfação. Se você não ficar completamente satisfeito, voltamos para refazer o serviço sem custo adicional em até 24 horas.'
    },
    {
      id: 9,
      category: 'emergencia',
      question: 'Vocês atendem emergências?',
      answer: 'Sim, atendemos emergências 24/7 com taxa adicional. Para limpezas urgentes pós-obra, enchentes ou outras situações emergenciais, entre em contato pelo WhatsApp.'
    },
    {
      id: 10,
      category: 'seguranca',
      question: 'Como garantem a segurança durante o serviço?',
      answer: 'Todos os profissionais são verificados, treinados e uniformizados. Temos seguro responsabilidade civil e seguimos rigorosos protocolos de segurança e qualidade.'
    }
  ];

  const categories = [
    { id: 'todos', name: 'Todos', icon: 'list' },
    { id: 'servicos', name: 'Serviços', icon: 'briefcase' },
    { id: 'precos', name: 'Preços', icon: 'dollar-sign' },
    { id: 'agendamento', name: 'Agendamento', icon: 'calendar' },
    { id: 'pagamento', name: 'Pagamento', icon: 'credit-card' },
    { id: 'tempo', name: 'Tempo', icon: 'clock' },
    { id: 'frequencia', name: 'Frequência', icon: 'repeat' },
    { id: 'garantia', name: 'Garantia', icon: 'shield' },
    { id: 'emergencia', name: 'Emergência', icon: 'alert-circle' },
    { id: 'seguranca', name: 'Segurança', icon: 'lock' }
  ];

  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, [openItems]);

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'todos' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Perguntas <span className="text-primary-600">Frequentes</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Encontre respostas rápidas para as dúvidas mais comuns sobre nossos serviços
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Busque por uma pergunta ou palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
            />
            <i data-feather="search" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5"></i>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-secondary-600 hover:bg-primary-50'
              }`}
            >
              <i data-feather={category.icon} className="w-4 h-4"></i>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQ.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQ.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-secondary-900 pr-4">
                      {item.question}
                    </h3>
                    <i
                      data-feather={openItems[item.id] ? 'minus' : 'plus'}
                      className={`w-5 h-5 text-primary-600 transition-transform ${
                        openItems[item.id] ? 'rotate-180' : ''
                      }`}
                    ></i>
                  </button>
                  
                  {openItems[item.id] && (
                    <div className="px-6 pb-4">
                      <div className="border-t border-secondary-100 pt-4">
                        <p className="text-secondary-700 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i data-feather="search" className="w-16 h-16 text-secondary-300 mx-auto mb-4"></i>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Nenhuma pergunta encontrada
              </h3>
              <p className="text-secondary-600 mb-6">
                Não encontramos resultados para "{searchTerm}". Tente outras palavras-chave.
              </p>
              <button
                onClick={() => {setSearchTerm(''); setActiveCategory('todos');}}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Ver Todas as Perguntas
              </button>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl p-8 max-w-2xl mx-auto shadow-lg">
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
              Não encontrou sua resposta?
            </h3>
            <p className="text-secondary-600 mb-6">
              Nossa equipe está pronta para esclarecer todas as suas dúvidas!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/553198025882"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center transition-colors"
              >
                <i data-feather="message-circle" className="w-5 h-5 mr-2"></i>
                WhatsApp
              </a>
              <a
                href="tel:+553198025882"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center transition-colors"
              >
                <i data-feather="phone" className="w-5 h-5 mr-2"></i>
                Ligar Agora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
