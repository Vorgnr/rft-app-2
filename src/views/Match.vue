<template>
  <div v-if="match.match">
    <div class="row mb-3">
      <div class="col">
        <a @click="$router.go(-1)">
          <v-icon name="arrow-left" />Retour
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="card border-primary">
          <div class="card-body">
            <h4 class="card-title">
              {{match.player1.name}} Vs {{match.player2.name}}
              <span
                v-if="match.match.player1_score"
              >{{match.match.player1_score}}-{{match.match.player2_score}}</span>
            </h4>
            <ul>
              <li>Crée {{ formatPrettier(match.match.created_at) }}</li>
              <li
                v-if="match.match.completed_at"
                class="card-text"
              >Terminé {{ formatPrettierAndWeek(match.match.completed_at) }}</li>
              <li
                v-if="match.match.moderated_at"
                class="card-text"
              >Moderé {{ formatPrettier(match.match.moderated_at) }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <label>Saison</label>
          <v-select
            :options="leagues.map(({ id, name }) => ({ label: name, code: id }))"
            :value="match.match.league_id"
            :clearable="false"
            disabled
          />
        </div>
        <div class="form-group">
          <label for="name">FT</label>
          <input
            disabled
            class="form-control col-md-2"
            type="number"
            placeholder="FT"
            :value="match.match.ft"
          />
        </div>
      </div>
    </div>
    <div>
      <div class="row mt-3">
        <div class="col">
          <div class="card mb-3">
            <div class="card-header">{{ match.player1.name }}</div>
            <div class="card-body">
              <div class="form-group">
                <label for="name">Score</label>
                <input
                  :disabled="matchIsCompleted"
                  class="form-control col-md-4"
                  type="number"
                  :placeholder="`Score ${match.player1.name}`"
                  v-model="match.match.player1_score"
                />
              </div>
              <div class="form-group">
                <label>Perso {{ match.player1.name }}</label>
                <character-select
                  v-model="match.match.character1"
                  :placeholder="`Perso ${match.player1.name}`"
                  multiple
                />
              </div>
              <div class="row" v-if="!matchIsCompleted">
                <div class="col">
                  <div class="form-group">
                    <button
                      @click="toogleForfeit(1)"
                      class="btn"
                      :class="!match.match.player1_forfeit ? 'btn-outline-warning' : 'btn-warning'"
                    >
                      <span
                        v-if="match.match.player1_forfeit"
                      >{{ match.player1.name }} ne s'est pas présenté</span>
                      <span v-if="!match.match.player1_forfeit">Non effectué</span>
                    </button>
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <button
                      @click="toogleRageQuit(1)"
                      class="btn"
                      :class="!match.match.player1_ragequit ? 'btn-outline-warning' : 'btn-warning'"
                    >
                      <span
                        v-if="match.match.player1_ragequit"
                      >{{ match.player1.name }} à quitté le match</span>
                      <span v-if="!match.match.player1_ragequit">RQ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card mb-3">
            <div class="card-header">{{ match.player2.name }}</div>
            <div class="card-body">
              <div class="form-group">
                <label for="name">Score</label>
                <input
                  :disabled="matchIsCompleted"
                  class="form-control col-md-4"
                  type="number"
                  :placeholder="`Score ${match.player2.name}`"
                  v-model="match.match.player2_score"
                />
              </div>
              <div class="form-group">
                <label>Perso {{ match.player2.name }}</label>
                <character-select
                  v-model="match.match.character2"
                  :placeholder="`Perso ${match.player2.name}`"
                  multiple
                />
              </div>
              <div class="row" v-if="!matchIsCompleted">
                <div class="col">
                  <div class="form-group">
                    <button
                      @click="toogleForfeit(2)"
                      class="btn"
                      :class="!match.match.player2_forfeit ? 'btn-outline-warning' : 'btn-warning'"
                    >
                      <span
                        v-if="match.match.player2_forfeit"
                      >{{ match.player2.name }} ne s'est pas présenté</span>
                      <span v-if="!match.match.player2_forfeit">Non effectué</span>
                    </button>
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <button
                      @click="toogleRageQuit(2)"
                      class="btn"
                      :class="!match.match.player2_ragequit ? 'btn-outline-warning' : 'btn-warning'"
                    >
                      <span
                        v-if="match.match.player2_ragequit"
                      >{{ match.player2.name }} à quitté le match</span>
                      <span v-if="!match.match.player2_ragequit">RQ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="matchIsCompleted">
      <div class="col-md-6">
        <replay-video v-model="match.match.video" />
      </div>
      <div class="col-md-6">
        <date-time
          :value="match.match.completed_at"
          title="Terminé le"
          @input="formatCompletedAtDate"
        />
      </div>
    </div>
    <div class="row mt-3" v-if="match.match.moderated_at">
      <div class="col">
        <div class="card mb-3">
          <div class="card-header">Pénalités</div>
          <div class="card-body">
            <div v-if="isAdmin" class="row">
              <div class="col">
                <div
                  class="alert alert-info"
                >Seules les pénalités supérieures à 0 seront prise en compte</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label for="name">Pénalité {{ match.player1.name }}</label>
                  <input
                    :disabled="!isAdmin"
                    class="form-control col-md-4"
                    type="number"
                    :placeholder="`Pénalité ${ match.player1.name }`"
                    v-model="player1_elo_penalty"
                  />
                  <div class="valid-feedback">
                    {{ match.player1.name }} a
                    {{ (0 > match.match.player1_elo)
                    ? `perdu ${match.match.player1_elo.toString().substr(1)}`
                    : `gagné ${match.match.player1_elo}`
                    }} Points
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <label for="name">Pénalité {{ match.player2.name }}</label>
                  <input
                    :disabled="!isAdmin"
                    class="form-control col-md-4"
                    type="number"
                    :placeholder="`Pénalité ${ match.player2.name }`"
                    v-model="player2_elo_penalty"
                  />
                  <div class="valid-feedback">
                    {{ match.player2.name }} a
                    {{ (0 > match.match.player2_elo)
                    ? `perdu ${match.match.player2_elo.toString().substr(1)}`
                    : `gagné ${match.match.player2_elo}`
                    }} Points
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="player1_elo_penalty > 0 || player2_elo_penalty > 0" class="card-footer">
            <button @click="submitPenalize" class="btn btn-warning">Pénaliser</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col">
        <div class="form-group has-success">
          <label for="name">
            Commentaire
          </label>
          <textarea
            :disabled="!isAdmin"
            class="form-control"
            :class="{
              'is-valid': 255 - comment.length > 0,
              'is-invalid': 255 - comment.length <= 0,
            }"
            v-model="comment"
            rows="3"
          ></textarea>
          <div class="valid-feedback">
            {{ (255 - comment.length) > 0 ? (255 - comment.length) : 0 }}
            charactère(s) restant
          </div>
          <div class="invalid-feedback">
            {{ comment.length }} charactères sur 255
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col d-flex">
        <div class="mr-auto">
          <button
            v-if="canUpdate"
            @click="submit"
            class="btn btn-primary mr-auto"
            type="button"
          >Mettre à jour</button>
        </div>
        <div>
          <button
            v-if="canModerate"
            @click="submitModerate"
            class="btn btn-primary mr-3"
            type="button"
          >Modérer et distribuer les points</button>
          <button
            v-if="canUnmoderate"
            @click="submitUnmoderate"
            class="btn btn-warning mr-3"
            type="button"
          >Défaire la modération</button>
        </div>
      </div>
      <div class="col-auto" v-if="canModerate">
        <button @click="cancelMatch" class="btn btn-warning">Annuler le match</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import vSelect from 'vue3-select';
