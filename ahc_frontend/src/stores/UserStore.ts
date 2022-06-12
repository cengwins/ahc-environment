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

  firstName: string = '';

  lastName: string = '';

  githubUsername?: string;

  token: string = '';

  activated: boolean = false;

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
      id, username, email, first_name, last_name, is_activated, github_username,
    } = response;

    this.id = id;
    this.username = username;
    this.email = email;
    this.firstName = first_name;
    this.lastName = last_name;
    this.githubUsername = github_username;
    this.activated = is_activated;
  }

  logOut() {
    this.id = '';
    this.username = '';
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.githubUsername = '';
    this.activated = false;
    this.token = '';
    localStorage.removeItem('token');
  }

  async getProfile() {
    const response = await (new RequestHandler()).request('/auth/profile/', 'get');
    const {
      id, username, email, first_name, last_name, is_activated, github_username,
    } = response;

    this.id = id;
    this.username = username;
    this.email = email;
    this.firstName = first_name;
    this.lastName = last_name;
    this.githubUsername = github_username;
    this.activated = is_activated;
  }

  static async resetPasswordRequest(data: { email: string }) {
    await (new RequestHandler()).request('/auth/password_reset/', 'post', data);
  }

  static async resetPassword(data: { code: string, password: string }) {
    await (new RequestHandler()).request('/auth/password_reset/', 'patch', data);
  }
}
