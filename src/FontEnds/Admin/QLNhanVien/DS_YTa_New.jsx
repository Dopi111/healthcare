import { useState, useEffect } from 'react';
import { staffAPI } from '../../../services/api';
import { Button, Table, Pagination, Input, Badge, LoadingSpinner, EmptyState, Alert } from '../../../components/common';

const DS_YTa = ({ setContext }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pagination & filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: currentPage,
        limit: 10,
        search,
        role: 'nurse',
        sortBy,
        order: sortOrder,
      };

      const response = await staffAPI.getAll(params);

      if (response.success) {
        setStaff(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách y tá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [currentPage, sortBy, sortOrder]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchStaff();
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa y tá này?')) return;

    try {
      const response = await staffAPI.delete(id);
      if (response.success) {
        setSuccess('Xóa y tá thành công');
        fetchStaff();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Không thể xóa y tá');
    }
  };

  const columns = [
    { key: 'stt', label: 'STT', render: (row, index) => (currentPage - 1) * 10 + index + 1 },
    { key: 'staff_code', label: 'Mã YT' },
    { key: 'full_name', label: 'Họ tên' },
    { key: 'department', label: 'Khoa', render: (row) => row.department || '-' },
    { key: 'phone', label: 'Số điện thoại' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (row) => (
        <Badge variant={row.is_active ? 'success' : 'danger'}>
          {row.is_active ? 'Đang làm việc' : 'Nghỉ việc'}
        </Badge>
      )
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
              setContext({ view: "Sửa NV", staffData: row });
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
        Danh sách Y tá
      </div>

      {/* Header */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Danh sách Y Tá</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý thông tin y tá</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setContext("Danh sách Bác sĩ")}
            >
              Bác Sĩ
            </Button>
            <Button
              variant="outline"
              onClick={() => setContext("Danh sách KTV")}
            >
              Kỹ Thuật Viên
            </Button>
            <Button
              variant="primary"
              onClick={() => setContext({ view: "Thêm NV", role: "nurse" })}
            >
              Thêm Y Tá
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
              placeholder="Tìm theo tên, SĐT, email, mã y tá..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                setCurrentPage(1);
                fetchStaff();
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
          Tìm thấy <span className="font-semibold">{staff.length}</span> y tá
        </div>
        <div className="flex gap-3 items-center">
          <label className="text-sm text-gray-600">Sắp xếp:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#45C3D2] focus:border-transparent"
          >
            <option value="created_at">Ngày thêm</option>
            <option value="full_name">Tên y tá</option>
            <option value="department">Khoa</option>
            <option value="staff_code">Mã y tá</option>
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
        ) : staff.length === 0 ? (
          <EmptyState
            title="Chưa có y tá nào"
            description="Hãy thêm y tá mới để bắt đầu"
            action={
              <Button variant="primary" onClick={() => setContext({ view: "Thêm NV", role: "nurse" })}>
                Thêm Y Tá Đầu Tiên
              </Button>
            }
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={staff}
              onRowClick={(nurse) => {
                console.log('View nurse:', nurse);
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

export default DS_YTa;
