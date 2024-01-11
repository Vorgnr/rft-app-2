<script lang="ts">
import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['chartData', 'options'],
  mounted() {
    this.renderChart(this.chartData, { ...this.options, onClick: this.handleClick });
  },
  methods: {
    handleClick(point, items) {
      if (items.length) {
        const { _index: index } = items[0];
        this.$emit('on-click-point', {
          index,
        });
      }
    },
  },
};
</script>
