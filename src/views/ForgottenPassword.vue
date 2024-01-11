<template>
  <div>
    <div class="row">
      <div class="col-md-2 offset-md-2">
        <a @click="$router.go(-1)">
          <v-icon name="arrow-left" />Retour
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col-md-5 offset-md-2  mt-4">
        <h1>Mot de passe oublié</h1>
        <form>
          <fieldset>
            <div class="form-group">
              <label for="name">Email</label>
              <input
                class="form-control"
                v-model="email"
                type="text"
                placeholder="Email"
              />
            </div>
          </fieldset>
          <button
            v-if="email"
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
  name: 'ForgottenPassword',
  title: 'Mot de passe oublié',

  data() {
    return {
      email: null,
    };
  },

  methods: {
    ...mapActions('players', {
      requestPasswordRecover: 'requestPasswordRecover',
    }),

    ...mapActions('notifications', {
      notify: 'add',
      notifyError: 'addError',
    }),

    async submit() {
      try {
        await this.requestPasswordRecover(this.email);
        this.notify({ title: 'Demande de réinitialisation faite', type: 'success' });
        this.$router.push({ name: 'home' });
      } catch (e) {
        this.notifyError(e);
      }
    },
  },
};
</script>
