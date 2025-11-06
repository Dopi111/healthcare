import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Button, Input, Alert } from '../../../components/common';

const Login_E = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Navigate based on user role
        navigate('/Admin/Dashboard', { replace: true });
      } else {
        setError(result.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-block bg-[#EDFFFA] text-[#FFC419] text-3xl font-bold px-6 py-3 rounded-lg mb-4">
            HealthCare
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Đăng nhập hệ thống</h2>
          <p className="mt-2 text-sm text-gray-600">
            Nhập thông tin đăng nhập để tiếp tục
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@healthcare.com"
              required
              disabled={loading}
            />

            <Input
              label="Mật khẩu"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#45C3D2] focus:ring-[#45C3D2] border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Nhớ mật khẩu
                </label>
              </div>

              <a href="#" className="text-sm text-[#45C3D2] hover:text-[#3ab0c0]">
                Quên mật khẩu?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 font-semibold mb-2">Tài khoản demo:</p>
            <div className="text-xs space-y-1">
              <p className="text-gray-500">Email: admin@healthcare.com</p>
              <p className="text-gray-500">Mật khẩu: admin123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          © 2024 Healthcare Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login_E;
