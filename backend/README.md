# Healthcare Management System - Backend API

Hệ thống quản lý phòng khám toàn diện với API RESTful được xây dựng bằng Express.js và PostgreSQL.

## 🚀 Tính năng chính

### 1. **Quản lý Bệnh nhân (Patient Management)**
- ✅ CRUD bệnh nhân (Tạo, Đọc, Cập nhật, Xóa)
- ✅ Tìm kiếm bệnh nhân (theo tên, SĐT, CCCD, mã BN)
- ✅ Lịch sử khám bệnh
- ✅ Sắp xếp theo nhiều tiêu chí
- ✅ Phân trang dữ liệu

### 2. **Quản lý Nhân viên (Staff Management)**
- ✅ Quản lý Bác sĩ
- ✅ Quản lý Y tá
- ✅ Quản lý Kỹ thuật viên Y tế
- ✅ Quản lý Tiếp tân
- ✅ Quản lý Kế toán
- ✅ Lịch làm việc nhân viên
- ✅ Phân khoa

### 3. **Quản lý Lịch hẹn (Appointment Management)**
- ✅ Đăng ký khám bệnh
- ✅ Quản lý lịch hẹn
- ✅ Theo dõi trạng thái (chưa khám, đã khám, hủy)
- ✅ Kiểm tra xung đột lịch hẹn

### 4. **Quản lý Phòng khám (Clinic Management)**
- ✅ Quản lý phòng khám
- ✅ Lịch sử dụng phòng
- ✅ Quản lý thiết bị

### 5. **Quản lý Doanh thu (Revenue Management)**
- ✅ Quản lý hóa đơn
- ✅ Thanh toán
- ✅ Thống kê doanh thu
- ✅ Quản lý bảo hiểm

### 6. **Xác thực & Phân quyền (Authentication & Authorization)**
- ✅ Đăng ký/Đăng nhập
- ✅ JWT Authentication
- ✅ Role-based Access Control (RBAC)
- ✅ Quản lý profile

## 📋 Yêu cầu hệ thống

- Node.js >= 16.x
- PostgreSQL >= 13.x
- npm hoặc yarn

## 🛠️ Cài đặt

### 1. Clone repository

```bash
cd backend
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình database

Tạo database PostgreSQL:

```sql
CREATE DATABASE healthcare_db;
```

Import schema:

```bash
psql -U postgres -d healthcare_db -f database/schema.sql
```

### 4. Cấu hình môi trường

Copy file `.env.example` thành `.env` và cập nhật thông tin:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
```

### 5. Tạo admin user mặc định

Chạy lệnh sau để hash password cho admin:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

Sau đó update vào database:

```sql
UPDATE users SET password_hash = 'YOUR_HASHED_PASSWORD' WHERE email = 'admin@healthcare.com';
```

## 🚀 Chạy ứng dụng

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📚 API Documentation

Sau khi chạy server, truy cập Swagger documentation tại:

```
http://localhost:5000/api-docs
```

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/login` - Đăng nhập
- `GET /api/v1/auth/profile` - Lấy thông tin profile
- `PUT /api/v1/auth/profile` - Cập nhật profile
- `POST /api/v1/auth/change-password` - Đổi mật khẩu

### Patients (Bệnh nhân)
- `GET /api/v1/patients` - Danh sách bệnh nhân
- `GET /api/v1/patients/:id` - Chi tiết bệnh nhân
- `POST /api/v1/patients` - Thêm bệnh nhân
- `PUT /api/v1/patients/:id` - Cập nhật bệnh nhân
- `DELETE /api/v1/patients/:id` - Xóa bệnh nhân
- `GET /api/v1/patients/:id/medical-history` - Lịch sử khám bệnh

### Staff (Nhân viên)
- `GET /api/v1/staff` - Danh sách nhân viên
- `GET /api/v1/staff/doctors` - Danh sách bác sĩ
- `GET /api/v1/staff/nurses` - Danh sách y tá
- `GET /api/v1/staff/technicians` - Danh sách kỹ thuật viên
- `GET /api/v1/staff/:id` - Chi tiết nhân viên
- `POST /api/v1/staff` - Thêm nhân viên
- `PUT /api/v1/staff/:id` - Cập nhật nhân viên
- `DELETE /api/v1/staff/:id` - Xóa nhân viên
- `GET /api/v1/staff/:id/schedule` - Lịch làm việc
- `GET /api/v1/staff/departments` - Danh sách khoa

### Appointments (Lịch hẹn)
- `GET /api/v1/appointments` - Danh sách lịch hẹn
- `GET /api/v1/appointments/status/:status` - Lịch hẹn theo trạng thái
- `GET /api/v1/appointments/:id` - Chi tiết lịch hẹn
- `POST /api/v1/appointments` - Tạo lịch hẹn
- `PUT /api/v1/appointments/:id` - Cập nhật lịch hẹn
- `PATCH /api/v1/appointments/:id/cancel` - Hủy lịch hẹn
- `DELETE /api/v1/appointments/:id` - Xóa lịch hẹn

### Clinics (Phòng khám)
- `GET /api/v1/clinics` - Danh sách phòng khám
- `GET /api/v1/clinics/:id` - Chi tiết phòng khám
- `POST /api/v1/clinics` - Thêm phòng khám
- `PUT /api/v1/clinics/:id` - Cập nhật phòng khám
- `DELETE /api/v1/clinics/:id` - Xóa phòng khám
- `GET /api/v1/clinics/:id/schedule` - Lịch phòng khám

### Revenue (Doanh thu)
- `GET /api/v1/revenue/invoices` - Danh sách hóa đơn
- `GET /api/v1/revenue/invoices/:id` - Chi tiết hóa đơn
- `POST /api/v1/revenue/invoices` - Tạo hóa đơn
- `PATCH /api/v1/revenue/invoices/:id/payment` - Cập nhật thanh toán
- `GET /api/v1/revenue/stats` - Thống kê doanh thu
- `GET /api/v1/revenue/insurance-claims` - Quản lý bảo hiểm

## 🔐 Authentication

API sử dụng JWT (JSON Web Token) để xác thực.

### Cách sử dụng:

1. Đăng nhập để lấy token:
```bash
POST /api/v1/auth/login
{
  "email": "admin@healthcare.com",
  "password": "admin123"
}
```

2. Sử dụng token trong header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 👥 Roles & Permissions

- **admin**: Toàn quyền hệ thống
- **doctor**: Bác sĩ - Quản lý bệnh nhân, lịch hẹn, hồ sơ y tế
- **nurse**: Y tá - Hỗ trợ khám bệnh
- **technician**: Kỹ thuật viên - Quản lý xét nghiệm
- **receptionist**: Tiếp tân - Đăng ký khám, quản lý lịch hẹn
- **accountant**: Kế toán - Quản lý doanh thu, hóa đơn
- **patient**: Bệnh nhân - Xem thông tin cá nhân

## 📦 Database Schema

### Main Tables:
- `users` - Tài khoản người dùng
- `patients` - Thông tin bệnh nhân
- `staff` - Thông tin nhân viên
- `departments` - Khoa
- `clinics` - Phòng khám
- `appointments` - Lịch hẹn
- `medical_records` - Hồ sơ y tế
- `prescriptions` - Đơn thuốc
- `invoices` - Hóa đơn
- `insurance_claims` - Bảo hiểm
- `staff_schedule` - Lịch làm việc

## 🧪 Testing API

### Sử dụng cURL:

```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@healthcare.com","password":"admin123"}'

# Get patients (with token)
curl -X GET http://localhost:5000/api/v1/patients \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Sử dụng Postman:

Import collection từ Swagger documentation hoặc tạo requests thủ công.

## 🛡️ Security Features

- ✅ Helmet.js - Security headers
- ✅ CORS protection
- ✅ JWT authentication
- ✅ Password hashing (bcryptjs)
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ Rate limiting (recommended to add)

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | healthcare_db |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRES_IN | JWT expiration | 7d |
| CORS_ORIGIN | CORS origin | http://localhost:5173 |

## 🐛 Troubleshooting

### Database connection error
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart
```

### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

## 📄 License

MIT

## 👨‍💻 Author

Healthcare Management System Team

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
