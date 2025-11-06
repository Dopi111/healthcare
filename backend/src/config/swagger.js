import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Healthcare Management System API',
      version: '1.0.0',
      description: 'API documentation for Healthcare Management System - Hệ thống quản lý phòng khám',
      contact: {
        name: 'API Support',
        email: 'support@healthcare.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.healthcare.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            error: {
              type: 'string',
              example: 'Detailed error description',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            username: {
              type: 'string',
              example: 'john_doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            role: {
              type: 'string',
              enum: ['admin', 'doctor', 'nurse', 'technician', 'receptionist', 'accountant', 'patient'],
              example: 'doctor',
            },
            is_active: {
              type: 'boolean',
              example: true,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Patient: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            patient_code: {
              type: 'string',
              example: 'BN001',
            },
            full_name: {
              type: 'string',
              example: 'Nguyễn Văn A',
            },
            phone: {
              type: 'string',
              example: '0901234567',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'nguyenvana@email.com',
            },
            date_of_birth: {
              type: 'string',
              format: 'date',
              example: '1990-01-01',
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              example: 'male',
            },
            address: {
              type: 'string',
              example: '123 Đường ABC, Quận 1, TP.HCM',
            },
            citizen_id: {
              type: 'string',
              example: '001234567890',
            },
            insurance_number: {
              type: 'string',
              example: 'BH123456789',
            },
          },
        },
        Staff: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            full_name: {
              type: 'string',
              example: 'BS. Nguyễn Văn B',
            },
            phone: {
              type: 'string',
              example: '0912345678',
            },
            staff_type: {
              type: 'string',
              enum: ['doctor', 'nurse', 'technician', 'receptionist', 'accountant'],
              example: 'doctor',
            },
            specialization: {
              type: 'string',
              example: 'Nội khoa',
            },
            license_number: {
              type: 'string',
              example: 'BS123456',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'on_leave'],
              example: 'active',
            },
          },
        },
        Appointment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            appointment_code: {
              type: 'string',
              example: 'APT001',
            },
            patient_id: {
              type: 'integer',
              example: 1,
            },
            doctor_id: {
              type: 'integer',
              example: 2,
            },
            appointment_date: {
              type: 'string',
              format: 'date',
              example: '2024-01-15',
            },
            appointment_time: {
              type: 'string',
              format: 'time',
              example: '09:00:00',
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
              example: 'pending',
            },
            reason: {
              type: 'string',
              example: 'Khám tổng quát',
            },
          },
        },
        Clinic: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            room_number: {
              type: 'string',
              example: 'P101',
            },
            room_name: {
              type: 'string',
              example: 'Phòng khám Nội khoa 1',
            },
            floor_number: {
              type: 'integer',
              example: 1,
            },
            is_available: {
              type: 'boolean',
              example: true,
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
