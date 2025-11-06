import { useState, useEffect } from 'react';
import { patientsAPI, appointmentsAPI, staffAPI } from '../../../services/api';
import { Card, LoadingSpinner, Badge } from '../../../components/common';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalStaff: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    completedToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentPatients, setRecentPatients] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch counts
      const [patientsRes, appointmentsRes, staffRes] = await Promise.all([
        patientsAPI.getAll({ limit: 5 }),
        appointmentsAPI.getAll({ limit: 10 }),
        staffAPI.getAll({ limit: 1 }),
      ]);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const appointments = appointmentsRes.data?.data || [];

      setStats({
        totalPatients: patientsRes.data?.pagination?.total || 0,
        totalAppointments: appointmentsRes.data?.pagination?.total || 0,
        totalStaff: staffRes.data?.pagination?.total || 0,
        pendingAppointments: appointments.filter(a => a.status === 'pending').length,
        todayAppointments: appointments.filter(a => a.appointment_date === today).length,
        completedToday: appointments.filter(a => a.appointment_date === today && a.status === 'completed').length,
      });

      setRecentPatients(patientsRes.data?.data || []);
      setTodayAppointments(appointments.filter(a => a.appointment_date === today) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, color = 'blue', icon }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="text-4xl opacity-20">{icon}</div>}
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner className="py-20" />;
  }

  return (
    <div className="px-4 py-3">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Tổng quan hệ thống quản lý phòng khám</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Tổng Bệnh Nhân"
          value={stats.totalPatients}
          subtitle="Đã đăng ký"
          color="#45C3D2"
          icon="👥"
        />
        <StatCard
          title="Lịch Hẹn Hôm Nay"
          value={stats.todayAppointments}
          subtitle={`${stats.completedToday} đã hoàn thành`}
          color="#FFC419"
          icon="📅"
        />
        <StatCard
          title="Chờ Khám"
          value={stats.pendingAppointments}
          subtitle="Lịch hẹn đang chờ"
          color="#F97316"
          icon="⏰"
        />
        <StatCard
          title="Nhân Viên"
          value={stats.totalStaff}
          subtitle="Bác sĩ, Y tá, KTV"
          color="#10B981"
          icon="👨‍⚕️"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card title="Bệnh Nhân Mới Nhất" className="h-fit">
          {recentPatients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có bệnh nhân nào
            </div>
          ) : (
            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#45C3D2] to-[#3ab0c0] rounded-full flex items-center justify-center text-white font-semibold">
                      {patient.full_name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{patient.full_name}</p>
                      <p className="text-sm text-gray-500">{patient.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{patient.patient_code}</p>
                    {patient.age && <p className="text-xs text-gray-400">{patient.age} tuổi</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Today's Appointments */}
        <Card title="Lịch Hẹn Hôm Nay" className="h-fit">
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có lịch hẹn nào hôm nay
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-800">{appointment.patient_name}</p>
                      <Badge
                        variant={
                          appointment.status === 'completed' ? 'success' :
                          appointment.status === 'confirmed' ? 'info' :
                          appointment.status === 'cancelled' ? 'danger' :
                          'warning'
                        }
                      >
                        {appointment.status === 'pending' && 'Chờ khám'}
                        {appointment.status === 'confirmed' && 'Đã xác nhận'}
                        {appointment.status === 'completed' && 'Hoàn thành'}
                        {appointment.status === 'cancelled' && 'Đã hủy'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{appointment.reason || 'Khám bệnh'}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      BS: {appointment.doctor_name || 'Chưa phân'}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-[#45C3D2]">
                      {appointment.appointment_time?.substring(0, 5)}
                    </p>
                    <p className="text-xs text-gray-500">{appointment.room_number || 'TBA'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Thao Tác Nhanh" className="mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg hover:shadow-md transition text-center">
            <div className="text-2xl mb-2">👤</div>
            <p className="text-sm font-medium text-gray-700">Thêm Bệnh Nhân</p>
          </button>
          <button className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg hover:shadow-md transition text-center">
            <div className="text-2xl mb-2">📅</div>
            <p className="text-sm font-medium text-gray-700">Đặt Lịch Hẹn</p>
          </button>
          <button className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition text-center">
            <div className="text-2xl mb-2">👨‍⚕️</div>
            <p className="text-sm font-medium text-gray-700">Quản Lý Nhân Viên</p>
          </button>
          <button className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition text-center">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-sm font-medium text-gray-700">Doanh Thu</p>
          </button>
        </div>
      </Card>

      {/* System Status */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <p className="text-sm font-medium text-gray-700">Hệ thống hoạt động bình thường</p>
            <p className="text-xs text-gray-500">
              Tất cả dịch vụ đang online • Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
