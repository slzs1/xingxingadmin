<template>
  <div
    class="container infinite-list"
    style="overflow:auto"
  >
    <div v-if="imageList.length !== 0">
      <el-divider v-if="imageList.length > 1">
        点开图片后查看所有图片
      </el-divider>
      <el-divider v-if="imageList.length === 1">
        点击查看大图
      </el-divider>
      <el-image
        style="width: 334px; height: 183px"
        :src="imageList[0]"
        :preview-src-list="imageList"
      />
    </div>
    <div
      v-for="item in tableData"
      :key="item.header"
    >
      <div
        class="header"
      >
        <el-divider>{{ item.header }}</el-divider>
      </div>
      <div
        v-for="i in item.text"
        :key="i.title"
        class="text item"
      >
        {{ i.title + ':   ' + i.value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({
  name: 'InfoTable'
})
export default class extends Vue {
  @Prop({
    type: Array,
    required: true,
    default: []
  }) tableData !: Array<object>
  @Prop({
    type: Array,
    required: false,
    default: () => []
  }) imageList!: Array<string>
}
</script>
<style scoped>
  .container {
    margin-left: 20px;
    max-height: 600px;
    margin-top: -15px;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 10px;
  }

  .header {
    font-size: 16px;
    margin: 20px 0 15px 0;
    color: #909399;
  }
</style>
