<template>
  <div class="row">
    <div class="col">
      <div class="form-group">
        <label>{{ title }}</label>
        <input
          class="form-control"
          type="date"
          v-model="d_date"
          @input="validDate"
        />
      </div>
    </div>
    <div class="col-md-2">
      <div class="form-group">
        <label>Heures</label>
        <input
          class="form-control"
          type="number"
          v-model="d_hours"
          @input="validHours"
        />
      </div>
    </div>
    <div class="col-md-2">
      <div class="form-group">
        <label>Minutes</label>
        <input
          class="form-control"
          type="number"
          v-model="d_minutes"
          @input="validMinutes"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';

export default {
  name: 'DateTime',

  props: {
    value: {
      type: String,
    },
    title: {
      type: String,
      default: 'Date',
    },
    minutes: {
      type: Number,
      default: 0,
    },
    hours: {
      type: Number,
      default: 0,
    },
  },

  data() {
    const dt = new Date(this.value);
    return {
      d_date: format(dt, 'yyyy-MM-dd'),
      d_minutes: dt.getMinutes(),
      d_hours: dt.getHours(),
    };
  },

  methods: {
    debounceSearch() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.triggerOnChange();
      }, 600);
    },

    validDate(event) {
      this.d_date = event.target.value;
      this.triggerOnChange();
    },

    validHours(event) {
      if (event.target.value >= 24) {
        this.d_hours = 23;
      } else if (event.target.value < 0) {
        this.d_hours = 0;
      } else {
        this.d_hours = event.target.value;
      }
      this.debounceSearch();
    },

    validMinutes(event) {
      if (event.target.value >= 60) {
        this.d_minutes = 59;
      } else if (event.target.value < 0) {
        this.d_minutes = 0;
      } else {
        this.d_minutes = event.target.value;
      }
      this.debounceSearch();
    },

    triggerOnChange() {
      const dt = new Date(this.d_date);
      dt.setHours(this.d_hours);
      dt.setMinutes(this.d_minutes);
      if (isValid(dt)) {
        this.$emit('input', dt);
      }
    },
  },
};
</script>
