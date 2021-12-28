import { createContext, useContext } from 'react';
import DashboardNavigationStore from './DashboardNavigationStore';
import NotificationStore from './NotificationStore';
import UserStore from './UserStore';

export interface MainStoreInterface {
  userStore: UserStore;
  notificationStore: NotificationStore;
  dashboardNavigationStore: DashboardNavigationStore;
}

export default class MainStore implements MainStoreInterface {
  userStore: UserStore;

  notificationStore: NotificationStore;

  dashboardNavigationStore: DashboardNavigationStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.notificationStore = new NotificationStore(this);
    this.dashboardNavigationStore = new DashboardNavigationStore(this);
  }
}

const StoresContext = createContext(new MainStore());

export const useStores = () => useContext(StoresContext);
