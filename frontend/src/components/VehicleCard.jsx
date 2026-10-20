import React from 'react';
import { Users, Fuel, Settings2, MapPin, ShieldCheck, Star, Camera, ArrowRight } from 'lucide-react';

export const VehicleCard = ({ vehicle, onSelectVehicle, onInspectCondition }) => {
  const mainPhoto =
    vehicle.conditionReport?.photos?.front ||
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800';

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Photo with Badges */}
      <div style={{ position: 'relative', width: '100%', height: '210px', overflow: 'hidden', background: '#e2e8f0' }}>
        <img
          src={mainPhoto}
          alt={vehicle.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
          <span className="badge badge-blue" style={{ backdropFilter: 'blur(8px)', background: 'rgba(255, 255, 255, 0.9)' }}>
            <Users size={12} />
            {vehicle.seatingCapacity} Seater
          </span>
          <span className="badge" style={{ background: 'rgba(15, 23, 42, 0.75)', color: '#ffffff', backdropFilter: 'blur(8px)' }}>
            {vehicle.type}
          </span>
        </div>

        {/* Rating Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          borderRadius: '9999px',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#d97706',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        }}>
          <Star size={13} fill="#f59e0b" color="#f59e0b" />
          <span>{vehicle.rating || '4.9'}</span>
        </div>

        {/* Quick Inspection Prompt */}
        <button
          onClick={() => onInspectCondition(vehicle)}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            borderRadius: '9999px',
            padding: '5px 12px',
            fontSize: '11.5px',
            fontWeight: 600,
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#ffffff')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)')}
        >
          <Camera size={13} color="#2563eb" />
          8-Point Condition Report
        </button>
      </div>

      {/* Card Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Registration & Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '3px' }}>
              {vehicle.name}
            </h3>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              Reg: <span style={{ fontFamily: 'monospace', color: '#1e293b' }}>{vehicle.registrationNumber}</span>
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          background: '#f8fafc',
          padding: '10px 12px',
          borderRadius: '12px',
          margin: '12px 0',
          fontSize: '12px',
          color: '#475569',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Fuel size={14} color="#64748b" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Settings2 size={14} color="#64748b" />
            <span>{vehicle.transmission}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Users size={14} color="#64748b" />
            <span>{vehicle.seatingCapacity} Seats</span>
          </div>
        </div>

        {/* Serviced Cities preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
          <MapPin size={13} color="#2563eb" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Routes: {vehicle.servicedCities?.slice(0, 3).join(', ')} {vehicle.servicedCities?.length > 3 ? `+${vehicle.servicedCities.length - 3} more` : ''}
          </span>
        </div>

        {/* Owner Info Tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '12px',
          marginTop: 'auto',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
            }}>
              ✓
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{vehicle.owner?.ownerProfile?.agencyName || vehicle.owner?.name || 'Verified Travels'}</span>
                <ShieldCheck size={13} color="#10b981" />
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                {vehicle.owner?.city || 'India'}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
              Rental Rate
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-display)' }}>
              ₹{vehicle.dailyRate?.toLocaleString('en-IN')}
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}> / day</span>
            </div>
          </div>

          <button
            onClick={() => onSelectVehicle(vehicle)}
            className="btn-primary"
            style={{ padding: '10px 18px', fontSize: '13.5px' }}
          >
            Book Vehicle
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
