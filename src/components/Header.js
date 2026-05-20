import React from 'react';
import { useAuth } from 'react-oidc-context';

function Header() {
  const auth = useAuth();

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>React OIDC App</h1>
        {auth.isAuthenticated && (
          <div>
            <span style={{ marginRight: '20px' }}>
              Welcome, {auth.user?.profile?.name || auth.user?.profile?.email || 'User'}
            </span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;