<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="comment"
      :rules="commentRules"
      label-width="120px"
    >
      <el-form-item
        label="昵称"
        style="width: 30%"
        prop="username"
      >
        <el-input
          v-model="comment.username"
          placeholder="请输入昵称"
        />
      </el-form-item>
      <el-form-item
        label="评论内容"
        style="width: 60%"
        prop="content"
      >
        <el-input
          v-model="comment.content"
          type="textarea"
          :rows="3"
          placeholder="请输入评论内容"
        />
      </el-form-item>
      <el-form-item
        label="评论图片"
        style="width: 30%"
      >
        <upload-image
          :key="imageList[0]"
          width="600"
          height="400"
          :image-list="imageList"
          @bindImages="handleImage"
        />
      </el-form-item>
      <el-form-item
        label="评价商品"
      >
        <el-autocomplete
          v-model="inputValue"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="输入商品编号"
          style="width: 20%;margin-right: 20px"
          @select="handleSelect"
        >
          <template slot-scope="{item}">
            <div class="name">
              {{ item.sn }}
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item
        label="评分"
        style="width: 30%"
      >
        <el-select
          v-model="comment.rate"
        >
          <el-option
            v-for="item in rateOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          添加
        </el-button>
        <el-button
          @click="onReset()"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { confirm, message } from '@/utils/confirm'
import UploadImage from '@/components/UploadImage/index.vue'
import { Comment, User, Product } from '@/model'

@Component({
  name: 'new',
  components: {
    UploadImage
  }
})

export default class extends Vue {
  private rateOptions = [
    {
      name: '10分',
      value: 10
    },
    {
      name: '9分',
      value: 9
    },
    {
      name: '8分',
      value: 8
    },
    {
      name: '7分',
      value: 7
    }
  ]

  private comment:any = {}
  private user: any = {}
  private commentRules = Comment.rules
  private inputValue = ''
  private imageList:any = []

  created() {
    this.initComment()
    console.log(this.comment)
  }

  private async querySearch(queryString:any, cb:any) {
    let results = (await Product.all()).data
    cb(results)
  }

  private handleSelect(item:any) {
    this.inputValue = item.sn
  }

  private handleImage(val: Array<string>) {
    this.imageList = val
  }

  private async initComment() {
    this.comment = new Comment({
      rate: 10,
      isShow: true
    })
    this.user = (await User.where({ role: 4 }).first()).data
    this.comment.user = this.user
    console.log(this.user)
  }

  // 由于手动添加好评的时候user不发生变化，所以user只初始化一次即可
  private resetComment() {
    this.comment = new Comment({
      rate: 10,
      isShow: true
    })
    this.comment.user = this.user
    this.inputValue = ''
    this.imageList = []
  }

  private async onSubmit() {
    let product = (await Product.where({ sn: this.inputValue }).all()).data[0]
    confirm('确定要添加吗？', 'info', async action => {
      if (action === 'confirm') {
        let date = new Date()
        this.comment.createdAt = date
        this.comment.product = product
        this.comment.images = this.imageList
        let success = await this.comment.save({ with: ['user', 'product'] })
        if (success) {
          message('添加成功!', 'success')
          this.resetComment()
        } else {
          message('失败！', 'error')
        }
      } else {
        message('已取消')
      }
    })
  }

  private onReset() {
    confirm('确定要重置吗？', 'info', action => {
      if (action === 'confirm') {
        this.resetComment()
        message('已重置', 'success')
      } else {
        message('已取消', 'info')
      }
    })
  }
}
</script>
