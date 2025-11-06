// Mock API Service (Không cần backend/database)
// Giống hệt real API nhưng dùng mock data

import {
  mockPatients,
  mockStaff,
  mockAppointments,
  mockClinics,
  mockUsers,
  delay,
  paginate,
  searchData,
  sortData,
} from './mockData';

// Simulate localStorage for mock data
let patients = [...mockPatients];
let staff = [...mockStaff];
let appointments = [...mockAppointments];
let clinics = [...mockClinics];
let currentUser = null;
let authToken = null;

// Mock Authentication API
export const mockAuthAPI = {
  login: async (email, password) => {
    await delay(800); // Simulate network delay

    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    // Generate fake token
    authToken = `mock_token_${Date.now()}`;
    currentUser = { ...user };
    delete currentUser.password;

    localStorage.setItem('healthcare_token', authToken);

    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: currentUser,
        token: authToken,
      },
    };
  },

  register: async (userData) => {
    await delay(800);

    const exists = mockUsers.find(u => u.email === userData.email);
    if (exists) {
      throw new Error('Email đã tồn tại');
    }

    const newUser = {
      id: mockUsers.length + 1,
      username: userData.username,
      email: userData.email,
      role: userData.role || 'patient',
      is_active: true,
      full_name: userData.full_name || userData.username,
    };

    mockUsers.push({ ...newUser, password: userData.password });
    authToken = `mock_token_${Date.now()}`;
    currentUser = newUser;

    localStorage.setItem('healthcare_token', authToken);

    return {
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: currentUser,
        token: authToken,
      },
    };
  },

  getProfile: async () => {
    await delay(300);

    if (!currentUser) {
      throw new Error('Chưa đăng nhập');
    }

    return {
      success: true,
      data: currentUser,
    };
  },

  updateProfile: async (userData) => {
    await delay(500);

    if (!currentUser) {
      throw new Error('Chưa đăng nhập');
    }

    currentUser = { ...currentUser, ...userData };

    return {
      success: true,
      message: 'Cập nhật thành công',
      data: currentUser,
    };
  },

  changePassword: async (currentPassword, newPassword) => {
    await delay(500);

    return {
      success: true,
      message: 'Đổi mật khẩu thành công',
    };
  },

  logout: () => {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('healthcare_token');
  },
};

// Mock Patients API
export const mockPatientsAPI = {
  getAll: async (params = {}) => {
    await delay(600);

    const { page = 1, limit = 10, search = '', sortBy = 'created_at', order = 'DESC' } = params;

    // Search
    let filtered = patients;
    if (search) {
      filtered = searchData(patients, search, ['full_name', 'phone', 'email', 'patient_code', 'citizen_id']);
    }

    // Sort
    const sorted = sortData(filtered, sortBy, order);

    // Paginate
    const result = paginate(sorted, page, limit);

    return {
      success: true,
      message: 'Lấy danh sách bệnh nhân thành công',
      data: {
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          hasNextPage: result.page < result.totalPages,
          hasPrevPage: result.page > 1,
        },
      },
    };
  },

  getById: async (id) => {
    await delay(400);

    const patient = patients.find(p => p.id === parseInt(id));

    if (!patient) {
      throw new Error('Không tìm thấy bệnh nhân');
    }

    return {
      success: true,
      data: patient,
    };
  },

  create: async (patientData) => {
    await delay(800);

    // Check duplicate phone
    const exists = patients.find(p => p.phone === patientData.phone);
    if (exists) {
      throw new Error('Số điện thoại đã tồn tại');
    }

    const newPatient = {
      id: patients.length + 1,
      patient_code: `BN${String(patients.length + 1).padStart(6, '0')}`,
      ...patientData,
      age: patientData.date_of_birth ? new Date().getFullYear() - new Date(patientData.date_of_birth).getFullYear() : null,
      created_at: new Date().toISOString(),
    };

    patients.push(newPatient);

    return {
      success: true,
      message: 'Thêm bệnh nhân thành công',
      data: newPatient,
    };
  },

  update: async (id, patientData) => {
    await delay(700);

    const index = patients.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
      throw new Error('Không tìm thấy bệnh nhân');
    }

    // Check duplicate phone (excluding current patient)
    const duplicate = patients.find(p => p.phone === patientData.phone && p.id !== parseInt(id));
    if (duplicate) {
      throw new Error('Số điện thoại đã được sử dụng');
    }

    patients[index] = {
      ...patients[index],
      ...patientData,
      updated_at: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Cập nhật bệnh nhân thành công',
      data: patients[index],
    };
  },

  delete: async (id) => {
    await delay(600);

    const index = patients.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
      throw new Error('Không tìm thấy bệnh nhân');
    }

    patients.splice(index, 1);

    return {
      success: true,
      message: 'Xóa bệnh nhân thành công',
    };
  },

  getMedicalHistory: async (id) => {
    await delay(500);

    return {
      success: true,
      data: [],
    };
  },
};

