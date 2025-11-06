// Mock Data for Development (Không cần backend)
// Khi setup backend xong, đổi USE_MOCK_DATA = false trong .env

// Mock Patients Data
export const mockPatients = [
  {
    id: 1,
    patient_code: 'BN000001',
    full_name: 'Nguyễn Văn An',
    phone: '0901234567',
    email: 'nguyenvanan@email.com',
    date_of_birth: '1990-01-15',
    gender: 'male',
    age: 34,
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    citizen_id: '001234567890',
    insurance_number: 'BH123456789',
    emergency_contact: 'Nguyễn Thị B',
    emergency_phone: '0912345678',
    blood_type: 'O+',
    allergies: 'Không có',
    medical_history: 'Tiền sử huyết áp cao',
    created_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 2,
    patient_code: 'BN000002',
    full_name: 'Trần Thị Bích',
    phone: '0909876543',
    email: 'tranthib@email.com',
    date_of_birth: '1985-05-20',
    gender: 'female',
    age: 39,
    address: '456 Đường Nguyễn Huệ, Quận 3, TP.HCM',
    citizen_id: '009876543210',
    insurance_number: 'BH987654321',
    emergency_contact: 'Trần Văn C',
    emergency_phone: '0923456789',
    blood_type: 'A+',
    allergies: 'Dị ứng penicillin',
    medical_history: 'Đã từng phẫu thuật ruột thừa',
    created_at: '2024-01-20T10:30:00Z',
  },
  {
    id: 3,
    patient_code: 'BN000003',
    full_name: 'Lê Minh Cường',
    phone: '0918765432',
    email: 'leminhcuong@email.com',
    date_of_birth: '1995-08-10',
    gender: 'male',
    age: 29,
    address: '789 Đường Trần Hưng Đạo, Quận 5, TP.HCM',
    citizen_id: '005678901234',
    insurance_number: 'BH567890123',
    emergency_contact: 'Lê Thị D',
    emergency_phone: '0934567890',
    blood_type: 'B+',
    allergies: 'Không có',
    medical_history: 'Khỏe mạnh',
    created_at: '2024-02-01T14:15:00Z',
  },
  {
    id: 4,
    patient_code: 'BN000004',
    full_name: 'Phạm Thị Diệu',
    phone: '0927654321',
    email: 'phamthidieu@email.com',
    date_of_birth: '1988-12-25',
    gender: 'female',
    age: 35,
    address: '321 Đường Hai Bà Trưng, Quận 1, TP.HCM',
    citizen_id: '003456789012',
    insurance_number: 'BH345678901',
    emergency_contact: 'Phạm Văn E',
    emergency_phone: '0945678901',
    blood_type: 'AB+',
    allergies: 'Dị ứng hải sản',
    medical_history: 'Tiểu đường type 2',
    created_at: '2024-02-10T09:20:00Z',
  },
  {
    id: 5,
    patient_code: 'BN000005',
    full_name: 'Hoàng Văn Phong',
    phone: '0936543210',
    email: 'hoangvanphong@email.com',
    date_of_birth: '1992-03-18',
    gender: 'male',
    age: 32,
    address: '654 Đường Phan Xích Long, Quận Phú Nhuận, TP.HCM',
    citizen_id: '007890123456',
    insurance_number: 'BH789012345',
    emergency_contact: 'Hoàng Thị F',
    emergency_phone: '0956789012',
    blood_type: 'O-',
    allergies: 'Không có',
    medical_history: 'Từng bị gãy xương tay',
    created_at: '2024-02-15T11:45:00Z',
  },
];

