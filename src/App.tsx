import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
import Dashboard from './pages/Dashboard';
import ServiceList from './pages/ServiceList';
import ServiceForm from './pages/ServiceForm';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          
          <Route path="/services" element={
            <Layout>
              <ServiceList />
            </Layout>
          } />
          
          <Route path="/services/new" element={
            <Layout>
              <ServiceForm />
            </Layout>
          } />
          
          <Route path="/services/:id" element={
            <Layout>
              <ServiceForm />
            </Layout>
          } />
          
          <Route path="/reports" element={
            <Layout>
              <Reports />
            </Layout>
          } />
          
          <Route path="/settings" element={
            <Layout>
              <Settings />
            </Layout>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ErrorBoundary>
    );
}
