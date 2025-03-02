
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import Dashboard from './pages/Dashboard';
import SalesPipeline from './pages/SalesPipeline';
import Contacts from './pages/Contacts';
import NotFound from './pages/NotFound';
import OrdersContracts from './pages/OrdersContracts';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Contracts from './pages/Contracts';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import Reports from './pages/Reports';
import Financial from './pages/Financial';
import Schedule from './pages/Schedule';
import Scheduling from './pages/Scheduling';
import ClientRegistration from './pages/ClientRegistration';
import { useState, useEffect } from 'react';
import { isAuthenticated } from './lib/supabase/auth';

function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Router>
        <Routes>
          {/* Rota pública */}
          <Route path="/auth" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Auth />} />
          <Route path="/client-registration/:token" element={<ClientRegistration />} />
          
          {/* Rotas protegidas */}
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/auth" />} />
          <Route path="/pipeline" element={isLoggedIn ? <SalesPipeline /> : <Navigate to="/auth" />} />
          <Route path="/contacts" element={isLoggedIn ? <Contacts /> : <Navigate to="/auth" />} />
          <Route path="/orders-contracts" element={isLoggedIn ? <OrdersContracts /> : <Navigate to="/auth" />} />
          <Route path="/orders" element={isLoggedIn ? <Orders /> : <Navigate to="/auth" />} />
          <Route path="/products" element={isLoggedIn ? <Products /> : <Navigate to="/auth" />} />
          <Route path="/contracts" element={isLoggedIn ? <Contracts /> : <Navigate to="/auth" />} />
          <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/auth" />} />
          <Route path="/reports" element={isLoggedIn ? <Reports /> : <Navigate to="/auth" />} />
          <Route path="/financial" element={isLoggedIn ? <Financial /> : <Navigate to="/auth" />} />
          <Route path="/schedule" element={isLoggedIn ? <Schedule /> : <Navigate to="/auth" />} />
          <Route path="/scheduling" element={isLoggedIn ? <Scheduling /> : <Navigate to="/auth" />} />
          
          {/* Rota para páginas não encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}

export default App;
