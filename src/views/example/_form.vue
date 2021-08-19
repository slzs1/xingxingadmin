<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="120px"
    >
      <el-form-item
        label="案例标题"
        style="width: 30%"
        prop="title"
      >
        <el-input
          v-model="form.title"
        />
      </el-form-item>
      <el-form-item
        label="案例详情"
        style="width: 60%"
        prop="content"
      >
        <el-input
          v-model="form.content"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="案例分类">
        <el-select
          v-model="exampleCatId"
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
          width="360"
          height="720"
          :image-list="slideImageList"
          @bindImages="handleSlideImage"
        />
      </el-form-item>
      <el-form-item label="是否展示">
        <el-switch v-model="form.isShow" />
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
import { Example, ExampleCat } from '@/model'
import { confirm, message } from '@/utils/confirm'

@Component({
  name: 'exampleForm',
  components: {
    UploadImage
  }
})
export default class extends Vue {
  // 组件传参
  @Prop({ required: true }) private data!: any

  // 表单数据
  private form: any = {}
  private formRules = Example.rules
  private imageList: Array<string> = []
  private slideImageList: Array<string> = []
  private isEdit:boolean = true

  private catOptions: any = []

  private exampleCatId = '0'

  // 页面创建时，获取分类数据
  created() {
    this.getCat()
    if (!this.data) {
      this.isEdit = false
      this.initForm()
    } else {
      this.form = this.data
      // 直接通过imgsrc获取src渲染图片列表
      if (this.form.images) { this.imageList = this.form.images }
      if (this.form.slideImages) this.slideImageList = this.form.slideImages
    }
  }

  private async getCat() {
    this.catOptions = (await ExampleCat.all()).data
    this.exampleCatId = this.catOptions[0].id
  }

  private async initForm() {
    this.form = Example.initForm()

    let cat = (await ExampleCat.first()).data
    this.form.exampleCat = cat
  }

  private handleImage(val: Array<string>) {
    this.imageList = val
  }

  private handleSlideImage(val: Array<string>) {
    this.slideImageList = val
  }

  // 提交表单
  private async onSubmit() {
    let cat = (await ExampleCat.where({ id: this.exampleCatId }).all())
      .data[0]
    console.log(cat)
    let content = this.isEdit ? '修改' : '创建'
    confirm('确定要' + content + '吗', 'warning', async action => {
      if (action === 'confirm') {
        // 关联对象
        this.form.images = this.imageList
        this.form.slideImages = this.slideImageList
        this.form.exampleCat = cat
        // 数据提交保存
        let success = await this.form.save({ with: ['exampleCat'] })
        console.log(this.form)
        if (success) {
          message(content + '成功', 'success')
          this.$router.push('/example/index')
        } else {
          message(content + '失败', 'error')
        }
      } else {
        message('取消', 'warning')
      }
    })
  }

  // 表单重置按钮
  private onReset(form: any) {
    confirm('确定要重置吗？', 'success', action => {
      if (action === 'confirm') {
        this.initForm()
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
