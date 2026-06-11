import React from 'react';
import { AuthProvider } from 'react-oidc-context';
import { oidcConfig } from './config/oidcConfig';
import MainContent from './components/MainContent';
import './App.css';

// Handle post-logout redirect path from Identity Hub gracefully
if (window.location.pathname === '/sign-out' || window.location.pathname.endsWith('/sign-out')) {
  window.location.replace('/');
}

function App() {
  return (
    <AuthProvider {...oidcConfig}>
      <MainContent />
    </AuthProvider>
  );
}

export default App;