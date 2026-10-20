import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { User, Mail, Phone, Lock, CheckSquare, Square, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const UserAuthPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [policyAccepted, setPolicyAccepted] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!policyAccepted) {
          throw new Error('Please accept the Terms of Service & Privacy Policy to register.');
        }
        const res = await api.registerUser({
          name,
          email,
          phone,
          password,
          policyAccepted,
        });

        if (res.success && res.token) {
          login(res.user, res.token);
          onNavigate('user-dashboard');
        }
      } else {
        const res = await api.loginUser({ email, password });
        if (res.success && res.token) {
          login(res.user, res.token);
          onNavigate('user-dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '36px',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.08)',
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.35)',
          }}>
            <User size={28} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
            {isRegister ? 'Create Customer Account' : 'Customer Sign In'}
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748b' }}>
            {isRegister
              ? 'Book verified rental vehicles across India in seconds'
              : 'Sign in to manage your bookings and view vehicle allocations'}
          </p>
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
            marginBottom: '18px',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}



        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: '16px' }}>
              <label className="input-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Rohan Mehta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label className="input-label">Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="e.g. rohan.mehta@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {isRegister && (
            <div style={{ marginBottom: '16px' }}>
              <label className="input-label">Phone Number (WhatsApp preferred)</label>
              <input
                type="tel"
                required
                className="input-field"
                placeholder="e.g. +91 98200 11223"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}

          <div style={{ marginBottom: '18px' }}>
            <label className="input-label">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="input-field"
              placeholder="Enter secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isRegister && (
            <div
              onClick={() => setPolicyAccepted(!policyAccepted)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '22px',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#475569',
              }}
            >
              {policyAccepted ? (
                <CheckSquare size={18} color="#2563eb" />
              ) : (
                <Square size={18} color="#94a3b8" />
              )}
              <span>I accept the platform rental policies, terms of service and cancellation rules.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '15px' }}
          >
            {loading ? 'Processing...' : isRegister ? 'Register Customer Account' : 'Sign In as Customer'}
            <ArrowRight size={17} />
          </button>
        </form>

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
              Already have an account?{' '}
              <button
                onClick={() => {
                  setIsRegister(false);
                  setError(null);
                }}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </div>
          ) : (
            <div>
              New to GoEasy Travels?{' '}
              <button
                onClick={() => {
                  setIsRegister(true);
                  setError(null);
                }}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
