import api from '@/lib/api';
import { defineStore } from 'pinia';

type LeagueState = {
  isLazy: boolean,
  list: any[],
  // TODO league type
  currentSelectedLeague: any
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
    currentLeagueId(): number {
      return this.currentSelectedLeague.currentLeagueId
    }
  },

  actions: {
    setList(list) {
      this.list = list;
      const [currentLeague] = list;
      if (currentLeague && !this.currentSelectedLeague) {
        this.currentSelectedLeague = {
          code: currentLeague.id,
          label: currentLeague.name,
          rankTreshold: currentLeague.rank_treshold,
        };
      }
    },
  
    updateItem(league) {
      const list = this.list.map((l) => {
        if (l.id === league.id) {
          return { ...l, ...league, isUpdated: false };
        }
        return l;
      });
      this.list = list;
    },
  
    appendList(league) {
      this.list.push(league);
    },
  
    setCurrentLeague(selectedLeague) {
      localStorage.currentSelectedLeague = JSON.stringify(selectedLeague);
      this.currentSelectedLeague = selectedLeague;
    },

    async list(params = {}) {
      const payload = {
        method: 'GET',
        params,
      };
  
      const response = await api
        .from('leagues')
        .request(payload);
  
      this.setList(response.data);
    },
  
    async create({ body }) {
      const response = await api
        .from('leagues')
        .post('/', body);
  
      this.appendList(response.data);
    },
  
    async update({ leagueId, body }) {
      const response = await api
        .from('leagues')
        .put(`/${leagueId}`, body);
  
      this.updateItem(response.data);
    },
  }
});

const mutations = {

};
