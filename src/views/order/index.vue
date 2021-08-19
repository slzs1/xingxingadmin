<template>
  <div class="app-container">
    <div
      class="filter-container"
      style="margin-bottom: 10px"
    >
      <el-input
        v-model="query.sn"
        placeholder="请输入订单编号"
        style="width: 200px"
        class="filter-item"
        clearable
        @keydown.enter.native="handleFilter"
      />
      <el-select
        v-model="query.state"
        style="width: 120px; margin-left:10px"
        class="filter-item"
        placeholder="订单状态"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.key"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        style="margin-left: 10px"
        @click="handleFilterAll"
      >
        显示全部订单
      </el-button>
      <el-button
        v-if="false"
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleExport"
      >
        导出
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        label="ID"
        align="center"
        width="60"
        prop="id"
      />
      <el-table-column
        label="订单编号"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.sn }}
        </template>
      </el-table-column>
      <el-table-column
        label="用户名"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.buyerName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="收货号码"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单状态"
        width="90"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilter">
            {{ scope.row.state === 'paying' ? '待付款': scope.row.state === 'canceled' ? '已取消': scope.row.state === 'shipping' ? '待发货': scope.row.state === 'confirming' ? '待确认': scope.row.state === 'rating' ? '待评价': scope.row.state === 'finished' ? '已完成':scope.row.state === 'aborted' ? '已中止': '未设置' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="订单总额"
        align="center"
      >
        <template slot-scope="scope">
          {{ (scope.row.total * 0.01).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="400"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-view"
            @click="handleShow(scope.row)"
          >
            详情
          </el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-view"
            @click="handleInvoiceShow(scope.row)"
          >
            查看发票
          </el-button>
          <el-button
            v-if="scope.row.state === 'shipping'"
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="handleEditAddress(scope.row)"
          >
            修改收货信息
          </el-button>
          <span
            v-for="event in scope.row.Events"
            :key="event.index"
            style="margin-left:10px"
          >
            <dynamic-link
              :type="event"
              :order="scope.row"
              @refresh="onRefresh"
            />
          </span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="8"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-drawer
      title="订单详情"
      :visible.sync="drawer1"
    >
      <div
        class="box-card infinite-list"
        shadow="hover"
        style="overflow:auto;max-height:600px"
      >
        <info-table :table-data="orderDetail" />
        <div style="margin: 20px">
          <el-divider>包含商品</el-divider>
          <el-table
            :data="orderItems"
            style="width: 100%"
          >
            <el-table-column
              prop="title"
              label="商品名称"
            />
            <el-table-column
              prop="price"
              label="价格"
            />
            <el-table-column
              prop="number"
              label="数量"
            />
          </el-table>
        </div>
      </div>
    </el-drawer>

    <el-drawer
      title="发票信息"
      :visible.sync="drawer2"
    >
      <div
        class="box-card infinite-list"
        shadow="hover"
        style="overflow:auto;max-height:600px;margin: 0 20px"
      >
        <el-table
          :data="invoice"
          style="width: 100%"
        >
          <el-table-column
            label="发票类型"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.invoType === '0' ? '普通' : '电子' }}
            </template>
          </el-table-column>
          <el-table-column
            label="发票抬头"
            align="center"
            prop="title"
          />
          <el-table-column
            label="抬头类型"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.titleType === '0' ? '企业' : '个人' }}
            </template>
          </el-table-column>
          <el-table-column
            label="税号"
            prop="taxSn"
          />
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { exportJson2Excel } from '@/utils/excel' // 导出Excel所用的插件
import { parseTime, formatJson } from '@/utils/index' // 导出Excel所用的插件
import {
  Order,
  OrderItem,
  Invoice
} from '@/model' // 引入订单有关的model

import InfoTable from '@/components/InfoTable/index.vue'
import DynamicLink from '@/components/events/dynamicLink.vue'
import { confirm, message } from '../../utils/confirm'

// 组件注册，不可移除
@Component({
  name: 'Table',
  components: {
    InfoTable,
    DynamicLink
  },
  // 过滤器
  filters: {
    // 用于选择渲染标签样式，可修改
    statusFilter: (status: string) => {
      const statusMap: { [key: string]: string } = {
        'paying': 'danger',
        'shipping': 'warning',
        'signing': 'warning',
        'rating': 'success',
        'finished': '',
        'canceled': 'info',
        false: 'info'
      }
      return statusMap[status]
    },
    // 用于调整日期数据格式，可修改
    parseTime: (timestamp: string) => {
      return parseTime(new Date(timestamp), '{y}-{m}-{d}')
    }
  }
})
export default class extends Vue {
  // Vue中的data按以下形式定义

  // 表格数据及分类数据
  private list: any = []
  private orderItems: any = []
  private invoice: any = []

  // 订单属性选择
  private statusOptions = Order.statusOptions

  private query = { sn: '', state: '' }
  private sort:any = 'id'

  private orderItemQuery = {}
  private invoiceQuery = {}

  // 选中的列表对象数据
  private showSelectedItem: any = {}

  // 分页组件的总页码
  private total: number = 0
  private currentPage: number = 0

  // 控制表格和导出的加载效果
  private listLoading = true
  private downloadLoading = false

  // 控制详情弹窗和下架确认弹窗
  private drawer1: Boolean = false
  private drawer2: Boolean = false

