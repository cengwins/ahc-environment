import { createContext, useContext } from 'react';
import UserStore from './UserStore';

export interface MainStoreInterface {
  userStore: UserStore;
}

export default class MainStore {
  userStore: UserStore;

  constructor() {
    this.userStore = new UserStore(this);
  }
}

const StoresContext = createContext(new MainStore());

export const useStores = () => useContext(StoresContext);
