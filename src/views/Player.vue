<template>
  <div class="row" v-if="player">
    <div class="col-md-6 offset-md-2">
      <h1>{{title}}</h1>
      <form>
        <fieldset>
          <div class="form-group">
            <label for="name">Pseudo</label>
            <input
              class="form-control"
              v-model="player.name"
              type="text"
              placeholder="Pseudo"
            />
          </div>
          <div class="form-group">
            <label for="name">Email</label>
            <input
              class="form-control"
              v-model="player.email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div class="form-group">
            <label for="name">Main</label>
            <character-select v-model="player.main_character" placeholder="Main" />
          </div>
          <div class="form-group">
            <div
              class="custom-control custom-switch"
              @click="player.is_frozen = !player.is_frozen">
              <input
                type="checkbox" class="custom-control-input" v-model="player.is_frozen"/>
              <label class="custom-control-label pointer">Frozen</label>
            </div>
            <div
              v-if="isAdmin" class="custom-control custom-switch"
              @click="player.is_admin = !player.is_admin">
              <input type="checkbox" class="custom-control-input" v-model="player.is_admin" />
              <label class="custom-control-label pointer">Administrateur</label>
            </div>
          </div>
        </fieldset>
        <button
          v-if="isAdmin || authPlayer.id === player.id"
          @click="submit"
          class="btn btn-primary"
          type="button"
        > Modifier </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import store from '@/store';
import CharacterSelect from '../components/CharacterSelect.vue';

export default {
  name: 'Player',
  title: 'Joueur',
  components: { CharacterSelect },

  computed: {
    ...mapGetters('players', {
      player: 'item',
    }),
    ...mapGetters('auth', {
      isAdmin: 'isAdmin',
      authPlayer: 'player',
    }),

    title() {
      if (this.isProfileMode) {
        return 'Mes informations';
      }
      return this.player.name;
    },

    isProfileMode() {
      return !this.$route.params.id;
    },
  },

  methods: {
    ...mapActions('players', {
      getById: 'getById',
      update: 'update',
    }),
    ...mapActions('notifications', {
      notify: 'add',
      notifyError: 'addError',
    }),

    async getPlayer() {
      try {
        const playerId = this.isProfileMode ? this.authPlayer.id : this.$route.params.id;
        await this.getById({ playerId });
      } catch (e) {
        this.notifyError(e);
      }
    },

    async submit() {
      try {
        await this.update({ playerId: this.player.id, body: this.player });
        this.notify({ title: 'Joueur modifié', type: 'success' });
        this.$router.push({ name: 'home' });
      } catch (e) {
        this.notifyError(e);
      }
    },
  },

  async beforeRouteEnter(to, from, next) {
    store.dispatch('players/clearPlayer')
      .then(() => {
        next((vm) => vm.getPlayer());
      });
  },
};
</script>
