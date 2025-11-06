import { useState } from "react";
import DS_BN_ChuaKham from "./QLBenhNhan/DS_BN_ChuaKham";
import DS_BN from "./QLBenhNhan/DS_BN";
import Them_BN from "./QLBenhNhan/Them_BN";
import DS_BS from "./QL_NhanVien/DS_BS";
import DS_YTa from "./QL_NhanVien/DS_YTa";
import PhongKham from "./QL_HeThong/PhongKham";
import HeThong from "./QL_HeThong/HeThong";
import DS_KTV from "./QL_NhanVien/DS_KTV";
import QL_Quy from "./QL_DoanhThu/QL_Quy";
//ĐĂNG NHẬP/ĐĂNG KÝ
import Login_E from "./auth/Login_E"; 
import Register_E from "./auth/Register_E"; 
import Profile_E from "./auth/Profile_E";

// Class chữ tittle
const TextTittle = ({children}) => (
    <h6 className="text-[12px] text-gray-800 bg-gray-300 w-full py-1.5 px-2 mt-5">{children}</h6>
);
const UserInfoToolbar = ({ userName, role, onClick }) => (
    <div className="flex items-center justify-end h-[45px] bg-white px-6 shadow-md" onClick={onClick}>
        <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded transition">
            {/* Tên và Vai trò */}
            <div className="text-right">
                <span className="block text-sm font-semibold text-gray-800">{userName}</span>
                <span className="block text-xs text-gray-500">{role}</span>
            </div>
            {/* Avatar Placeholder */}
            <div className="w-9 h-9 bg-[#FFC419] rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userName ? userName[0] : 'U'}
            </div>
        </div>
    </div>
);

