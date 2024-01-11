<template>
  <div>
    <div v-if="error" class="row">
      <div class="col-md-6 offset-md-3">
        <div class="alert alert-warning">{{ error }}</div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3 offset-md-3 mt-4">
        <a @click="$router.go(-1)">
          <v-icon name="arrow-left" />Retour
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card border-dark mb-3 mt-3">
          <div class="card-header">
            <div class="center">
              <img width="146" height="55" alt="Vue logo" src="@/assets/logo.png" />
            </div>
          </div>
          <div class="card-body">
            <div class="form-group" @keyup.enter="validForm">
              <label>Email</label>
              <input
                :class="{'is-invalid': emailEmpty === true}"
                v-model="player.email"
                class="form-control"
                placeholder="Email"
              />
            </div>
            <div class="form-group" @keyup.enter="validForm">
              <label>Mot de passe</label>
              <input
                :class="{'is-invalid': passwordEmpty === true}"
                v-model="player.password"
                type="password"
                class="form-control"
                placeholder="Mot de passe"
              />
            </div>
          </div>
          <div class="card-footer">
            <button
              @click="validForm"
              type="button"
              class="btn btn-outline-secondary btn-lg btn-block"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span>Me connecter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3 offset-md-3">
        <router-link
          tag="a"
          to="/forgotten-password"
          class="center">
        Mot de passe oublié</router-link>
      </div>
      <div class="col-md-3">
        <router-link class="center" tag="a" to="/inscription">Inscription</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  text-align: center;
}
</style>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Login',
  title: 'Login',

  data() {
    return {
      player: {
        email: null,
        password: null,
      },
      loading: false,
      emailEmpty: null,
      passwordEmpty: null,
    };
  },

  computed: {
    ...mapGetters('auth', {
      error: 'error',
      isAuth: 'isAuth',
    }),
  },

  methods: {
    ...mapActions('auth', {
      signin: 'signin',
    }),
    async validForm() {
      let formValid = true;
      if (!this.player.email) {
        this.emailEmpty = true;
        formValid = false;
      } else {
        this.emailEmpty = null;
      }
      if (!this.player.password) {
        this.passwordEmpty = true;
        formValid = false;
      } else {
        this.passwordEmpty = null;
      }

      if (formValid) {
        this.loading = true;
        await this.signin(this.player);
        if (this.isAuth) {
          this.$router.push(this.$route.query.redirect || '/');
        }
        this.loading = false;
      }
    },
  },
};
</script>
