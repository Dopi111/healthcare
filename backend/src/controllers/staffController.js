import { query } from '../config/database.js';
import {
  hashPassword,
  calculateAge,
  getPagination,
  buildPaginationResponse,
  successResponse,
  errorResponse
} from '../utils/helpers.js';

// Get all staff with filters
export const getAllStaff = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      staff_type = '',
      status = '',
      department_id = '',
    } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    // Build query conditions
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(s.full_name ILIKE $${paramIndex} OR s.phone ILIKE $${paramIndex} OR s.citizen_id ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (staff_type) {
      conditions.push(`s.staff_type = $${paramIndex}`);
      params.push(staff_type);
      paramIndex++;
    }

    if (status) {
      conditions.push(`s.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (department_id) {
      conditions.push(`s.department_id = $${paramIndex}`);
      params.push(department_id);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total
    const countResult = await query(
      `SELECT COUNT(*) FROM staff s ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get staff
    const staffParams = [...params, queryLimit, offset];
    const result = await query(
      `SELECT s.*, u.email, u.is_active, d.name as department_name
       FROM staff s
       LEFT JOIN users u ON s.user_id = u.id
       LEFT JOIN departments d ON s.department_id = d.id
       ${whereClause}
       ORDER BY s.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      staffParams
    );

    const staffWithAge = result.rows.map(staff => ({
      ...staff,
      age: calculateAge(staff.date_of_birth),
    }));

    return successResponse(
      res,
      buildPaginationResponse(staffWithAge, total, page, limit),
      'Lấy danh sách nhân viên thành công'
    );
  } catch (error) {
    console.error('Get staff error:', error);
    return errorResponse(res, 'Lỗi lấy danh sách nhân viên', 500, error.message);
  }
};

// Get staff by ID
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT s.*, u.email, u.username, u.is_active, d.name as department_name
       FROM staff s
       LEFT JOIN users u ON s.user_id = u.id
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy nhân viên', 404);
    }

    const staff = {
      ...result.rows[0],
      age: calculateAge(result.rows[0].date_of_birth),
    };

    return successResponse(res, staff, 'Lấy thông tin nhân viên thành công');
  } catch (error) {
    console.error('Get staff error:', error);
    return errorResponse(res, 'Lỗi lấy thông tin nhân viên', 500, error.message);
  }
};

// Create new staff
export const createStaff = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      full_name,
      phone,
      address,
      date_of_birth,
      gender,
      citizen_id,
      staff_type,
      specialization,
      license_number,
      department_id,
      salary,
      hire_date,
      status = 'active',
    } = req.body;

    // Check if email or username exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return errorResponse(res, 'Email hoặc tên đăng nhập đã tồn tại', 400);
    }

    // Check if phone or citizen_id exists
    const existingStaff = await query(
      'SELECT id FROM staff WHERE phone = $1 OR (citizen_id = $2 AND citizen_id IS NOT NULL)',
      [phone, citizen_id]
    );

    if (existingStaff.rows.length > 0) {
      return errorResponse(res, 'Số điện thoại hoặc CCCD đã tồn tại', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user account
    const userResult = await query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [username, email, hashedPassword, staff_type]
    );

    const userId = userResult.rows[0].id;

    // Create staff record
    const staffResult = await query(
      `INSERT INTO staff (
        user_id, full_name, phone, address, date_of_birth, gender,
        citizen_id, staff_type, specialization, license_number,
        department_id, salary, hire_date, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        userId, full_name, phone, address, date_of_birth, gender,
        citizen_id, staff_type, specialization, license_number,
        department_id, salary, hire_date, status,
      ]
    );

    const staff = {
      ...staffResult.rows[0],
      email,
      username,
      age: calculateAge(staffResult.rows[0].date_of_birth),
    };

    return successResponse(res, staff, 'Thêm nhân viên thành công', 201);
  } catch (error) {
    console.error('Create staff error:', error);
    return errorResponse(res, 'Lỗi thêm nhân viên', 500, error.message);
  }
};

// Update staff
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      full_name,
      phone,
      address,
      date_of_birth,
      gender,
      citizen_id,
      specialization,
      license_number,
      department_id,
      salary,
      hire_date,
      status,
    } = req.body;

    // Check if staff exists
    const existing = await query('SELECT id FROM staff WHERE id = $1', [id]);

    if (existing.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy nhân viên', 404);
    }

    // Check if phone or citizen_id already used by another staff
    const duplicate = await query(
      'SELECT id FROM staff WHERE (phone = $1 OR (citizen_id = $2 AND citizen_id IS NOT NULL)) AND id != $3',
      [phone, citizen_id, id]
    );

    if (duplicate.rows.length > 0) {
      return errorResponse(res, 'Số điện thoại hoặc CCCD đã được sử dụng', 400);
    }

    // Update staff
    const result = await query(
      `UPDATE staff SET
        full_name = $1, phone = $2, address = $3, date_of_birth = $4,
        gender = $5, citizen_id = $6, specialization = $7,
        license_number = $8, department_id = $9, salary = $10,
        hire_date = $11, status = $12, updated_at = CURRENT_TIMESTAMP
       WHERE id = $13
       RETURNING *`,
      [
        full_name, phone, address, date_of_birth, gender, citizen_id,
        specialization, license_number, department_id, salary,
        hire_date, status, id,
      ]
    );

    const staff = {
      ...result.rows[0],
      age: calculateAge(result.rows[0].date_of_birth),
    };

    return successResponse(res, staff, 'Cập nhật nhân viên thành công');
  } catch (error) {
    console.error('Update staff error:', error);
    return errorResponse(res, 'Lỗi cập nhật nhân viên', 500, error.message);
  }
};

