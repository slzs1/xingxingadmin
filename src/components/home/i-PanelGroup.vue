<template>
  <el-row
    :gutter="40"
    class="panel-group"
  >
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon
            name="money"
            class="card-panel-icon"
          />
        </div>
        <div
          class="card-panel-description"
          style="margin-right:10px"
        >
          <div class="card-panel-text">
            本月营业
          </div>
          <div class="card-panel-num">
            {{ total.thisMonth }}
          </div>
        </div>
        <div
          class="card-panel-description"
          style="margin-right:10px"
        >
          <div class="card-panel-text">
            今日营业
          </div>
          <div class="card-panel-num">
            {{ total.today }}
          </div>
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div
        class="card-panel"
        @click="handleClick('order/index')"
      >
        <div class="card-panel-icon-wrapper icon-shopping">
          <i class="el-icon-shopping-cart-2 card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            待发货订单
          </div>
          <div class="card-panel-num">
            {{ payingOrders }}
          </div>
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-info">
          <i class="el-icon-info card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            待退、换货
          </div>
          <div class="card-panel-num">
            {{ services }}
          </div>
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-finished">
          <i class="el-icon-document-checked card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            已完成订单
          </div>
          <div class="card-panel-num">
            {{ finishedOrders }}
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Order, Service } from '@/model'

@Component({
  name: 'i-PanelGroup'
})
export default class extends Vue {
  // 营业额
  private total = {
    today: 0,
    thisMonth: 0
  }

  // 待发货订单
  private payingOrders = 0

  // 待退、换货工单
  private services = 0

  // 已完成的订单
  private finishedOrders = 0

  created() {
    this.getData()
  }

  private async getData() {
    let today = new Date()
    let thisMonth = new Date()
    // 将日期设置为今日0时
    today.setSeconds(0)
    today.setHours(0)
    today.setMinutes(0)
    // 将本月日期设置为1日的0时
    thisMonth.setSeconds(0)
    thisMonth.setMinutes(0)
    thisMonth.setHours(0)
    thisMonth.setDate(1)
    let todayOrder = await Order.where({
      'createdAt[gt]': today.toISOString()
    }).all()
    let thisMonthOrder = await Order.where({
      'createdAt[gt]': thisMonth.toISOString()
    }).all()
    todayOrder.data.forEach((item) => {
      this.total.today += item.total
    })
    this.total.today = Number((this.total.today * 0.01).toFixed(2))
    thisMonthOrder.data.forEach((item) => {
      this.total.thisMonth += item.total
    })
    this.total.thisMonth = Number((this.total.thisMonth * 0.01).toFixed(2))
    let payingOrders = await Order.where({ state: '1' }).per(0).stats({ total: 'count' }).all()
    let services = await Service.where({ serviceType: '1' }).where({ state: '0' }).per(0).stats({ total: 'count' }).all()
    let finishedOrders = await Order.where({ state: '4' }).per(0).stats({ total: 'count' }).all()
    this.payingOrders = payingOrders.meta.stats.total.count
    this.services = services.meta.stats.total.count
    this.finishedOrders = finishedOrders.meta.stats.total.count
  }

  handleClick(url:string) {
    this.$router.push(url)
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-finished {
        background: #6fcf45;
      }

      .icon-info {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-finished {
      color: #6fcf45;
    }

    .icon-info {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
