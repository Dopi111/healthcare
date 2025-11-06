import Login_E from "./Login_E";

const Profile_E = ({ employeeData }) => {
    const defaultData = {
        hoTen: "Nguyễn Thị Bích",
        ngaySinh: "01/01/1990",
        gioiTinh: "Nữ",
        sdt: "0123456789",
        email: "bich.nt@healthcare.vn",
        diaChi: "123 Đường A, Quận B, TP HCM",
        chucVu: "Tiếp Tân (Receptionist)",
        maNV: "NV001",
        ngayVaoLam: "15/10/2022",
        phongBan: "Lễ Tân",
        luongCoBan: "12,000,000 VND"
    };
    const data = employeeData || defaultData;
    
    // Component hiển thị một dòng Tiêu đề | Dữ liệu
    const DetailRow = ({ label, value }) => (
        <div className="flex justify-between py-2 border-b border-gray-100">
            {/* Cột 1: Tiêu đề */}
            <p className="font-medium text-gray-600">{label}:</p>
            {/* Cột 2: Dữ liệu */}
            <p className="text-right font-semibold text-gray-800">{value}</p>
        </div>
    );

    return (
        <div className="p-8 bg-[#f5f5f5] h-full overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân & công việc</h1>
            
            {/* CONTAINER CHÍNH: CHIA THÀNH 2 CỘT LỚN (flex-1 để tận dụng không gian) */}
            <div className="flex gap-8"> 
                
                {/* 1. CỘT LỚN THỨ NHẤT: THÔNG TIN CÁ NHÂN (Chiếm nửa không gian) */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2 text-blue-700">Thông tin Cá nhân</h3>
                    
                    {/* CONTAINER DỮ LIỆU CÁ NHÂN: Xếp chồng các dòng */}
                    <div className="flex flex-col space-y-1">
                        <DetailRow label="Họ và tên" value={data.hoTen} />
                        <DetailRow label="Ngày sinh" value={data.ngaySinh} />
                        <DetailRow label="Giới tính" value={data.gioiTinh} />
                        <DetailRow label="Số điện thoại" value={data.sdt} />
                        <DetailRow label="Email" value={data.email} />
                        <DetailRow label="Địa chỉ" value={data.diaChi} />
                    </div>
                </div>

                {/* 2. CỘT LỚN THỨ HAI: THÔNG TIN NHÂN VIÊN (Chiếm nửa không gian) */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2 text-green-700">Thông tin Nhân viên</h3>
                    
                    {/* CONTAINER DỮ LIỆU NHÂN VIÊN: Xếp chồng các dòng */}
                    <div className="flex flex-col space-y-1">
                        <DetailRow label="Mã Nhân viên" value={data.maNV} />
                        <DetailRow label="Phòng ban" value={data.phongBan} />
                        <DetailRow label="Chức vụ" value={data.chucVu} />
                        <DetailRow label="Ngày vào làm" value={data.ngayVaoLam} />
                        <DetailRow label="Lương cơ bản" value={data.luongCoBan} />
                        <DetailRow label="Tình trạng HĐ" value="Đang hoạt động" />
                    </div>
                    
                    {/* Nút Chỉnh sửa / Đăng xuất */}
                    <div className="mt-8 flex justify-end gap-3">
                        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Chỉnh Sửa</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Đăng Xuất</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile_E;