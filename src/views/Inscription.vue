<template>
  <div class="row">
    <div class="col-md-6 offset-md-2">
    <h1>Nouveau joueur</h1>
      <form>
        <fieldset>
          <div class="form-group">
            <label for="name">Pseudo</label>
            <input
              class="form-control"
              v-model="player.name"
              type="text"
              placeholder="Pseudo"
              :class="{'is-valid':player.name}"
            />
          </div>
          <div class="form-group">
            <label for="name">Email</label>
            <input
              class="form-control"
              v-model="player.email"
              type="email"
              placeholder="Email"
              :class="{'is-valid':player.email}"
            />
          </div>
          <div class="form-group">
            <label for="name">Main</label>
            <character-select v-model="player.main_character" placeholder="Main"/>
          </div>
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              :class="passwordValidityToCss"
              v-model="player.password"
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
          class="btn btn-secondary"
          type="button"
          :disabled="loading()"
        >
          <span
            v-if="loading()"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Get ready for ...
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import CharacterSelect from '../components/CharacterSelect.vue';

export default {
  name: 'Inscription',
  title: 'Inscription',
  components: {
    CharacterSelect,
  },

  data() {
    return {
      selectedCharacter: null,
      confirmationPassword: null,
      player: {
        name: '',
        main_character: null,
        password: null,
      },
    };
  },

  computed: {
    passwordValidity() {
      if (!this.confirmationPassword) {
        return null;
      }

      return this.confirmationPassword === this.player.password;
    },

    passwordValidityToCss() {
      const validity = this.passwordValidity;
      if (validity === null) return '';
      return validity ? 'is-valid' : 'is-invalid';
    },

    formValid() {
      if (!this.player.password) return false;
      return this.player.name && this.confirmationPassword === this.player.password;
    },
  },

  methods: {
    ...mapActions('players', {
      save: 'save',
    }),

    ...mapActions('notifications', {
      notify: 'add',
      notifyError: 'addError',
    }),

    ...mapGetters({
      loading: 'net/loading',
    }),

    async submit() {
      try {
        await this.save(this.player);
        this.notify({ title: 'Joueur enregistré', type: 'success' });
        this.$router.push({ name: 'home' });
      } catch (e) {
        this.notifyError(e);
      }
    },
  },
};
</script>
