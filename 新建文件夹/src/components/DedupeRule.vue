<template>
  <Container :title="title">
    <template slot="header"></template>
    <template slot="main">
      <div class="udss-board-body">
        <div class="udss-board-toolbox flex" >
          <input
            class="search-input"
            style="width: 25%"
            placeholder="输入校名关键字"
            v-model="filterText2" />
          <Button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            class="button-add"
            @click="handleAppend">新建规则</Button>
        </div>
        <table class="udss-board-table" >
          <tr>
            <th  align="left" v-if="index === 0" :width="item.width" v-for="(item, index) in tHead">{{item.name}}</th>
            <th style="padding-left: 10px" align="left" v-if="index === 1" :width="item.width" v-for="(item, index) in tHead">{{item.name}}</th>
            <th align="center" v-if="index !== 1 && index !== 0"   :width="item.width" v-for="(item, index) in tHead">{{item.name}}</th>
          </tr>
        </table>
        <div style="height: 630px;overflow: auto">
          <draggable
            id="udss-board-draggable"
            class=""
            v-model="dad"
            element="table"
            :options="dragOptions"
            :move="onMove"
            @start="isDragging=true"
            @end="onEnd"
          >
            <tr style=""  class="active-try" v-for="(item, index) in dad" :key="index">
              <td width="50">
                <div :class="['scheme-order', {'scheme-order-active': index < 5 }]">{{index + 1}}</div>
              </td>
              <td  width="">
                <span>{{item.name}}</span>
              </td>
              <td align="center"  width="">{{item.remark}}</td>
              <td align="center" width="">
                <Popover placement="right"
                         trigger="hover">
                  <h4 style="margin-bottom: 5px">引用指标名称</h4>
                  <div v-if="item.ind.length === 0">暂无引用</div>
                  <div style="padding: 2px 0px 2px 10px" v-if="item.ind.length !== 0" v-for="(data, index) in item.ind">
                    <span>{{data.name}}</span>
                  </div>
                  <Button  class="refIndList" style="display: inline-block;outline: none;border: none" slot="reference">
                    {{item.ind.length}}
                  </Button>

                </Popover>
              </td>
              <td align="center" width="" class="college-icon-edit">
                <i class="el-icon-edit"  @click.stop="handleUpdate(item)"></i>
                <i class="el-icon-delete" v-show="item.ind.length === 0" @click.stop="handleDelete(item.id)"></i>
              </td>
            </tr>
          </draggable>
        </div>
      </div>
      <!--新增-->
      <Dialog
        :close-on-click-modal="false"
        custom-class="Dialog"
        :before-close="handleClose"
        :visible.sync="createVisible"
        top="44px"
        title="新增"
        width="800px"
      >
        <div  class="indRule">
          <div style="overflow: hidden" class="ind-content">
            <div class="indList">
              <div class="indList-name">
                <span>
                  规则名称：
                </span>
                <Input
                  style="width: 79%"
                  clearable
                  size="mini"
                  v-model="dataC.name"
                  placeholder="规则名称" />
              </div>
              <div class="indList-name" style="margin-top: 10px; align-items: flex-start">
                <span>
               规则备注：
              </span>
                <Input
                  type="textarea"
                  v-model="dataC.remark"
                  style="width: 79%"
                  clearable
                  size="mini"
                  placeholder="备注" />
              </div>
              <div class="draggable" >
                <table class="scheme-table-header">
                  <tr class="ind-left-head">
                    <th :width="item.width"   :align="item.align" v-if="index !== 2"  v-for="(item, index) in th" style="height: 30px;font-size: 14px;">{{item.name}}</th>
                    <th :width="item.width"  :align="item.align" v-if="index === 2" v-for="(item, index) in th" style="height: 30px;font-size: 14px;">
                      {{item.name}}
                      <!--<div v-show="isShow" @click="confirmDelete">-->
                        <!--&lt;!&ndash;<div>完成操作</div>&ndash;&gt;-->
                        <!--<i  title="完成删除操作" class="el-icon-check" style=" color: white; margin-left: 10px"></i>-->
                      <!--</div>-->
                      <!--<div v-show="!isShow" class="indDelete" @click="changeDelete">-->
                        <!--&lt;!&ndash;{{item.name}}&ndash;&gt;-->
                        <!--<i style="color: white;margin-left: 10px" class="el-icon-edit"></i>-->
                      <!--</div>-->
                    </th>
                  </tr>
                </table>
                <div class="draggableContainer" >
                  <draggable
                  class="scheme-table-body"
                  element="table"
                  v-model="dataC.dedupeRuleDetails"
                  :options="dragOptions"
                  :move="onMove"
                  @start="isDragging=true"
                  @end="onEnd"
                >
                    <tr class="indDetail"  v-for="(item, index) in dataC.dedupeRuleDetails">
                      <td align="center" width="70" >{{index + 1}}</td>
                      <td align="left" :title="item.name" width="222">{{item.name}}</td>
                      <td align="left" width="50">
                        <i class="el-icon-delete" v-show="!isShow" @click="change(item)"></i>
                      </td>
                    </tr>
                </draggable>
                </div>
              </div>
            </div>
            <div class="ind-right">
              <input style="width: 93%" class="search-input" placeholder="输入关键字进行过滤" v-model="filterText" />
              <div class="ind-right-indList">
                <button @click="changeButton(item, index)" :class="['indList-button', {'is-active': index === isActive}]" v-for="(item, index) in indList">{{item.name}}</button>
              </div>
              <div class="target-tree">
                <Tree
                  :disabled="true"
                  node-key="id"
                  @check-change="handleCheckChange"
                  ref="tree2"
                  :default-expand-all="true"
                  :filter-node-method="filterNode"
                  :check-on-click-node="defCheck"
                  :show-checkbox="isEdit"
                  :props="defaultProps"
                  :data="indList && indList[isActive] && indList[isActive].children ? indList[isActive].children : []"
                >
                  <div class="udss-tree-node one-line" slot-scope="{ node, data }" :title="node.label">
                    {{ node.label }}
                  </div>
                </Tree>
              </div>
            </div>
          </div>
        </div>
        <div class="udss-footer"  slot="footer">
          <div>
            <Button
              type="primary"
              size="small"
              class="button-confirm"
              :loading="isLoading"
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
        </div>
      </Dialog>
      <!--修改-->
      <Dialog
        :modal="moda"
        top="20px"
        width="800px"
        :visible.sync="updateVisible"
        :close-on-click-modal="false"
        :title="$t('college.config')"
      >
        <div  class="indRule">
          <div style="overflow: hidden" class="ind-content">
            <div class="indList">
              <div class="indList-name" >
                <span>
                  规则名称：
                </span>
                <Input
                  style="width: 79%"
                  clearable
                  size="mini"
                  v-model="dataD.name"
                  placeholder="规则名称" />
              </div>
              <div class="indList-name" style="margin-top: 10px; align-items: flex-start">
                <span>
                规则备注：
                </span>
                <Input
                  type="textarea"
                  v-model="dataD.remark"
                  style="width: 79%"
                  clearable
                  size="mini"
                  placeholder="备注" />
              </div>
              <div class="draggable" style="margin-top: 10px">
                <table class="scheme-table-header">
                  <tr class="ind-left-head">
                    <th :width="item.width"   :align="item.align"   v-for="(item, index) in th" style="height: 30px;font-size: 14px;">{{item.name}}</th>
                    <!--<th :width="item.width"  :align="item.align" v-if="index === 2" v-for="(item, index) in th" style="height: 30px;font-size: 14px;">-->
                      <!--<div v-show="isShow" @click="confirmDelete">-->
                        <!--&lt;!&ndash;<div>完成操作</div>&ndash;&gt;-->
                        <!--<i  title="完成删除操作" class="el-icon-check" style="color: white; margin-left: 10px"></i>-->
                      <!--</div>-->
                      <!--<div v-show="!isShow" class="indDelete" @click="changeDelete">-->
                        <!--&lt;!&ndash;{{item.name}}&ndash;&gt;-->
                          <!--<i style="color: white;margin-left: 10px" class="el-icon-edit"></i>-->
                      <!--</div>-->
                    <!--</th>-->
                  </tr>
                </table>
                <div class="draggableContainer">
                  <draggable
                    class="scheme-table-body"
                    element="table"
                    v-model="dataD.dedupeRuleDetails"
                    :options="dragOptions"
                    :move="onMove"
                    @start="isDragging=true"
                    @end="onEnd"
                  >
                      <tr style="" class="indDetail"  v-for="(item, index) in dataD.dedupeRuleDetails">
                        <td align="center" width="70" >{{index + 1}}</td>
                        <td align="left" style="" :title="item.name"  width="222">{{item.name}}</td>
                        <td align="left" width="50">
                            <i class="el-icon-delete" v-show="!isShow" @click="change2(item)"></i>
                        </td>
                      </tr>
                  </draggable>
                </div>
              </div>
            </div>
            <div class="ind-right">
              <input style="width: 93%" class="search-input" placeholder="输入关键字进行过滤" v-model="filterText3" />
              <div class="ind-right-indList">
                <button @click="changeButton(item, index)" :class="['indList-button', {'is-active': index === isActive}]" v-for="(item, index) in indList">{{item.name}}</button>
              </div>
              <div class="target-tree" style="">
                <Tree
                  node-key="id"
                  :default-checked-keys="defaultKey"
                  @check-change="handleCheckChange2"
                  ref="tree"
                  :default-expand-all="true"
                  :filter-node-method="filterNode"
                  :check-on-click-node="defCheck"
                  :show-checkbox="isEdit"
                  :props="defaultProps"
                  :data="indList && indList[isActive] && indList[isActive].children ? indList[isActive].children : []"
                >
                  <div class="udss-tree-node one-line" slot-scope="{ node, data }" :title="node.label">
                    {{ node.label }}
                  </div>
                </Tree>
              </div>
            </div>
          </div>
        </div>
        <div class="udss-footer"  slot="footer">
          <div>
            <Button
              type="primary"
              size="small"
              class="button-confirm"
              :loading="isLoading"
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
        </div>
      </Dialog>
    </template>
  </Container>
