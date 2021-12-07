import axios from 'axios';

export default class RequestHandler {
  public axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:8000/api/',
      timeout: 1000,
      headers: { },
    });
  }

  async post(url: string, data: any) {
    const result = await this.axiosInstance.post(url, data);
    if (result.status === 200) return result.data;

    throw Error(result.data);
  }
}
