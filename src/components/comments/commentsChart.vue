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
  name: 'CommentsChart'
})
export default class extends mixins(ResizeMixin) {
  private data = [{
    name: '好评',
    // value: 0,
    children: [{
      name: '5星',
      value: 0
    }, {
      name: '4星',
      value: 0
    }]
  }, {
    name: '中评',
    value: 0
  }, {
    name: '差评',
    // value: 0,
    children: [{
      name: '2星',
      value: 2
    }, {
      name: '1星',
      value: 3
    }]
  }]

  created() {
    this.getData()
  }

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  }

  private async getData() {
    // 分别对应1,2,3,4,5星评价
    let comments = [0, 0, 0, 0, 0]
    for (let i = 0; i < 5; i++) {
      // 获取每个评价的数量
      comments[i] = ((await Comment.where({ 'rate[gte]': 2 * i + 1 }).where({ 'rate[lte]': 2 * i + 2 }).per(0).stats({ total: 'count' }).all()).meta.stats.total.count)
    }
    // 数据绑定
    if (this.data[0].children) {
      this.data[0].children[0].value = comments[4]
      this.data[0].children[1].value = comments[3]
    }
    this.data[1].value = comments[2]
    if (this.data[2].children) {
      this.data[2].children[0].value = comments[1]
      this.data[2].children[1].value = comments[0]
    }
    if (this.chart) {
      this.chart.setOption({
        series: [
          {
            type: 'sunburst',
            data: this.data
          }
        ]
      })
    }
  }

  private initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    // 设置图表
    this.chart.setOption({
      tooltip: {},
      legend: {
        type: 'plain'
      },
      title: {
        text: '评论统计'
      },
      series: [
        {
          type: 'sunburst',
          data: this.data
        }
      ]
    } as EChartOption<EChartOption.SeriesSunburst>)
  }
}
</script>
