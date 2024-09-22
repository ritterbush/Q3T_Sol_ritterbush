import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';

// Base URL for API
const baseURL = 'http://localhost:5000';

// Initialize axios instance
const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get access token from localStorage (or another secure storage)
const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// Function to get refresh token
const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Function to save access token
const saveAccessToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

// Interceptor for adding access token to request headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();
    
    // Ensure that config.headers exists and is correctly typed
    config.headers = config.headers ?? {} as AxiosRequestHeaders;

    if (accessToken) {
      // Set Authorization header
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for handling 401 responses (token expiration)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Refresh token API call
      const refreshToken = getRefreshToken();
      try {
        const { data } = await axios.post(`${baseURL}/api/auth/refresh`, {
          token: refreshToken,
        });

        // Save new access token
        saveAccessToken(data.accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
