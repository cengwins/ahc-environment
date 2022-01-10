import {
  makeAutoObservable,
} from 'mobx';
import RequestHandler from '../app/RequestHandler';
import MainStore from './MainStore';

export interface GithubStoreInterface {
  userRepos: GithubRepo[];

  currentSearchString: string;

  searching: boolean;
}

interface GithubRepo {
  full_name: string,
  html_url: string,
  id: string,
  name: string,
  private: true
}

export default class GithubStore implements GithubStoreInterface {
  private mainStore: MainStore;

  userRepos: GithubRepo[] = [];

  currentSearchString: string = '';

  searching: boolean = false;

  constructor(mainStore: MainStore) {
    makeAutoObservable(this);
    this.mainStore = mainStore;
  }

  static async setGithubToken(data: {access_token: string}) {
    await (new RequestHandler()).request('/github/profile/', 'post', data);
  }

  async getGithubRepos(search: string) {
    this.currentSearchString = search;
    this.searching = true;
    try {
      const response = await (new RequestHandler()).request(`/github/repositories?search=${search}`, 'get');
      this.userRepos = response;
    } finally {
      this.searching = false;
    }
  }
}
