<template>
  <div style="width: 100%;height:500px;" />
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import echarts, { EChartOption } from 'echarts'
import { Order } from '@/model'
import ResizeMixin from '@/components/home/mixins/resize'
import { mixins } from 'vue-class-component'

@Component({
  name: 'todayTotalChart'
})
export default class extends mixins(ResizeMixin) {
  // private chart: any
  private data = [0, 0, 0, 0, 0, 0, 0, 0]

  created() {
    this.getData()
  }

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  }

  private async getData() {
    let today = new Date()
    // 将时间设置为今日0时
    today.setSeconds(0)
    today.setHours(0)
    today.setMinutes(0)
    // 获取今日0时之后的所有订单
    let todayOrders = (
      await Order.where({ 'createdAt[gt]': today.toISOString() }).all()
    ).data
    todayOrders.forEach((item) => {
      let time = new Date(item.createdAt)
      this.data[Math.floor(time.getHours() / 3)] += Number((item.total * 0.01).toFixed(2))
      // 异步获取数据，需要重新将数据在图表上进行绑定
      if (this.chart) {
        this.chart.setOption({
          series: [
            {
              name: '销售额',
              type: 'bar',
              data: this.data
            },
            {
              name: '销售',
              type: 'line',
              data: this.data
            }
          ]
        })
      }
    })
  }

  private initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    this.chart.setOption({
      title: {
        text: '日销售额分布图'
      },
      tooltip: {},
      xAxis: [
        {
          type: 'category',
          data: [
            '3:00',
            '6:00',
            '9:00',
            '12:00',
            '15:00',
            '18:00',
            '21:00',
            '24:00'
          ],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '销售额',
          type: 'bar',
          data: this.data
        },
        {
          name: '销售',
          type: 'line',
          data: this.data
        }
      ]
    } as EChartOption<EChartOption.SeriesBar>)
  }
}
</script>
