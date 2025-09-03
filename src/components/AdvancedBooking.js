
import React, { useState, useEffect } from 'react';

const AdvancedBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const [bookingData, setBookingData] = useState({
    serviceType: '',
    frequency: 'unica',
    address: '',
    rooms: 1,
    bathrooms: 1,
    area: '',
    extras: [],
    urgency: 'normal',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      notes: ''
    }
  });

  const services = [
    { id: 'residencial', name: 'Limpeza Residencial', duration: 180, price: 120 },
    { id: 'comercial', name: 'Limpeza Comercial', duration: 240, price: 200 },
    { id: 'pos-obra', name: 'Limpeza Pós-Obra', duration: 360, price: 300 },
    { id: 'carpetes', name: 'Limpeza de Carpetes', duration: 120, price: 80 },
    { id: 'vidros', name: 'Limpeza de Vidros', duration: 90, price: 60 }
  ];

  const extraServices = [
    { id: 'geladeira', name: 'Limpeza de Geladeira', price: 30 },
    { id: 'forno', name: 'Limpeza de Forno', price: 25 },
    { id: 'organizacao', name: 'Organização', price: 50 },
    { id: 'enceramento', name: 'Enceramento', price: 40 }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, [currentStep]);

  useEffect(() => {
    if (selectedDate) {
      generateAvailableSlots();
    }
  }, [selectedDate, bookingData.serviceType]);

  const generateAvailableSlots = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const service = services.find(s => s.id === bookingData.serviceType);
      const duration = service?.duration || 180;
      
      // Simulate availability (some slots might be taken)
      const unavailableSlots = ['10:00', '14:00']; // Mock unavailable slots
      
      const available = timeSlots
        .filter(slot => !unavailableSlots.includes(slot))
        .map(slot => ({
          time: slot,
          available: Math.random() > 0.3, // 70% chance of being available
          duration: duration
        }));
      
      setAvailableSlots(available);
      setLoading(false);
    }, 1000);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isPast = date < new Date().setHours(0, 0, 0, 0);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      days.push({
        date: day,
        fullDate: date,
        isToday,
        isPast,
        isWeekend,
        available: !isPast && !isWeekend
      });
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTotal = () => {
    const service = services.find(s => s.id === bookingData.serviceType);
    const basePrice = service?.price || 0;
    const extrasPrice = bookingData.extras.reduce((sum, extraId) => {
      const extra = extraServices.find(e => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);
    
    let total = basePrice + extrasPrice;
    
    // Apply frequency discount
    if (bookingData.frequency === 'semanal') total *= 0.8;
    else if (bookingData.frequency === 'quinzenal') total *= 0.85;
    else if (bookingData.frequency === 'mensal') total *= 0.9;
    
    // Apply urgency fee
    if (bookingData.urgency === 'urgente') total *= 1.3;
    else if (bookingData.urgency === 'hoje') total *= 1.5;
    
    return total;
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingDataChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonalInfoChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    const finalBooking = {
      ...bookingData,
      date: selectedDate,
      time: selectedTime,
      total: calculateTotal()
    };
    
    console.log('Booking submitted:', finalBooking);
    alert('Agendamento realizado com sucesso!');
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map(step => (
        <React.Fragment key={step}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-primary-600' : 'bg-gray-300'
            }`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center mb-6">Selecione o Serviço</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {services.map(service => (
          <div
            key={service.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              bookingData.serviceType === service.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
            onClick={() => handleBookingDataChange('serviceType', service.id)}
          >
            <h4 className="font-semibold text-lg mb-2">{service.name}</h4>
            <div className="flex justify-between items-center">
              <span className="text-primary-600 font-bold">R$ {service.price}</span>
              <span className="text-sm text-gray-500">{service.duration} min</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Frequência</label>
          <select
            value={bookingData.frequency}
            onChange={(e) => handleBookingDataChange('frequency', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="unica">Única vez</option>
            <option value="semanal">Semanal (20% desc.)</option>
            <option value="quinzenal">Quinzenal (15% desc.)</option>
            <option value="mensal">Mensal (10% desc.)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Urgência</label>
          <select
            value={bookingData.urgency}
            onChange={(e) => handleBookingDataChange('urgency', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="normal">Normal</option>
            <option value="urgente">Urgente (+30%)</option>
            <option value="hoje">Para hoje (+50%)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Serviços Extras</label>
        <div className="grid grid-cols-2 gap-3">
          {extraServices.map(extra => (
            <label key={extra.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={bookingData.extras.includes(extra.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleBookingDataChange('extras', [...bookingData.extras, extra.id]);
                  } else {
                    handleBookingDataChange('extras', bookingData.extras.filter(id => id !== extra.id));
                  }
                }}
                className="rounded"
              />
              <span className="text-sm">{extra.name} (+R$ {extra.price})</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center mb-6">Escolha a Data</h3>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <i data-feather="chevron-left" className="w-5 h-5"></i>
          </button>
          
          <h4 className="text-lg font-semibold">
            {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h4>
          
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <i data-feather="chevron-right" className="w-5 h-5"></i>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth(currentMonth).map((day, index) => (
            <div key={index} className="aspect-square">
              {day && (
                <button
                  disabled={!day.available}
                  onClick={() => setSelectedDate(day.fullDate)}
                  className={`w-full h-full flex items-center justify-center text-sm rounded transition-all ${
                    selectedDate?.toDateString() === day.fullDate.toDateString()
                      ? 'bg-primary-600 text-white'
                      : day.available
                        ? 'hover:bg-primary-100 text-gray-900'
                        : 'text-gray-400 cursor-not-allowed'
                  } ${day.isToday ? 'ring-2 ring-primary-300' : ''}`}
                >
                  {day.date}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="text-center p-4 bg-primary-50 rounded-lg">
          <p className="text-primary-700">
            Data selecionada: <strong>{formatDate(selectedDate)}</strong>
          </p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center mb-6">Escolha o Horário</h3>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando horários disponíveis...</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {availableSlots.map(slot => (
            <button
              key={slot.time}
              disabled={!slot.available}
              onClick={() => setSelectedTime(slot.time)}
              className={`p-3 rounded-lg border transition-all ${
                selectedTime === slot.time
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : slot.available
                    ? 'border-gray-300 hover:border-primary-300 hover:bg-primary-50'
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      )}

      {selectedTime && (
        <div className="text-center p-4 bg-primary-50 rounded-lg">
          <p className="text-primary-700">
            Horário selecionado: <strong>{selectedTime}</strong>
          </p>
          <p className="text-sm text-primary-600 mt-1">
            Duração estimada: {services.find(s => s.id === bookingData.serviceType)?.duration} minutos
          </p>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center mb-6">Confirmar Agendamento</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-4">Dados Pessoais</h4>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome completo"
              value={bookingData.personalInfo.name}
              onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="email"
              placeholder="E-mail"
              value={bookingData.personalInfo.email}
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="tel"
              placeholder="Telefone"
              value={bookingData.personalInfo.phone}
              onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <textarea
              placeholder="Observações"
              value={bookingData.personalInfo.notes}
              onChange={(e) => handlePersonalInfoChange('notes', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="3"
            ></textarea>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Resumo do Pedido</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span>Serviço:</span>
              <span>{services.find(s => s.id === bookingData.serviceType)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Data:</span>
              <span>{selectedDate && formatDate(selectedDate).split(',')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span>Horário:</span>
              <span>{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Frequência:</span>
              <span>{bookingData.frequency}</span>
            </div>
            {bookingData.extras.length > 0 && (
              <div className="flex justify-between">
                <span>Extras:</span>
                <span>{bookingData.extras.length} itens</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>R$ {calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Agendamento <span className="text-primary-600">Avançado</span>
            </h2>
            <p className="text-xl text-secondary-600">
              Sistema completo de agendamento em 4 passos simples
            </p>
          </div>

          <StepIndicator />

          <div className="bg-white rounded-xl shadow-lg p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !bookingData.serviceType) ||
                    (currentStep === 2 && !selectedDate) ||
                    (currentStep === 3 && !selectedTime)
                  }
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Confirmar Agendamento
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedBooking;
