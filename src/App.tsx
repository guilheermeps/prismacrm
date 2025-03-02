
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
import Reports from './pages/Reports';
import Financial from './pages/Financial';
import Schedule from './pages/Schedule';
import Scheduling from './pages/Scheduling';
import ClientRegistration from './pages/ClientRegistration';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Router>
        <Routes>
          {/* Rota pública */}
          <Route path="/client-registration/:token" element={<ClientRegistration />} />
          
          {/* Rotas sem verificação de autenticação */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pipeline" element={<SalesPipeline />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders-contracts" element={<OrdersContracts />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/scheduling" element={<Scheduling />} />
          
          {/* Rota para páginas não encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}

export default App;