// Mock Staff API
export const mockStaffAPI = {
  getAll: async (params = {}) => {
    await delay(600);

    const { page = 1, limit = 10, search = '', staff_type = '', role = '', sortBy = 'created_at', order = 'DESC' } = params;

    let filtered = staff;

    // Filter by role or staff_type (support both)
    const roleFilter = role || staff_type;
    if (roleFilter) {
      filtered = filtered.filter(s => s.role === roleFilter || s.staff_type === roleFilter);
    }

    // Search
    if (search) {
      filtered = searchData(filtered, search, ['full_name', 'phone', 'email', 'staff_code', 'specialization']);
    }

    // Sort
    const sorted = sortData(filtered, sortBy, order);

    // Paginate
    const result = paginate(sorted, page, limit);

    return {
      success: true,
      data: {
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          hasNextPage: result.page < result.totalPages,
          hasPrevPage: result.page > 1,
        },
      },
    };
  },

  getById: async (id) => {
    await delay(400);

    const staffMember = staff.find(s => s.id === parseInt(id));

    if (!staffMember) {
      throw new Error('Không tìm thấy nhân viên');
    }

    return {
      success: true,
      data: staffMember,
    };
  },

  create: async (staffData) => {
    await delay(800);

    // Check duplicate email
    const exists = staff.find(s => s.email === staffData.email);
    if (exists) {
      throw new Error('Email đã tồn tại');
    }

    const rolePrefix = staffData.role === 'doctor' ? 'BS' : staffData.role === 'nurse' ? 'YT' : 'KTV';
    const staffCount = staff.filter(s => s.role === staffData.role).length + 1;

    const newStaff = {
      id: staff.length + 1,
      staff_code: `${rolePrefix}${String(staffCount).padStart(3, '0')}`,
      ...staffData,
      created_at: new Date().toISOString(),
    };

    staff.push(newStaff);

    return {
      success: true,
      message: 'Thêm nhân viên thành công',
      data: newStaff,
    };
  },

  update: async (id, staffData) => {
    await delay(700);

    const index = staff.findIndex(s => s.id === parseInt(id));

    if (index === -1) {
      throw new Error('Không tìm thấy nhân viên');
    }

    // Check duplicate email (excluding current staff)
    const duplicate = staff.find(s => s.email === staffData.email && s.id !== parseInt(id));
    if (duplicate) {
      throw new Error('Email đã được sử dụng');
    }

    staff[index] = {
      ...staff[index],
      ...staffData,
      updated_at: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Cập nhật thông tin nhân viên thành công',
      data: staff[index],
    };
  },

  delete: async (id) => {
    await delay(500);

    const index = staff.findIndex(s => s.id === parseInt(id));

    if (index === -1) {
      throw new Error('Không tìm thấy nhân viên');
    }

    staff.splice(index, 1);

    return {
      success: true,
      message: 'Xóa nhân viên thành công',
    };
  },

  getDoctors: async (params = {}) => {
    params.role = 'doctor';
    return mockStaffAPI.getAll(params);
  },

  getNurses: async (params = {}) => {
    params.role = 'nurse';
    return mockStaffAPI.getAll(params);
  },

  getTechnicians: async (params = {}) => {
    params.role = 'technician';
    return mockStaffAPI.getAll(params);
  },
};

// Mock Appointments API
export const mockAppointmentsAPI = {
  getAll: async (params = {}) => {
    await delay(600);

    const { page = 1, limit = 10, status = '', date = '', doctor_id = '', sortBy = 'appointment_date', order = 'ASC' } = params;

    let filtered = appointments;

    // Filter by status
    if (status) {
      filtered = filtered.filter(a => a.status === status);
    }

    // Filter by date
    if (date) {
      filtered = filtered.filter(a => a.appointment_date === date);
    }

    // Filter by doctor
    if (doctor_id) {
      filtered = filtered.filter(a => a.doctor_id === parseInt(doctor_id));
    }

    // Sort
    const sorted = sortData(filtered, sortBy, order);

    // Paginate
    const result = paginate(sorted, page, limit);

    return {
      success: true,
      data: {
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      },
    };
  },

  getById: async (id) => {
    await delay(400);

    const appointment = appointments.find(a => a.id === parseInt(id));

    if (!appointment) {
      throw new Error('Không tìm thấy lịch hẹn');
    }

    return {
      success: true,
      data: appointment,
    };
  },

  getByStatus: async (status, params = {}) => {
    params.status = status;
    return mockAppointmentsAPI.getAll(params);
  },

  create: async (appointmentData) => {
    await delay(800);

    const newAppointment = {
      id: appointments.length + 1,
      appointment_code: `APT${String(appointments.length + 1).padStart(6, '0')}`,
      ...appointmentData,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    appointments.push(newAppointment);

    return {
      success: true,
      message: 'Đăng ký lịch hẹn thành công',
      data: newAppointment,
    };
  },

  update: async (id, appointmentData) => {
    await delay(700);

    const index = appointments.findIndex(a => a.id === parseInt(id));

    if (index === -1) {
      throw new Error('Không tìm thấy lịch hẹn');
    }

    appointments[index] = {
      ...appointments[index],
      ...appointmentData,
      updated_at: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Cập nhật lịch hẹn thành công',
      data: appointments[index],
    };
  },

  delete: async (id) => {
    await delay(500);

    const index = appointments.findIndex(a => a.id === parseInt(id));

    if (index === -1) {
      throw new Error('Không tìm thấy lịch hẹn');
    }

    appointments.splice(index, 1);

    return {
      success: true,
      message: 'Xóa lịch hẹn thành công',
    };
  },
};

// Mock Clinics API
export const mockClinicsAPI = {
  getAll: async (params = {}) => {
    await delay(500);

    const { page = 1, limit = 10 } = params;
    const result = paginate(clinics, page, limit);

    return {
      success: true,
      data: {
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      },
    };
  },
};

// Export for easy switching
export const mockAPI = {
  auth: mockAuthAPI,
  patients: mockPatientsAPI,
  staff: mockStaffAPI,
  appointments: mockAppointmentsAPI,
  clinics: mockClinicsAPI,
};
