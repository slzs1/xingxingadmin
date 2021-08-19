<template>
  <div class="app-container">
    <div
      class="filter-container"
      style="margin-bottom: 10px"
    >
      <el-input
        v-model="query.name"
        placeholder="请输入联系人姓名"
        style="width: 200px;margin-right:10px"
        class="filter-item"
        clearable
        @keydown.enter.native="handleFilter"
      />
      <el-select
        v-model="query.serviceType"
        style="width: 150px;margin-right:10px"
        class="filter-item"
        placeholder="服务类型"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in typeOptions"
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
        label="工单编号"
        align="center"
        prop="id"
        width="60"
      />
      <el-table-column
        label="型号"
        align="center"
        prop="model"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.model }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="serviceType"
        label="服务类型"
      />
      <el-table-column
        label="维修码"
        align="center"
        prop="repair"
        sortable="custom"
      />
      <el-table-column
        label="故障描述"
        align="center"
        prop="details"
        sortable="custom"
      />
      <el-table-column
        label="姓名"
        align="center"
        prop="name"
        sortable="custom"
      />
      <el-table-column
        label="联系电话"
        align="center"
        prop="phone"
        sortable="custom"
      />
      <el-table-column
        class-name="status-col"
        label="状态"
        align="center"
        prop="state"
        sortable="custom"
        width="90"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilter">
            {{ scope.row.state === '0' ? '待处理' : '已处理' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            :disabled="scope.row.state === '1'"
            @click="handleStateEdit(scope.row)"
          >
            已处理
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
      <info-table :table-data="detail" />
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { exportJson2Excel } from '@/utils/excel' // 导出Excel所用的插件
import { formatJson, parseTime } from '@/utils/index' // 导出Excel所用的插件
import { Service } from '@/model' // 引入商品有关的model
import InfoTable from '@/components/InfoTable/index.vue'
import { confirm, message } from '@/utils/confirm'
import { Row } from 'element-ui'

// 组件注册，不可移除
@Component({
  name: 'productCat',
  components: {
    InfoTable
  },
  filters: {
    // 用于选择渲染标签样式，可修改
    statusFilter: (status: string) => {
      const statusMap: { [key: string]: string } = {
        '0': 'danger',
        '1': 'success'
      }
      return statusMap[status]
    }
  }
})

export default class extends Vue {
  // 表格数据及分类数据
  private list: any = []
  private typeOptions: any = Service.typeOptions

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

  get detail() {
    return [
      {
        header: '基本信息',
        text: [
          {
            title: '工单号',
            value: this.showSelectedItem.id
          },
          {
            title: '服务类型',
            value: this.showSelectedItem.serviceType
          },
          {
            title: '预约时间',
            value: this.showSelectedItem.reservedAt ? parseTime(new Date(this.showSelectedItem.reservedAt), '{y}-{m}-{d} {h}:{i}:{s}') : '无'
          },
          {
            title: '处理状态',
            value: this.showSelectedItem.state === '0' ? '待处理' : '已处理'
          }
        ]
      },
      {
        header: '设备信息',
        text: [
          {
            title: '设备型号',
            value: this.showSelectedItem.model
          },
          {
            title: '维修码',
            value: this.showSelectedItem.repair
          },
          {
            title: '故障描述',
            value: this.showSelectedItem.details
          }
        ]
      },
      {
        header: '用户信息',
        text: [
          {
            title: '联系人',
            value: this.showSelectedItem.name
          },
          {
            title: '联系电话',
            value: this.showSelectedItem.phone
          },
          {
            title: '上门地址',
            value: this.showSelectedItem.address
          }
        ]
      }
    ]
  }

  // 服务查询结构
  get scope() {
    return Service.where(this.query)
      .stats({ total: 'count' })
      .order(this.sort)
      .page(this.currentPage)
      .per(8)
      .includes('user')
      .selectExtra(['_events', '_actions'])
  }

  // 页面创建时
  created() {
    this.searchService()
  }

  private async searchService() {
    // 获取服务
    this.listLoading = true
    let services = await this.scope.all()
    this.list = services.data
    console.log(this.list)
    this.total = services.meta.stats.total.count
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 过滤列表数据
  private async handleFilter() {
    this.currentPage = 1
    this.searchService()
  }

  // 处理当前页数改变事件，绑定分页组件的current-change方法
  private handleCurrentChange(val:any) {
    this.currentPage = val
    this.searchService()
  }

  // 处理详情事件，将选中详情的行对象存储并打开详情弹窗
  private handleShow(row: any) {
    this.showSelectedItem = row
    this.drawer = true
  }

  private async handleStateEdit(row: any) {
    confirm('确定要更新状态吗？', 'warning', async action => {
      if (action === 'confirm') {
        console.log(row)
        row.state = '1'
        let success = await row.save()
        console.log(success)
        if (!success) {
          message('更新失败！', 'error')
        } else {
          message('更新成功！', 'success')
        }
      } else {
        message('取消更新', 'warning')
      }
    })
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
    this.searchService()
  }
}
</script>
