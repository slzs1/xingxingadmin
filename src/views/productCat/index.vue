<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"
      style="margin-bottom: 10px; width: 30%"
    />
    <el-switch
      v-model="hiddenStatus"
      active-text="显示隐藏分类"
      style="margin-left: 10px"
      @change="searchProductCat"
    />
    <el-tree
      ref="tree"
      :data="data"
      node-key="id"
      default-expand-all
      draggable
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :allow-drop="allowDrop"
      @node-drop="handleDrop"
    >
      <span
        slot-scope="{node, data}"
        class="custom-tree-node"
      >
        <span>{{ node.label }}</span>
        <span>{{ data.isHidden ? '(已隐藏)' : '' }}</span>
        <span>
          <el-button
            v-if="$can('edit',data)"
            type="text"
            size="mini"
            @click="handleOpen(data, false)"
          >
            增加
          </el-button>
          <el-button
            v-if="$can('edit',data)"
            type="text"
            size="mini"
            @click="handleOpen(data, true)"
          >
            修改
          </el-button>
          <el-button
            v-if="$can('destory',data)"
            type="text"
            size="mini"
            @click="handleRemove(data)"
          >
            删除
          </el-button>
          <el-button
            v-if="$can('edit',data)"
            type="text"
            size="mini"
            @click="handleHiden(data)"
          >
            {{ data.isHidden ? '显示' : '隐藏' }}
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      :title="isEdit?'修改':'添加'"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-row style="margin-bottom:10px">
        <el-input
          v-model="dialogLabel"
          placeholder="请输入内容"
        />
      </el-row>
      <el-row style="margin-bottom:20px">
        <upload-image
          :key="imageList[0]"
          width="200"
          height="200"
          :image-list="imageList"
          limit="1"
          @bindImages="handleImage"
        />
      </el-row>
      <el-row>
        <el-button @click="dialogVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="isEdit?handleEdit():handleAppend()"
        >
          {{ isEdit ? '修改' : '创建' }}
        </el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { confirm, message } from '@/utils/confirm'
import UploadImage from '@/components/UploadImage/index.vue'
import {
  Product,
  ProductCat
} from '@/model' // 引入商品有关的model
import { Dropdown } from 'element-ui'

// 组件注册，不可移除
@Component({
  name: 'productCat',
  components: {
    UploadImage
  }
})
export default class extends Vue {
  // 表格数据
  private data: any = []
  private imageList: any[] = []
  private isEdit:boolean = false

  private filterText = ''

  private editCat: any = {}
  private editParent = 0
  private dialogVisible = false
  private dialogLabel = ''

  private hiddenStatus:boolean = false

  private parentCat:string[] = []

  // 商品查询结构
  get scope() {
    return ProductCat.where({ isHidden: this.hiddenStatus ? '' : false })
      .order({ position: 'desc' })
      .selectExtra(['_actions'])
  }

  @Watch('filterText')
  getFilterText(val: any) {
    return (this.$refs as any).tree.filter(val)
  }

  // 页面创建时
  created() {
    this.searchProductCat()
  }

  private async searchProductCat() {
    let mid = (await this.scope.all()).data
    this.data = this.toTree(mid)
    this.filterText = ''
  }

  // 过滤方法
  private filterNode(value: any, data: any) {
    if (!value) return true
    return data.label.indexOf(value) !== -1
  }

  // 将数据封装成树形数据
  private toTree(data:ProductCat[]) {
    interface branch{
      id?:string;
      label:string;
      image:string;
      isHidden: boolean;
      children:Array<branch>
      Actions:Array<string>
    }

    let tree: branch[] = []
    data.forEach((element:ProductCat) => {
      if (!element.parentId || element.parentId === 0) {
        let branch:branch = {
          id: element.id,
          label: element.name,
          image: element.image,
          isHidden: element.isHidden,
          children: [],
          Actions: element.Actions
        }
        tree.push(branch)
      }
    })
    data.forEach((element:ProductCat) => {
      if (element.parentId && element.parentId !== 0) {
        let branch:branch = {
          id: element.id,
          label: element.name,
          image: element.image,
          isHidden: element.isHidden,
          children: [],
          Actions: element.Actions
        }
        data.forEach((val:ProductCat) => {
          let branchChild:branch = {
            id: val.id,
            label: val.name,
            image: val.image,
            isHidden: val.isHidden,
            children: [],
            Actions: val.Actions
          }
          if (branch.id === val.parentId + '') {
            branch.children.push(branchChild)
            this.parentCat.push(branchChild.id as string)
          }
        })
        tree.forEach(item => {
          if (item.id === element.parentId + '') {
            item.children.push(branch)
          }
        })
      }
    })
    return tree
  }

