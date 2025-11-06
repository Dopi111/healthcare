// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Get token from localStorage
const getToken = () => localStorage.getItem('healthcare_token');

// Set token to localStorage
const setToken = (token) => localStorage.setItem('healthcare_token', token);

// Remove token from localStorage
const removeToken = () => localStorage.removeItem('healthcare_token');

// API request helper
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

// Authentication API
export const authAPI = {
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

// Patients API
export const patientsAPI = {
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

// Staff API
export const staffAPI = {
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

// Appointments API
export const appointmentsAPI = {
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

// Clinics API
export const clinicsAPI = {
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

// Revenue API
export const revenueAPI = {
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

// Export getToken and removeToken for external use
export { getToken, setToken, removeToken };
