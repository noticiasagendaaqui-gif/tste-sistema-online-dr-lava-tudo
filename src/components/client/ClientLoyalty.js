
import React, { useState } from 'react';

const ClientLoyalty = ({ user }) => {
  const [loyaltyData, setLoyaltyData] = useState({
    currentPoints: 875,
    totalEarned: 2500,
    totalRedeemed: 1625,
    level: 'Ouro',
    nextLevel: 'Platinum',
    pointsToNextLevel: 125,
    memberSince: '2023-06-15'
  });

  const [pointsHistory, setPointsHistory] = useState([
    {
      id: 1,
      date: '2024-01-20',
      description: 'Limpeza Residencial Completa',
      points: 180,
      type: 'ganho'
    },
    {
      id: 2,
      date: '2024-01-18',
      description: 'Bônus de Aniversário',
      points: 50,
      type: 'bonus'
    },
    {
      id: 3,
      date: '2024-01-15',
      description: 'Desconto de 10% usado',
      points: -100,
      type: 'resgate'
    },
    {
      id: 4,
      date: '2024-01-10',
      description: 'Limpeza Pós-Obra',
      points: 350,
      type: 'ganho'
    },
    {
      id: 5,
      date: '2024-01-05',
      description: 'Indicação de amigo',
      points: 200,
      type: 'bonus'
    }
  ]);

  const [availableRewards, setAvailableRewards] = useState([
    {
      id: 1,
      name: 'Desconto de 10%',
      description: 'Desconto de 10% em qualquer serviço',
      points: 500,
      image: '🎫',
      available: true
    },
    {
      id: 2,
      name: 'Desconto de 20%',
      description: 'Desconto de 20% em qualquer serviço',
      points: 800,
      image: '🎟️',
      available: true
    },
    {
      id: 3,
      name: 'Limpeza Gratuita',
      description: 'Uma limpeza residencial gratuita',
      points: 2000,
      image: '🏠',
      available: false
    },
    {
      id: 4,
      name: 'Kit de Produtos Premium',
      description: 'Kit completo de produtos de limpeza premium',
      points: 1200,
      image: '🧽',
      available: false
    }
  ]);

  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  const getLevelColor = (level) => {
    switch (level) {
      case 'Bronze': return 'text-orange-600 bg-orange-100';
      case 'Prata': return 'text-gray-600 bg-gray-100';
      case 'Ouro': return 'text-yellow-600 bg-yellow-100';
      case 'Platinum': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'ganho': return 'text-green-600';
      case 'bonus': return 'text-blue-600';
      case 'resgate': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleRedeem = (reward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    if (loyaltyData.currentPoints >= selectedReward.points) {
      setLoyaltyData(prev => ({
        ...prev,
        currentPoints: prev.currentPoints - selectedReward.points,
        totalRedeemed: prev.totalRedeemed + selectedReward.points
      }));

      setPointsHistory(prev => [{
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        description: `Resgate: ${selectedReward.name}`,
        points: -selectedReward.points,
        type: 'resgate'
      }, ...prev]);

      alert(`Parabéns! Você resgatou: ${selectedReward.name}`);
    }
    
    setShowRedeemModal(false);
    setSelectedReward(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Pontos & Recompensas</h2>
          <p className="text-gray-600 mt-1">Acumule pontos e ganhe recompensas incríveis</p>
        </div>
      </div>

      {/* Loyalty Overview */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg text-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-primary-100 text-sm">Pontos Atuais</p>
            <p className="text-3xl font-bold">{loyaltyData.currentPoints}</p>
          </div>
          <div className="text-center">
            <p className="text-primary-100 text-sm">Nível Atual</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(loyaltyData.level)}`}>
              {loyaltyData.level}
            </span>
          </div>
          <div className="text-center">
            <p className="text-primary-100 text-sm">Próximo Nível</p>
            <p className="text-lg font-semibold">{loyaltyData.nextLevel}</p>
            <p className="text-sm text-primary-100">Faltam {loyaltyData.pointsToNextLevel} pontos</p>
          </div>
          <div className="text-center">
            <p className="text-primary-100 text-sm">Membro desde</p>
            <p className="text-lg font-semibold">{loyaltyData.memberSince}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-primary-100 mb-2">
            <span>{loyaltyData.level}</span>
            <span>{loyaltyData.nextLevel}</span>
          </div>
          <div className="w-full bg-primary-800 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((1000 - loyaltyData.pointsToNextLevel) / 1000) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Ganho</p>
              <p className="text-2xl font-bold text-gray-900">{loyaltyData.totalEarned}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-red-600 text-xl">🎁</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Resgatado</p>
              <p className="text-2xl font-bold text-gray-900">{loyaltyData.totalRedeemed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Saldo Disponível</p>
              <p className="text-2xl font-bold text-gray-900">{loyaltyData.currentPoints}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recompensas Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableRewards.map((reward) => (
            <div key={reward.id} className="border rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">{reward.image}</div>
              <h4 className="font-medium text-gray-900 mb-1">{reward.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
              <p className="text-lg font-bold text-primary-600 mb-3">{reward.points} pontos</p>
              <button
                onClick={() => handleRedeem(reward)}
                disabled={!reward.available || loyaltyData.currentPoints < reward.points}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  reward.available && loyaltyData.currentPoints >= reward.points
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loyaltyData.currentPoints >= reward.points ? 'Resgatar' : 'Pontos Insuficientes'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Points History */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Pontos</h3>
        <div className="space-y-3">
          {pointsHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{item.description}</p>
                <p className="text-sm text-gray-600">{item.date}</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${getTypeColor(item.type)}`}>
                  {item.points > 0 ? '+' : ''}{item.points} pontos
                </p>
                <span className="text-xs text-gray-500 capitalize">{item.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirmar Resgate</h3>
            
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{selectedReward?.image}</div>
              <h4 className="font-medium text-gray-900 mb-2">{selectedReward?.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{selectedReward?.description}</p>
              <p className="text-lg font-bold text-primary-600">
                {selectedReward?.points} pontos
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between text-sm">
                <span>Pontos atuais:</span>
                <span className="font-semibold">{loyaltyData.currentPoints}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Custo do resgate:</span>
                <span className="font-semibold text-red-600">-{selectedReward?.points}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Saldo após resgate:</span>
                  <span>{loyaltyData.currentPoints - (selectedReward?.points || 0)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={confirmRedeem}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Confirmar Resgate
              </button>
              <button
                onClick={() => {
                  setShowRedeemModal(false);
                  setSelectedReward(null);
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

export default ClientLoyalty;
