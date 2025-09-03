import React, { useState, useEffect } from 'react';

const PWAInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = window.navigator.standalone === true;

    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
      return;
    }

    // Show install prompt for devices that support PWA but don't have the beforeinstallprompt event
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isHttps = window.location.protocol === 'https:';

    if (isMobile && isHttps && !isStandalone && !isInWebAppiOS) {
      // Show install prompt after a delay if no beforeinstallprompt event is fired
      const timer = setTimeout(() => {
        if (!deferredPrompt && !showInstallPrompt) {
          setShowInstallPrompt(true);
        }
      }, 3000);

      // Clear timer if beforeinstallprompt fires
      const handleBeforeInstallPrompt = (e) => {
        clearTimeout(timer);
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallPrompt(true);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, [deferredPrompt, showInstallPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }

      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } else {
      // For browsers that don't support beforeinstallprompt, show instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert('Para instalar este app no iOS:\n1. Toque no botão compartilhar\n2. Selecione "Adicionar à Tela de Início"');
      } else {
        alert('Para instalar este app:\n1. Abra o menu do navegador\n2. Selecione "Instalar app" ou "Adicionar à tela inicial"');
      }
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (isInstalled || !showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white border border-secondary-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="bg-primary-100 rounded-full p-2">
            <i data-feather="smartphone" className="w-5 h-5 text-primary-600"></i>
          </div>
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium text-secondary-900">
            Instalar LimpaBrasil
          </h4>
          <p className="text-xs text-secondary-600 mt-1">
            Acesse rapidamente nossos serviços direto da tela inicial do seu dispositivo
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleInstallClick}
              className="bg-primary-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-primary-700 transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={handleDismiss}
              className="text-secondary-600 px-3 py-1 rounded text-xs hover:text-secondary-800 transition-colors"
            >
              Agora não
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 ml-2 text-secondary-400 hover:text-secondary-600"
        >
          <i data-feather="x" className="w-4 h-4"></i>
        </button>
      </div>
    </div>
  );
};

export default PWAInstaller;