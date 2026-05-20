import React from 'react';
import { AuthProvider } from 'react-oidc-context';
import { oidcConfig } from './config/oidcConfig';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  return (
    <AuthProvider {...oidcConfig}>
      <MainContent />
    </AuthProvider>
  );
}

export default App;