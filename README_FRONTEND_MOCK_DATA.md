# ✨ Frontend với Mock Data - Chạy ngay không cần Backend!

## 🎯 Hiện tại: KHÔNG CẦN setup PostgreSQL hay Backend

Frontend đã được config để chạy với **mock data** (dữ liệu giả) nên bạn có thể test UI/UX ngay lập tức!

---

## 🚀 Quick Start (3 bước)

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy frontend

```bash
npm run dev
```

### 3. Mở browser

```
http://localhost:5173
```

**XONG!** Không cần database, không cần backend server!

---

## 🔑 Tài khoản demo

### Admin (Full quyền)
- Email: `admin@healthcare.com`
- Password: `admin123`

### Doctor (Bác sĩ)
- Email: `doctor@healthcare.com`
- Password: `doctor123`

### Receptionist (Tiếp tân)
- Email: `tieptan@healthcare.com`
- Password: `tieptan123`

---

## 📋 Dữ liệu mẫu có sẵn

### ✅ Bệnh nhân (5 người)
- Nguyễn Văn An - BN000001
- Trần Thị Bích - BN000002
- Lê Minh Cường - BN000003
- Phạm Thị Diệu - BN000004
- Hoàng Văn Phong - BN000005

### ✅ Nhân viên (3 người)
- BS. Nguyễn Văn Khoa (Nội khoa)
- BS. Trần Thị Lan (Ngoại khoa)
- Y Tá Lê Thị Mai

### ✅ Lịch hẹn (2 appointments)
- Nguyễn Văn An - Khám tổng quát (Pending)
- Trần Thị Bích - Tái khám (Confirmed)

### ✅ Phòng khám (3 phòng)
- P101 - Phòng khám Nội khoa 1
- P102 - Phòng khám Ngoại khoa 1
- P201 - Phòng khám Tai Mũi Họng

---

## 🎨 Các tính năng có thể test

### ✅ Login/Logout
- Đăng nhập với các tài khoản demo
- Logout
- Error handling khi sai password

### ✅ Quản lý Bệnh nhân
- Xem danh sách bệnh nhân (có data mẫu)
- Tìm kiếm bệnh nhân
- Sắp xếp theo tên, ngày sinh, mã BN
- **Thêm bệnh nhân mới** ← Data lưu trong memory
- Sửa thông tin bệnh nhân
- Xóa bệnh nhân (có confirmation)
- Phân trang

### ✅ UI/UX Features
- Loading states (spinner khi fetch data)
- Error messages
- Success alerts
- Empty states
- Form validation
- Responsive design

---

## 💾 Lưu ý về Mock Data

### Data được lưu trong MEMORY
- ✅ Thêm/Sửa/Xóa hoạt động bình thường
- ✅ Data persist trong session hiện tại
- ❌ Refresh page = mất data đã thêm/sửa
- ❌ Close browser = reset về data mẫu ban đầu

### Simulated Features
- Network delay (500-800ms) giống real API
- Error handling
- Token authentication (localStorage)
- Pagination
- Search & Sort
- CRUD operations

---

## 🔄 Khi nào dùng Real API?

Khi bạn đã:
1. ✅ Setup PostgreSQL database
2. ✅ Setup backend Express.js server
3. ✅ Import database schema
4. ✅ Backend running trên port 5000

Thì làm theo hướng dẫn:

### Bước 1: Đổi .env

File: `.env` (ở root directory)

```env
VITE_USE_MOCK=false  # Đổi từ true → false
```

### Bước 2: Restart frontend

```bash
# Stop frontend (Ctrl+C)
npm run dev  # Start lại
```

### Bước 3: Verify

Mở browser console, bạn sẽ thấy:
```
🔧 API Mode: REAL API
```

Instead of:
```
🔧 API Mode: MOCK DATA (No Backend)
```

---

## 📖 Hướng dẫn Setup Backend

Xem file: **BACKEND_SETUP_GUIDE.md** để setup đầy đủ:
- PostgreSQL installation
- Database schema import
- Backend configuration
- API testing với Swagger

---

## 🧪 Test Scenarios

### Scenario 1: Test Login
1. Mở http://localhost:5173/Admin/Login
2. Nhập: `admin@healthcare.com` / `admin123`
3. Click "Đăng nhập"
4. ✅ Chuyển sang Dashboard

