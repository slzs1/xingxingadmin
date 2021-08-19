<template>
  <div class="app-container">
    <div
      class="filter-container"
      style="margin-bottom: 10px"
    >
      <el-input
        v-model="query.username"
        placeholder="请输入用户名"
        style="width: 200px"
        class="filter-item"
        clearable
        @keydown.enter.native="handleFilter"
      />
      <el-input
        v-model="query.productId"
        placeholder="请输入商品ID"
        style="width: 200px;margin-left: 10px"
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
      <el-button
        class="filter-item"
        type="primary"
        style="margin-left: 10px"
        @click="handleFilterAll"
      >
        显示全部评论
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
        label="商品ID"
        width="80"
      >
        <template slot-scope="scope">
          {{ scope.row.product.id }}
        </template>
      </el-table-column>
      <el-table-column
        label="评论商品"
        width="300"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.product.title }}
        </template>
      </el-table-column>
      <el-table-column
        label="用户名"
        width="200"
        align="center"
        prop="username"
        sortable="custom"
      />
      <el-table-column
        label="评论内容"
        align="center"
        prop="content"
      />
      <el-table-column
        label="评分(0-10)"
        width="120"
        align="center"
        prop="rate"
        sortable="custom"
      />
      <el-table-column
        label="是否显示"
        width="120"
        align="center"
        prop="isShow"
        sortable="custom"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isShow"
            active-color="#13ce66"
            @change="onChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300"
        align="center"
      >
        <template slot-scope="scope">
          <action-bar
            :action="['show']"
            :object="scope.row"
            @bindAction="handleAction"
          />
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
      title="评论详情"
      :visible.sync="drawer"
    >
      <info-table
        :table-data="detail"
        :image-list="showSelectedItem.images"
      />
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Comment } from '@/model' // 引入商品有关的model
import { confirm, message } from '@/utils/confirm'
import InfoTable from '@/components/InfoTable/index.vue'
import ActionBar from '@/components/ActionBar/index.vue'

// 组件注册，不可移除
@Component({
  name: 'commentTable',
  components: {
    InfoTable,
    ActionBar
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
  private showSelectedItem:any = {}

  // 分页组件的总页码
  private total: number = 0
  private currentPage: number = 1

  // 控制表格和导出的加载效果
  private listLoading = true
  private downloadLoading = false

  // 控制详情弹窗
  private drawer: Boolean = false

  get detail() {
    return [
      {
        header: '基本信息',
        text: [
          {
            title: '用户名',
            value: this.showSelectedItem.username
          },
          {
            title: '评论文字',
            value: this.showSelectedItem.content
          },
          {
            title: '星级',
            value: this.showSelectedItem.rate
          }
        ]
      }
    ]
  }

  // 案例查询结构
  get scope() {
    return Comment.where(this.query)
      .stats({ total: 'count' })
      .order({ createdAt: 'desc' })
      .order(this.sort)
      .page(this.currentPage)
      .per(8)
      .includes(['user', 'product'])
      .selectExtra(['_actions'])
  }

  // 页面创建时
  created() {
    this.searchComment()
  }

  private async searchComment() {
    // 获取案例
    this.listLoading = true
    let comments = await this.scope.all()
    console.log(comments.data)
    this.list = comments.data
    this.total = comments.meta.stats.total.count
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 过滤列表数据
  private async handleFilter() {
    this.currentPage = 1
    this.searchComment()
  }

  private async handleFilterAll() {
    this.query = {}
    this.currentPage = 1
    this.searchComment()
  }

  // 处理详情事件，将选中详情的行对象存储并打开详情弹窗
  private handleShow(row: any) {
    this.showSelectedItem = row
    this.drawer = true
  }

  private handleAction(res:any) {
    if (res.action === 'show') {
      this.handleShow(res.object)
    }
  }

  // 处理当前页数改变事件，绑定分页组件的current-change方法
  private handleCurrentChange(val:any) {
    this.currentPage = val
    this.searchComment()
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
    this.searchComment()
  }

  // 处理修改事件，跳转修改页面
  private onChange(row: any) {
    confirm('确认要更改该条评论的状态吗？', 'warning', async action => {
      if (action === 'confirm') {
        let success = await row.save()
        if (success) {
          message('更改成功！', 'success')
        } else {
          message('更改失败！', 'error')
        }
        this.searchComment()
      } else {
        message('取消更改', 'warning')
        row.isShow = !row.isShow
      }
    })
  }
}
</script>

<style>
div /deep/ :focus {
  outline: 0;
}
</style>
