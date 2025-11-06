# Backend Setup Guide

## 📋 Hiện tại: Frontend đang dùng MOCK DATA

Frontend hiện đang chạy với **mock data** (fake data) nên **KHÔNG CẦN backend** để test UI/UX.

Khi bạn sẵn sàng setup backend + database, làm theo hướng dẫn bên dưới.

---

## 🗄️ Bước 1: Setup PostgreSQL Database

### Option 1: Cài đặt PostgreSQL Local

#### **Windows:**
1. Download PostgreSQL: https://www.postgresql.org/download/windows/
2. Cài đặt với mặc định
3. Nhớ password của user `postgres`

#### **Mac (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### **Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Option 2: Docker (Dễ nhất)

```bash
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name healthcare-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=healthcare_db \
  -p 5432:5432 \
  -d postgres:15

# Check container đang chạy
docker ps
```

---

## 🔧 Bước 2: Tạo Database và Import Schema

### Cách 1: Dùng psql command line

```bash
# Kết nối vào PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE healthcare_db;

# Thoát
\q

# Import schema
psql -U postgres -d healthcare_db -f backend/database/schema.sql
```

### Cách 2: Dùng pgAdmin (GUI)

1. Mở pgAdmin
2. Connect tới localhost:5432
3. Right click Databases → Create → Database
4. Tên: `healthcare_db`
5. Tools → Query Tool
6. Mở file `backend/database/schema.sql`
7. Execute (F5)

---

## 📦 Bước 3: Cài đặt Backend Dependencies

```bash
cd backend
npm install
```

### Dependencies sẽ được cài:
- express - Web framework
- pg - PostgreSQL client
- dotenv - Environment variables
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - CORS middleware
- helmet - Security headers
- morgan - Logging
- express-validator - Input validation
- swagger-jsdoc, swagger-ui-express - API documentation
- compression - Response compression

---

## ⚙️ Bước 4: Configure Environment

```bash
# Copy .env.example to .env
cp .env.example .env

# Chỉnh sửa .env
nano .env  # hoặc dùng editor
```

**File `.env` (backend):**
```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password  # ← Đổi password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this  # ← Đổi secret
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

---

## 🚀 Bước 5: Start Backend Server

```bash
cd backend
npm run dev
```

**Kết quả:**
```
✅ Database connected successfully

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🏥  HEALTHCARE MANAGEMENT SYSTEM API                    ║
║                                                            ║
║   🚀  Server running on port 5000                         ║
║   📝  API Docs: http://localhost:5000/api-docs            ║
║   🔗  API Base: http://localhost:5000/api/v1              ║
║   🌍  Environment: development                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## 🧪 Bước 6: Test API với Swagger

1. Mở browser: http://localhost:5000/api-docs
2. Thấy Swagger UI với tất cả API endpoints
3. Test login API:
   - Expand `POST /api/v1/auth/login`
   - Click "Try it out"
   - Body:
     ```json
     {
       "email": "admin@healthcare.com",
       "password": "admin123"
     }
     ```
   - Click "Execute"
   - Nhận token trong response

---

## 🔄 Bước 7: Switch Frontend sang Real API

### **File: `.env` (root directory - frontend)**

Đổi từ:
```env
VITE_USE_MOCK=true
```

Thành:
```env
VITE_USE_MOCK=false
```

### **Restart Frontend:**

```bash
# Stop frontend (Ctrl+C)
# Start lại
npm run dev
```

---

## ✅ Bước 8: Verify Everything Works

### Test Login:
1. Mở http://localhost:5173/Admin/Login
2. Email: `admin@healthcare.com`
3. Password: `admin123`
4. Click "Đăng nhập"
5. Nếu thành công → chuyển sang Dashboard

### Test Patient List:
1. Sau khi login, click "Danh sách BN"
2. Nếu thấy "Chưa có bệnh nhân" → **ĐÚNG** (database mới rỗng)
3. Click "Thêm Bệnh Nhân"
4. Điền form → Save
5. Quay lại list → Thấy bệnh nhân vừa thêm

---

## 🐛 Troubleshooting

### Lỗi: "Database connection failed"
```bash
# Check PostgreSQL đang chạy
# Windows:
services.msc → PostgreSQL Service → Start

# Mac:
brew services list
brew services start postgresql@15

# Linux:
sudo systemctl status postgresql
sudo systemctl start postgresql

# Docker:
docker ps
docker start healthcare-postgres
```

