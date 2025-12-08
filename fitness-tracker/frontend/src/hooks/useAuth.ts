import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loginSuccess, logout, updateUserInfo } from '../store/authSlice';
import { authAPI } from '../services/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data as { token: string; user: any };

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Dispatch login success action
      dispatch(loginSuccess({ token, user }));

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authAPI.register(data);
      const { token, user } = response.data as { token: string; user: any };

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Dispatch login success action
      dispatch(loginSuccess({ token, user }));

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logoutUser = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');

    // Dispatch logout action
    dispatch(logout());
  };

  const updateProfile = (userData: Partial<RootState['auth']['user']>) => {
    dispatch(updateUserInfo(userData));
  };

  return {
    isAuthenticated,
    token,
    user,
    login,
    register,
    logout: logoutUser,
    updateProfile,
  };
};