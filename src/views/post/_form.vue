<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="120px"
    >
      <el-form-item
        label="海报标题"
        style="width: 30%"
        prop="title"
      >
        <el-input
          v-model="form.title"
        />
      </el-form-item>
      <el-form-item
        label="海报详情"
        style="width: 60%"
        prop="content"
      >
        <el-input
          v-model="form.content"
          type="textarea"
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
        label="商品链接"
        style="width: 60%"
        prop="products"
      >
        <el-input
          v-model="form.products"
          type="textarea"
        />
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
import { Post } from '@/model'
import { confirm, message } from '@/utils/confirm'

@Component({
  name: 'postForm',
  components: {
    UploadImage
  }
})
export default class extends Vue {
  // 组件传参
  @Prop({ required: true }) private data!: any

  // 表单数据
  private form: any = {}
  private formRules = Post.rules
  private imageList:Array<string> = []
  private isEdit:boolean = true

  created() {
    if (!this.data) {
      this.isEdit = false
      this.initForm()
    } else {
      this.form = this.data
      // 直接通过imgsrc获取src渲染图片列表
      if (this.form.images) { this.imageList = this.form.images }
    }
  }

  private initForm() {
    this.form = Post.initForm()
  }

  private handleImage(val: Array<string>) {
    this.imageList = val
  }

  private onSubmit() {
    let content = this.isEdit ? '修改' : '创建'
    confirm('确定要' + content + '吗?', 'warning', async(action) => {
      if (action === 'confirm') {
        this.form.images = this.imageList
        let success = await this.form.save()
        console.log(success)
        if (success) {
          message(content + '成功', 'success')
          this.$router.push('/post/index')
        } else {
          message(content + '失败', 'error')
        }
      } else {
        message('已取消', 'warning')
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
