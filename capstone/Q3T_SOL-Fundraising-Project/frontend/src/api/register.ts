// src/api/auth.ts
import apiClient from './apiClient.ts';

// Define types for requests and responses
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export const signup = async (credentials: RegisterRequest): Promise<AuthResponse> => {
  const { data } = await apiClient.post('/api/auth/signup', credentials);
  
  // Save tokens to localStorage
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);

  return data;
};

export const logout = () => {
  // Clear tokens from localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
