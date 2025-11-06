import { validationResult } from 'express-validator';

// Middleware to handle validation errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(422).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: extractedErrors,
    });
  }

  next();
};

// Common validation rules
export const validationRules = {
  // Email validation
  email: {
    isEmail: {
      errorMessage: 'Email không hợp lệ',
    },
    normalizeEmail: true,
  },

  // Phone validation (Vietnamese format)
  phone: {
    matches: {
      options: /^(0|\+84)(\d{9,10})$/,
      errorMessage: 'Số điện thoại không hợp lệ',
    },
  },

  // Password validation
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: 'Mật khẩu phải có ít nhất 6 ký tự',
    },
  },

  // Required field
  required: {
    notEmpty: {
      errorMessage: 'Trường này là bắt buộc',
    },
  },

  // Date validation
  date: {
    isISO8601: {
      errorMessage: 'Ngày không hợp lệ (định dạng: YYYY-MM-DD)',
    },
  },

  // Number validation
  number: {
    isNumeric: {
      errorMessage: 'Giá trị phải là số',
    },
  },

  // Positive number
  positiveNumber: {
    isFloat: {
      options: { min: 0 },
      errorMessage: 'Giá trị phải là số dương',
    },
  },
};
