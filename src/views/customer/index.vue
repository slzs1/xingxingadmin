<template>
  <div class="app-container">
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
        label="标题"
        align="center"
        prop="title"
      />
      <el-table-column
        label="电话号码"
        align="center"
        prop="mobile"
      />
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="info"
            size="mini"
            icon="el-icon-view"
            width="150"
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
      title="合作详情"
      :visible.sync="drawer"
    >
      <info-table :table-data="detail" />
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Customer } from '@/model'
import InfoTable from '@/components/InfoTable/index.vue'

@Component({
  name: 'customerTable',
  components: {
    InfoTable
  }
})

export default class extends Vue {
  private list: any = []
  private listLoading = true

  // 分页组件的总页码
  private total: number = 0
  private currentPage = 1

  private showSelectedItem:any = {}
  private drawer:boolean = false

  get detail() {
    return [
      {
        header: '合作信息',
        text: [
          {
            title: '标题',
            value: this.showSelectedItem.title
          },
          {
            title: '电话号码',
            value: this.showSelectedItem.mobile
          },
          {
            title: '内容',
            value: this.showSelectedItem.content
          }
        ]
      }
    ]
  }

  get scope() {
    return Customer.where({})
      .order({ createdAt: 'desc', id: 'desc' })
      .stats({ total: 'count' })
      .page(this.currentPage)
      .per(8)
  }

  created() {
    this.searchCustomer()
  }

  private async searchCustomer() {
    this.listLoading = true
    let customers = await this.scope.all()
    this.list = customers.data
    this.total = customers.meta.stats.total.count

    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private handleShow(row: any) {
    this.showSelectedItem = row
    this.drawer = true
  }

  // 处理当前页数改变事件，绑定分页组件的current-change方法
  private async handleCurrentChange(val:any) {
    this.currentPage = val
    this.searchCustomer()
  }
}
</script>
