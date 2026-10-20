import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ShieldCheck, FileText, Upload, CheckCircle2, AlertCircle, Clock, ArrowRight } from 'lucide-react';

export const OwnerKYCPage = ({ onNavigate }) => {
  const { currentUser, refreshUser } = useAuth();

  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [panFile, setPanFile] = useState(null);

  const [aadhaarPreview, setAadhaarPreview] = useState(null);
  const [panPreview, setPanPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [ownerData, setOwnerData] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await api.getOwnerProfile();
      if (res.success && res.owner) {
        setOwnerData(res.owner);
        if (res.owner.ownerProfile?.kycDocuments) {
          setAadhaarNumber(res.owner.ownerProfile.kycDocuments.aadhaarNumber || '');
          setPanNumber(res.owner.ownerProfile.kycDocuments.panNumber || '');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAadhaarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAadhaarFile(file);
      setAadhaarPreview(URL.createObjectURL(file));
    }
  };

  const handlePanChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPanFile(file);
      setPanPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // If files aren't uploaded, check if user provided sample or demo
    if (!aadhaarFile && !ownerData?.ownerProfile?.kycDocuments?.aadhaarDoc) {
      setError('Aadhaar document copy (PDF/Image) is required.');
      return;
    }
    if (!panFile && !ownerData?.ownerProfile?.kycDocuments?.panDoc) {
      setError('PAN card document copy (PDF/Image) is required.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('aadhaarNumber', aadhaarNumber);
      formData.append('panNumber', panNumber);

      if (aadhaarFile) {
        formData.append('aadhaarDoc', aadhaarFile);
      } else {
        formData.append('aadhaarDoc', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800');
      }

      if (panFile) {
        formData.append('panDoc', panFile);
      } else {
        formData.append('panDoc', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800');
      }

      const res = await api.submitKYC(formData);
      if (res.success) {
        setSuccessMsg('KYC documents submitted successfully! Super Admin has been notified for document verification.');
        await refreshUser();
        await fetchProfile();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit KYC documents.');
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = ownerData?.status || currentUser?.status || 'initial_approved';

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.35)',
          }}>
            <ShieldCheck size={30} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
            Vehicle Owner KYC Verification
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Complete your mandatory government identity verification to unlock fleet additions and accept passenger bookings.
          </p>
        </div>

        {/* Status Stage Banner */}
        <div style={{
          background:
            currentStatus === 'active'
              ? '#ecfdf5'
              : currentStatus === 'pending_final_approval'
              ? '#fffbeb'
              : '#eff6ff',
          border:
            currentStatus === 'active'
              ? '1px solid #a7f3d0'
              : currentStatus === 'pending_final_approval'
              ? '1px solid #fde68a'
              : '1px solid #bfdbfe',
          borderRadius: '14px',
          padding: '18px 20px',
          marginBottom: '28px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
        }}>
          {currentStatus === 'active' ? (
            <CheckCircle2 size={24} color="#059669" style={{ flexShrink: 0 }} />
          ) : currentStatus === 'pending_final_approval' ? (
            <Clock size={24} color="#d97706" style={{ flexShrink: 0 }} />
          ) : (
            <ShieldCheck size={24} color="#2563eb" style={{ flexShrink: 0 }} />
          )}

          <div>
            <div style={{
              fontSize: '15px',
              fontWeight: 700,
              color:
                currentStatus === 'active'
                  ? '#065f46'
                  : currentStatus === 'pending_final_approval'
                  ? '#92400e'
                  : '#1e40af',
              marginBottom: '4px',
            }}>
              {currentStatus === 'active'
                ? 'KYC Fully Verified & Active'
                : currentStatus === 'pending_final_approval'
                ? 'KYC Under Admin Review'
                : 'Action Required: Upload Essential KYC Documents'}
            </div>
            <div style={{
              fontSize: '13px',
              color:
                currentStatus === 'active'
                  ? '#047857'
                  : currentStatus === 'pending_final_approval'
                  ? '#b45309'
                  : '#1d4ed8',
              lineHeight: 1.5,
            }}>
              {currentStatus === 'active'
                ? 'Your Aadhaar and PAN card have been inspected and verified. You have full clearance to register vehicles.'
                : currentStatus === 'pending_final_approval'
                ? 'Your documents have been submitted and are pending Super Admin approval. You will receive an email once verified.'
                : 'Your initial registration has been approved! As an essential compliance requirement, please submit your Aadhaar and PAN details below.'}
            </div>

            {currentStatus === 'active' && (
              <button
                onClick={() => onNavigate('owner-dashboard')}
                className="btn-primary"
                style={{ marginTop: '12px', padding: '8px 18px', fontSize: '13px' }}
              >
                Go to Fleet Dashboard
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '12px',
            color: '#dc2626',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '12px',
            color: '#059669',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* KYC Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '28px',
          }}>
            {/* 1. Aadhaar Card Card */}
            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <FileText size={20} color="#2563eb" />
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>1. Aadhaar Card (Essential)</h4>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px' }}>
                Government-issued identity proof with photo and address clearly visible.
              </p>

              <div style={{ marginBottom: '14px' }}>
                <label className="input-label">Aadhaar Card Number</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. 5432 8901 2345"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  disabled={currentStatus === 'active'}
                />
              </div>

              <div>
                <label className="input-label">Upload Aadhaar Document (PDF/Image)</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleAadhaarChange}
                  disabled={currentStatus === 'active'}
                  style={{ fontSize: '13px' }}
                />
                {aadhaarPreview && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={aadhaarPreview} alt="Aadhaar Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                )}
                {ownerData?.ownerProfile?.kycDocuments?.aadhaarDoc && !aadhaarPreview && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                    ✓ Current document on file (Cloudinary stored)
                  </div>
                )}
              </div>
            </div>

            {/* 2. PAN Card Card */}
            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <FileText size={20} color="#2563eb" />
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>2. PAN Card (Essential)</h4>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px' }}>
                Permanent Account Number issued by the Income Tax Department of India.
              </p>

              <div style={{ marginBottom: '14px' }}>
                <label className="input-label">PAN Number</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  className="input-field"
                  placeholder="e.g. ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  disabled={currentStatus === 'active'}
                />
              </div>

              <div>
                <label className="input-label">Upload PAN Document (PDF/Image)</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handlePanChange}
                  disabled={currentStatus === 'active'}
                  style={{ fontSize: '13px' }}
                />
                {panPreview && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={panPreview} alt="PAN Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                )}
                {ownerData?.ownerProfile?.kycDocuments?.panDoc && !panPreview && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                    ✓ Current document on file (Cloudinary stored)
                  </div>
                )}
              </div>
            </div>
          </div>

          {currentStatus !== 'active' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ padding: '12px 28px' }}
              >
                {loading ? 'Uploading to Cloudinary...' : 'Submit KYC for Admin Review'}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