</template>

<script>
  import { Container } from './widgets'
  import { mapActions, mapGetters } from 'vuex'
  import { Button, Tree, Input, Radio, Dialog, Message, MessageBox, Popover, Checkbox, CheckboxGroup } from 'element-ui'
  import draggable from 'vuedraggable'
  export default {
    name: 'ManageUser',
    data () {
      return {
        cloneDefaultKey: [],
        isShow: false,
        isActive: 0,
        defaultKey: [],
        isLoading: false,
        updateVisible: false,
        createVisible: false,
        moda: true,
        filterText: '',
        filterText2: '',
        defCheck: true,
        rules: {
          name: [
            { required: true, message: '', trigger: 'change' }
          ]
        },
        title: '',
        dad: [],
        isEdit: true,
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        sort: true,
        th: [
          {name: '优先级', width: '70', align: 'center'},
          {name: '指标名称', width: '222', align: 'left'},
          {name: '', width: '50', align: 'left'}
        ],
        tHead: [
          {name: '', width: '50'},
          {name: '规则名称', width: '362'},
          {name: '备注', width: '372'},
          {name: '引用明细', width: '372'},
          {name: '修改操作', width: '372'}
        ],
        isDragging: false,
        dataC: {},
        dataD: {},
        cloneData: {},
        filterText3: '',
        deleted: []
      }
    },
    components: {
      Container, draggable, Button, Tree, Input, Radio, Dialog, Popover, Checkbox, CheckboxGroup
    },
    computed: {
      ...mapGetters('deduptrule', ['newCreate', 'upCreate', 'dedIndex', 'DetailIndex', 'checkedInds']),
      indList () {
        let arr = []
        arr = this.checkedInds
//        console.log(this.checkedInds)
        return arr
      },
      dataFlatten () {
        return this.flatten(this.checkedInds).filter(item => item.is_leaf === true)
      },
      dragOptions () {
        return {
          animation: 0,
          group: {
            name: 'description',
            pull: 'clone'
          },
          sort: this.sort,
          disabled: !this.sort,
          ghostClass: 'ghost'
        }
      }
    },
    created () {
    },
    methods: {
      ...mapActions('deduptrule', ['getDeduptrule', 'creatDeduptrule', 'deleteDeduptrule', 'getDedupDetail', 'updateDeduptrule', 'updateDeduptruleSort', 'getCheckedInds']),
      changeButton (item, index) {
        this.isActive = index
      },
      handleAppend () {
        this.dataC = {
          name: '',
          remark: '',
          dedupeRuleDetails: []
        }
        this.openCreateDialog()
      },
      resetCreate () {
        this.resetChecked()
      },
      confirmCreate () {
        var reg = /^\s*$/g
        if (reg.test(this.dataC.name) || this.dataC.name.length === 0) {
          Message({
            type: 'warning',
            message: '规则名称不能为空'
          })
        } else if (this.dataC.dedupeRuleDetails.length === 0) {
          Message({
            type: 'warning',
            message: '规则指标不能为空'
          })
        } else {
          this.isLoading = true
          new Promise((resolve, reject) => {
            this.creatDeduptrule({resolve, reject, payload: this.dataC})
          }).then(() => {
            this.isLoading = false
            this.resetCreate()
            this.closeCreateDialog()
          }).catch(() => {
            this.isLoading = false
          })
        }
      },
      openCreateDialog () {
        this.createVisible = true
      },
      closeCreateDialog () {
//        var reg = /^\s*$/g
        if (this.dataC.name.length !== 0 || this.dataC.remark.length !== 0 || this.dataC.dedupeRuleDetails.length !== 0) {
          MessageBox.confirm('文件尚未保存，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.createVisible = false
            this.resetChecked()
//            this.isShow = false
          }).catch(() => {
//            Message({
//              type: 'info',
//              message: '已取消删除'
//            })
          })
        } else {
          this.createVisible = false
          this.resetChecked()
//          this.isShow = false
        }
      },
      closeUpdateDialog () {
        this.updateVisible = false
        this.$refs.tree.setCheckedKeys([])
        this.filterText3 = ''
        this.isActive = 0
//        this.isShow = false
      },
      resetUpdate () {
//        this.isShow = false
        this.dataD = JSON.parse(JSON.stringify(this.cloneData))
        this.$refs.tree.setCheckedKeys(this.cloneDefaultKey)
        this.isActive = 0
      },
      change (val) {
        let i = this.dataC.dedupeRuleDetails.filter(item => {
          if (item.id !== val.id) {
            return item
          }
        })
        this.dataC.dedupeRuleDetails = i
        let arr = i.map(obj => obj.id)
        this.$refs.tree2.setCheckedKeys(arr)
      },
      change2 (val) {
        let i = this.dataD.dedupeRuleDetails.filter(item => {
          if (item.id !== val.id) {
            return item
          }
        })
        this.dataD.dedupeRuleDetails = i
        this.defaultKey = i.map(obj => obj.id)
        this.$refs.tree.setCheckedKeys(this.defaultKey)
      },
      changeDelete () {
//        this.isShow = true
      },
      confirmDelete () {
//        this.isShow = false
      },
      confirmUpdate () {
        this.isLoading = true
        new Promise((resolve, reject) => {
          this.updateDeduptrule({resolve, reject, payload: this.dataD})
        }).then(() => {
          this.isLoading = false
//          this.isShow = false
          this.updateVisible = false
        }).catch(() => {
          this.isLoading = false
        })
      },
      handleDelete (data) {
        MessageBox.confirm('是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            this.deleteDeduptrule({resolve, reject, payload: data})
          }).then((data) => {
            Message({
              type: 'success',
              message: '删除成功!'
            })
            this.dad = this.dad.filter(item => {
              if (item.id !== data) {
                return item
              }
            })
            this.updateVisible = false
          }).catch(() => {
          })
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      flatten (tree) {
        const flatten = function (tree) {
          return tree.reduce((arr, current) => {
            arr.push(current)
            if (current.children && current.children.length) {
              flatten(current.children).forEach(node => {
                arr.push(node)
              })
            }
            return arr
          }, [])
        }
        return flatten(tree)
      },
      handleUpdate (data) {
        new Promise((resolve, reject) => {
          this.getDedupDetail({resolve, reject, payload: data.id})
        }).then((val) => {
          val.dedupeRuleDetails = val.dedupeRuleDetails || []
          var detail = val.dedupeRuleDetails.map(item => {
            return this.dataFlatten.find(child => child.id === item.ind_id)
          })
          val.dedupeRuleDetails = detail
          this.defaultKey = JSON.parse(JSON.stringify(detail.map(item => item.id)))
          this.cloneDefaultKey = JSON.parse(JSON.stringify(detail.map(item => item.id)))
          this.cloneData = val
          this.dataD = JSON.parse(JSON.stringify(val))
          this.updateVisible = true
        }).catch(() => {
        })
      },
      handleClose () {
        this.closeCreateDialog()
      },
      resetChecked () {
        this.$refs.tree2.setCheckedKeys([])
        this.dataC = {
          name: '',
          remark: '',
          dedupeRuleDetails: []
        }
        this.filterText = ''
        this.isActive = 0
      },
      handleCheckChange (data, checked, indeterminate) {
        if (checked) {
          if (data.is_leaf) {
            this.dataC.dedupeRuleDetails.push(data)
          }
        } else {
          if (data.is_leaf) {
            var h = this.dataC.dedupeRuleDetails.indexOf(data)
            if (h > -1) {
              this.dataC.dedupeRuleDetails.splice(h, 1)
            }
          }
        }
      },
      handleCheckChange2 (data, checked, indeterminate) {
        if (checked) {
          if (data.is_leaf) {
            var l = this.dataD.dedupeRuleDetails.findIndex(item => {
              return item.id === data.id
            })
            if (l > -1) {
              this.dataD.dedupeRuleDetails.push()
            } else {
              this.dataD.dedupeRuleDetails.push(data)
            }
          }
        } else {
          if (data.is_leaf) {
            var h = this.dataD.dedupeRuleDetails.findIndex(item => item.id === data.id)
            if (h > -1) {
              this.dataD.dedupeRuleDetails.splice(h, 1)
            }
          }
        }
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      onMove () {},
      onEnd () {}
    },
    mounted () {
      new Promise((resolve, reject) => {
        this.getDeduptrule({resolve, reject})
      }).then((data) => {
        data.forEach(item => {
          item.ind = item.ind || []
        })
        this.dad = data
      }).catch(() => {
      })
      this.getCheckedInds()
    },
    watch: {
      filterText3 (val) {
        this.$refs.tree.filter(val)
      },
      filterText (val) {
        this.$refs.tree2.filter(val)
      },
      filterText2 (val) {
        if (val) {
          this.dad = this.dad.filter(node => {
            return node.name.toLowerCase().indexOf(val.toLowerCase()) !== -1
          })
        } else {
          this.dad = this.dedIndex
        }
      },
      newCreate () {
        console.log(this.newCreate)
        this.dad.push(this.newCreate)
      },
      upCreate () {
//        console.log(this.upCreate)
        this.upCreate.ind = this.upCreate.ind || []
        let index = this.dad.findIndex(item => item.id === this.upCreate.id)
        this.dad.splice(index, 1, this.upCreate)
        console.log(this.dad)
      }
    },
    beforeDestroy () {
      if (this.dad.length > 0) {
        let payload = this.dad.map((item, index) => {
          return {id: item.id, order_no: index + 1}
        })
        this.updateDeduptruleSort(payload)
      }
    }
  }
