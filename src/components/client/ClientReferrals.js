
import React, { useState } from 'react';

const ClientReferrals = ({ user }) => {
  const [referralData, setReferralData] = useState({
    totalReferrals: 3,
    successfulReferrals: 2,
    pendingReferrals: 1,
    totalEarned: 400,
    referralCode: 'LIMPA2024MARIA'
  });

  const [referrals, setReferrals] = useState([
    {
      id: 1,
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      phone: '(11) 99999-1111',
      status: 'confirmado',
      dateReferred: '2024-01-10',
      dateConverted: '2024-01-15',
      pointsEarned: 200,
      serviceHired: 'Limpeza Residencial'
    },
    {
      id: 2,
      name: 'Carlos Santos',
      email: 'carlos.santos@email.com',
      phone: '(11) 99999-2222',
      status: 'confirmado',
      dateReferred: '2024-01-05',
      dateConverted: '2024-01-08',
      pointsEarned: 200,
      serviceHired: 'Limpeza Pós-Obra'
    },
    {
      id: 3,
      name: 'Julia Costa',
      email: 'julia.costa@email.com',
      phone: '(11) 99999-3333',
      status: 'pendente',
      dateReferred: '2024-01-20',
      dateConverted: null,
      pointsEarned: 0,
      serviceHired: null
    }
  ]);

  const [showReferralModal, setShowReferralModal] = useState(false);
  const [newReferral, setNewReferral] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleReferralSubmit = () => {
    const referral = {
      id: Date.now(),
      ...newReferral,
      status: 'pendente',
      dateReferred: new Date().toISOString().split('T')[0],
      dateConverted: null,
      pointsEarned: 0,
      serviceHired: null
    };

    setReferrals([referral, ...referrals]);
    setReferralData(prev => ({
      ...prev,
      totalReferrals: prev.totalReferrals + 1,
      pendingReferrals: prev.pendingReferrals + 1
    }));

    setShowReferralModal(false);
    setNewReferral({ name: '', email: '', phone: '' });
    alert('Indicação enviada com sucesso! Seu amigo receberá um convite por email.');
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralData.referralCode);
    alert('Código de indicação copiado!');
  };

  const shareWhatsApp = () => {
    const message = `Olá! Eu uso a LimpaBrasil e recomendo muito! Use meu código ${referralData.referralCode} e ganhe desconto no primeiro serviço. Acesse: ${window.location.origin}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'expirado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Programa de Indicações</h2>
          <p className="text-gray-600 mt-1">Indique amigos e ganhe pontos a cada nova contratação</p>
        </div>
        <button
          onClick={() => setShowReferralModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Indicar Amigo
        </button>
      </div>

      {/* Referral Overview */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-purple-100 text-sm">Total de Indicações</p>
            <p className="text-3xl font-bold">{referralData.totalReferrals}</p>
          </div>
          <div className="text-center">
            <p className="text-purple-100 text-sm">Confirmadas</p>
            <p className="text-3xl font-bold">{referralData.successfulReferrals}</p>
          </div>
          <div className="text-center">
            <p className="text-purple-100 text-sm">Pontos Ganhos</p>
            <p className="text-3xl font-bold">{referralData.totalEarned}</p>
          </div>
          <div className="text-center">
            <p className="text-purple-100 text-sm">Taxa de Conversão</p>
            <p className="text-3xl font-bold">
              {referralData.totalReferrals > 0 
                ? Math.round((referralData.successfulReferrals / referralData.totalReferrals) * 100)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Referral Code & Sharing */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seu Código de Indicação</h3>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Seu código único</p>
              <p className="text-2xl font-bold text-primary-600">{referralData.referralCode}</p>
            </div>
            <button
              onClick={copyReferralCode}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Copiar Código
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={shareWhatsApp}
            className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>📱</span>
            <span>Compartilhar no WhatsApp</span>
          </button>
          
          <button
            onClick={() => {
              const text = `Confira a LimpaBrasil! Use o código ${referralData.referralCode} e ganhe desconto.`;
              navigator.share({ title: 'LimpaBrasil', text, url: window.location.origin });
            }}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>📤</span>
            <span>Compartilhar</span>
          </button>
          
          <button
            onClick={() => {
              const subject = 'Indicação LimpaBrasil';
              const body = `Olá! Eu uso a LimpaBrasil e recomendo muito! Use meu código ${referralData.referralCode} e ganhe desconto no primeiro serviço.`;
              window.location.href = `mailto:?subject=${subject}&body=${body}`;
            }}
            className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>📧</span>
            <span>Enviar por Email</span>
          </button>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Como Funciona</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">1. Indique um Amigo</h4>
            <p className="text-sm text-gray-600">Compartilhe seu código de indicação com amigos e familiares</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧹</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">2. Amigo Contrata</h4>
            <p className="text-sm text-gray-600">Seu amigo contrata um serviço usando seu código</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎁</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">3. Vocês Ganham</h4>
            <p className="text-sm text-gray-600">Você ganha 200 pontos e seu amigo ganha 10% de desconto</p>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Suas Indicações</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amigo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data da Indicação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço Contratado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pontos Ganhos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {referrals.map((referral) => (
                <tr key={referral.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{referral.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{referral.contact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      referral.status === 'completed' ? 'bg-green-100 text-green-800' :
                      referral.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {referral.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {referral.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {referral.service || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {referral.points || 0} pts
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{referral.email}</div>
                    <div className="text-sm text-gray-500">{referral.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(referral.status)}`}>
                      {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{referral.dateReferred}</div>
                    {referral.dateConverted && (
                      <div className="text-sm text-gray-500">Converteu: {referral.dateConverted}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {referral.serviceHired || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-semibold ${referral.pointsEarned > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                      {referral.pointsEarned > 0 ? `+${referral.pointsEarned}` : '0'} pontos
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {referrals.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Você ainda não fez nenhuma indicação.</p>
          </div>
        )}
      </div>

      {/* Referral Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Indicar Amigo</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={newReferral.name}
                  onChange={(e) => setNewReferral({...newReferral, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newReferral.email}
                  onChange={(e) => setNewReferral({...newReferral, email: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={newReferral.phone}
                  onChange={(e) => setNewReferral({...newReferral, phone: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleReferralSubmit}
                disabled={!newReferral.name || !newReferral.email}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Enviar Indicação
              </button>
              <button
                onClick={() => {
                  setShowReferralModal(false);
                  setNewReferral({ name: '', email: '', phone: '' });
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientReferrals;
