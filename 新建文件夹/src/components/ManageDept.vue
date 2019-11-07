<template>
  <Container :title="title" :showDownload="[false, false, false]">
    <template slot="header"></template>
    <template slot="main">
      <div class="udss-board-body">
        <div class="udss-board-toolbox">
          <input
            class="search-input"
            :placeholder="$t('element.filterText')"
            v-model="filterText" />
          <Button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            style="float: none; border-radius: 2px;"
            class="button-add"
            v-hasPermission="'w'"
            @click="handleAppend">新增部门</Button>
        </div>
        <div class="college-list-line"></div>
        <div class="college-list-container">
          <draggable
            class="college-list"
            id="loadings"
            element="ul"
            v-model="cloneDepts"
            :options="dragOptions"
            :move="onMove"
            @start="isDragging=true"
            @end="onEnd">
            <li v-for="(item, index) in cloneDepts" :key="index">
              <div class="college-list-li">
                <div class="college-list-li-left">
                  <div class="college-list-li-icon">
                    <i class="college-icon-zuhe"></i>
                  </div>
                  {{item.short_name}}
                </div>
                <div class="college-list-li-right">
                  <div class="college-list-li-edit">
                    <i class="college-icon-edit" :title="$t('element.edit')" @click.stop="handleUpdate(item)"></i>
                  </div>
                  {{item.name}}
                </div>
              </div>
            </li>
            <!--<tr v-for="(item, index) in cloneDepts" :key="index">-->
              <!--<td>-->
                <!--<i class="college-icon-zuhe"></i>-->
              <!--</td>-->
              <!--<td>{{item.short_name}}</td>-->
              <!--<td>{{item.name}}</td>-->
              <!--<td>-->
                <!--<i class="college-icon-edit" :title="$t('element.edit')" @click.stop="handleUpdate(item)"></i>-->
              <!--</td>-->
            <!--</tr>-->
          </draggable>
        </div>
        <Dialog
          :visible.sync="addVisible"
          width="500px"
          title="新增部门">
          <div style="margin-top: 40px;padding: 0px 30px" v-if="addVisible">
            <Form
              :model="deptInfo"
              :rules="rules"
              ref="createForm"
              label-width="100px"
              class="udss-dialog-form">
              <FormItem label="部门名称" prop="name">
                <Input clearable v-model="deptInfo.name" type="text" />
              </FormItem>
              <FormItem label="部门简称" prop="short_name">
                <Input clearable v-model="deptInfo.short_name" type="text" />
              </FormItem>
              <FormItem label="备注" prop="remark">
                <Input clearable v-model="deptInfo.remark" type="textarea" />
              </FormItem>
            </Form>
          </div>
          <div slot="footer">
            <Button
              type="primary"
              size="small"
              class="button-confirm"
              :loading="addSaveLoading"
              @click="confirmCreate">{{$t('element.buttonConfirm')}}</Button>
            <Button
              type="primary"
              size="small"
              class="button-reset"
              @click="resetCreate">{{$t('element.buttonReset')}}</Button>
            <Button
              type="primary"
              size="small"
              class="button-close"
              @click="closeCreateDialog">{{$t('element.buttonClose')}}</Button>
          </div>
        </Dialog>
        <Dialog
          :visible.sync="editVisible"
          width="500px"
          title="修改部门">
          <div style="margin-top: 40px;padding: 0px 30px" v-if="editVisible">
            <Form
              :model="deptInfo"
              :rules="rules"
              ref="updateForm"
              label-width="100px"
              class="udss-dialog-form">
              <FormItem label="部门名称" prop="name">
                <Input clearable v-model="deptInfo.name" type="text" />
              </FormItem>
              <FormItem label="部门简称" prop="short_name">
                <Input clearable v-model="deptInfo.short_name" type="text" />
              </FormItem>
              <FormItem label="备注" prop="remark">
                <Input clearable v-model="deptInfo.remark" type="textarea" />
              </FormItem>
            </Form>
          </div>
          <div slot="footer">
            <Button
              v-hasPermission="'w'"
              type="primary"
              size="small"
              class="button-delete"
              @click="handleDelete">
              {{$t('element.delete')}}
            </Button>
            <Button
              type="primary"
              size="small"
              class="button-confirm"
              :loading="editSaveLoading"
              @click="confirmUpdate">{{$t('element.buttonConfirm')}}</Button>
            <Button
              type="primary"
              size="small"
              class="button-reset"
              @click="resetUpdate">{{$t('element.buttonReset')}}</Button>
            <Button
              type="primary"
              size="small"
              class="button-close"
              @click="closeUpdateDialog">{{$t('element.buttonClose')}}</Button>
          </div>
        </Dialog>
      </div>
    </template>
  </Container>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Input, Button, Select, Option, Tree, MessageBox, Message, Dialog, Form, FormItem, RadioGroup, Radio, Popover, CheckboxGroup, Checkbox, Tag } from 'element-ui'
  import { Container } from './widgets'
  import draggable from 'vuedraggable'
  export default {
    name: 'ManageDept',
    components: {
      Container, Input, Button, Select, Option, Tree, MessageBox, Message, Dialog, Form, FormItem, RadioGroup, Radio, draggable, Popover, CheckboxGroup, Checkbox, Tag
    },
    data () {
      return {
        title: '',
        filterText: '',
        addVisible: false,
        addSaveLoading: false,
        editVisible: false,
        editSaveLoading: false,
        memoryInfo: {},
        deptInfo: {},
        rules: {
          name: [
            { required: true, message: '请输入部门名称', trigger: 'change' }
          ],
          short_name: [
            { required: true, message: '请输入部门简称', trigger: 'change' }
          ]
        },
        isDragging: false,
        sortState: false,
        dragStatus: true,
        cloneDepts: []
      }
    },
    mounted () {
      this.title = this.$route.meta.title
      this.getDept()
    },
    methods: {
      ...mapActions('dept', ['getDept', 'create', 'deptSort', 'update', 'delete']),
      ...mapMutations('dept', ['changeDeptOrder']),
      // 拖拽
      onEnd (options) {
        let prev = options.oldIndex
        let next = options.newIndex
        let arg = {prev: prev, next: next}
        this.sortState = true
        this.changeDeptOrder(arg)
      },
      onMove () {
        return true
      },
      updateSort () {
        let data = this.depts.map(node => {
          return {
            id: node.id,
            order_no: node.order_no
          }
        })
        this.deptSort(data)
      },
      handleAppend () {
        this.deptInfo = {
          name: '',
          short_name: '',
          remark: ''
        }
        this.addVisible = true
      },
      confirmCreate () {
        this.$refs.createForm.validate(valid => {
          if (valid) {
            new Promise((resolve, reject) => {
              this.addSaveLoading = true
              this.create({resolve, reject, payload: this.deptInfo})
            }).then(() => {
              this.addSaveLoading = false
              this.closeCreateDialog()
            }).catch(() => {
              this.addSaveLoading = false
            })
          }
        })
      },
      resetCreate () {
        this.$refs.createForm.resetFields()
      },
      closeCreateDialog () {
        this.addVisible = false
      },
      handleUpdate (data) {
        this.memoryInfo = data
        this.deptInfo = this.clone(data)
        this.editVisible = true
      },
      confirmUpdate () {
        this.$refs.updateForm.validate(valid => {
          if (valid) {
            new Promise((resolve, reject) => {
              this.editSaveLoading = true
              this.update({resolve, reject, payload: this.clone(this.deptInfo)})
            }).then(() => {
              this.editSaveLoading = false
              this.closeUpdateDialog()
            }).catch(() => {
              this.editSaveLoading = false
            })
          }
          return valid
        })
      },
      clone (data) {
        return JSON.parse(JSON.stringify(data))
      },
      resetUpdate () {
        this.deptInfo = this.clone(this.memoryInfo)
      },
      closeUpdateDialog () {
        this.editVisible = false
      },
      handleDelete () {
        MessageBox.confirm('确认删除该部门？', this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            this.delete({resolve, reject, payload: this.deptInfo})
          }).then(() => {
            this.closeUpdateDialog()
          }).catch(() => {})
        }).catch(() => {})
      },
      filterDept (text) {
        if (text) {
          this.cloneDepts = this.depts.filter(node => {
            return node.name.toLowerCase().indexOf(text.toLowerCase()) !== -1
          })
          this.dragStatus = false
        } else {
          this.cloneDepts = this.depts
          this.dragStatus = true
        }
      }
    },
    beforeDestroy () {
      this.sortState && this.updateSort()
    },
    computed: {
      ...mapGetters('dept', ['depts']),
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
    watch: {
      depts () {
        if (this.depts && this.depts.length > 0) {
          this.filterDept(this.filterText)
        } else {
          this.cloneDepts = []
        }
      },
      filterText () {
        this.filterDept(this.filterText)
      }
    }
  }
