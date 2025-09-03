
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { generateBreadcrumbSchema } from '../utils/seoData';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbMap = {
    '': 'Home',
    'sobre': 'Sobre',
    'servicos': 'Serviços',
    'agendamento': 'Agendamento',
    'contato': 'Contato',
    'admin': 'Administração',
    'cliente': 'Área do Cliente'
  };

  const breadcrumbs = [
    { name: 'Home', url: 'https://limpabrasil.com.br/' }
  ];

  let currentPath = '';
  pathnames.forEach((pathname) => {
    currentPath += `/${pathname}`;
    breadcrumbs.push({
      name: breadcrumbMap[pathname] || pathname,
      url: `https://limpabrasil.com.br${currentPath}`
    });
  });

  if (breadcrumbs.length <= 1) return null;

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema(breadcrumbs))}
        </script>
      </Helmet>
      <nav className="bg-gray-50 py-3 px-4 border-b">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <i data-feather="chevron-right" className="w-4 h-4 mx-2 text-gray-400"></i>
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-600 font-medium">{crumb.name}</span>
                ) : (
                  <Link 
                    to={crumb.url.replace('https://limpabrasil.com.br', '')} 
                    className="text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
};

export default Breadcrumbs;
