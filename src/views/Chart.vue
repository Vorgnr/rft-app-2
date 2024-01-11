<template>
  <div v-if="!loading && player">
    <div class="row">
      <div class="col">
        <h1>{{ title }}</h1>
      </div>
      <div class="col mt-2">
        <league-select
          :leagues="leagues"
          @input="onSelectedLeagueChanged"
          :value="currentSelectedLeague"
        />
      </div>
    </div>
    <player-stats class="mt-3" v-bind="playerStats" :elo="playerElo" />
    <h2 v-if="matches.length">Points</h2>
    <div v-if="matches.length" class="row">
      <div class="col">
        <line-chart
          @on-click-point="onDotClick"
          :chart-data="pointChartData"
          :options="pointChartOptions"
          :styles="{ height: '24em' }"
        />
      </div>
    </div>
    <h2 v-if="matches.length" class="mt-4">Taux de victoire par adversaire</h2>
    <div v-if="matches.length" class="row">
      <div class="col">
        TODO
        <!-- <bar-chart :options="oponentCharOptions" :chart-data="oponentCharData" /> -->
      </div>
    </div>

    <div v-if="matches.length" class="row">
      <div v-if="player.main_character" class="col">
        <h3 class="mt-4">Mes personnages</h3>
        <doughnut-chart
          :options="characterChartOptions(charactersStats)"
          :chart-data="characterChartData(charactersStats)"
        />
      </div>
      <div class="col">
        <h3 class="mt-4">Personnages de mes adversaires</h3>
        <doughnut-chart
          :options="characterChartOptions(oponentCharactersStats)"
          :chart-data="characterChartData(oponentCharactersStats)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import { formatISO } from 'date-fns/formatISO';
import LeagueSelect from '../components/LeagueSelect.vue';
import LineChart from '../components/LineChart.vue';
import BarChart from '../components/BarChart.vue';
import DoughnutChart from '../components/DoughnutChart.vue';
import PlayerStats from '../components/PlayerStats.vue';
import { 
  hexToRgb, pluralize, 
  formatPrettier, stringToColour, capitalize 
} from '@/lib'; 

const WIN_COLOR = '#2AA198';
const LOOSE_COLOR = '#D33682';
const TEXT_COLOR = '#839496';

