
import { useState } from 'react';
import emailService from '../services/emailService';

export const useEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendEmail = async (type, data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      switch (type) {
        case 'welcome':
          result = await emailService.sendWelcomeEmail(data.email, data.name);
          break;
        case 'booking_confirmation':
          result = await emailService.sendBookingConfirmation(data.email, data.booking);
          break;
        case 'booking_reminder':
          result = await emailService.sendBookingReminder(data.email, data.booking);
          break;
        case 'quote':
          result = await emailService.sendQuote(data.email, data.quote);
          break;
        case 'evaluation':
          result = await emailService.sendServiceEvaluation(data.email, data.booking);
          break;
        default:
          throw new Error('Tipo de email não suportado');
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendWelcomeEmail = (email, name) => 
    sendEmail('welcome', { email, name });

  const sendBookingConfirmation = (email, booking) => 
    sendEmail('booking_confirmation', { email, booking });

  const sendBookingReminder = (email, booking) => 
    sendEmail('booking_reminder', { email, booking });

  const sendQuote = (email, quote) => 
    sendEmail('quote', { email, quote });

  const sendEvaluation = (email, booking) => 
    sendEmail('evaluation', { email, booking });

  return {
    isLoading,
    error,
    sendWelcomeEmail,
    sendBookingConfirmation,
    sendBookingReminder,
    sendQuote,
    sendEvaluation
  };
};

export default useEmail;
