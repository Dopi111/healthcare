import express from 'express';
import { body } from 'express-validator';
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoicePayment,
  getRevenueStats,
  getInsuranceClaims,
} from '../controllers/revenueController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @swagger
 * /revenue/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Revenue]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: payment_status
 *         schema:
 *           type: string
 *           enum: [unpaid, partial, paid, refunded]
 *       - in: query
 *         name: patient_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of invoices retrieved successfully
 */
router.get('/invoices', authorize('admin', 'accountant', 'receptionist'), getAllInvoices);

/**
 * @swagger
 * /revenue/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Revenue]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice retrieved successfully
 *       404:
 *         description: Invoice not found
 */
router.get('/invoices/:id', getInvoiceById);

/**
 * @swagger
 * /revenue/invoices:
 *   post:
 *     summary: Create new invoice
 *     tags: [Revenue]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_id
 *               - total_amount
 *             properties:
 *               appointment_id:
 *                 type: integer
 *               patient_id:
 *                 type: integer
 *               total_amount:
 *                 type: number
 *               discount:
 *                 type: number
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       404:
 *         description: Patient not found
 */
router.post(
  '/invoices',
  authorize('admin', 'accountant', 'receptionist'),
  [
    body('patient_id').isInt().withMessage('ID bệnh nhân không hợp lệ'),
    body('total_amount').isFloat({ min: 0 }).withMessage('Tổng tiền không hợp lệ'),
    body('discount').optional().isFloat({ min: 0 }),
    body('services').optional().isArray(),
    validate,
  ],
  createInvoice
);

/**
 * @swagger
 * /revenue/invoices/{id}/payment:
 *   patch:
 *     summary: Update invoice payment
 *     tags: [Revenue]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paid_amount:
 *                 type: number
 *               payment_method:
 *                 type: string
 *               payment_status:
 *                 type: string
 *                 enum: [unpaid, partial, paid, refunded]
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       404:
 *         description: Invoice not found
 */
router.patch(
  '/invoices/:id/payment',
  authorize('admin', 'accountant', 'receptionist'),
  [
    body('paid_amount').optional().isFloat({ min: 0 }),
    body('payment_status').optional().isIn(['unpaid', 'partial', 'paid', 'refunded']),
    validate,
  ],
  updateInvoicePayment
);

/**
 * @swagger
 * /revenue/stats:
 *   get:
 *     summary: Get revenue statistics
 *     tags: [Revenue]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Revenue statistics retrieved successfully
 */
router.get('/stats', authorize('admin', 'accountant'), getRevenueStats);

/**
 * @swagger
 * /revenue/insurance-claims:
 *   get:
 *     summary: Get insurance claims
 *     tags: [Revenue]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Insurance claims retrieved successfully
 */
router.get('/insurance-claims', authorize('admin', 'accountant'), getInsuranceClaims);

export default router;
