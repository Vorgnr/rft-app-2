import api from '@/lib/api';

const state = {
  item: null,
  list: [],
  noMoreItems: false,
};

const mutations = {
  setList(s, list) {
    s.list = list;
    s.noMoreItems = !list.length;
  },
  appendToList(s, list) {
    if (list.length) {
      s.list = [...s.list, ...list];
    } else {
      s.noMoreItems = true;
    }
  },
  setItem(s, item) {
    s.item = item;
  },
  updateItem(s, item) {
    s.item = { ...s.item, ...item };
  },
};

const callList = (obj) => {
  const payload = {
    method: 'GET',
    params: obj.params,
  };

  return api
    .from('players')
    .request(payload);
};

const actions = {
  save(_, player) {
    const payload = {
      method: 'POST',
      data: player,
    };
    return api
      .from('players')
      .request(payload);
  },

  clearPlayer({ commit }) {
    commit('setItem', null);
  },

  async fetchMore({ commit }, obj = {}) {
    const response = await callList(obj);
    commit('appendToList', response.data);
  },

  async list({ commit }, obj = {}) {
    const response = await callList(obj);
    commit('setList', response.data);
  },

  async update({ commit }, { playerId, body }) {
    const response = await api
      .from('players')
      .put(`/${playerId}`, body);

    commit('updateItem', response.data);
  },

  async getById({ commit }, { playerId }) {
    const payload = {
      method: 'GET',
    };
    const response = await api
      .from(`players/${playerId}`)
      .request(payload);
    commit('setItem', response.data);
  },

  async requestPasswordRecover(_, email) {
    return api
      .from('players')
      .post('/recover-password-request', { email });
  },

  async recoverPassword(_, body) {
    return api
      .from('players')
      .post('/recover-password', body);
  },
};

const getters = {
  list: (s) => s.list,
  noMoreItems: (s) => s.noMoreItems,
  item: (s) => s.item,
};

export default {
  namespaced: true,
  actions,
  mutations,
  state,
  getters,
};
