import { useState, useEffect } from 'react';
import { patientsAPI } from '../../../services/api';
import { Button, Table, Pagination, Input, Badge, LoadingSpinner, EmptyState, Alert } from '../../../components/common';

const DS_BN = ({ setContext }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pagination & filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: currentPage,
        limit: 10,
        search,
        sortBy,
        order: sortOrder,
      };

      const response = await patientsAPI.getAll(params);

      if (response.success) {
        setPatients(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách bệnh nhân');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [currentPage, sortBy, sortOrder]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPatients();
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) return;

    try {
      const response = await patientsAPI.delete(id);
      if (response.success) {
        setSuccess('Xóa bệnh nhân thành công');
        fetchPatients();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Không thể xóa bệnh nhân');
    }
  };

  const columns = [
    { key: 'stt', label: 'STT', render: (row, index) => (currentPage - 1) * 10 + index + 1 },
    { key: 'patient_code', label: 'Mã BN' },
    { key: 'full_name', label: 'Họ tên' },
    { key: 'phone', label: 'Số điện thoại' },
    { key: 'email', label: 'Email' },
    {
      key: 'age',
      label: 'Tuổi',
      render: (row) => row.age ? `${row.age} tuổi` : '-'
    },
    {
      key: 'gender',
      label: 'Giới tính',
      render: (row) => {
        const genderMap = { male: 'Nam', female: 'Nữ', other: 'Khác' };
        return genderMap[row.gender] || '-';
      }
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              // Navigate to edit patient
            }}
          >
            Sửa
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 py-3">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 bg-white mb-3 px-4 py-3 rounded-lg shadow-sm">
        Danh sách bệnh nhân
      </div>

      {/* Header */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Danh sách Bệnh Nhân</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý thông tin bệnh nhân</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setContext("Danh sách BN chưa khám bệnh")}
            >
              BN Chưa Khám
            </Button>
            <Button
              variant="primary"
              onClick={() => setContext("Thêm BN mới")}
            >
              Thêm Bệnh Nhân
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 mb-4 rounded-lg shadow-sm">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              label="Tìm kiếm"
              placeholder="Tìm theo tên, SĐT, CCCD, mã bệnh nhân..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="w-48">
            <Input
              label="Ngày đăng ký"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
          <Button variant="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
          {search && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearch('');
                setSearchDate('');
                setCurrentPage(1);
                fetchPatients();
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Sort Options */}
      <div className="bg-white p-3 mb-4 rounded-lg shadow-sm flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Tìm thấy <span className="font-semibold">{patients.length}</span> bệnh nhân
        </div>
        <div className="flex gap-3 items-center">
          <label className="text-sm text-gray-600">Sắp xếp:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#45C3D2] focus:border-transparent"
          >
            <option value="created_at">Ngày đăng ký</option>
            <option value="full_name">Tên bệnh nhân</option>
            <option value="date_of_birth">Ngày sinh</option>
            <option value="patient_code">Mã bệnh nhân</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#45C3D2] focus:border-transparent"
          >
            <option value="DESC">Mới nhất</option>
            <option value="ASC">Cũ nhất</option>
          </select>
        </div>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner className="py-12" />
        ) : patients.length === 0 ? (
          <EmptyState
            title="Chưa có bệnh nhân nào"
            description="Hãy thêm bệnh nhân mới để bắt đầu"
            action={
              <Button variant="primary" onClick={() => setContext("Thêm BN mới")}>
                Thêm Bệnh Nhân Đầu Tiên
              </Button>
            }
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={patients}
              onRowClick={(patient) => {
                // Navigate to patient detail
                console.log('View patient:', patient);
              }}
            />
            <div className="p-4 border-t">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DS_BN;
