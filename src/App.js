import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Breadcrumbs from './components/Breadcrumbs';
import Header from './components/Header';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import ClientDashboard from './pages/ClientDashboard';
import AuthModal from './components/AuthModal';
import PWAInstaller from './components/PWAInstaller'; // Assumindo que este componente foi criado
import OfflineIndicator from './components/OfflineIndicator'; // Assumindo que este componente foi criado
import UpdatePrompt from './components/UpdatePrompt'; // Assumindo que este componente foi criado
import GoogleAnalytics from './components/GoogleAnalytics';
import Blog from './components/Blog';

function App() {
  useEffect(() => {
    // Initialize feather icons
    if (window.feather) {
      window.feather.replace();
    }
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <GoogleAnalytics />
        <div className="bg-white">
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/cliente/*" element={<ClientDashboard />} />
          <Route path="/*" element={
            <>
              <Header />
              <Breadcrumbs />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/sobre" element={<About />} />
                  <Route path="/servicos" element={<Services />} />
                  <Route path="/agendamento" element={<Booking />} />
                  <Route path="/contato" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                </Routes>
              </main>
              <Footer />
              <LiveChat />
              <AuthModal />
              <PWAInstaller />
              <OfflineIndicator />
              <UpdatePrompt />
            </>
          } />
        </Routes>
      </div>
    </Router>
    </HelmetProvider>
  );
}

export default App;