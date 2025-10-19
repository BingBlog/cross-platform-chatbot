import { prisma } from '../config/database';
import { RegisterRequest, UpdateProfileRequest, User } from '../types/auth.types';
import bcrypt from 'bcryptjs';

export class UserModel {
  // 创建用户
  static async create(data: RegisterRequest): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
      },
    });

    return user;
  }

  // 根据 ID 查找用户
  static async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // 根据邮箱查找用户
  static async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // 根据用户名查找用户
  static async findByUsername(username: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { username },
    });
  }

  // 验证用户密码
  static async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.password) return false;
    return await bcrypt.compare(password, user.password);
  }

  // 更新用户资料
  static async updateProfile(id: string, data: UpdateProfileRequest): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: {
        username: data.username,
        avatar: data.avatar,
        updatedAt: new Date(),
      },
    });
  }

  // 更新用户密码
  static async updatePassword(id: string, newPassword: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    return await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });
  }

  // 删除用户
  static async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  // 检查邮箱是否已存在
  static async isEmailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }

  // 检查用户名是否已存在
  static async isUsernameExists(username: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    return !!user;
  }

  // 获取用户统计信息
  static async getUserStats(id: string) {
    const [sessionCount, messageCount] = await Promise.all([
      prisma.chatSession.count({
        where: { userId: id },
      }),
      prisma.message.count({
        where: { userId: id },
      }),
    ]);

    return {
      sessionCount,
      messageCount,
    };
  }
}

export default UserModel;
