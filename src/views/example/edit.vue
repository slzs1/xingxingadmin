<template>
  <exampleForm
    :data="data"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import exampleForm from './_form.vue'

@Component({
  name: 'editExample',
  components: {
    exampleForm
  }
})

export default class extends Vue {
  private data = this.$route.params.data || {}

  mounted() {
    if (!this.$route.params.data) {
      this.$router.push({ path: '/edit' })
    }
  }
}
</script>
