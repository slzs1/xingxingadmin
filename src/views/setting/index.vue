<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
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
        width="400"
        prop="id"
      />
      <el-table-column
        label="value"
        align="center"
        prop="value"
      >
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.type !== 'boolean'"
            v-model="scope.row.value"
            style="width: 80%"
          />
          <el-switch
            v-if="scope.row.type === 'boolean'"
            v-model="scope.row.value"
          />
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
            width="150"
            @click="handleEdit(scope.row)"
          >
            保存
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Setting } from '@/model'
import { confirm, message } from '@/utils/confirm'

@Component({
  name: 'setting'
})

export default class extends Vue {
  private list: any = []
  private listLoading = true

  // 商品查询结构
  get scope() {
    return Setting.where({}).order({})
  }

  created() {
    this.searchSetting()
  }

  private async searchSetting() {
    this.listLoading = true
    let settings = await this.scope.all()
    console.log(settings)
    this.list = settings.data

    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private async handleEdit(row: Setting) {
    confirm('确认要下架选中商品吗？', 'warning', async action => {
      if (action === 'confirm') {
        let success = await row.save()
        if (success) {
          message('下架成功！', 'success')
        } else {
          message('修改失败！', 'error')
        }
        this.searchSetting()
      } else {
        message('取消下架', 'warning')
        this.searchSetting()
      }
    })
  }
}
</script>
