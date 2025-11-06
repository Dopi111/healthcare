import express from 'express';
import { body } from 'express-validator';
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getDoctors,
  getNurses,
  getTechnicians,
  getStaffSchedule,
  getDepartments,
} from '../controllers/staffController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @swagger
 * /staff:
 *   get:
 *     summary: Get all staff
 *     tags: [Staff]
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
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: staff_type
 *         schema:
 *           type: string
 *           enum: [doctor, nurse, technician, receptionist, accountant]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, on_leave]
 *     responses:
 *       200:
 *         description: List of staff retrieved successfully
 */
router.get('/', getAllStaff);

/**
 * @swagger
 * /staff/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of doctors retrieved successfully
 */
router.get('/doctors', getDoctors);

/**
 * @swagger
 * /staff/nurses:
 *   get:
 *     summary: Get all nurses
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of nurses retrieved successfully
 */
router.get('/nurses', getNurses);

/**
 * @swagger
 * /staff/technicians:
 *   get:
 *     summary: Get all technicians
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of technicians retrieved successfully
 */
router.get('/technicians', getTechnicians);

/**
 * @swagger
 * /staff/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of departments retrieved successfully
 */
router.get('/departments', getDepartments);

/**
 * @swagger
 * /staff/{id}:
 *   get:
 *     summary: Get staff by ID
 *     tags: [Staff]
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
 *         description: Staff retrieved successfully
 *       404:
 *         description: Staff not found
 */
router.get('/:id', getStaffById);

/**
 * @swagger
 * /staff/{id}/schedule:
 *   get:
 *     summary: Get staff schedule
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *         description: Staff schedule retrieved successfully
 */
router.get('/:id/schedule', getStaffSchedule);

/**
 * @swagger
 * /staff:
 *   post:
 *     summary: Create new staff
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - full_name
 *               - phone
 *               - staff_type
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               citizen_id:
 *                 type: string
 *               staff_type:
 *                 type: string
 *                 enum: [doctor, nurse, technician, receptionist, accountant]
 *               specialization:
 *                 type: string
 *               license_number:
 *                 type: string
 *               department_id:
 *                 type: integer
 *               salary:
 *                 type: number
 *               hire_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Staff created successfully
 *       400:
 *         description: Email, username, phone or citizen ID already exists
 */
router.post(
  '/',
  authorize('admin'),
  [
    body('username').trim().notEmpty().withMessage('Tên đăng nhập là bắt buộc'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('full_name').trim().notEmpty().withMessage('Họ tên là bắt buộc'),
    body('phone').matches(/^(0|\+84)(\d{9,10})$/).withMessage('Số điện thoại không hợp lệ'),
    body('staff_type').isIn(['doctor', 'nurse', 'technician', 'receptionist', 'accountant']).withMessage('Loại nhân viên không hợp lệ'),
    body('date_of_birth').optional().isISO8601(),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('hire_date').optional().isISO8601(),
    validate,
  ],
  createStaff
);

/**
 * @swagger
 * /staff/{id}:
 *   put:
 *     summary: Update staff
 *     tags: [Staff]
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
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       200:
 *         description: Staff updated successfully
 *       404:
 *         description: Staff not found
 */
router.put(
  '/:id',
  authorize('admin'),
  [
    body('full_name').optional().trim().notEmpty(),
    body('phone').optional().matches(/^(0|\+84)(\d{9,10})$/),
    body('date_of_birth').optional().isISO8601(),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('status').optional().isIn(['active', 'inactive', 'on_leave']),
    validate,
  ],
  updateStaff
);

/**
 * @swagger
 * /staff/{id}:
 *   delete:
 *     summary: Delete staff
 *     tags: [Staff]
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
 *         description: Staff deleted successfully
 *       404:
 *         description: Staff not found
 */
router.delete('/:id', authorize('admin'), deleteStaff);

export default router;
