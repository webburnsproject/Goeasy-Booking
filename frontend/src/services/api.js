const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('goeasy_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error(`Server returned status ${res.status}: ${res.statusText}`);
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
};

export const api = {
  // Auth Services
  registerUser: async (payload) => {
    const res = await fetch(`${API_BASE}/auth/register-user`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  loginUser: async (payload) => {
    const res = await fetch(`${API_BASE}/auth/login-user`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  registerOwner: async (formDataOrJson) => {
    const isForm = formDataOrJson instanceof FormData;
    const res = await fetch(`${API_BASE}/auth/register-owner`, {
      method: 'POST',
      headers: getHeaders(isForm),
      body: isForm ? formDataOrJson : JSON.stringify(formDataOrJson),
    });
    return handleResponse(res);
  },

  loginOwner: async (payload) => {
    const res = await fetch(`${API_BASE}/auth/login-owner`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  loginAdmin: async (payload) => {
    const res = await fetch(`${API_BASE}/auth/login-admin`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateProfile: async (formDataOrJson) => {
    const isForm = formDataOrJson instanceof FormData;
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(isForm),
      body: isForm ? formDataOrJson : JSON.stringify(formDataOrJson),
    });
    return handleResponse(res);
  },

  // Vehicle Services
  searchVehicles: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const res = await fetch(`${API_BASE}/vehicles/search?${query.toString()}`);
    return handleResponse(res);
  },

  getPopularRoutes: async () => {
    const res = await fetch(`${API_BASE}/vehicles/popular-routes`);
    return handleResponse(res);
  },

  getVehicleById: async (id) => {
    const res = await fetch(`${API_BASE}/vehicles/${id}`);
    return handleResponse(res);
  },

  // Booking Services
  createBooking: async (payload) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  getUserBookings: async () => {
    const res = await fetch(`${API_BASE}/bookings/my-bookings`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getBookingById: async (id) => {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  cancelBooking: async (id) => {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Owner Services
  getOwnerProfile: async () => {
    const res = await fetch(`${API_BASE}/owner/profile`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  submitKYC: async (formDataOrJson) => {
    const isForm = formDataOrJson instanceof FormData;
    const res = await fetch(`${API_BASE}/owner/kyc`, {
      method: 'POST',
      headers: getHeaders(isForm),
      body: isForm ? formDataOrJson : JSON.stringify(formDataOrJson),
    });
    return handleResponse(res);
  },

  addVehicle: async (formDataOrJson) => {
    const isForm = formDataOrJson instanceof FormData;
    const res = await fetch(`${API_BASE}/owner/vehicles`, {
      method: 'POST',
      headers: getHeaders(isForm),
      body: isForm ? formDataOrJson : JSON.stringify(formDataOrJson),
    });
    return handleResponse(res);
  },

  getOwnerVehicles: async () => {
    const res = await fetch(`${API_BASE}/owner/vehicles`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  toggleVehicleAllocation: async (id, payload) => {
    const res = await fetch(`${API_BASE}/owner/vehicles/${id}/allocation`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  getOwnerBookings: async () => {
    const res = await fetch(`${API_BASE}/owner/bookings`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateBookingStatus: async (id, payload) => {
    const res = await fetch(`${API_BASE}/owner/bookings/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // Admin Services
  getAdminOverview: async () => {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAdminOwners: async (params = {}) => {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/admin/owners?${query.toString()}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  reviewInitialOwner: async (id, action, rejectionReason) => {
    const res = await fetch(`${API_BASE}/admin/owners/${id}/initial-approval`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ action, rejectionReason }),
    });
    return handleResponse(res);
  },

  reviewOwnerKYC: async (id, action, rejectionReason) => {
    const res = await fetch(`${API_BASE}/admin/owners/${id}/kyc-approval`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ action, rejectionReason }),
    });
    return handleResponse(res);
  },

  toggleOwnerStatus: async (id) => {
    const res = await fetch(`${API_BASE}/admin/owners/${id}/toggle-status`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  deleteOwner: async (id) => {
    const res = await fetch(`${API_BASE}/admin/owners/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAdminVehicles: async (params = {}) => {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/admin/vehicles?${query.toString()}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  reviewVehicle: async (id, action, rejectionReason) => {
    const res = await fetch(`${API_BASE}/admin/vehicles/${id}/approval`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ action, rejectionReason }),
    });
    return handleResponse(res);
  },

  deleteVehicle: async (id) => {
    const res = await fetch(`${API_BASE}/admin/vehicles/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAdminUsers: async (params = {}) => {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/admin/users?${query.toString()}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  deleteUser: async (id) => {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAdminBookings: async (params = {}) => {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/admin/bookings?${query.toString()}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  seedDatabase: async () => {
    const res = await fetch(`${API_BASE}/admin/seed-database`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Upload helper
  uploadFile: async (file, folder = 'goeasy') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return handleResponse(res);
  },
};
