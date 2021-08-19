<template>
  <div>
    <el-button
      v-if="!noCrop"
      :disabled="fileList.length >= ilimit"
      type="primary"
      size="small"
      @click="toggleShow"
    >
      点击上传图片
    </el-button>
    <el-upload
      action="#"
      :on-remove="handleRemove"
      :auto-upload="false"
      :http-request="cropSuccess"
      :file-list="fileList"
      list-type="picture"
    >
      <el-button
        v-if="noCrop"
        slot="trigger"
        :disabled="fileList.length >= ilimit"
        type="primary"
        size="small"
        @click="toggleShow"
      >
        点击上传图片
      </el-button>
      <div
        slot="tip"
        class="el-upload__tip"
      >
        只能上传一张jpg/png图片且不超过500kb
      </div>
    </el-upload>
    <image-crop-upload
      v-model="show"
      :lang-ext="langExt"
      :width="iwidth"
      :height="iheight"
      url=""
      :no-circle="true"
      @crop-success="cropSuccess"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import ImageCropUpload from 'vue-image-crop-upload' // 图片裁剪上传插件
import { uploadImg } from '@/utils/image'

@Component({
  name: 'UploadImage',
  components: {
    ImageCropUpload
  }
})
export default class extends Vue {
  @Prop({
    type: String,
    required: false,
    default: '200'
  }) width : string
  @Prop({
    type: String,
    required: false,
    default: '200'
  }) height : string
  @Prop({
    type: String,
    required: false,
    default: '9'
  }) limit : string
   @Prop({
     type: Array,
     required: false
   }) imageList: Array<string>
  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) noCrop : boolean

  private iwidth = parseInt(this.width)
  private iheight = parseInt(this.height)
  private ilimit = parseInt(this.limit)

  // 图片裁剪插件配置
  private langExt = {
    preview: '预览'
  }
  // 控制图片裁剪弹框
  private show = false

  // 图片裁剪
  private toggleShow() {
    if (!this.noCrop) {
      this.show = !this.show
    }
  }

  mounted() {
    if (this.imageList) {
      this.imageList.forEach((item) => {
        let image = {
          name: '',
          url: item
        }
        this.fileList.push(image)
      })
    }
  }

  // 图片渲染列表
  private fileList: any[] = []

  @Emit('bindImages') send(fileList: any[]) {
    return fileList.map((item) => {
      return item.url
    })
  } // send 处理给父组件传值的逻辑

  // 移除图片
  private handleRemove(file: File, fileList: any) {
    this.fileList = fileList
    this.send(this.fileList)
    console.log(this.fileList)
  }

  // 图片上传
  private async cropSuccess(imgDataUrl: string) {
    let image = await uploadImg(imgDataUrl)
    this.fileList.push(image)
    this.send(this.fileList)
  }
}
</script>
