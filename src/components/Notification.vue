<template>
    <div id="alert-container">
        <div
          v-for="n in notifications" :key="n.id"
          class="alert alert-dismissible"
          :class="{
            'alert-success': n.type === 'success',
            'alert-warning': n.type === 'error',
          }"
        >
          <button
            @click="drop(n.id)"
            type="button"
            class="close"
            data-dismiss="alert"
          >&times;</button>
          <strong>{{ n.title }} </strong> {{ n.message }}
        </div>
      </div>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Notification',
  computed: {
    ...mapGetters({
      notifications: 'notifications/list',
    }),
  },

  methods: {
    ...mapActions({
      drop: 'notifications/drop',
    }),
  },
};
</script>

<style scoped>
  #alert-container {
    position: fixed;
    top: 20vh;
    right: 20px;
    z-index: 5000;
  }

  button:focus {
    outline: none;
}
</style>
