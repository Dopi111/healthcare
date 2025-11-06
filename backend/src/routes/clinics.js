import express from 'express';
import { body } from 'express-validator';
import {
  getAllClinics,
  getClinicById,
  createClinic,
  updateClinic,
  deleteClinic,
  getClinicSchedule,
} from '../controllers/clinicController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @swagger
 * /clinics:
 *   get:
 *     summary: Get all clinics
 *     tags: [Clinics]
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
 *         name: is_available
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: floor_number
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of clinics retrieved successfully
 */
router.get('/', getAllClinics);

/**
 * @swagger
 * /clinics/{id}:
 *   get:
 *     summary: Get clinic by ID
 *     tags: [Clinics]
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
 *         description: Clinic retrieved successfully
 *       404:
 *         description: Clinic not found
 */
router.get('/:id', getClinicById);

/**
 * @swagger
 * /clinics/{id}/schedule:
 *   get:
 *     summary: Get clinic schedule
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Clinic schedule retrieved successfully
 */
router.get('/:id/schedule', getClinicSchedule);

/**
 * @swagger
 * /clinics:
 *   post:
 *     summary: Create new clinic
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room_number
 *               - room_name
 *             properties:
 *               room_number:
 *                 type: string
 *                 example: P101
 *               room_name:
 *                 type: string
 *                 example: Phòng khám Nội khoa 1
 *               department_id:
 *                 type: integer
 *               floor_number:
 *                 type: integer
 *               capacity:
 *                 type: integer
 *               equipment:
 *                 type: string
 *               is_available:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Clinic created successfully
 *       400:
 *         description: Room number already exists
 */
router.post(
  '/',
  authorize('admin'),
  [
    body('room_number').trim().notEmpty().withMessage('Số phòng là bắt buộc'),
    body('room_name').trim().notEmpty().withMessage('Tên phòng là bắt buộc'),
    body('department_id').optional().isInt(),
    body('floor_number').optional().isInt(),
    body('capacity').optional().isInt(),
    body('is_available').optional().isBoolean(),
    validate,
  ],
  createClinic
);

/**
 * @swagger
 * /clinics/{id}:
 *   put:
 *     summary: Update clinic
 *     tags: [Clinics]
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
 *             $ref: '#/components/schemas/Clinic'
 *     responses:
 *       200:
 *         description: Clinic updated successfully
 *       404:
 *         description: Clinic not found
 */
router.put(
  '/:id',
  authorize('admin'),
  [
    body('room_number').optional().trim().notEmpty(),
    body('room_name').optional().trim().notEmpty(),
    body('department_id').optional().isInt(),
    body('floor_number').optional().isInt(),
    body('capacity').optional().isInt(),
    body('is_available').optional().isBoolean(),
    validate,
  ],
  updateClinic
);

/**
 * @swagger
 * /clinics/{id}:
 *   delete:
 *     summary: Delete clinic
 *     tags: [Clinics]
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
 *         description: Clinic deleted successfully
 *       400:
 *         description: Cannot delete clinic with appointments
 *       404:
 *         description: Clinic not found
 */
router.delete('/:id', authorize('admin'), deleteClinic);

export default router;
