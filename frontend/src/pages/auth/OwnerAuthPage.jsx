import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Car, Building2, Mail, Phone, Lock, Upload, CheckSquare, Square, AlertCircle, ArrowRight, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const OwnerAuthPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  // Registration Fields
  const [name, setName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [operatingBaseCity, setOperatingBaseCity] = useState('Delhi NCR');
  const [typeOfVehicle, setTypeOfVehicle] = useState('SUV');
  const [numberOfSeater, setNumberOfSeater] = useState(7);
  const [sampleImageUrl, setSampleImageUrl] = useState('');
  const [sampleImageFile, setSampleImageFile] = useState(null);
  const [policyAccepted, setPolicyAccepted] = useState(true);

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [approvalNotice, setApprovalNotice] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);



  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setApprovalNotice(null);
    setLoading(true);

    try {
      const res = await api.loginOwner({ email, password });
      if (res.success && res.token) {
        login(res.owner, res.token);

        // Routing based on approval stage:
        if (res.owner.status === 'initial_approved' || res.owner.status === 'pending_final_approval') {
          onNavigate('owner-kyc');
        } else {
          onNavigate('owner-dashboard');
        }
      }
    } catch (err) {
      if (err.message && err.message.includes('under review')) {
        setApprovalNotice({
          title: 'Account Awaiting Initial Admin Approval',
          message: 'As per platform security policy, newly registered Vehicle Owners cannot log in until verified and approved by the Super Admin.',
        });
      } else {
        setError(err.message || 'Owner sign in failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setRegistrationSuccess(null);

    if (!policyAccepted) {
      setError('You must accept the commercial rental policies to register as an owner.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('agencyName', agencyName || `${name} Travels`);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('password', password);
      formData.append('operatingBaseCity', operatingBaseCity);
      formData.append('typeOfVehicle', typeOfVehicle);
      formData.append('numberOfSeater', numberOfSeater);
      formData.append('policyAccepted', 'true');

      if (sampleImageFile) {
        formData.append('sampleImage', sampleImageFile);
      } else if (sampleImageUrl) {
        formData.append('sampleImageUrl', sampleImageUrl);
      } else {
        formData.append('sampleImageUrl', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800');
      }

      const res = await api.registerOwner(formData);
      if (res.success) {
        setRegistrationSuccess({
          message: res.message,
          ownerId: res.ownerId,
        });
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: isRegister ? '640px' : '480px',
        width: '100%',
        padding: '36px',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.08)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.35)',
          }}>
            <Building2 size={28} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
            {isRegister ? 'Vehicle Owner Registration' : 'Vehicle Owner Portal'}
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748b' }}>
            {isRegister
              ? 'List your commercial travels fleet and connect directly with passengers'
              : 'Sign in to allocate vehicles, accept trips, and contact customers'}
          </p>
        </div>

        {/* Approval Notice when login blocked */}
        {approvalNotice && (
          <div style={{
            background: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            gap: '12px',
          }}>
            <ShieldAlert size={24} color="#d97706" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>
                {approvalNotice.title}
              </div>
              <div style={{ fontSize: '13px', color: '#b45309', lineHeight: 1.5 }}>
                {approvalNotice.message}
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#78350f' }}>
                💡 <em>Tip: Switch to the Super Admin Portal to approve this owner application.</em>
              </div>
            </div>
          </div>
        )}

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
            marginBottom: '18px',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Success Confirmation */}
        {registrationSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>
              Registration Submitted!
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
              Your application has been received. In accordance with platform requirements, <strong>Super Admin must approve your registration</strong> before you can log in and upload your Aadhaar & PAN KYC documents.
            </p>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '13px',
              color: '#64748b',
              marginBottom: '20px',
              textAlign: 'left',
            }}>
              <strong>Next Steps:</strong><br/>
              1. Admin approves your initial profile.<br/>
              2. You log in to upload Aadhaar and PAN Card.<br/>
              3. Upon final document verification, you can add vehicles and accept bookings.
            </div>
            <button
              onClick={() => {
                setRegistrationSuccess(null);
                setIsRegister(false);
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              Back to Owner Login
            </button>
          </div>
        ) : !isRegister ? (
          /* Login Form */
          <div>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label className="input-label">Registered Owner Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="e.g. contact@yourtravelagency.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label className="input-label">Password</label>
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: '15px' }}
              >
                {loading ? 'Authenticating...' : 'Sign In to Owner Portal'}
                <ArrowRight size={17} />
              </button>
            </form>
          </div>
        ) : (
          /* Registration Form with All Required Fields */
          <form onSubmit={handleRegister}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label className="input-label">Contact Person Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Rajesh Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="input-label">Agency / Operator Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Sharma Travels"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="owner@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="input-label">Phone Number (WhatsApp)</label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  placeholder="+91 98112 34567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label className="input-label">Create Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="input-field"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="input-label">Base Operating City</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Delhi NCR, Jaipur, Bangalore"
                  value={operatingBaseCity}
                  onChange={(e) => setOperatingBaseCity(e.target.value)}
                />
              </div>
            </div>

            {/* Vehicle Details for Initial Application */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '18px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                Primary Fleet Information (Initial Application):
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                <div>
                  <label className="input-label">Type of Vehicle</label>
                  <select
                    className="input-field"
                    value={typeOfVehicle}
                    onChange={(e) => setTypeOfVehicle(e.target.value)}
                  >
                    <option value="SUV">SUV (Innova, XUV700, Fortuner)</option>
                    <option value="MUV">MUV (Ertiga, Carens)</option>
                    <option value="Sedan">Sedan (Dzire, Etios, Ciaz)</option>
                    <option value="Tempo Traveller">Tempo Traveller (12 - 17 Seater)</option>
                    <option value="Luxury Bus">Luxury Mini Bus (21+ Seater)</option>
                    <option value="Hatchback">Hatchback (WagonR, Swift)</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Number of Seater</label>
                  <select
                    className="input-field"
                    value={numberOfSeater}
                    onChange={(e) => setNumberOfSeater(Number(e.target.value))}
                  >
                    <option value={4}>4 Seater</option>
                    <option value={5}>5 Seater</option>
                    <option value={7}>7 Seater</option>
                    <option value={8}>8 Seater</option>
                    <option value={12}>12 Seater</option>
                    <option value={17}>17 Seater</option>
                    <option value={26}>26 Seater</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Sample Image of Vehicle (Upload or URL)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSampleImageFile(e.target.files[0])}
                    style={{ fontSize: '13px' }}
                  />
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>or pre-loaded Cloudinary default</span>
                </div>
              </div>
            </div>

            {/* Checkbox acceptance */}
            <div
              onClick={() => setPolicyAccepted(!policyAccepted)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '22px',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#475569',
              }}
            >
              {policyAccepted ? (
                <CheckSquare size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <Square size={18} color="#94a3b8" style={{ flexShrink: 0, marginTop: '2px' }} />
              )}
              <span>
                I agree to platform terms, understand that Admin initial approval is required before logging in, and undertake to upload valid Aadhaar & PAN card documents.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '15px' }}
            >
              {loading ? 'Submitting Application...' : 'Register as Vehicle Owner'}
              <ArrowRight size={17} />
            </button>
          </form>
        )}

        {/* Toggle between Login and Register */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '18px',
          fontSize: '13.5px',
          color: '#64748b',
        }}>
          {isRegister ? (
            <div>
              Already registered as an owner?{' '}
              <button
                onClick={() => {
                  setIsRegister(false);
                  setError(null);
                  setApprovalNotice(null);
                }}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign In to Owner Portal
              </button>
            </div>
          ) : (
            <div>
              Want to partner as a vehicle owner?{' '}
              <button
                onClick={() => {
                  setIsRegister(true);
                  setError(null);
                  setApprovalNotice(null);
                }}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
              >
                Apply as Fleet Partner
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
