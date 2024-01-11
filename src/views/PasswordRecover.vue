<template>
  <div>
    <div class="row">
      <div class="col-md-2 offset-md-2">
        <router-link
          tag="a"
          to="/">
          <v-icon name="arrow-left" />Retour
        </router-link>
      </div>
    </div>
    <div class="row">
      <div class="col-md-5 offset-md-2  mt-4">
        <h1>Changement de mot de passe</h1>
        <form>
          <fieldset>
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              :class="passwordValidityToCss"
              v-model="password"
              type="password"
              class="form-control" />
          </div>
          <div class="form-group">
            <label for="password">Confirmation</label>
            <input
              :class="passwordValidityToCss"
              v-model="confirmationPassword"
              type="password"
              class="form-control" />
          </div>
          </fieldset>
          <button
            v-if="formValid"
            @click="submit"
            class="btn btn-primary mt-3"
            type="button"
            > Réinitialiser le mot de passe </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex';

export default {
  name: 'PasswordRecover',
  title: 'Réinitialisation du mot de passe',

  data() {
    return {
      confirmationPassword: null,
      password: null,
    };
  },

  computed: {
    passwordValidity() {
      if (!this.confirmationPassword) {
        return null;
      }

      return this.confirmationPassword === this.password;
    },

    passwordValidityToCss() {
      const validity = this.passwordValidity;
      if (validity === null) return '';
      return validity ? 'is-valid' : 'is-invalid';
    },

    formValid() {
      if (!this.password) return false;
      return this.confirmationPassword === this.password;
    },
  },

  methods: {
    ...mapActions('players', {
      recoverPassword: 'recoverPassword',
    }),

    ...mapActions('notifications', {
      notify: 'add',
      notifyError: 'addError',
    }),

    async submit() {
      try {
        await this.recoverPassword({ token: this.$route.params.token, password: this.password });
        this.notify({ title: 'Mot de passe réinitialisé', type: 'success' });
        this.$router.push({ name: 'login' });
      } catch (e) {
        this.notifyError(e);
      }
    },
  },
};
</script>
