import { makeAutoObservable } from 'mobx';
import RequestHandler from '../app/RequestHandler';
import MainStore from './MainStore';

interface ExperimentationInfo {
  id: string;
  sequence_id: number,
  commit: string,
  reference: string,
  reference_type: string,
  created_at: Date,
  updated_at: Date,
}

export interface ExperimentationsStoreInterface {
  currentExperimentations: ExperimentationInfo[] | undefined;
  currentExperimentation: ExperimentationInfo | undefined;
}

export default class ExperimentationsStore implements ExperimentationsStoreInterface {
  private mainStore: MainStore;

  currentExperimentations: ExperimentationInfo[] | undefined;

  currentExperimentation: ExperimentationInfo | undefined;

  constructor(mainStore: MainStore) {
    makeAutoObservable(this);
    this.mainStore = mainStore;
  }

  async getExperimentations() {
    const { currentRepository } = this.mainStore.repositoriesStore;
    if (!currentRepository) throw Error('You are not in a repository');
    const response = await (new RequestHandler()).request(`/repositories/${currentRepository.id}/experiments/`, 'get');
    const { results } = response;
    this.currentExperimentations = results;
  }

  async getExperiment(id: string) {
    const { currentRepository } = this.mainStore.repositoriesStore;
    if (!currentRepository) throw Error('You are not in a repository');
    const response = await (new RequestHandler()).request(`/repositories/${currentRepository.id}/experiments/${id}`, 'get');
    this.currentExperimentation = response;
  }

  async createExperiment() {
    const { currentRepository } = this.mainStore.repositoriesStore;
    if (!currentRepository) throw Error('You are not in a repository');
    const response = await (new RequestHandler()).request(
      `/repositories/${currentRepository.id}/experiments/`,
      'post',
      { reference: 'main', reference_type: 'BRANCH' },
    );
    if (this.currentExperimentations) this.currentExperimentations.push(response);
    else this.currentExperimentations = [response];
  }

  async deleteExperiment(id: string) {
    const { currentRepository } = this.mainStore.repositoriesStore;
    if (!currentRepository) throw Error('You are not in a repository');
    await (new RequestHandler()).request(`/repositories/${currentRepository.id}`, 'delete');
    if (this.currentExperimentations) {
      this.currentExperimentations.filter(
        (repository: ExperimentationInfo) => repository.id !== id,
      );
    }
  }
}
