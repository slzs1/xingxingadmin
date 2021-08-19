<template>
  <bannerForm
    :data="data"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import bannerForm from './_form.vue'

@Component({
  name: 'newBanner',
  components: {
    bannerForm
  }
})

export default class extends Vue {
  private data = ''
}
</script>
