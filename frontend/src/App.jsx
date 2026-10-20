import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { UserAuthPage } from './pages/auth/UserAuthPage';
import { OwnerAuthPage } from './pages/auth/OwnerAuthPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { UserDashboard } from './pages/user/UserDashboard';
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { OwnerKYCPage } from './pages/owner/OwnerKYCPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PopularRoutesPage } from './pages/PopularRoutesPage';
import { ProfilePage } from './pages/ProfilePage';

const AuthLoadingScreen = () => (
  <div style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 24px' }}>
    <div className="glass-panel" style={{ padding: '32px', marginBottom: '28px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="skeleton" style={{ width: '56px', height: '56px', borderRadius: '16px' }} />
        <div>
          <div className="skeleton" style={{ width: '240px', height: '26px', borderRadius: '6px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '340px', height: '16px', borderRadius: '4px' }} />
        </div>
      </div>
      <div className="skeleton" style={{ width: '150px', height: '40px', borderRadius: '10px' }} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="glass-panel" style={{ padding: '24px' }}>
          <div className="skeleton" style={{ width: '100px', height: '14px', borderRadius: '4px', marginBottom: '10px' }} />
          <div className="skeleton" style={{ width: '60px', height: '32px', borderRadius: '6px' }} />
        </div>
      ))}
    </div>
  </div>
);

function AppContent() {
  const { currentUser, role, loading } = useAuth();
  const [currentView, setCurrentView] = useState('home');

  // Sync pathname routing with window location (e.g. /admin-dashboard instead of #admin-dashboard)
  useEffect(() => {
    const handleLocationChange = () => {
      // Support legacy hash if present and rewrite to clean pathname:
      if (window.location.hash) {
        const hashView = window.location.hash.replace('#', '').replace(/^\//, '');
        const targetPath = hashView === 'home' || !hashView ? '/' : `/${hashView}`;
        window.history.replaceState({}, '', targetPath);
        setCurrentView(hashView || 'home');
        return;
      }

      const rawPath = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
      const view = rawPath || 'home';
      setCurrentView(view);
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleNavigate = (view) => {
    const cleanView = view.replace(/^\//, '').replace(/^#/, '') || 'home';
    const targetPath = cleanView === 'home' ? '/' : `/${cleanView}`;

    setCurrentView(cleanView);
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Ambient Lighting Orbs in Background */}
      <div className="ambient-bg">
        <div className="ambient-orb-1" />
        <div className="ambient-orb-2" />
        <div className="ambient-orb-3" />
      </div>

      {/* Main Navbar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        {currentView === 'home' && (
          currentUser && role === 'admin' ? (
            <AdminDashboard onNavigate={handleNavigate} />
          ) : currentUser && role === 'owner' ? (
            <OwnerDashboard onNavigate={handleNavigate} />
          ) : (
            <LandingPage onNavigate={handleNavigate} />
          )
        )}
        {currentView === 'popular-routes' && (
          currentUser && role === 'admin' ? (
            <AdminDashboard onNavigate={handleNavigate} />
          ) : currentUser && role === 'owner' ? (
            <OwnerDashboard onNavigate={handleNavigate} />
          ) : (
            <PopularRoutesPage onNavigate={handleNavigate} />
          )
        )}
        {currentView === 'user-auth' && (
          currentUser && role === 'user' ? (
            <UserDashboard onNavigate={handleNavigate} />
          ) : (
            <UserAuthPage onNavigate={handleNavigate} />
          )
        )}
        {(currentView === 'owner-auth' || currentView === 'owner-portal') && (
          currentUser && role === 'owner' ? (
            <OwnerDashboard onNavigate={handleNavigate} />
          ) : (
            <OwnerAuthPage onNavigate={handleNavigate} />
          )
        )}
        {currentView === 'admin-login' && (
          currentUser && role === 'admin' ? (
            <AdminDashboard onNavigate={handleNavigate} />
          ) : (
            <AdminLoginPage onNavigate={handleNavigate} />
          )
        )}

        {/* Protected Dashboard Views */}
        {currentView === 'user-dashboard' && (
          loading && !currentUser ? (
            <AuthLoadingScreen />
          ) : currentUser && role === 'user' ? (
            <UserDashboard onNavigate={handleNavigate} />
          ) : (
            <UserAuthPage onNavigate={handleNavigate} />
          )
        )}

        {currentView === 'owner-kyc' && (
          loading && !currentUser ? (
            <AuthLoadingScreen />
          ) : currentUser && role === 'owner' ? (
            <OwnerKYCPage onNavigate={handleNavigate} />
          ) : (
            <OwnerAuthPage onNavigate={handleNavigate} />
          )
        )}

        {currentView === 'owner-dashboard' && (
          loading && !currentUser ? (
            <AuthLoadingScreen />
          ) : currentUser && role === 'owner' ? (
            <OwnerDashboard onNavigate={handleNavigate} />
          ) : (
            <OwnerAuthPage onNavigate={handleNavigate} />
          )
        )}

        {currentView === 'admin-dashboard' && (
          loading && !currentUser ? (
            <AuthLoadingScreen />
          ) : currentUser && role === 'admin' ? (
            <AdminDashboard onNavigate={handleNavigate} />
          ) : (
            <AdminLoginPage onNavigate={handleNavigate} />
          )
        )}

        {/* Global Profile Management for Owners & Users */}
        {currentView === 'profile' && (
          loading && !currentUser ? (
            <AuthLoadingScreen />
          ) : currentUser ? (
            <ProfilePage onNavigate={handleNavigate} />
          ) : (
            <UserAuthPage onNavigate={handleNavigate} />
          )
        )}
      </main>

      {/* Footer (Hidden completely for separate Admin management views) */}
      {!currentView.startsWith('admin') && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