const renderFullLayout = (props) => (
    <div className="flex h-screen">
        <aside className="h-screen overflow-y-auto w-[200px] bg-white text-white flex flex-col items-start box-border shadow">
            <div className="bg-[#EDFFFA] text-[#FFC419] text-[22px] font-bold mb-5 px-3 py-1.5 rounded-md w-full text-center">HealthCare</div>
            
            {/* DÀNH CHO TIẾP TÂN */}
            <div className="w-full">
                <TextTittle>Quản lý Bệnh Nhân</TextTittle>
                <div className={props.getNavClasses("Thêm BN mới")}
                    onClick={() => props.setContext("Thêm BN mới")}>Thêm BN mới</div>
                     <div className={props.getNavClasses("Danh sách BN đã khám bệnh")}
                    onClick={() => props.setContext("Danh sách BN đã khám bệnh")}>Danh sách BN</div>
                <div className={props.getNavClasses("Danh sách BN chưa khám bệnh")}
                    onClick={() => props.setContext("Danh sách BN chưa khám bệnh")}>Danh sách BN chưa khám bệnh</div>
            </div>

            {/* DÀNH CHO QUẢN LÝ NHÂN VIÊN */}
            <div className="w-full">
                <TextTittle>QL Nhân viên</TextTittle>
                <div className={props.getNavClasses("Quản lý Bác sĩ")}
                    onClick={() => props.setContext("Quản lý Bác sĩ")}>Quản lý Bác sĩ</div>
                <div className={props.getNavClasses("Quản lý Y tá")}
                    onClick={() => props.setContext("Quản lý Y tá")}>Quản lý Y tá</div>
                <div className={props.getNavClasses("Quản lý KTV Y tế")}
                    onClick={() => props.setContext("Quản lý KTV Y tế")}>Quản lý KTV Y tế</div>
            </div>

            {/* DÀNH CHO QUẢN LÝ PHÒNG KHÁM*/}
            <div className="w-full">
                <TextTittle>QL Phòng khám</TextTittle>
                <div className={props.getNavClasses("Quản lý Phòng khám")}
                    onClick={() => props.setContext("Quản lý Phòng khám")}>Quản lý Phòng khám</div>
                <div className={props.getNavClasses("Quản lý Hệ thống PK")}
                    onClick={() => props.setContext("Quản lý Hệ thống PK")}>Quản lý Hệ thống PK</div>
            </div> 

            {/* DÀNH CHO KẾ TOÁN */}
            <div className="w-full">
                <TextTittle>QL Doanh thu</TextTittle>
                <div className={props.getNavClasses("DT Khám & Chữa Bệnh")}
                    onClick={() => props.setContext("DT Khám & Chữa Bệnh")}>DT Khám & Chữa Bệnh</div>
                <div className={props.getNavClasses("Chi Phí HĐ")}
                    onClick={() => props.setContext("Chi Phí HĐ")}>Chi Phí HĐ</div>
                <div className={props.getNavClasses("QL TT Bảo Hiểm")}
                    onClick={() => props.setContext("QL TT Bảo Hiểm")}>QL TT Bảo Hiểm</div>
                <div className={props.getNavClasses("TT Công nợ & Lương")}
                    onClick={() => props.setContext("TT Công nợ & Lương")}>TT Công nợ & Lương</div>
                <div className={props.getNavClasses("QL Quỹ")}
                    onClick={() => props.setContext("QL Quỹ")}>QL Quỹ</div>
            </div>
        </aside>
        
        <div className="flex flex-col flex-1 h-screen"> 
            <UserInfoToolbar 
                userName="Nguyễn Thị Bích" 
                role="Tiếp Tân (Receptionist)" 
                onClick={() => props.setContext("Thông tin Nhân Viên")}
            />
            
            <main className="flex-1 bg-[#f5f5f5] overflow-y-auto">
                {/* PROFILE EMPLOYEE */}
                {props.context === "Thông tin Nhân Viên" && <Profile_E setContext={props.setContext} />}

                {/*Bệnh Nhân */}
                {props.context === "Thêm BN mới" && <Them_BN setContext={props.setContext} />}
                {/*DS bệnh nhân chưa khám */}
                {props.context === "Danh sách BN chưa khám bệnh" && <DS_BN_ChuaKham setContext={props.setContext} />}
                {/*DS bệnh nhân đã khám */}
                {props.context === "Danh sách BN đã khám bệnh" && <DS_BN setContext={props.setContext} />}
                
                {/*QL Bác sĩ */}
                {props.context === "Quản lý Bác sĩ" && <DS_BS setContext={props.setContext} />}
                {/*QL Y Tá */}
                {props.context === "Quản lý Y tá" && <DS_YTa setContext={props.setContext} />}
                {/*QL KTV Y tế */}
                {props.context === "Quản lý KTV Y tế" && <DS_KTV setContext={props.setContext} />}

                {/*QL Phòng Khám */}
                {props.context === "Quản lý Phòng khám" && <PhongKham setContext={props.setContext} />}
                {/*QL Hệ Thống*/}
                {props.context === "Quản lý Hệ thống PK" && <HeThong setContext={props.setContext} />}

                {/* QL DOANH THU */}
                {props.context === "DT Khám & Chữa Bệnh" && <div>DT Khám & Chữa Bệnh</div>}
                {props.context === "Chi Phí HĐ" && <div>Chi Phí HĐ</div>}
                {props.context === "QL TT Bảo Hiểm" && <div>QL TT Bảo Hiểm</div>}
                {props.context === "TT Công nợ & Lương" && <div>TT Công nợ & Lương</div>}
                {props.context === "QL Quỹ" && <QL_Quy setContext={props.setContext} />}
            </main>
        </div>
    </div>
    );

    const renderAuthScreen = (props) => (
        <div className="flex items-center justify-center h-screen bg-[#f5f5f5]">
            {/*HIỂN THỊ COMPONENT ĐĂNG NHẬP HOẶC ĐĂNG KÝ */}
            {props.context === "Đăng nhập" && <Login_E setContext={props.setContext} />}
            {props.context === "Đăng ký" && <Register_E setContext={props.setContext} />}
        </div>
    );

const DashBoard = () => {
    //Mặc định
    const [context, setContext] = useState("Thông tin Nhân Viên");
 
    //Hàm tạo class cho từng mục
    const getNavClasses = (navItem) => {
        // Classes mặc định
        const defaultClasses = "text-[12px] text-black my-1 cursor-pointer px-3 py-2 rounded transition w-full truncate hover:bg-[#FFC419]";
        const activeClasses = "bg-[#FFC419] font-bold text-black"; 
    
            if (context === navItem) {
            return `${defaultClasses} ${activeClasses}`;
        }
            return defaultClasses;
    };

    //ĐỐI TƯỢNG CHỨA CÁC PROPS CẦN
    const dashboardProps = { context, setContext, getNavClasses };
 
    return renderFullLayout(dashboardProps);
};
export default DashBoard;