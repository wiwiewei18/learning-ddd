import axios, { AxiosInstance, AxiosResponse } from 'axios';

export abstract class BaseAPI {
  protected baseUrl: string;
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create();
    this.enableInterceptors();
  }

  private enableInterceptors(): void {
    this.axiosInstance.interceptors.response.use(this.getSuccessResponseHandler(), this.getErrorResponseHandler());
  }

  private getSuccessResponseHandler() {
    return (response: AxiosResponse) => {
      return response;
    };
  }

  private getErrorResponseHandler() {
    return async (error: unknown) => {
      return Promise.reject(error);
    };
  }

  protected get<T>(url: string, params?: any, headers?: any): Promise<T> {
    return this.axiosInstance({
      method: 'GET',
      url: `${this.baseUrl}${url}`,
      params: params ?? null,
      headers: headers ?? null,
    });
  }

  protected post<T>(url: string, data?: any, params?: any, headers?: any): Promise<T> {
    return this.axiosInstance({
      method: 'POST',
      url: `${this.baseUrl}${url}`,
      data: data ?? null,
      params: params ?? null,
      headers: headers ?? null,
    });
  }
}
