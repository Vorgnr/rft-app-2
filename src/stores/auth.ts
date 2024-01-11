import api from '@/lib/api';

import { defineStore } from 'pinia';

type AuthState = {
  isAuth: boolean,
  email?: string,
  password?: string,
  error?: string,
  // TODO type player
  player?: any,
  isLoading: boolean,
}

export const useAuthStore = defineStore('Auth', {
  state(): AuthState {
    return {
      isAuth: false,
      email: undefined,
      password: undefined,
      error: undefined,
      player: undefined,
      isLoading: true,
    }
  },

  getters: {
    isAdmin(): boolean | undefined {
      return this.player && Boolean(this.player.is_admin);
    }
  },

  actions: {
    setError(error: any) {
      this.error = error.toString();
    },

    setPlayer(player: any) {
      this.isAuth = true;
      this.player = player;
    },

    clearAuth() {
      this.isAuth = false;
      this.player = undefined;
    },

    setLoading(l: boolean) {
      this.isLoading = l;
    },

    async signin(form: any) {
      try {
        const request = await api
          .from('auth')
          .post('/signin', form);
        this.setPlayer(request.data);
      } catch (err) {
        this.setError(err);
      }
    },
  
    async signout() {
      try {
        await api
          .from('auth')
          .post('/signout');
        this.clearAuth()
      } catch (err) {
        this.setError(err);
      }
    },
  
    async getSession() {
      if (!this.isAuth) {
        const request = await api
          .from('auth')
          .get('/');
  
        if (request.data) {
          this.setPlayer(request.data);
        }
      }
      this.setLoading(false);
    },
  },
})
