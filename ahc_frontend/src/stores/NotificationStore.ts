import { AlertColor } from '@mui/material';
import {
  autorun,
  makeAutoObservable,
} from 'mobx';
import MainStore from './MainStore';

export interface NotificationInterface {
  id: number;
  variant: AlertColor;
  text: string;
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
    this.currentNotificationId += 1;
    const notificationId = this.currentNotificationId;
    const notification: NotificationInterface = {
      id: notificationId, variant, text,
    };
    this.notifications[notificationId] = notification;
    autorun(
      () => this.clear(notificationId),
      { scheduler: (run) => { setTimeout(run, timeOut); } },
    );
  }

  clear(notificationId: number) {
    delete this.notifications[notificationId];
  }
}
