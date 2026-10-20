import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Building2,
  Car,
  Calendar,
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ArrowRight,
  Info,
} from 'lucide-react';

export const UserDashboard = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.getUserBookings();
      if (res.success) {
        setBookings(res.bookings || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      setCancellingId(id);
      const res = await api.cancelBooking(id);
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b))
        );
      }
    } catch (err) {
      alert('Error cancelling booking: ' + err.message);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: 'clamp(20px, 4vw, 40px) auto', padding: '0 16px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        marginBottom: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>
              Welcome back, {currentUser?.name?.split(' ')[0]}!
            </h1>
            <span className="badge badge-blue">Customer Portal</span>
          </div>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
            Track vehicle allocations, view driver contact details, and manage outstation travel bookings.
          </p>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="btn-primary"
        >
          <PlusCircle size={17} />
          Book Another Vehicle
        </button>
      </div>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '14px',
          color: '#dc2626',
          fontSize: '13.5px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Bookings Tracker List */}
      <div>
        <h2 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '18px' }}>
          My Trip Reservations & Vehicle Status {loading ? '' : `(${bookings.length})`}
        </h2>

        {loading ? (
          /* Skeleton Pulse for Reservations */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[1, 2].map((n) => (
              <div key={n} className="glass-card" style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: '16px',
                  marginBottom: '18px',
                }}>
                  <div className="skeleton" style={{ width: '200px', height: '22px', borderRadius: '6px' }} />
                  <div className="skeleton" style={{ width: '120px', height: '26px', borderRadius: '12px' }} />
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px',
                }}>
                  <div className="skeleton" style={{ height: '140px', borderRadius: '12px' }} />
                  <div className="skeleton" style={{ height: '140px', borderRadius: '12px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Car size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No Active Bookings Found</h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', maxWidth: '420px', margin: '0 auto 20px' }}>
              Select a route across Indian cities, choose your preferred seater capacity, and reserve verified vehicles.
            </p>
            <button onClick={() => onNavigate('home')} className="btn-primary">
              Browse Available Fleets
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {bookings.map((booking) => {
              const isPending = booking.status === 'pending';
              const isAllocated = ['confirmed', 'allocated'].includes(booking.status);
              const isCompleted = booking.status === 'completed';
              const isCancelled = booking.status === 'cancelled';
              const isRejected = booking.status === 'rejected';

              return (
                <div key={booking._id} className="glass-card" style={{ padding: '24px' }}>
                  {/* Top Bar */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '16px',
                    marginBottom: '18px',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                          Booking Ref #{booking.bookingId}
                        </span>
                        <span className={`badge ${
                          isAllocated
                            ? 'badge-green'
                            : isPending
                            ? 'badge-yellow'
                            : isCompleted
                            ? 'badge-purple'
                            : 'badge-red'
                        }`}>
                          {booking.status === 'pending'
                            ? 'Awaiting Owner Allocation'
                            : booking.status === 'allocated' || booking.status === 'confirmed'
                            ? 'Vehicle & Driver Allocated'
                            : booking.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                        Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {booking.pricing?.adjustedFare ? 'Final Fare (Adjusted)' : 'Estimated Fare'}
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-display)' }}>
                        ₹{booking.pricing?.estimatedAmount?.toLocaleString('en-IN')}
                      </div>
                      {booking.pricing?.fareAdjustmentReason && (
                        <div style={{ fontSize: '11px', color: '#059669', fontStyle: 'italic', marginTop: '2px' }}>
                          Note: {booking.pricing.fareAdjustmentReason}
                        </div>
                      )}
                      <div style={{ marginTop: '4px' }}>
                        <span className={`badge ${booking.pricing?.paymentStatus === 'paid' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '11px' }}>
                          {booking.pricing?.paymentStatus === 'paid' ? '✓ Paid & Settled' : 'Payment: Direct Cash / UPI'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Status Tracker Progress Bar */}
                  {/* Status Progress Stepper with Arrows */}
                  {(() => {
                    const steps = [
                      { label: 'Request Created', num: 1 },
                      { label: isRejected ? 'Declined' : 'Owner Review', num: 2 },
                      { label: 'Driver Allocated', num: 3 },
                      { label: 'Trip Completed', num: 4 },
                    ];
                    const getStepState = (idx) => {
                      if (isRejected) {
                        if (idx === 0) return 'done';
                        if (idx === 1) return 'rejected';
                        return 'upcoming';
                      }
                      if (isCompleted) return 'done';
                      if (isAllocated) return idx <= 2 ? 'done' : 'upcoming';
                      if (isPending) return idx === 0 ? 'done' : idx === 1 ? 'active' : 'upcoming';
                      if (isCancelled) return idx === 0 ? 'done' : 'upcoming';
                      return 'upcoming';
                    };
                    const stateColors = {
                      done: { bg: '#10b981', text: '#ffffff', label: '#0f172a' },
                      active: { bg: '#f59e0b', text: '#ffffff', label: '#92400e' },
                      rejected: { bg: '#ef4444', text: '#ffffff', label: '#dc2626' },
                      upcoming: { bg: '#e2e8f0', text: '#94a3b8', label: '#94a3b8' },
                    };
                    const stateIcons = {
                      done: '✓',
                      active: '●',
                      rejected: '✕',
                    };

                    return (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '20px',
                        padding: '12px 14px',
                        background: '#f8fafc',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        overflowX: 'auto',
                        WebkitOverflowScrolling: 'touch',
                      }}>
                        {steps.map((step, idx) => {
                          const state = getStepState(idx);
                          const c = stateColors[state];
                          const isLast = idx === steps.length - 1;

                          return (
                            <React.Fragment key={idx}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 14px',
                                borderRadius: '12px',
                                background: state === 'active' 
                                  ? '#fffbeb' 
                                  : state === 'done' 
                                  ? '#f0fdf4' 
                                  : state === 'rejected' 
                                  ? '#fef2f2' 
                                  : '#ffffff',
                                border: state === 'active' 
                                  ? '1.5px solid #fde68a' 
                                  : state === 'done' 
                                  ? '1.5px solid #bbf7d0' 
                                  : state === 'rejected' 
                                  ? '1.5px solid #fecaca' 
                                  : '1px solid #e2e8f0',
                                flexShrink: 0,
                                transition: 'all 0.2s ease',
                              }}>
                                <div style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  background: c.bg,
                                  color: c.text,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '12px',
                                  fontWeight: 800,
                                  flexShrink: 0,
                                  boxShadow: state !== 'upcoming' ? `0 2px 8px ${c.bg}40` : 'none',
                                }}>
                                  {stateIcons[state] || step.num}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{
                                    fontSize: '9.5px',
                                    fontWeight: 700,
                                    color: state === 'upcoming' ? '#94a3b8' : c.bg,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                  }}>
                                    Step {step.num}
                                  </span>
                                  <span style={{
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: c.label,
                                    whiteSpace: 'nowrap',
                                  }}>
                                    {step.label}
                                  </span>
                                </div>
                              </div>

                              {!isLast && (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  color: state === 'done' ? '#10b981' : '#cbd5e1',
                                  padding: '0 2px',
                                }}>
                                  <ArrowRight size={18} strokeWidth={2.5} />
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Trip Details Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '20px',
                    marginBottom: '18px',
                  }}>
                    {/* Route Details */}
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                        Travel Route & Dates
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                        {booking.route?.fromCity} → {booking.route?.toCity}
                      </div>
                      <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                        Pickup: <strong>{new Date(booking.dates?.pickupDate).toLocaleDateString('en-IN')}</strong> ({booking.dates?.pickupTime || '09:00 AM'})<br/>
                        Dropoff: <strong>{new Date(booking.dates?.dropDate).toLocaleDateString('en-IN')}</strong> ({booking.dates?.totalDays} Days)
                      </div>
                      {booking.route?.pickupAddress && (
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                          📍 Pickup Point: {booking.route.pickupAddress}
                        </div>
                      )}
                    </div>

                    {/* Vehicle Details */}
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                        Reserved Vehicle
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                        {booking.vehicle?.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                        Registration: <strong style={{ color: '#0f172a' }}>{booking.vehicle?.registrationNumber}</strong><br/>
                        Seating Capacity: {booking.seaterRequired} Seater • {booking.vehicle?.type}
                      </div>
                    </div>

                    {/* Operator & Driver Contact Section */}
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Building2 size={13} color="#2563eb" />
                        Vehicle Owner & Travel Operator (Primary)
                      </div>

                      {/* Prominent Owner Details Card */}
                      <div style={{
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        marginTop: '6px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                            {booking.owner?.ownerProfile?.agencyName || booking.owner?.name || 'Verified Travels'}
                          </div>
                          <span className="badge badge-green" style={{ fontSize: '10px', padding: '2px 7px' }}>
                            <ShieldCheck size={11} />
                            Verified
                          </span>
                        </div>

                        {booking.owner?.name && (
                          <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                            Proprietor: <strong>{booking.owner.name}</strong>
                          </div>
                        )}

                        <div style={{ fontSize: '12.5px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={13} color="#2563eb" />
                            <span style={{ fontWeight: 600 }}>{booking.owner?.phone || '+91 98112 34567'}</span>
                          </div>
                          {booking.owner?.email && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                              <Mail size={13} color="#64748b" />
                              <span>{booking.owner.email}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#64748b' }}>
                            <MapPin size={13} color="#64748b" />
                            <span>Base: {booking.owner?.city || booking.owner?.ownerProfile?.operatingBaseCity || 'Delhi NCR'}</span>
                          </div>
                        </div>

                        {/* Direct Payment Note */}
                        <div style={{
                          marginTop: '8px',
                          padding: '4px 8px',
                          background: '#eff6ff',
                          border: '1px solid #dbeafe',
                          borderRadius: '6px',
                          fontSize: '11px',
                          color: '#1d4ed8',
                          fontWeight: 500,
                        }}>
                          💳 Direct Settlement: Settle trip payment directly with operator.
                        </div>

                        {/* Owner Contact Buttons */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          <a
                            href={`https://wa.me/${(booking.owner?.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(booking.owner?.name || 'Operator')},%20this%20is%20${encodeURIComponent(currentUser?.name || '')}%20regarding%20my%20GoEasy%20booking%20%23${booking.bookingId}%20(${encodeURIComponent(booking.route?.fromCity || '')}%20to%20${encodeURIComponent(booking.route?.toCity || '')}).`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-success"
                            style={{ padding: '5px 12px', fontSize: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <MessageCircle size={13} />
                            WhatsApp Owner
                          </a>

                          <a
                            href={`tel:${booking.owner?.phone}`}
                            className="btn-secondary"
                            style={{ padding: '5px 12px', fontSize: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Phone size={13} />
                            Call Owner
                          </a>
                        </div>
                      </div>

                      {/* Allocated Driver Info (Always shown alongside with call button beside driver) */}
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em', marginBottom: '6px' }}>
                          Assigned Trip Driver & Vehicle
                        </div>

                        {booking.driverAllocation?.driverName ? (
                          <div style={{
                            background: '#ecfdf5',
                            border: '1.5px solid #a7f3d0',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                          }}>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 800, color: '#065f46' }}>
                                {booking.driverAllocation.driverName}
                              </div>
                              <div style={{ fontSize: '12px', color: '#047857', fontFamily: 'monospace' }}>
                                {booking.driverAllocation.driverPhone}
                              </div>
                            </div>

                            {/* Call button directly beside driver */}
                            <a
                              href={`tel:${booking.driverAllocation.driverPhone}`}
                              className="btn-success"
                              style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}
                            >
                              <Phone size={13} />
                              Call Driver
                            </a>
                          </div>
                        ) : (
                          <div style={{
                            background: '#fffbeb',
                            border: '1px solid #fde68a',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            color: '#b45309',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}>
                            <Clock size={14} color="#d97706" />
                            <span>Operator will assign driver details prior to departure.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                      Status Note:{' '}
                      {isPending
                        ? 'Owner has been notified via email.'
                        : isAllocated
                        ? 'Driver will report at scheduled time.'
                        : isCompleted
                        ? 'Trip completed successfully.'
                        : isRejected
                        ? 'Booking was declined by vehicle operator.'
                        : 'Booking cancelled.'}
                    </div>

                    {/* Only show Cancel button for active bookings (pending, confirmed, allocated), NOT rejected */}
                    {(isPending || isAllocated) && !isCompleted && !isCancelled && !isRejected && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="btn-danger"
                      >
                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Reservation'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
