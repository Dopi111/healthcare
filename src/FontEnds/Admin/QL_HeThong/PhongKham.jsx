const PhongKham = ({ setContext}) => {

    const chiNhanh = {
        ten: 'Phòng Khám Chi Nhánh 1',
        diaChi: '123 Đường A, Quận 1, TP.HCM',
        ngayThanhLap: '01/01/2020',
        dichVu: ['Khám tổng quát', 'Nha khoa', 'Da liễu'],
        soLuongBacSi: 15,
    };
    
    const settings = {
        gioMoCua: '08:00',
        gioDongCua: '20:00',
        nghiChuNhat: true,
    };

    return (
        <div className="p-4 bg-[#f5f5f5] h-full">
            
            {/* Breadcrumb */}
            <div className="text-[10px] text-gray-900 bg-white mb-4 mt-1 px-4 py-2 rounded-md">
                <span 
                    className="cursor-pointer text-gray-600 hover:text-gray-900" 
                    // onClick={() => setContext("Quản lý Hệ thống PK")} // Quay về trang danh sách
                >
                    Quản lý Hệ thống PK
                </span>
                &nbsp;&gt;&nbsp; {chiNhanh.ten}
            </div>

            <h1 className="text-2xl font-bold mb-4 text-gray-800">Quản lý Chi tiết: {chiNhanh.ten}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* CỘT 1: Thông tin cơ bản */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-3 border-b pb-2">Thông tin Cơ bản</h3>
                    <p><strong>Ngày thành lập:</strong> {chiNhanh.ngayThanhLap}</p>
                    <p><strong>Địa chỉ:</strong> {chiNhanh.diaChi}</p>
                    <p><strong>SL Bác sĩ:</strong> {chiNhanh.soLuongBacSi}</p>
                    <div className="mt-4">
                        <ActionButton className="bg-gray-400 hover:bg-gray-500">Sửa thông tin</ActionButton>
                    </div>
                </div>

                {/* CỘT 2: Cài đặt Giờ làm việc */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-3 border-b pb-2">Cài đặt Giờ làm việc</h3>
                    <p><strong>Giờ mở cửa:</strong> {settings.gioMoCua}</p>
                    <p><strong>Giờ đóng cửa:</strong> {settings.gioDongCua}</p>
                    <p><strong>Nghỉ Chủ nhật:</strong> {settings.nghiChuNhat ? 'Có' : 'Không'}</p>
                    <div className="mt-4">
                        <ActionButton>Cập nhật giờ</ActionButton>
                    </div>
                </div>

                {/* CỘT 3: Quản lý Phòng ban/Dịch vụ */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-3 border-b pb-2">Dịch vụ & Phòng ban</h3>
                    <p><strong>Dịch vụ hiện có:</strong></p>
                    <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                        {chiNhanh.dichVu.map(d => <li key={d}>{d}</li>)}
                    </ul>
                    <div className="mt-4">
                        <ActionButton>Quản lý Dịch vụ</ActionButton>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default PhongKham;