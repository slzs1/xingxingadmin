<template>
  <div class="app-container">
    <div
      class="filter-container"
      style="margin-bottom: 10px"
    >
      <el-input
        v-model="query.title"
        placeholder="请输入海报标题"
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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        @click="handleAlloff"
      >
        批量删除
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
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
        type="selection"
        align="center"
        width="50"
      />
      <el-table-column
        label="标题"
        align="center"
        prop="title"
        sortable="custom"
      />
      <el-table-column
        label="操作"
        width="300"
        align="center"
      >
        <template slot-scope="scope">
          <action-bar
            :action="['edit','show']"
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
      title="海报详情"
      :visible.sync="drawer"
    >
      <info-table
        :table-data="postDetail"
        :image-list="showSelectedItem.images"
      />
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Post } from '@/model' // 引入商品有关的model
import { confirm, message } from '@/utils/confirm'
import InfoTable from '@/components/InfoTable/index.vue'
import ActionBar from '@/components/ActionBar/index.vue'

// 组件注册，不可移除
@Component({
  name: 'Table',
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
  private sort:any= 'id'

  // 选中的列表对象数据
  private showSelectedItem:any = {}
  private multipleSelection:any = []

  // 分页组件的总页码
  private total: number = 0
  private currentPage: number = 1

  // 控制表格和导出的加载效果
  private listLoading = true
  private downloadLoading = false

  // 控制详情弹窗
  private drawer: Boolean = false

  get postDetail() {
    return [{
      header: '基本信息',
      text: [
        {
          title: '标题',
          value: this.showSelectedItem.title
        },
        {
          title: '正文',
          value: this.showSelectedItem.content
        },
        {
          title: '商品链接列表',
          value: this.showSelectedItem.products
        }
      ] }
    ]
  }

  // 案例查询结构
  get scope() {
    return Post.where(this.query)
      .stats({ total: 'count' })
      .order(this.sort)
      .page(this.currentPage)
      .per(8)
      .selectExtra(['_actions'])
  }

  // 页面创建时
  created() {
    this.searchPost()
  }

  private async searchPost() {
    // 获取案例
    this.listLoading = true
    let posts = await this.scope.all()
    this.list = posts.data
    console.log(this.list)
    this.total = posts.meta.stats.total.count
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 过滤列表数据
  private async handleFilter() {
    this.currentPage = 1
    this.searchPost()
  }

  // 处理添加事件，跳转添加页面
  private handleCreate() {
    this.$router.push({ name: 'newPost' })
  }
  // 处理修改事件，跳转修改页面
  private handleEdit(row: any) {
    // 将选中详情的行对象作为路由对象传递
    this.$router.push({ name: 'editPost', params: { data: row } })
  }

  // 处理详情事件，将选中详情的行对象存储并打开详情弹窗
  private handleShow(row: any) {
    this.showSelectedItem = row
    this.drawer = true
  }

  // 处理当前页数改变事件，绑定分页组件的current-change方法
  private handleCurrentChange(val:any) {
    this.currentPage = val
    this.searchPost()
  }

  private handleSelectionChange(val:any) {
    this.multipleSelection = val
  }
  // 处理全部下架事件，打开全部下架确认弹窗
  private async handleAlloff() {
    const list = this.multipleSelection
    if (this.multipleSelection.length === 0) {
      message('请至少选泽一项', 'warning')
    } else {
      confirm('确认要刪除吗？', 'warning', async action => {
        if (action === 'confirm') {
          for (const post of this.multipleSelection) {
            await post.destroy()
            if (post.hasError) {
              message('刪除失败！', 'error')
            }
          }
          message('刪除成功！', 'success')
          this.searchPost()
        } else {
          message('取消刪除', 'warning')
        }
      })
    }
  }

  // 对操作进行处理
  private handleAction(res:any) {
    switch (res.action) {
      case 'edit': {
        this.handleEdit(res.object)
        break
      }
      case 'show': {
        this.handleShow(res.object)
        break
      }
    }
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
    this.searchPost()
  }
}
</script>

<style>
div /deep/ :focus {
  outline: 0;
}
</style>
