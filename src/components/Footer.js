
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/assets/images/logo.svg" alt="LimpaBrasil" className="h-8 w-8" />
              <h3 className="text-xl font-bold">LimpaBrasil</h3>
            </div>
            <p className="text-secondary-400 mb-4">
              Sua empresa de limpeza profissional de confiança há mais de 10 anos.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-secondary-800 hover:bg-secondary-700 p-2 rounded">
                <i data-feather="facebook" className="w-5 h-5"></i>
              </a>
              <a href="#" className="bg-secondary-800 hover:bg-secondary-700 p-2 rounded">
                <i data-feather="instagram" className="w-5 h-5"></i>
              </a>
              <a href="#" className="bg-secondary-800 hover:bg-secondary-700 p-2 rounded">
                <i data-feather="phone" className="w-5 h-5"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-secondary-400">
              <li><Link to="/servicos" className="hover:text-white transition-colors">Limpeza Residencial</Link></li>
              <li><Link to="/servicos" className="hover:text-white transition-colors">Limpeza Comercial</Link></li>
              <li><Link to="/servicos" className="hover:text-white transition-colors">Limpeza Pós-Obra</Link></li>
              <li><Link to="/servicos" className="hover:text-white transition-colors">Limpeza de Escritórios</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-secondary-400">
              <li><Link to="/sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
              <li><Link to="/servicos" className="hover:text-white transition-colors">Nossos Serviços</Link></li>
              <li><Link to="/contato" className="hover:text-white transition-colors">Contato</Link></li>
              <li><Link to="/agendamento" className="hover:text-white transition-colors">Agendamento</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3 text-secondary-400">
              <div className="flex items-center space-x-3">
                <i data-feather="phone" className="w-5 h-5"></i>
                <span>(31) 98025-2882</span>
              </div>
              <div className="flex items-center space-x-3">
                <i data-feather="mail" className="w-5 h-5"></i>
                <span>contato@limpabrasil.com.br</span>
              </div>
              <div className="flex items-center space-x-3">
                <i data-feather="map-pin" className="w-5 h-5"></i>
                <span>São José da Lapa, MG - Brasil</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-400">
          <p>&copy; 2025 LimpaBrasil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
