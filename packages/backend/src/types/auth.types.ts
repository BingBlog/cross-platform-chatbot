// 用户认证类型
export interface User {
  id: string;
  email: string;
  username: string;
  password?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 用户注册请求
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

// 用户登录请求
export interface LoginRequest {
  email: string;
  password: string;
}

// 认证响应
export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// JWT 载荷
export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

// 密码重置请求
export interface ResetPasswordRequest {
  email: string;
}

// 密码更新请求
export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 用户资料更新请求
export interface UpdateProfileRequest {
  username?: string;
  avatar?: string;
}

// 权限类型
export enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin',
}

// 角色类型
export enum Role {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

export default {};