  private handleImage(val: Array<string>) {
    this.imageList = val
  }

  private async handleOpen(data:any, isEdit:boolean) {
    if (!isEdit && this.parentCat.indexOf(data.id) !== -1) {
      message('无法添加四级分类！', 'error')
    } else {
      this.dialogVisible = true
    }
    this.isEdit = isEdit
    if (isEdit) {
      this.editCat = data
      this.dialogLabel = this.editCat.label
      this.imageList = [data.image]
    } else {
      this.editCat = {}
      this.dialogLabel = ''
      this.editParent = data.id
      this.imageList = []
    }
  }

  // 添加修改删除操作
  private async handleAppend() {
    if (!this.dialogLabel) {
      message('分类名不能为空！', 'error')
    } else if (!this.imageList[0]) {
      message('请添加图片！', 'error')
    } else {
      confirm('确认要添加吗？', 'warning', async action => {
        if (action === 'confirm') {
          let newCat = new ProductCat({ name: this.dialogLabel, image: this.imageList[0], parentId: this.editParent, content: '无', position: 1 })
          let success = await newCat.save()
          if (success) {
            message('添加成功！', 'success')
          } else {
            message('添加失败！', 'error')
          }
          this.dialogVisible = false
          this.searchProductCat()
        } else {
          message('取消添加', 'warning')
          this.dialogVisible = false
          this.searchProductCat()
        }
      })
    }
  }
  private async handleEdit() {
    if (!this.dialogLabel) {
      message('分类名不能为空！', 'error')
    } else {
      confirm('确认要修改吗？', 'warning', async action => {
        if (action === 'confirm') {
          let cat = (await ProductCat.find(this.editCat.id)).data
          cat.name = this.dialogLabel
          cat.image = this.imageList[0]
          let success = await cat.save()
          if (success) {
            message('修改成功！', 'success')
          } else {
            message('修改失败！', 'error')
          }
          this.dialogVisible = false
          this.searchProductCat()
        } else {
          message('取消修改', 'warning')
          this.dialogVisible = false
          this.searchProductCat()
        }
      })
    }
  }
  private async handleRemove(data: any) {
    let cat = (await ProductCat.find(data.id)).data
    confirm('确认要删除吗？', 'warning', async action => {
      if (action === 'confirm') {
        await cat.destroy()
        if (!cat.hasError) {
          message('删除成功！', 'success')
        } else {
          message('删除失败！', 'error')
        }
        this.searchProductCat()
      } else {
        message('取消删除', 'warning')
        this.searchProductCat()
      }
    })
  }
  private async handleHiden(data: any) {
    let cat = (await ProductCat.find(data.id)).data
    confirm('确认要更改显示状态吗？', 'warning', async action => {
      if (action === 'confirm') {
        cat.isHidden = !cat.isHidden
        await cat.save()
        if (!cat.hasError) {
          message('更改成功！', 'success')
        } else {
          message('更改失败！', 'error')
        }
        this.searchProductCat()
      } else {
        message('取消更改', 'warning')
        this.searchProductCat()
      }
    })
  }
  private handleDrop(draggingNode:any, dropNode:any, dropType:string, ev:any) {
    confirm('确认要移动到这里吗？', 'warning', async action => {
      if (action === 'confirm') {
        let cat = (await ProductCat.find(draggingNode.data.id)).data
        let dropCat = (await ProductCat.find(dropNode.data.id)).data
        if (dropType === 'before') {
          cat.position = dropCat.position + 1
        } else if (dropCat.position !== 0) {
          cat.position = dropCat.position - 1
        }
        cat.parentId = dropCat.parentId
        let success = await cat.save()
        if (success) {
          message('移动成功！', 'success')
        } else {
          message('移动失败！', 'error')
        }
        this.searchProductCat()
      } else {
        message('取消移动', 'warning')
        this.searchProductCat()
      }
    })
  }

  private allowDrop(draggingNode:any, dropNode:any, type:string) {
    if (type !== 'inner') { return true }
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
