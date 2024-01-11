<template>
  <div class="form-group">
    <v-select
      :options="leagues.map(({
        id, name, rank_treshold: rankTreshold, is_active: isActive
      }) => (
        { label: name, code: id, rankTreshold, isActive  }
      ))"
      @input="onLeagueChange"
      :value="value"
      placeholder="Selectionnez une saison"
      :clearable="false"
    >
      <template v-slot:option="option">
        <span v-if="!option.isActive">[Archive]</span>
        {{ option.label }}
      </template>
      <template v-slot:no-options="{ search, searching }">
        <template v-if="searching">
          Aucune saison trouvée pour
          <em>{{ search }}</em>.
        </template>
        <span v-else>Aucune saison</span>
      </template>
    </v-select>
  </div>
</template>

<script lang="ts">
import vSelect from 'vue3-select';

export default {
  name: 'LeagueSelect',

  components: {
    vSelect,
  },

  props: {
    leagues: Array,
    value: Object,
  },

  methods: {
    onLeagueChange(league) {
      this.$emit('input', league);
    },
  },
};
</script>
