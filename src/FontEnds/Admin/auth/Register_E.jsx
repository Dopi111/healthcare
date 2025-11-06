
const Inputs = (props) => (
  <input 
    {...props} // Truyền tất cả các props (type, name, id, placeholder, className, etc.)
    className={` border-[1px] border-gray-300 rounded-md font-normal px-2 py-1 focus:border-[#e6b800] focus:ring-[#e6b800] transition
      ${props.disabled 
        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300' // Style khi disabled
        : 'border-[1px] border-gray-300 rounded-md font-normal px-2 py-1 focus:border-[#e6b800] focus:ring-[#e6b800] transition' // Style khi active
      } ${props.className}`}
  />
);
const Signin_E = () => {
  return (
    <div className="p-4 ">
      <form className="mb-8">
        {/* THÔNG TIN CÁ NHÂN */}
        <div>
          <h2>Thông tin cá nhân</h2>
          <div className="w-full flex gap-4 mb-4">
            <div className="w-2/3">
              <h6>Họ và Tên</h6>
              <Inputs className="w-full" type="text"/>
            </div>
            <div className="w-1/3">
              <h6>Ngày sinh</h6>
              <Inputs className="w-full" type="date"/>
            </div>
            <div className="w-1/3">
              <h6>Số điện thoại</h6>
              <Inputs className="w-full" type="number"/>
            </div>
          </div>
          
          <div className="w-full flex gap-4">
            <div className="w-1/2">
              <h6>Mật khẩu</h6>
              <Inputs className="w-full" type="text"/>
            </div>
            <div className="w-1/2">
              <h6>Nhập lại mật khẩu</h6>
              <Inputs className="w-full" type="text"/>
            </div>
          </div>
        </div>

        {/* THÔNG TIN NHÂN VIÊN */}
        <div>
          <h2 className="mt-8">Thông tin nhân viên</h2>
          <div>
            <h6>Chức vụ</h6>
            <select className="border-[1px] border-gray-300 rounded-md font-normal px-2 py-1 focus:border-[#e6b800] focus:ring-[#e6b800] transition w-[300px]">
              <option>-- Chọn chức vụ --</option>
              <option>Quản lý</option>
              <option>Lễ tân</option>
              <option>Bác sĩ</option>
              <option>Y tá</option>
              <option>Nhân viên xét nghiệm</option>
              <option>Nhân viên khác</option>
            </select>
            
          </div>
        </div>
        <div>
          <button className="bg-[#e6b800] text-white cursor-pointer float-end px-4 py-2 rounded-md mt-8 hover:bg-[#ccac00] transition">Thêm nhân viên</button>
        </div>
      </form>
    </div>
  )
}

export default Signin_E