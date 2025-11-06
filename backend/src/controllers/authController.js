import { query } from '../config/database.js';
import { hashPassword, comparePassword, generateToken, successResponse, errorResponse } from '../utils/helpers.js';

// Register new user
export const register = async (req, res) => {
  try {
    const { username, email, password, role = 'patient' } = req.body;

    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return errorResponse(res, 'Email hoặc tên đăng nhập đã tồn tại', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user
    const result = await query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role, created_at`,
      [username, email, hashedPassword, role]
    );

    const user = result.rows[0];

    // Generate token
    const token = generateToken(user.id, user.role);

    return successResponse(
      res,
      {
        user,
        token,
      },
      'Đăng ký thành công',
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(res, 'Lỗi đăng ký', 500, error.message);
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Email hoặc mật khẩu không đúng', 401);
    }

    const user = result.rows[0];

    // Check if account is active
    if (!user.is_active) {
      return errorResponse(res, 'Tài khoản đã bị vô hiệu hóa', 401);
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return errorResponse(res, 'Email hoặc mật khẩu không đúng', 401);
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    // Remove password from response
    delete user.password_hash;

    return successResponse(
      res,
      {
        user,
        token,
      },
      'Đăng nhập thành công'
    );
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Lỗi đăng nhập', 500, error.message);
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user info
    const userResult = await query(
      'SELECT id, username, email, role, is_active, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return errorResponse(res, 'Người dùng không tồn tại', 404);
    }

    const user = userResult.rows[0];

    // If user is staff, get staff info
    if (['doctor', 'nurse', 'technician', 'receptionist', 'accountant'].includes(user.role)) {
      const staffResult = await query(
        `SELECT s.*, d.name as department_name
         FROM staff s
         LEFT JOIN departments d ON s.department_id = d.id
         WHERE s.user_id = $1`,
        [userId]
      );

      if (staffResult.rows.length > 0) {
        user.staff_info = staffResult.rows[0];
      }
    }

    return successResponse(res, user, 'Lấy thông tin thành công');
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, 'Lỗi lấy thông tin', 500, error.message);
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    // Check if email/username already taken by another user
    const existingUser = await query(
      'SELECT id FROM users WHERE (email = $1 OR username = $2) AND id != $3',
      [email, username, userId]
    );

    if (existingUser.rows.length > 0) {
      return errorResponse(res, 'Email hoặc tên đăng nhập đã được sử dụng', 400);
    }

    // Update user
    const result = await query(
      `UPDATE users
       SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, username, email, role, is_active, created_at, updated_at`,
      [username, email, userId]
    );

    return successResponse(res, result.rows[0], 'Cập nhật thông tin thành công');
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, 'Lỗi cập nhật thông tin', 500, error.message);
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get current password
    const result = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Người dùng không tồn tại', 404);
    }

    // Verify current password
    const isValid = await comparePassword(currentPassword, result.rows[0].password_hash);

    if (!isValid) {
      return errorResponse(res, 'Mật khẩu hiện tại không đúng', 401);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, userId]
    );

    return successResponse(res, null, 'Đổi mật khẩu thành công');
  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse(res, 'Lỗi đổi mật khẩu', 500, error.message);
  }
};