// Delete staff
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    // Get user_id before deleting
    const staffResult = await query('SELECT user_id FROM staff WHERE id = $1', [id]);

    if (staffResult.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy nhân viên', 404);
    }

    const userId = staffResult.rows[0].user_id;

    // Delete staff (cascade will handle related records)
    await query('DELETE FROM staff WHERE id = $1', [id]);

    // Delete user account
    await query('DELETE FROM users WHERE id = $1', [userId]);

    return successResponse(res, null, 'Xóa nhân viên thành công');
  } catch (error) {
    console.error('Delete staff error:', error);
    return errorResponse(res, 'Lỗi xóa nhân viên', 500, error.message);
  }
};

// Get doctors
export const getDoctors = async (req, res) => {
  try {
    req.query.staff_type = 'doctor';
    return getAllStaff(req, res);
  } catch (error) {
    console.error('Get doctors error:', error);
    return errorResponse(res, 'Lỗi lấy danh sách bác sĩ', 500, error.message);
  }
};

// Get nurses
export const getNurses = async (req, res) => {
  try {
    req.query.staff_type = 'nurse';
    return getAllStaff(req, res);
  } catch (error) {
    console.error('Get nurses error:', error);
    return errorResponse(res, 'Lỗi lấy danh sách y tá', 500, error.message);
  }
};

// Get technicians
export const getTechnicians = async (req, res) => {
  try {
    req.query.staff_type = 'technician';
    return getAllStaff(req, res);
  } catch (error) {
    console.error('Get technicians error:', error);
    return errorResponse(res, 'Lỗi lấy danh sách kỹ thuật viên', 500, error.message);
  }
};

// Get staff schedule
export const getStaffSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date } = req.query;

    let dateCondition = '';
    const params = [id];

    if (start_date && end_date) {
      dateCondition = 'AND work_date BETWEEN $2 AND $3';
      params.push(start_date, end_date);
    } else if (start_date) {
      dateCondition = 'AND work_date >= $2';
      params.push(start_date);
    }

    const result = await query(
      `SELECT ss.*, c.room_number, c.room_name
       FROM staff_schedule ss
       LEFT JOIN clinics c ON ss.clinic_id = c.id
       WHERE ss.staff_id = $1 ${dateCondition}
       ORDER BY ss.work_date, ss.start_time`,
      params
    );

    return successResponse(res, result.rows, 'Lấy lịch làm việc thành công');
  } catch (error) {
    console.error('Get staff schedule error:', error);
    return errorResponse(res, 'Lỗi lấy lịch làm việc', 500, error.message);
  }
};

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const result = await query(
      `SELECT d.*, s.full_name as head_doctor_name
       FROM departments d
       LEFT JOIN users u ON d.head_doctor_id = u.id
       LEFT JOIN staff s ON s.user_id = u.id
       ORDER BY d.name`
    );

    return successResponse(res, result.rows, 'Lấy danh sách khoa thành công');
  } catch (error) {
    console.error('Get departments error:', error);
    return errorResponse(res, 'Lỗi lấy danh sách khoa', 500, error.message);
  }
};
