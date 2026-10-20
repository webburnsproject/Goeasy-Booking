import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, ShieldCheck, User, LogOut, Compass, LayoutDashboard, Menu, X } from 'lucide-react';

export const Navbar = ({ currentView, onNavigate }) => {
  const { currentUser, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navTo = (view) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.03)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => navTo(role === 'admin' ? 'admin-dashboard' : role === 'owner' ? 'owner-dashboard' : 'home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.35)',
            flexShrink: 0,
          }}>
            <Car size={22} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              lineHeight: 1.1,
            }}>
              <span>GoEasy</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Travels</span>
            </div>
            <div className="nav-tagline" style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Premium Fleet Rentals • India
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {role === 'owner' ? (
            <>
              <button
                onClick={() => navTo('owner-dashboard')}
                style={{
                  background: currentView === 'owner-dashboard' ? 'var(--primary-light)' : 'transparent',
                  color: currentView === 'owner-dashboard' ? 'var(--primary)' : 'var(--text-main)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <LayoutDashboard size={16} />
                Fleet Dashboard
              </button>

              <button
                onClick={() => navTo('owner-kyc')}
                style={{
                  background: currentView === 'owner-kyc' ? 'var(--primary-light)' : 'transparent',
                  color: currentView === 'owner-kyc' ? 'var(--primary)' : 'var(--text-main)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <ShieldCheck size={16} />
                KYC
              </button>

              <button
                onClick={() => navTo('profile')}
                style={{
                  background: currentView === 'profile' ? 'var(--primary-light)' : 'transparent',
                  color: currentView === 'profile' ? 'var(--primary)' : 'var(--text-main)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <User size={16} />
                Profile
              </button>
            </>
          ) : role === 'admin' ? (
            <>
              <button
                onClick={() => navTo('admin-dashboard')}
                style={{
                  background: currentView === 'admin-dashboard' ? 'var(--primary-light)' : 'transparent',
                  color: currentView === 'admin-dashboard' ? 'var(--primary)' : 'var(--text-main)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <ShieldCheck size={16} />
                Admin Dashboard
              </button>

              <button
                onClick={() => navTo('profile')}
                style={{
                  background: currentView === 'profile' ? 'var(--primary-light)' : 'transparent',
                  color: currentView === 'profile' ? 'var(--primary)' : 'var(--text-main)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <User size={16} />
                Profile
              </button>
            </>
          ) : role === 'user' ? (
            <>
              <button
                onClick={() => navTo('home')}
                style={{
                  background: currentView === 'home' ? 'var(--primary-light)' : 'transparent',
                  color: currentView === 'home' ? 'var(--primary)' : 'var(--text-main)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Find Vehicles
              </button>

              <button
                onClick={() => navTo('popular-routes')}
                style={{
                  background: currentView === 'popular-routes' ? 'var(--primary-light)' : 'transparent',
                  color: currentView === 'popular-routes' ? 'var(--primary)' : 'var(--text-main)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Popular Routes
              </button>

              <button
                onClick={() => navTo('user-dashboard')}
                style={{
                  background: currentView === 'user-dashboard' ? 'var(--primary-light)' : 'transparent',
                  color: currentView === 'user-dashboard' ? 'var(--primary)' : 'var(--text-main)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <LayoutDashboard size={16} />
                My Bookings
              </button>

              <button
                onClick={() => navTo('profile')}
                style={{
                  background: currentView === 'profile' ? 'var(--primary-light)' : 'transparent',
                  color: currentView === 'profile' ? 'var(--primary)' : 'var(--text-main)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <User size={16} />
                Profile
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navTo('home')}
                style={{
                  background: currentView === 'home' ? 'var(--primary-light)' : 'transparent',
                  color: currentView === 'home' ? 'var(--primary)' : 'var(--text-main)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Find Vehicles
              </button>

              <button
                onClick={() => navTo('popular-routes')}
                style={{
                  background: currentView === 'popular-routes' ? 'var(--primary-light)' : 'transparent',
                  color: currentView === 'popular-routes' ? 'var(--primary)' : 'var(--text-main)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Popular Routes
              </button>
            </>
          )}
        </nav>

        {/* Desktop User Controls */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* User badge pill & Logout */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px 4px 6px',
                background: 'rgba(241, 245, 249, 0.8)',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0',
              }}>
                <div 
                  onClick={() => navTo('profile')}
                  title="View / Edit Profile"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {currentUser.avatar || currentUser.ownerProfile?.agencyLogo ? (
                    <img
                      src={currentUser.avatar || currentUser.ownerProfile?.agencyLogo}
                      alt={currentUser.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    currentUser.name ? currentUser.name[0].toUpperCase() : 'U'
                  )}
                </div>
                <div 
                  onClick={() => navTo('profile')}
                  title="View / Edit Profile"
                  style={{ textAlign: 'left', marginRight: '4px', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
                    {currentUser.ownerProfile?.agencyName || currentUser.name?.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    {role}
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Sign out"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    borderRadius: '6px',
                    transition: 'color 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#dc2626')}
                  onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => navTo('owner-auth')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  padding: '8px 12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#2563eb')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}
              >
                Fleet Partner
              </button>

              <button
                onClick={() => navTo('user-auth')}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '13.5px' }}
              >
                <User size={16} />
                Customer Sign In
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none', /* overridden by CSS media query */
            background: 'none',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '8px',
            cursor: 'pointer',
            color: '#0f172a',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{
          borderTop: '1px solid #e2e8f0',
          background: '#ffffff',
          padding: '12px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          animation: 'slideDown 0.2s ease',
        }}>
          {/* Mobile Nav Links: Dedicated Owner Menu */}
          {role === 'owner' ? (
            <>
              <button
                onClick={() => navTo('owner-dashboard')}
                className="mobile-nav-item"
                style={currentView === 'owner-dashboard' ? { background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                <LayoutDashboard size={18} /> Fleet Dashboard
              </button>
              <button
                onClick={() => navTo('owner-kyc')}
                className="mobile-nav-item"
                style={currentView === 'owner-kyc' ? { background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                <ShieldCheck size={18} /> KYC Verification
              </button>
              <button
                onClick={() => navTo('profile')}
                className="mobile-nav-item"
                style={currentView === 'profile' ? { background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                <User size={18} /> Profile & Agency
              </button>
            </>
          ) : role === 'admin' ? (
            <>
              <button
                onClick={() => navTo('admin-dashboard')}
                className="mobile-nav-item"
                style={currentView === 'admin-dashboard' ? { background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                <ShieldCheck size={18} /> Admin Dashboard
              </button>
              <button
                onClick={() => navTo('profile')}
                className="mobile-nav-item"
                style={currentView === 'profile' ? { background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                <User size={18} /> Profile
              </button>
            </>
          ) : role === 'user' ? (
            <>
              <button
                onClick={() => navTo('home')}
                className="mobile-nav-item"
                style={currentView === 'home' ? { background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                <Compass size={18} /> Find Vehicles
              </button>
              <button
                onClick={() => navTo('popular-routes')}
                className="mobile-nav-item"
                style={currentView === 'popular-routes' ? { background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                <Car size={18} /> Popular Routes
              </button>
              <button
                onClick={() => navTo('user-dashboard')}
                className="mobile-nav-item"
                style={currentView === 'user-dashboard' ? { background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                <LayoutDashboard size={18} /> My Bookings
              </button>
              <button
                onClick={() => navTo('profile')}
                className="mobile-nav-item"
                style={currentView === 'profile' ? { background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                <User size={18} /> My Profile
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navTo('home')}
                className="mobile-nav-item"
                style={currentView === 'home' ? { background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                <Compass size={18} /> Find Vehicles
              </button>
              <button
                onClick={() => navTo('popular-routes')}
                className="mobile-nav-item"
                style={currentView === 'popular-routes' ? { background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                <Car size={18} /> Popular Routes
              </button>
            </>
          )}

          {/* User Profile / Auth Section */}
          {currentUser ? (
            <>
              <div style={{ height: '1px', background: '#e2e8f0', margin: '6px 0' }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginTop: '4px',
                gap: '8px',
              }}>
                <div 
                  onClick={() => navTo('profile')}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, cursor: 'pointer' }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: role === 'owner' ? '10px' : '50%',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}>
                    {currentUser.avatar || currentUser.ownerProfile?.agencyLogo ? (
                      <img
                        src={currentUser.avatar || currentUser.ownerProfile?.agencyLogo}
                        alt={currentUser.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      currentUser.name ? currentUser.name[0].toUpperCase() : 'U'
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentUser.ownerProfile?.agencyName || currentUser.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      {role}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '12px', color: '#dc2626', borderColor: '#fecaca', whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ height: '1px', background: '#e2e8f0', margin: '6px 0' }} />
              <button onClick={() => navTo('owner-auth')} className="mobile-nav-item">
                <Car size={18} /> Fleet Partner Login
              </button>
              <button
                onClick={() => navTo('user-auth')}
                className="btn-primary"
                style={{ padding: '12px', fontSize: '14px', width: '100%', justifyContent: 'center', marginTop: '4px' }}
              >
                <User size={18} /> Customer Sign In
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
