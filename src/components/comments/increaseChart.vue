<template>
  <div style="width: 100%;height:300px;" />
</template>
<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import echarts, { EChartOption } from 'echarts'
import { Product, OrderItem, Order, Comment } from '@/model'
import ResizeMixin from '@/components/home/mixins/resize'
import { mixins } from 'vue-class-component'

@Component({
  name: 'increaseChart'
})
export default class extends mixins(ResizeMixin) {
  private data = {
    goodComments: [0, 0, 0, 0, 0, 0, 0],
    increaseRate: [0, 0, 0, 0, 0, 0],
    date: ['7天前', '6天前', '5天前', '4天前', '3天前', '2天前', '1天前']
  }

  created() {
    this.getData()
  }

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  }

  private async getData() {
    let dateTime = new Date()
    dateTime.setSeconds(0)
    dateTime.setMinutes(0)
    dateTime.setHours(0)
    // 获取近7日好评的个数
    for (let i = 6; i >= 0; i--) {
      let latDateTime = new Date(dateTime)
      dateTime.setDate(dateTime.getDate() - 1)
      this.data.date[i] = this.getDateTime(dateTime)
      this.data.goodComments[i] = (
        await Comment.where({ 'createdAt[gte]': dateTime.toISOString() })
          .where({ 'createdAt[lt]': latDateTime.toISOString() })
          .where({ 'rate[gte]': 7 })
          .where({ 'rate[lte]': 10 })
          .per(0).stats({ total: 'count' })
          .all()).meta.stats.total.count
    }
    // 计算好评增长率
    for (let i = 0; i < 6; i++) {
      if (this.data.goodComments[i] !== 0) {
        this.data.increaseRate[i] = this.data.goodComments[i + 1] - this.data.goodComments[i]
      } else if (this.data.goodComments[i + 1] !== 0) {
        this.data.increaseRate[i] = 1
      } else this.data.increaseRate[i] = 0
    }
    if (this.chart) {
      this.chart.setOption({
        xAxis: [
          {
            type: 'category',
            data: this.data.date
          }
        ],
        series: [
          {
            type: 'bar',
            data: this.data.goodComments,
            yAxisIndex: 0
          },
          {
            type: 'line',
            data: this.data.increaseRate,
            yAxisIndex: 1
          }
        ]
      })
    }
  }

  private getDateTime(date:Date) {
    return (date.getMonth() + 1) +
    '月' +
    date.getDate() +
    '日'
  }

  private initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    // 设置图表
    this.chart.setOption({
      legend: {
        type: 'plain'
      },
      tooltip: {},
      title: {
        text: '近7日好评统计'
      },
      xAxis: [
        {
          type: 'category',
          data: this.data.date
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: {
            alignWithLabel: true
          }
        },
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '好评数',
          type: 'bar',
          data: this.data.goodComments,
          yAxisIndex: 0
        },
        {
          name: '好评增长率',
          type: 'line',
          data: this.data.increaseRate,
          yAxisIndex: 1
        }
      ]
    } as EChartOption<EChartOption.SeriesBar>)
  }
}
</script>
