import axios from 'axios';

export default class RequestHandler {
  public axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://localhost:8000/api/',
      timeout: 1000,
      headers: { },
    });
  }
}
