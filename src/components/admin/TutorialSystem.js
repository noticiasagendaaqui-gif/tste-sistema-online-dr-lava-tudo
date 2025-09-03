import React, { useState, useEffect } from 'react';

const TutorialSystem = () => {
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [completedTutorials, setCompletedTutorials] = useState([]);

  useEffect(() => {
    // Carregar tutoriais completados do localStorage
    const completed = localStorage.getItem('completedTutorials');
    if (completed) {
      setCompletedTutorials(JSON.parse(completed));
    }
  }, []);

  const tutorials = [
    {
      id: 'dashboard',
      title: 'Dashboard Principal',
      description: 'Aprenda a navegar pelo dashboard e entender as métricas principais',
      duration: '5 min',
      steps: [
        {
          title: 'Visão Geral do Dashboard',
          content: 'O dashboard mostra um resumo geral do seu negócio. Aqui você encontra as métricas mais importantes como total de usuários, agendamentos e receita.',
          target: 'dashboard-overview',
          image: '📊'
        },
        {
          title: 'Cards de Estatísticas',
          content: 'Os cards coloridos mostram números em tempo real. Verde para crescimento positivo, vermelho para alertas.',
          target: 'stats-cards',
          image: '📈'
        },
        {
          title: 'Gráficos e Relatórios',
          content: 'Os gráficos mostram tendências ao longo do tempo. Use-os para identificar padrões e tomar decisões.',
          target: 'charts-section',
          image: '📉'
        },
        {
          title: 'Agendamentos Recentes',
          content: 'Veja os últimos agendamentos e seus status. Clique em qualquer item para ver detalhes.',
          target: 'recent-bookings',
          image: '📅'
        }
      ]
    },
    {
      id: 'users',
      title: 'Gestão de Usuários',
      description: 'Como gerenciar clientes, editar perfis e analisar comportamentos',
      duration: '7 min',
      steps: [
        {
          title: 'Lista de Usuários',
          content: 'Aqui você encontra todos os usuários registrados. Use os filtros para encontrar usuários específicos.',
          target: 'users-list',
          image: '👥'
        },
        {
          title: 'Perfil do Cliente',
          content: 'Clique em qualquer usuário para ver seu perfil completo, histórico de serviços e dados de contato.',
          target: 'user-profile',
          image: '👤'
        },
        {
          title: 'Histórico de Atividades',
          content: 'Monitore as atividades dos usuários: logins, agendamentos, pagamentos e avaliações.',
          target: 'user-activity',
          image: '📋'
        },
        {
          title: 'Ações Administrativas',
          content: 'Você pode editar dados, suspender contas ou enviar mensagens diretamente para os usuários.',
          target: 'user-actions',
          image: '⚙️'
        }
      ]
    },
    {
      id: 'bookings',
      title: 'Gestão de Agendamentos',
      description: 'Como gerenciar, alocar funcionários e controlar o status dos serviços',
      duration: '8 min',
      steps: [
        {
          title: 'Visualização de Agendamentos',
          content: 'Veja todos os agendamentos organizados por data e status. Use o calendário para navegação rápida.',
          target: 'bookings-calendar',
          image: '📅'
        },
        {
          title: 'Detalhes do Agendamento',
          content: 'Cada agendamento mostra cliente, serviço, data, hora, endereço e valor. Clique para ver todos os detalhes.',
          target: 'booking-details',
          image: '📝'
        },
        {
          title: 'Alocação de Funcionários',
          content: 'Atribua funcionários aos serviços baseado na disponibilidade, localização e especialidade.',
          target: 'staff-allocation',
          image: '👷'
        },
        {
          title: 'Controle de Status',
          content: 'Atualize o status: Pendente → Confirmado → Em Andamento → Concluído → Avaliado.',
          target: 'status-control',
          image: '🔄'
        },
        {
          title: 'Comunicação com Cliente',
          content: 'Envie atualizações automáticas por email e SMS. O cliente recebe notificações em cada mudança.',
          target: 'client-communication',
          image: '📧'
        }
      ]
    },
    {
      id: 'services',
      title: 'Gestão de Serviços',
      description: 'Configurar tipos de serviço, preços e pacotes especiais',
      duration: '6 min',
      steps: [
        {
          title: 'Tipos de Serviço',
          content: 'Configure diferentes tipos: Residencial, Comercial, Pós-Obra, etc. Cada tipo tem características específicas.',
          target: 'service-types',
          image: '🧹'
        },
        {
          title: 'Configuração de Preços',
          content: 'Defina preços base, fatores multiplicadores (área, urgência, dificuldade) e descontos especiais.',
          target: 'pricing-config',
          image: '💰'
        },
        {
          title: 'Pacotes e Promoções',
          content: 'Crie pacotes com desconto e promoções sazonais. Configure regras de aplicação automática.',
          target: 'packages-promotions',
          image: '🎁'
        },
        {
          title: 'Tempo e Recursos',
          content: 'Estime duração de cada serviço e recursos necessários (funcionários, equipamentos).',
          target: 'time-resources',
          image: '⏱️'
        }
      ]
    },
    {
      id: 'staff',
      title: 'Gestão de Funcionários',
      description: 'Cadastrar funcionários, controlar horários e avaliar performance',
      duration: '7 min',
      steps: [
        {
          title: 'Cadastro de Funcionários',
          content: 'Registre novos funcionários com dados completos, documentos e especialidades.',
          target: 'staff-registration',
          image: '📝'
        },
        {
          title: 'Controle de Horários',
          content: 'Gerencie escalas, folgas e disponibilidade. Configure horários flexíveis por funcionário.',
          target: 'schedule-control',
          image: '🕐'
        },
        {
          title: 'Avaliação de Performance',
          content: 'Monitore avaliações dos clientes, pontualidade e qualidade do serviço de cada funcionário.',
          target: 'performance-evaluation',
          image: '⭐'
        },
        {
          title: 'Treinamentos e Certificações',
          content: 'Registre treinamentos realizados e certificações obtidas. Mantenha a equipe sempre atualizada.',
          target: 'training-certifications',
          image: '🎓'
        }
      ]
    },
    {
      id: 'emails',
      title: 'Sistema de Emails',
      description: 'Configurar templates, campanhas e automações de email',
      duration: '6 min',
      steps: [
        {
          title: 'Templates de Email',
          content: 'Customize templates para confirmação, lembrete, avaliação e outros emails automáticos.',
          target: 'email-templates',
          image: '📧'
        },
        {
          title: 'Campanhas de Marketing',
          content: 'Crie campanhas promocionais segmentadas. Defina público-alvo e cronograma de envio.',
          target: 'marketing-campaigns',
          image: '📢'
        },
        {
          title: 'Automações',
          content: 'Configure envios automáticos baseados em eventos: novo cadastro, agendamento, conclusão.',
          target: 'email-automation',
          image: '🤖'
        },
        {
          title: 'Relatórios de Email',
          content: 'Acompanhe taxa de abertura, cliques e conversões. Otimize suas comunicações.',
          target: 'email-reports',
          image: '📊'
        }
      ]
    },
    {
      id: 'chat',
      title: 'Chat ao Vivo',
      description: 'Gerenciar conversas, atribuir agentes e resolver problemas',
      duration: '5 min',
      steps: [
        {
          title: 'Central de Conversas',
          content: 'Veja todas as conversas ativas e históricas. Filtre por status e agente responsável.',
          target: 'chat-center',
          image: '💬'
        },
        {
          title: 'Atribuição de Agentes',
          content: 'Distribua conversas entre agentes disponíveis. Configure atribuição automática ou manual.',
          target: 'agent-assignment',
          image: '👨‍💼'
        },
        {
          title: 'Respostas Rápidas',
          content: 'Use templates de resposta para perguntas frequentes. Agilize o atendimento.',
          target: 'quick-responses',
          image: '⚡'
        },
        {
          title: 'Escalação e Follow-up',
          content: 'Escale problemas complexos para supervisores e configure follow-ups automáticos.',
          target: 'escalation-followup',
          image: '📈'
        }
      ]
    },
    {
      id: 'loyalty',
      title: 'Programa de Fidelidade',
      description: 'Configurar pontos, recompensas e regras do programa',
      duration: '5 min',
      steps: [
        {
          title: 'Sistema de Pontos',
          content: 'Configure quantos pontos cada serviço gera. Defina valores e regras de acúmulo.',
          target: 'points-system',
          image: '🎯'
        },
        {
          title: 'Recompensas Disponíveis',
          content: 'Crie recompensas atrativas: descontos, serviços gratuitos, brindes especiais.',
          target: 'rewards-catalog',
          image: '🎁'
        },
        {
          title: 'Níveis de Fidelidade',
          content: 'Estabeleça níveis (Bronze, Prata, Ouro) com benefícios progressivos.',
          target: 'loyalty-tiers',
          image: '🏆'
        },
        {
          title: 'Campanhas Especiais',
          content: 'Lance promoções temporárias: pontos dobrados, recompensas exclusivas.',
          target: 'special-campaigns',
          image: '🌟'
        }
      ]
    },
    {
      id: 'reports',
      title: 'Relatórios e Analytics',
      description: 'Gerar relatórios detalhados e analisar performance do negócio',
      duration: '8 min',
      steps: [
        {
          title: 'Dashboard de Métricas',
          content: 'Visualize KPIs principais: receita, crescimento, satisfação do cliente, produtividade.',
          target: 'metrics-dashboard',
          image: '📊'
        },
        {
          title: 'Relatórios Financeiros',
          content: 'Gere relatórios de receita, custos, lucro por período. Exporte para Excel ou PDF.',
          target: 'financial-reports',
          image: '💰'
        },
        {
          title: 'Análise de Performance',
          content: 'Compare performance de funcionários, serviços mais solicitados, regiões de maior demanda.',
          target: 'performance-analysis',
          image: '📈'
        },
        {
          title: 'Previsões e Tendências',
          content: 'Use dados históricos para prever demanda futura e planejar recursos.',
          target: 'forecasting',
          image: '🔮'
        }
      ]
    },
    {
      id: 'settings',
      title: 'Configurações do Sistema',
      description: 'Personalizar configurações gerais, integrações e preferências',
      duration: '6 min',
      steps: [
        {
          title: 'Configurações da Empresa',
          content: 'Atualize dados da empresa: nome, CNPJ, endereço, telefone e informações de contato.',
          target: 'company-settings',
          image: '🏢'
        },
        {
          title: 'Configurações de Agendamento',
          content: 'Defina horários de funcionamento, antecedência mínima e máxima para agendamentos.',
          target: 'booking-settings',
          image: '⏰'
        },
        {
          title: 'Configurações de Pagamento',
          content: 'Configure métodos aceitos, taxas e regras de cobrança. Integre com gateways de pagamento.',
          target: 'payment-settings',
          image: '💳'
        },
        {
          title: 'Configurações de Integração',
          content: 'Configure APIs externas: Stripe, Google Maps, SMS e outros serviços.',
          target: 'integration-settings',
          image: '🔗'
        }
      ]
    },
    {
      id: 'mercadopago',
      title: 'Configuração do Mercado Pago',
      description: 'Configure o gateway de pagamento Mercado Pago para processar pagamentos',
      duration: '8 min',
      steps: [
        {
          title: 'Criando Conta no Mercado Pago',
          content: 'Acesse developers.mercadopago.com e crie uma conta de desenvolvedor. Você precisará de uma conta pessoal ou empresarial do Mercado Pago.',
          target: 'mercadopago-account',
          image: '👤'
        },
        {
          title: 'Obtendo as Credenciais de Teste',
          content: 'No painel do desenvolvedor, acesse "Suas integrações" > "Credenciais". Copie a Public Key e Access Token de TESTE.',
          target: 'test-credentials',
          image: '🔑'
        },
        {
          title: 'Configurando no Sistema',
          content: 'Cole as credenciais de teste nos campos correspondentes. Mantenha o ambiente como "Sandbox" para testes.',
          target: 'system-config',
          image: '⚙️'
        },
        {
          title: 'Configurando Webhook',
          content: 'Configure a URL de webhook no painel do Mercado Pago para receber notificações de pagamento em tempo real.',
          target: 'webhook-config',
          image: '🔔'
        },
        {
          title: 'Testando Pagamentos',
          content: 'Use cartões de teste para validar a integração. Cartão aprovado: 5031 4332 1540 6351. CVV: 123.',
          target: 'payment-test',
          image: '💳'
        },
        {
          title: 'Métodos de Pagamento',
          content: 'Escolha quais métodos aceitar: PIX, cartões, boleto. PIX tem menor taxa (0,99%) e aprovação instantânea.',
          target: 'payment-methods',
          image: '💰'
        },
        {
          title: 'Configurando Parcelamento',
          content: 'Defina o número máximo de parcelas aceitas. Lembre-se: mais parcelas = mais taxa por parcela adicional.',
          target: 'installments',
          image: '📊'
        },
        {
          title: 'Modo Produção',
          content: 'Após testes, obtenha credenciais de PRODUÇÃO e altere o ambiente. Certifique-se de que tudo funciona corretamente.',
          target: 'production-mode',
          image: '🚀'
        },
        {
          title: 'Monitoramento',
          content: 'Acompanhe transações no painel do Mercado Pago. Configure alertas para falhas e monitore taxas de conversão.',
          target: 'monitoring',
          image: '📈'
        },
        {
          title: 'Planos Recorrentes',
          content: 'Para assinaturas, configure planos recorrentes usando a API de Subscriptions do Mercado Pago.',
          target: 'recurring-plans',
          image: '🔄'
        }
      ]
    }
  ];

  const startTutorial = (tutorial) => {
    setCurrentTutorial(tutorial);
    setCurrentStep(0);
    setShowTutorialModal(true);
  };

  const nextStep = () => {
    if (currentStep < currentTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTutorial = () => {
    const newCompleted = [...completedTutorials, currentTutorial.id];
    setCompletedTutorials(newCompleted);
    localStorage.setItem('completedTutorials', JSON.stringify(newCompleted));
    setShowTutorialModal(false);
    setCurrentTutorial(null);
    setCurrentStep(0);
  };

  const resetProgress = () => {
    setCompletedTutorials([]);
    localStorage.removeItem('completedTutorials');
  };

  const isTutorialCompleted = (tutorialId) => {
    return completedTutorials.includes(tutorialId);
  };

  const TutorialModal = () => {
    if (!currentTutorial || !showTutorialModal) return null;

    const currentStepData = currentTutorial.steps[currentStep];
    const progress = ((currentStep + 1) / currentTutorial.steps.length) * 100;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{currentTutorial.title}</h3>
                <p className="text-primary-100 mt-1">
                  Passo {currentStep + 1} de {currentTutorial.steps.length}
                </p>
              </div>
              <button
                onClick={() => setShowTutorialModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="bg-primary-500 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{currentStepData.image}</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {currentStepData.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {currentStepData.content}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>

              <div className="flex space-x-2">
                {currentTutorial.steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {currentStep === currentTutorial.steps.length - 1 ? 'Concluir' : 'Próximo'}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sistema de Tutoriais</h2>
            <p className="text-gray-600 mt-1">
              Aprenda a usar todas as funcionalidades do sistema LimpaBrasil
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {completedTutorials.length} de {tutorials.length} tutoriais concluídos
            </div>
            <button
              onClick={resetProgress}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Resetar Progresso
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
            <span className="text-sm text-gray-600">
              {Math.round((completedTutorials.length / tutorials.length) * 100)}%
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-full h-3 transition-all duration-300"
              style={{ width: `${(completedTutorials.length / tutorials.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className={`border rounded-lg p-6 transition-all duration-200 hover:shadow-md ${
                isTutorialCompleted(tutorial.id)
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                    isTutorialCompleted(tutorial.id)
                      ? 'bg-green-100 text-green-600'
                      : 'bg-primary-100 text-primary-600'
                  }`}>
                    {isTutorialCompleted(tutorial.id) ? '✓' : '📚'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tutorial.title}</h3>
                    <p className="text-sm text-gray-600">{tutorial.duration}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {tutorial.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {tutorial.steps.length} passos
                </span>
                <button
                  onClick={() => startTutorial(tutorial)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    isTutorialCompleted(tutorial.id)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {isTutorialCompleted(tutorial.id) ? 'Revisar' : 'Iniciar'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Rápido</h3>
          <p className="text-gray-600 mb-4">
            Precisa de ajuda com algo específico? Use estes atalhos para ir direto ao ponto.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button 
              onClick={() => startTutorial(tutorials.find(t => t.id === 'bookings'))}
              className="p-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow text-center"
            >
              <div className="text-2xl mb-1">📅</div>
              <div className="text-sm font-medium">Agendamentos</div>
            </button>
            <button 
              onClick={() => startTutorial(tutorials.find(t => t.id === 'users'))}
              className="p-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow text-center"
            >
              <div className="text-2xl mb-1">👥</div>
              <div className="text-sm font-medium">Usuários</div>
            </button>
            <button 
              onClick={() => startTutorial(tutorials.find(t => t.id === 'reports'))}
              className="p-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow text-center"
            >
              <div className="text-2xl mb-1">📊</div>
              <div className="text-sm font-medium">Relatórios</div>
            </button>
            <button 
              onClick={() => startTutorial(tutorials.find(t => t.id === 'settings'))}
              className="p-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow text-center"
            >
              <div className="text-2xl mb-1">⚙️</div>
              <div className="text-sm font-medium">Configurações</div>
            </button>
          </div>
        </div>
      </div>

      <TutorialModal />
    </div>
  );
};

export default TutorialSystem;