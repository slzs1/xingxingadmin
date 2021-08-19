<template>
  <div class="app-container">
    <el-row
      :gutter="20"
    >
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
      >
        <comments-chart />
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
      >
        <increase-chart />
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import 'echarts/theme/macarons.js' // eChart的配色主题
import { Component, Vue } from 'vue-property-decorator'
import commentsChart from '@/components/comments/commentsChart.vue'
import increaseChart from '@/components/comments/increaseChart.vue'

@Component({
  name: 'statis',
  components: {
    commentsChart,
    increaseChart
  }
})

export default class extends Vue {}

</script>
