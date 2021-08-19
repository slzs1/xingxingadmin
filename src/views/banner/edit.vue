<template>
  <bannerForm
    :data="data"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import bannerForm from './_form.vue'

@Component({
  name: 'editBanner',
  components: {
    bannerForm
  }
})

export default class extends Vue {
  private data = this.$route.params.data || {}

  mounted() {
    if (!this.$route.params.data) {
      this.$router.push({ path: '/banner' })
    }
  }
}

</script>
