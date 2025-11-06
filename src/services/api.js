// ============================================
// API Service Layer
// ============================================
// Hỗ trợ cả Mock Data (development) và Real API (production)
// Đổi USE_MOCK_DATA để switch giữa mock và real API

import { mockAPI } from './mockApi';

// ⚠️ QUAN TRỌNG: Đổi sang false khi đã setup backend
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || true;

console.log('🔧 API Mode:', USE_MOCK_DATA ? 'MOCK DATA (No Backend)' : 'REAL API');

// API Configuration (cho real API)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Token management
const getToken = () => localStorage.getItem('healthcare_token');
const setToken = (token) => localStorage.setItem('healthcare_token', token);
const removeToken = () => localStorage.removeItem('healthcare_token');

// ============================================
// Real API Request Helper
// ============================================
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================
// Authentication API
// ============================================
const realAuthAPI = {
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.success && data.data.token) {
      setToken(data.data.token);
    }

    return data;
  },

  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  updateProfile: async (userData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  logout: () => {
    removeToken();
  },
};

// ============================================
// Patients API
// ============================================
const realPatientsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/patients?${queryString}`);
  },

  getById: async (id) => {
    return apiRequest(`/patients/${id}`);
  },

  create: async (patientData) => {
    return apiRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },

  update: async (id, patientData) => {
    return apiRequest(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/patients/${id}`, {
      method: 'DELETE',
    });
  },

  getMedicalHistory: async (id) => {
    return apiRequest(`/patients/${id}/medical-history`);
  },
};

// ============================================
// Staff API
// ============================================
const realStaffAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/staff?${queryString}`);
  },

  getDoctors: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/staff/doctors?${queryString}`);
  },

  getNurses: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/staff/nurses?${queryString}`);
  },

  getTechnicians: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/staff/technicians?${queryString}`);
  },

  getById: async (id) => {
    return apiRequest(`/staff/${id}`);
  },

  create: async (staffData) => {
    return apiRequest('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  },

  update: async (id, staffData) => {
    return apiRequest(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staffData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/staff/${id}`, {
      method: 'DELETE',
    });
  },

  getSchedule: async (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/staff/${id}/schedule?${queryString}`);
  },

  getDepartments: async () => {
    return apiRequest('/staff/departments');
  },
};

// ============================================
// Appointments API
// ============================================
const realAppointmentsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/appointments?${queryString}`);
  },

  getByStatus: async (status, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/appointments/status/${status}?${queryString}`);
  },

  getById: async (id) => {
    return apiRequest(`/appointments/${id}`);
  },

  create: async (appointmentData) => {
    return apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  update: async (id, appointmentData) => {
    return apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  },

  cancel: async (id, notes) => {
    return apiRequest(`/appointments/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    });
  },

  delete: async (id) => {
    return apiRequest(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// Clinics API
// ============================================
const realClinicsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/clinics?${queryString}`);
  },

  getById: async (id) => {
    return apiRequest(`/clinics/${id}`);
  },

  create: async (clinicData) => {
    return apiRequest('/clinics', {
      method: 'POST',
      body: JSON.stringify(clinicData),
    });
  },

  update: async (id, clinicData) => {
    return apiRequest(`/clinics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clinicData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/clinics/${id}`, {
      method: 'DELETE',
    });
  },

  getSchedule: async (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/clinics/${id}/schedule?${queryString}`);
  },
};

// ============================================
// Revenue API
// ============================================
const realRevenueAPI = {
  getAllInvoices: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/revenue/invoices?${queryString}`);
  },

  getInvoiceById: async (id) => {
    return apiRequest(`/revenue/invoices/${id}`);
  },

  createInvoice: async (invoiceData) => {
    return apiRequest('/revenue/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  },

  updatePayment: async (id, paymentData) => {
    return apiRequest(`/revenue/invoices/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify(paymentData),
    });
  },

  getStats: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/revenue/stats?${queryString}`);
  },

  getInsuranceClaims: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/revenue/insurance-claims?${queryString}`);
  },
};

// ============================================
// EXPORT - Auto switch giữa Mock và Real API
// ============================================
export const authAPI = USE_MOCK_DATA ? mockAPI.auth : realAuthAPI;
export const patientsAPI = USE_MOCK_DATA ? mockAPI.patients : realPatientsAPI;
export const staffAPI = USE_MOCK_DATA ? mockAPI.staff : realStaffAPI;
export const appointmentsAPI = USE_MOCK_DATA ? mockAPI.appointments : realAppointmentsAPI;
export const clinicsAPI = USE_MOCK_DATA ? mockAPI.clinics : realClinicsAPI;
export const revenueAPI = USE_MOCK_DATA ? {} : realRevenueAPI; // Mock revenue chưa có

// Token helpers
export { getToken, setToken, removeToken };
