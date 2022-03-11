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

  async setRepositoryId(repositoryId: string) {
    this.repositoryId = repositoryId;
    await this.mainStore.repositoriesStore.getRepository(repositoryId);
  }

  async setExperimentId(experimentId: string) {
    this.experimentId = experimentId;
    await this.mainStore.experimentStore.getExperiment(experimentId);
  }
}
