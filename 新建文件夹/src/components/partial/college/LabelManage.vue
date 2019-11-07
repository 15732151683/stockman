<template>
  <div class="label-box">
    <div class="label-button" @click="handleShow">
      <slot name="button"></slot>
    </div>
    <div class="label-dialog">
      <Dialog
        @opened="handleOpen"
        @close="handleClose"
        :visible.sync="dialogVisible"
        :width="width"
        :title="title">
        <div style="margin-top: 10px;padding: 0px 20px">
          <draggable
            class="balel-list"
            element="div"
            v-model="cloneList"
            :options="dragOptions"
            :move="onMove"
            @start="isDragging=true"
            @end="onEnd">
            <button :key="tag.id" class="button-tag" v-for="tag in cloneList" @click="showEditInput(tag)">
              <input
                class="input-edit-tag"
                v-model="tagName"
                v-if="editTagVisible && currentTag.id === tag.id"
                type="text"
                ref="editTagInput"
                @keyup.enter.native="confirmEditTag"
                @blur="confirmEditTag" >
              <span v-else>{{tag.name}}</span>
              <i v-show="!tag.orgs || tag.orgs.length === 0" class="el-icon-close button-tag-close"  @click.stop="confirmDeleteTag(tag)"></i>
            </button>
          </draggable>
          <Input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="tagName"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="confirmAddTag"
            @blur="confirmAddTag" />
          <Button v-else class="button-new-tag" size="small" @click="showInput">+ 新增</Button>
        </div>
        <div slot="footer">
          <Button
            type="primary"
            size="small"
            class="button-close"
            @click="dialogVisible = false">{{$t('element.buttonClose')}}</Button>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script>
    import { Dialog, MessageBox, Input, Button } from 'element-ui'
    import draggable from 'vuedraggable'
    export default {
      name: 'labelManage',
      components: {
        Dialog, Input, Button, draggable
      },
      props: {
        title: {
          default: ''
        },
        width: {
          default: '500px'
        },
        list: {
          default: function () {
            return []
          },
          type: Array
        },
        dragStatus: {
          default: false
        }
      },
      data () {
        return {
          dialogVisible: false,
          editTagVisible: false,
          currentTag: '',
          tagName: '',
          inputVisible: false,
          isDragging: false,
          sortState: true,
          cloneList: []
        }
      },
      computed: {
        dragOptions () {
          return {
            animation: 0,
            group: {
              name: 'description',
              pull: 'clone'
            },
            sort: true,
            disabled: !this.dragStatus,
            ghostClass: 'ghost'
          }
        }
      },
      methods: {
        handleShow () {
          this.dialogVisible = true
        },
        showEditInput (data) {
          this.editTagVisible = true
          this.currentTag = data
          this.tagName = data.name
          this.$nextTick(() => {
            this.$refs.editTagInput[0].focus()
          })
        },
        confirmEditTag () {
          if (this.tagName !== this.currentTag.name) {
            this.$emit('edit', {'name': this.tagName, 'id': this.currentTag.id})
          }
          this.currentTag = ''
          this.tagName = ''
          this.editTagVisible = false
        },
        confirmDeleteTag (data) {
          MessageBox.confirm(this.$t('element.confirm'), this.$t('element.warming'), {
            type: 'warning'
          }).then(() => {
            this.$emit('delete', data)
          }).catch(() => {
          })
        },
        confirmAddTag () {
          let inputValue = this.tagName
          if (inputValue) {
            this.$emit('add', {'name': this.tagName})
          }
          this.inputVisible = false
          this.tagName = ''
        },
        showInput () {
          this.inputVisible = true
          this.$nextTick(() => {
            this.$refs.saveTagInput.$refs.input.focus()
          })
        },
        // 拖拽
        onEnd (options) {
          let prev = options.oldIndex
          let next = options.newIndex
          let arg = {prev: prev, next: next}
          this.sortState = true
          this.$emit('change', arg)
        },
        onMove ({relatedContext, draggedContext}) {
          return true
        },
        handleOpen () {
          this.sortState = false
        },
        handleClose () {
          if (this.sortState) {
            this.$emit('close')
          }
        }
      },
      watch: {
        list () {
          this.cloneList = this.list
        }
      }
    }
</script>

<style scoped>
  .label-box {
    display: inline-block;
  }
  .label-button {
    display: inline-block;
  }
  .input-new-tag{
    width: 100px;
  }
  .input-edit-tag{
    width: 80px;
  }
  .button-tag {
    background-color: #4A90E2;
    border: none;
    border-radius: 3px;
    outline: none;
    color: #ffffff;
    font-size: 14px;
    line-height: 26px;
    position: relative;
    margin: 5px 5px;
    padding: 2px 25px 2px 10px;
  }
  .button-tag i {
    color: #24476F;
  }
  .button-tag-close {
    position: absolute;
    font-size: 14px;
    cursor: pointer;
    right: 5px;
    top: 8px;
  }
  .button-tag-close:hover{
    color: #ffffff;
  }
</style>
