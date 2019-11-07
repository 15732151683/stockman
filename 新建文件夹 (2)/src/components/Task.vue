<template>
  <Container :title="title" :showDownload="[false, false, false]">
    <template slot="header"></template>
    <template slot="main">
      <div class="task-header">
        <TaskSearch @getTask="getTaskList">
          <template slot="button">
            <Button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              style="float: none; border-radius: 2px; margin-top: 4px; margin-left: 20px;"
              class="button-add"
              v-hasPermission="'w'"
              @click="handleAppend">新建任务</Button>
          </template>
        </TaskSearch>
      </div>
      <div class="task-container">
        <div class="task-container-right">
          <div :class="['task-side-header', 'task-li-' + currentTask.task_node.status_type]">
            任务填报指标
          </div>
          <div class="task-side-box target-tree" v-if="showList">
            <Tree
              :data="nodeTree"
              node-key="id"
              ref="trees"
              default-expand-all
              :props="defaultProps">
              <div class="task-tree one-line" slot-scope="{ node, data }">
                <div class="one-line" :title="data.name">{{data.name}}</div>
              </div>
            </Tree>
          </div>
        </div>
        <div class="task-container-left">
          <ul class="task-ul" v-if="showList">
            <template v-for="(item, index) in tasks">
              <TaskLi :key="index" :currentTask="currentTask" :item="item" :taskNodes="taskNodes" @handleDetail="handleDetail(item)">
                <div slot="aside">
                  <div class="task-button-box" v-if="!item.published_at">
                    <i class="task-icon-edit" :title="$t('element.edit')" @click.stop="handleUpdate(item)"></i>
                    <i class="task-icon-delete" :title="$t('element.delete')" @click.stop="handleDelete(item)"></i>
                  </div>
                  <Button
                    v-if="!item.published_at"
                    type="primary"
                    size="mini"
                    class="button-add"
                    style="float: none; background-color: #EBB747; border-radius: 3px; color: #FFFFFF;"
                    @click.stop="handlePublish(item)">发布任务</Button>
                  <Button
                    v-if="item.published_at && !item.finished_at && !item.terminated_at"
                    type="primary"
                    size="mini"
                    class="button-add"
                    style="float: none; background-color: #E58B6F; border-radius: 3px; color: #FFFFFF;"
                    @click.stop="handleEnd(item)">
                    终止任务
                  </Button>
                  <Button
                    v-if="item.terminated_at"
                    type="primary"
                    size="mini"
                    class="button-add"
                    style="float: none; background-color: #E58B6F; border-radius: 3px; color: #FFFFFF;">
                    已终止
                  </Button>
                </div>
              </TaskLi>
            </template>
          </ul>
        </div>
      </div>
      <div class="task-footer">
        <TaskPage ref="taskPage"></TaskPage>
      </div>
      <Dialog
        :visible.sync="addVisible"
        width="840px"
        title="新增任务">
        <div class="task-form" v-if="addVisible">
          <div class="task-form-left">
            <Form
              :model="taskInfo"
              :rules="rules"
              ref="createForm"
              label-width="100px"
              class="udss-dialog-form">
              <FormItem label="任务名称" prop="name">
                <Input clearable v-model="taskInfo.name" type="text" />
              </FormItem>
              <FormItem label="指标年份" prop="year_range">
                <PickerDate
                  @rangeChange="yearChange"
                  :width="'100%'"
                  :height="'100%'"
                  :size="''"
                  :range="taskInfo.year_range">
                </PickerDate>
              </FormItem>
              <FormItem label="截止日期" prop="deadline">
                <DatePicker
                  style="width: 100%;"
                  v-model="taskInfo.deadline"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </DatePicker>
              </FormItem>
              <FormItem label="填报部门" prop="dept_id">
                <!--<Input clearable v-model="taskInfo.dept" type="text" />-->
                <Select v-model="taskInfo.dept_id" placeholder="请选择" style="width: 100%;">
                  <Option
                    v-for="item in depts"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="任务说明" prop="remark">
                <Input clearable v-model="taskInfo.remark" type="textarea" />
              </FormItem>
            </Form>
          </div>
          <div class="task-form-right">
            <Input
              size="small"
              suffix-icon="el-icon-search"
              placeholder="输入关键字"
              v-model="filterText" />
            <div class="task-tree-box target-tree">
              <Tree
                :default-checked-keys="checkedTarget"
                :data="targets"
                node-key="id"
                ref="addTree"
                :props="defaultProps"
                :filter-node-method="filterNode"
                show-checkbox>
                <div class="task-tree one-line" slot-scope="{ node, data }">
                  <div class="one-line" :title="data.name">{{data.name}}</div>
                </div>
              </Tree>
            </div>
          </div>
        </div>
        <div slot="footer" style="text-align: center">
          <Button
            type="primary"
            size="small"
            class="button-confirm"
            style="float: none"
            :loading="addLoading"
            @click="confirmCreate">保存</Button>
          <!--<Button-->
            <!--type="primary"-->
            <!--size="small"-->
            <!--class="button-close"-->
            <!--@click="closeCreateDialog">{{$t('element.buttonClose')}}</Button>-->
        </div>
      </Dialog>
      <Dialog
        :visible.sync="updateVisible"
        width="840px"
        title="修改任务">
        <div class="task-form" v-if="updateVisible">
          <div class="task-form-left">
            <Form
              :model="taskInfo"
              :rules="rules"
              ref="updateForm"
              label-width="100px"
              class="udss-dialog-form">
              <FormItem label="任务名称" prop="name">
                <Input clearable v-model="taskInfo.name" type="text" />
              </FormItem>
              <FormItem label="指标年份" prop="year_range">
                <PickerDate
                  @rangeChange="updateYearChange"
                  :width="'100%'"
                  :height="'100%'"
                  :size="''"
                  :range="taskInfo.year_range">
                </PickerDate>
              </FormItem>
              <FormItem label="截止日期" prop="deadline">
                <DatePicker
                  style="width: 100%;"
                  v-model="taskInfo.deadline"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </DatePicker>
              </FormItem>
              <FormItem label="填报部门" prop="dept_id">
                <Select v-model="taskInfo.dept_id" placeholder="请选择" style="width: 100%;">
                  <Option
                    v-for="item in depts"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="任务说明" prop="remark">
                <Input clearable v-model="taskInfo.remark" type="textarea" />
              </FormItem>
            </Form>
          </div>
          <div class="task-form-right">
            <Input
              size="small"
              suffix-icon="el-icon-search"
              placeholder="输入关键字"
              v-model="filterText" />
            <div class="task-tree-box target-tree">
              <Tree
                :default-checked-keys="checkedTarget"
                :data="targets"
                node-key="id"
                ref="addTree"
                :props="defaultProps"
                :filter-node-method="filterNode"
                show-checkbox>
                <div class="task-tree one-line" slot-scope="{ node, data }">
                  <div class="one-line" :title="data.name">{{data.name}}</div>
                </div>
              </Tree>
            </div>
          </div>
        </div>
        <div slot="footer" style="text-align: center">
          <Button
            type="primary"
            size="small"
            class="button-confirm"
            :loading="updateLoading"
            style="float: none"
            @click="confirmUpdate">保存</Button>
        </div>
      </Dialog>
    </template>
  </Container>
