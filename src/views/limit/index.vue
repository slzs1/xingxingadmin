<template>
  <div>
    暂未开发
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Post } from '@/model'

@Component({
  name: 'limit'
})

export default class extends Vue {
  created() {
    this.getData()
  }

  private async getData() {
  }
}
</script>
