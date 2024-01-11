let counter = 0;

const state = {
  notifications: [],
};

const mutations = {
  add(s, notification) {
    s.notifications.push(notification);
  },
  drop(s, notification) {
    let idx = -1;
    if (typeof notification === 'number') {
      for (let i = 0; i < s.notifications.length; i += 1) {
        if (s.notifications[i].id === notification) {
          idx = i;
          break;
        }
      }
    } else {
      idx = s.notifications.indexOf(notification);
    }
    if (idx >= 0) {
      s.notifications.splice(idx, 1);
    }
  },
};

const actions = {
  add: ({ commit, dispatch }, notification) => {
    counter += 1;
    commit('add', {
      id: counter,
      title: notification.title,
      type: notification.type,
      message: notification.message,
    });

    setTimeout(() => {
      dispatch('drop', counter);
    }, (notification.ttl || 4) * 1000);
  },
  drop: ({ commit }, notification) => commit('drop', notification),
  addError: ({ dispatch }, err) => dispatch('add', {
    title: err,
    type: 'error',
    ttl: 7,
  }),
};

const getters = {
  list: (s) => s.notifications,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
