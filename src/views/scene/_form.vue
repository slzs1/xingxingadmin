<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="120px"
    >
      <el-form-item
        label="场景名称"
        style="width: 30%"
        prop="title"
      >
        <el-input
          v-model="form.title"
          :disabled="isEdit"
        />
      </el-form-item>
      <el-form-item
        label="场景描述"
        style="width: 60%"
        prop="content"
      >
        <el-input
          v-model="form.content"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="场景分类">
        <el-select
          v-model="sceneCatId"
          placeholder="选择分类"
        >
          <el-option
            v-for="item in catOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="优惠价格"
        style="width:60%"
        prop="price"
      >
        <el-input
          v-model="form.price"
        />
      </el-form-item>
      <el-form-item
        style="width:350px"
        label="图片"
      >
        <upload-image
          :no-crop="true"
          :image-list="imageList"
          @bindImages="handleImage"
        />
      </el-form-item>
      <el-form-item
        style="width:350px"
        label="滚动图"
      >
        <upload-image
          width="1500"
          height="2322"
          :image-list="slideImageList"
          @bindImages="handleSlideImage"
        />
      </el-form-item>
      <el-form-item
        label="包含商品"
      >
        <el-autocomplete
          v-model="inputValue"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="输入商品名称"
          style="width: 20%;margin-right: 20px"
          @select="handleSelect"
        >
          <template slot-scope="{item}">
            <div class="name">
              {{ item.title }}
            </div>
          </template>
        </el-autocomplete>
        <el-button
          type="primary"
          icon="el-icon-plus"
          circle
          @click="handleInput"
        />
      </el-form-item>
      <el-form-item>
        <el-tag
          v-for="(item,index) in productsList"
          :key="index"
          closable
          :disable-transitions="false"
          style="margin-right: 10px"
          @close="handleClose(index)"
        >
          {{ item.title }}
        </el-tag>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          {{ isEdit ? '修改' : '创建' }}
        </el-button>
        <el-button
          v-if="!isEdit"
          @click="onReset()"
        >
          重置
        </el-button>
        <el-button @click="onCancel()">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import UploadImage from '@/components/UploadImage/index.vue'
import { Product, Scene, SceneCat } from '@/model'
import { confirm, message } from '@/utils/confirm'

@Component({
  name: 'sceneForm',
  components: {
    UploadImage
  }
})
export default class extends Vue {
  // 组件传参
  @Prop({ required: true }) private data!: any

  // 表单数据
  private form: any = {}
  private formRules = Scene.rules
  private imageList: any[] = []
  private slideImageList: any[] = []
  private productsList: Product[] = []
  private isEdit:boolean = true

  private sceneCatId = '0'
  private catOptions: any = []

  private inputValue = ''

  // 页面创建时，获取分类数据，并判断是新建还是修改
  created() {
    this.getCat()
    if (!this.data) {
      this.isEdit = false
      this.initScene()
    } else {
      this.form = this.data
      this.form.price = (this.form.price * 0.01).toFixed(2)
      if (this.form.images) this.imageList = this.form.images
      if (this.form.slideImages) this.slideImageList = this.form.slideImages
      this.productsList = this.form.products
    }
  }

  private async initScene() {
    this.form = new Scene()

    let cat = (await SceneCat.first()).data
    this.form.sceneCat = cat
  }

  private async getCat() {
    this.catOptions = (await SceneCat.all()).data
    this.sceneCatId = this.catOptions[0].id
  }

  private async querySearch(queryString:any, cb:any) {
    let results = (await Product.all()).data
    cb(results)
  }

  private handleClose(tag:any) {
    this.productsList.splice(tag, 1)
  }

  private async handleInput() {
    if (this.inputValue) {
      this.productsList.push((await Product.where({ title: this.inputValue }).all()).data[0])
      this.inputValue = ''
    }
  }

  private handleSelect(item:any) {
    this.inputValue = item.title
  }

  private handleImage(val: Array<string>) {
    this.imageList = val
  }

  private handleSlideImage(val: Array<string>) {
    this.slideImageList = val
  }

  // 提交表单
  private async onSubmit() {
    let cat = (await SceneCat.where({ id: this.sceneCatId }).all())
      .data[0]
    let content = this.isEdit ? '修改' : '创建'
    confirm('确定要' + content + '吗？', 'warning', async action => {
      if (!this.productsList) {
        message('包含商品不能为空！', 'error')
      } else {
        if (action === 'confirm') {
          let price = this.form.price
          this.form.price = price * 1007

          this.form.images = this.imageList
          this.form.slideImages = this.slideImageList
          this.form.sceneCat = cat
          this.form.products = this.productsList
          // 数据提交保存
          let success = await this.form.save({ with: ['sceneCat', 'products'] })
          if (success) {
            message(content + '成功!', 'success')
            this.$router.push('/scene/index')
          } else {
            this.form.price = price
            message(content + '失败！', 'error')
          }
        } else {
          message('取消', 'warning')
        }
      }
    })
  }

  // 表单重置按钮
  private onReset(form: any) {
    confirm('确定要重置吗？', 'warning', action => {
      if (action === 'confirm') {
        this.form = new Scene()
        this.productsList.splice(0, this.productsList.length)
        message('重置成功', 'success')
      } else {
        message('取消重置', 'warning')
      }
    })
  }
  // 表单取消按钮
  private onCancel() {
    message('取消', 'warning')
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