// Mock Staff Data
export const mockStaff = [
  {
    id: 1,
    full_name: 'BS. Nguyễn Văn Khoa',
    phone: '0912345678',
    email: 'bs.khoa@healthcare.com',
    staff_type: 'doctor',
    specialization: 'Nội khoa',
    license_number: 'BS123456',
    department_name: 'Khoa Nội',
    status: 'active',
    age: 45,
  },
  {
    id: 2,
    full_name: 'BS. Trần Thị Lan',
    phone: '0923456789',
    email: 'bs.lan@healthcare.com',
    staff_type: 'doctor',
    specialization: 'Ngoại khoa',
    license_number: 'BS234567',
    department_name: 'Khoa Ngoại',
    status: 'active',
    age: 38,
  },
  {
    id: 3,
    full_name: 'Y Tá Lê Thị Mai',
    phone: '0934567890',
    email: 'yta.mai@healthcare.com',
    staff_type: 'nurse',
    specialization: null,
    license_number: 'YT123456',
    department_name: 'Khoa Nội',
    status: 'active',
    age: 28,
  },
];

// Mock Appointments Data
export const mockAppointments = [
  {
    id: 1,
    appointment_code: 'APT000001',
    patient_id: 1,
    patient_name: 'Nguyễn Văn An',
    patient_phone: '0901234567',
    doctor_id: 1,
    doctor_name: 'BS. Nguyễn Văn Khoa',
    clinic_id: 1,
    room_number: 'P101',
    room_name: 'Phòng khám Nội khoa 1',
    appointment_date: '2024-03-15',
    appointment_time: '09:00:00',
    status: 'pending',
    reason: 'Khám tổng quát',
    symptoms: 'Đau đầu, sốt nhẹ',
    created_at: '2024-03-01T10:00:00Z',
  },
  {
    id: 2,
    appointment_code: 'APT000002',
    patient_id: 2,
    patient_name: 'Trần Thị Bích',
    patient_phone: '0909876543',
    doctor_id: 2,
    doctor_name: 'BS. Trần Thị Lan',
    clinic_id: 2,
    room_number: 'P102',
    room_name: 'Phòng khám Ngoại khoa 1',
    appointment_date: '2024-03-16',
    appointment_time: '10:30:00',
    status: 'confirmed',
    reason: 'Tái khám sau mổ',
    symptoms: null,
    created_at: '2024-03-02T14:30:00Z',
  },
];

// Mock Clinics Data
export const mockClinics = [
  {
    id: 1,
    room_number: 'P101',
    room_name: 'Phòng khám Nội khoa 1',
    department_name: 'Khoa Nội',
    floor_number: 1,
    capacity: 2,
    is_available: true,
  },
  {
    id: 2,
    room_number: 'P102',
    room_name: 'Phòng khám Ngoại khoa 1',
    department_name: 'Khoa Ngoại',
    floor_number: 1,
    capacity: 2,
    is_available: true,
  },
  {
    id: 3,
    room_number: 'P201',
    room_name: 'Phòng khám Tai Mũi Họng',
    department_name: 'Khoa TMH',
    floor_number: 2,
    capacity: 1,
    is_available: true,
  },
];

// Mock User (for login)
export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@healthcare.com',
    password: 'admin123',
    role: 'admin',
    is_active: true,
    full_name: 'Quản trị viên',
  },
  {
    id: 2,
    username: 'doctor1',
    email: 'doctor@healthcare.com',
    password: 'doctor123',
    role: 'doctor',
    is_active: true,
    full_name: 'BS. Nguyễn Văn Khoa',
  },
  {
    id: 3,
    username: 'receptionist1',
    email: 'tieptan@healthcare.com',
    password: 'tieptan123',
    role: 'receptionist',
    is_active: true,
    full_name: 'Nguyễn Thị Bích',
  },
];

// Helper function to simulate API delay
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function for pagination
export const paginate = (array, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: array.slice(start, end),
    total: array.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(array.length / limit),
  };
};

// Helper function for search
export const searchData = (array, searchTerm, fields = []) => {
  if (!searchTerm) return array;

  const term = searchTerm.toLowerCase();
  return array.filter(item => {
    return fields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(term);
    });
  });
};

// Helper function for sort
export const sortData = (array, sortBy = 'id', order = 'DESC') => {
  return [...array].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (order === 'ASC') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};
