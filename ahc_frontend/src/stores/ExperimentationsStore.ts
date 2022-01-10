import {
  makeAutoObservable,
} from 'mobx';
import RequestHandler from '../app/RequestHandler';
import MainStore from './MainStore';

interface ExperimentationInfo {
  id: string;
}

export interface ExperimentationsStoreInterface {
  experimentations: ExperimentationInfo[];
  currentExperimentation: ExperimentationInfo | undefined;
}

export default class ExperimentationsStore implements ExperimentationsStoreInterface {
  private mainStore: MainStore;

  experimentations: ExperimentationInfo[] = [];

  currentExperimentation: ExperimentationInfo | undefined = undefined;

  constructor(mainStore: MainStore) {
    makeAutoObservable(this);
    this.mainStore = mainStore;
  }

  async getExperimentations() {
    const response = await (new RequestHandler()).request('/repositories/', 'get');
    this.experimentations = response;
  }

  async getRepository(id: string) {
    const response = await (new RequestHandler()).request(`/repositories/${id}`, 'get');
    this.currentExperimentation = response;
  }

  async deleteRepository(id: string) {
    await (new RequestHandler()).request(`/repositories/${id}`, 'delete');
    this.experimentations.filter((repository: ExperimentationInfo) => repository.id !== id);
  }
}
