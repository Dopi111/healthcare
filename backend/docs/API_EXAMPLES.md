# API Examples - Ví dụ sử dụng API

## 🔐 Authentication (Xác thực)

### 1. Đăng ký tài khoản mới

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "nguyenvana",
  "email": "nguyenvana@example.com",
  "password": "123456",
  "role": "patient"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "id": 1,
      "username": "nguyenvana",
      "email": "nguyenvana@example.com",
      "role": "patient",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Đăng nhập

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@healthcare.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@healthcare.com",
      "role": "admin",
      "is_active": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 👤 Patient Management (Quản lý Bệnh nhân)

### 1. Thêm bệnh nhân mới

```bash
POST /api/v1/patients
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "full_name": "Nguyễn Văn A",
  "phone": "0901234567",
  "email": "nguyenvana@email.com",
  "date_of_birth": "1990-01-15",
  "gender": "male",
  "address": "123 Đường ABC, Quận 1, TP.HCM",
  "citizen_id": "001234567890",
  "insurance_number": "BH123456789",
  "emergency_contact": "Nguyễn Thị B",
  "emergency_phone": "0912345678",
  "blood_type": "O+",
  "allergies": "Không có",
  "medical_history": "Tiền sử huyết áp"
}
```

### 2. Lấy danh sách bệnh nhân (có phân trang)

