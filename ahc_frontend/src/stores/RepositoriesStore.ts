import {
  makeAutoObservable,
} from 'mobx';
import axios from 'axios';
import RequestHandler from '../app/RequestHandler';
import MainStore from './MainStore';

export interface RepositoryInfo {
  id: string;
  slug: string;
  name: string;
  description: string;
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

  currentAhcYAML: String | undefined = undefined;

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
    this.currentAhcYAML = undefined;
  }

  async createRepository(data: {name: string, upstream: string}) {
    const response = await (new RequestHandler()).request('/repositories/', 'post', { ...data, upstream_type: 'GIT' });

    if (this.repositories) this.repositories.unshift(response);
    else this.repositories = [response];
  }

  async deleteRepositories(ids: string[]) {
    const removedIds: string[] = [];
    await Promise.all(ids.map(async (id) => {
      await (new RequestHandler()).request(`/repositories/${id}`, 'delete').then(() => removedIds.push(id));
    }));
    if (this.repositories) {
      this.repositories = this.repositories.filter(
        (repository: RepositoryInfo) => !removedIds.includes(repository.id),
      );
    }
    return removedIds;
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

  async getAhcYAML() {
    if (!this.currentRepository) throw Error('No repository selected');
    const { upstream } = this.currentRepository;
    axios.get(`${upstream.replace('github.com', 'raw.githubusercontent.com')}/main/ahc.yml`)
      .then((response) => { this.currentAhcYAML = response.data; })
      .catch(() => {
        axios.get(`${upstream.replace('github.com', 'raw.githubusercontent.com')}/main/ahc.yaml`)
          .then((response) => { this.currentAhcYAML = response.data; })
          .catch(() => {
            axios.get(`${upstream.replace('github.com', 'raw.githubusercontent.com')}/main/.ahc.yml`)
              .then((response) => { this.currentAhcYAML = response.data; })
              .catch(() => {
                axios.get(`${upstream.replace('github.com', 'raw.githubusercontent.com')}/main/.ahc.yaml`)
                  .then((response) => { this.currentAhcYAML = response.data; })
                  .catch(() => { this.currentAhcYAML = undefined; });
              });
          });
      });
  }
}
