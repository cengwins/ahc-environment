import { AlertColor } from '@mui/material';
import {
  autorun,
  makeAutoObservable,
} from 'mobx';
import MainStore from './MainStore';

export interface NotificationInterface {
  variant: AlertColor;
  text?: string;
}

interface NotificationStoreInterface {
  notifications: {[notificationId: string]: NotificationInterface};
}

export default class NotificationStore implements NotificationStoreInterface {
  private mainStore: MainStore;

  notifications: {[notificationId: number]: NotificationInterface} = {};

  private currentNotificationId = 0;

  constructor(mainStore: MainStore) {
    makeAutoObservable(this);
    this.mainStore = mainStore;
  }

  set(
    variant: AlertColor,
    text: string,
    timeOut: number = 5000,
  ) {
    const notification: NotificationInterface = {
      variant, text,
    };
    const notificationId = this.currentNotificationId;
    this.notifications[notificationId] = notification;
    this.currentNotificationId += 1;
    autorun(
      () => this.clear(notificationId),
      { scheduler: (run) => { setTimeout(run, timeOut); } },
    );
  }

  clear(notificationId: number) {
    delete this.notifications[notificationId];
  }
}
