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

  login(mail: string, password: string) {
    const response = (new RequestHandler()).axiosInstance.post('/login/', {
      mail, password,
    });
    console.log(response);
    console.log(this.username);
  }

  register(mail: string, name: string, surname: string, password: string) {
    const response = (new RequestHandler()).axiosInstance.post('/register/', {
      mail, name, surname, password,
    });
    console.log(mail, name, surname, password);
    console.log(response);
    console.log(this.username);
  }
}
