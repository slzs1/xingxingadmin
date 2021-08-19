<template>
  <postForm
    :data="data"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import postForm from './_form.vue'

@Component({
  name: 'editPost',
  components: {
    postForm
  }
})

export default class extends Vue {
  private data = this.$route.params.data || {}

  mounted() {
    if (!this.$route.params.data) {
      this.$router.push({ path: '/post' })
    }
  }
}
</script>
