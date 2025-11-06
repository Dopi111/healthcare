
const ButtonPrimary = ({ children, onClick }) => (
    <button 
        className="text-2xl w-[500px] h-[150px] bg-white rounded-md m-8 flex items-center justify-center hover:cursor-pointer hover:bg-[#FFF9E9] active:bg-[#FFC419] active:border-0"
        onClick={onClick}>{children}
    </button>
);

// 💡 Nhận setContext làm prop
const QLBN_Select_QL = ({ setContext }) => {
 return (
    <div className='w-full h-full bg-gray-100 p-4 flex flex-col items-center justify-center'>
        
         <ButtonPrimary 
            //Nhấn vào sẽ thay thế context thành "Thêm Bệnh Nhân"
            onClick={() => setContext("Thêm bệnh nhân mới")}
        >
            Thêm bệnh nhân mới
        </ButtonPrimary>
        
         <ButtonPrimary 
            //Nhấn vào sẽ thay thế context thành "BN Chưa Khám"
            onClick={() => setContext("Danh sách bệnh nhân chưa khám")}
        >
            Danh sách bệnh nhân chưa khám bệnh
        </ButtonPrimary>
        
        <ButtonPrimary 
            //Nhấn vào sẽ thay thế context thành "BN Đã Khám"
            onClick={() => setContext("Danh sách bệnh nhân đã khám")}
        >
            Danh sách bệnh nhân đã khám bệnh
        </ButtonPrimary>
        
    </div> 
 )
}

export default QLBN_Select_QL;