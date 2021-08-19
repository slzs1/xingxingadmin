<template>
  <exampleForm
    :data="data"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import exampleForm from './_form.vue'

@Component({
  name: 'newScene',
  components: {
    exampleForm
  }
})

export default class extends Vue {
  private data = ''
}
</script>
