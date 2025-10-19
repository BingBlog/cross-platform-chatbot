/* eslint-disable no-undef */
import request from 'supertest';
import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import authController from '../authController';
import { AuthService } from '../../services/auth.service';
import { ApiError } from '../../types/api.types';
// @ts-ignore - Jest globals are available in test environment

// Mock AuthService
jest.mock('../../services/auth.service');
const MockedAuthService = AuthService as jest.Mocked<typeof AuthService>;

// Mock logger
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('AuthController', () => {
  let app: Koa;
  let router: Router;

  beforeEach(() => {
    app = new Koa();
    router = new Router();

    app.use(bodyParser());
    router.use('/auth', authController.routes());
    app.use(router.routes());
    app.use(router.allowedMethods());

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockAuthResponse = {
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 604800,
      };

      MockedAuthService.register.mockResolvedValue(mockAuthResponse);

      const response = await request(app.callback())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
          confirmPassword: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data.accessToken).toBe(mockAuthResponse.accessToken);
      expect(response.body.data.refreshToken).toBe(
        mockAuthResponse.refreshToken
      );
      expect(response.body.data.expiresIn).toBe(mockAuthResponse.expiresIn);
      expect(response.body.data.user.id).toBe(mockAuthResponse.user.id);
      expect(response.body.data.user.email).toBe(mockAuthResponse.user.email);
      expect(response.body.data.user.username).toBe(
        mockAuthResponse.user.username
      );
      expect(MockedAuthService.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app.callback())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          // missing username, password, confirmPassword
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('MISSING_FIELDS');
    });

    it('should handle AuthService errors', async () => {
      const apiError = new ApiError(
        'EMAIL_EXISTS',
        'Email already exists',
        null,
        400
      );
      MockedAuthService.register.mockRejectedValue(apiError);

      const response = await request(app.callback())
        .post('/auth/register')
        .send({
          email: 'existing@example.com',
          username: 'testuser',
          password: 'password123',
          confirmPassword: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('EMAIL_EXISTS');
      expect(response.body.message).toBe('Email already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockAuthResponse = {
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 604800,
      };

      MockedAuthService.login.mockResolvedValue(mockAuthResponse);

      const response = await request(app.callback()).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.accessToken).toBe(mockAuthResponse.accessToken);
      expect(response.body.data.refreshToken).toBe(
        mockAuthResponse.refreshToken
      );
      expect(response.body.data.expiresIn).toBe(mockAuthResponse.expiresIn);
      expect(response.body.data.user.id).toBe(mockAuthResponse.user.id);
      expect(response.body.data.user.email).toBe(mockAuthResponse.user.email);
      expect(response.body.data.user.username).toBe(
        mockAuthResponse.user.username
      );
      expect(MockedAuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app.callback()).post('/auth/login').send({
        email: 'test@example.com',
        // missing password
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('MISSING_FIELDS');
    });

    it('should handle invalid credentials', async () => {
      const apiError = new ApiError(
        'INVALID_CREDENTIALS',
        'Invalid email or password',
        null,
        401
      );
      MockedAuthService.login.mockRejectedValue(apiError);

      const response = await request(app.callback()).post('/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app.callback()).post('/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout successful');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockAuthResponse = {
        user: mockUser,
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 604800,
      };

      MockedAuthService.refreshToken.mockResolvedValue(mockAuthResponse);

      const response = await request(app.callback())
        .post('/auth/refresh')
        .send({
          refreshToken: 'old-refresh-token',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Token refreshed successfully');
      expect(response.body.data.accessToken).toBe(mockAuthResponse.accessToken);
      expect(response.body.data.refreshToken).toBe(
        mockAuthResponse.refreshToken
      );
      expect(response.body.data.expiresIn).toBe(mockAuthResponse.expiresIn);
      expect(response.body.data.user.id).toBe(mockAuthResponse.user.id);
      expect(response.body.data.user.email).toBe(mockAuthResponse.user.email);
      expect(response.body.data.user.username).toBe(
        mockAuthResponse.user.username
      );
      expect(MockedAuthService.refreshToken).toHaveBeenCalledWith(
        'old-refresh-token'
      );
    });

    it('should return 400 for missing refresh token', async () => {
      const response = await request(app.callback())
        .post('/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('MISSING_REFRESH_TOKEN');
    });

    it('should handle invalid refresh token', async () => {
      const apiError = new ApiError(
        'INVALID_REFRESH_TOKEN',
        'Invalid refresh token',
        null,
        401
      );
      MockedAuthService.refreshToken.mockRejectedValue(apiError);

      const response = await request(app.callback())
        .post('/auth/refresh')
        .send({
          refreshToken: 'invalid-token',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INVALID_REFRESH_TOKEN');
    });
  });
});
