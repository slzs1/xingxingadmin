<template>
  <sceneForm
    :data="data"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import sceneForm from './_form.vue'

@Component({
  name: 'newScene',
  components: {
    sceneForm
  }
})

export default class extends Vue {
  private data = ''
}
</script>
