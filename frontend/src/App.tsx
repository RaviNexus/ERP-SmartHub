import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AppShell from './pages/AppShell';
import DashboardPage from './pages/DashboardPage';
import PlaceholderPage from './pages/PlaceholderPage';
import NotFound from './pages/NotFound';
import RequireAuth from './components/RequireAuth';
import { useAuthStore } from './state/authStore';
import InventoryPage from './pages/InventoryPage';
import ProductFormPage from './pages/ProductFormPage';

function HomeRedirect() {
  const token = useAuthStore((s) => s.token);
  return <Navigate to={token ? '/app' : '/login'} replace />;
}

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="crm" element={<PlaceholderPage title="CRM" />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="inventory/new" element={<ProductFormPage mode="create" />} />
          <Route path="inventory/edit" element={<ProductFormPage mode="edit" />} />
          <Route path="sales" element={<PlaceholderPage title="Sales" />} />
          <Route path="purchase" element={<PlaceholderPage title="Purchase" />} />
          <Route path="finance" element={<PlaceholderPage title="Finance" />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}