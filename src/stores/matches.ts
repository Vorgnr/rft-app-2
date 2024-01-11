import api from '@/lib/api';

const state = {
  item: {},
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
    .from('matches')
    .request(payload);
};

const actions = {
  save(_, match) {
    const payload = {
      method: 'POST',
      data: match,
    };
    return api
      .from('matches')
      .request(payload);
  },

  async moderate({ commit }, { matchId }) {
    const response = await api
      .from('matches')
      .put(`/${matchId}/moderate`);

    commit('updateItem', response.data);
  },

  async unmoderate({ commit }, { matchId }) {
    const response = await api
      .from('matches')
      .put(`/${matchId}/unmoderate`);

    commit('updateItem', response.data);
  },

  clearMatch({ commit }) {
    commit('setItem', {});
  },

  async penalize({ commit }, body) {
    const response = await api
      .from('matches')
      .post(`/${body.matchId}/penalize`, {
        player1_elo_penalty: body.player1_elo_penalty,
        player2_elo_penalty: body.player2_elo_penalty,
      });

    commit('updateItem', response.data);
  },

  async cancel({ commit }, { matchId }) {
    const response = await api
      .from('matches')
      .put(`/${matchId}/cancel`);

    commit('updateItem', response.data);
  },

  async update({ commit }, { matchId, body }) {
    const response = await api
      .from('matches')
      .put(`/${matchId}`, body);

    commit('updateItem', response.data);
  },

  async getById({ commit }, { matchId }) {
    const response = await callList({ params: { matchId, perPage: 1 } });
    commit('setItem', response.data[0]);
  },

  async fetchMore({ commit }, obj = {}) {
    const response = await callList(obj);
    commit('appendToList', response.data);
  },

  async list({ commit }, obj = {}) {
    const response = await callList(obj);
    commit('setList', response.data);
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
