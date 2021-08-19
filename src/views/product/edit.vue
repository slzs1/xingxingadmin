<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="product"
      :rules="productRules"
      label-width="120px"
    >
      <el-form-item
        label="商品编码"
        style="width: 40%"
        prop="sn"
      >
        <el-input
          v-model="product.sn"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="商品名称"
        style="width: 40%"
        prop="title"
      >
        <el-input
          v-model="product.title"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="商品成本价"
        style="width: 30%"
        prop="costPrice"
      >
        <el-input
          v-model="product.costPrice"
          disabled
        >
          <span slot="suffix">
            元
          </span>
        </el-input>
      </el-form-item>
      <el-form-item
        label="商品销售价"
        style="width: 30%"
        prop="price"
      >
        <el-input
          v-model="product.price"
        >
          <span slot="suffix">
            元
          </span>
        </el-input>
      </el-form-item>
      <el-form-item
        label="商品分类"
        style="width: 30%"
      >
        <el-select v-model="productCatId">
          <el-option
            v-for="item in catOptions"
            :key="item.key"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否是推荐商品">
        <el-switch v-model="product.isRecommend" />
      </el-form-item>
      <el-form-item label="是否下架">
        <el-switch v-model="product.isOff" />
      </el-form-item>
      <el-form-item
        label="视频链接"
        prop="video"
        style="width: 80%"
      >
        <el-input v-model="product.video" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          确 定
        </el-button>
        <el-button @click="onCancel">
          取 消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import ImageCropUpload from 'vue-image-crop-upload'
import { uploadImg } from '@/utils/image'
import Cos from 'cos-js-sdk-v5'
import { Product, ProductCat } from '@/model'
import { confirm, message } from '@/utils/confirm'

@Component({
  name: 'editProduct',
  components: {
    ImageCropUpload
  }
})
export default class extends Vue {
  // 表单数据
  private product: any = {}
  private productCatId = ''

  private catOptions: any = []
  // productRules为自定义表单验证规则,绑定表单rules属性
  private productRules = Product.rules

  private show = false

  created() {
    this.getCat()
    this.product = this.$route.params.data || { productCat: { id: '' } }
    this.product.costPrice = (this.product.costPrice * 0.01).toFixed(2)
    this.product.price = (this.product.price * 0.01).toFixed(2)
    this.productCatId = this.product.productCat.id
  }

  mounted() {
    if (!this.$route.params.data) {
      this.$router.push({ path: '/product' })
    }
  }

  private async getCat() {
    this.catOptions = (await ProductCat.all()).data
  }

  // 打开修改确认弹窗
  private async onSubmit(row: any) {
    let cat = (await ProductCat.where({ id: this.productCatId }).all()).data[0]
    confirm('确定要修改吗？', 'warning', async action => {
      if (action === 'confirm') {
        if (this.product.isRecommend && this.product.isOff) {
          message('修改失败！已下架商品无法推荐', 'error')
        } else {
          let costPrice = this.product.costPrice
          this.product.costPrice = costPrice * 100
          let price = this.product.price
          this.product.price = price * 100

          this.product.productCat = cat
          let success = await this.product.save({ with: ['productCat'] })
          if (!success) {
            this.product.costPrice = costPrice
            this.product.price = price
            message('修改失败！', 'error')
          } else {
            message('修改成功！', 'success')
            this.$router.push('/product/index')
          }
        }
      } else {
        message('取消修改', 'warning')
      }
    })
  }

  // 表单取消按钮
  private onCancel() {
    this.$message({
      message: '取消!',
      type: 'warning'
    })
    this.$router.go(-1)
  }
}
</script>

<style lang="scss">
.line {
  text-align: center;
}
.el-upload-list__item-thumbnail {
  width: 127px !important;
}
</style>
