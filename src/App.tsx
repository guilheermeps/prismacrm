
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Payments from "./pages/Payments";
import Schedule from "./pages/Schedule";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import OrdersContracts from "./pages/OrdersContracts";
import Products from "./pages/Products";
import Contacts from "./pages/Contacts";
import SalesPipeline from "./pages/SalesPipeline";
import ClientRegistration from "./pages/ClientRegistration";
import Financial from "./pages/Financial";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/orders-contracts" element={<OrdersContracts />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/sales-pipeline" element={<SalesPipeline />} />
          <Route path="/register/:token" element={<ClientRegistration />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/settings" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
