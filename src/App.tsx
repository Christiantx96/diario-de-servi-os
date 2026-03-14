import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import ServiceList from './pages/ServiceList';
import ServiceForm from './pages/ServiceForm';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-center text-brown-primary/60">Carregando sessão...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Login Route (sem Layout) */}
            <Route path="/login" element={<Login />} />
            
            {/* Rotas com Layout protegidas */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            
            <Route
              path="/services"
              element={
                <PrivateRoute>
                  <Layout>
                    <ServiceList />
                  </Layout>
                </PrivateRoute>
              }
            />
            
            <Route
              path="/services/new"
              element={
                <PrivateRoute>
                  <Layout>
                    <ServiceForm />
                  </Layout>
                </PrivateRoute>
              }
            />
            
            <Route
              path="/services/:id"
              element={
                <PrivateRoute>
                  <Layout>
                    <ServiceForm />
                  </Layout>
                </PrivateRoute>
              }
            />
            
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Layout>
                    <Reports />
                  </Layout>
                </PrivateRoute>
              }
            />
            
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Rota 404 - Redireciona para home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
