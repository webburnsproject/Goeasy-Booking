import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, ShieldCheck, CheckCircle2, AlertCircle, FileText, Camera, Users, Fuel, Settings2, Calendar, Video, Building2, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

export const VehicleDetailsModal = ({ vehicle, onClose, onBook }) => {
  const [activeTab, setActiveTab] = useState('photos'); // 'photos' | 'documents' | 'specs'
  const [selectedPhoto, setSelectedPhoto] = useState('front');

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

  const photos = vehicle.conditionReport?.photos || {};
  const photoAngles = [
    { key: 'front', label: 'Front Exterior', url: photos.front },
    { key: 'rear', label: 'Rear Exterior', url: photos.rear },
    { key: 'left', label: 'Left Side', url: photos.left },
    { key: 'right', label: 'Right Side', url: photos.right },
    { key: 'interior', label: 'Passenger Interior', url: photos.interior },
    { key: 'dashboard', label: 'Dashboard & Cockpit', url: photos.dashboard },
    { key: 'odometer', label: 'Odometer Reading', url: photos.odometer },
    { key: 'numberPlate', label: 'Number Plate', url: photos.numberPlate },
  ];

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '850px' }}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{vehicle.name}</h2>
              <span className="badge badge-green">
                <ShieldCheck size={13} />
                Admin Verified
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Registration: <strong style={{ color: '#0f172a' }}>{vehicle.registrationNumber}</strong> • {vehicle.owner?.ownerProfile?.agencyName || vehicle.owner?.name}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
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

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '10px 16px',
          borderBottom: '1px solid #f1f5f9',
          background: '#ffffff',
          flexShrink: 0,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}>
          <button
            onClick={() => setActiveTab('photos')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'photos' ? '#eff6ff' : 'transparent',
              color: activeTab === 'photos' ? '#2563eb' : '#64748b',
              fontWeight: 600,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Camera size={15} />
            8-Point Condition Report
          </button>

          <button
            onClick={() => setActiveTab('owner')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'owner' ? '#eff6ff' : 'transparent',
              color: activeTab === 'owner' ? '#2563eb' : '#64748b',
              fontWeight: 600,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Building2 size={15} />
            Vehicle Owner & Operator
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'documents' ? '#eff6ff' : 'transparent',
              color: activeTab === 'documents' ? '#2563eb' : '#64748b',
              fontWeight: 600,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={15} />
            RC & Insurance Verification
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'specs' ? '#eff6ff' : 'transparent',
              color: activeTab === 'specs' ? '#2563eb' : '#64748b',
              fontWeight: 600,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Settings2 size={15} />
            Fleet Specifications & Routes
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-scroll-body" style={{ padding: '24px' }}>
          {activeTab === 'photos' && (
            <div>
              {/* Main Photo Viewer */}
              <div style={{
                position: 'relative',
                width: '100%',
                maxHeight: 'min(280px, 35vh)',
                aspectRatio: '16 / 9',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#0f172a',
                marginBottom: '16px',
              }}>
                <img
                  src={photos[selectedPhoto] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'}
                  alt={selectedPhoto}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)',
                }}>
                  {photoAngles.find((p) => p.key === selectedPhoto)?.label}
                </div>
              </div>

              {/* Angle selector thumbnails */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(140px, 45%), 1fr))',
                gap: '8px',
                marginBottom: '16px',
              }}>
                {photoAngles.map((angle) => (
                  <button
                    key={angle.key}
                    onClick={() => setSelectedPhoto(angle.key)}
                    style={{
                      border: selectedPhoto === angle.key ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '4px',
                      background: '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <img
                      src={angle.url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'}
                      alt={angle.label}
                      style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {angle.label}
                    </div>
                  </button>
                ))}
              </div>

              {/* Condition Report Notes */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  background: '#ecfdf5',
                  color: '#059669',
                  borderRadius: '10px',
                  padding: '8px',
                  display: 'flex',
                }}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                    Physical Condition & Odometer Inspection Note:
                  </div>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                    {vehicle.conditionReport?.existingDamageNotes || 'Inspected, clean and sanitized. No major scratches or dents.'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                    Odometer Logged: <strong>{vehicle.conditionReport?.odometerReading?.toLocaleString() || '24,000'} km</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
              }}>
                {/* RC Document */}
                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '16px',
                  background: '#ffffff',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '14px' }}>
                      <FileText size={18} color="#2563eb" />
                      Registration (RC)
                    </div>
                    <span className="badge badge-green">Verified</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                    Commercial transport registration issued by regional transport office.
                  </p>
                  {vehicle.documents?.rcDocument && (
                    <a
                      href={vehicle.documents.rcDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px', width: '100%' }}
                    >
                      View RC Certificate
                    </a>
                  )}
                </div>

                {/* Insurance Policy */}
                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '16px',
                  background: '#ffffff',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '14px' }}>
                      <FileText size={18} color="#2563eb" />
                      Motor Insurance
                    </div>
                    <span className="badge badge-green">Active</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                    Comprehensive commercial motor insurance covering passengers and third-party liabilities.
                  </p>
                  {vehicle.documents?.insurancePolicy && (
                    <a
                      href={vehicle.documents.insurancePolicy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px', width: '100%' }}
                    >
                      View Insurance Policy
                    </a>
                  )}
                </div>
              </div>

              {/* Optional permits note */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', fontSize: '13px', color: '#64748b', border: '1px solid #e2e8f0' }}>
                <strong>Permits & Compliance:</strong> All India Tourist Permit (AITP), State Fitness Certificate, and Pollution Under Control (PUC) standards verified by GoEasy compliance team.
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                {vehicle.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
              }}>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Seating Capacity</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{vehicle.seatingCapacity} Passengers</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Fuel / Engine</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{vehicle.fuelType}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Transmission</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{vehicle.transmission}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Operating Base</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{vehicle.owner?.city || 'Delhi NCR'}</div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Installed Amenities & Features:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {vehicle.features?.map((f, i) => (
                    <span key={i} className="badge badge-blue">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Available Outstation Routes & Cities:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {vehicle.servicedCities?.map((c, i) => (
                    <span key={i} className="badge badge-purple">
                      📍 {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'owner' && (
            <div>
              <div style={{
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Building2 size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                        {vehicle.owner?.ownerProfile?.agencyName || vehicle.owner?.name || 'Verified Travels'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Licensed Commercial Travel Operator • Reg. on GoEasy
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-green" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    <ShieldCheck size={14} />
                    KYC & Fleet Verified
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                  background: '#ffffff',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #f1f5f9',
                  marginBottom: '16px',
                  fontSize: '13.5px',
                }}>
                  {vehicle.owner?.name && (
                    <div>
                      <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                        Proprietor / Representative
                      </span>
                      <strong style={{ color: '#0f172a' }}>{vehicle.owner.name}</strong>
                    </div>
                  )}

                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                      Direct Phone
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} color="#2563eb" />
                      <strong style={{ color: '#0f172a' }}>{vehicle.owner?.phone || '+91 98112 34567'}</strong>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                      Official Email
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={14} color="#64748b" />
                      <span style={{ color: '#475569' }}>{vehicle.owner?.email || 'contact@operator.in'}</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                      Operating Base City
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="#64748b" />
                      <strong style={{ color: '#0f172a' }}>{vehicle.owner?.city || 'Delhi NCR'}</strong>
                    </div>
                  </div>
                </div>

                {/* Direct Settlement Explanation */}
                <div style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  fontSize: '13px',
                  color: '#1e40af',
                  lineHeight: 1.5,
                  marginBottom: '16px',
                }}>
                  <strong style={{ display: 'block', marginBottom: '4px', fontSize: '13.5px' }}>
                    💳 Direct Settlement (No Gateway Convenience Fees)
                  </strong>
                  GoEasy connects customers directly with commercial fleet owners without taking payment cuts or routing through third-party gateways. Once your reservation request is placed, you communicate and settle the trip fare directly with this verified operator via UPI, Bank Transfer, or Cash upon vehicle inspection and trip commencement.
                </div>

                {/* Direct Contact Buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a
                    href={`https://wa.me/${(vehicle.owner?.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(vehicle.owner?.name || 'Operator')},%20I%20am%20inquiring%20about%20your%20${encodeURIComponent(vehicle.name)}%20(${encodeURIComponent(vehicle.registrationNumber)})%20on%20GoEasy.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-success"
                    style={{ padding: '8px 16px', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <MessageCircle size={15} />
                    WhatsApp Owner Directly
                  </a>

                  <a
                    href={`tel:${vehicle.owner?.phone}`}
                    className="btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Phone size={15} />
                    Call Owner
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div style={{
          padding: '14px 18px',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Standard Base Rate: </span>
            <strong style={{ fontSize: '20px', color: '#0f172a', fontFamily: 'var(--font-display)' }}>
              ₹{vehicle.dailyRate?.toLocaleString('en-IN')}
            </strong>
            <span style={{ fontSize: '12px', color: '#64748b' }}> / day</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(vehicle);
              }}
              className="btn-primary"
            >
              Proceed to Book
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
