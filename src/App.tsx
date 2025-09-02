import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout/Layout';
import { CameraPage } from './pages/CameraPage';
import { AdminLogin } from './pages/AdminLogin';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Attendance } from './pages/Attendance';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Smart Attendance System...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Camera Page */}
        <Route path="/" element={<CameraPage />} />
        
        {/* Admin Login Route - Always accessible */}
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Protected Admin Routes - Only accessible when logged in */}
        {user ? (
          <>
            <Route path="/dashboard" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/students" element={
              <Layout>
                <Students />
              </Layout>
            } />
            <Route path="/attendance" element={
              <Layout>
                <Attendance />
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
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <Route path="/*" element={<Navigate to="/admin" replace />} />
        )}
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;