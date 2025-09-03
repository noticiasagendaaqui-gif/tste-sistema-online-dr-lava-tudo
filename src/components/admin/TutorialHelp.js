
import React, { useState } from 'react';

const TutorialHelp = ({ page, onStartTutorial }) => {
  const [showQuickHelp, setShowQuickHelp] = useState(false);

  const helpContent = {
    dashboard: {
      title: 'Dashboard Principal',
      tips: [
        'Use os filtros de data para analisar períodos específicos',
        'Clique nos cards coloridos para ver detalhes',
        'Os gráficos são interativos - passe o mouse para ver dados'
      ]
    },
    users: {
      title: 'Gestão de Usuários',
      tips: [
        'Use a busca para encontrar usuários rapidamente',
        'Filtre por status, tipo ou data de cadastro',
        'Clique em qualquer usuário para ver o perfil completo'
      ]
    },
    bookings: {
      title: 'Gestão de Agendamentos',
      tips: [
        'Use a visualização em calendário para melhor organização',
        'Cores diferentes indicam status diferentes',
        'Arraste e solte para reagendar facilmente'
      ]
    },
    services: {
      title: 'Gestão de Serviços',
      tips: [
        'Configure preços dinâmicos baseados em fatores',
        'Use templates para agilizar configurações',
        'Monitore quais serviços são mais solicitados'
      ]
    },
    staff: {
      title: 'Gestão de Funcionários',
      tips: [
        'Mantenha dados de certificação sempre atualizados',
        'Use avaliações para identificar top performers',
        'Configure notificações de vencimento de documentos'
      ]
    },
    emails: {
      title: 'Sistema de Emails',
      tips: [
        'Teste templates antes de ativar automações',
        'Segmente listas para melhor personalização',
        'Monitore métricas de abertura e cliques'
      ]
    },
    chat: {
      title: 'Chat ao Vivo',
      tips: [
        'Configure respostas automáticas para horário comercial',
        'Use tags para categorizar conversas',
        'Monitore tempo de resposta médio'
      ]
    },
    loyalty: {
      title: 'Programa de Fidelidade',
      tips: [
        'Balance pontos para manter engajamento',
        'Crie campanhas sazonais especiais',
        'Analise quais recompensas são mais resgatadas'
      ]
    },
    reports: {
      title: 'Relatórios e Analytics',
      tips: [
        'Compare períodos para identificar tendências',
        'Use filtros para análises específicas',
        'Exporte dados para análises externas'
      ]
    },
    settings: {
      title: 'Configurações do Sistema',
      tips: [
        'Faça backup antes de grandes mudanças',
        'Teste integrações em ambiente de desenvolvimento',
        'Documente todas as configurações personalizadas'
      ]
    }
  };

  const currentHelp = helpContent[page] || { title: 'Ajuda', tips: [] };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Quick Help Tooltip */}
      {showQuickHelp && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border p-4 mb-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">{currentHelp.title}</h4>
            <button
              onClick={() => setShowQuickHelp(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2 mb-4">
            {currentHelp.tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => onStartTutorial && onStartTutorial(page)}
            className="w-full py-2 px-4 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ver Tutorial Completo
          </button>
        </div>
      )}

      {/* Help Button */}
      <div className="flex flex-col space-y-2">
        <button
          onClick={() => setShowQuickHelp(!showQuickHelp)}
          className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center group"
          title="Ajuda Rápida"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        <button
          onClick={() => onStartTutorial && onStartTutorial(page)}
          className="w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-200 flex items-center justify-center"
          title="Tutorial Completo"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TutorialHelp;
