import { makeAutoObservable } from 'mobx';
import MainStore from './MainStore';

export interface DashboardNavigationInterface {
  repositoryId?: string;
  simulationId?: string;
}

export default class DashboardNavigationStore implements DashboardNavigationInterface {
  private mainStore: MainStore;

  repositoryId?: string | undefined;

  simulationId?: string | undefined;

  constructor(mainStore: MainStore) {
    makeAutoObservable(this);
    this.mainStore = mainStore;
  }

  setRepositoryId(repositoryId: string) {
    this.repositoryId = repositoryId;
  }

  setSimulationId(simulationId: string) {
    this.simulationId = simulationId;
  }
}
