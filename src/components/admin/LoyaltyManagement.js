
import React, { useState } from 'react';

const LoyaltyManagement = () => {
  const [loyaltySettings, setLoyaltySettings] = useState({
    pointsPerReal: 1,
    welcomeBonus: 100,
    birthdayBonus: 50,
    referralBonus: 200,
    minimumRedemption: 100,
    pointExpiration: 365 // dias
  });

  const [rewards, setRewards] = useState([
    {
      id: 1,
      name: 'Desconto de 10%',
      description: 'Desconto de 10% em qualquer serviço',
      points: 500,
      type: 'desconto',
      value: 10,
      active: true,
      used: 45
    },
    {
      id: 2,
      name: 'Limpeza Gratuita',
      description: 'Uma limpeza residencial gratuita',
      points: 2000,
      type: 'servico',
      value: 150,
      active: true,
      used: 12
    },
    {
      id: 3,
      name: 'Produto de Limpeza',
      description: 'Kit de produtos de limpeza premium',
      points: 800,
      type: 'produto',
      value: 80,
      active: false,
      used: 8
    }
  ]);

  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Maria Silva',
      email: 'maria@email.com',
      points: 1250,
      totalEarned: 2500,
      totalRedeemed: 1250,
      level: 'Ouro',
      joinDate: '2023-06-15',
      lastActivity: '2024-01-18'
    },
    {
      id: 2,
      name: 'João Santos',
      email: 'joao@email.com',
      points: 750,
      totalEarned: 1200,
      totalRedeemed: 450,
      level: 'Prata',
      joinDate: '2023-08-20',
      lastActivity: '2024-01-15'
    },
    {
      id: 3,
      name: 'Ana Costa',
      email: 'ana@email.com',
      points: 350,
      totalEarned: 600,
      totalRedeemed: 250,
      level: 'Bronze',
      joinDate: '2023-12-10',
      lastActivity: '2024-01-20'
    }
  ]);

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    points: '',
    type: 'desconto',
    value: '',
    active: true
  });

  const updateSetting = (key, value) => {
    setLoyaltySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAddReward = () => {
    const reward = {
      id: rewards.length + 1,
      ...newReward,
      points: parseInt(newReward.points),
      value: parseFloat(newReward.value),
      used: 0
    };
    
    setRewards([...rewards, reward]);
    setNewReward({ name: '', description: '', points: '', type: 'desconto', value: '', active: true });
    setShowRewardModal(false);
  };

  const handleUpdateReward = () => {
    setRewards(rewards.map(reward => 
      reward.id === editingReward.id ? editingReward : reward
    ));
    setEditingReward(null);
  };

  const deleteReward = (rewardId) => {
    if (window.confirm('Tem certeza que deseja excluir esta recompensa?')) {
      setRewards(rewards.filter(reward => reward.id !== rewardId));
    }
  };

  const adjustMemberPoints = (memberId, points, reason) => {
    setMembers(members.map(member => {
      if (member.id === memberId) {
        const newPoints = Math.max(0, member.points + points);
        return {
          ...member,
          points: newPoints,
          totalEarned: points > 0 ? member.totalEarned + points : member.totalEarned,
          totalRedeemed: points < 0 ? member.totalRedeemed + Math.abs(points) : member.totalRedeemed
        };
      }
      return member;
    }));
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Ouro': return 'bg-yellow-100 text-yellow-800';
      case 'Prata': return 'bg-gray-100 text-gray-800';
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const RewardModal = ({ reward, onSave, onClose, isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {isEdit ? 'Editar Recompensa' : 'Nova Recompensa'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={reward.name}
              onChange={(e) => isEdit 
                ? setEditingReward({...reward, name: e.target.value})
                : setNewReward({...reward, name: e.target.value})
              }
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={reward.description}
              onChange={(e) => isEdit 
                ? setEditingReward({...reward, description: e.target.value})
                : setNewReward({...reward, description: e.target.value})
              }
              className="w-full border rounded-lg px-3 py-2"
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pontos</label>
              <input
                type="number"
                value={reward.points}
                onChange={(e) => isEdit 
                  ? setEditingReward({...reward, points: e.target.value})
                  : setNewReward({...reward, points: e.target.value})
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={reward.type}
                onChange={(e) => isEdit 
                  ? setEditingReward({...reward, type: e.target.value})
                  : setNewReward({...reward, type: e.target.value})
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="desconto">Desconto</option>
                <option value="servico">Serviço</option>
                <option value="produto">Produto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor ({reward.type === 'desconto' ? '%' : 'R$'})
            </label>
            <input
              type="number"
              step="0.01"
              value={reward.value}
              onChange={(e) => isEdit 
                ? setEditingReward({...reward, value: e.target.value})
                : setNewReward({...reward, value: e.target.value})
              }
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={reward.active}
              onChange={(e) => isEdit 
                ? setEditingReward({...reward, active: e.target.checked})
                : setNewReward({...reward, active: e.target.checked})
              }
              className="mr-2"
            />
            <label className="text-sm text-gray-700">Ativo</label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {isEdit ? 'Atualizar' : 'Criar'} Recompensa
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Programa de Fidelidade</h2>
          <p className="text-gray-600 mt-1">Gerencie pontos, recompensas e membros</p>
        </div>
        <button
          onClick={() => setShowRewardModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          Nova Recompensa
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Membros Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pontos em Circulação</p>
              <p className="text-2xl font-bold text-gray-900">
                {members.reduce((acc, m) => acc + m.points, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">🎁</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recompensas Ativas</p>
              <p className="text-2xl font-bold text-gray-900">{rewards.filter(r => r.active).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">🔄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resgates este Mês</p>
              <p className="text-2xl font-bold text-gray-900">67</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações do Programa */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações do Programa</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pontos por R$ gasto
            </label>
            <input
              type="number"
              value={loyaltySettings.pointsPerReal}
              onChange={(e) => updateSetting('pointsPerReal', parseInt(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bônus de Boas-vindas
            </label>
            <input
              type="number"
              value={loyaltySettings.welcomeBonus}
              onChange={(e) => updateSetting('welcomeBonus', parseInt(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bônus de Aniversário
            </label>
            <input
              type="number"
              value={loyaltySettings.birthdayBonus}
              onChange={(e) => updateSetting('birthdayBonus', parseInt(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bônus por Indicação
            </label>
            <input
              type="number"
              value={loyaltySettings.referralBonus}
              onChange={(e) => updateSetting('referralBonus', parseInt(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resgate Mínimo
            </label>
            <input
              type="number"
              value={loyaltySettings.minimumRedemption}
              onChange={(e) => updateSetting('minimumRedemption', parseInt(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiração (dias)
            </label>
            <input
              type="number"
              value={loyaltySettings.pointExpiration}
              onChange={(e) => updateSetting('pointExpiration', parseInt(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Recompensas */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recompensas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pontos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usadas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rewards.map((reward) => (
                <tr key={reward.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{reward.name}</div>
                      <div className="text-sm text-gray-500">{reward.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 capitalize">
                    {reward.type}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {reward.points.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {reward.type === 'desconto' ? `${reward.value}%` : `R$ ${reward.value}`}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      reward.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {reward.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {reward.used}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingReward(reward)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteReward(reward.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Membros */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Membros do Programa</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Membro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nível</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pontos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Ganho</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Resgatado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Atividade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(member.level)}`}>
                      {member.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {member.points.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {member.totalEarned.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {member.totalRedeemed.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(member.lastActivity).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          const points = prompt('Pontos a adicionar/remover (use - para remover):');
                          if (points) {
                            adjustMemberPoints(member.id, parseInt(points), 'Ajuste manual');
                          }
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Ajustar Pontos
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showRewardModal && (
        <RewardModal
          reward={newReward}
          onSave={handleAddReward}
          onClose={() => {
            setShowRewardModal(false);
            setNewReward({ name: '', description: '', points: '', type: 'desconto', value: '', active: true });
          }}
        />
      )}

      {editingReward && (
        <RewardModal
          reward={editingReward}
          isEdit={true}
          onSave={handleUpdateReward}
          onClose={() => setEditingReward(null)}
        />
      )}
    </div>
  );
};

export default LoyaltyManagement;
