<template>
  <v-select
    :options="ch"
    :placeholder="placeholder"
    :multiple="multiple"
    @input="onChange"
    v-model="selected"
  >
    <template v-slot:option="option" >
      <div class="characters" :class="option.label" style="padding-left: 80px; height: 50px">
        <div style="padding-top: 11px">{{ capitalize(option.label) }}</div>
      </div>
    </template>
  </v-select>
</template>

<script lang="ts">

import vSelect from 'vue3-select';
import { capitalize } from '../lib'

const characters = [
  'akuma',
  'alisa',
  'anna',
  'armorking',
  'asuka',
  'bob',
  'bryan',
  'claudio',
  'deviljin',
  'dragunov',
  'eddy',
  'eliza',
  'fahkumram',
  'feng',
  'ganryu',
  'geese',
  'gigas',
  'heihachi',
  'hwoarang',
  'jack',
  'jin',
  'josie',
  'julia',
  'katarina',
  'kazumi',
  'kazuya',
  'kunimitsu',
  'king',
  'lars',
  'law',
  'lee',
  'lei',
  'leo',
  'leroy',
  'lidia',
  'lili',
  'lucky',
  'marduk',
  'miguel',
  'nina',
  'negan',
  'noctis',
  'panda',
  'paul',
  'raven',
  'shaheen',
  'steve',
  'xiaoyu',
  'yoshimitsu',
  'zafina',
];

export default {
  name: 'CharacterSelect',
  components: { vSelect },

  props: {
    placeholder: {
      type: String,
      default: 'Choisissez votre personnage',
    },
    multiple: Boolean,
    value: String,
  },

  data() {
    let selected;
    if (this.multiple) {
      selected = this.value && this.value.split(',');
    } else {
      selected = this.value;
    }
    return {
      ch: characters,
      selected,
    };
  },

  methods: {
    onChange() {
      let code;
      if (this.multiple) {
        code = this.selected.map((s) => s).join(',');
      } else {
        code = this.selected;
      }
      this.$emit('input', code);
    },
  },

};
</script>
