<template>
  <div class="card">
    <div class="card-header d-flex">
      <div class="mr-auto">
        Video Youtube
      </div>
      <div>
        <button
          @click="addVideo"
          class="btn btn-secondary">
            <v-icon name="plus" />
          </button>
      </div>
    </div>
    <div v-for="(video) in vid" :key="video.timestamp" class="card-body">
      <div class="form-group">
        <label for="name">Titre</label>
        <input
          class="form-control"
          :value="video.title"
          @input="onTitleChanged($event, video)"
          type="text" placeholder="Titre"
        />
      </div>
      <div class="form-group">
        <label for="name">Lien YouTube</label>
        <input
          class="form-control"
          type="text"
          placeholder="Lien YouTube"
          :value="video.url"
          :class="{'is-invalid': video.notValid === true}"
          @input="onUrlChanged($event, video)"
        />
        <div v-if="video.notValid"
          class="invalid-feedback">
          Les videos sans lien ne seront pas prise en compte
        </div>
      </div>
      <button
        @click="removeVideo(video.timestamp)"
        class="btn btn-secondary">
          <v-icon name="minus" />
        </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ReplayVideo',

  props: {
    value: Array,
  },

  data() {
    return {
      vid: this.value || [],
    };
  },

  methods: {
    debounceSearch() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.triggerOnChange();
      }, 200);
    },
    addVideo() {
      this.vid.push({ notValid: true, timestamp: Date.now() });
    },
    removeVideo(timestamp) {
      this.vid = this.vid.filter((v) => v.timestamp !== timestamp);
    },
    onTitleChanged(event, video) {
      video.title = event.target.value;
      this.debounceSearch();
    },
    onUrlChanged(event, video) {
      video.url = event.target.value;
      video.notValid = !video.url;
      this.debounceSearch();
    },
    triggerOnChange() {
      this.$emit('input', this.vid
        .filter((v) => !v.notValid)
        .map((v) => ({ title: v.title, url: v.url })));
    },
  },
};
</script>
