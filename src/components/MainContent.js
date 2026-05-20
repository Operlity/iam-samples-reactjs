import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import Dashboard from './Dashboard';

function MainContent() {
  const auth = useAuth();

  // Automatically trigger signin redirect if not authenticated
  useEffect(() => {
    // Only redirect if we are not loading, not authenticated, 
    // not currently in a redirect/popup flow, and have no error.
    if (!auth.isLoading && !auth.isAuthenticated && !auth.activeNavigator && !auth.error) {
      console.log('Redirecting to IdentityHub...');
      auth.signinRedirect();
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.activeNavigator, auth.error, auth]);

  // Handle successful authentication callback
  // react-oidc-context handles this automatically, but we can log it
  useEffect(() => {
    if (auth.isAuthenticated) {
      console.log('User authenticated successfully');
    }
  }, [auth.isAuthenticated]);

  if (auth.isLoading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
            {auth.isAuthenticated ? 'Loading Profile...' : 'Redirecting to IdentityHub...'}
          </p>
        </div>
      </div>
    );
  }

  if (auth.error) {
    console.error('Auth Error:', auth.error);
    return (
      <div className="app-container">
        <div className="glass-card" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <h2 style={{ color: '#f5576c', marginBottom: '1rem' }}>Authentication Error</h2>
          <div style={{ background: 'rgba(245, 87, 108, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.9rem' }}>
            <p><strong>Message:</strong> {auth.error.message}</p>
            {auth.error.error_description && <p><strong>Details:</strong> {auth.error.error_description}</p>}
          </div>
          <button className="btn-logout" onClick={() => {
            auth.removeUser();
            window.location.href = '/';
          }}>
            Reset & Try Again
          </button>
        </div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="app-container">
      <div className="loading-container">
        <div className="spinner" style={{ borderTopColor: 'var(--accent)' }}></div>
        <p style={{ marginTop: '1rem' }}>Connecting to Security Gateway...</p>
      </div>
    </div>
  );
}

export default MainContent;