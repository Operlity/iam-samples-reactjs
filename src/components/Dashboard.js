import React from 'react';
import { useAuth } from 'react-oidc-context';
import ContactManagement from './ContactManagement';

function Dashboard() {
  const auth = useAuth();
  const user = auth.user?.profile;
  
  const displayName = user?.name || user?.preferred_username || user?.email || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="dashboard-wrapper">
      {/* Hero Header Section */}
      <section className="profile-hero" style={{ padding: '2rem 3rem', borderRadius: '24px', marginBottom: '2rem' }}>
        <div className="avatar-large" style={{ width: '80px', height: '80px', borderRadius: '20px', fontSize: '2rem' }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ color: 'var(--accent)', margin: 0, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
            Welcome back
          </h4>
          <h1 style={{ fontSize: '2.25rem', margin: '0.25rem 0 0 0', fontWeight: 700 }}>
            {displayName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0.25rem 0 0 0' }}>
            {user?.email}
          </p>
        </div>
        <button onClick={() => auth.signoutRedirect()} className="logout-pill" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
          Sign Out
        </button>
      </section>

      {/* Info Cards Grid (Top Display) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Personal Details Card */}
        <div className="info-card" style={{ padding: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            👤 Personal Details
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.15rem' }}>First Name</span>
              <span style={{ fontWeight: 600 }}>{user?.given_name || '—'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.15rem' }}>Last Name</span>
              <span style={{ fontWeight: 600 }}>{user?.family_name || '—'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.15rem' }}>Preferred Username</span>
              <span style={{ fontWeight: 600 }}>{user?.preferred_username || '—'}</span>
            </div>
          </div>
        </div>

        {/* Connection Security Card */}
        <div className="info-card" style={{ padding: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            🛡️ Session & Token
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.15rem' }}>Session / Identity ID</span>
              <span style={{ fontFamily: 'monospace', opacity: 0.8, wordBreak: 'break-all', fontSize: '0.8rem' }}>{user?.sub || '—'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.15rem' }}>Authentication Method</span>
              <span style={{ fontWeight: 600 }}>OIDC + PKCE Flow</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.15rem' }}>Session Token Expiration</span>
              <span style={{ fontWeight: 600 }}>{new Date(auth.user?.expires_at * 1000).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace: Contact Management */}
      <main>
        <ContactManagement />
      </main>

      {/* Footer Branding */}
      <footer style={{ marginTop: '5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2.5rem', paddingBottom: '3rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>
          Securely connected to <strong>Operlity IdentityHub</strong>
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;