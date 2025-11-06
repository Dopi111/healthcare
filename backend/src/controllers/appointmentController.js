import { query } from '../config/database.js';
import {
  generateCode,
  getPagination,
  buildPaginationResponse,
  successResponse,
  errorResponse
} from '../utils/helpers.js';

// Get all appointments with filters
export const getAllAppointments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = '',
      patient_id = '',
      doctor_id = '',
      date = '',
      search = '',
    } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    // Build query conditions
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`a.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (patient_id) {
      conditions.push(`a.patient_id = $${paramIndex}`);
      params.push(patient_id);
      paramIndex++;
    }

    if (doctor_id) {
      conditions.push(`a.doctor_id = $${paramIndex}`);
      params.push(doctor_id);
      paramIndex++;
    }

    if (date) {
      conditions.push(`a.appointment_date = $${paramIndex}`);
      params.push(date);
      paramIndex++;
    }

    if (search) {
      conditions.push(`(p.full_name ILIKE $${paramIndex} OR a.appointment_code ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total
    const countResult = await query(
      `SELECT COUNT(*) FROM appointments a
       LEFT JOIN patients p ON a.patient_id = p.id
       ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get appointments
    const appointmentParams = [...params, queryLimit, offset];
    const result = await query(
      `SELECT a.*,
        p.full_name as patient_name, p.phone as patient_phone,
        s.full_name as doctor_name,
        c.room_number, c.room_name,
        u.username as created_by_username
       FROM appointments a
       LEFT JOIN patients p ON a.patient_id = p.id
       LEFT JOIN staff s ON a.doctor_id = s.id
       LEFT JOIN clinics c ON a.clinic_id = c.id
       LEFT JOIN users u ON a.created_by = u.id
       ${whereClause}
       ORDER BY a.appointment_date DESC, a.appointment_time DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      appointmentParams
    );

    return successResponse(
      res,
      buildPaginationResponse(result.rows, total, page, limit),
      'Lấy danh sách lịch hẹn thành công'
    );
  } catch (error) {
    console.error('Get appointments error:', error);
    return errorResponse(res, 'Lỗi lấy danh sách lịch hẹn', 500, error.message);
  }
};

// Get appointments by status (pending/completed)
export const getAppointmentsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    req.query.status = status;
    return getAllAppointments(req, res);
  } catch (error) {
    console.error('Get appointments by status error:', error);
    return errorResponse(res, 'Lỗi lấy danh sách lịch hẹn', 500, error.message);
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT a.*,
        p.full_name as patient_name, p.phone as patient_phone,
        p.date_of_birth, p.gender, p.address, p.insurance_number,
        s.full_name as doctor_name, s.specialization,
        c.room_number, c.room_name,
        u.username as created_by_username
       FROM appointments a
       LEFT JOIN patients p ON a.patient_id = p.id
       LEFT JOIN staff s ON a.doctor_id = s.id
       LEFT JOIN clinics c ON a.clinic_id = c.id
       LEFT JOIN users u ON a.created_by = u.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy lịch hẹn', 404);
    }

    return successResponse(res, result.rows[0], 'Lấy thông tin lịch hẹn thành công');
  } catch (error) {
    console.error('Get appointment error:', error);
    return errorResponse(res, 'Lỗi lấy thông tin lịch hẹn', 500, error.message);
  }
};

