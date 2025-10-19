import { prisma } from '../config/database';
import { ChatSession, CreateSessionRequest, Message, MessageRole, UpdateSessionRequest } from '../types/chat.types';

export class ChatModel {
  // 创建会话
  static async createSession(userId: string, data: CreateSessionRequest): Promise<ChatSession> {
    return await prisma.chatSession.create({
      data: {
        userId,
        title: data.title,
        messageCount: 0,
      },
    });
  }

  // 根据 ID 获取会话
  static async getSessionById(id: string, userId?: string): Promise<ChatSession | null> {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }

    return await prisma.chatSession.findFirst({
      where,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  // 获取用户的所有会话
  static async getUserSessions(userId: string, page = 1, limit = 20): Promise<ChatSession[]> {
    const skip = (page - 1) * limit;

    return await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  // 更新会话
  static async updateSession(id: string, userId: string, data: UpdateSessionRequest): Promise<ChatSession> {
    return await prisma.chatSession.update({
      where: { 
        id,
        userId, // 确保只能更新自己的会话
      },
      data: {
        title: data.title,
        updatedAt: new Date(),
      },
    });
  }

  // 删除会话
  static async deleteSession(id: string, userId: string): Promise<void> {
    await prisma.chatSession.deleteMany({
      where: {
        id,
        userId, // 确保只能删除自己的会话
      },
    });
  }

  // 创建消息
  static async createMessage(
    sessionId: string,
    userId: string,
    role: MessageRole,
    content: string,
    metadata?: Record<string, any>
  ): Promise<Message> {
    // 使用事务确保数据一致性
    return await prisma.$transaction(async (tx) => {
      // 创建消息
      const message = await tx.message.create({
        data: {
          sessionId,
          userId,
          role,
          content,
          metadata,
        },
      });

      // 更新会话的消息计数和更新时间
      await tx.chatSession.update({
        where: { id: sessionId },
        data: {
          messageCount: {
            increment: 1,
          },
          updatedAt: new Date(),
        },
      });

      return message;
    });
  }

  // 获取会话的消息
  static async getSessionMessages(
    sessionId: string,
    userId: string,
    page = 1,
    limit = 50
  ): Promise<Message[]> {
    const skip = (page - 1) * limit;

    // 首先验证会话是否属于该用户
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
      select: { id: true },
    });

    if (!session) {
      throw new Error('Session not found or access denied');
    }

    return await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
    });
  }

  // 获取消息统计
  static async getMessageStats(sessionId: string, userId: string) {
    // 验证会话权限
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
      select: { id: true },
    });

    if (!session) {
      throw new Error('Session not found or access denied');
    }

    const [totalMessages, userMessages, assistantMessages] = await Promise.all([
      prisma.message.count({
        where: { sessionId },
      }),
      prisma.message.count({
        where: { sessionId, role: MessageRole.USER },
      }),
      prisma.message.count({
        where: { sessionId, role: MessageRole.ASSISTANT },
      }),
    ]);

    return {
      totalMessages,
      userMessages,
      assistantMessages,
    };
  }

  // 搜索消息
  static async searchMessages(
    userId: string,
    query: string,
    sessionId?: string,
    page = 1,
    limit = 20
  ): Promise<Message[]> {
    const skip = (page - 1) * limit;
    const where: any = {
      userId,
      content: {
        contains: query,
        mode: 'insensitive',
      },
    };

    if (sessionId) {
      where.sessionId = sessionId;
    }

    return await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }

  // 获取用户会话统计
  static async getUserSessionStats(userId: string) {
    const [totalSessions, totalMessages, recentSessions] = await Promise.all([
      prisma.chatSession.count({
        where: { userId },
      }),
      prisma.message.count({
        where: { userId },
      }),
      prisma.chatSession.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          messageCount: true,
          updatedAt: true,
        },
      }),
    ]);

    return {
      totalSessions,
      totalMessages,
      averageMessagesPerSession: totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0,
      recentSessions,
    };
  }
}

export default ChatModel;
