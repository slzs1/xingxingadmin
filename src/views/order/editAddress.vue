<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="order"
      :rules="addressRules"
      label-width="120px"
    >
      <el-form-item
        label="收货人姓名"
        style="width: 30%"
        prop="buyerName"
      >
        <el-input
          v-model="order.buyerName"
        />
      </el-form-item>
      <el-form-item
        label="收货人电话"
        style="width: 30%"
        prop="mobile"
      >
        <el-input
          v-model="order.mobile"
        />
      </el-form-item>
      <el-form-item
        label="省份（自治区、直辖市）"
        style="width:30%"
        prop="province"
      >
        <el-input
          v-model="order.province"
        />
      </el-form-item>
      <el-form-item
        label="城市"
        style="width:30%"
        prop="city"
      >
        <el-input
          v-model="order.city"
        />
      </el-form-item>
      <el-form-item
        label="区（县）"
        style="width:30%"
        prop="district"
      >
        <el-input
          v-model="order.district"
        />
      </el-form-item>
      <el-form-item
        label="详细地址"
        style="width:30%"
        prop="house"
      >
        <el-input
          v-model="order.house"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit('form')"
        >
          修改
        </el-button>
        <el-button @click="onCancel">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { confirm, message } from '@/utils/confirm'

@Component({
  name: 'editAddress'
})

export default class extends Vue {
  // 表单数据

  private order:any = {}

  // 自定义规则
  private addressRules= {
    buyerName: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
    mobile: [{ required: true, message: '请输入收货人电话', trigger: 'blur' }],
    province: [{ required: true, message: '请输入省份（直辖市、自治区）', trigger: 'blur' }],
    city: [{ required: true, message: '请输入城市名', trigger: 'blur' }],
    district: [{ required: true, message: '请输入区（县）', trigger: 'blur' }],
    house: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
  }

  created() {
    this.order = this.$route.params.data
    delete this.order.attributes.Events
    console.log(this.order)
  }

  mounted() {
    if (!this.$route.params.data) {
      this.$router.push({ path: '/order' })
    }
  }

  // 修改确认
  private onSubmit(form: any) {
    confirm('确定要修改吗？', 'success', async action => {
      if (action === 'confirm') {
        let success = await this.order.save()
        console.log(this.order)
        if (success) {
          message('修改成功', 'success')
          this.$router.push('/order/index')
        } else {
          message('修改失败', 'error')
        }
      } else {
        message('取消修改', 'warning')
      }
    })
  }

  // 表单取消按钮
  private onCancel() {
    message('取消修改', 'warning')
    this.$router.go(-1)
  }
}
</script>
