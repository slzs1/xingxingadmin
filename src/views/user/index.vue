<template>
  <div class="app-container">
    <div
      class="filter-container"
      style="margin-bottom: 10px"
    >
      <el-input
        v-model="query.username"
        placeholder="请输入用户名"
        style="width: 200px; margin-right: 20px"
        class="filter-item"
        clearable
        @keydown.enter.native="handleFilter"
      />
      <el-input
        v-model="query.openid"
        placeholder="微信ID"
        style="width: 200px"
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
        align="center"
        width="60"
      >
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="用户名"
        align="center"
        prop="username"
        sortable="custom"
      />
      <el-table-column
        label="微信ID"
        align="center"
        prop="openid"
        sortable="custom"
      />
      <el-table-column
        label="手机号"
        align="center"
        prop="phone"
        sortable="custom"
      />
      <el-table-column
        label="角色"
        align="center"
        prop="role"
        sortable="custom"
      />
      <el-table-column
        label="操作"
        align="center"
        width="220"
      >
        <template slot-scope="scope">
          <el-button
            type="info"
            size="mini"
            icon="el-icon-view1"
            @click="handleShow1(scope.row)"
          >
            查看订单
          </el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-view2"
            @click="handleShow2(scope.row)"
          >
            查看工单
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
      title="订单详情"
      :visible.sync="drawer2"
    >
      <div
        class="box-card infinite-list"
        shadow="hover"
        style="overflow:auto;max-height:600px;margin: 0 10px"
      >
        <el-table
          :data="showSelectedItem.orders"
          style="width: 100%"
        >
          <el-table-column
            prop="sn"
            label="编号"
          />
          <el-table-column
            prop="state"
            label="订单状态"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.state | statusFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="total"
            label="订单总额"
          />
          <el-table-column
            prop="createdAt"
            label="下单时间"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createdAt | parseTime }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <el-drawer
      title="工单详情"
      :visible.sync="drawer1"
    >
      <div
        class="box-card infinite-list"
        shadow="hover"
        style="overflow:auto;max-height:600px;margin: 0 10px"
      >
        <el-table
          :data="showSelectedItem.services"
          style="width: 100%"
        >
          <el-table-column
            prop="serviceType"
            label="服务类型"
          />
          <el-table-column
            prop="repair"
            label="维修码"
          />
          <el-table-column
            prop="status"
            label="状态"
          >
            <template slot-scope="scope">
              {{ scope.row.status === 0 ? '待处理': '已处理' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="reservedAt"
            label="预约时间"
          />
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { parseTime } from '@/utils/index'
import { User, Service, Order } from '@/model'
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
        'paying': '待付款',
        'shipping': '待发货',
        'signing': '待签收',
        'rating': '待评价',
        'finished': '已完成',
        'canceled': '已取消',
        'aborted': '已中止'
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
  private catOptions: any = []
  private typeOptions: any = Service.typeOptions

  private query = {}
  private sort:any = 'id'

  // 选中的列表对象数据
  private showSelectedItem:any = { }

  // 分页组件的总页码
  private total: number = 0
  private currentPage: number = 1

  // 控制表格和导出的加载效果
  private listLoading = true
  private downloadLoading = false

  // 控制详情弹窗和下架确认弹窗
  private drawer1: Boolean = false
  private drawer2: Boolean = false

  // 订单工单查询结构
  get scope() {
    return User.where(this.query)
      .stats({ total: 'count' })
      .order(this.sort)
      .page(this.currentPage)
      .per(8)
      .includes(['orders', 'services'])
  }

  // 页面创建时
  created() {
    this.searchUser()
  }

  private async searchUser() {
    // 获取订单工单
    this.listLoading = true
    let users = await this.scope.all()
    this.list = users.data
    this.total = users.meta.stats.total.count
    console.log(this.list)
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 过滤列表数据
  private async handleFilter() {
    this.currentPage = 1
    this.searchUser()
  }

  // 处理订单事件，将选中详情的行对象存储并打开详情弹窗
  private handleShow1(row: any) {
    this.showSelectedItem = row
    this.drawer2 = true
  }

  // 处理工单事件，将选中详情的行对象存储并打开详情弹窗
  private handleShow2(row: any) {
    this.showSelectedItem = row
    this.drawer1 = true
  }

  // 处理当前页数改变事件，绑定分页组件的current-change方法
  private handleCurrentChange(val:any) {
    this.currentPage = val
    this.searchUser()
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
    this.searchUser()
  }
}
</script>
