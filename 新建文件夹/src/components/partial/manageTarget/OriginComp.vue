<template>
  <div class="origin-container">
    <Button :disabled="originEdit" size="mini" type="primary" @click="handleAddOrigin" style="margin-bottom: 10px;">新增区间</Button>
    <Table
      :data="origin_lists"
      size="mini"
      border
      style="width: 100%">
     <!-- <TableColumn
        align="center"
        label="开始区间（包含）">
        <template slot-scope="scope">
          <span>{{ scope.row.start }}</span>
        </template>
      </TableColumn>-->
      <TableColumn
        align="center"
        label="开始区间（包含）">
        <template slot-scope="scope">
          <template v-if="currentOrigin.id === scope.row.id">
            <Input size="mini" type="number" v-model="currentOrigin.start" />
          </template>
          <template v-else>
            <span>{{ scope.row.start }}</span>
          </template>
        </template>
      </TableColumn>
      <TableColumn
        align="center"
        label="值">
        <template slot-scope="scope">
          <template v-if="currentOrigin.id === scope.row.id">
            <Input size="mini" type="number" v-model="currentOrigin.value" />
          </template>
          <template v-else>
            <span>{{ scope.row.value }}</span>
          </template>
        </template>
      </TableColumn>
      <TableColumn
        align="center"
        label="操作">
        <template slot-scope="scope">
          <template v-if="currentOrigin.id === scope.row.id">
            <i title="取消" class="el-icon-close" @click="handleQanceOrigin" />
            <i title="保存" class="el-icon-check" @click="handleSaveOrigin(scope.$index)" />
            <!--  <el-button type="primary" @click="handleQanceOrigin"><i title="取消" class="el-icon-close" /></el-button>
              <el-button type="primary" @click="handleSaveOrigin(scope.$index)"><i title="保存" class="el-icon-check" /></el-button>-->
          </template>
          <template v-else>
            <i title="编辑" class="el-icon-edit" @click="handleEditOrigin(scope.row)" />
            <i title="删除" class="el-icon-delete" @click="handleDeleteOrigin(scope.$index)" />
            <!--   <el-button :disabled="originEdit" size="mini" ><i title="编辑" class="el-icon-edit"/></el-button>
            <el-button :disabled="originEdit" size="mini" @click="handleDeleteOrigin(scope.$index)"><i title="删除" class="el-icon-delete" /></el-button>-->
          </template>
        </template>
      </TableColumn>
    </Table>
  </div>
</template>

<script>
  import { Button, TableColumn, Table, Input, Message, MessageBox } from 'element-ui'
  export default {
    name: 'OriginComp',
    components: {
      Button, TableColumn, Table, Input
    },
    props: {
      list: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        origin_lists: [],
        currentOrigin: '',
        originEdit: false
      }
    },
    mounted () {
      if (this.list.length > 0) {
        this.list.forEach((node, index) => {
          this.origin_lists.push({id: index + 1, start: node.ind_val * 1, value: node.ind_score * 1})
        })
      }
    },
    watch: {
      list () {
        this.origin_lists = []
        this.list.forEach((node, index) => {
          this.origin_lists.push({id: index + 1, start: node.ind_val * 1, value: node.ind_score * 1})
        })
      }
    },
    methods: {
      handleAddOrigin () {
        if (!this.originEdit) {
          this.originEdit = true
          this.currentOrigin = ''
          if (this.origin_lists && this.origin_lists.length > 0) {
            const last = this.origin_lists[this.origin_lists.length - 1]
            this.origin_lists.push({ id: last.id + 1, start: '', value: '' })
            this.currentOrigin = { id: last.id + 1, start: '', value: '', new: true }
          } else {
            this.origin_lists = []
            this.origin_lists.push({ id: 1, start: '', value: '' })
            this.currentOrigin = { id: 1, start: '', value: '', new: true }
          }
        }
      },
      handleEditOrigin (row) {
        this.currentOrigin = JSON.parse(JSON.stringify(row))
        this.originEdit = true
      },
      handleDeleteOrigin (index) {
        MessageBox.confirm('此操作将删除此区间，以及后面所有区间数据，确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.origin_lists.splice(index)
          let list = []
          this.origin_lists.forEach((node) => {
            list.push({ind_val: node.start * 1, ind_score: node.value * 1})
          })
          this.$emit('update:list', list)
        }).catch(() => {
        })
      },
      handleQanceOrigin () {
        if (this.currentOrigin.new) {
          this.origin_lists.pop()
        }
        this.originEdit = false
        this.currentOrigin = ''
      },
      handleSaveOrigin (index) {
        let len = this.origin_lists.length
        if (index === 0) {
          if (len === 1) {
            this.origin_lists[index] = { id: this.currentOrigin.id, start: this.currentOrigin.start, value: this.currentOrigin.value }
            this.originEdit = false
            this.currentOrigin = ''
          } else {
            if (this.currentOrigin.start > this.origin_lists[index + 1].start) {
              Message({
                type: 'error',
                message: '无法保存，该区间值大于下个区间值！'
              })
            } else {
              this.origin_lists[index] = { id: this.currentOrigin.id, start: this.currentOrigin.start, value: this.currentOrigin.value }
              this.originEdit = false
              this.currentOrigin = ''
            }
          }
        } else if (index === len - 1) {
          if (this.currentOrigin.start < this.origin_lists[index - 1].start) {
            Message({
              type: 'error',
              message: '无法保存，该区间值小于上个区间值！'
            })
          } else {
            this.origin_lists[index] = { id: this.currentOrigin.id, start: this.currentOrigin.start, value: this.currentOrigin.value }
            this.originEdit = false
            this.currentOrigin = ''
          }
        } else {
          if (this.currentOrigin.start < this.origin_lists[index - 1].start) {
            Message({
              type: 'error',
              message: '无法保存，该区间值小于上个区间值！'
            })
          } else if (this.currentOrigin.start > this.origin_lists[index + 1].start) {
            Message({
              type: 'error',
              message: '无法保存，该区间值大于下个区间值！'
            })
          } else {
            this.origin_lists[index] = { id: this.currentOrigin.id, start: this.currentOrigin.start, value: this.currentOrigin.value }
            this.originEdit = false
            this.currentOrigin = ''
          }
        }
        let list = []
        this.origin_lists.forEach((node) => {
          list.push({ind_val: node.start * 1, ind_score: node.value * 1})
        })
        this.$emit('update:list', list)
      }
    }
  }
</script>

<style scoped>

</style>
