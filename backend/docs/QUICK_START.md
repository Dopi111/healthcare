# Quick Start Guide - Hướng dẫn khởi động nhanh

## 📦 Cài đặt nhanh (3 phút)

### Bước 1: Cài đặt dependencies

```bash
cd backend
npm install
```

### Bước 2: Tạo database

```bash
# Đăng nhập PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE healthcare_db;

# Thoát
\q

# Import schema
psql -U postgres -d healthcare_db -f database/schema.sql
```

### Bước 3: Cấu hình môi trường

```bash
# Copy file .env.example
cp .env.example .env

# Chỉnh sửa file .env với thông tin database của bạn
nano .env
```

### Bước 4: Chạy server

```bash
npm run dev
```

✅ Server sẽ chạy tại: `http://localhost:5000`

✅ API Docs: `http://localhost:5000/api-docs`

## 🎯 Test API ngay lập tức

### 1. Đăng nhập admin (mặc định)

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@healthcare.com",
    "password": "admin123"
  }'
```

**Lưu ý:** Token trả về để sử dụng cho các request tiếp theo!

### 2. Thêm bệnh nhân đầu tiên

```bash
curl -X POST http://localhost:5000/api/v1/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "full_name": "Nguyễn Văn A",
    "phone": "0901234567",
    "email": "test@email.com",
    "date_of_birth": "1990-01-01",
    "gender": "male"
  }'
```

### 3. Xem danh sách bệnh nhân

```bash
curl -X GET http://localhost:5000/api/v1/patients \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚀 Chạy với Docker (optional)

```bash
# Build image
docker build -t healthcare-api .

# Run container
docker run -p 5000:5000 --env-file .env healthcare-api
```

## 📱 Test với Postman

1. Mở Swagger UI: `http://localhost:5000/api-docs`
2. Click "Try it out" trên bất kỳ endpoint nào
3. Hoặc import Swagger JSON vào Postman

## 🔑 Tài khoản mặc định

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@healthcare.com | admin123 |

⚠️ **Lưu ý:** Đổi mật khẩu admin ngay sau khi cài đặt!

## 📝 Các lệnh thường dùng

```bash
# Development
npm run dev

# Production
npm start

# Kiểm tra database
psql -U postgres -d healthcare_db

# Xem logs
tail -f logs/app.log

# Dừng server
Ctrl + C
```

## 🐛 Xử lý lỗi thường gặp

### Lỗi: Port 5000 đã được sử dụng

```bash
# Tìm và kill process
lsof -ti:5000 | xargs kill -9

# Hoặc đổi port trong .env
PORT=3000
```

### Lỗi: Cannot connect to database

```bash
# Kiểm tra PostgreSQL đang chạy
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start

# Kiểm tra thông tin kết nối trong .env
```

### Lỗi: JWT token invalid

```bash
# Đảm bảo đã set JWT_SECRET trong .env
JWT_SECRET=your_secret_key_here
```

## 📚 Tài liệu chi tiết

- [README.md](../README.md) - Tài liệu đầy đủ
- [API_EXAMPLES.md](./API_EXAMPLES.md) - Ví dụ API
- [Swagger UI](http://localhost:5000/api-docs) - API Documentation

## ✅ Checklist sau khi cài đặt

- [ ] Server chạy thành công trên port 5000
- [ ] Kết nối database thành công
- [ ] Đăng nhập admin thành công
- [ ] Test create patient thành công
- [ ] Swagger UI hiển thị đầy đủ endpoints
- [ ] Đã đổi mật khẩu admin
- [ ] Đã cập nhật JWT_SECRET trong .env

## 🎉 Hoàn tất!

Bây giờ bạn có thể:
- Xem API docs tại: `http://localhost:5000/api-docs`
- Test API bằng Postman/cURL
- Tích hợp với frontend
- Phát triển thêm features

## 💡 Tips

1. Sử dụng Swagger UI để test API nhanh nhất
2. Lưu JWT token vào biến môi trường để dễ sử dụng
3. Bật logging để debug:
   ```javascript
   // src/app.js
   app.use(morgan('dev'));
   ```
4. Sử dụng Postman Collections để quản lý API tests

## 🆘 Cần hỗ trợ?

- Xem [README.md](../README.md) để biết chi tiết
- Kiểm tra logs tại console
- Kiểm tra database schema tại `database/schema.sql`
