import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { api } from '../../services/api';
import {
  ShieldCheck,
  Users,
  Car,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  Camera,
  AlertTriangle,
  RefreshCw,
  Search,
  Check,
  X,
  ExternalLink,
  Trash2,
  Lock,
  Unlock,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('owner-approvals'); // Default to Owner Approvals & KYC
  const [overview, setOverview] = useState(null);
  const [owners, setOwners] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Inspector Modal states
  const [inspectVehicle, setInspectVehicle] = useState(null);
  const [inspectOwnerKYC, setInspectOwnerKYC] = useState(null);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const isModalOpen = !!(inspectVehicle || inspectOwnerKYC);
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
  }, [inspectVehicle, inspectOwnerKYC]);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [ovRes, ownRes, vehRes, usrRes, bokRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminOwners({ status: 'all' }),
        api.getAdminVehicles({ status: 'all' }),
        api.getAdminUsers(),
        api.getAdminBookings(),
      ]);

      if (ovRes.success) setOverview(ovRes.stats);
      if (ownRes.success) setOwners(ownRes.owners || []);
      if (vehRes.success) setVehicles(vehRes.vehicles || []);
      if (usrRes.success) setUsers(usrRes.users || []);
      if (bokRes.success) setBookings(bokRes.bookings || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // Action: Step 1 Initial Owner Approval
  const handleInitialOwnerApproval = async (id, action) => {
    try {
      const reason = action === 'reject' ? prompt('Enter reason for rejection:') : undefined;
      const res = await api.reviewInitialOwner(id, action, reason);
      if (res.success) {
        setActionSuccess(`Owner registration marked as ${res.owner.status}.`);
        loadAllAdminData();
      }
    } catch (err) {
      alert('Error updating owner: ' + err.message);
    }
  };

  // Action: Step 2 KYC Document Approval (Aadhaar & PAN)
  const handleKYCApproval = async (id, action) => {
    try {
      const reason = action === 'reject' ? prompt('Enter reason for document rejection:') : undefined;
      const res = await api.reviewOwnerKYC(id, action, reason);
      if (res.success) {
        setActionSuccess(`Owner KYC verified! Status is now ${res.owner.status}. Owner can now add vehicles.`);
        setInspectOwnerKYC(null);
        loadAllAdminData();
      }
    } catch (err) {
      alert('Error updating KYC: ' + err.message);
    }
  };

  // Action: Toggle Owner Status (Suspend / Activate)
  const handleToggleOwner = async (id) => {
    try {
      const res = await api.toggleOwnerStatus(id);
      if (res.success) {
        setActionSuccess(`Owner status toggled to ${res.owner.status}.`);
        loadAllAdminData();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Action: Delete Owner
  const handleDeleteOwner = async (id) => {
    if (!window.confirm('Delete this owner and all their registered fleet?')) return;
    try {
      const res = await api.deleteOwner(id);
      if (res.success) {
        setActionSuccess('Owner deleted from system.');
        loadAllAdminData();
      }
    } catch (err) {
      alert('Error deleting owner: ' + err.message);
    }
  };

  // Action: Review Vehicle (Approve / Reject)
  const handleVehicleReview = async (id, action) => {
    try {
      const reason = action === 'reject' ? prompt('Enter reason for rejection:') : undefined;
      const res = await api.reviewVehicle(id, action, reason);
      if (res.success) {
        setActionSuccess(`Vehicle ${res.vehicle.registrationNumber} is now ${res.vehicle.status}! It is now available for customers.`);
        setInspectVehicle(null);
        loadAllAdminData();
      }
    } catch (err) {
      alert('Error reviewing vehicle: ' + err.message);
    }
  };

  // Action: Delete Vehicle
  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Delete this vehicle from platform?')) return;
    try {
      const res = await api.deleteVehicle(id);
      if (res.success) {
        setActionSuccess('Vehicle removed from platform.');
        loadAllAdminData();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Action: Delete Customer
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this customer account?')) return;
    try {
      const res = await api.deleteUser(id);
      if (res.success) {
        setActionSuccess('Customer deleted.');
        loadAllAdminData();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Quick Seed trigger
  const handleSeedDatabase = async () => {
    if (!window.confirm('Re-seed database with clean MVP demo vehicles, owners, and bookings?')) return;
    try {
      setLoading(true);
      await api.seedDatabase();
      alert('Database seeded successfully!');
      loadAllAdminData();
    } catch (err) {
      alert('Seeding error: ' + err.message);
      setLoading(false);
    }
  };

  // Filter lists
  const pendingInitialOwners = owners.filter((o) => o.status === 'pending_initial_approval');
  const pendingKYCOwners = owners.filter((o) => o.status === 'pending_final_approval');
  const pendingVehicles = vehicles.filter((v) => v.status === 'pending_approval');

  return (
    <div style={{ maxWidth: '1360px', margin: 'clamp(16px, 3vw, 30px) auto', padding: '0 16px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        marginBottom: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        border: '1px solid rgba(191, 219, 254, 0.8)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            color: '#60a5fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.35)',
          }}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Super Admin Master Console</h1>
              <span className="badge badge-purple">Super Admin Privileges</span>
            </div>
            <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '2px' }}>
              Manage vehicle owner KYC approvals, inspect vehicle condition reports, monitor global trips & manage users.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSeedDatabase}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={15} color="#2563eb" />
            Reset & Seed MVP Test Data
          </button>
          <button
            onClick={loadAllAdminData}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '12px',
          padding: '14px',
          color: '#059669',
          fontSize: '13.5px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#059669' }}>
            ✕
          </button>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(210px, 100%), 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Pending Owner Approvals
          </div>
          {loading ? (
            <>
              <div className="skeleton" style={{ width: '60px', height: '30px', margin: '6px 0', borderRadius: '6px' }} />
              <div className="skeleton" style={{ width: '140px', height: '14px', borderRadius: '4px' }} />
            </>
          ) : (
            <>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#d97706', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
                {pendingInitialOwners.length + pendingKYCOwners.length}
              </div>
              <div style={{ fontSize: '12px', color: '#b45309', marginTop: '4px' }}>
                {pendingInitialOwners.length} Initial • {pendingKYCOwners.length} KYC Documents
              </div>
            </>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Vehicles Pending Review
          </div>
          {loading ? (
            <>
              <div className="skeleton" style={{ width: '60px', height: '30px', margin: '6px 0', borderRadius: '6px' }} />
              <div className="skeleton" style={{ width: '130px', height: '14px', borderRadius: '4px' }} />
            </>
          ) : (
            <>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#2563eb', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
                {pendingVehicles.length}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                {vehicles.filter((v) => v.status === 'approved').length} currently Live
              </div>
            </>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Platform Bookings
          </div>
          {loading ? (
            <>
              <div className="skeleton" style={{ width: '60px', height: '30px', margin: '6px 0', borderRadius: '6px' }} />
              <div className="skeleton" style={{ width: '140px', height: '14px', borderRadius: '4px' }} />
            </>
          ) : (
            <>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
                {bookings.length}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                {bookings.filter((b) => b.status === 'allocated').length} Allocated & Active
              </div>
            </>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Estimated Volume (GMV)
          </div>
          {loading ? (
            <>
              <div className="skeleton" style={{ width: '90px', height: '30px', margin: '6px 0', borderRadius: '6px' }} />
              <div className="skeleton" style={{ width: '150px', height: '14px', borderRadius: '4px' }} />
            </>
          ) : (
            <>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
                ₹{overview?.estimatedTotalRevenue?.toLocaleString('en-IN') || '0'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Total internal rental requests
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '6px',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '20px',
        paddingBottom: '8px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <button
          onClick={() => setActiveTab('owner-approvals')}
          style={{
            padding: '10px 16px',
            whiteSpace: 'nowrap',
            borderRadius: '9999px',
            border: 'none',
            background: activeTab === 'owner-approvals' ? '#eff6ff' : 'transparent',
            color: activeTab === 'owner-approvals' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          Owner Approvals & KYC
          {!loading && (pendingInitialOwners.length + pendingKYCOwners.length) > 0 && (
            <span style={{ background: '#f59e0b', color: '#ffffff', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {pendingInitialOwners.length + pendingKYCOwners.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('vehicle-approvals')}
          style={{
            padding: '10px 16px',
            whiteSpace: 'nowrap',
            borderRadius: '9999px',
            border: 'none',
            background: activeTab === 'vehicle-approvals' ? '#eff6ff' : 'transparent',
            color: activeTab === 'vehicle-approvals' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          Vehicle Condition Approvals
          {!loading && pendingVehicles.length > 0 && (
            <span style={{ background: '#2563eb', color: '#ffffff', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {pendingVehicles.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('all-owners')}
          style={{
            padding: '10px 16px',
            whiteSpace: 'nowrap',
            borderRadius: '9999px',
            border: 'none',
            background: activeTab === 'all-owners' ? '#eff6ff' : 'transparent',
            color: activeTab === 'all-owners' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          All Fleet Owners {loading ? '' : `(${owners.length})`}
        </button>

        <button
          onClick={() => setActiveTab('all-users')}
          style={{
            padding: '10px 16px',
            whiteSpace: 'nowrap',
            borderRadius: '9999px',
            border: 'none',
            background: activeTab === 'all-users' ? '#eff6ff' : 'transparent',
            color: activeTab === 'all-users' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Registered Users {loading ? '' : `(${users.length})`}
        </button>

        <button
          onClick={() => setActiveTab('all-bookings')}
          style={{
            padding: '10px 16px',
            whiteSpace: 'nowrap',
            borderRadius: '9999px',
            border: 'none',
            background: activeTab === 'all-bookings' ? '#eff6ff' : 'transparent',
            color: activeTab === 'all-bookings' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Master Bookings Tracker {loading ? '' : `(${bookings.length})`}
        </button>
      </div>

      {/* Tab: Owner Approvals (Stage 1 & Stage 2) */}
      {activeTab === 'owner-approvals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Section 1: Initial Registration Queue */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                  Stage 1: New Vehicle Owner Registrations {loading ? '' : `(${pendingInitialOwners.length})`}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Rule: Newly registered owners cannot log in until approved here.
                </p>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[1, 2].map((n) => (
                  <div key={n} style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '18px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '10px' }} />
                      <div>
                        <div className="skeleton" style={{ width: '180px', height: '18px', borderRadius: '4px', marginBottom: '8px' }} />
                        <div className="skeleton" style={{ width: '240px', height: '14px', borderRadius: '4px' }} />
                      </div>
                    </div>
                    <div className="skeleton" style={{ width: '180px', height: '36px', borderRadius: '8px' }} />
                  </div>
                ))}
              </div>
            ) : pendingInitialOwners.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13.5px' }}>
                ✓ All initial owner applications reviewed.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {pendingInitialOwners.map((owner) => (
                  <div key={owner._id} style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '18px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={owner.ownerProfile?.sampleVehicleImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'}
                        alt="Sample"
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }}
                      />
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>
                          {owner.name} • <span style={{ color: '#2563eb' }}>{owner.ownerProfile?.agencyName || 'Travel Agency'}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                          Email: {owner.email} • Phone: {owner.phone} • City: {owner.city || 'India'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                          Proposed Fleet: {owner.ownerProfile?.initialVehicleType} ({owner.ownerProfile?.initialSeater} Seater)
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleInitialOwnerApproval(owner._id, 'approve')}
                        className="btn-success"
                      >
                        <Check size={16} />
                        Approve (Grant Login Access)
                      </button>
                      <button
                        onClick={() => handleInitialOwnerApproval(owner._id, 'reject')}
                        className="btn-danger"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: KYC Document Verification Queue (Aadhaar & PAN) */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                  Stage 2: Aadhaar & PAN Card Document Verification {loading ? '' : `(${pendingKYCOwners.length})`}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Rule: Owner must receive final approval here before adding vehicles to the platform.
                </p>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[1, 2].map((n) => (
                  <div key={n} style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '18px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}>
                    <div>
                      <div className="skeleton" style={{ width: '200px', height: '18px', borderRadius: '4px', marginBottom: '8px' }} />
                      <div className="skeleton" style={{ width: '260px', height: '14px', borderRadius: '4px' }} />
                    </div>
                    <div className="skeleton" style={{ width: '220px', height: '36px', borderRadius: '8px' }} />
                  </div>
                ))}
              </div>
            ) : pendingKYCOwners.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13.5px' }}>
                ✓ No pending KYC document verifications.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {pendingKYCOwners.map((owner) => (
                  <div key={owner._id} style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '18px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>
                        {owner.name} ({owner.ownerProfile?.agencyName})
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                        Aadhaar No: <strong style={{ color: '#0f172a' }}>{owner.ownerProfile?.kycDocuments?.aadhaarNumber}</strong> • PAN No: <strong style={{ color: '#0f172a' }}>{owner.ownerProfile?.kycDocuments?.panNumber}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: '#d97706', marginTop: '4px' }}>
                        Submitted on: {new Date(owner.ownerProfile?.kycDocuments?.submittedAt || Date.now()).toLocaleDateString('en-IN')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setInspectOwnerKYC(owner)}
                        className="btn-secondary"
                        style={{ fontSize: '13px', padding: '8px 14px' }}
                      >
                        <FileText size={15} color="#2563eb" />
                        Inspect Aadhaar & PAN
                      </button>

                      <button
                        onClick={() => handleKYCApproval(owner._id, 'approve')}
                        className="btn-success"
                      >
                        <Check size={16} />
                        Grant Final Approval
                      </button>

                      <button
                        onClick={() => handleKYCApproval(owner._id, 'reject')}
                        className="btn-danger"
                      >
                        <X size={16} />
                        Reject Documents
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Vehicle Condition & Document Approvals */}
      {activeTab === 'vehicle-approvals' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: 800 }}>
              Vehicles Awaiting Admin Inspection & Approval {loading ? '' : `(${pendingVehicles.length})`}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Inspect the 8-point condition photos, RC commercial permit, and motor insurance before making vehicle live.
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2].map((n) => (
                <div key={n} style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="skeleton" style={{ width: '80px', height: '60px', borderRadius: '10px' }} />
                    <div>
                      <div className="skeleton" style={{ width: '180px', height: '20px', borderRadius: '4px', marginBottom: '8px' }} />
                      <div className="skeleton" style={{ width: '220px', height: '14px', borderRadius: '4px' }} />
                    </div>
                  </div>
                  <div className="skeleton" style={{ width: '180px', height: '36px', borderRadius: '8px' }} />
                </div>
              ))}
            </div>
          ) : pendingVehicles.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              ✓ All submitted vehicles have been reviewed and approved.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingVehicles.map((v) => (
                <div key={v._id} style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src={v.conditionReport?.photos?.front || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'}
                      alt="Vehicle Front"
                      style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '10px' }}
                    />
                    <div>
                      <div style={{ fontSize: '17px', fontWeight: 700 }}>
                        {v.name} ({v.registrationNumber})
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                        Owner: {v.owner?.ownerProfile?.agencyName || v.owner?.name} • {v.seatingCapacity} Seater • {v.fuelType} • ₹{v.dailyRate}/day
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                        Odometer: {v.conditionReport?.odometerReading?.toLocaleString()} km • Condition: "{v.conditionReport?.existingDamageNotes}"
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setInspectVehicle(v)}
                      className="btn-secondary"
                      style={{ fontSize: '13px' }}
                    >
                      <Camera size={15} color="#2563eb" />
                      Inspect 8-Point Photos & RC
                    </button>

                    <button
                      onClick={() => handleVehicleReview(v._id, 'approve')}
                      className="btn-success"
                    >
                      <Check size={16} />
                      Approve (Make Live)
                    </button>

                    <button
                      onClick={() => handleVehicleReview(v._id, 'reject')}
                      className="btn-danger"
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: All Fleet Owners */}
      {activeTab === 'all-owners' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
            Registered Vehicle Operators & Fleets {loading ? '' : `(${owners.length})`}
          </h3>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3].map((n) => (
                <div key={n} className="skeleton" style={{ height: '54px', width: '100%', borderRadius: '8px' }} />
              ))}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 16px' }}>Agency / Owner</th>
                    <th style={{ padding: '12px 16px' }}>Contact</th>
                    <th style={{ padding: '12px 16px' }}>Base City</th>
                    <th style={{ padding: '12px 16px' }}>Fleet Count</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {owners.map((o) => (
                    <tr key={o._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                        {o.ownerProfile?.agencyName || o.name}
                        <div style={{ fontSize: '12px', fontWeight: 400, color: '#64748b' }}>{o.name}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {o.phone}<br/>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{o.email}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>{o.city || 'Delhi NCR'}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{o.vehiclesCount || 0}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${
                          o.status === 'active'
                            ? 'badge-green'
                            : o.status === 'suspended'
                            ? 'badge-red'
                            : 'badge-yellow'
                        }`}>
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleToggleOwner(o._id)}
                            title="Toggle Suspend/Activate"
                            style={{
                              background: o.status === 'suspended' ? '#ecfdf5' : '#fffbeb',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              cursor: 'pointer',
                            }}
                          >
                            {o.status === 'suspended' ? <Unlock size={14} color="#059669" /> : <Lock size={14} color="#d97706" />}
                          </button>
                          <button
                            onClick={() => handleDeleteOwner(o._id)}
                            title="Delete Owner"
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={14} color="#dc2626" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: All Users */}
      {activeTab === 'all-users' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
            Registered Customers {loading ? '' : `(${users.length})`}
          </h3>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3].map((n) => (
                <div key={n} className="skeleton" style={{ height: '54px', width: '100%', borderRadius: '8px' }} />
              ))}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 16px' }}>Customer Name</th>
                    <th style={{ padding: '12px 16px' }}>Email</th>
                    <th style={{ padding: '12px 16px' }}>Phone</th>
                    <th style={{ padding: '12px 16px' }}>Bookings Placed</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{u.name}</td>
                      <td style={{ padding: '14px 16px' }}>{u.email}</td>
                      <td style={{ padding: '14px 16px' }}>{u.phone}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{u.bookingsCount || 0}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          title="Delete User"
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} color="#dc2626" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Master Bookings Tracker */}
      {activeTab === 'all-bookings' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
            Global Bookings & Trips Tracker {loading ? '' : `(${bookings.length})`}
          </h3>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3].map((n) => (
                <div key={n} className="skeleton" style={{ height: '54px', width: '100%', borderRadius: '8px' }} />
              ))}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px' }}>Ref ID</th>
                    <th style={{ padding: '12px 14px' }}>Customer</th>
                    <th style={{ padding: '12px 14px' }}>Operator / Fleet</th>
                    <th style={{ padding: '12px 14px' }}>Route</th>
                    <th style={{ padding: '12px 14px' }}>Travel Dates</th>
                    <th style={{ padding: '12px 14px' }}>Fare (₹)</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, fontFamily: 'monospace' }}>
                        {b.bookingId}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <strong>{b.user?.name}</strong><br/>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{b.user?.phone}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <strong>{b.vehicle?.name}</strong><br/>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          {b.owner?.ownerProfile?.agencyName || b.owner?.name} ({b.vehicle?.registrationNumber})
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                        {b.route?.fromCity} → {b.route?.toCity}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {new Date(b.dates?.pickupDate).toLocaleDateString('en-IN')} to {new Date(b.dates?.dropDate).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 800 }}>
                        ₹{b.pricing?.estimatedAmount?.toLocaleString('en-IN')}
                        {b.pricing?.adjustedFare && (
                          <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: 600 }}>Adjusted</div>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span className={`badge ${
                            ['allocated', 'confirmed'].includes(b.status)
                              ? 'badge-green'
                              : b.status === 'completed'
                              ? 'badge-purple'
                              : b.status === 'pending'
                              ? 'badge-yellow'
                              : 'badge-red'
                          }`}>
                            {b.status.toUpperCase()}
                          </span>
                          <span className={`badge ${b.pricing?.paymentStatus === 'paid' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '10.5px', padding: '2px 6px' }}>
                            {b.pricing?.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Inspector Modal: Owner KYC Document Inspection */}
      {inspectOwnerKYC && ReactDOM.createPortal(
        <div className="modal-backdrop" onClick={() => setInspectOwnerKYC(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '780px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
            }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>KYC Identity & PAN Inspector</h3>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {inspectOwnerKYC.name} • {inspectOwnerKYC.ownerProfile?.agencyName}
                </div>
              </div>
              <button
                onClick={() => setInspectOwnerKYC(null)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
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

            {/* Modal Scrollable Body */}
            <div style={{ padding: '24px', flexGrow: 1, overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: '16px', marginBottom: '8px' }}>
                {/* Aadhaar card */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Aadhaar Card Document</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                    Number: <strong>{inspectOwnerKYC.ownerProfile?.kycDocuments?.aadhaarNumber}</strong>
                  </div>
                  <img
                    src={inspectOwnerKYC.ownerProfile?.kycDocuments?.aadhaarDoc || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800'}
                    alt="Aadhaar"
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </div>

                {/* PAN card */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Income Tax PAN Card</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                    Number: <strong>{inspectOwnerKYC.ownerProfile?.kycDocuments?.panNumber}</strong>
                  </div>
                  <img
                    src={inspectOwnerKYC.ownerProfile?.kycDocuments?.panDoc || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800'}
                    alt="PAN"
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Sticky Action Footer */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              gap: '8px',
              flexShrink: 0,
            }}>
              <button onClick={() => setInspectOwnerKYC(null)} className="btn-secondary">
                Close
              </button>
              <button
                onClick={() => handleKYCApproval(inspectOwnerKYC._id, 'reject')}
                className="btn-danger"
              >
                Reject & Request Resubmission
              </button>
              <button
                onClick={() => handleKYCApproval(inspectOwnerKYC._id, 'approve')}
                className="btn-success"
              >
                Approve Documents & Authorize Fleet Additions
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Inspector Modal: Vehicle 8-Point Condition Report & RC */}
      {inspectVehicle && ReactDOM.createPortal(
        <div className="modal-backdrop" onClick={() => setInspectVehicle(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '850px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
            }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Vehicle Inspection & RC Verification</h3>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {inspectVehicle.name} • {inspectVehicle.registrationNumber} ({inspectVehicle.owner?.ownerProfile?.agencyName || inspectVehicle.owner?.name})
                </div>
              </div>
              <button
                onClick={() => setInspectVehicle(null)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
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

            {/* Modal Scrollable Body */}
            <div className="modal-scroll-body" style={{ padding: '16px', flexGrow: 1, overflowY: 'auto' }}>
              {/* 8-Point Photos Grid */}
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>
                8-Point Condition Photographs:
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(140px, 45%), 1fr))',
                gap: '10px',
                marginBottom: '20px',
              }}>
                {Object.entries(inspectVehicle.conditionReport?.photos || {}).map(([key, url]) => (
                  <div key={key} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={url} alt={key} style={{ width: '100%', height: 'clamp(80px, 15vw, 120px)', objectFit: 'cover' }} />
                    <div style={{ padding: '4px 6px', fontSize: '11px', textTransform: 'capitalize', textAlign: 'center', background: '#f8fafc', fontWeight: 600 }}>
                      {key}
                    </div>
                  </div>
                ))}
              </div>

              {/* Condition Details */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px' }}>
                <strong>Odometer:</strong> {inspectVehicle.conditionReport?.odometerReading?.toLocaleString()} km<br/>
                <strong>Damage Notes:</strong> {inspectVehicle.conditionReport?.existingDamageNotes}
              </div>

              {/* Documents Links */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {inspectVehicle.documents?.rcDocument && (
                  <a href={inspectVehicle.documents.rcDocument} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '12.5px' }}>
                    <ExternalLink size={14} />
                    View Registration Certificate (RC)
                  </a>
                )}
                {inspectVehicle.documents?.insurancePolicy && (
                  <a href={inspectVehicle.documents.insurancePolicy} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '12.5px' }}>
                    <ExternalLink size={14} />
                    View Motor Insurance Certificate
                  </a>
                )}
              </div>
            </div>

            {/* Modal Sticky Action Footer */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              gap: '8px',
              flexShrink: 0,
            }}>
              <button onClick={() => setInspectVehicle(null)} className="btn-secondary">
                Close
              </button>
              <button onClick={() => handleVehicleReview(inspectVehicle._id, 'reject')} className="btn-danger">
                Reject Vehicle
              </button>
              <button onClick={() => handleVehicleReview(inspectVehicle._id, 'approve')} className="btn-success">
                Approve Vehicle (Make Live for Booking)
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
