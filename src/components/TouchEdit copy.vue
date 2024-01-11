<template>
  <div>
    <span @click="toggleMode" v-show="isReadMode">
      {{ value }}
    </span>
    <div class="input-group" v-show="!isReadMode">
      <input ref="input" class="form-control md-2" :value="value" @keyup.enter="toggleMode" />
      <div class="input-group-append pointer" @click="toggleMode">
        <span class="input-group-text">Ok</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TouchEdit',

  props: {
    value: String,
  },

  data() {
    return {
      isReadMode: true,
    };
  },

  methods: {
    submit() {
      this.$emit('input', this.$refs.input.value);
    },

    toggleMode() {
      this.isReadMode = !this.isReadMode;
      if (!this.isReadMode) {
        this.$nextTick(() => this.$refs.input.focus());
      } else {
        this.submit();
      }
    },
  },
};
</script>
