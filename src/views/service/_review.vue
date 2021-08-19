<template>
  <div>
    <info-table
      :table-data="detail"
      :image-list="showselecteditem.imageList"
    />
    <div align="center">
      <el-button
        type="success"
        size="mini"
        @click="handleStateEdit1(scope.row)"
      >
        通过
      </el-button>
      <el-button
        type="danger"
        size="mini"
        @click="handleStateEdit2(scope.row)"
      >
        拒绝
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import InfoTable from '@/components/InfoTable/index.vue'
import { confirm, message } from '@/utils/confirm'

  @Component({
    name: 'postForm',
    components: {
      InfoTable
    }
  })

export default class extends Vue {
  // 组件传参
  @Prop({ required: true }) private showselecteditem!: any

  get detail() {
    return [
      {
        header: '审核信息',
        text: [
          {
            title: '文字',
            value: this.showselecteditem.content
          }
        ]
      }
    ]
  }

  // 处理通过事件（未完成）
  private handleStateEdit1(row: any) {
    confirm('确定要通过吗？', 'warning', async action => {
      if (action === 'confirm') {
        row.state = 1
        console.log(row)
        let success = await row.save()
        console.log(row.error)
        if (!success) {
          message('通过失败！', 'error')
        } else {
          message('通过成功！', 'success')
        }
      } else {
        message('取消', 'warning')
      }
    })
  }

  // 处理拒绝事件（未完成）
  private handleStateEdit2(row: any) {
    confirm('确定要拒绝吗？', 'warning', async action => {
      if (action === 'confirm') {
        row.state = 1
        console.log(row)
        let success = await row.save()
        console.log(row.error)
        if (!success) {
          message('拒绝失败！', 'error')
        } else {
          message('拒绝成功！', 'success')
        }
      } else {
        message('取消', 'warning')
      }
    })
  }
}
</script>
