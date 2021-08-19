<template>
  <div class="container">
    <el-button
      v-for="(item) in can"
      :key="item"
      :type="style(item).type"
      :icon="style(item).icon"
      size="mini"
      @click="handleClick(item)"
    >
      {{ style(item).title }}
    </el-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'

@Component({
  name: 'ActionBar'
})

export default class extends Vue {
  @Prop({
    type: Array,
    required: true
  }) action: Array<'show'|'edit'|'destroy'>

  @Prop({
    type: Object,
    required: true
  }) object: any

  private style(action:'show'|'edit'|'destroy') {
    switch (action) {
      case 'edit': {
        return {
          type: 'primary',
          icon: 'el-icon-edit',
          title: '修改'
        }
      }
      case 'show': {
        return {
          type: 'info',
          icon: 'el-icon-view',
          title: '详情'
        }
      }
      case 'destroy': {
        return {
          type: 'danger',
          icon: 'el-icon-delete',
          title: '删除'
        }
      }
    }
  }

  get can() {
    return this.action.filter(action => {
      return this.$can(action, this.object)
    })
  }

  @Emit('bindAction') handleClick(action:'show'|'edit'|'destroy') {
    return { action: action, object: this.object }
  }
}
</script>
<style scoped>

</style>
