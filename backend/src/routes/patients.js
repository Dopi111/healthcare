import express from 'express';
import { body } from 'express-validator';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientMedicalHistory,
} from '../controllers/patientController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, phone, email, patient code, or citizen ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [full_name, date_of_birth, created_at, patient_code]
 *           default: created_at
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *     responses:
 *       200:
 *         description: List of patients retrieved successfully
 */
router.get('/', getAllPatients);

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patients]
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
 *         description: Patient retrieved successfully
 *       404:
 *         description: Patient not found
 */
router.get('/:id', getPatientById);

/**
 * @swagger
 * /patients/{id}/medical-history:
 *   get:
 *     summary: Get patient medical history
 *     tags: [Patients]
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
 *         description: Medical history retrieved successfully
 */
router.get('/:id/medical-history', getPatientMedicalHistory);

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - phone
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               phone:
 *                 type: string
 *                 example: "0901234567"
 *               email:
 *                 type: string
 *                 format: email
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               address:
 *                 type: string
 *               citizen_id:
 *                 type: string
 *               insurance_number:
 *                 type: string
 *               emergency_contact:
 *                 type: string
 *               emergency_phone:
 *                 type: string
 *               blood_type:
 *                 type: string
 *               allergies:
 *                 type: string
 *               medical_history:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Phone or citizen ID already exists
 */
router.post(
  '/',
  authorize('admin', 'receptionist', 'doctor', 'nurse'),
  [
    body('full_name').trim().notEmpty().withMessage('Họ tên là bắt buộc'),
    body('phone').matches(/^(0|\+84)(\d{9,10})$/).withMessage('Số điện thoại không hợp lệ'),
    body('email').optional().isEmail().withMessage('Email không hợp lệ'),
    body('date_of_birth').optional().isISO8601().withMessage('Ngày sinh không hợp lệ'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Giới tính không hợp lệ'),
    validate,
  ],
  createPatient
);

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update patient
 *     tags: [Patients]
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
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       404:
 *         description: Patient not found
 */
router.put(
  '/:id',
  authorize('admin', 'receptionist', 'doctor', 'nurse'),
  [
    body('full_name').optional().trim().notEmpty(),
    body('phone').optional().matches(/^(0|\+84)(\d{9,10})$/),
    body('email').optional().isEmail(),
    body('date_of_birth').optional().isISO8601(),
    body('gender').optional().isIn(['male', 'female', 'other']),
    validate,
  ],
  updatePatient
);

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Delete patient
 *     tags: [Patients]
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
 *         description: Patient deleted successfully
 *       400:
 *         description: Cannot delete patient with appointments
 *       404:
 *         description: Patient not found
 */
router.delete('/:id', authorize('admin'), deletePatient);

export default router;
