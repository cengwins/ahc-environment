import { createContext, useContext } from 'react';
import NotificationStore from './NotificationStore';
import UserStore from './UserStore';

export interface MainStoreInterface {
  userStore: UserStore;
  notificationStore: NotificationStore;
}

export default class MainStore implements MainStoreInterface {
  userStore: UserStore;

  notificationStore: NotificationStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.notificationStore = new NotificationStore(this);
  }
}

const StoresContext = createContext(new MainStore());

export const useStores = () => useContext(StoresContext);
