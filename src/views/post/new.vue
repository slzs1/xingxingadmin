<template>
  <postForm
    :data="data"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import postForm from './_form.vue'

@Component({
  name: 'newPost',
  components: {
    postForm
  }
})

export default class extends Vue {
  private data = ''
}
</script>
