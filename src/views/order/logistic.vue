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
        label="订单单号"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.orderSn }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商品厂家编码"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.firmSn }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商品型号及类型"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.modelWithNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="物流单号"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.sn }}
        </template>
      </el-table-column>
      <el-table-column
        label="物流公司名"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.company }}</span>
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        label="是否送达"
        align="center"
        width="90"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.isDone | statusFilter">
            {{ scope.row.isDone ? '已送达': '未送达' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="是否换货"
        align="center"
        width="90"
      >
        <template slot-scope="scope">
          <el-tag :type="!scope.row.isExchange | statusFilter">
            {{ scope.row.isExchange ? '换货': '正常' }}
          </el-tag>
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
  Order,
  Logistic
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
    }
  }
})

export default class extends Vue {
  // Vue中的data按以下形式定义

  // 表格数据及分类数据
  private list: any = []
  private catOptions: any = []

  private query = {}
  private sort = 'id'

  // 选中的列表对象数据
  private showSelectedItem:any = {}

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
    return Logistic.where(this.query)
      .stats({ total: 'count' })
      .order({ createdAt: 'desc' })
      .order(this.sort)
      .page(this.currentPage)
      .per(8)
      .includes(['order'])
  }

  private async searchLogistic() {
    // 获取发票
    this.listLoading = true
    let logistics = await this.scope.all()
    this.list = logistics.data
    console.log(this.list)
    this.total = logistics.meta.stats.total.count
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 页面创建时
  created() {
    this.searchLogistic()
  }

  // 过滤列表数据
  private async handleFilter() {
    this.searchLogistic()
  }

  // 处理详情事件，将选中详情的行对象存储并打开详情弹窗
  private handleShow(row: any) {
    this.showSelectedItem = row
    this.showDialogVisible = true
  }

  // 处理当前页数改变事件，绑定分页组件的current-change方法
  private async handleCurrentChange(val:any) {
    this.currentPage = val
    this.searchLogistic()
  }

  get detail() {
    return [{
      header: '基本信息',
      text: [
        {
          title: '订单编号',
          value: this.showSelectedItem.orderSn
        },
        {
          title: '电子邮箱',
          value: this.showSelectedItem.email
        },
        {
          title: '发票抬头',
          value: this.showSelectedItem.title
        },
        {
          title: '发票类型',
          value: this.showSelectedItem.invoType === '0' ? '普通' : '电子'
        },
        {
          title: '抬头类型',
          value: this.showSelectedItem.titleType === '0' ? '个人' : '企业'
        },
        {
          title: '税号',
          value: this.showSelectedItem.taxSn
        },
        {
          title: '下单时间',
          value: this.showSelectedItem.orderAt
        },
        {
          title: '订单总额',
          value: this.showSelectedItem.order.total
        },
        {
          title: '订单状态',
          value: this.showSelectedItem.order.status
        }
      ] }
    ]
  }
}
</script>
