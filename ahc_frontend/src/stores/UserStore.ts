import {
  makeAutoObservable,
} from 'mobx';
import RequestHandler from '../app/RequestHandler';
import MainStore from './MainStore';

export interface UserStoreInterface {
  username: string;
}

export default class UserStore implements UserStoreInterface {
  private mainStore: MainStore;

  username: string = '';

  constructor(mainStore: MainStore) {
    makeAutoObservable(this);
    this.mainStore = mainStore;
  }

  login() {
    const response = (new RequestHandler()).axiosInstance.get('login');
    console.log(response);
    console.log(this.username);
  }

  register(mail: string, name: string, surname: string, password: string) {
    const response = (new RequestHandler()).axiosInstance.get('register');
    console.log(mail, name, surname, password);
    console.log(response);
    console.log(this.username);
  }
}
