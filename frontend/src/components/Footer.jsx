import React from 'react';
import { Car, ShieldCheck, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: 'clamp(30px, 6vw, 60px) 16px 24px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
          gap: 'clamp(20px, 4vw, 40px)',
          marginBottom: '36px',
        }}>
          {/* Col 1: Brand & Bio */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}>
                <Car size={20} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800 }}>
                GoEasy <span style={{ color: 'var(--primary)' }}>Travels</span>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
              India's premier vehicle rental & outstation travel platform. Verified commercial vehicle owners, 8-point condition inspections, and direct transparent bookings.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
              <ShieldCheck size={18} />
              <span>100% Inspected & KYC-Verified Fleet</span>
            </div>
          </div>

          {/* Col 2: Customer Portals & Partnering */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', letterSpacing: '-0.2px' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', textAlign: 'left', padding: 0, font: 'inherit' }}
                >
                  Explore Available Fleets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('popular-routes')}
                  style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', textAlign: 'left', padding: 0, font: 'inherit' }}
                >
                  Popular Indian Travel Corridors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('user-auth')}
                  style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', textAlign: 'left', padding: 0, font: 'inherit' }}
                >
                  Customer Account
                </button>
              </li>
              <li style={{ marginTop: '6px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                <button
                  onClick={() => onNavigate('owner-auth')}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', textAlign: 'left', padding: 0, font: 'inherit' }}
                >
                  For Fleet Owners & Agencies
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Corridors */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
              Top Travel Corridors
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', color: '#64748b' }}>
              <li>Delhi ↔ Jaipur (Pink City Expressway)</li>
              <li>Delhi ↔ Agra (Taj Expressway)</li>
              <li>Delhi ↔ Manali & Shimla (Himalayan Tour)</li>
              <li>Mumbai ↔ Pune & Goa (Coastal Highway)</li>
              <li>Bengaluru ↔ Mysore & Coorg Hills</li>
              <li>Hyderabad ↔ Vijayawada & Tirupati</li>
            </ul>
          </div>

          {/* Col 4: Trust & Transparency Standards */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
              Trust & Safety
            </h4>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px',
              fontSize: '13px',
              color: '#475569',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Verified commercial permits & RC documents</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>8-point physical vehicle inspection report</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Direct operator settlement with zero payment gateway surcharge</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '13px',
          color: '#94a3b8',
        }}>
          <div>
            &copy; 2026 GoEasy Travels India. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Rental Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
