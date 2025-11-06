import { useState, useEffect } from 'react';
import { appointmentsAPI, staffAPI } from '../../../services/api';
import { Button, Input, Select, Badge, LoadingSpinner, Alert, Card } from '../../../components/common';

const LichHen_Calendar = ({ setContext }) => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('day'); // day, week

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, [selectedDate, selectedDoctor, selectedStatus]);

  const fetchDoctors = async () => {
    try {
      const response = await staffAPI.getAll({ role: 'doctor', limit: 100 });
      if (response.success) {
        setDoctors(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        date: selectedDate,
        doctor_id: selectedDoctor || undefined,
        status: selectedStatus || undefined,
        limit: 100,
      };

      const response = await appointmentsAPI.getAll(params);

      if (response.success) {
        setAppointments(response.data.data);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await appointmentsAPI.update(id, { status: newStatus });
      if (response.success) {
        setSuccess('Cập nhật trạng thái thành công');
        fetchAppointments();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Không thể cập nhật trạng thái');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 border-blue-400 text-blue-700';
      case 'completed': return 'bg-green-100 border-green-400 text-green-700';
      case 'cancelled': return 'bg-red-100 border-red-400 text-red-700';
      default: return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Chờ khám';
      case 'confirmed': return 'Đã xác nhận';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  // Group appointments by time slots (15-minute intervals from 7:00 to 19:00)
  const timeSlots = [];
  for (let hour = 7; hour < 19; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  const getAppointmentsForSlot = (time) => {
    return appointments.filter(apt => {
      if (!apt.appointment_time) return false;
      const aptTime = apt.appointment_time.substring(0, 5);
      return aptTime === time;
    });
  };

  const changeDate = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  return (
    <div className="px-4 py-3">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Lịch Hẹn Theo Ngày</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý lịch hẹn khám bệnh</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setContext("Danh sách Lịch hẹn")}
            >
              Xem Dạng Bảng
            </Button>
            <Button
              variant="primary"
              onClick={() => setContext("Thêm Lịch hẹn")}
            >
              Đặt Lịch Hẹn
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 mb-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <Input
              label="Ngày khám"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div>
            <Select
              label="Bác sĩ"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              options={[
                { value: '', label: 'Tất cả bác sĩ' },
                ...doctors.map(doc => ({ value: doc.id, label: doc.full_name }))
              ]}
            />
          </div>
          <div>
            <Select
              label="Trạng thái"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'pending', label: 'Chờ khám' },
                { value: 'confirmed', label: 'Đã xác nhận' },
                { value: 'completed', label: 'Hoàn thành' },
                { value: 'cancelled', label: 'Đã hủy' },
              ]}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button variant="outline" onClick={() => changeDate(-1)}>
              ◀ Hôm trước
            </Button>
            <Button variant="outline" onClick={() => changeDate(1)}>
              Hôm sau ▶
            </Button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white p-3 mb-4 rounded-lg shadow-sm flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-gray-600">Chú thích:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span className="text-sm text-gray-600">Chờ khám</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400 rounded"></div>
          <span className="text-sm text-gray-600">Đã xác nhận</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <span className="text-sm text-gray-600">Hoàn thành</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <span className="text-sm text-gray-600">Đã hủy</span>
        </div>
        <div className="ml-auto text-sm text-gray-600">
          Tổng: <span className="font-semibold">{appointments.length}</span> lịch hẹn
        </div>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner className="py-12" />
        ) : (
          <div className="p-4">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-bold text-gray-800">
                {new Date(selectedDate).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Không có lịch hẹn nào trong ngày này</p>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => setContext("Thêm Lịch hẹn")}
                >
                  Đặt Lịch Hẹn
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {timeSlots.map((time) => {
                  const slotAppointments = getAppointmentsForSlot(time);

                  if (slotAppointments.length === 0) return null;

                  return (
                    <div key={time} className="border-l-4 border-gray-300 pl-4 py-2">
                      <div className="flex items-start gap-4">
                        <div className="w-16 text-sm font-semibold text-gray-600 pt-1">
                          {time}
                        </div>
                        <div className="flex-1 space-y-2">
                          {slotAppointments.map((apt) => (
                            <div
                              key={apt.id}
                              className={`border-2 rounded-lg p-3 ${getStatusColor(apt.status)} cursor-pointer hover:shadow-md transition`}
                              onClick={() => {
                                // Navigate to appointment detail
                                console.log('View appointment:', apt);
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold">{apt.patient_name}</h4>
                                    <Badge
                                      variant={
                                        apt.status === 'completed' ? 'success' :
                                        apt.status === 'confirmed' ? 'info' :
                                        apt.status === 'cancelled' ? 'danger' :
                                        'warning'
                                      }
                                    >
                                      {getStatusLabel(apt.status)}
                                    </Badge>
                                  </div>
                                  <p className="text-sm mb-1">
                                    <span className="font-medium">BS:</span> {apt.doctor_name || 'Chưa phân'}
                                  </p>
                                  <p className="text-sm mb-1">
                                    <span className="font-medium">Lý do:</span> {apt.reason || 'Khám bệnh'}
                                  </p>
                                  {apt.notes && (
                                    <p className="text-xs mt-2 italic">Ghi chú: {apt.notes}</p>
                                  )}
                                </div>
                                <div className="flex gap-1 ml-2">
                                  {apt.status === 'pending' && (
                                    <Button
                                      size="sm"
                                      variant="primary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusUpdate(apt.id, 'confirmed');
                                      }}
                                    >
                                      Xác nhận
                                    </Button>
                                  )}
                                  {apt.status === 'confirmed' && (
                                    <Button
                                      size="sm"
                                      variant="success"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusUpdate(apt.id, 'completed');
                                      }}
                                    >
                                      Hoàn thành
                                    </Button>
                                  )}
                                  {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                                    <Button
                                      size="sm"
                                      variant="danger"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Bạn có chắc muốn hủy lịch hẹn này?')) {
                                          handleStatusUpdate(apt.id, 'cancelled');
                                        }
                                      }}
                                    >
                                      Hủy
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LichHen_Calendar;
