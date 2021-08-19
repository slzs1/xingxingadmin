<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="120px"
    >
      <el-form-item
        label="广告标题"
        style="width: 30%"
        prop="title"
      >
        <el-input
          v-model="form.title"
        />
      </el-form-item>
      <el-form-item
        label="显示区域"
        style="width: 30%"
      >
        <el-select v-model="form.location">
          <el-option
            v-for="item in posOptions"
            :key="item.key"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        style="width:350px"
        label="图片"
      >
        <upload-image
          :key="iwidth"
          :width="iwidth"
          :height="iheight"
          limit="1"
          :image-list="imageList"
          @bindImages="handleImage"
        />
      </el-form-item>
      <el-form-item
        label="跳转地址"
        style="width: 30%"
        prop="link_to"
      >
        <el-select
          v-model="linkType"
          style="width: 20%"
        >
          <el-option
            v-for="item in linkTypeOptions"
            :key="item.key"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-autocomplete
          v-model="linkItem"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请选择"
          style="width: 80%"
          @select="handleSelect"
        >
          <template slot-scope="{item}">
            <div class="name">
              {{ item.title }}
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item
        label="顺序"
        style="width: 30%"
        prop="position"
      >
        <el-input
          v-model="form.position"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit()"
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
import { Banner, Product, Scene, Example, Post } from '@/model'
import { confirm, message } from '@/utils/confirm'

@Component({
  name: 'bannerForm',
  components: {
    UploadImage
  }
})
export default class extends Vue {
  // 组件传参
  @Prop({ required: true }) private data!: any

  // 表单数据
  private form: any = {}
  private formRules = Banner.rules
  private imageList: Array<string> = []
  private isEdit:boolean = true

  private posOptions = Banner.posOptions

  private linkItem = ''
  private linkId = ''
  private linkType:any = 'product'
  private linkTypeOptions = Banner.linkTypeOptions

  get iwidth() {
    return this.form.location === 'top' ? '750' : '710'
  }
  get iheight() {
    return this.form.location === 'top' ? '360' : '124'
  }

  // 页面创建时，获取分类数据
  created() {
    if (!this.data) {
      this.isEdit = false
      this.initForm()
    } else {
      this.form = this.data
      // 直接通过imgsrc获取src渲染图片列表
      if (this.form.image) { this.imageList = [this.form.image] }
      let mid = /[a-z]+/.exec(this.form.linkTo)
      this.linkType = mid ? mid[0] : null
    }
  }

  private async initForm() {
    this.form = Banner.initForm()
  }

  private async querySearch(queryString:any, cb:any) {
    let results
    switch (this.linkType) {
      case 'product':
        results = (await Product.all()).data; break
      case 'scene':
        results = (await Scene.all()).data; break
      case 'example':
        results = (await Example.all()).data; break
      case 'post':
        results = (await Post.all()).data; break
      default:
        results = null
    }
    cb(results)
  }

  private handleImage(val: Array<string>) {
    this.imageList = val
  }

  private handleSelect(item:any) {
    this.linkItem = item.title
    this.linkId = item.id
  }

  // 提交表单
  private async onSubmit() {
    let content = this.isEdit ? '修改' : '创建'
    confirm('确定要' + content + '吗?', 'warning', async action => {
      if (action === 'confirm') {
        // 关联对象
        this.form.image = this.imageList[0]
        this.form.linkTo = `${this.linkType}/show?id=${this.linkId}`
        // 数据提交保存
        let success = await this.form.save()
        console.log(this.form)
        if (!success) {
          message(content + '失败', 'error')
        } else {
          message(content + '成功', 'success')
          this.$router.push('/banner/index')
        }
      } else {
        message(content + '取消', 'warning')
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