</template>

<script>
  import { Container, PickerDate, TaskLi, TaskSearch, TaskPage } from './widgets'
  import { Button, Select, Option, Tree, Dialog, FormItem, Form, Input, DatePicker, MessageBox, Message } from 'element-ui'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'ManageTask',
    components: {
      Container, PickerDate, TaskLi, TaskSearch, TaskPage, Button, Select, Option, Tree, Dialog, FormItem, Form, Input, DatePicker, MessageBox, Message
    },
    data () {
      return {
        title: '填报任务管理',
        currentTask: {
          task_node: {}
        },
        addVisible: false,
        updateVisible: false,
        taskInfo: {},
        rules: {
          name: [
            { required: true, message: '请输入任务名称', trigger: 'change' }
          ],
          year_range: [
            { required: true, message: '请选择年份', trigger: 'change' }
          ],
          deadline: [
            { required: true, message: '请选择截止日期', trigger: 'change' }
          ],
          dept_id: [
            { required: true, message: '请选择部门', trigger: 'change' }
          ]
        },
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        checkedTarget: [],
        showList: false,
        nodeTree: [],
        addLoading: false,
        updateLoading: false,
        filterText: ''
      }
    },
    created () {
      this.setTask([])
      this.setPageInfo({page: 1, size: 10})
      this.setSearchCondition({})
    },
    mounted () {
      // this.getDept()
      this.getTarget()
      this.getTaskList()
      let timer = setInterval(() => {
        if (this.targets.length > 0 && this.tasks.length > 0 && this.taskNodes.length > 0) {
          this.currentTask = this.tasks[0]
          this.getNodeTree(this.tasks[0].ind_ids)
          this.showList = true
          clearInterval(timer)
        }
      }, 10)
    },
    computed: {
      ...mapGetters('task', ['depts', 'targets', 'tasks', 'taskNodes', 'pageInfo'])
    },
    methods: {
      ...mapActions('task', ['getDept', 'getTarget', 'createTask', 'publishTask', 'updateTask', 'deleteTask', 'endTask']),
      ...mapMutations('task', ['setPageInfo', 'setSearchCondition', 'setTask']),
      yearChange (data) {
        this.taskInfo.year_range = data
        this.$refs.createForm.validateField('year_range')
      },
      updateYearChange (data) {
        this.taskInfo.year_range = data
        this.$refs.updateForm.validateField('year_range')
      },
      // 处理节点树结构
      clone (data) {
        return JSON.parse(JSON.stringify(data))
      },
      filterTree (tree, nodes) {
        let cuts = []
        tree.forEach((node) => {
          if (node.is_leaf) {
            nodes.indexOf(node.id) < 0 && cuts.push(node.id)
          } else {
            if (node.children && node.children.length > 0) {
              let child = this.filterTree(node.children, nodes)
              child && child.length === 0 && cuts.push(node.id)
            } else {
              cuts.push(node.id)
            }
          }
        })
        cuts.forEach(item => {
          let idx = tree.findIndex(child => child.id === item)
          idx > -1 && tree.splice(idx, 1)
        })
        return tree
      },
      getNodeTree (nodes) {
        let cloneTree = this.clone(this.targets)
        this.nodeTree = this.filterTree(cloneTree, nodes)
      },
      handleAppend () {
        this.checkedTarget = []
        this.taskInfo = {
          year_range: '',
          remark: ''
        }
        this.addVisible = true
        setTimeout(() => {
          this.filterText = ''
        }, 10)
      },
      handleDetail (data) {
        this.currentTask = data
        this.getNodeTree(data.ind_ids)
      },
      confirmCreate () {
        this.$refs.createForm.validate(valid => {
          if (valid) {
            let indId = this.$refs.addTree.getCheckedNodes().filter(node => node.is_leaf).map(node => node.id)
            this.taskInfo.ind_ids = indId
            new Promise((resolve, reject) => {
              this.addLoading = true
              this.createTask({resolve, reject, payload: this.taskInfo})
            }).then(() => {
              this.setPageInfo({page: 1, size: this.pageInfo.size})
              this.getTaskList()
              // this.handleDetail(res)
              this.addLoading = false
              this.addVisible = false
            }).catch(() => {
              this.addLoading = false
            })
          }
        })
      },
      handleUpdate (data) {
        this.handleDetail(data)
        this.taskInfo = this.clone(data)
        this.checkedTarget = data.ind_ids
        this.updateVisible = true
        setTimeout(() => {
          this.filterText = ''
        }, 10)
      },
      confirmUpdate () {
        this.$refs.updateForm.validate(valid => {
          if (valid) {
            let dept = this.depts.filter(node => node.id === this.taskInfo.dept_id)
            let indId = this.$refs.addTree.getCheckedNodes().filter(node => node.is_leaf).map(node => node.id)
            this.taskInfo.ind_ids = indId
            this.taskInfo.dept = dept[0]
            new Promise((resolve, reject) => {
              this.updateLoading = true
              this.updateTask({resolve, reject, payload: this.taskInfo})
            }).then(() => {
              this.updateLoading = false
              this.updateVisible = false
              this.getNodeTree(this.taskInfo.ind_ids)
            }).catch(() => {
              this.updateLoading = false
            })
          }
        })
      },
      handleDelete (data) {
        this.handleDetail(data)
        MessageBox.confirm('确认删除该任务？', this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            this.deleteTask({resolve, reject, id: data.id})
          }).then(() => {
            if (this.tasks.length === 1) {
              if (this.pageInfo.size === 1) {
                this.setPageInfo({page: 1, size: this.pageInfo.size})
              } else {
                this.setPageInfo({page: 1, size: this.pageInfo.size - 1})
              }
            }
            this.getTaskList()
          }).catch(() => {})
        }).catch(() => {})
      },
      handlePublish (data) {
        this.handleDetail(data)
        MessageBox.confirm('发布后不可修改，确认发布该任务？', this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            this.publishTask({resolve, reject, id: data.id})
          }).then((res) => {
            this.currentTask.task_node = res.task_node
          }).catch(() => {})
        }).catch(() => {})
      },
      handleEnd (data) {
        this.handleDetail(data)
        MessageBox.confirm('确认终止该任务？', this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            this.endTask({resolve, reject, id: data.id})
          }).then(() => {
            if (this.tasks.length === 1) {
              if (this.pageInfo.size === 1) {
                this.setPageInfo({page: 1, size: this.pageInfo.size})
              } else {
                this.setPageInfo({page: 1, size: this.pageInfo.size - 1})
              }
            }
            this.getTaskList()
          }).catch(() => {})
        }).catch(() => {})
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
      getTaskList () {
        this.$refs.taskPage.handleFilterTask()
      }
    },
    watch: {
      filterText (val) {
        this.$refs.addTree.filter(val)
      },
      tasks () {
        if (this.tasks.length > 0) {
          this.handleDetail(this.tasks[0])
        } else {
          this.handleDetail({'ind_ids': [], 'task_node': {}})
        }
      }
    }
  }
