import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getToken, removeToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await authAPI.getProfile();
          if (response.success) {
            setUser(response.data);
          }
        } catch (err) {
          console.error('Auth init error:', err);
          removeToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.login(email, password);

      if (response.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }

      return { success: false, message: response.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.register(userData);

      if (response.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }

      return { success: false, message: response.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(userData);

      if (response.success) {
        setUser(response.data);
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      const response = await authAPI.changePassword(currentPassword, newPassword);
      return { success: response.success, message: response.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isDoctor: user?.role === 'doctor',
    isNurse: user?.role === 'nurse',
    isReceptionist: user?.role === 'receptionist',
    isAccountant: user?.role === 'accountant',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
