import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    company: {
      name: 'LimpaBrasil',
      email: 'contato@limpabrasil.com',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      cnpj: '12.345.678/0001-90'
    },
    booking: {
      workingHours: {
        start: '08:00',
        end: '18:00'
      },
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      minAdvanceHours: 2,
      maxAdvanceDays: 30
    },
    notification: {
      email: true,
      sms: false,
      whatsapp: true,
      push: true
    },
    payment: {
      methods: ['credit_card', 'debit_card', 'pix', 'boleto'],
      requireAdvancePayment: false,
      advancePaymentPercentage: 50,
      mercadoPago: {
        enabled: false,
        environment: 'sandbox',
        publicKey: '',
        accessToken: '',
        webhookUrl: `https://${window.location.hostname}/api/webhooks/mercadopago`,
        maxInstallments: 12,
        currency: 'BRL',
        paymentMethods: ['credit_card', 'debit_card', 'pix', 'boleto']
      }
    },
    pricing: {
      baseServiceFee: 50,
      transportFee: 15,
      urgentServiceMultiplier: 1.5,
      discountFirstTime: 0.1
    },
    system: {
      maintenanceMode: false,
      allowRegistration: true,
      sessionTimeout: 30,
      backupFrequency: 'daily'
    }
  });

  const [activeTab, setActiveTab] = useState('company');
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const updateNestedSetting = (category, subcategory, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: {
          ...prev[category][subcategory],
          [key]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Simular salvamento
    console.log('Configurações salvas:', settings);
    alert('Configurações salvas com sucesso!');
    setHasChanges(false);
  };

  const resetSettings = () => {
    if (window.confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      // Aqui você restauraria as configurações padrão
      alert('Configurações restauradas!');
      setHasChanges(false);
    }
  };

  const tabs = [
    { id: 'company', label: 'Empresa', icon: '🏢' },
    { id: 'booking', label: 'Agendamentos', icon: '📅' },
    { id: 'pricing', label: 'Preços', icon: '💰' },
    { id: 'notifications', label: 'Notificações', icon: '🔔' },
    { id: 'payment', label: 'Pagamentos', icon: '💳' },
    { id: 'system', label: 'Sistema', icon: '⚙️' }
  ];

  const CompanySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Informações da Empresa</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
          <input
            type="text"
            value={settings.company.name}
            onChange={(e) => updateSetting('company', 'name', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
          <input
            type="text"
            value={settings.company.cnpj}
            onChange={(e) => updateSetting('company', 'cnpj', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={settings.company.email}
            onChange={(e) => updateSetting('company', 'email', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input
            type="tel"
            value={settings.company.phone}
            onChange={(e) => updateSetting('company', 'phone', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
        <textarea
          value={settings.company.address}
          onChange={(e) => updateSetting('company', 'address', e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const BookingSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Configurações de Agendamento</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Antecedência Mínima (horas)
          </label>
          <input
            type="number"
            value={settings.booking.minAdvanceHours}
            onChange={(e) => updateSetting('booking', 'minAdvanceHours', parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Antecedência Máxima (dias)
          </label>
          <input
            type="number"
            value={settings.booking.maxAdvanceDays}
            onChange={(e) => updateSetting('booking', 'maxAdvanceDays', parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Início</label>
          <input
            type="time"
            value={settings.booking.workingHours.start}
            onChange={(e) => updateNestedSetting('booking', 'workingHours', 'start', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Fim</label>
          <input
            type="time"
            value={settings.booking.workingHours.end}
            onChange={(e) => updateNestedSetting('booking', 'workingHours', 'end', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Dias de Funcionamento</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'monday', label: 'Segunda' },
            { id: 'tuesday', label: 'Terça' },
            { id: 'wednesday', label: 'Quarta' },
            { id: 'thursday', label: 'Quinta' },
            { id: 'friday', label: 'Sexta' },
            { id: 'saturday', label: 'Sábado' },
            { id: 'sunday', label: 'Domingo' }
          ].map(day => (
            <label key={day.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.booking.workingDays.includes(day.id)}
                onChange={(e) => {
                  const newDays = e.target.checked
                    ? [...settings.booking.workingDays, day.id]
                    : settings.booking.workingDays.filter(d => d !== day.id);
                  updateSetting('booking', 'workingDays', newDays);
                }}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{day.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const PricingSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Configurações de Preços</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Taxa Base de Serviço (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.pricing.baseServiceFee}
            onChange={(e) => updateSetting('pricing', 'baseServiceFee', parseFloat(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Taxa de Transporte (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.pricing.transportFee}
            onChange={(e) => updateSetting('pricing', 'transportFee', parseFloat(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Multiplicador Serviço Urgente
          </label>
          <input
            type="number"
            step="0.1"
            value={settings.pricing.urgentServiceMultiplier}
            onChange={(e) => updateSetting('pricing', 'urgentServiceMultiplier', parseFloat(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Desconto Primeira Vez (%)
          </label>
          <input
            type="number"
            step="0.01"
            max="1"
            min="0"
            value={settings.pricing.discountFirstTime}
            onChange={(e) => updateSetting('pricing', 'discountFirstTime', parseFloat(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Configurações de Notificações</h3>

      <div className="space-y-4">
        {[
          { key: 'email', label: 'Email' },
          { key: 'sms', label: 'SMS' },
          { key: 'whatsapp', label: 'WhatsApp' },
          { key: 'push', label: 'Notificações Push' }
        ].map(notification => (
          <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{notification.label}</p>
              <p className="text-sm text-gray-600">
                {settings.notification[notification.key] ? 'Ativado' : 'Desativado'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notification[notification.key]}
                onChange={(e) => updateSetting('notification', notification.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const PaymentSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Métodos de Pagamento</h3>

      <div className="space-y-4">
        {[
          { key: 'credit_card', label: 'Cartão de Crédito', icon: '💳' },
          { key: 'debit_card', label: 'Cartão de Débito', icon: '💳' },
          { key: 'pix', label: 'PIX', icon: '📱' },
          { key: 'boleto', label: 'Boleto', icon: '📄' }
        ].map(payment => (
          <div key={payment.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{payment.icon}</span>
              <div>
                <p className="font-medium text-gray-900">{payment.label}</p>
                <p className="text-sm text-gray-600">
                  {settings.payment.methods.includes(payment.key) ? 'Aceito' : 'Não aceito'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.payment.methods.includes(payment.key)}
                onChange={(e) => {
                  const newMethods = e.target.checked
                    ? [...(settings.payment.methods || []), payment.key]
                    : (settings.payment.methods || []).filter(m => m !== payment.key);
                  updateSetting('payment', 'methods', newMethods);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-3">
          <input
            type="checkbox"
            checked={settings.payment.requireAdvancePayment}
            onChange={(e) => updateSetting('payment', 'requireAdvancePayment', e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label className="font-medium text-gray-900">Exigir Pagamento Antecipado</label>
        </div>

        {settings.payment.requireAdvancePayment && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Percentual do Pagamento Antecipado (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.payment.advancePaymentPercentage}
              onChange={(e) => updateSetting('payment', 'advancePaymentPercentage', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Mercado Pago Settings */}
      <div className="mt-8 space-y-6 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900">Configurações do Mercado Pago</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Ativar Mercado Pago</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.payment.mercadoPago.enabled}
                onChange={(e) => updateNestedSetting('payment', 'mercadoPago', 'enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {settings.payment.mercadoPago.enabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ambiente</label>
                  <select
                    value={settings.payment.mercadoPago.environment}
                    onChange={(e) => updateNestedSetting('payment', 'mercadoPago', 'environment', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="sandbox">Sandbox</option>
                    <option value="production">Produção</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chave Pública (Public Key)</label>
                  <input
                    type="text"
                    value={settings.payment.mercadoPago.publicKey}
                    onChange={(e) => updateNestedSetting('payment', 'mercadoPago', 'publicKey', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                  <input
                    type="text"
                    value={settings.payment.mercadoPago.accessToken}
                    onChange={(e) => updateNestedSetting('payment', 'mercadoPago', 'accessToken', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Máximo de Parcelas</label>
                  <input
                    type="number"
                    min="1"
                    value={settings.payment.mercadoPago.maxInstallments}
                    onChange={(e) => updateNestedSetting('payment', 'mercadoPago', 'maxInstallments', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Moeda</label>
                  <input
                    type="text"
                    value={settings.payment.mercadoPago.currency}
                    onChange={(e) => updateNestedSetting('payment', 'mercadoPago', 'currency', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">Métodos de Pagamento Aceitos</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { key: 'credit_card', label: 'Cartão de Crédito' },
                    { key: 'debit_card', label: 'Cartão de Débito' },
                    { key: 'pix', label: 'PIX' },
                    { key: 'boleto', label: 'Boleto' }
                  ].map(method => (
                    <label key={method.key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.payment.mercadoPago.paymentMethods.includes(method.key)}
                        onChange={(e) => {
                          const newMethods = e.target.checked
                            ? [...settings.payment.mercadoPago.paymentMethods, method.key]
                            : settings.payment.mercadoPago.paymentMethods.filter(m => m !== method.key);
                          updateNestedSetting('payment', 'mercadoPago', 'paymentMethods', newMethods);
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const SystemSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Configurações do Sistema</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Modo de Manutenção</p>
            <p className="text-sm text-gray-600">Bloqueia o acesso de usuários ao sistema</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.system.maintenanceMode}
              onChange={(e) => updateSetting('system', 'maintenanceMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Permitir Novos Registros</p>
            <p className="text-sm text-gray-600">Permite que novos usuários se registrem</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.system.allowRegistration}
              onChange={(e) => updateSetting('system', 'allowRegistration', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timeout de Sessão (minutos)
          </label>
          <input
            type="number"
            value={settings.system.sessionTimeout}
            onChange={(e) => updateSetting('system', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequência de Backup</label>
          <select
            value={settings.system.backupFrequency}
            onChange={(e) => updateSetting('system', 'backupFrequency', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'company': return <CompanySettings />;
      case 'booking': return <BookingSettings />;
      case 'pricing': return <PricingSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'payment': return <PaymentSettings />;
      case 'system': return <SystemSettings />;
      default: return <CompanySettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Configurações</h2>
          <p className="text-gray-600 mt-1">Gerencie as configurações do sistema</p>
        </div>

        {hasChanges && (
          <div className="flex space-x-3">
            <button
              onClick={resetSettings}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Restaurar
            </button>
            <button
              onClick={saveSettings}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        )}
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;