import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const seoPages = {
  about: {
    title: "Sobre a LimpaBrasil - Limpeza Profissional e Confiável",
    description: "Descubra a história da LimpaBrasil, há mais de 10 anos oferecendo serviços de limpeza profissional com qualidade, confiança e compromisso.",
    keywords: "limpeza profissional, LimpaBrasil, serviços de limpeza, limpeza residencial, limpeza comercial, qualidade, confiança",
    canonical: "https://www.limpabrasil.com.br/sobre",
    ogImage: "https://www.limpabrasil.com.br/images/seo-about.jpg"
  }
};


const About = () => {
  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, []);

  return (
    <div>
      <SEOHead {...seoPages.about} />
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Sobre a <span className="text-primary-600">LimpaBrasil</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Há mais de 10 anos oferecendo serviços de limpeza profissional com qualidade, 
              confiança e compromisso com a satisfação dos nossos clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">Nossa História</h2>
              <p className="text-lg text-secondary-600 mb-6">
                A LimpaBrasil nasceu em 2013 com o objetivo de revolucionar o mercado de limpeza profissional 
                no Brasil. Começamos como uma pequena empresa familiar e hoje somos uma das principais 
                referências do setor.
              </p>
              <p className="text-lg text-secondary-600 mb-6">
                Nossa missão sempre foi proporcionar ambientes limpos, saudáveis e acolhedores, 
                utilizando as melhores práticas do mercado e produtos ecologicamente responsáveis.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 rounded-full p-3">
                  <i data-feather="award" className="w-6 h-6 text-primary-600"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">Certificação ISO 9001</h3>
                  <p className="text-secondary-600">Qualidade garantida em todos os processos</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-primary-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">10+</h3>
                    <p>Anos de Experiência</p>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">1000+</h3>
                    <p>Clientes Satisfeitos</p>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">50+</h3>
                    <p>Profissionais Treinados</p>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">100%</h3>
                    <p>Garantia de Qualidade</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Faça Parte da Nossa História
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Junte-se aos mais de 1000 clientes que já confiam na LimpaBrasil 
            para manter seus ambientes impecáveis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/agendamento" 
              className="bg-white text-primary-600 hover:bg-secondary-100 px-8 py-4 rounded-lg font-medium transition-colors"
            >
              Solicitar Orçamento
            </Link>
            <Link 
              to="/contato" 
              className="border border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-medium transition-colors"
            >
              Falar Conosco
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;