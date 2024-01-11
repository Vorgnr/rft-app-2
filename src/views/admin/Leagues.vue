<template>
  <div>
    <a @click="$router.go(-1)">
      <v-icon name="arrow-left" />Retour
    </a>
    <h1 class="mt-2 d-flex">
      Administration des saisons
      <button class="btn btn-primary ml-md-auto" @click="toggleLeagueAdd">
        <v-icon name="plus-circle" />Ajouter une saison
      </button>
    </h1>
    <div class="row mt-4">
      <div class="col">
        <table class="table table-condensed">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Active</th>
              <th>Pt. départ</th>
              <th>Pt. victoire</th>
              <th>Pt. défaite</th>
              <th>RQ</th>
              <th>Palier rang</th>
              <th>Ratio calcul</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="leagueCreationFormVisible">
              <td>
                <input class="form-control" v-model="newLeague.name" placeholder="Nom" />
              </td>
              <td>
                <v-select
                  :options="[
                    { label: 'Active', code: 1 },
                    { label: 'Inactive', code: 0 }
                  ,]"
                  v-model="newLeague.is_active"
                  :clearable="false"
                />
              </td>
              <td>
                <input
                  placeholder="Pt. départ"
                  class="form-control"
                  type="number"
                  @input="greaterOrEqualZero($event, 'starting_elo')"
                  v-model="newLeague.starting_elo"
                />
              </td>
              <td>
                <input
                  placeholder="Pt. victoire"
                  class="form-control"
                  type="number"
                  @input="greaterOrEqualZero($event, 'winning_base_elo')"
                  v-model="newLeague.winning_base_elo"
                />
              </td>
              <td>
                <input
                  placeholder="Pt. défaite"
                  class="form-control"
                  type="number"
                  @input="greaterOrEqualZero($event, 'losing_base_elo')"
                  v-model="newLeague.losing_base_elo"
                />
              </td>
              <td>
                <input
                  placeholder="RQ"
                  class="form-control"
                  type="number"
                  @input="greaterOrEqualZero($event, 'ragequit_penalty')"
                  v-model="newLeague.ragequit_penalty"
                />
              </td>
              <td>
                <input
                  placeholder="Palier rang"
                  class="form-control"
                  type="number"
                  @input="greaterThanZero($event, 'rank_treshold')"
                  v-model="newLeague.rank_treshold"
                />
              </td>
              <td>
                <input
                  placeholder="Ratio calcul"
                  class="form-control"
                  type="number"
                  @input="greaterThanZero($event, 'rank_diff_ratio')"
                  v-model="newLeague.rank_diff_ratio"
                />
              </td>
              <td>
                <button class="btn btn-primary" @click="submitCreate">
                  <v-icon name="check" />
                </button>
              </td>
            </tr>
            <tr
              v-for="(league) in leagues"
              :key="league.id"
              :class="{'table-active': league.is_active}"
            >
              <td>
                <touch-edit :value="league.name" @input="onLeagueNameChanged(league, $event)" />
              </td>
              <td>
                <v-select
                  :options="[
                    { label: 'Active', code: 1 },
                    { label: 'Inactive', code: 0 }
                  ,]"
                  :value="league.is_active
                    ? { label: 'Active', code: 1 } : { label: 'Inactive', code: 0
                  }"
                  :clearable="false"
                  @input="onLeagueActiveChanged(league, $event)"
                />
              </td>
              <td>{{ league.starting_elo }}</td>
              <td>{{ league.winning_base_elo }}</td>
              <td>{{ league.losing_base_elo }}</td>
              <td>{{ league.ragequit_penalty }}</td>
              <td>{{ league.rank_treshold }}</td>
              <td>{{ league.rank_diff_ratio }}</td>
              <td>
                <button class="btn btn-primary" v-if="league.isUpdated" @click="submit(league)">
                  <v-icon name="check" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';
import vSelect from 'vue3-select';
import TouchEdit from '../components/TouchEdit.vue';

export default {
  name: 'Leagues',
  components: { vSelect, TouchEdit },

  data() {
    return {
      leagueCreationFormVisible: false,
      newLeague: {
        is_active: { label: 'Active', code: 1 },
      },
    };
  },

  computed: {
    ...mapGetters('leagues', {
      leagues: 'list',
    }),
  },

  methods: {
    ...mapActions('leagues', {
      listLeagues: 'list',
      update: 'update',
      create: 'create',
    }),

    ...mapActions('notifications', {
      notify: 'add',
      notifyError: 'addError',
    }),

    greaterOrEqualZero($event, key) {
      this.newLeague[key] = $event.target.value < 0 ? 0 : $event.target.value;
    },

    greaterThanZero($event, key) {
      this.newLeague[key] = $event.target.value <= 0 ? 1 : $event.target.value;
    },

    toggleLeagueAdd() {
      this.leagueCreationFormVisible = !this.leagueCreationFormVisible;
    },

    onLeagueNameChanged(league, name) {
      if (league.name !== name) {
        league.isUpdated = true;
      }
      league.name = name;
    },

    onLeagueActiveChanged(league, event) {
      if (league.is_active !== event.code) {
        league.isUpdated = true;
      }
      league.is_active = event.code;
    },

    async submitCreate() {
      try {
        await this.create({
          body: {
            ...this.newLeague,
            is_active: this.newLeague.is_active.code,
          },
        });
        this.leagueCreationFormVisible = false;
        this.notify({ title: 'Saison crée', type: 'success' });
      } catch (e) {
        this.notifyError(e);
      }
    },

    async submit(league) {
      try {
        await this.update({
          leagueId: league.id,
          body: {
            name: league.name,
            is_active: league.is_active,
          },
        });
        this.notify({ title: 'Saison mise à jour', type: 'success' });
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

  async mounted() {
    await this.getLeagues();
  },
};
</script>
