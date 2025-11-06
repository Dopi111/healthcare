import { useState, useEffect } from 'react';
import { staffAPI } from '../../../services/api';
import { Button, Input, Select, Alert, Card } from '../../../components/common';

const Them_NV = ({ setContext, role = 'doctor', staffData = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const isEdit = !!staffData;

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: 'male',
    address: '',
    citizen_id: '',
    role: role,
    specialization: '',
    department: '',
    license_number: '',
    education: '',
    experience_years: '',
    hire_date: '',
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (staffData) {
      setFormData({
        ...staffData,
        date_of_birth: staffData.date_of_birth?.split('T')[0] || '',
        hire_date: staffData.hire_date?.split('T')[0] || '',
      });
    }
  }, [staffData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) newErrors.full_name = 'Họ tên là bắt buộc';
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc';
    if (formData.phone && !/^(0|\+84)(\d{9,10})$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (formData.role === 'doctor' && !formData.specialization.trim()) {
      newErrors.specialization = 'Chuyên khoa là bắt buộc cho bác sĩ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setError('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = isEdit
        ? await staffAPI.update(staffData.id, formData)
        : await staffAPI.create(formData);

      if (response.success) {
        setSuccess(isEdit ? 'Cập nhật nhân viên thành công!' : 'Thêm nhân viên thành công!');
        setTimeout(() => {
          const listView = formData.role === 'doctor' ? 'Danh sách Bác sĩ'
                         : formData.role === 'nurse' ? 'Danh sách Y tá'
                         : 'Danh sách KTV';
          setContext(listView);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = () => {
    switch (formData.role) {
      case 'doctor': return 'Bác Sĩ';
      case 'nurse': return 'Y Tá';
      case 'technician': return 'Kỹ Thuật Viên';
      default: return 'Nhân Viên';
    }
  };

  const getBackView = () => {
    switch (formData.role) {
      case 'doctor': return 'Danh sách Bác sĩ';
      case 'nurse': return 'Danh sách Y tá';
      case 'technician': return 'Danh sách KTV';
      default: return 'Danh sách Bác sĩ';
    }
  };

  return (
    <div className="px-4 py-3">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 bg-white mb-3 px-4 py-3 rounded-lg shadow-sm">
        <span
          className="cursor-pointer hover:text-[#45C3D2]"
          onClick={() => setContext(getBackView())}
        >
          Quản lý Nhân Viên
        </span>
        <span className="mx-2">›</span>
        <span>{isEdit ? `Sửa ${getRoleName()}` : `Thêm ${getRoleName()} mới`}</span>
      </div>

      {/* Header */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isEdit ? `Sửa ${getRoleName()}` : `Thêm ${getRoleName()} Mới`}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Điền đầy đủ thông tin nhân viên</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setContext(getBackView())}
          >
            Quay lại Danh sách
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
      {success && <Alert type="success" message={success} className="mb-4" />}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <Card title="Thông Tin Cá Nhân" className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Họ và Tên"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                required
                error={errors.full_name}
              />
            </div>
            <div>
              <Input
                label="Ngày Sinh"
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Select
                label="Giới Tính"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: 'male', label: 'Nam' },
                  { value: 'female', label: 'Nữ' },
                  { value: 'other', label: 'Khác' },
                ]}
              />
            </div>
            <div>
              <Input
                label="Số Điện Thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0901234567"
                required
                error={errors.phone}
              />
            </div>
            <div>
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@healthcare.com"
                error={errors.email}
              />
            </div>
          </div>

          <div className="mt-4">
            <Input
              label="Địa chỉ"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/TP"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Input
                label="Số CCCD"
                name="citizen_id"
                value={formData.citizen_id}
                onChange={handleChange}
                placeholder="001234567890"
              />
            </div>
            <div>
              <Input
                label="Ngày Vào Làm"
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
              />
            </div>
          </div>
        </Card>

        {/* Professional Information */}
        <Card title="Thông Tin Nghề Nghiệp" className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Vị Trí"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={[
                  { value: 'doctor', label: 'Bác Sĩ' },
                  { value: 'nurse', label: 'Y Tá' },
                  { value: 'technician', label: 'Kỹ Thuật Viên' },
                  { value: 'receptionist', label: 'Lễ Tân' },
                  { value: 'accountant', label: 'Kế Toán' },
                ]}
                required
              />
            </div>
            <div>
              <Input
                label={formData.role === 'doctor' ? 'Chuyên Khoa' : 'Chuyên Môn'}
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder={formData.role === 'doctor' ? 'Tim mạch, Da liễu, ...' : 'Chuyên môn'}
                required={formData.role === 'doctor'}
                error={errors.specialization}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Input
                label="Khoa/Phòng"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Khoa Nội, Khoa Ngoại, ..."
              />
            </div>
            <div>
              <Input
                label="Số Chứng Chỉ Hành Nghề"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                placeholder="CC123456"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Input
                label="Trình Độ Học Vấn"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Đại học Y, Thạc sĩ Y khoa, ..."
              />
            </div>
            <div>
              <Input
                label="Số Năm Kinh Nghiệm"
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                placeholder="5"
                min="0"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 text-[#45C3D2] focus:ring-[#45C3D2] border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Đang làm việc
            </label>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setContext(getBackView())}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {isEdit ? 'Cập Nhật' : 'Lưu Thông Tin'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Them_NV;