```bash
GET /api/v1/patients?page=1&limit=10&search=Nguyễn&sortBy=created_at&order=DESC
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Lấy danh sách bệnh nhân thành công",
  "data": {
    "data": [
      {
        "id": 1,
        "patient_code": "BN000001",
        "full_name": "Nguyễn Văn A",
        "phone": "0901234567",
        "email": "nguyenvana@email.com",
        "date_of_birth": "1990-01-15",
        "gender": "male",
        "age": 34,
        "address": "123 Đường ABC, Quận 1, TP.HCM",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### 3. Cập nhật thông tin bệnh nhân

```bash
PUT /api/v1/patients/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "phone": "0901234568",
  "address": "456 Đường XYZ, Quận 2, TP.HCM"
}
```

### 4. Xem lịch sử khám bệnh

```bash
GET /api/v1/patients/1/medical-history
Authorization: Bearer YOUR_TOKEN
```

## 👨‍⚕️ Staff Management (Quản lý Nhân viên)

### 1. Thêm bác sĩ mới

```bash
POST /api/v1/staff
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "username": "dr_nguyen",
  "email": "bacsi.nguyen@healthcare.com",
  "password": "123456",
  "full_name": "BS. Nguyễn Văn B",
  "phone": "0912345678",
  "date_of_birth": "1985-05-20",
  "gender": "male",
  "address": "789 Đường DEF, Quận 3, TP.HCM",
  "citizen_id": "009876543210",
  "staff_type": "doctor",
  "specialization": "Nội khoa",
  "license_number": "BS123456",
  "department_id": 1,
  "salary": 20000000,
  "hire_date": "2020-01-01",
  "status": "active"
}
```

### 2. Lấy danh sách bác sĩ

```bash
GET /api/v1/staff/doctors?page=1&limit=10
Authorization: Bearer YOUR_TOKEN
```

### 3. Lấy danh sách y tá

```bash
GET /api/v1/staff/nurses
Authorization: Bearer YOUR_TOKEN
```

### 4. Xem lịch làm việc của nhân viên

```bash
GET /api/v1/staff/1/schedule?start_date=2024-01-01&end_date=2024-01-31
Authorization: Bearer YOUR_TOKEN
```

## 📅 Appointment Management (Quản lý Lịch hẹn)

### 1. Đăng ký khám bệnh

```bash
POST /api/v1/appointments
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "patient_id": 1,
  "doctor_id": 2,
  "clinic_id": 1,
  "appointment_date": "2024-01-15",
  "appointment_time": "09:00:00",
  "reason": "Khám tổng quát",
  "symptoms": "Đau đầu, sốt nhẹ",
  "notes": "Bệnh nhân cần khám gấp"
}
```

### 2. Lấy danh sách lịch hẹn chưa khám

```bash
GET /api/v1/appointments/status/pending
Authorization: Bearer YOUR_TOKEN
```

### 3. Lấy danh sách lịch hẹn đã hoàn thành

```bash
GET /api/v1/appointments/status/completed
Authorization: Bearer YOUR_TOKEN
```

### 4. Cập nhật trạng thái lịch hẹn

```bash
PUT /api/v1/appointments/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "status": "completed",
  "notes": "Đã khám xong"
}
```

### 5. Hủy lịch hẹn

```bash
PATCH /api/v1/appointments/1/cancel
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "notes": "Bệnh nhân xin hủy vì bận việc đột xuất"
}
```

## 🏥 Clinic Management (Quản lý Phòng khám)

### 1. Thêm phòng khám mới

```bash
POST /api/v1/clinics
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "room_number": "P101",
  "room_name": "Phòng khám Nội khoa 1",
  "department_id": 1,
  "floor_number": 1,
  "capacity": 2,
  "equipment": "Máy đo huyết áp, Nhiệt kế, Ống nghe",
  "is_available": true
}
```

### 2. Lấy danh sách phòng khám

```bash
GET /api/v1/clinics?is_available=true
Authorization: Bearer YOUR_TOKEN
```

### 3. Xem lịch sử dụng phòng khám

```bash
GET /api/v1/clinics/1/schedule?date=2024-01-15
Authorization: Bearer YOUR_TOKEN
```

## 💰 Revenue Management (Quản lý Doanh thu)

### 1. Tạo hóa đơn

```bash
POST /api/v1/revenue/invoices
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "appointment_id": 1,
  "patient_id": 1,
  "total_amount": 500000,
  "discount": 50000,
  "services": [
    {
      "name": "Khám tổng quát",
      "quantity": 1,
      "price": 200000
    },
    {
      "name": "Xét nghiệm máu",
      "quantity": 1,
      "price": 300000
    }
  ],
  "notes": "Thanh toán bằng tiền mặt"
}
```

### 2. Cập nhật thanh toán

```bash
PATCH /api/v1/revenue/invoices/1/payment
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "paid_amount": 450000,
  "payment_method": "cash",
  "payment_status": "paid"
}
```

### 3. Thống kê doanh thu

```bash
GET /api/v1/revenue/stats?start_date=2024-01-01&end_date=2024-01-31
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Lấy thống kê doanh thu thành công",
  "data": {
    "summary": {
      "total_invoices": 100,
      "gross_revenue": 50000000,
      "total_discount": 5000000,
      "net_revenue": 45000000,
      "total_paid": 40000000,
      "total_outstanding": 5000000
    },
    "by_status": [
      {
        "payment_status": "paid",
        "count": 80,
        "amount": 40000000
      },
      {
        "payment_status": "unpaid",
        "count": 15,
        "amount": 4000000
      },
      {
        "payment_status": "partial",
        "count": 5,
        "amount": 1000000
      }
    ]
  }
}
```

### 4. Lấy danh sách hóa đơn

```bash
GET /api/v1/revenue/invoices?payment_status=unpaid&page=1&limit=10
Authorization: Bearer YOUR_TOKEN
```

### 5. Quản lý bảo hiểm

```bash
GET /api/v1/revenue/insurance-claims?status=pending
Authorization: Bearer YOUR_TOKEN
```

## 🔍 Advanced Queries (Truy vấn nâng cao)

### Tìm kiếm bệnh nhân theo nhiều tiêu chí

```bash
GET /api/v1/patients?search=Nguyễn&page=1&limit=10&sortBy=date_of_birth&order=ASC
Authorization: Bearer YOUR_TOKEN
```

### Lọc nhân viên theo khoa

```bash
GET /api/v1/staff?staff_type=doctor&department_id=1&status=active
Authorization: Bearer YOUR_TOKEN
```

### Lấy lịch hẹn theo ngày và bác sĩ

```bash
GET /api/v1/appointments?doctor_id=2&date=2024-01-15&status=confirmed
Authorization: Bearer YOUR_TOKEN
```

### Thống kê doanh thu theo khoảng thời gian

```bash
GET /api/v1/revenue/stats?start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer YOUR_TOKEN
```

## ❌ Error Responses (Phản hồi lỗi)

### 400 Bad Request
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    {
      "phone": "Số điện thoại không hợp lệ"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Không tìm thấy token xác thực"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Bạn không có quyền truy cập tài nguyên này"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Không tìm thấy bệnh nhân"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Lỗi server",
  "error": "Database connection failed"
}
```