// Create new appointment
export const createAppointment = async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      clinic_id,
      appointment_date,
      appointment_time,
      reason,
      symptoms,
      notes,
    } = req.body;

    const createdBy = req.user.id;

    // Check if patient exists
    const patientExists = await query(
      'SELECT id FROM patients WHERE id = $1',
      [patient_id]
    );

    if (patientExists.rows.length === 0) {
      return errorResponse(res, 'Bệnh nhân không tồn tại', 404);
    }

    // Check if doctor exists
    if (doctor_id) {
      const doctorExists = await query(
        'SELECT id FROM staff WHERE id = $1 AND staff_type = $2',
        [doctor_id, 'doctor']
      );

      if (doctorExists.rows.length === 0) {
        return errorResponse(res, 'Bác sĩ không tồn tại', 404);
      }
    }

    // Check if clinic exists
    if (clinic_id) {
      const clinicExists = await query(
        'SELECT id FROM clinics WHERE id = $1',
        [clinic_id]
      );

      if (clinicExists.rows.length === 0) {
        return errorResponse(res, 'Phòng khám không tồn tại', 404);
      }
    }

    // Check for conflicting appointments
    const conflict = await query(
      `SELECT id FROM appointments
       WHERE appointment_date = $1
       AND appointment_time = $2
       AND (doctor_id = $3 OR clinic_id = $4)
       AND status NOT IN ('cancelled', 'no_show')`,
      [appointment_date, appointment_time, doctor_id, clinic_id]
    );

    if (conflict.rows.length > 0) {
      return errorResponse(res, 'Bác sĩ hoặc phòng khám đã có lịch hẹn vào thời gian này', 400);
    }

    // Generate appointment code
    const countResult = await query('SELECT COUNT(*) FROM appointments');
    const count = parseInt(countResult.rows[0].count);
    const appointmentCode = generateCode('APT', count + 1);

    // Create appointment
    const result = await query(
      `INSERT INTO appointments (
        appointment_code, patient_id, doctor_id, clinic_id,
        appointment_date, appointment_time, reason, symptoms,
        notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        appointmentCode, patient_id, doctor_id, clinic_id,
        appointment_date, appointment_time, reason, symptoms,
        notes, createdBy,
      ]
    );

    return successResponse(res, result.rows[0], 'Đăng ký lịch hẹn thành công', 201);
  } catch (error) {
    console.error('Create appointment error:', error);
    return errorResponse(res, 'Lỗi đăng ký lịch hẹn', 500, error.message);
  }
};

// Update appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      patient_id,
      doctor_id,
      clinic_id,
      appointment_date,
      appointment_time,
      reason,
      symptoms,
      status,
      notes,
    } = req.body;

    // Check if appointment exists
    const existing = await query('SELECT id FROM appointments WHERE id = $1', [id]);

    if (existing.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy lịch hẹn', 404);
    }

    // Check for conflicts if time/date changed
    if (appointment_date && appointment_time) {
      const conflict = await query(
        `SELECT id FROM appointments
         WHERE id != $1
         AND appointment_date = $2
         AND appointment_time = $3
         AND (doctor_id = $4 OR clinic_id = $5)
         AND status NOT IN ('cancelled', 'no_show')`,
        [id, appointment_date, appointment_time, doctor_id, clinic_id]
      );

      if (conflict.rows.length > 0) {
        return errorResponse(res, 'Bác sĩ hoặc phòng khám đã có lịch hẹn vào thời gian này', 400);
      }
    }

    // Update appointment
    const result = await query(
      `UPDATE appointments SET
        patient_id = COALESCE($1, patient_id),
        doctor_id = COALESCE($2, doctor_id),
        clinic_id = COALESCE($3, clinic_id),
        appointment_date = COALESCE($4, appointment_date),
        appointment_time = COALESCE($5, appointment_time),
        reason = COALESCE($6, reason),
        symptoms = COALESCE($7, symptoms),
        status = COALESCE($8, status),
        notes = COALESCE($9, notes),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [
        patient_id, doctor_id, clinic_id, appointment_date, appointment_time,
        reason, symptoms, status, notes, id,
      ]
    );

    return successResponse(res, result.rows[0], 'Cập nhật lịch hẹn thành công');
  } catch (error) {
    console.error('Update appointment error:', error);
    return errorResponse(res, 'Lỗi cập nhật lịch hẹn', 500, error.message);
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const result = await query(
      `UPDATE appointments SET
        status = 'cancelled',
        notes = COALESCE($1, notes),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [notes, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy lịch hẹn', 404);
    }

    return successResponse(res, result.rows[0], 'Hủy lịch hẹn thành công');
  } catch (error) {
    console.error('Cancel appointment error:', error);
    return errorResponse(res, 'Lỗi hủy lịch hẹn', 500, error.message);
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM appointments WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy lịch hẹn', 404);
    }

    return successResponse(res, null, 'Xóa lịch hẹn thành công');
  } catch (error) {
    console.error('Delete appointment error:', error);
    return errorResponse(res, 'Lỗi xóa lịch hẹn', 500, error.message);
  }
};
