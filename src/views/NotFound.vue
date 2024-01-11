<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="row">
        <div class="col">
          <a @click="$router.go(-1)">
            <v-icon name="arrow-left" />Retour
          </a>
          <h1 class="mt-4">Don't ask me for sh$t</h1>
          <div class="mt-3">
            <img src="@/assets/404.jpeg">
          </div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col">
          <p>Cette page n'existe pas dans Tekken 8</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NotFound',
};
</script>
