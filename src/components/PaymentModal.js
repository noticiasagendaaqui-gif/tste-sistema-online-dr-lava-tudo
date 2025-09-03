
import React, { useState, useEffect } from 'react';
import mercadoPagoService from '../services/mercadoPagoService';

const PaymentModal = ({ isOpen, onClose, bookingData, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    cardHolder: '',
    documentType: 'CPF',
    documentNumber: '',
    email: ''
  });
  const [pixData, setPixData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadPaymentMethods();
    }
  }, [isOpen]);

  const loadPaymentMethods = async () => {
    try {
      const methods = await mercadoPagoService.getPaymentMethods();
      setPaymentMethods(methods.results || []);
    } catch (error) {
      console.error('Erro ao carregar métodos de pagamento:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})/, '$1/').substr(0, 5);
  };

  const processPayment = async () => {
    setLoading(true);
    setPaymentStatus(null);

    try {
      const paymentData = {
        amount: bookingData.totalPrice,
        description: `Serviço: ${bookingData.serviceName}`,
        bookingId: bookingData.id,
        serviceType: bookingData.serviceType,
        customerId: bookingData.customerId,
        payer: {
          email: formData.email,
          firstName: formData.cardHolder.split(' ')[0],
          lastName: formData.cardHolder.split(' ').slice(1).join(' '),
          identificationType: formData.documentType,
          identificationNumber: formData.documentNumber
        }
      };

      let result;

      if (selectedMethod === 'pix') {
        result = await mercadoPagoService.createPixPayment(paymentData);
        setPixData(result);
        setPaymentStatus('pending_pix');
      } else {
        paymentData.paymentMethodId = selectedMethod;
        result = await mercadoPagoService.createServicePayment(paymentData);
        
        if (result.status === 'approved') {
          setPaymentStatus('success');
          onPaymentSuccess && onPaymentSuccess(result);
        } else if (result.status === 'pending') {
          setPaymentStatus('pending');
        } else {
          setPaymentStatus('error');
        }
      }
    } catch (error) {
      console.error('Erro no pagamento:', error);
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (selectedMethod === 'pix') {
      return formData.email && formData.documentNumber;
    }
    
    return (
      formData.cardNumber.length >= 13 &&
      formData.expiryDate.length === 5 &&
      formData.securityCode.length >= 3 &&
      formData.cardHolder.trim() &&
      formData.documentNumber &&
      formData.email
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Pagamento</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Resumo do Pedido */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Resumo do Pedido</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Serviço:</span>
                <span className="font-medium">{bookingData?.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span>Data:</span>
                <span>{bookingData?.date}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-primary-600">
                  {mercadoPagoService.formatCurrency(bookingData?.totalPrice || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Status do Pagamento */}
          {paymentStatus && (
            <div className="mb-6">
              {paymentStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-green-600 text-2xl mr-3">✅</div>
                    <div>
                      <h4 className="font-semibold text-green-900">Pagamento Aprovado!</h4>
                      <p className="text-green-700">Seu pagamento foi processado com sucesso.</p>
                    </div>
                  </div>
                </div>
              )}

              {paymentStatus === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-yellow-600 text-2xl mr-3">⏳</div>
                    <div>
                      <h4 className="font-semibold text-yellow-900">Pagamento Pendente</h4>
                      <p className="text-yellow-700">Aguardando confirmação do pagamento.</p>
                    </div>
                  </div>
                </div>
              )}

              {paymentStatus === 'pending_pix' && pixData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-center">
                    <h4 className="font-semibold text-blue-900 mb-3">Pagamento PIX</h4>
                    <div className="bg-white p-4 rounded-lg mb-4">
                      <img 
                        src={pixData.point_of_interaction?.transaction_data?.qr_code} 
                        alt="QR Code PIX" 
                        className="mx-auto w-48 h-48"
                      />
                    </div>
                    <p className="text-blue-700 text-sm mb-2">
                      Escaneie o QR Code ou use o PIX Copia e Cola
                    </p>
                    <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                      {pixData.point_of_interaction?.transaction_data?.ticket_url}
                    </div>
                    <p className="text-red-600 text-sm mt-2">
                      Expira em: {new Date(pixData.date_of_expiration).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}

              {paymentStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-red-600 text-2xl mr-3">❌</div>
                    <div>
                      <h4 className="font-semibold text-red-900">Pagamento Recusado</h4>
                      <p className="text-red-700">Tente novamente ou use outro método de pagamento.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Seleção de Método de Pagamento */}
          {!paymentStatus && (
            <>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Método de Pagamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        selectedMethod === method.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <img
                        src={method.secure_thumbnail}
                        alt={method.name}
                        className="w-12 h-8 mx-auto mb-2 object-contain"
                      />
                      <span className="text-sm font-medium">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulário de Dados */}
              {selectedMethod && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CPF/CNPJ
                      </label>
                      <input
                        type="text"
                        name="documentNumber"
                        value={formData.documentNumber}
                        onChange={handleInputChange}
                        placeholder="000.000.000-00"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>

                  {selectedMethod !== 'pix' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número do Cartão
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            cardNumber: formatCardNumber(e.target.value)
                          }))}
                          placeholder="0000 0000 0000 0000"
                          maxLength="19"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Validade
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              expiryDate: formatExpiryDate(e.target.value)
                            }))}
                            placeholder="MM/AA"
                            maxLength="5"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="securityCode"
                            value={formData.securityCode}
                            onChange={handleInputChange}
                            placeholder="000"
                            maxLength="4"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>

                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome no Cartão
                          </label>
                          <input
                            type="text"
                            name="cardHolder"
                            value={formData.cardHolder}
                            onChange={handleInputChange}
                            placeholder="Nome completo"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={processPayment}
                  disabled={!isFormValid() || loading}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processando...' : `Pagar ${mercadoPagoService.formatCurrency(bookingData?.totalPrice || 0)}`}
                </button>
              </div>
            </>
          )}

          {/* Botões após Pagamento */}
          {paymentStatus && (
            <div className="flex justify-center space-x-4 mt-6 pt-6 border-t border-gray-200">
              {paymentStatus === 'success' && (
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Continuar
                </button>
              )}
              {(paymentStatus === 'error' || paymentStatus === 'pending') && (
                <>
                  <button
                    onClick={() => {
                      setPaymentStatus(null);
                      setPixData(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Tentar Novamente
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Fechar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
