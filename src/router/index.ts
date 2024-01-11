import { createRouter, createWebHistory } from 'vue-router';
import store from '../stores';

const mustBeAuth = (to, from, next) => {
  if (store.getters['auth/isAuth']) {
    next();
  } else {
    next({ name: 'login', query: { redirect: to.path } });
  }
};

const mustBeAdmin = (to, from, next) => {
  if (store.getters['auth/isAuth'] && store.getters['auth/isAdmin']) {
    next();
  } else {
    next({ name: 'home' });
  }
};

const routes = [
  {
    name: 'login',
    path: '/login',
    component: () => import('../views/Login.vue'),
  },
  {
    name: 'home',
    path: '/',
    component: () => import('../views/Leaderboard.vue'),
  },
  {
    name: 'rules',
    path: '/rules',
    component: () => import('../views/Rules.vue'),
  },
  {
    name: 'forgotten-password',
    path: '/forgotten-password',
    component: () => import('../views/ForgottenPassword.vue'),
  },
  {
    name: 'password-recover',
    path: '/password-recover/:token',
    component: () => import('../views/PasswordRecover.vue'),
  },
  {
    name: 'inscription',
    path: '/inscription',
    component: () => import('../views/Inscription.vue'),
  },
  {
    name: 'matches',
    path: '/matches',
    component: () => import('../views/Matches.vue'),
  },
  {
    name: 'matches.new',
    path: '/matches/new',
    component: () => import('../views/CreateMatch.vue'),
    beforeEnter: mustBeAuth,
  },
  {
    path: '/matches/:id',
    name: 'match',
    component: () => import('../views/Match.vue'),
    beforeEnter: mustBeAuth,
  },
  {
    name: 'profile',
    path: '/profile',
    component: () => import('../views/Player.vue'),
    beforeEnter: mustBeAuth,
  },
  {
    path: '/players/:id',
    name: 'player',
    component: () => import('../views/Player.vue'),
    beforeEnter: mustBeAdmin,
  },
  {
    path: '/my-chart',
    name: 'my-chart',
    component: () => import('../views/Chart.vue'),
    beforeEnter: mustBeAuth,
  },
  {
    path: '/chart/:id',
    name: 'chart',
    component: () => import('../views/Chart.vue'),
  },
  {
    path: '/admin/leagues',
    beforeEnter: mustBeAdmin,
    component: () => import('../views/admin/Leagues.vue'),
  },
  {
    path: '/*',
    component: () => import('../views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  await store.dispatch('auth/getSession');
  next();
});

export default router