### Scenario 2: Test Patient List
1. Sau khi login, click "Danh sách BN"
2. ✅ Thấy 5 bệnh nhân mẫu
3. Test search: Nhập "Nguyễn" → Enter
4. ✅ Thấy kết quả filtered
5. Test sort: Chọn "Tên bệnh nhân" → ASC
6. ✅ Danh sách sắp xếp theo tên

### Scenario 3: Test Add Patient
1. Click "Thêm Bệnh Nhân"
2. Điền form:
   - Họ tên: Test Patient
   - SĐT: 0999999999
   - Email: test@test.com
   - Ngày sinh: 2000-01-01
   - Giới tính: Nam
3. Click "Lưu Thông Tin"
4. ✅ Success alert hiện ra
5. ✅ Chuyển về list
6. ✅ Thấy patient mới trong list (6 people)

### Scenario 4: Test Delete
1. Ở patient list, click "Xóa" ở bệnh nhân bất kỳ
2. ✅ Confirmation popup xuất hiện
3. Click "OK"
4. ✅ Success alert
5. ✅ Patient biến mất khỏi list

---

## 🎯 Ưu điểm của Mock Data

### Cho Developer:
- ✅ Develop UI/UX mà không cần backend
- ✅ Test frontend logic nhanh
- ✅ Không phụ thuộc vào backend team
- ✅ Demo dễ dàng cho client

### Cho Testing:
- ✅ Consistent test data
- ✅ Không lo crash database
- ✅ Test mọi edge cases
- ✅ Rollback dễ dàng (refresh page)

### Cho Demo:
- ✅ Setup nhanh (1 command)
- ✅ Không cần credentials
- ✅ Không lo mất data
- ✅ Always works

---

## 📁 Code Structure

### Mock Data Files:

```
src/services/
├── mockData.js       # Sample data (patients, staff, etc.)
├── mockApi.js        # Mock API implementation
└── api.js            # Smart API layer (auto-switch)
```

### How it works:

```javascript
// api.js
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || true;

// Auto export correct API
export const patientsAPI = USE_MOCK_DATA
  ? mockAPI.patients    // ← Currently using this
  : realPatientsAPI;    // ← Will use this khi setup backend
```

---

## 🐛 Troubleshooting

### Console shows "REAL API" but backend chưa ready
```bash
# Check .env file
cat .env

# Phải có:
VITE_USE_MOCK=true

# Restart frontend
npm run dev
```

### Data không update sau khi thêm/sửa
```bash
# Check console có error không
# Refresh page
# Try lại
```

### Login không work
```bash
# Clear localStorage
# DevTools → Application → Local Storage → Clear All
# Refresh page
# Login lại
```

---

## 📊 Mock vs Real API Comparison

| Feature | Mock Data | Real API |
|---------|-----------|----------|
| **Setup Time** | 1 min | 30+ min |
| **Dependencies** | None | PostgreSQL, Backend |
| **Data Persistence** | Session only | Permanent |
| **Network Delay** | Simulated | Real |
| **Error Handling** | Simulated | Real |
| **Performance** | Instant | Depends on network |
| **Multi-user** | ❌ | ✅ |
| **Production Ready** | ❌ | ✅ |

---

## ⚡ Performance

### Mock Data:
- Initial load: <100ms
- API calls: 500-800ms (simulated delay)
- Total data size: ~5KB in memory
- No network calls

### Real API:
- Initial load: ~200ms
- API calls: 100-500ms (depends on network)
- Database queries
- Network latency

---

## 🎓 Learning Path

### Phase 1: Frontend Only (Hiện tại)
- ✅ Learn React components
- ✅ Learn UI/UX design
- ✅ Test với mock data
- ✅ Build frontend features

### Phase 2: Full Stack
- Setup PostgreSQL
- Setup Express backend
- Connect frontend to API
- Deploy to production

---

## 📞 Support

Nếu gặp vấn đề:

1. Check console logs (F12)
2. Check .env file có đúng config không
3. Clear localStorage và refresh
4. Restart dev server

---

## ✨ Summary

**Hiện tại:** Frontend hoàn toàn độc lập, chạy với mock data

**Tương lai:** Khi cần, switch sang real API chỉ với 1 dòng config

**Best of both worlds!** 🎉