</script>

<style scoped >
  .task-header {
    overflow: hidden;
    height: 40px;
  }
  .task-container {
    width: 100%;
    padding-top: 8px;
    padding-bottom: 8px;
    margin-top: 5px;
    height: calc(100% - 108px);
    background-color: #EFF3F6;
  }
  .task-footer {
    margin-top: 10px;
  }
  .task-container-left {
    overflow: hidden;
    height: 100%;
    overflow-y: auto;
  }
  .task-container-right {
    float: right;
    width: 300px;
    height: 100%;
    margin-right: 8px;
    margin-left: 8px;
    background-color: #FFFFFF;
    overflow: hidden;
  }
  .task-side-header {
    line-height: 40px;
    border-bottom: solid 2px #EFF3F6;
    text-indent: 20px;
    font-weight: 600;
    font-size: 16px;
  }
  .task-header-text {
    display: inline-block;
    line-height: 40px;
    margin-left: 10px;
    color: #636363;
    font-size: 14px;
  }
  .task-tree {
    font-size: 14px;
    display: inline-block;
  }
  .task-side-box {
    height: calc(100% - 45px);
    overflow-y: auto;
  }
  .task-ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .task-ul {
    padding: 0px 8px 0px 8px;
  }
  .task-li-1 {
    border-color: #57C5FE !important;
    outline-color: #57C5FE;
  }
  .task-li-2 {
    border-color: #ff6f60 !important;
    outline-color: #ff6f60;
  }
  .task-li-3 {
    border-color: #EBB747 !important;
    outline-color: #EBB747;
  }
  .task-li-4 {
    border-color: #1EBBA6 !important;
    outline-color: #1EBBA6;
  }
  .task-form {
    margin-top: 20px;
    padding: 0px 20px;
    overflow: hidden;
  }
  .task-form-left {
    width: 350px;
    float: left;
  }
  .task-form-right {
    float: left;
    margin-left: 50px;
    height: 350px;
    overflow: hidden;
    width: 400px;
  }
  .task-tree-box {
    height: calc(100% - 40px);
    margin-top: 8px;
    overflow-y: auto;
  }
  .task-button-box {
    width: 85px;
    overflow: hidden;
    margin-bottom: 10px;
    text-align: right;
  }
  .task-icon-edit {
    vertical-align: middle;
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('../assets/img/btn-edit.svg') no-repeat;
    background-size: 16px auto;
    cursor: pointer;
  }
  .task-icon-delete {
    vertical-align: middle;
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: 10px;
    background: url('../assets/img/btn-clear.svg') no-repeat;
    background-size: 16px auto;
    cursor: pointer;
  }
</style>
