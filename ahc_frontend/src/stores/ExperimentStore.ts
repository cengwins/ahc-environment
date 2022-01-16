import { makeAutoObservable } from 'mobx';
import RequestHandler from '../app/RequestHandler';
import MainStore from './MainStore';

interface RunInfo {
  id: string,
  sequence_id: number,
  created_at: Date,
  updated_at: Date,
  started_at: Date,
  finished_at: Date,
  exit_code: number,
  log_path: string,
}

interface ExperimentInfo {
  id: string,
  sequence_id: number,
  commit: string,
  reference: string,
  reference_type: string,
  created_at: Date,
  updated_at: Date,
  runs?: RunInfo[],
}

export interface ExperimentStoreInterface {
  currentExperiments: ExperimentInfo[] | undefined;
  currentExperiment: ExperimentInfo | undefined;
}

export default class ExperimentStore implements ExperimentStoreInterface {
  private mainStore: MainStore;

  currentExperiments: ExperimentInfo[] | undefined;

  currentExperiment: ExperimentInfo | undefined;

  constructor(mainStore: MainStore) {
    makeAutoObservable(this);
    this.mainStore = mainStore;
  }

  async getExperiments() {
    const { currentRepository } = this.mainStore.repositoriesStore;
    if (!currentRepository) throw Error('You are not in a repository');
    const response = await (new RequestHandler()).request(`/repositories/${currentRepository.id}/experiments/`, 'get');
    const { results } = response;
    this.currentExperiments = results;
  }

  async getExperiment(id: string) {
    const { currentRepository } = this.mainStore.repositoriesStore;
    if (!currentRepository) throw Error('You are not in a repository');
    const response = await (new RequestHandler()).request(`/repositories/${currentRepository.id}/experiments/${id}`, 'get');
    this.currentExperiment = response;
  }

  async createExperiment() {
    const { currentRepository } = this.mainStore.repositoriesStore;
    if (!currentRepository) throw Error('You are not in a repository');
    const response = await (new RequestHandler()).request(
      `/repositories/${currentRepository.id}/experiments/`,
      'post',
      { reference: 'main', reference_type: 'BRANCH' },
    );
    if (this.currentExperiments) this.currentExperiments.push(response);
    else this.currentExperiments = [response];
  }

  async deleteExperiment(id: string) {
    const { currentRepository } = this.mainStore.repositoriesStore;
    if (!currentRepository) throw Error('You are not in a repository');
    await (new RequestHandler()).request(`/repositories/${currentRepository.id}`, 'delete');
    if (this.currentExperiments) {
      this.currentExperiments.filter(
        (repository: ExperimentInfo) => repository.id !== id,
      );
    }
  }
}
