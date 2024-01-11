import api from '@/lib/api';
import { defineStore } from 'pinia';

export const useLeagueStore = defineStore('League', {})
const mutations = {
  setList(s, list) {
    s.list = list;
    const [currentLeague] = list;
    if (currentLeague && !s.currentSelectedLeague) {
      s.currentSelectedLeague = {
        code: currentLeague.id,
        label: currentLeague.name,
        rankTreshold: currentLeague.rank_treshold,
      };
    }
  },

  updateItem(s, league) {
    const list = s.list.map((l) => {
      if (l.id === league.id) {
        return { ...l, ...league, isUpdated: false };
      }
      return l;
    });
    s.list = list;
  },

  appendList(s, league) {
    s.list.push(league);
  },

  setCurrentLeague(s, selectedLeague) {
    localStorage.currentSelectedLeague = JSON.stringify(selectedLeague);
    s.currentSelectedLeague = selectedLeague;
  },
};

const actions = {
  async list({ commit }, params = {}) {
    const payload = {
      method: 'GET',
      params,
    };

    const response = await api
      .from('leagues')
      .request(payload);

    commit('setList', response.data);
  },

  async create({ commit }, { body }) {
    const response = await api
      .from('leagues')
      .post('/', body);

    commit('appendList', response.data);
  },

  async update({ commit }, { leagueId, body }) {
    const response = await api
      .from('leagues')
      .put(`/${leagueId}`, body);

    commit('updateItem', response.data);
  },

  setCurrentLeague({ commit }, selectedLeague) {
    commit('setCurrentLeague', selectedLeague);
  },
};

const getters = {
  list: (s) => s.list,
  currentLeagueId: (s) => s.currentLeagueId,
  currentSelectedLeague: (s) => s.currentSelectedLeague,
};

export default {
  namespaced: true,
  actions,
  mutations,
  state: {
    isLazy: false,
    list: [],
    currentSelectedLeague: localStorage.currentSelectedLeague
      && JSON.parse(localStorage.currentSelectedLeague),
  },
  getters,
};