import { mapActions, mapGetters } from 'vuex';
import store from '@/store';
import CharacterSelect from '../components/CharacterSelect.vue';
import DateTime from '../components/DateTime.vue';
import ReplayVideo from '../components/ReplayVideo.vue';
import { formatPrettier, formatPrettierAndWeek, formatForServer } from '@/lib'

export default {
  name: 'Match',
  title: 'Match',

  components: {
    vSelect,
    CharacterSelect,
    DateTime,
    ReplayVideo,
  },

  data() {
    return {
      player1_elo_penalty: null,
      player2_elo_penalty: null,
      completed_at_date: null,
      completed_at_hour: null,
      completed_at_minute: null,
      comment: '',
    };
  },

  computed: {
    ...mapGetters('matches', {
      match: 'item',
    }),
    ...mapGetters('leagues', {
      leagues: 'list',
    }),
    ...mapGetters('auth', {
      isAdmin: 'isAdmin',
      authPlayer: 'player',
    }),

    matchIsCompleted() {
      return Boolean(this.match.match.completed_at);
    },

    canModerate() {
      return (
        this.matchIsCompleted && !this.match.match.moderated_at && this.isAdmin
      );
    },

    canUnmoderate() {
      return this.match.match.moderated_at && this.isAdmin;
    },

    canUpdate() {
      if (this.comment.length >= 255) {
        return false;
      }

      if (this.isAdmin) {
        return true;
      }

      return (
        [this.match.match.player1_id, this.match.match.player2_id].indexOf(
          this.authPlayer.id,
        ) > -1
      );
    },
  },

  methods: {
    ...mapActions('matches', {
      getById: 'getById',
      update: 'update',
      moderate: 'moderate',
      unmoderate: 'unmoderate',
      penalize: 'penalize',
      cancel: 'cancel',
    }),
    ...mapActions('leagues', {
      listLeagues: 'list',
    }),
    ...mapActions('notifications', {
      notify: 'add',
      notifyError: 'addError',
    }),

    async getMatch() {
      try {
        await this.getById({ matchId: this.$route.params.id });
        this.player1_elo_penalty = this.match.match.player1_elo_penalty;
        this.player2_elo_penalty = this.match.match.player2_elo_penalty;
        this.comment = this.match.match.comment || '';
      } catch (e) {
        this.notifyError(e);
      }
    },

    toogleForfeit(playerIndex) {
      if (playerIndex === 1) {
        this.match.match.player1_forfeit = !this.match.match.player1_forfeit;
        if (this.match.match.player1_forfeit) {
          this.match.match.player2_forfeit = false;
          this.match.match.player1_ragequit = false;
          this.match.match.player2_ragequit = false;
        }
      }

      if (playerIndex === 2) {
        this.match.match.player2_forfeit = !this.match.match.player2_forfeit;
        if (this.match.match.player2_forfeit) {
          this.match.match.player1_forfeit = false;
          this.match.match.player1_ragequit = false;
          this.match.match.player2_ragequit = false;
        }
      }
    },

    toogleRageQuit(playerIndex) {
      if (playerIndex === 1) {
        this.match.match.player1_ragequit = !this.match.match.player1_ragequit;
        if (this.match.match.player1_ragequit) {
          this.match.match.player2_ragequit = false;
          this.match.match.player1_forfeit = false;
          this.match.match.player2_forfeit = false;
        }
      }

      if (playerIndex === 2) {
        this.match.match.player2_ragequit = !this.match.match.player2_ragequit;
        if (this.match.match.player2_ragequit) {
          this.match.match.player1_ragequit = false;
          this.match.match.player1_forfeit = false;
          this.match.match.player2_forfeit = false;
        }
      }
    },

    formatCompletedAtDate(date) {
      this.match.match.completed_at = date;
    },

    cancelMatch() {
      this.$confirm({
        message: 'Annuler le match ?',
        button: {
          no: 'Non',
          yes: 'Oui',
        },
        callback: async (confirm) => {
          if (confirm) {
            try {
              await this.cancel({ matchId: this.$route.params.id });
              this.notify({ title: 'Match annulé', type: 'success' });
              this.$router.push({ name: 'matches' });
            } catch (e) {
              this.notifyError(e);
            }
          }
        },
      });
    },

    async submit() {
      if (this.match.match.completed_at) {
        this.match.match.completed_at = formatForServer(
          this.match.match.completed_at,
        );
      }

      const body = this.match.match;
      if (body.comment !== this.comment) {
        body.comment = this.comment;
      }

      try {
        await this.update({
          matchId: this.$route.params.id,
          body,
        });
        this.notify({ title: 'Match mis à jour', type: 'success' });
        this.$router.push({ name: 'matches' });
      } catch (e) {
        this.notifyError(e);
      }
    },

    async submitUnmoderate() {
      this.$confirm({
        message: 'Défaire la modération et rendre les points distribués ?',
        button: {
          no: 'Non',
          yes: 'Oui',
        },
        callback: async (confirm) => {
          if (confirm) {
            try {
              await this.unmoderate({ matchId: this.$route.params.id });
              this.notify({ title: 'Modération défaite', type: 'success' });
              this.$router.push({ name: 'matches' });
            } catch (e) {
              this.notifyError(e);
            }
          }
        },
      });
    },

    async submitModerate() {
      this.$confirm({
        message: 'Modérer le match et distribuer les points ?',
        button: {
          no: 'Non',
          yes: 'Oui',
        },
        callback: async (confirm) => {
          if (confirm) {
            try {
              await this.moderate({ matchId: this.$route.params.id });
              this.notify({ title: 'Match modéré', type: 'success' });
              this.$router.push({ name: 'matches' });
            } catch (e) {
              this.notifyError(e);
            }
          }
        },
      });
    },

    async submitPenalize() {
      this.$confirm({
        message: 'Pénaliser les points gagnés sur le match',
        button: {
          no: 'Non',
          yes: 'Oui',
        },
        callback: async (confirm) => {
          if (confirm) {
            try {
              await this.penalize({
                matchId: this.$route.params.id,
                player1_elo_penalty: this.player1_elo_penalty,
                player2_elo_penalty: this.player2_elo_penalty,
              });
              this.notify({ title: 'Match pénalisé', type: 'success' });
              this.$router.push({ name: 'matches' });
            } catch (e) {
              this.notifyError(e);
            }
          }
        },
      });
    },
  },

  beforeRouteEnter(to, from, next) {
    store.dispatch('matches/clearMatch')
      .then(() => {
        next((vm) => vm.getMatch());
      });
  },
};
</script>
