import React from 'react';
import { useNavigate } from 'react-router-dom'; // Sử dụng để điều hướng sau khi đăng nhập
const Button = ({ children, onClick, type = "button" }) => (
    <button 
        type={type} // Đảm bảo nút này kích hoạt form submit
        onClick={onClick} 
        className="bg-[#FFC419] text-white px-4 py-2 rounded hover:bg-[#e6ac17] transition"
    >
        {children}
    </button>
);

const Login_E = () => {
    const navigate = useNavigate(); // Khởi tạo hook điều hướng
    const handleSubmit = (event) => {
        // NGĂN CHẶN tải lại trang
        event.preventDefault(); 
        
        // LOGIC ĐIỀU HƯỚNG TĨNH SAU KHI "ĐĂNG NHẬP"
        // Trong chế độ tĩnh, bạn chuyển ngay đến Dashboard
        navigate('/Admin/Dashboard', { replace: true });
        
        // Gợi ý: Ở đây, bạn sẽ gọi API đăng nhập thực tế
        // const username = event.target.elements[0].value;
        // console.log("Đã thử đăng nhập với:", username);
    };

  return (
    <div className="p-10 flex items-center justify-center">
        <div className="w-[400px] px-10 py-5 border-[1px] rounded-md ">
            <h2 className="text-xl font-bold mb-6 text-center">Đăng nhập</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium mb-1">Mã nhân viên</label>
                    <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC419]" placeholder="Mã nhân viên" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                    <input type="password" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC419]" placeholder="Nhập mật khẩu" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input type="checkbox" id="remember" className="h-4 w-4 text-[#FFC419] focus:ring-[#FFC419] border mr-2"/>
                        <h6>Nhớ mật khẩu</h6>
                    </div>
                </div>
                <div className="text-center">
                    <Button type="submit">Đăng nhập</Button>
                </div>
                <a href="#" className="text-sm text-[#FFC419] hover:underline float-end">Quên mật khẩu?</a>
            </form>
        </div>
    </div>
  )
}

export default Login_E