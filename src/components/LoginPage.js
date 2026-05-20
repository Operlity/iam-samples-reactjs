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
    <div className="login-container">
      <div className="welcome-section">
        <h2>Welcome to React OIDC App</h2>
        <p style={{ marginBottom: '30px', fontSize: '18px', color: '#555' }}>
          Secure authentication using Authorization Code + PKCE flow
        </p>

        {loginError && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '15px', 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            borderRadius: '5px',
            border: '1px solid #f5c6cb'
          }}>
            <strong>Login Error:</strong> {loginError}
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              Please try again or contact support if the problem persists.
            </p>
          </div>
        )}

        <button 
          className="btn btn-primary" 
          onClick={handleLogin}
          disabled={isLoading}
          style={{ 
            fontSize: '18px', 
            padding: '15px 40px',
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Redirecting...' : 'Login with IdentityHub'}
        </button>
      </div>

      <div className="user-info" style={{ marginTop: '40px' }}>
        <h3>Security Features</h3>
        <ul style={{ textAlign: 'left', lineHeight: '2', fontSize: '16px' }}>
          <li>✓ Authorization Code + PKCE Flow</li>
          <li>✓ Automatic Silent Token Renewal</li>
          <li>✓ Secure Session Management</li>
          <li>✓ Protected Token Storage</li>
          <li>✓ Industry-Standard Security</li>
        </ul>
      </div>
    </div>
  );
}

export default LoginPage;