</script>

<style scoped >
  .udss-board-body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-size: 14px;
  }
  .udss-board-toolbox {
    overflow: hidden;
  }
  .search-input {
    margin-right: 30px;
    border-radius: 4px;
    width: 350px;
    height: 35px;
    padding: 0 10px;
    border: solid 1px #D7D7D7;
    outline: none;
    line-height: 48px;
    text-indent: 10px;
    background: url('../assets/img/search.png') no-repeat;
    background-position: top 10px right 18px;
  }
  .college-list-line {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
    height: 1px;
    background-color: #EFF3F6;
  }
  .college-list-container {
    height: calc(100% - 80px);
    overflow: hidden;
    overflow-y: auto;
  }
  .college-list {
    font-weight: bold;
    color: #4A4A4A;
  }
  .college-list>li{
    margin-top: 10px;
    overflow: hidden;
    width: 49%;
    /*float: left;*/
    background: #F3F5F7;
  }
  .college-list>li:nth-child(odd) {
    margin-right: 2%;
  }
  .college-list-li {
    border: solid 1px #E9E9E9;
    border-left: solid 4px #1EBBA6;
    padding: 9px 2px;
    overflow: hidden;
  }
  .college-list-li-left {
    float: left;
    width: 30%;
  }
  .college-list-li-icon {
    float: left;
    padding: 0 20px;
  }
  .college-list-li-edit {
    float: right;
    padding: 0 30px;
  }
  .college-list-li-right {
    float: left;
    width: 70%;
  }
  .college-icon-edit {
    vertical-align: middle;
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url('../assets/img/btn-edit.svg') no-repeat;
    background-size: 20px auto;
    cursor: pointer;
  }
/*  .college-list td {
    padding: 7px 10px;
    border-bottom: solid 1px #E9E9E9;
    border-top: solid 1px #E9E9E9;
  }
  .college-list tr td:nth-child(1) {
    border-left: solid 4px #1EBBA6;
    text-align: center;
    width: 80px;
  }
  .college-list tr td:nth-child(4) {
    border-right: solid 1px #DBDBDB;
    text-align: center;
    width: 80px;
  }*/
  .college-icon-zuhe {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    background: url('../assets/img/dept.svg') no-repeat;
    background-size: 20px auto;
  }
  .button-delete {
    padding: 10px 20px;
    border: 0px;
    border-radius: 0px;
    background-color: #9C9C9C;
    float: left;
  }
</style>
