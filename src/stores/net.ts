const state = {
  pending: 0,
};

const mutations = {
  increment(s) {
    s.pending += 1;
  },
  decrement(s) {
    s.pending = Math.max(0, state.s - 1);
  },
};

const getters = {
  loading: (s) => s.pending > 0,
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
