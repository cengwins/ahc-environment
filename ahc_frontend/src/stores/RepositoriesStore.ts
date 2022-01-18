import {
  makeAutoObservable,
} from 'mobx';
import RequestHandler from '../app/RequestHandler';
import MainStore from './MainStore';

interface RepositoryInfo {
  id: string;
  slug: string;
  name: string;
  upstream: string;
  upstream_type: string;
}

export interface RepositoriesStoreInterface {
  repositories: RepositoryInfo[] | undefined;
  currentRepository: RepositoryInfo | undefined;
  currentMembers: string[];
}

export default class RepositoriesStore implements RepositoriesStoreInterface {
  private mainStore: MainStore;

  repositories: RepositoryInfo[] | undefined = undefined;

  currentRepository: RepositoryInfo | undefined = undefined;

  currentMembers: string[] = [];

  constructor(mainStore: MainStore) {
    makeAutoObservable(this);
    this.mainStore = mainStore;
  }

  async getRepositories() {
    const response = await (new RequestHandler()).request('/repositories/', 'get');
    const { results } = response;
    this.repositories = results;
  }

  async getRepository(id: string) {
    const response = await (new RequestHandler()).request(`/repositories/${id}`, 'get');
    this.currentRepository = response;
  }

  async createRepository(data: {name: string, upstream: string}) {
    const response = await (new RequestHandler()).request('/repositories/', 'post', { ...data, upstream_type: 'GIT' });

    if (this.repositories) this.repositories.unshift(response);
    else this.repositories = [response];
  }

  async deleteRepository(id: string) {
    await (new RequestHandler()).request(`/repositories/${id}`, 'delete');
    if (this.repositories) {
      this.repositories.filter((repository: RepositoryInfo) => repository.id !== id);
    }
  }

  async getMembersOfRepository(id: string) {
    const response = await (new RequestHandler()).request(`/repositories/${id}/members`, 'get');
    this.currentMembers = response;
  }

  async addMemberToRepository(id: string, memberId: string) {
    await (new RequestHandler()).request(`/repositories/${id}/members/${memberId}`, 'post');
    this.currentMembers.push(memberId);
  }

  async removeMembersFromRepository(id: string, memberId: string) {
    await (new RequestHandler()).request(`/repositories/${id}/members/${memberId}`, 'delete');
    this.currentMembers.filter((curMemberId) => curMemberId !== memberId);
  }
}
