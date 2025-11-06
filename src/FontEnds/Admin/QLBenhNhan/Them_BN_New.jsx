import { useState } from 'react';
import { patientsAPI } from '../../../services/api';
import { Button, Input, Select, Alert, Card } from '../../../components/common';

const Them_BN = ({ setContext }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: 'male',
    address: '',
    citizen_id: '',
    insurance_number: '',
    emergency_contact: '',
    emergency_phone: '',
    blood_type: '',
    allergies: '',
    medical_history: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const response = await patientsAPI.create(formData);

      if (response.success) {
        setSuccess('Thêm bệnh nhân thành công!');
        setTimeout(() => {
          setContext("Danh sách BN đã khám bệnh");
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi thêm bệnh nhân');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-3">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 bg-white mb-3 px-4 py-3 rounded-lg shadow-sm">
        <span
          className="cursor-pointer hover:text-[#45C3D2]"
          onClick={() => setContext("Danh sách BN đã khám bệnh")}
        >
          Quản lý Bệnh Nhân
        </span>
        <span className="mx-2">›</span>
        <span>Thêm bệnh nhân mới</span>
      </div>

      {/* Header */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Thêm Bệnh Nhân Mới</h2>
            <p className="text-sm text-gray-500 mt-1">Điền đầy đủ thông tin bệnh nhân</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setContext("Danh sách BN đã khám bệnh")}
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
                placeholder="benhnhan@email.com"
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
                label="Số Bảo Hiểm Y Tế"
                name="insurance_number"
                value={formData.insurance_number}
                onChange={handleChange}
                placeholder="BH123456789"
              />
            </div>
          </div>
        </Card>

        {/* Medical Information */}
        <Card title="Thông Tin Y Tế" className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Nhóm Máu"
                name="blood_type"
                value={formData.blood_type}
                onChange={handleChange}
                placeholder="O+, A+, B+, AB+..."
              />
            </div>
            <div>
              <Input
                label="Dị Ứng"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Dị ứng thuốc, thực phẩm..."
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiền Sử Bệnh Án
            </label>
            <textarea
              name="medical_history"
              value={formData.medical_history}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45C3D2] focus:border-transparent"
              placeholder="Mô tả tiền sử bệnh lý..."
            />
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card title="Thông Tin Liên Hệ Khẩn Cấp" className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Người Liên Hệ"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                placeholder="Họ tên người thân"
              />
            </div>
            <div>
              <Input
                label="Số Điện Thoại Liên Hệ"
                name="emergency_phone"
                value={formData.emergency_phone}
                onChange={handleChange}
                placeholder="0912345678"
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setContext("Danh sách BN đã khám bệnh")}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            Lưu Thông Tin
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Them_BN;
