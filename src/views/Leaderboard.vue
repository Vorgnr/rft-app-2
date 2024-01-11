<template>
  <div>
    <h1>Leaderboard</h1>
    <div class="row">
      <div class="col-12 col-md-6">
        <league-select :leagues="leagues" @input="onLeagueChange" :value="currentSelectedLeague" />
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <div class="input-group">
            <input
              v-model="search"
              @input="debounceSearch"
              class="form-control"
              placeholder="Rechercher par pseudo..."
            />
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" @click="clearSearch">
                <v-icon name="x" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <table v-if="!loading" class="table table-hover table-condensed">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Char</th>
              <th>Pseudo</th>
              <th>Matchs</th>
              <th>Points</th>
              <th>Palier</th>
              <th v-if="isAuth"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="({ player, elo }, index) in players" :key="player.id">
              <td>
                <span v-if="elo.value !== null">{{index+1}}</span>
              </td>
              <td class="character-thumbnail">
                <character-thumbnail :characters="player.main_character" />
              </td>
              <td>{{player.name}}</td>
              <td>{{ elo.played_matches }}</td>
              <td>{{ elo.value }}</td>
              <td>{{ getRank(elo.value) }}</td>
              <td>
                <router-link tag="a" :to="`/chart/${player.id}`" class="mr-3">
                  <v-icon v-tooltip.right="'Voir les statistiques'" name="bar-chart-2" />
                </router-link>
                <router-link v-if="isAdmin" tag="a" :to="`/players/${player.id}`">
                  <v-icon name="edit" v-tooltip.right="'Editer'" />
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <button
          v-if="!noMorePlayers"
          @click="getMorePlayers"
          type="button"
          class="btn btn-outline-primary btn-lg btn-block"
        >Voir plus</button>
      </div>

      </div>
    </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import CharacterThumbnail from '../components/CharacterThumbnail.vue';
import LeagueSelect from '../components/LeagueSelect.vue';

export default {
  name: 'Leaderboard',
  title: 'Leaderboard',
  components: {
    CharacterThumbnail,
    LeagueSelect,
  },

  data() {
    return {
      loading: true,
      perPage: 30,
      page: 1,
      search: '',
    };
  },

  computed: {
    ...mapGetters('players', {
      players: 'list',
      noMorePlayers: 'noMoreItems',
    }),
    ...mapGetters('leagues', {
      leagues: 'list',
      currentSelectedLeague: 'currentSelectedLeague',
    }),
    ...mapGetters('auth', {
      isAuth: 'isAuth',
      isAdmin: 'isAdmin',
    }),
  },

  methods: {
    ...mapActions('players', {
      fetchMorePlayers: 'fetchMore',
      listPlayers: 'list',
    }),
    ...mapActions('leagues', {
      listLeagues: 'list',
      setCurrentLeague: 'setCurrentLeague',
    }),
    ...mapActions('notifications', {
      notify: 'add',
      notifyError: 'addError',
    }),

    getRank(eloValue) {
      if (!this.currentSelectedLeague) {
        return null;
      }

      if (eloValue === null) {
        return -1;
      }

      return Math.floor(eloValue / this.currentSelectedLeague.rankTreshold);
    },

    debounceSearch(event) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.message = event.target.value;
        this.getPlayers();
      }, 600);
    },

    clearSearch() {
      this.search = null;
      this.getPlayers();
    },

    onLeagueChange(option) {
      this.setCurrentLeague(option);
      this.getPlayers({ leagueId: option.code });
    },

    async getPlayers({ leagueId, name } = {}) {
      try {
        await this.listPlayers({
          params: {
            leagueId: leagueId || this.currentSelectedLeague.code,
            name: name || this.search,
            withElo: 1,
            page: 1,
            perPage: this.perPage,
          },
        });
        this.page = 1;
      } catch (e) {
        this.notifyError(e);
      }
    },

    async getMorePlayers() {
      const payload = {
        name: this.search,
        perPage: this.perPage,
        page: this.page + 1,
        withElo: 1,
        leagueId: this.currentSelectedLeague.code,
      };

      try {
        await this.fetchMorePlayers({ params: payload });
        this.page += 1;
      } catch (e) {
        this.notifyError(e);
      }
    },

    async getLeagues() {
      try {
        await this.listLeagues({ showAll: true });
      } catch (e) {
        this.notifyError(e);
      }
    },
  },

  async created() {
    this.loading = true;
    await this.getLeagues();
    await this.getPlayers();
    this.loading = false;
  },
};
</script>
