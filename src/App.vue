<template>
  <div id="app">
    <router-view :key="key" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'App'
})
export default class extends Vue {
  get key() {
    return this.$route.fullPath
  }
}
</script>

<style>
body .el-table th.gutter {
  display: table-cell !important;
}
</style>
