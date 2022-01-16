import { makeAutoObservable } from 'mobx';
import MainStore from './MainStore';

export interface DashboardNavigationInterface {
  repositoryId?: string;
  experimentId?: string;
}

export default class DashboardNavigationStore implements DashboardNavigationInterface {
  private mainStore: MainStore;

  repositoryId?: string | undefined;

  experimentId?: string | undefined;

  constructor(mainStore: MainStore) {
    makeAutoObservable(this);
    this.mainStore = mainStore;
  }

  setRepositoryId(repositoryId: string) {
    this.repositoryId = repositoryId;
  }

  setExperimentId(experimentId: string) {
    this.experimentId = experimentId;
  }
}
