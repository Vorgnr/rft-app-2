<template>
  <v-select
    :options="options"
    :placeholder="placeholder"
    @input="onChange"
    v-model="selected"
  >
    <template v-slot:option="option" >
      <div
        class="characters"
        :class="option.mainCharacter || 'mokunjin'"
        style="padding-left: 80px; height: 50px">
        <div style="padding-top: 11px">{{ option.label }}</div>
      </div>
    </template>
  </v-select>
</template>

<script lang="ts">

import vSelect from 'vue3-select';

export default {
  name: 'PlayerSelect',
  components: { vSelect },

  props: {
    players: Array,
    placeholder: String,
    selectable: {
      type: Function,
      default: () => true,
    },
  },

  data() {
    return {
      selected: null,
    };
  },

  methods: {
    onChange() {
      this.$emit('input', this.selected.code);
    },
  },

  computed: {
    options() {
      return this.players
        .filter(this.selectable)
        .map((p) => ({
          label: p.name,
          code: p.id,
          mainCharacter: p.main_character,
        }));
    },
  },

};
</script>
