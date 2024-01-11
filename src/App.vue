<template>
  <div id="app">
    <vue-confirm-dialog class="custom-confirm"></vue-confirm-dialog>
    <top-nav @signout="submitSignout" :is-auth="isAuth" :is-admin="isAdmin"
      v-if="[
      'login',
      'forgotten-password',
      'password-recover'
    ].indexOf($route.name) == -1"
    />
    <notification />
    <div class="main container">
      <router-view v-if="!loading" />
      <div v-if="loading" class="d-flex justify-content-center" style="padding-top: 25vh">
        <div class="spinner-border text-secondary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
    <app-footer v-if="[
      'login',
      'inscription',
      'profile',
      'match',
      'matches.new',
      'forgotten-password',
      'password-recover'
    ].indexOf($route.name) == -1" />
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import TopNav from './components/TopNav.vue';
import AppFooter from './components/AppFooter.vue';
import Notification from './components/Notification.vue';

export default {
  name: 'App',
  components: {
    TopNav,
    Notification,
    AppFooter,
  },

  computed: {
    ...mapGetters('auth', {
      isAuth: 'isAuth',
      isAdmin: 'isAdmin',
      loading: 'loading',
    }),
  },

  methods: {
    ...mapActions('auth', {
      getSession: 'getSession',
      signout: 'signout',
    }),

    async submitSignout() {
      await this.signout();
      if (this.$route.name !== 'home') {
        this.$router.push({ name: 'home' });
      }
    },
  },
};
</script>