  // 订单查询结构
  get scope() {
    return Order.where({ sn: { match: this.query.sn }, state: this.query.state })
      .stats({ total: 'count' })
      .order({ createdAt: 'desc' })
      .order(this.sort)
      .page(this.currentPage)
      .per(8)
      .includes(['user', 'invoice', 'logistics'])
      .selectExtra(['_events'])
  }

  private async searchOrder() {
    // 获取订单
    this.listLoading = true
    let orders = await this.scope.all()
    this.list = orders.data
    this.total = orders.meta.stats.total.count
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 查询订单项
  get getOrderItem() {
    return OrderItem.where(this.orderItemQuery).includes(['product', 'order'])
  }

  // 查询发票
  get getInvoice() {
    return Invoice.where(this.invoiceQuery)
  }

  // 页面创建时
  created() {
    this.searchOrder()
  }

  // 过滤列表数据
  private async handleFilter() {
    this.currentPage = 1
    this.searchOrder()
  }

  // 过滤列表数据
  private async handleFilterAll() {
    this.query.sn = ''
    this.query.state = ''
    this.currentPage = 1
    this.searchOrder()
  }

  // 抬头字段翻译
  private titleTypeFormat(row: any, column: any) {
    if (row.titleType === '0') {
      return '个人'
    } else return '企业'
  }

  // 类型字段翻译
  private invoTypeFormat(row: any, column: any) {
    if (row.invoType === '0') {
      return '普通'
    } else return '电子'
  }

  private onRefresh(res:boolean) {
    if (res) { this.searchOrder() }
  }

  // 处理修改收货地址事件
  private handleEditAddress(row: any) {
    this.$router.push({ name: 'editAddress', params: { data: row } })
  }

  // 处理详情事件，将选中详情的行对象存储并打开详情弹窗
  private async handleShow(row: any) {
    this.showSelectedItem = row
    this.drawer1 = true
    Vue.set(this.orderItemQuery, 'order_id', row.id)
    this.orderItems = (await this.getOrderItem.all()).data
  }

  // 处理详情事件，将选中详情的行对象存储并打开详情弹窗
  private async handleLogisticsShow(row: any) {
    this.showSelectedItem = row
    this.drawer2 = true
  }

  private async handleInvoiceShow(row: any) {
    this.showSelectedItem = row
    this.drawer2 = true
    Vue.set(this.invoiceQuery, 'order_id', row.id)
    this.invoice = (await this.getInvoice.all()).data
  }

  // 处理当前页数改变事件，绑定分页组件的current-change方法
  private async handleCurrentChange(val:any) {
    this.currentPage = val
    this.searchOrder()
  }

  // 导出下载Excel
  private async handleExport() {
    let orders = (await OrderItem.includes(['order', 'product']).all()).data
    this.downloadLoading = true
    const tHeader = ['来源单号', '厂商编码', '购买数量', '单价', '线上店铺', '收货人', '收货人手机', '省市区', '收货人地址', '顾客备注', '商家备注', '支付方式', '优惠卷折扣', '是否已支付（0未支付，1已支付）', '是否总部代发货订单（0否，1是）', '批次号']
    const filterVal = ['order.sn', 'product.firmSn', 'number', 'price', 'store', 'order.buyerName', 'order.mobile', 'address', 'order.house', 'order.memo', 'order.memo', 'pay', 'discount', 'isPay', 'isHead', 'batch']
    const data = formatJson(filterVal, orders)
    let filename = Date.now() + ''
    exportJson2Excel(tHeader, data, filename)
    this.downloadLoading = false
  }

  get orderDetail() {
    return [{
      header: '基本信息',
      text: [
        {
          title: '订单编号',
          value: this.showSelectedItem.sn
        },
        {
          title: '订单状态',
          value: this.showSelectedItem.state === 'paying' ? '待付款' : this.showSelectedItem.state === 'shipping' ? '待发货' : this.showSelectedItem.state === 'signing' ? '待签收' : this.showSelectedItem.state === 'rating' ? '待评价' : this.showSelectedItem.state === 'finished' ? '已完成' : this.showSelectedItem.state === 'canceled' ? '已取消' : '未设置'
        },
        {
          title: '订单总额',
          value: (this.showSelectedItem.total * 0.01).toFixed(2)
        },
        {
          title: '实付总额',
          value: (this.showSelectedItem.amount * 0.01).toFixed(2)
        },
        {
          title: '优惠类型',
          value: this.showSelectedItem.discountType === 'none' ? '默认' : '场景'
        },
        {
          title: '备注',
          value: this.showSelectedItem.memo
        },
        {
          title: '下单时间',
          value: parseTime(new Date(this.showSelectedItem.createdAt), '{y}-{m}-{d} {h}:{i}:{s}')
        }
      ]
    },
    {
      header: '收货地址',
      text: [
        {
          title: '收货人',
          value: this.showSelectedItem.buyerName
        },
        {
          title: '收货号码',
          value: this.showSelectedItem.mobile
        },
        {
          title: '省',
          value: this.showSelectedItem.province
        },
        {
          title: '市',
          value: this.showSelectedItem.city
        },
        {
          title: '区',
          value: this.showSelectedItem.district
        },
        {
          title: '详细地址',
          value: this.showSelectedItem.house
        }
      ]
    }
    ]
  }
}
</script>
