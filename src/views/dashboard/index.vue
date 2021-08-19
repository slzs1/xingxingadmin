<template>
  <div class="dashboard-container">
    <!-- <el-alert
      :title="getTitle()"
      type="success"
      show-icon
      center
    /> -->
    <xx-panel-group />
    <el-row
      :gutter="20"
      class="charts"
    >
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
      >
        <div class="chart-wrapper">
          <xx-product-sale-chart />
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
      >
        <div class="chart-wrapper">
          <xx-today-total-chart />
        </div>
      </el-col>
    </el-row>
    <div class="split" />
    <xx-bottom />
  </div>
</template>

<script lang="ts">
import 'echarts/theme/macarons.js'
import { Component, Vue } from 'vue-property-decorator'
import xxProductSaleChart from '@/components/home/i-ProductSaleChart.vue'
import xxTodayTotalChart from '@/components/home/i-TodayTotalChart.vue'
import xxPanelGroup from '@/components/home/i-PanelGroup.vue'
import xxBottom from '@/components/home/i-Bottom.vue'
import { StorageModule } from '@/store/modules/storage'

@Component({
  name: 'Dashboard',
  components: {
    xxProductSaleChart,
    xxTodayTotalChart,
    xxPanelGroup,
    xxBottom
  }
})
export default class extends Vue {
  get name() {
    return StorageModule.name
  }

  get roles() {
    return StorageModule.role
  }

  created() {
    this.getData()
  }

  private async getData() {
    // todo:由此处获得数据并传入组件，防止重复进行数据请求
  }

  private getTime() {
    let time = new Date()
    return (
      time.getFullYear() +
        '年' +
        (time.getMonth() + 1) +
        '月' +
        time.getDate() +
        '日' +
        time.getHours() +
        ':' +
        time.getMinutes() +
        ':' +
        time.getSeconds()
    )
  }

  private getTitle() {
    let time = this.getTime()
    return `欢迎使用后台管理系统,您本次登陆时间为${time}`
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

  .charts {
    margin-bottom: 50px;
  }
}

</style>
