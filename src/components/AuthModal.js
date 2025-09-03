import React, { useState } from 'react';

// Supondo que emailService.js exporta uma função sendWelcomeEmail
// Exemplo: import emailService from './emailService';
// Para este exemplo, vamos simular a função
const emailService = {
  sendWelcomeEmail: async (email, name) => {
    console.log(`Simulando envio de email para ${name} (${email})`);
    // Em um cenário real, aqui você faria a chamada para sua API de email
    // Exemplo:
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ to: email, subject: 'Bem-vindo!', text: `Olá ${name}, bem-vindo ao nosso serviço!` }),
    // });
    // if (!response.ok) {
    //   throw new Error('Falha ao enviar email');
    // }
    return Promise.resolve(); // Simula sucesso
  }
};


const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoginMode) {
      // Verificar credenciais de admin
      if (formData.email === 'williamiurd.ramos@gmail.com' && formData.password === '153020william') {
        const userData = {
          name: 'William Ramos',
          email: formData.email,
          role: 'admin',
          avatar: `https://ui-avatars.com/api/?name=William+Ramos&background=dc2626&color=fff&size=128`
        };

        localStorage.setItem('user', JSON.stringify(userData));
        onLogin(userData);
        onClose();
        return;
      }

      // Simular autenticação para outros usuários
      const userData = {
        name: formData.email.split('@')[0],
        email: formData.email,
        role: formData.email.includes('admin') ? 'admin' : 'user',
        avatar: `https://ui-avatars.com/api/?name=${formData.email.split('@')[0]}&background=0ea5e9&color=fff&size=128`
      };
      localStorage.setItem('user', JSON.stringify(userData));
      onLogin(userData);
      onClose();
    } else {
      // Simular registro
      handleRegister(e); // Chama a nova função handleRegister
    }

    // Reset form
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    // Simular registro
    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      role: 'user',
      avatar: `https://ui-avatars.com/api/?name=${formData.name.replace(/\s+/g, '+')}&background=0ea5e9&color=fff&size=128`,
      createdAt: new Date().toISOString()
    };

    // Salvar usuário no localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Enviar email de boas-vindas
    try {
      await emailService.sendWelcomeEmail(formData.email, formData.name);
    } catch (error) {
      console.error('Erro ao enviar email de boas-vindas:', error);
    }

    onLogin(newUser);
    onClose();
    alert('Conta criada com sucesso! Verifique seu email para a mensagem de boas-vindas.');
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLoginMode ? 'Entrar' : 'Criar Conta'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i data-feather="x" className="w-6 h-6"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              {isLoginMode ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {isLoginMode ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
            </button>
          </div>

          {isLoginMode && (
            <>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Esqueci minha senha
                </button>
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">
                  Acesso rápido para demonstração:
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        email: 'williamiurd.ramos@gmail.com',
                        password: '153020william'
                      });
                    }}
                    className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm hover:bg-red-100 transition-colors"
                  >
                    👨‍💼 Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        email: 'cliente@teste.com',
                        password: '123456'
                      });
                    }}
                    className="px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                  >
                    👤 Cliente
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Clique para preencher automaticamente
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;