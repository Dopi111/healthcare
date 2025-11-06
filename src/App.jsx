import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './FontEnds/Home/Header';
import Body from './FontEnds/Home/Body';
import Footer from './FontEnds/Home/Footer';
import DashBoard from './FontEnds/Admin/DashBoard';
import Login_E from './FontEnds/Admin/auth/Login_E';
import ChuyenKhoa from './FontEnds/ChuyenKhoa/ChuyenKhoa';
import ChuyenGia from './FontEnds/ChuyenGia/ChuyenGia';
import DichVu from './FontEnds/DichVu/DichVu';
import DatLichHen from './FontEnds/DatLichHen/DatLichHen';
import NoiKhoa from './FontEnds/ChuyenKhoa/NoiKhoa/NoiKhoa';
import TaiMuiHong from './FontEnds/ChuyenKhoa/TaiMuiHong/TaiMuiHong';
import MaySieuAm5D from './FontEnds/ThietBi/MaySieuAm5D';
import MayXetNghiemSinhHoa from './FontEnds/ThietBi/MayXetNghiemSinhHoa';
import MayNoiSoiTaiMuiHong from './FontEnds/ThietBi/MayNoiSoiTaiMuiHong';
import HeThongXQuangKyThuatSo from './FontEnds/ThietBi/HeThongXQuangKyThuatSo';
import XetNghiemSinhHoa from './FontEnds/ChuyenKhoa/XetNghiemSinhHoa/XetNghiemSinhHoa';
import ChanDoanHinhAnh from './FontEnds/ChuyenKhoa/ChanDoanHinhAnh/ChanDoanHinhAnh';
import ChamSocTaiNha from './FontEnds/DichVu/ChamSocTaiNha/ChamSocTaiNha';
import KhamTongQuat from './FontEnds/DichVu/KhamTongQuat/KhamTongQuat';
import TuVanDinhDuong from './FontEnds/DichVu/TuVanDinhDuong/TuVanDinhDuong';
import XetNghiemTaiNha from './FontEnds/DichVu/XetNghiem/XetNghiemTaiNha';
import PhucHoiChucNang from './FontEnds/DichVu/PhucHoiChucNang/PhucHoiChucNang';
import KhamBenhTrucTuyen from './FontEnds/DichVu/KhamBenhTrucTuyen/KhamBenhTrucTuyen';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/*Trang Home: Hiển thị Header + Body + Footer */}
        <Route path="/" element={<><Header /><Body /><Footer /></>} />

        {/* Trang Đặt Lịch Hẹn */}
        <Route path="/dat-lich-hen" element={<DatLichHen />} />

        {/* Trang Chuyên Khoa */}
        <Route path="/chuyen-khoa" element={<ChuyenKhoa />} />

        {/* Trang Chuyên Gia */}
        <Route path="/chuyen-gia" element={<ChuyenGia />} />

        {/* Trang Dịch Vụ */}
        <Route path="/dich-vu" element={<DichVu />} />
        {/* Trang nội khoa */}
        <Route path="/noi-khoa" element={<NoiKhoa />} />
        {/* Trang tai mũi hng */}
        <Route path="/tai-mui-hong" element={<TaiMuiHong />} />
        {/* Trang chẩn đoán hình ảnh */}
        <Route path="/chan-doan-hinh-anh" element={<ChanDoanHinhAnh />} />
        {/* Trang xét nghiệm sinh hóa */}
        <Route path="/xet-nghiem-sinh-hoa" element={<XetNghiemSinhHoa />} />
ọ
        {/* Trang máy siêu âm */}
        <Route path="/may-sieu-am-5d" element={<MaySieuAm5D />} />
        {/* Trang máy xét nghiệm sinh hóa */}
        <Route path="/may-xet-nghiem-sinh-hoa" element={<MayXetNghiemSinhHoa />} />
        {/* Trang máy nội soi tai mũi họng */}
        <Route path="/may-noi-soi-tai-mui-hong" element={<MayNoiSoiTaiMuiHong />} />
        {/* Trang hệ thống X-quang kỹ thuật số */}
        <Route path="/he-thong-xquang-ky-thuat-so" element={<HeThongXQuangKyThuatSo />} />

        {/* Các trang dịch vụ */}
        <Route path="/cham-soc-tai-nha" element={<ChamSocTaiNha />} />
        <Route path="/kham-suc-khoe-tong-quat" element={<KhamTongQuat />} />
        <Route path="/tu-van-dinh-duong" element={<TuVanDinhDuong />} />
        <Route path="/xet-nghiem-tai-nha" element={<XetNghiemTaiNha />} />
        <Route path="/phuc-hoi-chuc-nang" element={<PhucHoiChucNang />} />
        <Route path="/kham-benh-truc-tuyen" element={<KhamBenhTrucTuyen />} />

        {/*Trang Admin riêng */}
        <Route path="/Admin" element={<Navigate to="/Admin/Login" replace />} />
        <Route path='/Admin/Login' element={<Login_E/>}/>  
        <Route path='/Admin/Dashboard' element={<DashBoard />}/> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
