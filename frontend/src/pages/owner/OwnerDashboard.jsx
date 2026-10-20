import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Car,
  PlusCircle,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Camera,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  Eye,
  Edit3,
  Power,
  Check,
  X,
  DollarSign,
  Upload,
  Image,
  Trash2,
  User,
} from 'lucide-react';

// Reusable File Upload Drop Zone Component
const FileUploadBox = ({ label, file, onFileSelect, accept, required, isPhoto }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);

  // Generate preview for image files
  React.useEffect(() => {
    if (file && file.type && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) onFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <div>
      <label className="input-label">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: dragOver
            ? '2px dashed #3b82f6'
            : file
            ? '2px solid #a7f3d0'
            : '2px dashed #cbd5e1',
          borderRadius: '12px',
          padding: file ? '0' : '20px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? '#eff6ff' : file ? '#f0fdf4' : '#ffffff',
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
          minHeight: isPhoto ? '120px' : '80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFileSelect(f);
            e.target.value = '';
          }}
        />

        {file ? (
          <div style={{ width: '100%', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: '100%',
                  maxHeight: isPhoto ? '100px' : '60px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            )}
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              maxWidth: '100%',
            }}>
              <Check size={13} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                {file.name}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                background: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={11} /> Remove
            </button>
          </div>
        ) : (
          <>
            {isPhoto ? (
              <Camera size={24} color="#94a3b8" style={{ marginBottom: '6px' }} />
            ) : (
              <Upload size={22} color="#94a3b8" style={{ marginBottom: '6px' }} />
            )}
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569' }}>
              Click to upload or drag & drop
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              {isPhoto ? 'JPG, PNG, WebP' : 'PDF, JPG, PNG'}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const OwnerDashboard = ({ onNavigate }) => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet' | 'bookings' | 'add-vehicle'
  const [profile, setProfile] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Fare adjustment modal state
  const [fareModalBooking, setFareModalBooking] = useState(null);
  const [adjustedAmount, setAdjustedAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [savingFare, setSavingFare] = useState(false);

  // Add Vehicle Form State
  const [vName, setVName] = useState('');
  const [vBrand, setVBrand] = useState('Toyota');
  const [vModel, setVModel] = useState('');
  const [vRegNo, setVRegNo] = useState('');
  const [vType, setVType] = useState('MUV');
  const [vSeater, setVSeater] = useState(7);
  const [vFuel, setVFuel] = useState('Diesel');
  const [vTransmission, setVTransmission] = useState('Manual');
  const [vDailyRate, setVDailyRate] = useState(3800);
  const [vServicedCities, setVServicedCities] = useState('Delhi, Jaipur, Agra, Chandigarh');
  const [vFeatures, setVFeatures] = useState('Air Conditioning, Pushback Seats, Fastag, Roof Carrier');
  const [vDescription, setVDescription] = useState('');
  const [vOdometer, setVOdometer] = useState(28500);
  const [vDamageNotes, setVDamageNotes] = useState('Spotless interior, clean body panels, no mechanical defects.');
  const [vVideoUrl, setVVideoUrl] = useState('');

  // 8 Condition Photos (File objects)
  const [frontFile, setFrontFile] = useState(null);
  const [rearFile, setRearFile] = useState(null);
  const [leftFile, setLeftFile] = useState(null);
  const [rightFile, setRightFile] = useState(null);
  const [interiorFile, setInteriorFile] = useState(null);
  const [dashboardFile, setDashboardFile] = useState(null);
  const [odometerFile, setOdometerFile] = useState(null);
  const [numberPlateFile, setNumberPlateFile] = useState(null);

  // Document files (File objects)
  const [rcDocFile, setRcDocFile] = useState(null);
  const [insuranceDocFile, setInsuranceDocFile] = useState(null);
  const [pucDocFile, setPucDocFile] = useState(null);
  const [permitDocFile, setPermitDocFile] = useState(null);

  const [addingVehicle, setAddingVehicle] = useState(false);

  // Driver Allocation form for booking
  const [selectedBookingForAlloc, setSelectedBookingForAlloc] = useState(null);
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');

  // Lock body scroll when any modal is open
  useEffect(() => {
    const isModalOpen = !!(selectedBookingForAlloc || fareModalBooking);
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedBookingForAlloc, fareModalBooking]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profRes, vehRes, bookRes] = await Promise.all([
        api.getOwnerProfile(),
        api.getOwnerVehicles(),
        api.getOwnerBookings(),
      ]);

      if (profRes.success) setProfile(profRes);
      if (vehRes.success) setVehicles(vehRes.vehicles || []);
      if (bookRes.success) setBookings(bookRes.bookings || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Toggle vehicle active/inactive booking availability
  const handleToggleAvailability = async (vehId, currentAvailable) => {
    const vehicle = vehicles.find((v) => v._id === vehId);
    if (vehicle && vehicle.status !== 'approved') {
      alert('Only admin-approved vehicles can be activated for bookings.');
      return;
    }
    try {
      const newAvailable = !currentAvailable;
      const res = await api.toggleVehicleAllocation(vehId, { isAvailable: newAvailable });
      if (res.success) {
        setVehicles((prev) =>
          prev.map((v) => (v._id === vehId ? { ...v, isAvailable: newAvailable } : v))
        );
      }
    } catch (err) {
      alert('Error updating availability: ' + err.message);
    }
  };

  // Toggle internal payment proof / settlement status
  const handleTogglePayment = async (bookingId, newPaymentStatus) => {
    try {
      const res = await api.updateBookingStatus(bookingId, {
        paymentStatus: newPaymentStatus,
      });
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? res.booking : b))
        );
      }
    } catch (err) {
      alert('Error updating payment status: ' + err.message);
    }
  };

  // Save adjusted fare
  const handleSaveFareAdjustment = async (e) => {
    e.preventDefault();
    if (!fareModalBooking) return;
    try {
      setSavingFare(true);
      const res = await api.updateBookingStatus(fareModalBooking._id, {
        adjustedFare: Number(adjustedAmount),
        fareAdjustmentReason: adjustmentReason,
      });
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === fareModalBooking._id ? res.booking : b))
        );
        setFareModalBooking(null);
      }
    } catch (err) {
      alert('Error adjusting fare: ' + err.message);
    } finally {
      setSavingFare(false);
    }
  };

  // Submit new vehicle with file uploads via FormData
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validate required files
    if (!rcDocFile) {
      setError('Registration Certificate (RC) document is required. Please upload the file.');
      return;
    }
    if (!insuranceDocFile) {
      setError('Motor Insurance Policy document is required. Please upload the file.');
      return;
    }

    try {
      setAddingVehicle(true);
      const formData = new FormData();

      // Text fields
      formData.append('name', vName);
      formData.append('brand', vBrand);
      formData.append('model', vModel || vName);
      formData.append('registrationNumber', vRegNo);
      formData.append('type', vType);
      formData.append('seatingCapacity', String(Number(vSeater)));
      formData.append('fuelType', vFuel);
      formData.append('transmission', vTransmission);
      formData.append('dailyRate', String(Number(vDailyRate)));
      formData.append('servicedCities', vServicedCities);
      formData.append('features', vFeatures);
      formData.append('description', vDescription);
      formData.append('odometerReading', String(Number(vOdometer)));
      formData.append('existingDamageNotes', vDamageNotes);
      if (vVideoUrl) formData.append('videoInspectionUrl', vVideoUrl);

      // Document files (field names must match Multer config in ownerRoutes.js)
      if (rcDocFile) formData.append('rcDocument', rcDocFile);
      if (insuranceDocFile) formData.append('insurancePolicy', insuranceDocFile);
      if (pucDocFile) formData.append('pucCertificate', pucDocFile);
      if (permitDocFile) formData.append('rentalPermit', permitDocFile);

      // 8 Condition report photo files
      if (frontFile) formData.append('front', frontFile);
      if (rearFile) formData.append('rear', rearFile);
      if (leftFile) formData.append('left', leftFile);
      if (rightFile) formData.append('right', rightFile);
      if (interiorFile) formData.append('interior', interiorFile);
      if (dashboardFile) formData.append('dashboard', dashboardFile);
      if (odometerFile) formData.append('odometer', odometerFile);
      if (numberPlateFile) formData.append('numberPlate', numberPlateFile);

      const res = await api.addVehicle(formData);
      if (res.success) {
        setSuccessMsg('Vehicle registered successfully! It is now pending Super Admin approval of documents & condition photos.');
        setActiveTab('fleet');
        loadData();
      }
    } catch (err) {
      setError(err.message || 'Failed to register vehicle.');
    } finally {
      setAddingVehicle(false);
    }
  };

  // Update booking status / allocate driver
  const handleUpdateBooking = async (bookingId, status, dName, dPhone) => {
    try {
      const res = await api.updateBookingStatus(bookingId, {
        status,
        driverName: dName,
        driverPhone: dPhone,
      });
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? res.booking : b))
        );
        setSelectedBookingForAlloc(null);
      }
    } catch (err) {
      alert('Error updating booking: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: 'clamp(16px, 3vw, 30px) auto', padding: '0 16px' }}>
      {/* Top Header Card */}
      <div className="glass-panel" style={{
        padding: '28px',
        marginBottom: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div
            onClick={() => onNavigate('profile')}
            title="Manage Agency Profile & Logo"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.35)',
              flexShrink: 0,
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {(profile?.owner?.avatar || profile?.owner?.ownerProfile?.agencyLogo || currentUser?.avatar || currentUser?.ownerProfile?.agencyLogo) ? (
              <img
                src={profile?.owner?.avatar || profile?.owner?.ownerProfile?.agencyLogo || currentUser?.avatar || currentUser?.ownerProfile?.agencyLogo}
                alt="Agency Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Car size={28} />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800 }}>
                {loading ? (
                  <div className="skeleton" style={{ width: '220px', height: '28px', display: 'inline-block' }} />
                ) : (
                  profile?.owner?.ownerProfile?.agencyName || currentUser?.name || 'My Travel Agency'
                )}
              </h1>
              {loading ? (
                <div className="skeleton" style={{ width: '90px', height: '22px', borderRadius: '9999px' }} />
              ) : (
                <span className={`badge ${profile?.owner?.status === 'active' ? 'badge-green' : 'badge-yellow'}`}>
                  <ShieldCheck size={13} />
                  {profile?.owner?.status === 'active' ? 'KYC Verified' : 'KYC Under Review'}
                </span>
              )}
            </div>
            {loading ? (
              <div className="skeleton" style={{ width: '280px', height: '14px', marginTop: '6px' }} />
            ) : (
              <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '2px', wordBreak: 'break-word' }}>
                Operator Contact: {currentUser?.phone} • {currentUser?.email} • {profile?.owner?.city || 'Delhi NCR'}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('profile')}
            className="btn-secondary"
            title="Edit Agency Profile & Logo"
          >
            <User size={16} />
            Agency Profile
          </button>

          {profile?.owner?.status !== 'active' && !loading && (
            <button
              onClick={() => onNavigate('owner-kyc')}
              className="btn-secondary"
              style={{ color: '#d97706', borderColor: '#fde68a', background: '#fffbeb' }}
            >
              <FileText size={16} />
              Verify KYC Documents
            </button>
          )}

          <button
            onClick={() => setActiveTab('add-vehicle')}
            className="btn-primary"
          >
            <PlusCircle size={17} />
            Add Vehicle to Fleet
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>Total Fleet Size</div>
          {loading ? (
            <>
              <div className="skeleton" style={{ width: '60px', height: '30px', margin: '6px 0', borderRadius: '6px' }} />
              <div className="skeleton" style={{ width: '110px', height: '14px', borderRadius: '4px' }} />
            </>
          ) : (
            <>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
                {vehicles.length}
              </div>
              <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
                {vehicles.filter((v) => v.status === 'approved' && v.isAvailable !== false).length} Active & Searchable
              </div>
            </>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>Active Bookings</div>
          {loading ? (
            <>
              <div className="skeleton" style={{ width: '60px', height: '30px', margin: '6px 0', borderRadius: '6px' }} />
              <div className="skeleton" style={{ width: '130px', height: '14px', borderRadius: '4px' }} />
            </>
          ) : (
            <>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#2563eb', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
                {bookings.filter((b) => ['pending', 'confirmed', 'allocated'].includes(b.status)).length}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                {bookings.filter((b) => b.status === 'pending').length} Pending confirmation
              </div>
            </>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>Completed Trips</div>
          {loading ? (
            <>
              <div className="skeleton" style={{ width: '60px', height: '30px', margin: '6px 0', borderRadius: '6px' }} />
              <div className="skeleton" style={{ width: '140px', height: '14px', borderRadius: '4px' }} />
            </>
          ) : (
            <>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
                {bookings.filter((b) => b.status === 'completed').length}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Direct passenger settlements
              </div>
            </>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>Estimated Volume</div>
          {loading ? (
            <>
              <div className="skeleton" style={{ width: '90px', height: '30px', margin: '6px 0', borderRadius: '6px' }} />
              <div className="skeleton" style={{ width: '150px', height: '14px', borderRadius: '4px' }} />
            </>
          ) : (
            <>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
                ₹{bookings.reduce((sum, b) => sum + (b.pricing?.estimatedAmount || 0), 0).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Total booking requests value
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '24px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '4px',
      }}>
        <button
          onClick={() => setActiveTab('fleet')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontSize: '14.5px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            color: activeTab === 'fleet' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'fleet' ? '2.5px solid #2563eb' : 'none',
            cursor: 'pointer',
          }}
        >
          My Registered Fleet {loading ? '' : `(${vehicles.length})`}
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontSize: '14.5px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            color: activeTab === 'bookings' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'bookings' ? '2.5px solid #2563eb' : 'none',
            cursor: 'pointer',
          }}
        >
          Customer Bookings {loading ? '' : `(${bookings.length})`}
        </button>

        <button
          onClick={() => setActiveTab('add-vehicle')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontSize: '14.5px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            color: activeTab === 'add-vehicle' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'add-vehicle' ? '2.5px solid #2563eb' : 'none',
            cursor: 'pointer',
          }}
        >
          + Add New Vehicle
        </button>
      </div>

      {/* Tab 1: Fleet */}
      {activeTab === 'fleet' && (
        <div>
          {loading ? (
            /* Skeleton Pulse for Fleet Grid */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
              gap: '24px',
            }}>
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass-card" style={{ padding: '20px' }}>
                  <div className="skeleton" style={{ height: '180px', width: '100%', borderRadius: '12px', marginBottom: '14px' }} />
                  <div className="skeleton" style={{ height: '22px', width: '65%', borderRadius: '6px', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ height: '16px', width: '45%', borderRadius: '4px', marginBottom: '16px' }} />
                  <div className="skeleton" style={{ height: '38px', width: '100%', borderRadius: '8px' }} />
                </div>
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Car size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No Vehicles in Fleet Yet</h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                Add your Innova, Ertiga, Tempo Traveller, or outstation cabs with 8-point condition inspection photos.
              </p>
              <button onClick={() => setActiveTab('add-vehicle')} className="btn-primary">
                Add First Vehicle
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
              gap: '24px',
            }}>
              {vehicles.map((v) => (
                <div key={v._id} className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ position: 'relative', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px' }}>
                    <img
                      src={v.conditionReport?.photos?.front || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'}
                      alt={v.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                      <span className={`badge ${
                        v.status === 'approved'
                          ? (v.isAvailable !== false ? 'badge-green' : 'badge-yellow')
                          : v.status === 'rejected'
                          ? 'badge-red'
                          : 'badge-yellow'
                      }`}>
                        {v.status === 'approved'
                          ? (v.isAvailable !== false ? 'Live & Searchable' : 'Hidden / Inactive')
                          : v.status === 'rejected'
                          ? 'Rejected'
                          : 'Pending Admin Verification'}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>{v.name}</h3>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                    Reg: <strong style={{ color: '#0f172a' }}>{v.registrationNumber}</strong> • {v.seatingCapacity} Seater • {v.fuelType}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Rate: </span>
                      <strong style={{ color: '#0f172a' }}>₹{v.dailyRate}/day</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Trips: </span>
                      <strong>{v.totalTrips || 0}</strong>
                    </div>
                  </div>

                  {/* Active / Inactive Booking Visibility Toggle */}
                  <div style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    {v.status === 'approved' ? (
                      <>
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#1e293b' }}>
                            Booking Visibility:
                          </div>
                          <div style={{
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: v.isAvailable !== false ? '#10b981' : '#f59e0b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            marginTop: '2px',
                          }}>
                            <span style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: v.isAvailable !== false ? '#10b981' : '#f59e0b',
                              display: 'inline-block',
                            }} />
                            {v.isAvailable !== false ? 'Active (Open for Booking)' : 'Inactive (Hidden from Search)'}
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleAvailability(v._id, v.isAvailable !== false)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 13px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: v.isAvailable !== false ? '#fff1f2' : '#ecfdf5',
                            color: v.isAvailable !== false ? '#e11d48' : '#059669',
                            border: v.isAvailable !== false ? '1px solid #fecdd3' : '1px solid #a7f3d0',
                          }}
                          title={v.isAvailable !== false ? 'Set to Inactive to hide from customer search' : 'Set to Active to show for customer bookings'}
                        >
                          <Power size={13} />
                          {v.isAvailable !== false ? 'Set Inactive' : 'Set Active'}
                        </button>
                      </>
                    ) : (
                      <>
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#1e293b' }}>
                            Booking Visibility:
                          </div>
                          <div style={{
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: v.status === 'rejected' ? '#dc2626' : '#d97706',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            marginTop: '2px',
                          }}>
                            <span style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: v.status === 'rejected' ? '#dc2626' : '#f59e0b',
                              display: 'inline-block',
                            }} />
                            {v.status === 'rejected' ? 'Rejected by Admin' : 'Pending Verification (Not Searchable)'}
                          </div>
                        </div>

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            background: v.status === 'rejected' ? '#fef2f2' : '#fffbeb',
                            color: v.status === 'rejected' ? '#991b1b' : '#b45309',
                            border: v.status === 'rejected' ? '1px solid #fecaca' : '1px solid #fde68a',
                          }}
                          title={v.status === 'rejected' ? 'Vehicle registration declined by admin.' : 'Cannot be activated until Admin approves documents & inspection.'}
                        >
                          {v.status === 'rejected' ? <AlertCircle size={13} /> : <Clock size={13} />}
                          {v.status === 'rejected' ? 'Declined' : 'Awaiting Approval'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Customer Bookings & Direct Contact */}
      {activeTab === 'bookings' && (
        <div>
          {loading ? (
            /* Skeleton Pulse for Bookings */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2].map((n) => (
                <div key={n} className="glass-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div className="skeleton" style={{ width: '180px', height: '22px', borderRadius: '6px' }} />
                    <div className="skeleton" style={{ width: '100px', height: '24px', borderRadius: '12px' }} />
                  </div>
                  <div className="skeleton" style={{ width: '100%', height: '80px', borderRadius: '10px' }} />
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Calendar size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No Booking Requests Yet</h3>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                When customers search and book your vehicles, requests will appear here with 1-click WhatsApp, Phone call, and Email links.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map((b) => (
                <div key={b._id} className="glass-panel" style={{ padding: '24px' }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '16px',
                    marginBottom: '16px',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                          Ref #{b.bookingId}
                        </span>
                        <span className={`badge ${
                          b.status === 'allocated' || b.status === 'confirmed'
                            ? 'badge-green'
                            : b.status === 'pending'
                            ? 'badge-yellow'
                            : 'badge-purple'
                        }`}>
                          {b.status.toUpperCase()}
                        </span>

                        {/* Internal Payment Settlement Proof Badge */}
                        <span
                          className={`badge ${b.pricing?.paymentStatus === 'paid' ? 'badge-green' : 'badge-yellow'}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          {b.pricing?.paymentStatus === 'paid' ? (
                            <>
                              <Check size={12} />
                              PAID (SETTLED)
                            </>
                          ) : (
                            <>
                              <Clock size={12} />
                              UNPAID (INTERNAL)
                            </>
                          )}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>
                        Requested on {new Date(b.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Internal Fare Total</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '6px' }}>
                        {b.pricing?.adjustedFare && b.pricing?.adjustedFare !== b.pricing?.estimatedAmount && (
                          <span style={{ fontSize: '13px', textDecoration: 'line-through', color: '#94a3b8' }}>
                            ₹{b.pricing?.estimatedAmount?.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-display)' }}>
                          ₹{(b.pricing?.adjustedFare || b.pricing?.estimatedAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      {b.pricing?.fareAdjustmentReason && (
                        <div style={{ fontSize: '11px', color: '#059669', fontStyle: 'italic', marginTop: '2px' }}>
                          Note: {b.pricing.fareAdjustmentReason}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '20px',
                    marginBottom: '20px',
                  }}>
                    {/* Route & Dates */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                        Route & Timing
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                        {b.route?.fromCity} → {b.route?.toCity}
                      </div>
                      <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                        Pickup: {new Date(b.dates?.pickupDate).toLocaleDateString('en-IN')} ({b.dates?.pickupTime || '09:00 AM'})<br/>
                        Dropoff: {new Date(b.dates?.dropDate).toLocaleDateString('en-IN')} ({b.dates?.totalDays} Days)
                      </div>
                      {b.route?.pickupAddress && (
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                          📍 Pickup: {b.route.pickupAddress}
                        </div>
                      )}
                    </div>

                    {/* Customer Info & 1-Click Contacts */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                        Customer Contact (1-Click Direct Links)
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                        {b.user?.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                        Phone: {b.user?.phone} • Email: {b.user?.email}
                      </div>

                      {/* WhatsApp, Call, Mail Buttons (Requirement: "contact customer through WhatsApp, call, mail") */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                        <a
                          href={`https://wa.me/${(b.user?.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(b.user?.name || '')},%20this%20is%20${encodeURIComponent(currentUser?.name || 'GoEasy Travels')}%20regarding%20your%20vehicle%20booking%20%23${b.bookingId}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-success"
                          style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none' }}
                        >
                          <MessageCircle size={14} />
                          WhatsApp
                        </a>

                        <a
                          href={`tel:${b.user?.phone}`}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none' }}
                        >
                          <Phone size={14} />
                          Call
                        </a>

                        <a
                          href={`mailto:${b.user?.email}?subject=GoEasy%20Booking%20Confirmation%20%23${b.bookingId}&body=Hello%20${encodeURIComponent(b.user?.name || '')},%20we%20have%20received%20your%20reservation...`}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none' }}
                        >
                          <Mail size={14} />
                          Email
                        </a>
                      </div>
                    </div>

                    {/* Vehicle & Driver Details */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                        Allocated Fleet & Driver
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                        {b.vehicle?.name}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '2px' }}>
                        Plate: {b.vehicle?.registrationNumber} ({b.seaterRequired} Seater)
                      </div>
                      {b.driverAllocation?.driverName ? (
                        <div style={{
                          marginTop: '8px',
                          background: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '12px',
                          color: '#065f46',
                        }}>
                          Driver: <strong>{b.driverAllocation.driverName}</strong> ({b.driverAllocation.driverPhone})
                        </div>
                      ) : (
                        <div style={{ fontSize: '12px', color: '#d97706', marginTop: '6px' }}>
                          ⚠️ Driver not allocated yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '14px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      {b.specialRequests ? `Customer note: "${b.specialRequests}"` : 'No special requests specified.'}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {/* 1. Paid / Unpaid Proof Button */}
                      <button
                        onClick={() => handleTogglePayment(b._id, b.pricing?.paymentStatus === 'paid' ? 'unpaid' : 'paid')}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 13px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          background: b.pricing?.paymentStatus === 'paid' ? '#ecfdf5' : '#fffbeb',
                          color: b.pricing?.paymentStatus === 'paid' ? '#047857' : '#b45309',
                          border: b.pricing?.paymentStatus === 'paid' ? '1px solid #a7f3d0' : '1px solid #fde68a',
                        }}
                        title="Click to toggle Payment Status proof (direct settlement / internal proof)"
                      >
                        {b.pricing?.paymentStatus === 'paid' ? (
                          <>
                            <Check size={13} />
                            Paid (Proof Verified)
                          </>
                        ) : (
                          <>
                            <DollarSign size={13} />
                            Mark as Paid
                          </>
                        )}
                      </button>

                      {/* 2. Fare Adjustment Button */}
                      <button
                        onClick={() => {
                          setFareModalBooking(b);
                          setAdjustedAmount(b.pricing?.adjustedFare || b.pricing?.estimatedAmount || '');
                          setAdjustmentReason(b.pricing?.fareAdjustmentReason || '');
                        }}
                        className="btn-secondary"
                        style={{ padding: '7px 13px', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        title="Adjust fare for customer discount, toll additions, or custom quote"
                      >
                        <Edit3 size={13} />
                        Adjust Fare
                      </button>

                      {/* Confirm & Allocate Driver */}
                      {b.status === 'pending' && (
                        <button
                          onClick={() => setSelectedBookingForAlloc(b)}
                          className="btn-primary"
                          style={{ padding: '7px 16px', fontSize: '12.5px' }}
                        >
                          Confirm & Allocate Driver
                        </button>
                      )}

                      {b.status === 'allocated' && (
                        <button
                          onClick={() => handleUpdateBooking(b._id, 'completed')}
                          className="btn-success"
                          style={{ padding: '7px 16px', fontSize: '12.5px' }}
                        >
                          Mark Trip Completed
                        </button>
                      )}

                      {['pending', 'confirmed'].includes(b.status) && (
                        <button
                          onClick={() => handleUpdateBooking(b._id, 'rejected')}
                          className="btn-danger"
                          style={{ padding: '7px 13px', fontSize: '12.5px' }}
                        >
                          Decline Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Add Vehicle with 8-Point Condition Report & Documents */}
      {activeTab === 'add-vehicle' && (
        <div className="glass-panel" style={{ padding: '36px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Register New Fleet Vehicle</h2>
            <p style={{ fontSize: '13.5px', color: '#64748b' }}>
              Upload essential RC documents, motor insurance policy, and complete the 8-point condition report.
            </p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', color: '#dc2626', fontSize: '13px', marginBottom: '20px' }}>
              {error}
            </div>
          )}
          {successMsg && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '12px', color: '#059669', fontSize: '13px', marginBottom: '20px' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleAddVehicle}>
            {/* General Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '18px' }}>
              <div>
                <label className="input-label">Vehicle Name & Model</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Toyota Innova Crysta 2.4 VX"
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Registration Number (Number Plate)</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. DL 01 AB 1234"
                  value={vRegNo}
                  onChange={(e) => setVRegNo(e.target.value.toUpperCase())}
                />
              </div>

              <div>
                <label className="input-label">Vehicle Category</label>
                <select className="input-field" value={vType} onChange={(e) => setVType(e.target.value)}>
                  <option value="MUV">MUV (Innova, Ertiga, Carens)</option>
                  <option value="SUV">SUV (Fortuner, XUV700, Scorpio)</option>
                  <option value="Sedan">Sedan (Dzire, Etios, Ciaz)</option>
                  <option value="Tempo Traveller">Tempo Traveller (12 - 17 Seater)</option>
                  <option value="Luxury Bus">Luxury Mini Bus (21+ Seater)</option>
                </select>
              </div>

              <div>
                <label className="input-label">Seating Capacity</label>
                <select className="input-field" value={vSeater} onChange={(e) => setVSeater(Number(e.target.value))}>
                  <option value={4}>4 Seater</option>
                  <option value={5}>5 Seater</option>
                  <option value={7}>7 Seater</option>
                  <option value={8}>8 Seater</option>
                  <option value={12}>12 Seater</option>
                  <option value={17}>17 Seater</option>
                  <option value={26}>26 Seater</option>
                </select>
              </div>

              <div>
                <label className="input-label">Fuel Type</label>
                <select className="input-field" value={vFuel} onChange={(e) => setVFuel(e.target.value)}>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric (EV)</option>
                </select>
              </div>

              <div>
                <label className="input-label">Daily Rental Rate (₹ / day)</label>
                <input
                  type="number"
                  required
                  min={500}
                  className="input-field"
                  value={vDailyRate}
                  onChange={(e) => setVDailyRate(e.target.value)}
                />
              </div>
            </div>

            {/* Serviced Cities and Features */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label className="input-label">Serviced Routes & Cities (Comma separated)</label>
                <input
                  type="text"
                  className="input-field"
                  value={vServicedCities}
                  onChange={(e) => setVServicedCities(e.target.value)}
                  placeholder="Delhi, Jaipur, Agra, Chandigarh"
                />
              </div>
              <div>
                <label className="input-label">Installed Features & Amenities</label>
                <input
                  type="text"
                  className="input-field"
                  value={vFeatures}
                  onChange={(e) => setVFeatures(e.target.value)}
                  placeholder="AC, Fastag, Pushback, Bluetooth"
                />
              </div>
            </div>

            {/* Essential Documents */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <FileText size={20} color="#2563eb" />
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Mandatory Vehicle Compliance Documents:</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {/* RC Document */}
                <FileUploadBox
                  label="Registration Certificate (RC) *"
                  file={rcDocFile}
                  onFileSelect={setRcDocFile}
                  accept="image/*,.pdf"
                  required
                />
                {/* Insurance Policy */}
                <FileUploadBox
                  label="Motor Insurance Policy Certificate *"
                  file={insuranceDocFile}
                  onFileSelect={setInsuranceDocFile}
                  accept="image/*,.pdf"
                  required
                />
                {/* PUC */}
                <FileUploadBox
                  label="Pollution (PUC) Certificate (Optional)"
                  file={pucDocFile}
                  onFileSelect={setPucDocFile}
                  accept="image/*,.pdf"
                />
                {/* Permit */}
                <FileUploadBox
                  label="Tourist Rental Permit / Fitness (Optional)"
                  file={permitDocFile}
                  onFileSelect={setPermitDocFile}
                  accept="image/*,.pdf"
                />
              </div>
            </div>

            {/* 8-Point Condition Inspection Report */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Camera size={20} color="#2563eb" />
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>8-Point Vehicle Photographs & Condition Report:</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                <FileUploadBox label="1. Front Exterior Photo" file={frontFile} onFileSelect={setFrontFile} accept="image/*" isPhoto />
                <FileUploadBox label="2. Rear Exterior Photo" file={rearFile} onFileSelect={setRearFile} accept="image/*" isPhoto />
                <FileUploadBox label="3. Left Side Photo" file={leftFile} onFileSelect={setLeftFile} accept="image/*" isPhoto />
                <FileUploadBox label="4. Right Side Photo" file={rightFile} onFileSelect={setRightFile} accept="image/*" isPhoto />
                <FileUploadBox label="5. Passenger Interior Photo" file={interiorFile} onFileSelect={setInteriorFile} accept="image/*" isPhoto />
                <FileUploadBox label="6. Dashboard & Cockpit Photo" file={dashboardFile} onFileSelect={setDashboardFile} accept="image/*" isPhoto />
                <FileUploadBox label="7. Odometer Instrument Photo" file={odometerFile} onFileSelect={setOdometerFile} accept="image/*" isPhoto />
                <FileUploadBox label="8. Number Plate & Condition Photo" file={numberPlateFile} onFileSelect={setNumberPlateFile} accept="image/*" isPhoto />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '14px' }}>
                <div>
                  <label className="input-label">Current Odometer Reading (km)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={vOdometer}
                    onChange={(e) => setVOdometer(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Visible Existing Damage / Scratches Report</label>
                  <input
                    type="text"
                    className="input-field"
                    value={vDamageNotes}
                    onChange={(e) => setVDamageNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setActiveTab('fleet')} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={addingVehicle} className="btn-primary" style={{ padding: '12px 28px' }}>
                {addingVehicle ? 'Uploading & Registering...' : 'Submit Vehicle for Admin Approval'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Driver Allocation Modal */}
      {selectedBookingForAlloc && ReactDOM.createPortal(
        <div className="modal-backdrop" onClick={() => setSelectedBookingForAlloc(null)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Confirm & Allocate Driver</h3>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Booking Ref #{selectedBookingForAlloc.bookingId} ({selectedBookingForAlloc.user?.name})
              </div>
            </div>

            <div className="modal-scroll-body" style={{ padding: '24px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label className="input-label">Assigned Driver Full Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Surender Singh"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="input-label">Driver Contact Phone Number</label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  placeholder="e.g. +91 98109 98877"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setSelectedBookingForAlloc(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateBooking(selectedBookingForAlloc._id, 'confirmed', driverName, driverPhone)}
                  className="btn-primary"
                >
                  Confirm & Send Alert to Customer
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Fare Adjustment Modal */}
      {fareModalBooking && ReactDOM.createPortal(
        <div className="modal-backdrop" onClick={() => setFareModalBooking(null)}>
          <div className="modal-content" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Adjust Booking Fare</h3>
                <button
                  onClick={() => setFareModalBooking(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={18} />
                </button>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                Ref #{fareModalBooking.bookingId} • {fareModalBooking.route?.fromCity} → {fareModalBooking.route?.toCity}
              </div>
            </div>

            <form onSubmit={handleSaveFareAdjustment} style={{ padding: '24px' }}>
              <div style={{
                background: '#f1f5f9',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>Original Estimated Fare:</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  ₹{(fareModalBooking.pricing?.estimatedAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="input-label">New Total Fare (₹)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    required
                    min="100"
                    step="50"
                    className="input-field"
                    placeholder="Enter revised total amount"
                    value={adjustedAmount}
                    onChange={(e) => setAdjustedAmount(e.target.value)}
                    style={{ paddingLeft: '32px', fontSize: '16px', fontWeight: 700 }}
                  />
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b' }}>
                    ₹
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label className="input-label">Adjustment Reason / Operator Note</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Round-trip discount, state tax/toll inclusion, night stay waiver"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                />
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  This reason will be visible to the customer and admin on their booking summary.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setFareModalBooking(null)}
                  className="btn-secondary"
                  disabled={savingFare}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={savingFare}
                >
                  {savingFare ? 'Saving...' : 'Update Fare'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
