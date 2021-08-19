<template>
  <div style="width: 100%;height:500px;" />
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import echarts, { EChartOption } from 'echarts'
import { Product, OrderItem, Order } from '@/model'
import ResizeMixin from '@/components/home/mixins/resize'
import { mixins } from 'vue-class-component'

@Component({
  name: 'productSaleChart'
})
export default class extends mixins(ResizeMixin) {
  private title = ['001', '012', '003', '005', '007', '010', '022', '100', '019', '006']
  private num = [1000, 892, 877, 725, 600, 585, 582, 573, 553, 408]

  created() {
    this.getData()
  }

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  }

  private async getData() {
    // 后续在此处获取后端统计数据
  }

  private initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    // 设置图表
    this.chart.setOption({
      legend: {
        type: 'plain'
      },
      title: {
        text: '本月商品Top10'
      },
      tooltip: {},
      xAxis: [
        {
          type: 'value',
          axisTick: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: this.title,
          axisTick: {
            alignWithLabel: true
          },
          // 反转y坐标轴，使得销量高的数据在显眼位置
          inverse: true
        }
      ],
      series: [
        {
          name: '销量',
          type: 'bar',
          stack: 'vistors',
          data: this.num
        }
      ]
    } as EChartOption<EChartOption.SeriesBar>)
  }
}
</script>
