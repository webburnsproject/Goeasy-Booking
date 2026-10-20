import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleDetailsModal } from '../components/VehicleDetailsModal';
import { BookingModal } from '../components/BookingModal';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  ChevronDown,
  PhoneCall,
  SlidersHorizontal,
  Camera,
  Car,
} from 'lucide-react';

export const LandingPage = ({ onNavigate }) => {
  // Search Criteria
  const [fromCity, setFromCity] = useState('Delhi');
  const [toCity, setToCity] = useState('Jaipur');
  const [pickupDate, setPickupDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [dropDate, setDropDate] = useState(
    new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
  );
  const [seater, setSeater] = useState('all');
  const [vehicleType, setVehicleType] = useState('all');

  // Vehicles state
  const [vehicles, setVehicles] = useState([]);
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [inspectingVehicle, setInspectingVehicle] = useState(null);
  const [bookingVehicle, setBookingVehicle] = useState(null);

  const fetchVehicles = async (overrideParams = {}) => {
    try {
      setLoading(true);
      const params = {
        fromCity: overrideParams.fromCity !== undefined ? overrideParams.fromCity : fromCity,
        toCity: overrideParams.toCity !== undefined ? overrideParams.toCity : toCity,
        pickupDate: overrideParams.pickupDate !== undefined ? overrideParams.pickupDate : pickupDate,
        dropDate: overrideParams.dropDate !== undefined ? overrideParams.dropDate : dropDate,
      };
      if (seater !== 'all') params.seater = seater;
      if (vehicleType !== 'all') params.type = vehicleType;

      const res = await api.searchVehicles(params);
      if (res.success) {
        setVehicles(res.vehicles || []);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await api.getPopularRoutes();
      if (res.success) setPopularRoutes(res.routes || []);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchRoutes();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchVehicles();
    // Smooth scroll to vehicles section
    const el = document.getElementById('fleet-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectPopularRoute = (route) => {
    setFromCity(route.from);
    setToCity(route.to);
    fetchVehicles();
    const el = document.getElementById('fleet-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Hero Section with Light Ambient Glow */}
      <section style={{
        padding: 'clamp(30px, 8vw, 70px) 16px clamp(30px, 6vw, 60px)',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          {/* Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #bfdbfe',
            padding: '6px 18px',
            borderRadius: '9999px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)',
            marginBottom: '24px',
          }}>
            <Sparkles size={16} color="#2563eb" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', letterSpacing: '0.02em' }}>
              INDIA'S VERIFIED VEHICLE RENTAL PLATFORM
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(32px, 5.5vw, 56px)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '20px',
            letterSpacing: '-1.5px',
            color: '#0f172a',
          }}>
            Travel Across India in <span style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Premium Fleets</span> with Verified Owners
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: '#475569',
            maxWidth: '680px',
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}>
            Book spacious 7-seater Innovas, family Ertigas, and 12-17 seater Tempo Travellers directly from verified fleet operators. 8-point condition inspected.
          </p>

          {/* Interactive Route Search Card (Glassmorphic) */}
          <div className="glass-panel" style={{
            padding: '24px',
            maxWidth: '920px',
            margin: '0 auto',
            boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08)',
            textAlign: 'left',
          }}>
            <form onSubmit={handleSearchSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))',
                gap: '12px',
                marginBottom: '16px',
              }}>
                {/* FROM */}
                <div>
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} color="#2563eb" />
                    Pickup City (FROM)
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="e.g. Delhi"
                  />
                </div>

                {/* TO */}
                <div>
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} color="#ef4444" />
                    Destination (TO)
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    placeholder="e.g. Jaipur"
                  />
                </div>

                {/* Date IN */}
                <div>
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={14} color="#10b981" />
                    Date IN (Pickup)
                  </label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={pickupDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>

                {/* Date OUT */}
                <div>
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={14} color="#f59e0b" />
                    Date OUT (Dropoff)
                  </label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={dropDate}
                    min={pickupDate}
                    onChange={(e) => setDropDate(e.target.value)}
                  />
                </div>

                {/* Seater Requirement */}
                <div>
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Users size={14} color="#6366f1" />
                    Seater Capacity
                  </label>
                  <select
                    className="input-field"
                    value={seater}
                    onChange={(e) => setSeater(e.target.value)}
                  >
                    <option value="all">Any Seater</option>
                    <option value="4">4+ Seater (Sedan / Hatch)</option>
                    <option value="7">7 Seater (Innova / Ertiga / SUV)</option>
                    <option value="12">12+ Seater (Tempo Traveller)</option>
                    <option value="17">17+ Seater (Force Urbania / Bus)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                borderTop: '1px solid #f1f5f9',
                paddingTop: '16px',
              }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
                  <button
                    type="button"
                    onClick={() => { setVehicleType('all'); fetchVehicles(); }}
                    className={`badge ${vehicleType === 'all' ? 'badge-blue' : ''}`}
                    style={{ cursor: 'pointer', border: '1px solid #e2e8f0', background: vehicleType === 'all' ? '#eff6ff' : '#ffffff' }}
                  >
                    All Types
                  </button>
                  <button
                    type="button"
                    onClick={() => { setVehicleType('MUV'); fetchVehicles(); }}
                    className={`badge ${vehicleType === 'MUV' ? 'badge-blue' : ''}`}
                    style={{ cursor: 'pointer', border: '1px solid #e2e8f0', background: vehicleType === 'MUV' ? '#eff6ff' : '#ffffff' }}
                  >
                    7-Seater MUVs
                  </button>
                  <button
                    type="button"
                    onClick={() => { setVehicleType('SUV'); fetchVehicles(); }}
                    className={`badge ${vehicleType === 'SUV' ? 'badge-blue' : ''}`}
                    style={{ cursor: 'pointer', border: '1px solid #e2e8f0', background: vehicleType === 'SUV' ? '#eff6ff' : '#ffffff' }}
                  >
                    Luxury SUVs
                  </button>
                  <button
                    type="button"
                    onClick={() => { setVehicleType('Tempo Traveller'); fetchVehicles(); }}
                    className={`badge ${vehicleType === 'Tempo Traveller' ? 'badge-blue' : ''}`}
                    style={{ cursor: 'pointer', border: '1px solid #e2e8f0', background: vehicleType === 'Tempo Traveller' ? '#eff6ff' : '#ffffff' }}
                  >
                    Tempo Travellers
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '12px 28px', fontSize: '15px' }}
                >
                  <Search size={18} />
                  Find Available Vehicles
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Travel Routes in India Carousel / Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 40px', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Popular Travel Corridors</h2>
            <p style={{ fontSize: '13.5px', color: '#64748b' }}>
              One-click search for high-demand outstation rental routes
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
          gap: '12px',
        }}>
          {popularRoutes.slice(0, 4).map((r, i) => (
            <div
              key={i}
              onClick={() => handleSelectPopularRoute(r)}
              className="glass-card"
              style={{
                padding: '18px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  {r.from} ↔ {r.to}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '3px' }}>
                  {r.distance} • ~{r.avgTime} • {r.popularSeater}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>From</div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#2563eb', fontFamily: 'var(--font-display)' }}>
                  ₹{r.startingPrice?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Fleet Catalog Section */}
      <section id="fleet-section" style={{ maxWidth: '1280px', margin: '0 auto 60px', padding: '0 16px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 800 }}>
                Available Vehicles in {fromCity} & Surrounding Corridors
              </h2>
              <span className="badge badge-green">
                {loading ? '...' : `${vehicles.length} Available`}
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
              All vehicles approved by Super Admin with verified RC, commercial insurance, and 8-point condition checks.
            </p>
          </div>
        </div>

        {loading ? (
          /* Skeleton Loaders */
          <div className="vehicle-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
            gap: '20px',
          }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-card" style={{ height: '420px', padding: '16px' }}>
                <div className="skeleton" style={{ height: '200px', width: '100%', marginBottom: '16px' }} />
                <div className="skeleton" style={{ height: '24px', width: '70%', marginBottom: '12px' }} />
                <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '20px' }} />
                <div className="skeleton" style={{ height: '40px', width: '100%' }} />
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Car size={52} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '6px' }}>
              No vehicles matched your search criteria
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
              Try broadening your city selection or seater requirement.
            </p>
            <button
              onClick={() => {
                setFromCity('');
                setSeater('all');
                setVehicleType('all');
                fetchVehicles();
              }}
              className="btn-primary"
            >
              Reset Filters & Show All Vehicles
            </button>
          </div>
        ) : (
          <div className="vehicle-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
            gap: '20px',
          }}>
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onSelectVehicle={(v) => setBookingVehicle(v)}
                onInspectCondition={(v) => setInspectingVehicle(v)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose GoEasy Travels */}
      <section style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
        padding: 'clamp(36px, 8vw, 70px) 16px',
        marginBottom: '40px',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, marginBottom: '12px' }}>
              Why Travellers Choose GoEasy
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
              A reliable bridge between passengers and licensed Indian travel operators, built for comfort and safety.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
            gap: '20px',
          }}>
            <div className="glass-panel-subtle" style={{ padding: '28px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                Strict KYC Verification
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6 }}>
                Every vehicle owner is vetted with Aadhaar and PAN documents before they are permitted to list commercial vehicles.
              </p>
            </div>

            <div className="glass-panel-subtle" style={{ padding: '28px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <Camera size={26} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                8-Point Inspection
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6 }}>
                Inspect real exterior, interior, dashboard, odometer, and number plate photos before booking. What you see is what arrives.
              </p>
            </div>

            <div className="glass-panel-subtle" style={{ padding: '28px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <PhoneCall size={26} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                Direct WhatsApp & Call
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6 }}>
                Connect directly with your vehicle owner or allocated driver with 1-click WhatsApp messaging and live phone calls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Floating CTA Bar (Requirement: "Sticky floating CTA elements") */}
      <div className="sticky-cta-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Car size={16} />
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
            Need an Outstation Vehicle?
          </div>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('fleet-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="btn-primary"
          style={{ padding: '8px 18px', fontSize: '13px' }}
        >
          View Live Fleets ({vehicles.length})
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Modals */}
      {inspectingVehicle && (
        <VehicleDetailsModal
          vehicle={inspectingVehicle}
          onClose={() => setInspectingVehicle(null)}
          onBook={(v) => {
            setInspectingVehicle(null);
            setBookingVehicle(v);
          }}
        />
      )}

      {bookingVehicle && (
        <BookingModal
          vehicle={bookingVehicle}
          searchCriteria={{ fromCity, toCity, pickupDate, dropDate }}
          onClose={() => setBookingVehicle(null)}
          onRequireLogin={() => onNavigate('user-auth')}
          onNavigate={onNavigate}
          onSuccess={() => {
            fetchVehicles();
          }}
        />
      )}
    </div>
  );
};
