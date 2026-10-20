import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MapPin, Navigation, ArrowRight, ShieldCheck, Clock, Users, Car } from 'lucide-react';

export const PopularRoutesPage = ({ onNavigate, onSelectRoute }) => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    api.getPopularRoutes().then((res) => {
      if (res.success) setRoutes(res.routes || []);
    });
  }, []);

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>
          Popular Indian Outstation & Holiday Travel Routes
        </h1>
        <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.6 }}>
          Book direct vehicle rentals with experienced drivers and sanitized commercial fleets for interstate highways and tourist circuits.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '24px',
      }}>
        {routes.map((route, i) => (
          <div key={i} className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span className="badge badge-blue">Verified Highway Corridor</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>~{route.avgTime}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              <span>{route.from}</span>
              <Navigation size={18} color="#2563eb" style={{ transform: 'rotate(90deg)' }} />
              <span>{route.to}</span>
            </div>

            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              Distance: <strong>{route.distance}</strong> • Recommended: <strong>{route.popularSeater}</strong>
            </div>

            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Fares Starting From</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-display)' }}>
                  ₹{route.startingPrice?.toLocaleString('en-IN')}
                </div>
              </div>
              <ShieldCheck size={24} color="#10b981" />
            </div>

            <button
              onClick={() => {
                if (onSelectRoute) onSelectRoute(route);
                onNavigate('home');
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '10px' }}
            >
              Search Vehicles on this Route
              <ArrowRight size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
