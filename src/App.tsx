
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { ModalProvider } from './providers/ModalProvider';
import { LoadingScreen } from './components/ui/loading-screen';

// Lazy-loaded components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SalesPipeline = lazy(() => import('./pages/SalesPipeline'));
const Contacts = lazy(() => import('./pages/Contacts'));
const Contracts = lazy(() => import('./pages/Contracts'));
const Orders = lazy(() => import('./pages/Orders'));
const Settings = lazy(() => import('./pages/Settings'));
const AuthPage = lazy(() => import('./pages/Auth'));
const AIAssistantPage = lazy(() => import('./pages/AIAssistant'));

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <QueryProvider>
          <AuthProvider>
            <ModalProvider>
              <Toaster position="top-right" richColors />
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/sales-pipeline" element={<SalesPipeline />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/contracts" element={<Contracts />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/ai-assistant" element={<AIAssistantPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </ModalProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
