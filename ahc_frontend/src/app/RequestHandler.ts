import axios, { AxiosRequestHeaders } from 'axios';

type RequestType = 'post' | 'get' | 'put' | 'delete' | 'patch';

export default class RequestHandler {
  public axiosInstance;

  constructor() {
    const headers = localStorage.getItem('token') ? { Authorization: `Token ${localStorage.getItem('token')}` } : {};

    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL || 'http://localhost:8000/api/',
      timeout: 30000,
      headers: headers as AxiosRequestHeaders,
    });
  }

  async request(url: string, requestType: RequestType, data?: any) {
    let result;

    try {
      switch (requestType) {
        case 'get':
          result = await this.axiosInstance.get(url);
          break;
        case 'post':
          result = await this.axiosInstance.post(url, data);
          break;
        case 'put':
          result = await this.axiosInstance.put(url, data);
          break;
        case 'delete':
          result = await this.axiosInstance.delete(url, data);
          break;
        case 'patch':
          result = await this.axiosInstance.patch(url, data);
          break;
        default:
          throw Error('Undefined requestType');
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
      }
      throw error;
    }

    if (result.status >= 200 && result.status < 400) return result.data;

    throw Error(result.data);
  }
}
