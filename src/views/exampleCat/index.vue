<template>
  <div class="app-container">
    <div
      class="filter-container"
      style="margin-bottom: 10px"
    >
      <el-input
        v-model="query.name"
        placeholder="请输入案例分类名称"
        style="width: 200px; margin-right:20px"
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
        label="案例分类名称"
        align="center"
        prop="name"
      />
      <el-table-column
        label="案例分类描述"
        align="center"
        prop="content"
      />
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <action-bar
            :action="['edit','destroy']"
            :object="scope.row"
            @bindAction="handleAction"
          />
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="5"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      title="修改"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        ref="form"
        :model="editSelectedItem"
        :rules="listRules"
        label-width="120px"
      >
        <el-form-item
          label="案例分类名称"
          prop="name"
        >
          <el-input
            v-model="editSelectedItem.name"
          />
        </el-form-item>
        <el-form-item
          label="案例分类描述"
          prop="content"
        >
          <el-input
            v-model="editSelectedItem.content"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="onEditSubmit(editSelectedItem)"
        >
          确 定
        </el-button>
        <el-button
          type="primary"
          @click="editDialogVisible = false"
        >
          取 消
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新增"
      :visible.sync="newDialogVisible"
      width="50%"
    >
      <el-form
        ref="form"
        :model="newForm"
        :rules="listRules"
        label-width="120px"
      >
        <el-form-item
          label="案例分类名称"
          prop="name"
        >
          <el-input
            v-model="newForm.name"
          />
        </el-form-item>
        <el-form-item
          label="案例分类描述"
          prop="content"
        >
          <el-input
            v-model="newForm.content"
          />
        </el-form-item>
        <el-form-item
          label="案例图片"
          prop="content"
        >
          <el-input
            v-model="newForm.image"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="onNewSubmit(newForm)"
        >
          确 定
        </el-button>
        <el-button
          type="primary"
          @click="newDialogVisible = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { confirm, message } from '@/utils/confirm'
import {
  Example,
  ExampleCat
} from '@/model' // 引入商品有关的model
import ActionBar from '@/components/ActionBar/index.vue'

@Component({
  name: 'exampleCat',
  components: {
    ActionBar
  }
})

export default class extends Vue {
  // 表格数据及分类数据
  private list: any = []
  private query = {}
  private sort = 'id'

  // 控制案例分类的校验规则
  private listRules = ExampleCat.rules
  private editSelectedItem:any = {}
  private multipleSelection:any = []

  // 控制表格和导出的加载效果
  private listLoading = true
  private downloadLoading = false

  // 控制下架确认弹窗
  private editDialogVisible: Boolean = false
  private newDialogVisible: Boolean = false
  private newForm = {}

  // 控制页数
  private currentPage = 1
  private total = 0

  // 商品查询结构
  get scope() {
    return ExampleCat.where(this.query)
      .stats({ total: 'count' })
      .order(this.sort)
      .page(this.currentPage)
      .per(6)
      .includes('examples')
      .selectExtra(['_actions'])
  }

  // 页面创建时
  created() {
    this.getList()
  }

  private async searchExampleCat() {
    // 获取商品分类
    this.listLoading = true
    let exampleCats = await this.scope.all()
    this.list = exampleCats.data
    this.total = exampleCats.meta.stats.total.count
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 获取初始数据
  private async getList() {
    this.searchExampleCat()
  }

  // 过滤列表数据
  private async handleFilter(e:any) {
    this.currentPage = 1
    this.searchExampleCat()
  }

  // 处理当前页数改变事件，绑定分页组件的current-change方法
  private handleCurrentChange(val:any) {
    this.currentPage = val
    this.searchExampleCat()
  }

  // 处理添加事件
  private handleCreate() {
    this.newDialogVisible = true
  }

  // 处理修改事件
  private handleEdit(row: any) {
    this.editSelectedItem = row
    this.editDialogVisible = true
  }

  // 处理删除事件
  private async handleDelete(row:any) {
    confirm('确定要删除吗', 'warning', async action => {
      if (action === 'confirm') {
        let cat = (await ExampleCat.where({ id: row.id }).all()).data[0]
        await cat.destroy()
        if (!cat.hasError) {
          message('删除成功', 'success')
        } else {
          message('删除失败', 'error')
        }
        this.searchExampleCat()
      } else {
        message('取消', 'warning')
      }
    })
  }

  private async handleAction(res:any) {
    switch (res.action) {
      case 'edit': {
        this.handleEdit(res.object)
        break
      }
      case 'destroy': {
        this.handleDelete(res.object)
        break
      }
    }
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
          for (const exampleCat of this.multipleSelection) {
            await exampleCat.destroy()
            if (exampleCat.hasError) {
              message('刪除失败！', 'error')
            }
          }
          message('刪除成功！', 'success')
          this.searchExampleCat()
        } else {
          message('取消刪除', 'warning')
        }
      })
    }
  }

  // 修改操作确定
  private async onEditSubmit(row: any) {
    let success = await row.save()
    if (success) {
      message('修改成功', 'success')
      this.editDialogVisible = false
    } else {
      message('修改失败', 'error')
      this.editDialogVisible = false
    }
    this.searchExampleCat()
  }
  private async onNewSubmit(form:any) {
    let cat = new ExampleCat(this.newForm)
    let success = await cat.save()
    if (success) {
      message('新增成功', 'success')
      this.newDialogVisible = false
    } else {
      message('新增失败', 'error')
      this.newDialogVisible = false
    }
    this.newForm = {}
    this.searchExampleCat()
  }
}
</script>
