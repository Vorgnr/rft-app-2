import api from '@/lib/api';
import type { League } from '@/types/league';
import { defineStore } from 'pinia';

type LeagueState = {
  isLazy: boolean,
  list: League[],
  currentSelectedLeague: League
}

export const useLeagueStore = defineStore('League', {
  state(): LeagueState {
    return {
      isLazy: false,
      list: [],
      currentSelectedLeague: localStorage.currentSelectedLeague
        && JSON.parse(localStorage.currentSelectedLeague),
    }
  },

  getters: {
    currentLeagueId(): string {
      return this.currentSelectedLeague.id
    }
  },

  actions: {
    setList(list: League[]) {
      this.list = list;
      const [currentLeague] = list;
      if (currentLeague && !this.currentSelectedLeague) {
        this.currentSelectedLeague = currentLeague;
      }
    },
  
    updateItem(league: League) {
      const list: League[] = this.list.map((l) => {
        if (l.id === league.id) {
          return { ...l, ...league };
        }
        return l;
      });
      this.list = list as League[];
    },
  
    appendList(league: League) {
      this.list.push(league);
    },
  
    setCurrentLeague(selectedLeague: League) {
      localStorage.currentSelectedLeague = JSON.stringify(selectedLeague);
      this.currentSelectedLeague = selectedLeague;
    },

    async fetchList(params = {}) {
      const payload = {
        method: 'GET',
        params,
      };
  
      const response = await api
        .from('leagues')
        .request(payload);
  
      this.setList(response.data);
    },
  
    async create(league: League) {
      const response = await api
        .from('leagues')
        .post('/', league);
  
      this.appendList(response.data);
    },
  
    async update(leagueId: string, body: League) {
      const response = await api
        .from('leagues')
        .put(`/${leagueId}`, body);
  
      this.updateItem(response.data);
    },
  }
});
