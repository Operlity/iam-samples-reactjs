import React from 'react';
import { useAuth } from 'react-oidc-context';

function Dashboard() {
  const auth = useAuth();
  const user = auth.user?.profile;
  
  const displayName = user?.name || user?.preferred_username || user?.email || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="dashboard-wrapper">
      {/* Hero Section */}
      <section className="profile-hero">
        <div className="avatar-large">{initials}</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ color: 'var(--accent)', margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Verified Profile</h4>
          <h1 style={{ fontSize: '3rem', margin: '0.5rem 0' }}>{displayName}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{user?.email}</p>
        </div>
        <button onClick={() => auth.signoutRedirect()} className="logout-pill">
          Sign Out
        </button>
      </section>

      {/* Stats/Info Grid */}
      <div className="info-grid">
        <div className="info-card">
          <span className="card-label">Identity ID</span>
          <div className="card-value">{user?.sub}</div>
        </div>
        <div className="info-card">
          <span className="card-label">Authentication Method</span>
          <div className="card-value">OIDC + PKCE</div>
        </div>
        <div className="info-card">
          <span className="card-label">Token Expiry</span>
          <div className="card-value">{new Date(auth.user?.expires_at * 1000).toLocaleTimeString()}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Profile Details Section */}
        <section className="info-card" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--primary)' }}>●</span> Profile Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(user || {}).map(([key, value]) => (
              ['name', 'email', 'preferred_username', 'given_name', 'family_name'].includes(key) && (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key.replace('_', ' ')}</span>
                  <span>{String(value)}</span>
                </div>
              )
            ))}
          </div>
        </section>

        {/* Identity Hub Raw Data */}
        <section>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Identity Hub Metadata</h3>
          <div className="code-box">
            <pre style={{ margin: 0 }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </section>
      </div>

      {/* Footer Branding */}
      <footer style={{ marginTop: '4rem', textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--glass-border)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          Securely connected to <strong>Operlity IdentityHub</strong>
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;