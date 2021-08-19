<template>
  <div class="app-container">
    <div
      class="filter-container"
      style="margin-bottom: 10px"
    >
      <el-input
        v-model="query.title"
        placeholder="请输入场景名称"
        style="width: 200px; margin-right: 20px"
        class="filter-item"
        clearable
        @keydown.enter.native="handleFilter"
      />
      <el-select
        v-model="query.scene_cat_id"
        style="width: 150px;margin-right:10px"
        class="filter-item"
        placeholder="场景分类"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in catOptions"
          :key="item.key"
          :label="item.name"
          :value="item.id"
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
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
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
        label="ID"
        align="center"
        width="60"
        sortable="custom"
        prop="id"
      />
      <el-table-column
        label="场景名称"
        align="center"
        sortable="custom"
        prop="title"
      />
      <el-table-column
        label="类型"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.sceneCat.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        align="center"
        prop="content"
      />
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <action-bar
            :action="['edit','show','destroy']"
            :object="scope.row"
            @bindAction="handleAction"
          />
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        layout="total, prev, pager, next"
        :total="total"
        :page-size="8"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-drawer
      title="商品详情"
      :visible.sync="drawer"
    >
      <div
        class="box-card infinite-list"
        shadow="hover"
        style="overflow:auto;max-height:600px"
      >
        <info-table
          :table-data="detail"
          :image-list="showSelectedItem.images"
        />
        <div style="margin: 20px">
          <el-divider>包含商品</el-divider>
          <el-table
            :data="showSelectedItem.products"
            style="width: 100%"
          >
            <el-table-column
              prop="title"
              label="名称"
            />
            <el-table-column
              prop="sn"
              label="编号"
            />
          </el-table>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  Scene,
  SceneCat
} from '@/model' // 引入场景有关的model
import InfoTable from '@/components/InfoTable/index.vue'
import { confirm, message } from '../../utils/confirm'
import ActionBar from '@/components/ActionBar/index.vue'
import { component } from 'vue/types/umd'

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
  private sort:any = 'id'

  // 选中的列表对象数据
  private showSelectedItem:any ={
    sceneCat: {
      name: '',
      content: ''
    }
  }

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
            title: '场景名称',
            value: this.showSelectedItem.title
          },
          {
            title: '场景描述',
            value: this.showSelectedItem.content
          },
          {
            title: '场景类型',
            value: this.showSelectedItem.sceneCat.name
          },
          {
            title: '类型描述',
            value: this.showSelectedItem.sceneCat.content
          }
        ]
      }
    ]
  }

  // 场景查询结构
  get scope() {
    return Scene.where(this.query)
      .stats({ total: 'count' })
      .order(this.sort)
      .page(this.currentPage)
      .per(8)
      .includes(['scene_cat', 'products'])
      .selectExtra(['_actions'])
  }

  // 页面创建时
  created() {
    this.searchScene()
    this.getCat()
  }

  private async searchScene() {
    // 获取场景
    this.listLoading = true
    let sences = await this.scope.all()
    this.list = sences.data
    console.log(this.list)
    this.total = sences.meta.stats.total.count
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private async getCat() {
    this.catOptions = (await SceneCat.all()).data
  }

  // 过滤列表数据
  private async handleFilter() {
    this.currentPage = 1
    this.searchScene()
  }

  // 处理添加事件，跳转添加页面
  private handleCreate() {
    this.$router.push({ name: 'newScene' })
  }
  // 处理修改事件，跳转修改页面
  private handleEdit(row: any) {
    this.$router.push({ name: 'editScene', params: { data: row } })
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
      case 'destroy': {
        this.handleDestroy(res.object)
        break
      }
    }
  }

  // 处理详情事件，将选中详情的行对象存储并打开详情弹窗
  private handleShow(row: Scene) {
    this.showSelectedItem = row
    this.drawer = true
  }

  private async handleDestroy(row: Scene) {
    confirm(`确定要删除 场景：${row.title} 吗？`, 'warning', async action => {
      if (action === 'confirm') {
        let success = await row.destroy()
        if (!success) {
          message('删除失败！', 'error')
        } else {
          message('删除成功！', 'success')
          this.searchScene()
        }
      } else {
        message('取消删除', 'warning')
      }
    })
  }

  // 处理当前页数改变事件，绑定分页组件的current-change方法
  private async handleCurrentChange(val:any) {
    this.currentPage = val
    this.searchScene()
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
    this.searchScene()
  }
}
</script>
