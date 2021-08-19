<template>
  <el-button
    type="danger"
    size="mini"
    icon="el-icon-truck"
    @click="handleShip"
  >
    订单发货
  </el-button>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { Order } from '@/model'
import { confirm, message } from '@/utils/confirm'
@Component({
  name: 'ToShip'
})
export default class extends Vue {
  @Prop({
    type: Order,
    required: true
  }) order !: any

  private handleShip() {
    console.log(this.order.id + '订单发货')
    confirm('确定要对编号为' + this.order.id + '的订单进行发货吗？', 'warning', (action) => {
      if (action === 'confirm') {
        this.$router.push({ name: 'editLogistic', params: { data: this.order.id } })
      }
    })
  }
}
</script>
