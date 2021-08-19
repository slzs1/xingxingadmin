<template>
  <el-button
    type="danger"
    size="mini"
    icon="el-icon-close"
    @click="handleAbort"
  >
    终止订单
  </el-button>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { Order } from '@/model'
import { confirm, message } from '@/utils/confirm'
@Component({
  name: 'ToAbort'
})
export default class extends Vue {
  @Prop({
    type: Order,
    required: true
  }) order !: Order

  @Emit('refresh')
  emitToRefresh():boolean {
    return true
  }

  private handleAbort() {
    console.log(this.order.id + '终止订单')
    confirm('确定要终止编号为' + this.order.id + '的订单吗？', 'warning', (action) => {
      if (action === 'confirm') {
        let data = {
          type: 'orders',
          id: this.order.id
        }
        fetch('http://xx.openxy.com//api/v1/orders/' + this.order.id + '/change_state?event=to_abort&content=abortsn' + this.order.id, {
          method: 'PUT',
          headers: { Authorization: '' + localStorage.getItem('token') },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .catch(error => console.error('Error:', error))
          .then(response => {
            if (!response.errors) {
              message('终止订单成功', 'success')
              this.emitToRefresh()
            } else {
              message('终止订单失败', 'error')
              console.log(response.errors)
            }
          })
      }
    })
  }
}
</script>
