import { query } from '../config/database.js';
import {
  generateCode,
  getPagination,
  buildPaginationResponse,
  successResponse,
  errorResponse
} from '../utils/helpers.js';

// Get all invoices
export const getAllInvoices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      payment_status = '',
      patient_id = '',
      start_date = '',
      end_date = '',
    } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    // Build query conditions
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (payment_status) {
      conditions.push(`i.payment_status = $${paramIndex}`);
      params.push(payment_status);
      paramIndex++;
    }

    if (patient_id) {
      conditions.push(`i.patient_id = $${paramIndex}`);
      params.push(patient_id);
      paramIndex++;
    }

    if (start_date) {
      conditions.push(`i.created_at >= $${paramIndex}`);
      params.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      conditions.push(`i.created_at <= $${paramIndex}`);
      params.push(end_date);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total
    const countResult = await query(
      `SELECT COUNT(*) FROM invoices i ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get invoices
    const invoiceParams = [...params, queryLimit, offset];
    const result = await query(
      `SELECT i.*,
        p.full_name as patient_name,
        p.phone as patient_phone,
        a.appointment_code
       FROM invoices i
       LEFT JOIN patients p ON i.patient_id = p.id
       LEFT JOIN appointments a ON i.appointment_id = a.id
       ${whereClause}
       ORDER BY i.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      invoiceParams
    );

    return successResponse(
      res,
      buildPaginationResponse(result.rows, total, page, limit),
      'Lấy danh sách hóa đơn thành công'
    );
  } catch (error) {
    console.error('Get invoices error:', error);
    return errorResponse(res, 'Lỗi lấy danh sách hóa đơn', 500, error.message);
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT i.*,
        p.full_name as patient_name,
        p.phone as patient_phone,
        p.address as patient_address,
        a.appointment_code,
        a.appointment_date
       FROM invoices i
       LEFT JOIN patients p ON i.patient_id = p.id
       LEFT JOIN appointments a ON i.appointment_id = a.id
       WHERE i.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy hóa đơn', 404);
    }

    return successResponse(res, result.rows[0], 'Lấy thông tin hóa đơn thành công');
  } catch (error) {
    console.error('Get invoice error:', error);
    return errorResponse(res, 'Lỗi lấy thông tin hóa đơn', 500, error.message);
  }
};

// Create invoice
export const createInvoice = async (req, res) => {
  try {
    const {
      appointment_id,
      patient_id,
      total_amount,
      discount = 0,
      services,
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

    // Generate invoice code
    const countResult = await query('SELECT COUNT(*) FROM invoices');
    const count = parseInt(countResult.rows[0].count);
    const invoiceCode = generateCode('INV', count + 1);

    // Create invoice
    const result = await query(
      `INSERT INTO invoices (
        invoice_code, appointment_id, patient_id,
        total_amount, discount, services, notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [invoiceCode, appointment_id, patient_id, total_amount, discount, JSON.stringify(services), notes, createdBy]
    );

    return successResponse(res, result.rows[0], 'Tạo hóa đơn thành công', 201);
  } catch (error) {
    console.error('Create invoice error:', error);
    return errorResponse(res, 'Lỗi tạo hóa đơn', 500, error.message);
  }
};

// Update invoice payment
export const updateInvoicePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paid_amount, payment_method, payment_status } = req.body;

    // Check if invoice exists
    const existing = await query('SELECT * FROM invoices WHERE id = $1', [id]);

    if (existing.rows.length === 0) {
      return errorResponse(res, 'Không tìm thấy hóa đơn', 404);
    }

    const invoice = existing.rows[0];
    const newPaidAmount = paid_amount || invoice.paid_amount;
    const totalAmount = invoice.total_amount - invoice.discount;

    // Determine payment status
    let newPaymentStatus = payment_status;
    if (!newPaymentStatus) {
      if (newPaidAmount >= totalAmount) {
        newPaymentStatus = 'paid';
      } else if (newPaidAmount > 0) {
        newPaymentStatus = 'partial';
      } else {
        newPaymentStatus = 'unpaid';
      }
    }

    // Update invoice
    const result = await query(
      `UPDATE invoices SET
        paid_amount = $1,
        payment_method = COALESCE($2, payment_method),
        payment_status = $3,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [newPaidAmount, payment_method, newPaymentStatus, id]
    );

    return successResponse(res, result.rows[0], 'Cập nhật thanh toán thành công');
  } catch (error) {
    console.error('Update invoice payment error:', error);
    return errorResponse(res, 'Lỗi cập nhật thanh toán', 500, error.message);
  }
};

// Get revenue statistics
export const getRevenueStats = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let dateCondition = '';
    const params = [];

    if (start_date && end_date) {
      dateCondition = 'WHERE created_at BETWEEN $1 AND $2';
      params.push(start_date, end_date);
    } else if (start_date) {
      dateCondition = 'WHERE created_at >= $1';
      params.push(start_date);
    }

    // Total revenue
    const revenueResult = await query(
      `SELECT
        COUNT(*) as total_invoices,
        SUM(total_amount) as gross_revenue,
        SUM(discount) as total_discount,
        SUM(total_amount - discount) as net_revenue,
        SUM(paid_amount) as total_paid,
        SUM(total_amount - discount - paid_amount) as total_outstanding
       FROM invoices ${dateCondition}`,
      params
    );

    // Revenue by payment status
    const statusResult = await query(
      `SELECT
        payment_status,
        COUNT(*) as count,
        SUM(total_amount - discount) as amount
       FROM invoices ${dateCondition}
       GROUP BY payment_status`,
      params
    );

    return successResponse(
      res,
      {
        summary: revenueResult.rows[0],
        by_status: statusResult.rows,
      },
      'Lấy thống kê doanh thu thành công'
    );
  } catch (error) {
    console.error('Get revenue stats error:', error);
    return errorResponse(res, 'Lỗi lấy thống kê doanh thu', 500, error.message);
  }
};

// Get insurance claims
export const getInsuranceClaims = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    let whereClause = '';
    const params = [];

    if (status) {
      whereClause = 'WHERE ic.status = $1';
      params.push(status);
    }

    // Count total
    const countResult = await query(
      `SELECT COUNT(*) FROM insurance_claims ic ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get claims
    const claimParams = [...params, queryLimit, offset];
    const paramIndex = params.length + 1;

    const result = await query(
      `SELECT ic.*,
        p.full_name as patient_name,
        p.insurance_number,
        i.invoice_code
       FROM insurance_claims ic
       LEFT JOIN patients p ON ic.patient_id = p.id
       LEFT JOIN invoices i ON ic.invoice_id = i.id
       ${whereClause}
       ORDER BY ic.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      claimParams
    );

    return successResponse(
      res,
      buildPaginationResponse(result.rows, total, page, limit),
      'Lấy danh sách bảo hiểm thành công'
    );
  } catch (error) {
    console.error('Get insurance claims error:', error);
    return errorResponse(res, 'Lỗi lấy danh sách bảo hiểm', 500, error.message);
  }
};
