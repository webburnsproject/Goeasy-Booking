import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  Building2,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Camera,
  Lock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Car,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const ProfilePage = ({ onNavigate }) => {
  const { currentUser, role, updateCurrentUser, refreshUser } = useAuth();

  // Tab: 'details' | 'agency' | 'security'
  const [activeTab, setActiveTab] = useState(role === 'owner' ? 'agency' : 'details');

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  // Owner specific
  const [agencyName, setAgencyName] = useState('');
  const [operatingBaseCity, setOperatingBaseCity] = useState('');
  const [bio, setBio] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  // Avatar / Logo State
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  // Security / Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Populate data when currentUser loads
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setCity(currentUser.city || '');
      setAddress(currentUser.address || '');

      const ownerProf = currentUser.ownerProfile || {};
      setAgencyName(ownerProf.agencyName || '');
      setOperatingBaseCity(ownerProf.operatingBaseCity || currentUser.city || '');
      setBio(ownerProf.bio || '');
      setGstNumber(ownerProf.gstNumber || '');

      setAvatarPreview(currentUser.avatar || ownerProf.agencyLogo || '');
    }
  }, [currentUser]);

  // Handle Logo / Avatar file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size exceeds 5MB limit. Please choose a smaller photo.');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick preset avatars
  const avatarPresets = role === 'owner'
    ? [
        { label: 'Royal Fleet', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&auto=format&fit=crop&q=80' },
        { label: 'Coastal Tours', url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=200&auto=format&fit=crop&q=80' },
        { label: 'Metro Cabs', url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=200&auto=format&fit=crop&q=80' },
        { label: 'Express Wheels', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=200&auto=format&fit=crop&q=80' },
      ]
    : [
        { label: 'Traveler 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
        { label: 'Traveler 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
        { label: 'Traveler 3', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
        { label: 'Traveler 4', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80' },
      ];

  const handleSelectPreset = (url) => {
    setAvatarFile(null);
    setAvatarPreview(url);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Validate password if user entered one
    if (newPassword) {
      if (!currentPassword) {
        setErrorMsg('Please enter your current password to set a new password.');
        setLoading(false);
        return;
      }
      if (newPassword.length < 6) {
        setErrorMsg('New password must be at least 6 characters long.');
        setLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New passwords do not match.');
        setLoading(false);
        return;
      }
    }

    try {
      // Use FormData to support file upload if present
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('city', city);
      formData.append('address', address);

      if (role === 'owner') {
        formData.append('agencyName', agencyName);
        formData.append('operatingBaseCity', operatingBaseCity);
        formData.append('bio', bio);
        formData.append('gstNumber', gstNumber);
      }

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      } else if (avatarPreview) {
        formData.append('avatar', avatarPreview);
      }

      if (newPassword) {
        formData.append('currentPassword', currentPassword);
        formData.append('newPassword', newPassword);
      }

      const res = await api.updateProfile(formData);
      if (res.success && res.user) {
        updateCurrentUser(res.user);
        setSuccessMsg('Profile updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setAvatarFile(null);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while updating profile.');
    } finally {
      setLoading(false);
    }
  };

  const ownerKycActive = currentUser?.status === 'active';

  return (
    <div style={{ maxWidth: '1000px', margin: 'clamp(16px, 3vw, 36px) auto', padding: '0 16px' }}>
      {/* Top Banner Card */}
      <div className="glass-panel" style={{
        padding: '0',
        overflow: 'hidden',
        marginBottom: '24px',
        position: 'relative',
      }}>
        {/* Decorative Gradient Header */}
        <div style={{
          height: '120px',
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            display: 'flex',
            gap: '8px',
          }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              {role === 'owner' ? <Car size={14} /> : <User size={14} />}
              {role === 'owner' ? 'Commercial Fleet Partner' : 'Registered Customer'}
            </span>
            {role === 'owner' && (
              <span className={`badge ${ownerKycActive ? 'badge-green' : 'badge-yellow'}`}>
                <ShieldCheck size={13} />
                {ownerKycActive ? 'KYC Verified' : 'KYC Review Pending'}
              </span>
            )}
          </div>
        </div>

        {/* Profile Info Row with Avatar */}
        <div style={{
          padding: '0 24px 24px',
          marginTop: '-45px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '18px', flexWrap: 'wrap' }}>
            {/* Avatar / Logo with Upload overlay */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: '92px',
                height: '92px',
                borderRadius: role === 'owner' ? '20px' : '50%',
                overflow: 'hidden',
                background: '#ffffff',
                border: '4px solid #ffffff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
                fontSize: '32px',
                fontWeight: 800,
              }}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={currentUser?.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : role === 'owner' ? (
                  <Building2 size={42} />
                ) : (
                  currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'
                )}
              </div>

              {/* Upload trigger button */}
              <label
                htmlFor="avatar-file-input"
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(37, 99, 235, 0.4)',
                  transition: 'transform 0.2s',
                }}
                title={role === 'owner' ? 'Upload Agency Logo' : 'Upload Profile Picture'}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Camera size={16} />
              </label>
              <input
                id="avatar-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                {role === 'owner'
                  ? (currentUser?.ownerProfile?.agencyName || currentUser?.name || 'Travel Fleet Agency')
                  : currentUser?.name}
              </h1>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                {currentUser?.email} • {currentUser?.phone} • {currentUser?.city || 'Delhi NCR'}
              </p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          {role === 'owner' && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => onNavigate('owner-dashboard')}
                className="btn-secondary"
                style={{ fontSize: '13px', padding: '8px 14px' }}
              >
                <Car size={15} /> Fleet Dashboard
              </button>
              <button
                type="button"
                onClick={() => onNavigate('owner-kyc')}
                className="btn-secondary"
                style={{ fontSize: '13px', padding: '8px 14px', color: '#d97706', borderColor: '#fde68a', background: '#fffbeb' }}
              >
                <FileText size={15} /> KYC Verification
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preset Logo / Avatar Selector Bar */}
      <div className="glass-panel" style={{
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#2563eb" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
            {role === 'owner' ? 'Choose Preset Agency Logo:' : 'Choose Preset Avatar:'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {avatarPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset.url)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px 4px 4px',
                borderRadius: '9999px',
                border: avatarPreview === preset.url ? '2px solid #2563eb' : '1px solid #e2e8f0',
                background: avatarPreview === preset.url ? '#eff6ff' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <img
                src={preset.url}
                alt={preset.label}
                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{preset.label}</span>
            </button>
          ))}
          <label
            htmlFor="avatar-file-input"
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
          >
            <Upload size={13} /> Upload Custom
          </label>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '20px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '4px',
      }}>
        {role === 'owner' && (
          <button
            type="button"
            onClick={() => setActiveTab('agency')}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'none',
              fontSize: '14.5px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              color: activeTab === 'agency' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'agency' ? '2.5px solid #2563eb' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Building2 size={16} /> Commercial Agency Info
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('details')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontSize: '14.5px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            color: activeTab === 'details' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'details' ? '2.5px solid #2563eb' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <User size={16} /> Personal Account Details
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontSize: '14.5px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            color: activeTab === 'security' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'security' ? '2.5px solid #2563eb' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Lock size={16} /> Security & Password
        </button>
      </div>

      {/* Feedback Messages */}
      {successMsg && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '20px',
          color: '#065f46',
          fontSize: '13.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <CheckCircle2 size={18} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '20px',
          color: '#dc2626',
          fontSize: '13.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <AlertCircle size={18} />
          {errorMsg}
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile}>
        {/* Tab 1: Commercial Agency Information (For Owners) */}
        {role === 'owner' && activeTab === 'agency' && (
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px', color: '#0f172a' }}>
              Travel Fleet Agency Profile
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              This commercial information is displayed to customers searching vehicles and booking your fleet.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
              gap: '18px',
              marginBottom: '18px',
            }}>
              <div>
                <label className="input-label">Agency / Business Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Venkateshwara Coastal Tours"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Operating Base City</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Bengaluru, Karnataka"
                  value={operatingBaseCity}
                  onChange={(e) => setOperatingBaseCity(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">GSTIN / Business Registration No. (Optional)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. 29AAAAA0000A1Z5"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                />
              </div>

              <div>
                <label className="input-label">KYC Verification Status</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: ownerKycActive ? '#f0fdf4' : '#fffbeb',
                  border: ownerKycActive ? '1px solid #bbf7d0' : '1px solid #fde68a',
                  borderRadius: '10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} color={ownerKycActive ? '#16a34a' : '#d97706'} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: ownerKycActive ? '#166534' : '#92400e' }}>
                      {ownerKycActive ? 'Verified Commercial Operator' : 'Documents Under Review'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('owner-kyc')}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    View Documents
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="input-label">Agency Description / Fleet Specialties</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Describe your outstation services, airport transfers, clean fleet standards, and driver experience..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Personal Details */}
        {activeTab === 'details' && (
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px', color: '#0f172a' }}>
              Personal Account Information
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Manage your personal contact details used for reservation communication and account notifications.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
              gap: '18px',
              marginBottom: '18px',
            }}>
              <div>
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Venkatesh Rao"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Email Address (Registered)</label>
                <input
                  type="email"
                  disabled
                  className="input-field"
                  value={currentUser?.email || ''}
                  style={{ background: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
                />
                <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                  Email address cannot be changed directly for security reasons.
                </span>
              </div>

              <div>
                <label className="input-label">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  placeholder="e.g. +91 9448123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Primary City / Region</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Bengaluru, Karnataka"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="input-label">Full Address / Registered Office</label>
              <textarea
                className="input-field"
                rows={2}
                placeholder="Street address, building name, landmark, postal code..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Security & Password */}
        {activeTab === 'security' && (
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px', color: '#0f172a' }}>
              Account Security & Password
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Keep your GoEasy account secure. Leave password fields blank if you only wish to update profile details.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
              gap: '18px',
            }}>
              <div>
                <label className="input-label">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="input-label">New Password (Min 6 characters)</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '40px',
        }}>
          <button
            type="button"
            onClick={() => onNavigate(role === 'owner' ? 'owner-dashboard' : 'user-dashboard')}
            className="btn-secondary"
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '14px', minWidth: '150px', justifyContent: 'center' }}
          >
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
