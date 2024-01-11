<template>
  <div v-if="loading" class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script lang="ts">

import { mapGetters } from 'vuex';

export default {
  name: 'Loader',
  computed: {
    ...mapGetters({
      loading: 'net/loading',
    }),
  },
};
</script>
