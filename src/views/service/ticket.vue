<template>
  <div class="app-container">
    <div
      class="filter-container"
      style="margin-bottom: 10px"
    >
      <el-input
        v-model="query.orderId"
        placeholder="请输入订单ID"
        style="width: 200px;margin-right:10px"
        class="filter-item"
        clearable
        @keydown.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px"
        @click="handleFilter"
      >
        搜索
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @sort-change="handleSortChange"
    >
      <el-table-column
        label="订单ID"
        align="center"
        width="60"
      >
        <template slot-scope="scope">
          {{ scope.row.order? scope.row.order.id : '' }}
        </template>
      </el-table-column>
      <el-table-column
        label="订单编号"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.order? scope.row.order.sn : '' }}
        </template>
      </el-table-column>
      <el-table-column
        label="用户名"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.user? scope.row.user.username : '' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="state"
        label="订单状态"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.state }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作事件"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.event }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        align="center"
        prop="createdAt"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.createdAt | parseTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.state === '退换货'"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleStateEdit(scope.row)"
          >
            审核
          </el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-view"
            @click="handleShow(scope.row)"
          >
            详情
          </el-button>
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
      title="工单详情"
      :visible.sync="drawer"
    >
      <info-table
        :table-data="detail"
        :image-list="showSelectedItem.images ? showSelectedItem.images : []"
      />
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { exportJson2Excel } from '@/utils/excel' // 导出Excel所用的插件
import { formatJson, parseTime } from '@/utils/index' // 导出Excel所用的插件
import {
  Ticket
} from '@/model' // 引入商品有关的model
import InfoTable from '@/components/InfoTable/index.vue'
import { confirm, message } from '@/utils/confirm'
import reviewForm from './_review.vue'

// 组件注册，不可移除
@Component({
  name: 'productCat',
  components: {
    InfoTable,
    reviewForm
  },
  filters: {
    // 用于选择渲染标签样式，可修改
    statusFilter: (status: string) => {
      const statusMap: { [key: string]: string } = {
        '0': 'danger',
        '1': 'success'
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
  // 表格数据及分类数据
  private list: any = []

  private query = {}
  private sort:any = 'id'

  // 选中的列表对象数据
  private showSelectedItem:any = {}

  // 分页组件的总页码
  private total: number = 0
  private currentPage: number = 1

  // 控制表格和导出的加载效果
  private listLoading = true
  private downloadLoading = false

  // 控制详情弹窗和下架确认弹窗
  private drawer: Boolean = false

  // 控制审核弹窗
  private showDialogVisible: Boolean = false

  // 服务查询结构
  get scope() {
    return Ticket.where(this.query)
      .stats({ total: 'count' })
      .order({ createdAt: 'desc' })
      .order(this.sort)
      .page(this.currentPage)
      .per(8)
      .includes(['order', 'user'])
  }
  private async searchTickets() {
    // 获取服务
    this.listLoading = true
    let tickets = await this.scope.all()
    this.list = tickets.data
    this.total = tickets.meta.stats.total.count
    console.log(this.list)
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 页面创建时
  created() {
    this.searchTickets()
  }

  // 过滤列表数据
  private async handleFilter() {
    this.searchTickets()
  }

  // 处理当前页数改变事件，绑定分页组件的current-change方法
  private handleCurrentChange(val:any) {
    console.log('pagechange')
    this.currentPage = val
    this.searchTickets()
  }

  // 处理详情事件，将选中详情的行对象存储并打开详情弹窗
  private handleShow(row: any) {
    console.log('进入订单类工单详情')
    this.showSelectedItem = row
    console.log(this.showSelectedItem)
    this.drawer = true
  }
  // 处理详情事件，将选中详情的行对象存储并打开详情弹窗
  private handleStateEdit(row: any) {
    this.showSelectedItem = row
    this.showDialogVisible = true
  }

  // 处理排序改变事件
  private handleSortChange(val:any) {
    if (val.order) {
      this.sort = {}
      let value: string
      value = val.order === 'ascending' ? 'asc' : 'desc'
      this.sort[val.prop] = value
    } else {
      this.sort = 'id'
    }
    this.searchTickets()
  }

  get detail() {
    let res = []
    res.push({
      header: '基本信息',
      text: [
        {
          title: '工单号',
          value: this.showSelectedItem.id
        },
        {
          title: '状态',
          value: this.showSelectedItem.state
        },
        {
          title: '事件',
          value: this.showSelectedItem.event
        },
        {
          title: '内容',
          value: this.showSelectedItem.content ? this.showSelectedItem.content : '无'
        },
        {
          title: '卖家备注',
          value: this.showSelectedItem.memo ? this.showSelectedItem.memo : '无'
        },
        {
          title: '创建日期',
          value: parseTime(new Date(this.showSelectedItem.createdAt), '{y}-{m}-{d}')
        }
      ]
    })
    if (this.showSelectedItem.order) {
      res.push({
        header: '关联订单',
        text: [
          {
            title: '订单编号',
            value: this.showSelectedItem.order.sn
          },
          {
            title: '收货人姓名',
            value: this.showSelectedItem.order.buyerName
          },
          {
            title: '收货人电话',
            value: this.showSelectedItem.order.mobile
          },
          {
            title: '订单总额',
            value: this.showSelectedItem.order.total
          },
          {
            title: '收货地址',
            value: this.showSelectedItem.order.province + this.showSelectedItem.order.city + this.showSelectedItem.order.district + ' ' + this.showSelectedItem.order.house
          }
        ]
      })
    } else {
      res.push({
        header: '关联订单',
        text: [
          {
            title: '订单号',
            value: '无'
          }
        ]
      })
    }
    if ('user' in this.showSelectedItem) {
      res.push({
        header: '下订单的用户',
        text: [
          {
            title: '用户名',
            value: this.showSelectedItem.user.username
          },
          {
            title: '手机号',
            value: this.showSelectedItem.user.phone ? this.showSelectedItem.user.phone : '无'
          }
        ]
      })
    }
    return res
  }
}
</script>

<style scoped>
div /deep/ :focus {
  outline: 0;
}
.item {
    font-size: 14px;
    margin-bottom: 10px;
    color: #606266;
  }

.header {
    font-size: 16px;
    margin: 15px 0;
    color: #909399;
  }
</style>
