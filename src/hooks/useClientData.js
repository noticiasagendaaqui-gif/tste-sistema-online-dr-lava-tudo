
import { useState, useEffect } from 'react';
import clientService from '../services/clientService';

export const useClientData = (userId) => {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    if (!userId) return;

    setLoading(true);
    try {
      const userBookings = clientService.getUserBookings(userId);
      const userPayments = clientService.getUserPayments(userId);
      const userLoyalty = clientService.getUserLoyalty(userId);
      const userReferrals = clientService.getUserReferrals(userId);
      const userStats = clientService.getUserStats(userId);

      // Se não há dados, gerar dados de exemplo
      if (userBookings.length === 0 && userPayments.length === 0) {
        clientService.generateSampleData(userId);
        
        // Recarregar dados após gerar exemplos
        setBookings(clientService.getUserBookings(userId));
        setPayments(clientService.getUserPayments(userId));
        setLoyalty(clientService.getUserLoyalty(userId));
        setReferrals(clientService.getUserReferrals(userId));
        setStats(clientService.getUserStats(userId));
      } else {
        setBookings(userBookings);
        setPayments(userPayments);
        setLoyalty(userLoyalty);
        setReferrals(userReferrals);
        setStats(userStats);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const addBooking = (booking) => {
    const newBooking = clientService.addBooking(userId, booking);
    setBookings(prev => [newBooking, ...prev]);
    setStats(clientService.getUserStats(userId));
    return newBooking;
  };

  const updateBooking = (bookingId, updates) => {
    const updatedBooking = clientService.updateBooking(userId, bookingId, updates);
    if (updatedBooking) {
      setBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));
      setStats(clientService.getUserStats(userId));
    }
    return updatedBooking;
  };

  const processPayment = (paymentId, method) => {
    const processedPayment = clientService.processPayment(userId, paymentId, method);
    if (processedPayment) {
      setPayments(prev => prev.map(p => p.id === paymentId ? processedPayment : p));
      setStats(clientService.getUserStats(userId));
    }
    return processedPayment;
  };

  const addLoyaltyPoints = (points, description, type) => {
    const updatedLoyalty = clientService.addLoyaltyPoints(userId, points, description, type);
    setLoyalty(updatedLoyalty);
    setStats(clientService.getUserStats(userId));
    return updatedLoyalty;
  };

  const addReferral = (referral) => {
    const newReferral = clientService.addReferral(userId, referral);
    setReferrals(prev => [newReferral, ...prev]);
    setStats(clientService.getUserStats(userId));
    return newReferral;
  };

  const confirmReferral = (referralId, serviceHired) => {
    const confirmedReferral = clientService.confirmReferral(userId, referralId, serviceHired);
    if (confirmedReferral) {
      setReferrals(prev => prev.map(r => r.id === referralId ? confirmedReferral : r));
      setLoyalty(clientService.getUserLoyalty(userId));
      setStats(clientService.getUserStats(userId));
    }
    return confirmedReferral;
  };

  return {
    bookings,
    payments,
    loyalty,
    referrals,
    stats,
    loading,
    addBooking,
    updateBooking,
    processPayment,
    addLoyaltyPoints,
    addReferral,
    confirmReferral,
    refreshData: loadData
  };
};
