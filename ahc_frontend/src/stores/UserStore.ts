import {
  makeAutoObservable,
} from 'mobx';
import RequestHandler from '../app/RequestHandler';
import { LoginRequest, RegisterRequest } from '../interfaces/UserInterface';
import MainStore from './MainStore';

export interface UserStoreInterface {
  username: string;
}

export default class UserStore implements UserStoreInterface {
  private mainStore: MainStore;

  username: string = '';

  id: string = '';

  email: string = '';

  name: string = '';

  surname: string = '';

  token: string = '';

  constructor(mainStore: MainStore) {
    makeAutoObservable(this);
    this.mainStore = mainStore;
  }

  async login(data: LoginRequest) {
    const response = await (new RequestHandler()).post('/auth/login/', data);
    const { token } = response;
    this.token = token;
  }

  async register(data: RegisterRequest) {
    const response = await (new RequestHandler()).post('/auth/register/', data);
    const {
      id, username, email, first_name, last_name,
    } = response;
    this.id = id;
    this.username = username;
    this.email = email;
    this.name = first_name;
    this.surname = last_name;
    console.log(response);
    console.log(this.username);
  }

  logOut() {
    this.id = '';
    this.username = '';
    this.email = '';
    this.name = '';
    this.surname = '';
    this.token = '';
  }
}
