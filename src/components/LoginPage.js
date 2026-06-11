import React, { useState } from 'react';
import { useAuth } from 'react-oidc-context';

function LoginPage() {
  const auth = useAuth();
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setLoginError(null);
      await auth.signinRedirect();
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">
          🔐
        </div>
        
        <h2 className="login-title">IdentityHub Portal</h2>
        <p className="login-subtitle">
          Secure, single sign-on access to your Contact Management dashboard using authorization code with PKCE.
        </p>

        {loginError && (
          <div className="alert-message alert-error" style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <div>
              <strong>Login Error:</strong> {loginError}
              <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', opacity: 0.8 }}>
                Please try again or contact support if the problem persists.
              </div>
            </div>
          </div>
        )}

        <button 
          className="contact-btn btn-primary" 
          onClick={handleLogin}
          disabled={isLoading}
          style={{ 
            fontSize: '1rem', 
            padding: '0.8rem 2.5rem',
            width: '100%',
            height: '52px',
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Redirecting to IdentityHub...' : 'Login with IdentityHub'}
        </button>

        <ul className="security-list">
          <li className="security-item">
            <span className="security-icon">✓</span> Authorization Code + PKCE Flow
          </li>
          <li className="security-item">
            <span className="security-icon">✓</span> Automatic Silent Token Renewal
          </li>
          <li className="security-item">
            <span className="security-icon">✓</span> Secure Session Management
          </li>
          <li className="security-item">
            <span className="security-icon">✓</span> Protected Token Storage
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LoginPage;