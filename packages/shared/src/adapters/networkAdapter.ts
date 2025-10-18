import { ApiResponse, NetworkAdapter } from '../types';

export class WebNetworkAdapter implements NetworkAdapter {
  async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await fetch(url, { method: 'GET', ...config });
    return response.json();
  }

  async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      ...config,
    });
    return response.json();
  }

  async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      ...config,
    });
    return response.json();
  }

  async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await fetch(url, { method: 'DELETE', ...config });
    return response.json();
  }
}
