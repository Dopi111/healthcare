// QL_HeThong_PK.jsx (Quản lý Danh sách Chi nhánh)

import React from 'react';

// Giả định: Nút hành động chung
const ActionButton = ({ children, onClick, className = "bg-blue-500 hover:bg-blue-600" }) => (
    <button
        className={`px-3 py-1 text-white rounded-md text-sm font-medium transition ${className}`}
        onClick={onClick}
    >
        {children}
    </button>
);

const HeThong = ({ setContext }) => {
    // Dữ liệu mẫu về các chi nhánh/phòng khám
    const danhSachChiNhanh = [
        { id: 'CN01', ten: 'Phòng Khám Chi Nhánh 1', diaChi: '123 Đường A, Quận 1, TP.HCM', trangThai: 'Hoạt động', soBacSi: 15 },
        { id: 'CN02', ten: 'Phòng Khám Chi Nhánh 2', diaChi: '456 Đường B, Quận Cầu Giấy, Hà Nội', trangThai: 'Hoạt động', soBacSi: 10 },
        { id: 'CN03', ten: 'Trung tâm Phục hồi CN3', diaChi: '789 Đường C, Quận Hải Châu, Đà Nẵng', trangThai: 'Tạm dừng', soBacSi: 5 },
    ];

    // Hàm điều hướng đến trang chi tiết của chi nhánh (Context mới)
    const handleViewDetail = (id) => {
        // Chuyển sang context chi tiết, có thể truyền thêm ID nếu cần
        setContext(`ChiTiet_PK_${id}`); 
    };
    
    // Hàm thêm chi nhánh
    const handleAddChiNhanh = () => {
        alert("Mở form thêm chi nhánh mới!");
    };

    return (
        <div className="p-2 bg-[#f5f5f5] h-full">
            
            {/* Breadcrumb */}
            <div className="text-[10px] text-gray-900 bg-white mb-4 px-4 py-2 rounded-md">
                Quản lý Hệ thống PK
            </div>

            {/* Tiêu đề và Nút Thêm mới */}
            <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-md shadow">
                <h1 className="text-xl font-bold text-gray-800">Quản lý các Chi nhánh Phòng khám</h1>
                <ActionButton onClick={handleAddChiNhanh} className="bg-green-600 hover:bg-green-700">
                    ➕ Thêm Chi nhánh
                </ActionButton>
            </div>

            {/* Bảng Danh sách Chi nhánh */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã PK</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Phòng khám</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ chính</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {danhSachChiNhanh.map((cn) => (
                            <tr key={cn.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cn.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer hover:underline"
                                    onClick={() => handleViewDetail(cn.id)}
                                >
                                    {cn.ten}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cn.diaChi}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{cn.soBacSi}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cn.trangThai === 'Hoạt động' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {cn.trangThai}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                    <ActionButton onClick={() => handleViewDetail(cn.id)}>Quản lý</ActionButton>
                                    <ActionButton className="bg-red-500 hover:bg-red-600">Xóa</ActionButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default HeThong;