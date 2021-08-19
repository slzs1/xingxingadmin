<template>
  <div class="app-container">
    <upload-excel-component
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />
    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%;margin-top:20px;"
    >
      <el-table-column
        v-for="item of tableHeader"
        :key="item"
        :prop="item"
        :label="item"
      />
    </el-table>
    <el-button
      style="margin-top:16px;"
      type="primary"
      :disabled="tableData.length===0"
      @click="handleUpload"
    >
      导入
    </el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { Product, ProductCat } from '@/model'
import { confirm, message } from '@/utils/confirm'

@Component({
  name: 'UploadExcel',
  components: {
    UploadExcelComponent
  }
})
export default class extends Vue {
  private tableData: any = []
  private tableHeader: string[] = []

  private beforeUpload(file: File) {
    const isLt1M = file.size / 1024 / 1024 < 1
    if (isLt1M) {
      return true
    }
    this.$message({
      message: 'Please do not upload files larger than 1m in size.',
      type: 'warning'
    })
    return false
  }

  private handleSuccess({ results, header }: { results: any, header: string[]}) {
    this.tableData = results
    this.tableHeader = header
    console.log(this.tableData)
  }

  private async handleUpload() {
    confirm('确定要导入吗？', 'warning', async action => {
      if (action === 'confirm') {
        for (const tablelist of this.tableData) {
          let product: any = {}
          product = new Product(tablelist)
          product.productCat = (await ProductCat.where({ id: 46 }).all()).data[0]
          console.log(product)
          let success = await product.save({ with: ['productCat'] })
          if (!success) {
            message('导入失败！', 'error')
            console.log(product.errors)
          }
        }
        message('导入成功！', 'success')
      } else {
        message('取消', 'warning')
      }
    })
  }
}
</script>
