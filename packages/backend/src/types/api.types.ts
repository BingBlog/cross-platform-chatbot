// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// 分页响应类型
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 请求上下文类型
export interface RequestContext {
  user?: {
    id: string;
    email: string;
    username: string;
  };
  requestId: string;
  timestamp: Date;
}

// 错误类型
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

// 验证错误类型
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// 文件上传类型
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// 查询参数类型
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, any>;
}

export default {};