### Lỗi: "Port 5000 already in use"
```bash
# Tìm process đang dùng port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Hoặc đổi port trong backend/.env:
PORT=3000
```

### Lỗi: "CORS Error" trên frontend
```bash
# Check backend/.env có đúng frontend URL không:
CORS_ORIGIN=http://localhost:5173

# Restart backend sau khi đổi .env
```

### Lỗi: "JWT Token invalid"
```bash
# Clear localStorage
# Mở DevTools → Application → Local Storage → Clear All
# Login lại
```

---

## 📊 Database Schema

Backend đã tạo sẵn các bảng:

- **users** - Tài khoản (admin, doctor, nurse, etc.)
- **patients** - Bệnh nhân
- **staff** - Nhân viên
- **departments** - Khoa
- **clinics** - Phòng khám
- **appointments** - Lịch hẹn
- **medical_records** - Hồ sơ y tế
- **prescriptions** - Đơn thuốc
- **invoices** - Hóa đơn
- **insurance_claims** - Bảo hiểm
- **staff_schedule** - Lịch làm việc

---

## 🔑 Default Admin Account

Schema đã tạo sẵn admin account:

**⚠️ QUAN TRỌNG:** Cần update password hash thủ công!

```bash
# Generate password hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"

# Copy hash result

# Update database
psql -U postgres -d healthcare_db

UPDATE users
SET password_hash = 'YOUR_HASHED_PASSWORD'
WHERE email = 'admin@healthcare.com';
```

Hoặc tạo user mới qua Swagger:
1. http://localhost:5000/api-docs
2. POST /api/v1/auth/register
3. Tạo admin account mới

---

## 📁 Project Structure After Setup

```
healthcare/
├── backend/              ✅ Backend API (Express.js)
│   ├── src/
│   │   ├── app.js       → Main server
│   │   ├── config/      → DB, Swagger config
│   │   ├── controllers/ → Business logic
│   │   ├── routes/      → API endpoints
│   │   ├── middleware/  → Auth, validation
│   │   └── utils/       → Helpers
│   ├── database/
│   │   └── schema.sql   → PostgreSQL schema
│   ├── .env            → Backend config
│   └── package.json
│
├── src/                 ✅ Frontend (React)
│   ├── services/
│   │   ├── api.js      → API service (auto-switch)
│   │   ├── mockApi.js  → Mock API
│   │   └── mockData.js → Fake data
│   ├── components/
│   ├── context/
│   └── FontEnds/
│
├── .env                ✅ Frontend config
└── package.json
```

---

## 🎯 Summary

### Khi CHƯA setup backend (hiện tại):
- ✅ Frontend chạy với mock data
- ✅ Không cần PostgreSQL
- ✅ Không cần backend server
- ✅ Test UI/UX được ngay

### Khi ĐÃ setup backend:
- ✅ Frontend connect real API
- ✅ Data lưu vào PostgreSQL
- ✅ Full authentication với JWT
- ✅ Ready for production

---

## 🚀 Quick Start (Summary)

```bash
# 1. Start PostgreSQL (Docker - dễ nhất)
docker run --name healthcare-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=healthcare_db \
  -p 5432:5432 -d postgres:15

# 2. Import schema
psql -U postgres -h localhost -d healthcare_db -f backend/database/schema.sql

# 3. Setup backend
cd backend
cp .env.example .env
# Chỉnh sửa .env với password
npm install
npm run dev

# 4. Test API
# Mở http://localhost:5000/api-docs

# 5. Switch frontend to real API
# File .env (root): VITE_USE_MOCK=false

# 6. Test login
# http://localhost:5173/Admin/Login
```

---

## 💡 Tips

1. **Dùng Docker** cho PostgreSQL → Dễ nhất, clean nhất
2. **Test với Swagger** trước khi test frontend
3. **Check console logs** để debug
4. **Đọc backend README** cho chi tiết hơn
5. **Backup database** thường xuyên khi có data quan trọng

---

## 📞 Support

Nếu gặp lỗi:
1. Check console logs (frontend & backend)
2. Check database connection
3. Check .env files
4. Check ports (5000, 5432, 5173)
5. Check CORS settings

Happy coding! 🎉
