<template>
  <table class="table table-hover table-condensed">
    <thead>
      <tr>
        <th class="hidden-xs"></th>
        <th>Player 1</th>
        <th>Elo</th>
        <th>Points</th>
        <th>Score</th>
        <th class="borderl allignr">Score</th>
        <th>Points</th>
        <th>Elo</th>
        <th class="allignr">Player 2</th>
        <th class="hidden-xs"></th>
        <th class="borderl">Infos</th>
        <th></th>
        <th></th>
        <th v-if="isAuth"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="{ player1, player2, match } in matches" :key="match.id">
        <td :class="getMatchCssClass(1, match)" class="character-thumbnail hidden-xs">
          <character-thumbnail :characters="match.character1 || player1.main_character" />
        </td>
        <td :class="getMatchCssClass(1, match)">{{ player1.name }}</td>
        <td :class="getMatchCssClass(1, match)">{{ match.player1_previous_elo }}</td>
        <td :class="getMatchCssClass(1, match)">{{ match.player1_elo }}</td>
        <td :class="getMatchCssClass(1, match)">
          <span v-tooltip.right="'Ragequit'" v-if="match.player1_ragequit">RQ</span>
          <span v-tooltip.right="'Non effectué'" v-if="match.player1_forfeit">NE</span>
          <span v-else>{{ match.player1_score }}</span>
        </td>
        <td class="borderl allignr" :class="getMatchCssClass(2, match)">
          <span v-tooltip.right="'Ragequit'" v-if="match.player2_ragequit">RQ</span>
          <span v-tooltip.right="'Non effectué'" v-if="match.player2_forfeit">NE</span>
          <span v-else>{{ match.player2_score }}</span>
        </td>
        <td :class="getMatchCssClass(2, match)">{{ match.player2_elo }}</td>
        <td :class="getMatchCssClass(2, match)">{{ match.player2_previous_elo }}</td>
        <td class="allignr" :class="getMatchCssClass(2, match)">{{ player2.name }}</td>
        <td :class="getMatchCssClass(2, match)" class="character-thumbnail allignr hidden-xs">
          <character-thumbnail :characters="match.character2 || player2.main_character" />
        </td>
        <td class="borderl">
          <v-popover v-if="match.completed_at && isMobile">
            <v-icon class="text-primary" name="check" />
            <template v-slot:popover>
              <a v-close-popover>Terminé {{ match.completed_at | formatPrettierAndWeek }}</a>
            </template>
          </v-popover>
          <v-icon
            class="text-primary"
            v-tooltip.right="
              `Terminé ${$options.filters.formatPrettierAndWeek(match.completed_at)}`
            "
            v-if="match.completed_at && !isMobile"
            name="check"
          />
        </td>
        <td>
          <v-popover v-if="match.moderated_at && isMobile">
            <v-icon class="text-success" name="check-square" />
            <template v-slot:popover>
              <a v-close-popover>Modéré {{ match.moderated_at | formatPrettier }}</a>
            </template>
          </v-popover>
          <v-icon
            class="text-success"
            v-tooltip.right="`Modéré ${$options.filters.formatPrettier(match.moderated_at)}`"
            v-if="match.moderated_at && !isMobile"
            name="check-square"
          />
        </td>
        <td @click="openVideo(match)">
          <v-popover
            trigger="manual"
            :open="isVideoOpen === match.id"
            offset="16"
            @auto-hide="videoClosed"
            :auto-hide="true"
          >
            <v-icon
              v-if="match.video && match.video.length"
              name="youtube"
              v-tooltip.right="'Videos YouTube'"
              class="click text-danger"
            />
            <template v-slot:popover>
              <p v-for="(video, index) in match.video" :key="index">
                <a
                  :href="video.url"
                  target="_blank" rel="noopener"
                >{{ video.title || video.url }}</a>
              </p>
            </template>
          </v-popover>
        </td>
        <td v-if="isAuth">
          <v-icon
            name="edit"
            @click.native="$emit('open', match.id)"
            class="click"
            v-tooltip.right="'Editer'"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import CharacterThumbnail from './CharacterThumbnail.vue';

export default {
  name: 'MatchTable',

  components: {
    CharacterThumbnail,
  },

  props: {
    matches: Array,
    isAuth: Boolean,
  },

  data() {
    return {
      isVideoOpen: false,
    };
  },

  computed: {
    isMobile() {
      return window.matchMedia('(max-width: 760px)').matches;
    },
  },

  methods: {
    getMatchCssClass: (player, match) => {
      if (!match.completed_at) {
        return 'not-completed';
      }
      if (player === 1) {
        return match.player2_forfeit
          || match.player2_ragequit
          || match.player1_score > match.player2_score
          ? 'winner'
          : 'loser';
      }
      return match.player1_forfeit
        || match.player1_ragequit
        || match.player2_score > match.player1_score
        ? 'winner'
        : 'loser';
    },

    openVideo(match) {
      if (match.video.length === 1) {
        window.open(match.video[0].url);
      } else if (match.video.length > 1) {
        this.isVideoOpen = match.id;
      }
    },

    videoClosed() {
      this.isVideoOpen = false;
    },
  },
};
</script>
