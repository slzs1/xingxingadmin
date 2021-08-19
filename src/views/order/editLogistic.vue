<template>
  <div class="app-container">
    <el-form
      v-for="(formItem, index) in form"
      :key="index"
      ref="formItem"
      :model="formItem"
      :rules="formRules"
      label-width="120px"
    >
      <el-form-item
        label="物流单号"
        style="width: 60%"
        prop="sn"
      >
        <el-input
          v-model="formItem.sn"
        />
      </el-form-item>
      <el-form-item
        label="物流公司"
        style="width: 60%"
        prop="company"
      >
        <el-input
          v-model="formItem.company"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        style="width: 60%"
        prop="memo"
      >
        <el-input
          v-model="formItem.memo"
          type="textarea"
        />
      </el-form-item>
      <el-divider />
    </el-form>
    <el-button @click="onCancel()">
      取消
    </el-button>
    <el-button
      type="primary"
      @click="onAppend"
    >
      添加
    </el-button>
    <el-button
      type="primary"
      @click="onReset"
    >
      重置
    </el-button>
    <el-button
      type="primary"
      @click="onSubmit"
    >
      发货
    </el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Logistic, Order } from '@/model'
import { confirm, message } from '@/utils/confirm'
import { formatJson } from '@/utils'

@Component({
  name: 'postForm'
})
export default class extends Vue {
  // 表单数据
  private form: Array<Logistic> = []
  private formRules = Logistic.rules

  created() {
    this.initForm()
  }

  mounted() {
    if (!this.$route.params.data) {
      this.$router.push({ path: '/order' })
    }
  }

  private initForm() {
    this.form = []
    this.onAppend()
  }

  private onSubmit() {
    confirm('确定要发货吗？', 'warning', async action => {
      if (action === 'confirm') {
        let order = (await Order.where({ id: this.$route.params.data }).all()).data[0]
        for (const formItem of this.form) {
          formItem.orderSn = order.sn
          formItem.firmSn = '2.1.2'
          formItem.modelWithNumber = 'xx1'
          formItem.isDone = false
          formItem.isExchange = false
          formItem.order = order
          let success = await formItem.save({ with: ['order'] })
          if (!success) {
            message('物流单创建失败！', 'error')
            console.log(formItem.errors)
          }
        }

        let data = {
          type: 'orders',
          id: order.id
        }
        fetch('http://xx.openxy.com//api/v1/orders/' + order.id + '/change_state?event=to_ship&content=shipsn' + order.id, {
          method: 'PUT',
          headers: { Authorization: '' + localStorage.getItem('token') },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .catch(error => console.error('Error:', error))
          .then(response => {
            if (!response.errors) {
              message('订单发货成功', 'success')
            } else {
              message('订单发货失败', 'error')
              console.log(response.errors)
            }
          })
        this.$router.go(-1)
      } else {
        message('取消', 'warning')
      }
    })
  }

  private onAppend() {
    this.form.push(new Logistic())
  }

  private onReset() {
    this.initForm()
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
