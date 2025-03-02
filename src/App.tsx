
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "@/pages/Dashboard";
import SalesPipeline from "@/pages/SalesPipeline";
import Contacts from "@/pages/Contacts";
import OrdersContracts from "@/pages/OrdersContracts";
import Orders from "@/pages/Orders";
import Contracts from "@/pages/Contracts";
import Scheduling from "@/pages/Scheduling";
import Financial from "@/pages/Financial";
import Projects from "@/pages/Projects";
import Products from "@/pages/Products";
import Settings from "@/pages/Settings";
import Reports from "@/pages/Reports";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const AppRoutes = () => {
  return (
    <Routes>
      {/* Direct access to dashboard without authentication */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sales-pipeline" element={<SalesPipeline />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/orders-contracts" element={<OrdersContracts />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/contracts" element={<Contracts />} />
      <Route path="/schedule" element={<Scheduling />} />
      <Route path="/financial" element={<Financial />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/products" element={<Products />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
