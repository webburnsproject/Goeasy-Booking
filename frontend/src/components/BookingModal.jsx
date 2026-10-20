import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, Calendar, MapPin, Users, CheckCircle, AlertCircle, Sparkles, ArrowRight, Building2, Phone, Mail, MessageCircle, ShieldCheck } from 'lucide-react';

export const BookingModal = ({ vehicle, searchCriteria, onClose, onSuccess, onRequireLogin, onNavigate }) => {
  const { currentUser, role } = useAuth();

  const [fromCity, setFromCity] = useState(searchCriteria?.fromCity || 'Delhi');
  const [toCity, setToCity] = useState(searchCriteria?.toCity || 'Jaipur');
  const [pickupDate, setPickupDate] = useState(searchCriteria?.pickupDate || new Date().toISOString().split('T')[0]);
  const [dropDate, setDropDate] = useState(
    searchCriteria?.dropDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [pickupTime, setPickupTime] = useState('08:00 AM');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [passengersCount, setPassengersCount] = useState(vehicle?.seatingCapacity ? Math.min(4, vehicle.seatingCapacity) : 2);
  const [specialRequests, setSpecialRequests] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  if (!vehicle) return null;

  // Calculate days & estimate
  const start = new Date(pickupDate);
  const end = new Date(dropDate);
  const diffTime = Math.abs(end - start);
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const estimatedTotal = totalDays * (vehicle.dailyRate || 3500);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      onRequireLogin();
      return;
    }

    if (role !== 'user') {
      setError(`You are currently logged in as a ${role}. Only registered customers can book vehicles. Please log in as a user.`);
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createBooking({
        vehicleId: vehicle._id,
        fromCity,
        toCity,
        pickupDate,
        dropDate,
        pickupTime,
        pickupAddress: pickupAddress || `${fromCity} City Center`,
        dropAddress: dropAddress || `${toCity} Drop Point`,
        passengersCount: Number(passengersCount),
        specialRequests,
      });

      if (res.success && res.booking) {
        setConfirmedBooking(res.booking);
        if (onSuccess) onSuccess(res.booking);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: 800 }}>Confirm Vehicle Reservation</h2>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              {vehicle.name} ({vehicle.seatingCapacity} Seater) • {vehicle.registrationNumber}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {confirmedBooking ? (
          /* Booking Success Screen */
          <div style={{ padding: '36px 24px', textAlign: 'center', flex: '1 1 auto', overflowY: 'auto', minHeight: 0 }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#ecfdf5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle size={36} />
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Booking Request Submitted!
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '420px', margin: '0 auto 20px', lineHeight: 1.5 }}>
              Your reservation reference is <strong style={{ color: '#2563eb' }}>{confirmedBooking.bookingId}</strong>.
              The vehicle owner (<strong>{vehicle.owner?.ownerProfile?.agencyName || vehicle.owner?.name}</strong>) has been alerted via email.
            </p>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px',
              textAlign: 'left',
              marginBottom: '18px',
              fontSize: '13.5px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#64748b' }}>Route:</span>
                <strong>{fromCity} → {toCity}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#64748b' }}>Travel Period:</span>
                <strong>{pickupDate} to {dropDate} ({totalDays} Day{totalDays > 1 ? 's' : ''})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#64748b' }}>Estimated Fare:</span>
                <strong style={{ color: '#059669', fontSize: '16px' }}>₹{estimatedTotal.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#64748b' }}>Status:</span>
                <span className="badge badge-yellow">Pending Owner Allocation</span>
              </div>
            </div>

            {/* Operator Contact Card for Immediate Direct Settlement & Query */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #bfdbfe',
              borderRadius: '14px',
              padding: '16px',
              textAlign: 'left',
              marginBottom: '22px',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={16} color="#2563eb" />
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                    {vehicle.owner?.ownerProfile?.agencyName || vehicle.owner?.name || 'Verified Travels'}
                  </span>
                </div>
                <span className="badge badge-green" style={{ fontSize: '10.5px' }}>
                  <ShieldCheck size={11} /> Verified Owner
                </span>
              </div>

              <div style={{ fontSize: '12.5px', color: '#475569', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {vehicle.owner?.name && (
                  <div>Proprietor: <strong style={{ color: '#0f172a' }}>{vehicle.owner.name}</strong></div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} color="#2563eb" />
                  <span>{vehicle.owner?.phone || '+91 98112 34567'}</span>
                </div>
                {vehicle.owner?.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={13} color="#64748b" />
                    <span>{vehicle.owner.email}</span>
                  </div>
                )}
              </div>

              <div style={{
                background: '#eff6ff',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '11.5px',
                color: '#1e40af',
                marginBottom: '12px',
              }}>
                💳 Direct Settlement: There is no payment gateway. Please settle the trip payment directly with the operator.
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`https://wa.me/${(vehicle.owner?.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(vehicle.owner?.name || 'Operator')},%20I%20have%20submitted%20booking%20request%20%23${confirmedBooking.bookingId}%20for%20${encodeURIComponent(vehicle.name)}%20(${encodeURIComponent(fromCity)}%20to%20${encodeURIComponent(toCity)}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-success"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '12.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                >
                  <MessageCircle size={14} />
                  WhatsApp Owner
                </a>
                <a
                  href={`tel:${vehicle.owner?.phone}`}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '12.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                >
                  <Phone size={14} />
                  Call Owner
                </a>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                if (onNavigate) {
                  onNavigate('user-dashboard');
                } else {
                  window.history.pushState({}, '', '/user-dashboard');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              Track Booking in Dashboard
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} style={{ padding: '24px', flex: '1 1 auto', overflowY: 'auto', minHeight: 0 }}>
            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#dc2626',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '18px',
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {!currentUser && (
              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '12px 14px',
                fontSize: '13px',
                color: '#1d4ed8',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span>Sign in as a customer to book this vehicle.</span>
                <button
                  type="button"
                  onClick={onRequireLogin}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Route Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="input-label">Origin (FROM City)</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="e.g. Delhi"
                />
              </div>
              <div>
                <label className="input-label">Destination (TO City)</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="e.g. Jaipur"
                />
              </div>
            </div>

            {/* Date Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="input-label">Date IN (Pickup Date)</label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={pickupDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>
              <div>
                <label className="input-label">Date OUT (Dropoff Date)</label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={dropDate}
                  min={pickupDate}
                  onChange={(e) => setDropDate(e.target.value)}
                />
              </div>
            </div>

            {/* Pickup Time & Passengers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="input-label">Pickup Time</label>
                <input
                  type="text"
                  className="input-field"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="08:00 AM"
                />
              </div>
              <div>
                <label className="input-label">Passengers Count (Max {vehicle.seatingCapacity})</label>
                <input
                  type="number"
                  min="1"
                  max={vehicle.seatingCapacity}
                  className="input-field"
                  value={passengersCount}
                  onChange={(e) => setPassengersCount(e.target.value)}
                />
              </div>
            </div>

            {/* Address Details */}
            <div style={{ marginBottom: '14px' }}>
              <label className="input-label">Pickup Address / Landmark</label>
              <input
                type="text"
                className="input-field"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="e.g. IGI Airport Terminal 3 or Home Address"
              />
            </div>

            {/* Special Request */}
            <div style={{ marginBottom: '18px' }}>
              <label className="input-label">Special Requests or Trip Notes (Optional)</label>
              <textarea
                className="input-field"
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Need roof luggage carrier, non-smoking driver, early start..."
              />
            </div>

            {/* Travel Operator & Direct Payment Transparency */}
            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={16} color="#2563eb" />
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                    {vehicle.owner?.ownerProfile?.agencyName || vehicle.owner?.name || 'Verified Travels'}
                  </span>
                </div>
                <span className="badge badge-green" style={{ fontSize: '10px' }}>
                  <ShieldCheck size={11} /> Verified Operator
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
                {vehicle.owner?.name && (
                  <div>Proprietor: <strong>{vehicle.owner.name}</strong></div>
                )}
                {vehicle.owner?.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={12} color="#2563eb" />
                    <span>{vehicle.owner.phone}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} color="#64748b" />
                  <span>Base: {vehicle.owner?.city || 'Delhi NCR'}</span>
                </div>
              </div>

              <div style={{
                background: '#eff6ff',
                border: '1px solid #dbeafe',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11.5px',
                color: '#1d4ed8',
                lineHeight: 1.4,
              }}>
                💳 <strong>Direct Settlement Notice:</strong> There is NO online payment gateway on this portal. Your booking is placed directly with the vehicle operator. Trip fare is settled directly with the operator upon confirmation.
              </div>
            </div>

            {/* Price Estimate Summary */}
            <div style={{
              background: '#ffffff',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '14px',
              padding: '14px 18px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Estimated Trip Total ({totalDays} Day{totalDays > 1 ? 's' : ''}):</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-display)' }}>
                  ₹{estimatedTotal.toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600, maxWidth: '220px', textAlign: 'right' }}>
                ✓ Zero gateway convenience fees
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{ padding: '12px 24px' }}
              >
                {submitting ? 'Submitting Request...' : 'Confirm & Request Vehicle'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
