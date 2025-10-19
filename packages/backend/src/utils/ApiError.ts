/**
 * API错误类
 * 用于统一处理API错误响应
 */
export class ApiError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details: any;

  constructor(
    code: string,
    message: string,
    details: any = null,
    statusCode: number = 500
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // 确保错误堆栈正确
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * 转换为JSON格式
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      statusCode: this.statusCode,
    };
  }

  /**
   * 转换为API响应格式
   */
  toApiResponse() {
    return {
      success: false,
      message: this.message,
      error: this.code,
      details: this.details,
      timestamp: new Date().toISOString(),
    };
  }
}

export default ApiError;
