<template>
  <sceneForm
    :data="data"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import sceneForm from './_form.vue'

@Component({
  name: 'editScene',
  components: {
    sceneForm
  }
})

export default class extends Vue {
  private data = this.$route.params.data || {}

  mounted() {
    if (!this.$route.params.data) {
      this.$router.push({ path: '/scene' })
    }
  }
}
</script>
