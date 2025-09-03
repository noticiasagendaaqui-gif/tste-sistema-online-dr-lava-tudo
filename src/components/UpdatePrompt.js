
import React from 'react';
import usePWA from '../hooks/usePWA';

const UpdatePrompt = () => {
  const { updateAvailable, updateApp } = usePWA();

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-primary-600 text-white rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <i data-feather="download" className="w-5 h-5 text-white"></i>
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium">
            Nova atualização disponível
          </h4>
          <p className="text-xs text-primary-100 mt-1">
            Uma nova versão do app está disponível com melhorias e correções
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={updateApp}
              className="bg-white text-primary-600 px-3 py-1 rounded text-xs font-medium hover:bg-primary-50 transition-colors"
            >
              Atualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrompt;