export default {
  name: 'Matches',
  title: 'Matchs',
  components: {
    LeagueSelect,
    LineChart,
    PlayerStats,
    BarChart,
    DoughnutChart,
  },

  data() {
    return {
      loading: true,
      selectedLeague: null,
    };
  },

  computed: {
    ...mapGetters('players', {
      player: 'item',
    }),
    ...mapGetters('leagues', {
      leagues: 'list',
      currentSelectedLeague: 'currentSelectedLeague',
    }),
    ...mapGetters('matches', {
      matches: 'list',
    }),
    ...mapGetters('auth', {
      isAuth: 'isAuth',
      authPlayer: 'player',
    }),

    title() {
      if (this.isProfileMode) {
        return 'Mes stats';
      }
      return `Stats de ${this.player.name}`;
    },

    isProfileMode() {
      return !this.$route.params.id;
    },

    defaultOption() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          labels: {
            fontColor: TEXT_COLOR,
          },
        },
      };
    },

    characterChartOptions() {
      return (stats) => ({
        ...this.defaultOption,
        animation: {
          animateRotate: false,
          animateScale: true,
        },
        tooltips: {
          callbacks: {
            title: (items) => {
              const { index } = items[0];
              const names = Object.keys(stats);
              return capitalize(names[index]);
            },
            label: (item) => {
              const { index } = item;
              const names = Object.keys(stats);
              const { win, total } = stats[names[index]];
              const winLabel = pluralize('victoire', win);
              const matchLabel = pluralize(
                'match',
                total,
              );
              return ` ${win} ${winLabel} sur ${total} ${matchLabel}`;
            },
            afterLabel: (item) => {
              const { index } = item;
              const names = Object.keys(stats);
              const { win, total } = stats[names[index]];
              return `Taux de victoire: ${this.$options.filters.percent(
                win,
                total,
              )} %`;
            },
          },
        },
      });
    },

    oponentCharOptions() {
      return {
        ...this.defaultOption,
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                fontColor: TEXT_COLOR,
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                fontColor: TEXT_COLOR,
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
            label(item, data) {
              const { index, datasetIndex } = item;
              const { y } = data.datasets[datasetIndex].data[index];
              return datasetIndex === 0
                ? ` Winrate ${y} %`
                : ` Loserate ${y.substr(1)} %`;
            },
            afterLabel: (item, data) => {
              const { index, datasetIndex } = item;
              const { win, loose, total } = data.datasets[datasetIndex].data[
                index
              ];
              const winLabel = pluralize('victoire', win);
              const looseLabel = pluralize(
                'défaite',
                loose,
              );
              const matchLabel = pluralize(
                'match',
                total,
              );
              return datasetIndex === 0
                ? `${win} ${winLabel} / ${total} ${matchLabel}`
                : `${loose} ${looseLabel} / ${total} ${matchLabel}`;
            },
          },
        },
      };
    },

    pointChartOptions() {
      return {
        ...this.defaultOption,
        hover: {
          onHover: (e, item) => {
            if (item.length) {
              e.target.style.cursor = 'pointer';
            } else {
              e.target.style.cursor = 'default';
            }
          },
        },
        elements: {
          line: {
            tension: 0,
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: TEXT_COLOR,
              },
            },
          ],
          xAxes: [
            {
              type: 'time',
              distribution: 'linear',
              time: {
                unit: 'week',
              },
              ticks: {
                fontColor: TEXT_COLOR,
              },
            },
          ],
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            title() {
              return '';
            },
            footer(items, data) {
              const { index } = items[0];
              const { completedAt } = data.datasets[0].data[index];
              return completedAt;
            },
            beforeLabel(item, data) {
              const { index } = item;
              const { player1, player2 } = data.datasets[0].data[index];
              return `${player1} vs ${player2}`;
            },
            label(item, data) {
              const { index } = item;
              const { player1Score, player2Score } = data.datasets[0].data[
                index
              ];
              if (player1Score) {
                return `${player1Score} - ${player2Score}`;
              }
              return '';
            },
            afterLabel(item, data) {
              const { index } = item;
              const { label } = data.datasets[0].data[index];
              return label;
            },
            labelTextColor: (item) => {
              const { index } = item;
              return this.chartColors[index];
            },
          },
        },
      };
    },

    playerElo() {
      const matches = this.matchesData;
      if (matches.length) {
        const { y } = this.matchesData[matches.length - 1];
        return y;
      }
      return 0;
    },

    matchesData() {
      return this.matches
        .filter(({ match }) => match.completed_at && match.moderated_at)
        .map(({ match, player1, player2 }) => {
          let previousElo;
          let elo;
          if (match.player1_id === this.player.id) {
            previousElo = match.player1_previous_elo;
            elo = match.player1_elo;
          } else {
            previousElo = match.player2_previous_elo;
            elo = match.player2_elo;
          }
          const eloStr = elo.toString();
          const isLost = eloStr.indexOf('-') === 0;

          const dt = new Date(match.completed_at);
          let y = previousElo + elo;
          if (y < 0) {
            y = 0;
          }
          const label = `${previousElo} ${
            isLost ? `- ${eloStr.substr(1)}` : `+ ${eloStr}`
          } = ${y}`;

          return {
            t: formatISO(dt),
            y,
            isLost,
            player1: player1.name,
            player1Character: match.character1 || player1.main_character,
            player2Character: match.character2 || player2.main_character,
            player1Score: match.player1_score,
            player2Score: match.player2_score,
            player2: player2.name,
            label,
            previousElo,
            elo,
            completedAt: formatPrettier(dt),
          };
        });
    },

    chartColors() {
      return this.matchesData.map((m) => (m.isLost ? LOOSE_COLOR : WIN_COLOR));
    },

    pointChartData() {
      const colors = this.chartColors;
      return {
        datasets: [
          {
            label: 'Points au cours de la saison',
            borderColor: TEXT_COLOR,
            fill: false,
            data: this.matchesData,
            pointBackgroundColor: colors,
            pointBorderColor: colors,
          },
        ],
      };
    },

    charactersStats() {
      return this.matchesData.reduce((acc, match) => {
        const matchCharacter = match.player1 === this.player.name
          ? match.player1Character
          : match.player2Character;

        const chars = matchCharacter.split(',');
        return this.reduceCharactersMatches(acc, chars, match);
      }, {});
    },

    oponentCharactersStats() {
      return this.matchesData.reduce((acc, match) => {
        let matchCharacter = match.player1 === this.player.name
          ? match.player2Character
          : match.player1Character;

        matchCharacter = matchCharacter || 'Perso non renseigné';
        const chars = matchCharacter.split(',');
        return this.reduceCharactersMatches(acc, chars, match);
      }, {});
    },

    oponentStats() {
      return this.matchesData.reduce((acc, match) => {
        const oponent = match.player2 !== this.player.name ? match.player2 : match.player1;

        if (!acc[oponent]) {
          acc[oponent] = {
            win: 0,
            loose: 0,
            total: 0,
          };
        }

        acc[oponent].total += 1;
        if (match.isLost) {
          acc[oponent].loose += 1;
        } else {
          acc[oponent].win += 1;
        }

        return acc;
      }, {});
    },

    characterChartData() {
      return (stats) => {
        const charactersName = Object.keys(stats);
        const colors = charactersName.map((n) => stringToColour(n));
        return {
          labels: charactersName.map((c) => capitalize(c)),
          datasets: [
            {
              borderColor: colors,
              backgroundColor: colors.map((h) => {
                const { r, g, b } = hexToRgb(h);
                return `rgba(${r}, ${g}, ${b}, 0.4)`;
              }),
              data: charactersName.map((n) => {
                const { total } = stats[n];

                return total;
              }),
            },
          ],
        };
      };
    },

    oponentCharData() {
      const oponentsData = this.oponentStats;
      const oponentsNames = Object.keys(oponentsData);
      return {
        labels: oponentsNames,
        datasets: [
          {
            label: 'Winrate',
            borderColor: WIN_COLOR,
            borderWidth: 1,
            backgroundColor: 'rgba(42, 161, 152, 0.4)',
            data: oponentsNames.map((n) => {
              const { win, total } = oponentsData[n];
              const winrate = percent(win, total);
              return {
                y: winrate,
                x: n,
                win,
                total,
              };
            }),
          },
          {
            label: 'Loserate',
            borderColor: LOOSE_COLOR,
            borderWidth: 1,
            backgroundColor: 'rgb(211, 54, 130, 0.4)',
            data: oponentsNames.map((n) => {
              const { loose, total } = oponentsData[n];
              const loserate = percent(loose, total);
              return {
                y: `-${loserate}`,
                x: n,
                loose,
                total,
              };
            }),
          },
        ],
      };
    },

    playerStats() {
      const data = this.matchesData.reduce(
        (acc, match) => {
          if (match.isLost) {
            acc.loose += 1;
          } else {
            acc.win += 1;
          }
          acc.total += 1;
          return acc;
        },
        {
          win: 0,
          loose: 0,
          total: 0,
        },
      );
      return data;
    },
  },

  methods: {
    ...mapActions('players', {
      getById: 'getById',
    }),
    ...mapActions('leagues', {
      listLeagues: 'list',
      setCurrentLeague: 'setCurrentLeague',
    }),
    ...mapActions('matches', {
      listMatches: 'list',
    }),

    onDotClick({ index }) {
      if (this.isAuth) {
        const { match } = this.matches[index];
        this.$router.push({ name: 'match', params: { id: match.id } });
      }
    },

    reduceCharactersMatches(acc, chars, match) {
      return chars.reduce((a, c) => {
        if (!a[c]) {
          a[c] = {
            win: 0,
            loose: 0,
            total: 0,
          };
        }
        a[c].total += 1;
        if (match.isLost) {
          a[c].loose += 1;
        } else {
          a[c].win += 1;
        }
        return a;
      }, acc);
    },

    async onSelectedLeagueChanged(league) {
      this.setCurrentLeague(league);
      await this.getMatches();
    },

    async getPlayer() {
      try {
        const playerId = this.isProfileMode
          ? this.authPlayer.id
          : this.$route.params.id;
        await this.getById({ playerId });
      } catch (e) {
        this.notifyError(e);
      }
    },

    async getMatches(params = {}) {
      const payload = params;
      payload.leagueId = this.currentSelectedLeague.code;
      payload.name = this.player.name;
      payload.orderBy = 'completed_at';
      try {
        await this.listMatches({ params: payload });
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
    await this.getPlayer();
    await this.getLeagues();
    await this.getMatches();
    this.loading = false;
  },
};
</script>
