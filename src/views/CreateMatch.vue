<template>
<div>
    <div class="row">
      <div class="col-md-2 offset-md-1 mt-2">
        <a @click="$router.go(-1)">
          <v-icon name="arrow-left" />Retour
        </a>
      </div>
    </div>
  <div class="row">
    <div class="col-md-10 offset-md-1 mt-3">
    <h1>Nouveau match</h1>
    <div class="row">
      <div class="col">
        <div class="form-group">
          <label>Saison</label>
          <v-select
            :options="leagues.map(({ id, name }) => ({ label: name, code: id }))"
            v-model="selectedLeague"
            @input="validForm"
          />
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <label for="name">FT</label>
          <input class="form-control col-md-2" type="number" placeholder="FT" v-model="match.ft" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="form-group">
          <label>Joueur 1</label>
          <player-select
            :players="match.player2_id
              ? players.filter(p => match.player2_id !== p.id)
              : players"
            v-model="match.player1_id"
            :selectable="player => !player.is_frozen"
            @input="validForm"
          />
          <small class="form-text text-muted">Le joueur 1 défi le joueur 2 </small>
        </div>
      </div>
      <div class="col">
        <div class="form-group" v-if="match.player1_id">
          <label>Joueur 2</label>
          <player-select
            :players="match.player1_id
              ? players.filter(p => match.player1_id !== p.id)
              : players"
            v-model="match.player2_id"
            :selectable="player => !player.is_frozen"
            @input="validForm"
          />
        </div>
      </div>
    </div>
    <div v-if="match.player1_id && match.player2_id">
      <div class="row">
        <div class="col">
          <div class="alert alert-dismissible alert-info">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            Vous pouvez laisser les scores vides si la rencontre n'a pas encore eu lieu.
          </div>
        </div>
      </div>
      <div class="row" >
        <div class="col">
          <div class="form-group">
            <label for="name">Score player 1</label>
            <input
              class="form-control col-md-4"
              type="number"
              placeholder="Score player 1"
              v-model="match.player1_score"
            />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="name">Score player 2</label>
            <input
              class="form-control col-md-4"
              type="number"
              placeholder="Score player 2"
              v-model="match.player2_score"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label>Perso player 1</label>
            <character-select
              v-model="match.character1"
              placeholder="Perso player 1"
              multiple
            />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label>Perso player 2</label>
            <character-select
              v-model="match.character2"
              placeholder="Perso player 2"
              multiple
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button
          v-if="matchIsValid"
          @click="submit"
          class="btn btn-primary"
          type="button"
          :disabled="loading()"
        >
          <span
            v-if="loading()"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Fight
        </button>
      </div>
    </div>
  </div>
  </div>
  </div>
</template>

<script lang="ts">
import vSelect from 'vue3-select';
import { mapActions, mapGetters } from 'vuex';
import PlayerSelect from '../components/PlayerSelect.vue';
import CharacterSelect from '../components/CharacterSelect.vue';

export default {
  name: 'CreateMatch',
  title: 'Nouveau match',
  components: { vSelect, PlayerSelect, CharacterSelect },

  data() {
    return {
      matchIsValid: false,
      selectedLeague: null,
      match: {
        ft: 10,
      },
    };
  },

  computed: {
    ...mapGetters('players', {
      players: 'list',
    }),
    ...mapGetters('leagues', {
      leagues: 'list',
    }),
  },

  methods: {
    ...mapActions('matches', {
      save: 'save',
    }),
    ...mapActions('players', {
      listPlayers: 'list',
    }),
    ...mapActions('leagues', {
      listLeagues: 'list',
    }),
    ...mapActions('notifications', {
      notify: 'add',
      notifyError: 'addError',
    }),

    ...mapGetters({
      loading: 'net/loading',
    }),

    async getPlayers() {
      try {
        await this.listPlayers();
      } catch (e) {
        this.notifyError(e);
      }
    },

    async getLeagues() {
      try {
        await this.listLeagues();
      } catch (e) {
        this.notifyError(e);
      }
    },

    async submit() {
      const match = {
        ...this.match,
        league_id: this.selectedLeague.code,
      };
      try {
        await this.save(match);
        this.notify({ title: 'Match enregistré', type: 'success' });
        this.$router.push({ name: 'matches' });
      } catch (e) {
        this.notifyError(e);
      }
    },

    validForm() {
      if (
        this.match.player1_id
        && this.match.player2_id
        && this.match.ft > 0
        && this.selectedLeague
      ) {
        this.matchIsValid = true;
      } else {
        this.matchIsValid = false;
      }
    },
  },

  async created() {
    await this.getLeagues();
    await this.getPlayers();
  },
};
</script>
