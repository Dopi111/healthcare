import { query } from '../config/database.js';
import {
  getPagination,
  buildPaginationResponse,
  successResponse,
  errorResponse
} from '../utils/helpers.js';

// Get all clinics
export const getAllClinics = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      is_available = '',
      floor_number = '',
    } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    // Build query conditions
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(room_number ILIKE $${paramIndex} OR room_name ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (is_available !== '') {
      conditions.push(`is_available = $${paramIndex}`);
      params.push(is_available === 'true');
      paramIndex++;
    }

    if (floor_number) {
      conditions.push(`floor_number = $${paramIndex}`);
      params.push(floor_number);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total
    const countResult = await query(
      `SELECT COUNT(*) FROM clinics ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get clinics
    const clinicParams = [...params, queryLimit, offset];
    const result = await query(
      `SELECT c.*, d.name as department_name
       FROM clinics c
       LEFT JOIN departments d ON c.department_id = d.id
       ${whereClause}
       ORDER BY c.floor_number, c.room_number
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      clinicParams
    );

    return successResponse(
      res,
      buildPaginationResponse(result.rows, total, page, limit),
      'Lấy danh sách phòng khám thành công'
    );
  } catch (error) {
    console.error('Get clinics error:', error);
    return errorResponse(res, 'Lỗi lấy danh sách phòng khám', 500, error.message);
  }
};

// Get clinic by ID
export const getClinicById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT c.*, d.name as department_name
       FROM clinics c
       LEFT JOIN departments d ON c.department_id = d.id
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy phòng khám', 404);
    }

    return successResponse(res, result.rows[0], 'Lấy thông tin phòng khám thành công');
  } catch (error) {
    console.error('Get clinic error:', error);
    return errorResponse(res, 'Lỗi lấy thông tin phòng khám', 500, error.message);
  }
};

// Create new clinic
export const createClinic = async (req, res) => {
  try {
    const {
      room_number,
      room_name,
      department_id,
      floor_number,
      capacity,
      equipment,
      is_available = true,
    } = req.body;

    // Check if room number exists
    const existing = await query(
      'SELECT id FROM clinics WHERE room_number = $1',
      [room_number]
    );

    if (existing.rows.length > 0) {
      return errorResponse(res, 'Số phòng đã tồn tại', 400);
    }

    // Create clinic
    const result = await query(
      `INSERT INTO clinics (
        room_number, room_name, department_id, floor_number,
        capacity, equipment, is_available
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [room_number, room_name, department_id, floor_number, capacity, equipment, is_available]
    );

    return successResponse(res, result.rows[0], 'Thêm phòng khám thành công', 201);
  } catch (error) {
    console.error('Create clinic error:', error);
    return errorResponse(res, 'Lỗi thêm phòng khám', 500, error.message);
  }
};

// Update clinic
export const updateClinic = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      room_number,
      room_name,
      department_id,
      floor_number,
      capacity,
      equipment,
      is_available,
    } = req.body;

    // Check if clinic exists
    const existing = await query('SELECT id FROM clinics WHERE id = $1', [id]);

    if (existing.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy phòng khám', 404);
    }

    // Check if room number already used by another clinic
    const duplicate = await query(
      'SELECT id FROM clinics WHERE room_number = $1 AND id != $2',
      [room_number, id]
    );

    if (duplicate.rows.length > 0) {
      return errorResponse(res, 'Số phòng đã được sử dụng', 400);
    }

    // Update clinic
    const result = await query(
      `UPDATE clinics SET
        room_number = $1,
        room_name = $2,
        department_id = $3,
        floor_number = $4,
        capacity = $5,
        equipment = $6,
        is_available = $7,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [room_number, room_name, department_id, floor_number, capacity, equipment, is_available, id]
    );

    return successResponse(res, result.rows[0], 'Cập nhật phòng khám thành công');
  } catch (error) {
    console.error('Update clinic error:', error);
    return errorResponse(res, 'Lỗi cập nhật phòng khám', 500, error.message);
  }
};

// Delete clinic
export const deleteClinic = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if clinic has appointments
    const appointments = await query(
      'SELECT COUNT(*) FROM appointments WHERE clinic_id = $1',
      [id]
    );

    if (parseInt(appointments.rows[0].count) > 0) {
      return errorResponse(
        res,
        'Không thể xóa phòng khám đã có lịch hẹn. Vui lòng xóa lịch hẹn trước.',
        400
      );
    }

    // Delete clinic
    const result = await query(
      'DELETE FROM clinics WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy phòng khám', 404);
    }

    return successResponse(res, null, 'Xóa phòng khám thành công');
  } catch (error) {
    console.error('Delete clinic error:', error);
    return errorResponse(res, 'Lỗi xóa phòng khám', 500, error.message);
  }
};

// Get clinic schedule
export const getClinicSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    let dateCondition = '';
    const params = [id];

    if (date) {
      dateCondition = 'AND a.appointment_date = $2';
      params.push(date);
    }

    const result = await query(
      `SELECT a.*,
        p.full_name as patient_name,
        s.full_name as doctor_name
       FROM appointments a
       LEFT JOIN patients p ON a.patient_id = p.id
       LEFT JOIN staff s ON a.doctor_id = s.id
       WHERE a.clinic_id = $1 ${dateCondition}
       AND a.status NOT IN ('cancelled')
       ORDER BY a.appointment_date, a.appointment_time`,
      params
    );

    return successResponse(res, result.rows, 'Lấy lịch phòng khám thành công');
  } catch (error) {
    console.error('Get clinic schedule error:', error);
    return errorResponse(res, 'Lỗi lấy lịch phòng khám', 500, error.message);
  }
};
