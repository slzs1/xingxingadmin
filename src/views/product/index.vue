<template>
  <div class="app-container">
    <div
      class="filter-container"
      style="margin-bottom: 10px"
    >
      <el-input
        v-model="titleQuery"
        placeholder="请输入商品名称"
        style="width: 200px;margin-right:10px"
        class="filter-item"
        clearable
        @keydown.enter.native="handleFilter"
      />
      <el-select
        v-model="query.product_cat_id"
        style="width: 150px;margin-right:10px"
        class="filter-item"
        placeholder="商品分类"
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
      <el-select
        v-model="query.isRecommend"
        style="width: 120px;margin-right:10px"
        class="filter-item"
        placeholder="是否推荐"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in recommendOptions"
          :key="item.key"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="query.isOff"
        style="width: 120px;margin-right:10px"
        class="filter-item"
        placeholder="是否下架"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in offOptions"
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
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleImport"
      >
        导入
      </el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        @click="handleAlloff"
      >
        批量下架
      </el-button>
    </div>

    <el-table
      ref="multipleTable"
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
        label="ID"
        align="center"
        width="50"
        sortable="product"
        prop="id"
      />
      <el-table-column
        type="selection"
        align="center"
        width="50"
      />
      <el-table-column
        label="商品名称"
        align="center"
        sortable="product"
        prop="title"
      />
      <el-table-column
        label="商品编码"
        width="150"
        align="center"
        sortable="product"
        prop="sn"
      />
      <el-table-column
        label="型号"
        width="150"
        align="center"
        sortable="product"
        prop="model"
      />
      <el-table-column
        label="商品分类"
        width="150"
        align="center"
        sortable="product"
        prop="category"
      >
        <template slot-scope="scope">
          {{ scope.row.productCat.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="销量"
        width="100"
        align="center"
        prop="salesCount"
      />
      <el-table-column
        class-name="status-col"
        label="是否推荐"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isRecommend"
            active-color="#13ce66"
            @change="onChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="下架状态"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            :type="!scope.row.isOff | statusFilter"
            @click="handleOff(scope.row)"
          >
            {{ scope.row.isOff ? '已下架' : '未下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="最近更新时间"
        width="100"
        sortable="product"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updatedAt | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="400"
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

    <div
      class="pagination"
      style="margin-top: 10px"
    >
      <el-pagination
        :current-page="currentPage"
        :page-size="8"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-drawer
      title="商品详情"
      :visible.sync="drawer"
    >
      <info-table :table-data="detail" />
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { parseTime } from '@/utils/index'
import { confirm, message } from '@/utils/confirm'
import { Product, ProductCat } from '@/model' // 引入商品有关的model
import InfoTable from '@/components/InfoTable/index.vue'
import ActionBar from '@/components/ActionBar/index.vue'

// 组件注册，不可移除
@Component({
  name: 'Table',
  components: {
    InfoTable,
    ActionBar
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
  // 表格数据及分类数据
  private list: any = []
  private catOptions: any = []

  private query = { isOff: false }
  private titleQuery = ''
  private sort:any = 'id'

  // 商品属性选择，从model中引入
  private recommendOptions = Product.recommendOptions
  private offOptions = Product.offOptions

  // 选中的列表对象数据
  private showSelectedItem:any = {}
  private multipleSelection:Product[] = []

  // 控制表格和导出的加载效果
  private listLoading = true
  private downloadLoading = false

  // 控制分页的当前页和总数
  private currentPage = 1
  private total = 0

  private showDialogVisible: Boolean = false
  private drawer:boolean = false

  get detail() {
    return [
      {
        header: '基本信息',
        text: [
          {
            title: '商品编码',
            value: this.showSelectedItem.sn
          },
          {
            title: '商品名称',
            value: this.showSelectedItem.title
          },
          {
            title: '分类',
            value: this.showSelectedItem.category
          },
          {
            title: '型号',
            value: this.showSelectedItem.model
          },
          {
            title: '成本价(元)',
            value: (this.showSelectedItem.costPrice * 0.01).toFixed(2)
          },
          {
            title: '销售价(元)',
            value: (this.showSelectedItem.price * 0.01).toFixed(2)
          },
          {
            title: '品牌',
            value: this.showSelectedItem.brand
          },
          {
            title: '长(mm)',
            value: this.showSelectedItem.length
          },
          {
            title: '宽(mm)',
            value: this.showSelectedItem.width
          },
          {
            title: '高(mm)',
            value: this.showSelectedItem.height
          },
          {
            title: '重量(kg)',
            value: (this.showSelectedItem.weight * 0.01).toFixed(2)
          },
          {
            title: '容积(立方米)',
            value: (this.showSelectedItem.volume * 0.01).toFixed(2)
          },
          {
            title: '视频链接',
            value: this.showSelectedItem.video
          },
          {
            title: '是否是推荐商品',
            value: this.showSelectedItem.isRecommend ? '是' : '否'
          },
          {
            title: '是否下架',
            value: this.showSelectedItem.isOff ? '是' : '否'
          },
          {
            title: '创建时间',
            value: parseTime(new Date(this.showSelectedItem.createdAt), '{y}-{m}-{d} {h}:{i}:{s}')
          },
          {
            title: '更新时间',
            value: parseTime(new Date(this.showSelectedItem.updatedAt), '{y}-{m}-{d} {h}:{i}:{s}')
          }
        ]
      }
    ]
  }

  // 商品查询结构
  get scope() {
    return Product.where(this.query)
      .where({ title: { match: this.titleQuery } })
      .stats({ total: 'count' })
      .order(this.sort)
      .page(this.currentPage)
      .per(8)
      .includes(['productCat'])
      .selectExtra(['_actions'])
  }

  private async getCat() {
    this.catOptions = (await ProductCat.where({ parentId: null }).all()).data
  }

  // 页面创建时
  created() {
    this.getCat()
    this.searchProduct()
  }

  private async searchProduct() {
    // 获取商品
    this.listLoading = true
    let products = await this.scope.all()
    this.list = products.data
    this.total = products.meta.stats.total.count
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 过滤列表数据
  private async handleFilter(e:any) {
    this.currentPage = 1
    this.searchProduct()
  }

  // 处理当前页数改变事件，绑定分页组件的current-change方法
  private async handleCurrentChange(val:any) {
    this.currentPage = val
    this.searchProduct()
  }

  // 处理添加事件，跳转添加页面
  private handleImport() {
    this.$router.push('/product/import')
  }
  // 处理修改事件，跳转修改页面
  private handleEdit(row: any) {
    this.$router.push({ name: 'editProduct', params: { data: row } })
  }

  // 处理详情事件，将选中详情的行对象存储并打开详情弹窗
  private handleShow(row: any) {
    this.showSelectedItem = row
    // this.showDialogVisible = true
    this.drawer = true
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

  private handleSelectionChange(val:any) {
    this.multipleSelection = val
  }

  // 处理排序改变事件
  private async handleSortChange(val: any) {
    if (val.order) {
      this.sort = {}
      let value: string
      value = val.order === 'ascending' ? 'asc' : 'desc'
      this.sort[val.prop] = value
    } else {
      this.sort = 'id'
    }
    this.searchProduct()
  }

  private async handleOff(row:any) {
    confirm('确认要更改该商品的下架状态吗？', 'warning', async action => {
      if (action === 'confirm') {
        if (row.isRecommend) {
          row.isRecommend = false
          message('下架操作将导致该商品无法推荐！', 'warning')
        }
        row.isOff = !row.isOff
        let success = await row.save()
        if (!success) {
          message('更改失败！', 'error')
        } else {
          message('更改成功！', 'success')
          this.searchProduct()
        }
      }
    })
  }

  // 处理全部下架事件，打开全部下架确认弹窗
  private async handleAlloff() {
    const list = this.multipleSelection
    if (this.multipleSelection.length === 0) {
      message('请至少选泽一项', 'warning')
    } else {
      confirm('确认要下架选中商品吗？', 'warning', async action => {
        if (action === 'confirm') {
          for (const product of this.multipleSelection) {
            if (product.isRecommend) {
              product.isRecommend = false
              message('下架操作将导致该商品无法推荐！', 'warning')
            }
            product.isOff = true
            let success = await product.save()
            if (!success) {
              message('下架失败！', 'error')
            }
          }
          message('下架成功！', 'success')
          this.searchProduct()
        } else {
          message('取消下架', 'warning')
        }
      })
    }
  }

  // 改变商品状态
  private async onChange(product:any) {
    confirm('确认要修改吗？', 'warning', async action => {
      if (action === 'confirm') {
        if (product.isOff && product.isRecommend) {
          message('修改失败！已下架商品无法推荐', 'error')
          this.searchProduct()
        } else {
          let success = await product.save()
          if (success) {
            message('修改成功！', 'success')
          } else {
            message('修改失败！', 'error')
          }
          this.searchProduct()
        }
      } else {
        message('取消修改', 'warning')
        this.searchProduct()
      }
    })
  }
}
</script>
