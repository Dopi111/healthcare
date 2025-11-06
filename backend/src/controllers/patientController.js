import { query } from '../config/database.js';
import {
  generateCode,
  getPagination,
  buildPaginationResponse,
  calculateAge,
  successResponse,
  errorResponse
} from '../utils/helpers.js';

// Get all patients with pagination and search
export const getAllPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'created_at', order = 'DESC' } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    // Build search query
    let searchCondition = '';
    const queryParams = [];

    if (search) {
      searchCondition = `WHERE (
        full_name ILIKE $1 OR
        phone ILIKE $1 OR
        email ILIKE $1 OR
        patient_code ILIKE $1 OR
        citizen_id ILIKE $1
      )`;
      queryParams.push(`%${search}%`);
    }

    // Count total
    const countResult = await query(
      `SELECT COUNT(*) FROM patients ${searchCondition}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Get patients
    const validSortFields = ['full_name', 'date_of_birth', 'created_at', 'patient_code'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const paramsWithPagination = [...queryParams, queryLimit, offset];
    const paramIndex = queryParams.length + 1;

    const result = await query(
      `SELECT * FROM patients
       ${searchCondition}
       ORDER BY ${sortField} ${sortOrder}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      paramsWithPagination
    );

    const patientsWithAge = result.rows.map(patient => ({
      ...patient,
      age: calculateAge(patient.date_of_birth),
    }));

    return successResponse(
      res,
      buildPaginationResponse(patientsWithAge, total, page, limit),
      'Lấy danh sách bệnh nhân thành công'
    );
  } catch (error) {
    console.error('Get patients error:', error);
    return errorResponse(res, 'Lỗi lấy danh sách bệnh nhân', 500, error.message);
  }
};

// Get patient by ID
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM patients WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy bệnh nhân', 404);
    }

    const patient = {
      ...result.rows[0],
      age: calculateAge(result.rows[0].date_of_birth),
    };

    return successResponse(res, patient, 'Lấy thông tin bệnh nhân thành công');
  } catch (error) {
    console.error('Get patient error:', error);
    return errorResponse(res, 'Lỗi lấy thông tin bệnh nhân', 500, error.message);
  }
};

// Create new patient
export const createPatient = async (req, res) => {
  try {
    const {
      full_name,
      phone,
      email,
      date_of_birth,
      gender,
      address,
      citizen_id,
      insurance_number,
      emergency_contact,
      emergency_phone,
      blood_type,
      allergies,
      medical_history,
    } = req.body;

    // Check if phone or citizen_id already exists
    const existing = await query(
      'SELECT id FROM patients WHERE phone = $1 OR (citizen_id = $2 AND citizen_id IS NOT NULL)',
      [phone, citizen_id]
    );

    if (existing.rows.length > 0) {
      return errorResponse(res, 'Số điện thoại hoặc CCCD đã tồn tại', 400);
    }

    // Generate patient code
    const countResult = await query('SELECT COUNT(*) FROM patients');
    const count = parseInt(countResult.rows[0].count);
    const patientCode = generateCode('BN', count + 1);

    // Insert patient
    const result = await query(
      `INSERT INTO patients (
        patient_code, full_name, phone, email, date_of_birth, gender,
        address, citizen_id, insurance_number, emergency_contact,
        emergency_phone, blood_type, allergies, medical_history
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        patientCode, full_name, phone, email, date_of_birth, gender,
        address, citizen_id, insurance_number, emergency_contact,
        emergency_phone, blood_type, allergies, medical_history,
      ]
    );

    const patient = {
      ...result.rows[0],
      age: calculateAge(result.rows[0].date_of_birth),
    };

    return successResponse(res, patient, 'Thêm bệnh nhân thành công', 201);
  } catch (error) {
    console.error('Create patient error:', error);
    return errorResponse(res, 'Lỗi thêm bệnh nhân', 500, error.message);
  }
};

// Update patient
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      full_name,
      phone,
      email,
      date_of_birth,
      gender,
      address,
      citizen_id,
      insurance_number,
      emergency_contact,
      emergency_phone,
      blood_type,
      allergies,
      medical_history,
    } = req.body;

    // Check if patient exists
    const existing = await query('SELECT id FROM patients WHERE id = $1', [id]);

    if (existing.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy bệnh nhân', 404);
    }

    // Check if phone or citizen_id already used by another patient
    const duplicate = await query(
      'SELECT id FROM patients WHERE (phone = $1 OR (citizen_id = $2 AND citizen_id IS NOT NULL)) AND id != $3',
      [phone, citizen_id, id]
    );

    if (duplicate.rows.length > 0) {
      return errorResponse(res, 'Số điện thoại hoặc CCCD đã được sử dụng', 400);
    }

    // Update patient
    const result = await query(
      `UPDATE patients SET
        full_name = $1, phone = $2, email = $3, date_of_birth = $4,
        gender = $5, address = $6, citizen_id = $7, insurance_number = $8,
        emergency_contact = $9, emergency_phone = $10, blood_type = $11,
        allergies = $12, medical_history = $13, updated_at = CURRENT_TIMESTAMP
       WHERE id = $14
       RETURNING *`,
      [
        full_name, phone, email, date_of_birth, gender, address,
        citizen_id, insurance_number, emergency_contact, emergency_phone,
        blood_type, allergies, medical_history, id,
      ]
    );

    const patient = {
      ...result.rows[0],
      age: calculateAge(result.rows[0].date_of_birth),
    };

    return successResponse(res, patient, 'Cập nhật bệnh nhân thành công');
  } catch (error) {
    console.error('Update patient error:', error);
    return errorResponse(res, 'Lỗi cập nhật bệnh nhân', 500, error.message);
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if patient has appointments
    const appointments = await query(
      'SELECT COUNT(*) FROM appointments WHERE patient_id = $1',
      [id]
    );

    if (parseInt(appointments.rows[0].count) > 0) {
      return errorResponse(
        res,
        'Không thể xóa bệnh nhân đã có lịch hẹn. Vui lòng xóa lịch hẹn trước.',
        400
      );
    }

    // Delete patient
    const result = await query(
      'DELETE FROM patients WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy bệnh nhân', 404);
    }

    return successResponse(res, null, 'Xóa bệnh nhân thành công');
  } catch (error) {
    console.error('Delete patient error:', error);
    return errorResponse(res, 'Lỗi xóa bệnh nhân', 500, error.message);
  }
};

// Get patient medical history
export const getPatientMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT mr.*,
        a.appointment_date, a.appointment_time,
        s.full_name as doctor_name
       FROM medical_records mr
       LEFT JOIN appointments a ON mr.appointment_id = a.id
       LEFT JOIN staff s ON mr.doctor_id = s.id
       WHERE mr.patient_id = $1
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [id]
    );

    return successResponse(
      res,
      result.rows,
      'Lấy lịch sử khám bệnh thành công'
    );
  } catch (error) {
    console.error('Get medical history error:', error);
    return errorResponse(res, 'Lỗi lấy lịch sử khám bệnh', 500, error.message);
  }
};
