import React from 'react';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import TermsPage from './components/legal/TermsPage';
import PrivacyPage from './components/legal/PrivacyPage';
import RegisterPage from './components/auth/RegisterPage';
import ExamManagement from './components/admin/views/exam/ExamManagement';

function App() {
  const path = window.location.pathname;

  if (path === '/terms') {
    return <TermsPage />;
  }

  if (path === '/privacy') {
    return <PrivacyPage />;
  }

  if (path === '/register') {
    return <RegisterPage />;
  }

  if (path === '/exams') {
    return <ExamManagement />;
  }

  const isAdminPath = path.startsWith('/admin');
  return isAdminPath ? <AdminLayout /> : <Layout />;
}

export default App;