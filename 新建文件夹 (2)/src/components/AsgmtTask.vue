<template>
  <Container :title="title" :showDownload="[false, false, false]">
    <template slot="header"></template>
    <template slot="main">
      <div class="task-header">
        <TaskSearch @getTask="getTaskList">
        </TaskSearch>
      </div>
      <div class="task-container">
        <div class="task-container-left">
          <ul class="task-ul" v-if="showList">
            <template v-for="(item, index) in tasks">
              <TaskLi :key="index" :currentTask="currentTask" :item="item" :taskNodes="taskNodes" @handleDetail="handleIndex(item)">
                <div slot="aside">
                  <Button
                    v-if="item.terminated_at"
                    type="primary"
                    size="mini"
                    class="button-add"
                    style="float: none; background-color: #E58B6F; border-radius: 3px; color: #FFFFFF;">
                    已终止
                  </Button>
                  <Button
                    v-else-if="item.task_node.id === 2"
                    type="primary"
                    size="mini"
                    class="button-add"
                    style="float: none; background-color: #1EBBA6; border-radius: 3px; color: #FFFFFF;"
                    @click.stop="handleAssign(item)">任务指派</Button>
                  <Button
                    v-else-if="!item.finished_at"
                    type="primary"
                    size="mini"
                    class="button-add"
                    style="float: none; background-color: #EBB747; border-radius: 3px; color: #FFFFFF;"
                    @click.stop="handleAssign(item)">
                    重新指派
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
      <!--指派dialog-->
      <Dialog class="task-new"
              :modal="moda"
              top="20px"
              width="1000px"
              height="600px"
              :visible.sync="assignVisible"
              title="任务指派">
        <div class="taskContainer">
          <!--左边-->
          <div class="task-left">
            <div>
              <div class="task-person"><strong>指派人员</strong></div>
              <ul class="task-left-content">
                <li class="task-left-content-li" v-for="(item, index) in deptUsers">
                    <span @click="changeLabel(item, index)" :class="{'actives': item.user_id === checkedPeople}">
                      {{item.user_name}}
                    </span>
                </li>
              </ul>
            </div>
            <div style="margin-right:10px ;">
              <div style="width: 80px">
                <span class="task-Assignment"><strong>指派指标</strong></span>
              </div>
              <!--input-->
              <div style="margin-top: 15px;">
                <Input size="mini" v-model="filterText" placeholder="输入关键字进行过滤" style="width: 380px" type="text"
                       suffix-icon="el-icon-search"/>
              </div>
              <!--tree-->
              <div class="assignmentTree">
                <div class="assignmentTree-container">
                  <div style="text-align: right">
                    <span>全选/清空</span>
                    <Checkbox class="assignment-checkBox" :indeterminate="checkOn" v-model="checkAll" @change="handleCheckAllChange"
                    ></Checkbox>
                  </div>
                </div>
                <div class="treeContainer">
                  <Tree
                    node-key="id"
                    @check-change="handleCheckChange"
                    ref="tree2"
                    :default-expand-all="true"
                    :filter-node-method="filterNode"
                    :check-on-click-node="defCheck"
                    show-checkbox
                    :props="defaultProps"
                    :data="cloneNodeTree"
                  >
                    <div class="udss-tree-node one-line" slot-scope="{ node, data }" :title="node.label">
                      {{ node.label }}
                    </div>
                  </Tree>
                </div>
              </div>
            </div>
          </div>
          <!--右边-->
          <div class="task-right">
            <div style="text-align: left">
              <span><strong>指派结果&nbsp;&nbsp;({{checkedLength}}/{{totalCount.length}})</strong></span>
            </div>
            <div class="task-right-result">
              <div class="task-right-ul" v-for="item in detailList">
                <h4 style="text-align: left; padding: 5px 0">{{item.user.user_name}}&nbsp;&nbsp;({{item.detail.length}}/{{totalCount.length}})</h4>
                <ul class="task-right-ul-detail">
                  <li v-for="obj in item.detail">{{obj.name}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div style="text-align: center" slot="footer">
          <Button
            v-if="this.currentTask.task_node.id === 2"
            style="background: #1EBAA6;border: none"
            type="primary"
            size="medium"
            class="button-delete"
            :loading="assignLoading"
            @click="confirmAssign">
            保存
          </Button>
          <Button
            style="background: #EAB747;border: none"
            type="warning"
            size="medium"
            class="button-delete"
            :loading="publishLoading"
            @click="confirmPublish">
            发布
          </Button>
        </div>
      </Dialog>
    </template>
  </Container>
</template>

<script>
  import { Container, TaskLi, TaskSearch, TaskPage } from './widgets'
  import { Button, Select, Option, Tree, Dialog, Input, MessageBox, Message, CheckboxGroup, Checkbox } from 'element-ui'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'Allocation',
    components: {
      Container, TaskLi, Button, Select, Option, Tree, Dialog, Input, MessageBox, Message, CheckboxGroup, Checkbox, TaskSearch, TaskPage
    },
    data () {
      return {
        title: '任务分派',
        currentTask: {
          task_node: {}
        },
        showList: false,
        assignVisible: false,
        assignLoading: false,
        publishLoading: false,
        nodeTree: [],
        checkedPeople: '',
        filterText: '',
        checkAll: false,
        checkOn: false,
        defCheck: true,
        defaultProps: {
          label: 'name'
        },
        moda: true,
        totalCount: 0,
        cloneNodeTree: [],
        allAssignIds: [],
        flattenTree: [],
        flattenCloneTree: [],
        detailList: []
      }
    },
    created () {
      this.setTask([])
      this.setPageInfo({page: 1, size: 10})
      this.setSearchCondition({})
    },
    mounted () {
      this.getTaskList()
      this.getTarget()
      this.getDeptUser()
      let timer = setInterval(() => {
        if (this.tasks.length > 0 && this.taskNodes.length > 0) {
          this.currentTask = this.tasks[0]
          this.showList = true
          clearInterval(timer)
        }
      }, 10)
    },
    computed: {
      ...mapGetters('asgmtTask', ['deptUsers', 'taskDetail']),
      ...mapGetters('task', ['tasks', 'targets', 'taskNodes']),
      checkedLength () {
        let len = 0
        this.detailList.forEach(node => {
          len += node.detail.length
        })
        return len
      }
    },
    methods: {
      ...mapActions('asgmtTask', ['getDeptUser', 'getTaskDetail', 'updateTaskDetail', 'publishTask']),
      ...mapActions('task', ['getTask', 'getTarget']),
      ...mapMutations('task', ['setPageInfo', 'setSearchCondition', 'setTask']),
      // 根据id过滤符合节点树结构
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
      // 获取任务包含的指标树结构
      getNodeTree (nodes) {
        let cloneTree = this.clone(this.targets)
        this.nodeTree = this.filterTree(cloneTree, nodes)
        this.flattenTree = this.flatten(this.nodeTree)
      },
      // 获取每个人员可选择的指标树结构
      getCloneNodeTree (nodes) {
        let cloneTree = this.clone(this.nodeTree)
        this.cloneNodeTree = this.filterTree(cloneTree, nodes)
        this.flattenCloneTree = this.flatten(this.cloneNodeTree)
      },
      clone (data) {
        return JSON.parse(JSON.stringify(data))
      },
      // 点击当前任务
      handleIndex (data) {
        this.currentTask = data
      },
      // 点击分配任务事件
      handleAssign (data) {
        this.currentTask = data
        this.getNodeTree(data.ind_ids)
        this.totalCount = data.ind_ids
        new Promise((resolve, reject) => {
          this.getTaskDetail({resolve, reject, id: data.id})
        }).then((detail) => {
          this.allAssignIds = detail.map(node => {
            return {
              id: node.input_user_id,
              data: node.ind_ids.split(',').map(id => id * 1)
            }
          })
          this.checkedPeople = this.deptUsers[0].user_id
          this.handleChangeTree(this.checkedPeople)
          this.initDetailList()
        }).catch(() => {})
        this.assignVisible = true
      },
      confirmAssign () {
        this.handleAssignData()
        let payload = {}
        payload.id = this.currentTask.id
        payload.dispatch = false
        payload.remark = ''
        payload.subTasks = this.allAssignIds.map(node => {
          return {
            input_user_id: node.id,
            ind_ids: node.data.join(',')
          }
        }).filter(item => {
          if (item.ind_ids !== '') {
            return item
          }
        })
        new Promise((resolve, reject) => {
          this.assignLoading = true
          this.updateTaskDetail({resolve, reject, payload})
        }).then(() => {
          this.assignLoading = false
        }).catch(() => {
          this.assignLoading = false
        })
        // this.assignVisible = false
      },
      // 发布状态
      confirmPublish () {
        this.handleAssignData()
        let payload = {}
        payload.id = this.currentTask.id
        payload.dispatch = true
        payload.remark = ''
        payload.subTasks = this.allAssignIds.map(node => {
          return {
            input_user_id: node.id,
            ind_ids: node.data.join(',')
          }
        }).filter(item => {
          if (item.ind_ids !== '') {
            return item
          }
        })
        new Promise((resolve, reject) => {
          this.publishLoading = true
          this.publishTask({resolve, reject, payload})
        }).then((res) => {
          this.tasks.find(node => node.id === res.id).task_node = res.data
          this.publishLoading = false
          this.assignVisible = false
        }).catch(() => {
          this.publishLoading = false
        })
      },
      // tree降维
      flatten (tree) {
        return tree.reduce((arr, current) => {
          arr.push(current)
          if (current.children && current.children.length) {
            this.flatten(current.children).forEach(node => {
              arr.push(node)
            })
          }
          return arr
        }, [])
      },
      // checkbox改变触发事件
      handleCheckChange (data, checked, indeterminate) {
        let node = this.$refs.tree2.getCheckedNodes(true)
        // 处理侧栏显示人员选中指标
        let index = this.detailList.findIndex(node => node.user.user_id === this.checkedPeople)
        if (index > -1) {
          this.detailList[index].detail = node
        } else {
          let user = this.deptUsers.find(node => node.user_id === this.checkedPeople)
          this.detailList.push({user: user, detail: node})
        }
        let te = this.flattenCloneTree.filter(item => {
          if (!item.children) {
            return item.id
          }
        }).map(obj => {
          return obj.id
        })
        this.checkAll = te.length === node.length
        this.checkOn = node.length > 0 && node.length < te.length
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      // 全选按钮
      handleCheckAllChange (data) {
        let arr = []
        if (data === false) {
          this.setCheckedKeys(arr)
        } else {
          arr = this.flatten(this.cloneNodeTree).map(item => item.id)
          this.setCheckedKeys(arr)
        }
      },
      setCheckedKeys (arr) {
        this.$refs.tree2.setCheckedKeys(arr)
      },
      // 改变选择人员
      changeLabel (item) {
        this.handleAssignData()
        this.handleChangeTree(item.user_id)
        this.checkedPeople = item.user_id
      },
      // 处理改变人员前选择的数据
      handleAssignData () {
        let assignIds = this.$refs.tree2.getCheckedKeys(true)
        let index = this.allAssignIds.findIndex(node => node.id === this.checkedPeople)
        if (index < 0) {
          this.allAssignIds.push({
            id: this.checkedPeople,
            data: assignIds
          })
        } else {
          this.allAssignIds[index].data = assignIds
        }
      },
      // 点击人员初始化数据结构信息
      handleChangeTree (id) {
        let ids = []
        this.allAssignIds.filter(node => node.id !== id).forEach(node => {
          ids.push(...node.data)
        })
        let filterIds = this.totalCount.filter(node => ids.indexOf(node) < 0)
        this.getCloneNodeTree(filterIds)
        let arr = this.allAssignIds.filter(node => node.id === id)
        arr = arr.length > 0 ? arr[0].data : []
        setTimeout(() => {
          this.setCheckedKeys(arr)
        }, 10)
      },
      initDetailList () {
        this.detailList = this.allAssignIds.map(node => {
          let user = this.deptUsers.find(user => user.user_id === node.id)
          let arr = this.flattenTree.filter(child => node.data.indexOf(child.id) > -1)
          return {
            user: user,
            detail: arr
          }
        })
      },
      getTaskList () {
        this.$refs.taskPage.handleFilterTask()
      }
    },
    watch: {
      filterText (val) {
        this.$refs.tree2.filter(val)
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
  .task-header-text {
    display: inline-block;
    line-height: 40px;
    margin-left: 10px;
    color: #636363;
    font-size: 14px;
  }
  .task-ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .task-ul {
    padding: 0px 8px 0px 8px;
  }
  .taskContainer{
    border-bottom: 1px solid #E4E4E4;
    display: flex;flex-flow: row;
    justify-content: space-between
  }
  .task-left{
    margin:0 0 20px 0;
    width: 60%;
    display: flex;
    flex-flow: row;
    justify-content: space-around;
    border-right: 1px solid #DADADA;
    float: left
  }
  .task-left-content{
    font-size: 14px;
    text-align: left;
    display: flex;
    flex-flow: column;
    justify-content: flex-start
  }
  .task-left-content-li{
    margin-top: 10px;
  }
  .task-person{
    text-align: left;
    margin-bottom: 5px;
    color: #4A494A;
  }
  .task-Assignment{
    color: #4A494A;
    text-align: left;
  }
  .assignmentTree-container{
    margin-top: 10px;
    text-align: left;
    overflow: hidden
  }
  .assignment-checkBox{
    padding: 10px 16px 10px 15px;
  }
  .task-left-content-li span {
    display: block;
    width: 80px;
    padding: 5px 2px;
    border: solid 1px #E9E9E9;
    text-align: center;
    overflow: hidden;
  }
  .treeContainer{
    height: 300px;
    width: 380px;
    font-size:14px;
    overflow: hidden;
    overflow-y: scroll;
    border-collapse: collapse
  }
  .task-right-result{
    margin-top: 10px;
    height: 390px;
    overflow: hidden;
    overflow-y: auto;
  }
  .actives{
    background: #498FE1;
    border-color: #498FE1;
    color: white;
  }
  .task-right{
    width: 40%;
    margin:0 0 20px 0;
    padding: 0 20px
  }
  .task-right-ul{
    border-bottom: 1px solid #DADADA;
    padding-bottom: 5px;
    list-style: disc;
  }
  .task-right-ul li {
    list-style-type: disc;
    margin-left: 20px;
    margin-top: 8px;
    color: #ACACAC;
  }
  .task-right-ul-detail{
    padding:0 0 20px 0;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
  }
  .task-left-content>ul {
    list-style: none;
    padding: 0;
  }
  .task-left-content li {
    list-style: none;
    padding: 0;
  }
</style>
