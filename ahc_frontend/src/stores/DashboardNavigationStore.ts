import { makeAutoObservable } from 'mobx';
import MainStore from './MainStore';

export interface DashboardNavigationInterface {
  projectId?: string;
  simulationId?: string;
}

export default class DashboardNavigationStore implements DashboardNavigationInterface {
  private mainStore: MainStore;

  projectId?: string | undefined;

  simulationId?: string | undefined;

  constructor(mainStore: MainStore) {
    makeAutoObservable(this);
    this.mainStore = mainStore;
  }

  setProjectId(projectId: string) {
    this.projectId = projectId;
  }

  setSimulationId(simulationId: string) {
    this.simulationId = simulationId;
  }
}
