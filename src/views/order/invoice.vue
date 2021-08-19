<template>
  <div class="app-container">
    <div
      class="filter-container"
      style="margin-bottom: 10px"
    >
      <el-input
        v-model="query.order_sn"
        placeholder="请输入订单编号"
        style="width: 150px"
        class="filter-item"
        clearable
        @keydown.enter.native="handleFilter"
      />
      <el-select
        v-model="query.invoType"
        style="width: 120px;margin:0 10px"
        class="filter-item"
        placeholder="发票类型"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in invoTypeOptions"
          :key="item.key"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="query.titleType"
        style="width: 150px"
        class="filter-item"
        placeholder="抬头类型"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in titleTypeOptions"
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
        align="center"
        width="60"
      >
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="订单编号"
        sortable="custom"
        align="center"
        prop="orderSn"
      >
        <template slot-scope="scope">
          {{ scope.row.orderSn }}
        </template>
      </el-table-column>
      <el-table-column
        label="税号"
        align="center"
        prop="taxSn"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.taxSn }}
        </template>
      </el-table-column>
      <el-table-column
        label="电子邮箱"
        align="center"
        prop="email"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column
        label="发票抬头"
        align="center"
        prop="title"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发票类型"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.invoType === '0' ? '普通' : '电子' }}
        </template>
      </el-table-column>
      <el-table-column
        label="抬头类型"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.titleType === '0' ? '企业' : '个人' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="下单时间"
        prop="orderAt"
        sortable="custom"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.orderAt | parseTime }}</span>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { exportJson2Excel } from '@/utils/excel' // 导出Excel所用的插件
import { parseTime, formatJson } from '@/utils/index' // 导出Excel所用的插件
import {
  Invoice,
  Order
} from '@/model' // 引入发票有关的model
import InfoTable from '@/components/InfoTable/index.vue'
// 组件注册，不可移除
@Component({
  name: 'Table',
  components: {
    InfoTable
  },
  // 过滤器
  filters: {
    // 用于选择渲染标签样式，可修改
    statusFilter: (status: string) => {
      const statusMap: { [key: string]: string } = {
        true: 'success',
        false: 'danger'
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
  private catOptions: any = []

  private query = {}
  private sort:any = 'id'

  // 选中的列表对象数据
  private showSelectedItem:any = {
    productCat: {
      name: ''
    }
  }

  private invoTypeOptions = Invoice.invoTypeOptions
  private titleTypeOptions = Invoice.titleTypeOptions

  // 分页组件的总页码
  private total: number = 0
  private currentPage: number = 1

  // 控制表格和导出的加载效果
  private listLoading = true
  private downloadLoading = false

  // 控制详情弹窗
  private showDialogVisible: Boolean = false

  // 发票查询结构
  get scope() {
    return Invoice.where(this.query)
      .stats({ total: 'count' })
      .order(this.sort)
      .page(this.currentPage)
      .per(8)
      .includes(['order'])
  }

  private async searchInvoice() {
    // 获取发票
    this.listLoading = true
    let invoices = await this.scope.all()
    this.list = invoices.data
    this.total = invoices.meta.stats.total.count
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 页面创建时
  created() {
    this.searchInvoice()
  }

  // 过滤列表数据
  private async handleFilter() {
    this.searchInvoice()
  }

  // 处理详情事件，将选中详情的行对象存储并打开详情弹窗
  private handleShow(row: any) {
    this.showSelectedItem = row
    this.showDialogVisible = true
  }

  // 处理当前页数改变事件，绑定分页组件的current-change方法
  private async handleCurrentChange(val: any) {
    this.currentPage = val
    this.searchInvoice()
  }

  // 处理排序改变事件
  private async handleSortChange(val: any) {
    console.log(val)
    if (val.order) {
      this.sort = {}
      let value: string
      value = val.order === 'ascending' ? 'asc' : 'desc'
      this.sort[val.prop] = value
    } else {
      this.sort = 'id'
    }
    this.searchInvoice()
  }
}
</script>
