<template>
  <component
    :is="component"
    v-if="component"
    :order="order"
    style="margin-top: 5px"
    @refresh="onRefresh"
  />
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { Order } from '@/model'

@Component({
  name: 'DynamicLink'
})
export default class extends Vue {
@Prop({
  type: Order,
  required: true
}) order !: Order

@Prop({
  type: String,
  required: true
}) type !: String

@Emit('refresh')
emitToRefresh():boolean {
  return true
}

get component() {
  console.log(this.type)
  if (!this.type) {
    return null
  }
  return () => import(`@/components/events/${this.type}`)
}

private onRefresh(res:boolean) {
  if (res) { this.emitToRefresh() }
}
}
</script>
