// src/api/auth.ts
import { Navigate } from 'react-router';
import apiClient from './apiClient';

// Define types for requests and responses
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { data } = await apiClient.post('/api/auth/signin', credentials);
  
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
