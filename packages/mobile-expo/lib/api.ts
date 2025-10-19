import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Constants from 'expo-constants';

// API配置
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
  (config) => {
    // 从存储中获取token
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理通用错误
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除存储的认证信息
      clearStoredAuth();
      // 可以在这里触发重新登录逻辑
    }
    return Promise.reject(error);
  }
);

// 简单的token存储函数（实际项目中应该使用更安全的存储方式）
const getStoredToken = (): string | null => {
  try {
    return localStorage?.getItem('auth_token') || null;
  } catch {
    return null;
  }
};

const clearStoredAuth = (): void => {
  try {
    localStorage?.removeItem('auth_token');
    localStorage?.removeItem('user_info');
  } catch {
    // 忽略错误
  }
};

// 认证相关API
export const authAPI = {
  // 用户登录
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // 用户注册
  register: async (email: string, username: string, password: string, confirmPassword: string) => {
    const response = await apiClient.post('/auth/register', {
      email,
      username,
      password,
      confirmPassword,
    });
    return response.data;
  },

  // 用户登出
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // 刷新token
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
};

export default apiClient;
