import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { appConfig } from '../config/app';
import { 
  AuthResponse, 
  JwtPayload, 
  LoginRequest, 
  RegisterRequest, 
  UpdatePasswordRequest,
  UpdateProfileRequest,
  User 
} from '../types/auth.types';
import { ApiError } from '../types/api.types';

export class AuthService {
  // 用户注册
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    // 验证输入
    await this.validateRegisterData(data);

    // 检查用户是否已存在
    const existingUserByEmail = await UserModel.findByEmail(data.email);
    if (existingUserByEmail) {
      throw new ApiError('EMAIL_EXISTS', 'Email already exists', null, 400);
    }

    const existingUserByUsername = await UserModel.findByUsername(data.username);
    if (existingUserByUsername) {
      throw new ApiError('USERNAME_EXISTS', 'Username already exists', null, 400);
    }

    // 创建用户
    const user = await UserModel.create(data);

    // 生成令牌
    const tokens = this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  // 用户登录
  static async login(data: LoginRequest): Promise<AuthResponse> {
    // 查找用户
    const user = await UserModel.findByEmail(data.email);
    if (!user) {
      throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password', null, 401);
    }

    // 验证密码
    const isValidPassword = await UserModel.validatePassword(user, data.password);
    if (!isValidPassword) {
      throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password', null, 401);
    }

    // 生成令牌
    const tokens = this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  // 验证令牌
  static async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = jwt.verify(token, appConfig.jwt.secret) as JwtPayload;
      
      // 验证用户是否仍然存在
      const user = await UserModel.findById(payload.userId);
      if (!user) {
        throw new ApiError('USER_NOT_FOUND', 'User not found', null, 401);
      }

      return payload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError('INVALID_TOKEN', 'Invalid token', null, 401);
      }
      throw error;
    }
  }

  // 刷新令牌
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = jwt.verify(refreshToken, appConfig.jwt.secret) as JwtPayload;
      
      const user = await UserModel.findById(payload.userId);
      if (!user) {
        throw new ApiError('USER_NOT_FOUND', 'User not found', null, 401);
      }

      const tokens = this.generateTokens(user);

      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError('INVALID_REFRESH_TOKEN', 'Invalid refresh token', null, 401);
      }
      throw error;
    }
  }

  // 更新用户资料
  static async updateProfile(userId: string, data: UpdateProfileRequest): Promise<User> {
    // 如果更新用户名，检查是否已存在
    if (data.username) {
      const existingUser = await UserModel.findByUsername(data.username);
      if (existingUser && existingUser.id !== userId) {
        throw new ApiError('USERNAME_EXISTS', 'Username already exists', null, 400);
      }
    }

    return await UserModel.updateProfile(userId, data);
  }

  // 更新密码
  static async updatePassword(userId: string, data: UpdatePasswordRequest): Promise<void> {
    // 验证输入
    if (data.newPassword !== data.confirmPassword) {
      throw new ApiError('PASSWORD_MISMATCH', 'New password and confirm password do not match', null, 400);
    }

    // 获取用户并验证当前密码
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ApiError('USER_NOT_FOUND', 'User not found', null, 404);
    }

    const isValidPassword = await UserModel.validatePassword(user, data.currentPassword);
    if (!isValidPassword) {
      throw new ApiError('INVALID_PASSWORD', 'Current password is incorrect', null, 400);
    }

    // 更新密码
    await UserModel.updatePassword(userId, data.newPassword);
  }

  // 生成访问令牌和刷新令牌
  private static generateTokens(user: User): { accessToken: string; refreshToken: string; expiresIn: number } {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = jwt.sign(payload, appConfig.jwt.secret, {
      expiresIn: appConfig.jwt.expiresIn,
    });

    const refreshToken = jwt.sign(payload, appConfig.jwt.secret, {
      expiresIn: appConfig.jwt.refreshExpiresIn,
    });

    // 计算过期时间（秒）
    const expiresIn = this.getExpiresIn(appConfig.jwt.expiresIn);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  // 清理用户数据（移除敏感信息）
  private static sanitizeUser(user: User): Omit<User, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  // 验证注册数据
  private static async validateRegisterData(data: RegisterRequest): Promise<void> {
    if (!data.email || !data.username || !data.password || !data.confirmPassword) {
      throw new ApiError('MISSING_FIELDS', 'All fields are required', null, 400);
    }

    if (data.password !== data.confirmPassword) {
      throw new ApiError('PASSWORD_MISMATCH', 'Password and confirm password do not match', null, 400);
    }

    if (data.password.length < 6) {
      throw new ApiError('WEAK_PASSWORD', 'Password must be at least 6 characters long', null, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new ApiError('INVALID_EMAIL', 'Invalid email format', null, 400);
    }

    if (data.username.length < 3) {
      throw new ApiError('INVALID_USERNAME', 'Username must be at least 3 characters long', null, 400);
    }
  }

  // 获取令牌过期时间（秒）
  private static getExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 24 * 60 * 60;
      default: return 7 * 24 * 60 * 60; // 默认7天
    }
  }
}

export default AuthService;
