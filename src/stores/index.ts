import { createStore } from 'vuex';

import players from './players';
import matches from './matches';
import leagues from './leagues';
import net from './net';
import notifications from './notifications';
import auth from './auth';

export default createStore({
  modules: {
    players,
    matches,
    leagues,
    net,
    notifications,
    auth,
  },
});
