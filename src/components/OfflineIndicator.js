
import React from 'react';
import usePWA from '../hooks/usePWA';

const OfflineIndicator = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
      <div className="flex items-center justify-center">
        <i data-feather="wifi-off" className="w-4 h-4 mr-2"></i>
        <span className="text-sm font-medium">
          Você está offline. Algumas funcionalidades podem estar limitadas.
        </span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