</script>

<style scoped>
  .udss-board-body{
    height: 100%;
    overflow: hidden;
  }
  .search-input {
    border-radius: 4px;
    height: 34px;
    padding: 0 10px;
    border: solid 1px #D7D7D7;
    outline: none;
    line-height: 34px;
    text-indent: 10px;
    background: url('../assets/img/search.png') no-repeat;
    background-position: top 7px right 20px;
  }
  #udss-board-draggable{
    font-size:14px;
    overflow: hidden;
    overflow-y: scroll;
    color: #606266;
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }
.udss-board-table{
  width:100%;
  margin-top: 15px;
  height:40px;
  border-collapse: collapse;
  font-size:14px;
}
.button-add{
  margin-left: 10px;
  border-radius: 2px;
}
.udss-board-table tr {
  background: #1EBBA6;
  color: whitesmoke;
}
  .scheme-order{
    width: 30px;
    height: 30px;
    border: solid 1px #DBDBDB;
    text-align: center;
    line-height: 30px;
    border-radius: 3px;
    margin-left: 10px;
    /*margin-right: 10px;*/
  }
  .scheme-order-active{
    color: #ffffff;
    border: solid 1px #D99C55;
    background-color: #E3AD5A;
    background-image: -moz-linear-gradient(top, #EAB649, #DEA568);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #EAB649), color-stop(1,#DEA568));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EAB649', endColorstr='#DEA568', GradientType =0);
  }
  .flex{
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
  }
  .draggableContainer{
    height: calc(100% - 10px);overflow:hidden;overflow-y: scroll
  }
  .indRule{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .draggable{
    margin-top: 10px;
    height: 82%;
    font-size:14px;
  }
  .indList{
    height: 100%;
    width: 45%;
    float: left;
  }
  .ind-content{
    padding: 10px 20px 0 20px;
    height: 700px;
  }
  .target-tree{
    height: calc(100% - 50px);
    font-size:14px;
    overflow: hidden;
    overflow-y: scroll
  }
  .scheme-table-body{
    /*overflow: hidden;*/
    overflow: auto;
    color: #606266;
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }
  .scheme-table-body td, #udss-board-draggable td{
    /*height: 40px;*/
    border-bottom: solid 1px #EBEEF5;
    word-break: break-all;
  }
  .scheme-table-body td:nth-child(2) {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .scheme-table-body{
    line-height: 32px;
  }
  #udss-board-draggable{
    line-height: 50px;
  }
  .scheme-table-body tr:nth-child(even), #udss-board-draggable tr:nth-child(even) {
    /*background-color: #F7F7F7;*/
  }
  .indList-name{
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    align-items: center;
  }
  .indDetail{
    margin: 5px 0;
  }

  .scheme-table-header{
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }
  .indDelete{
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
  }
  .college-icon-edit{
  }
  .el-icon-delete, .el-icon-edit, .el-icon-check{
    color: #409EFF;
    font-size:16px;
    cursor: pointer;
  }
  .el-icon-delete{
    margin-left: 10px;
  }
  .ind-left-head{
    width: 100%;
    background-color: #1ebba6;
    height: 40px;
    font-size: 14px;
    color: #fff;
    line-height: 40px;
  }
  .ind-right{
    float: right;
    width: 50%;
    height: 100%;
  }
  .ind-right-indList{
    margin-top: 10px;
    width: 100%;
    display: flex;
    flex-flow: row;
    justify-content: space-around;
  }
  .indList-button{
    cursor: pointer;
    color: #767474;
    outline: none;
    border: none;
    padding: 5px 13px;
    background:  -webkit-gradient(linear, left top, left bottom, color-stop(0, #F5F5F5), color-stop(1,#D8D8D8));
  }
 .is-active {
    color: #ffffff;
    background-image: -moz-linear-gradient(top, #EBB747, #DBA26F);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #EBB747), color-stop(1,#DBA26F));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EBB747', endColorstr='#DBA26F', GradientType =0);
  }
  .udss-tree-node {
    line-height: 40px;
    display: inline-block;
    padding-right: 2px;
    overflow: hidden;
  }
  .udss-footer{
    /*padding: 10px 20px 20px 20px;*/
    display: flex;
    flex-flow: row;
    justify-content: flex-end
  }
</style>
