import {
  makeAutoObservable,
} from 'mobx';
import RequestHandler from '../app/RequestHandler';
import { LoginRequest, RegisterRequest } from '../interfaces/UserInterface';
import MainStore from './MainStore';

export interface UserStoreInterface {
  token: string;
}

export default class UserStore implements UserStoreInterface {
  private mainStore: MainStore;

  username: string = '';

  id: string = '';

  email: string = '';

  name: string = '';

  surname: string = '';

  token: string = '';

  activated: boolean = true;

  constructor(mainStore: MainStore) {
    makeAutoObservable(this);
    this.mainStore = mainStore;
  }

  async login(data: LoginRequest) {
    const response = await (new RequestHandler()).request('/auth/login/', 'post', data);
    const { token } = response;
    this.setToken(token);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  async register(data: RegisterRequest) {
    const response = await (new RequestHandler()).request('/auth/register/', 'post', data);
    const {
      id, username, email, first_name, last_name, is_activated,
    } = response;
    console.log(is_activated);

    this.id = id;
    this.username = username;
    this.email = email;
    this.name = first_name;
    this.surname = last_name;
    this.activated = true;
  }

  logOut() {
    this.id = '';
    this.username = '';
    this.email = '';
    this.name = '';
    this.surname = '';
    this.token = '';
    this.activated = false;
    localStorage.removeItem('token');
  }

  async getProfile() {
    const response = await (new RequestHandler()).request('/auth/profile/', 'get');
    const {
      id, username, email, first_name, last_name, is_activated,
    } = response;
    console.log(is_activated);

    this.id = id;
    this.username = username;
    this.email = email;
    this.name = first_name;
    this.surname = last_name;
    this.activated = true;
  }

  static async resetPasswordRequest(data: { email: string }) {
    await (new RequestHandler()).request('/auth/password_reset/', 'post', data);
  }

  static async resetPassword(data: { code: string, password: string }) {
    await (new RequestHandler()).request('/auth/password_reset/', 'patch', data);
  }
}
