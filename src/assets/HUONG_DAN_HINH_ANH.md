# Hướng dẫn sử dụng hình ảnh và icon

## 📁 Cấu trúc thư mục

```
src/assets/
├── images/          # Thư mục chứa hình ảnh
│   ├── banner-1.jpg
│   ├── banner-2.jpg
│   ├── banner-3.jpg
│   └── banner-4.jpg
├── icons/           # Thư mục chứa icons
└── react.svg        # Icon React mặc định
```

## 🖼️ Hình ảnh Banner Carousel

### Yêu cầu hình ảnh:
- **Số lượng:** 4 hình ảnh (hoặc tùy chỉnh trong code)
- **Tên file:** 
  - `banner-1.jpg` - Slide 1: Chăm sóc sức khỏe
  - `banner-2.jpg` - Slide 2: Đội ngũ bác sĩ
  - `banner-3.jpg` - Slide 3: Trang thiết bị
  - `banner-4.jpg` - Slide 4: Dịch vụ chăm sóc
- **Kích thước đề xuất:** 1920x600px (tỷ lệ 16:5) hoặc 1920x800px (tỷ lệ 12:5)
- **Định dạng:** JPG, PNG, WebP
- **Dung lượng:** < 500KB mỗi ảnh (nén để tối ưu tốc độ)

### Nội dung hình ảnh đề xuất:
1. **banner-1.jpg:** Hình ảnh phòng khám hiện đại, sạch sẽ
2. **banner-2.jpg:** Bác sĩ đang khám bệnh, tư vấn cho bệnh nhân
3. **banner-3.jpg:** Trang thiết bị y tế hiện đại (máy siêu âm, xét nghiệm...)
4. **banner-4.jpg:** Không gian chăm sóc bệnh nhân ấm cúng

## 🎨 Tùy chỉnh Carousel

### Thay đổi số slide:
Mở file `src/FontEnds/Home/Body.jsx` và chỉnh sửa mảng `bannerSlides`:

```javascript
const bannerSlides = [
  {
    title: "Tiêu đề của bạn",
    subtitle: "Mô tả ngắn",
    image: "/src/assets/images/banner-1.jpg",
    background: "linear-gradient(135deg, #E3FFF8 0%, #B8F3E6 100%)"
  },
  // Thêm hoặc xóa slides tại đây
];
```

### Thay đổi tốc độ chuyển slide:
Tìm dòng này trong `Body.jsx`:
```javascript
}, 5000); // Chuyển slide mỗi 5 giây
```
Thay đổi `5000` thành giá trị mong muốn (đơn vị: milliseconds)

### Thay đổi màu nền gradient:
Chỉnh sửa thuộc tính `background` trong mỗi slide:
```javascript
background: "linear-gradient(135deg, #MÀU_BẮT_ĐẦU 0%, #MÀU_KẾT_THÚC 100%)"
```

## 🎯 Icons

### Vị trí sử dụng:
- Header navigation
- Footer
- Service cards
- Feature sections

### Định dạng đề xuất:
- **SVG:** Tốt nhất cho icons (có thể scale, dung lượng nhỏ)
- **PNG:** 64x64px hoặc 128x128px (cho icons cần độ phân giải cao)

### Icons đề xuất cần chuẩn bị:
- `hospital.svg` - Icon bệnh viện/phòng khám
- `doctor.svg` - Icon bác sĩ
- `calendar.svg` - Icon lịch hẹn
- `heart.svg` - Icon tim/sức khỏe
- `microscope.svg` - Icon xét nghiệm
- `stethoscope.svg` - Icon ống nghe
- `ambulance.svg` - Icon xe cứu thương
- `medical-kit.svg` - Icon túi y tế

## 🔧 Cách import và sử dụng

### Import hình ảnh trong React component:
```javascript
import bannerImage from '../../assets/images/banner-1.jpg';

// Sử dụng:
<img src={bannerImage} alt="Banner" />
```

### Import icon SVG:
```javascript
import HospitalIcon from '../../assets/icons/hospital.svg';

// Sử dụng:
<img src={HospitalIcon} alt="Hospital" className="icon" />
```

## 📝 Lưu ý quan trọng

1. **Tối ưu hình ảnh trước khi upload:**
   - Sử dụng công cụ như TinyPNG, ImageOptim
   - Nén giảm dung lượng mà không làm mất chất lượng

2. **Đặt tên file:**
   - Sử dụng chữ thường
   - Không dấu, không khoảng trắng
   - Sử dụng dấu gạch ngang `-` thay vì khoảng trắng

3. **Bản quyền:**
   - Đảm bảo có quyền sử dụng hình ảnh
   - Nguồn miễn phí: Unsplash, Pexels, Freepik

4. **Responsive:**
   - Hình ảnh sẽ tự động điều chỉnh kích thước
   - Kiểm tra hiển thị trên mobile/tablet

## 🌐 Nguồn hình ảnh y tế miễn phí

- **Unsplash:** https://unsplash.com/s/photos/hospital
- **Pexels:** https://www.pexels.com/search/medical/
- **Freepik:** https://www.freepik.com/search?format=search&query=healthcare
- **Pixabay:** https://pixabay.com/images/search/doctor/

## 💡 Tips

1. Chọn hình ảnh có màu sắc hài hòa với gradient background
2. Đảm bảo text trên banner dễ đọc (contrast tốt)
3. Sử dụng hình ảnh chất lượng cao để tạo ấn tượng chuyên nghiệp
4. Nếu không có hình ảnh, carousel vẫn hoạt động với gradient backgrounds

## 🚀 Bắt đầu

1. Tải hình ảnh của bạn vào `src/assets/images/`
2. Đặt tên theo format: `banner-1.jpg`, `banner-2.jpg`, etc.
3. Reload lại trang web
4. Carousel sẽ tự động hiển thị hình ảnh!

**Lưu ý:** Hiện tại carousel đang sử dụng gradient backgrounds làm placeholder. Khi bạn thêm hình ảnh vào, bạn có thể sử dụng hình ảnh thay vì gradient bằng cách thêm:

```javascript
backgroundImage: `url(${slide.image})`
```

vào style của `.carouselSlide`.

