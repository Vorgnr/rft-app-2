<template>
  <div>
    <span
      v-for="character in getClasses" :key="character"
      class="characters"
      :class="character" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'CharacterThumbnail',

  props: {
    characters: String,
  },

  computed: {
    getClasses() {
      if (!this.characters) {
        return ['mokunjin'];
      }
      return this.characters.split(',');
    },
  },

};
</script>
