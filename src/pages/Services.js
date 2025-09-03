import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { seoPages } from '../utils/seoData';

const Services = () => {
  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, []);

  return (
    <div>
      <SEOHead {...seoPages.services} />
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Nossos <span className="text-primary-600">Serviços</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Oferecemos uma ampla gama de serviços de limpeza profissional para
              atender todas as suas necessidades com qualidade e eficiência.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service cards here - truncated for brevity */}
            <div className="bg-white border border-secondary-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <i data-feather="home" className="w-8 h-8 text-primary-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4 text-center">Limpeza Residencial</h3>
              <p className="text-secondary-600 mb-6 text-center">
                Limpeza completa de residências, apartamentos e casas com produtos seguros e ecológicos.
              </p>
              <div className="text-center">
                <span className="text-2xl font-bold text-primary-600">A partir de R$ 80</span>
                <p className="text-sm text-secondary-500">por visita</p>
              </div>
              <div className="text-center mt-6">
                <Link
                  to="/agendamento"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Agendar Agora
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Precisa de Algum Destes Serviços?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Solicite um orçamento gratuito e deixe nossa equipe especializada
            cuidar da limpeza do seu ambiente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/agendamento"
              className="bg-white text-primary-600 hover:bg-secondary-100 px-8 py-4 rounded-lg font-medium transition-colors"
            >
              Agendar Serviço
            </Link>
            <Link
              to="/contato"
              className="border border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-medium transition-colors"
            >
              Solicitar Orçamento
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;