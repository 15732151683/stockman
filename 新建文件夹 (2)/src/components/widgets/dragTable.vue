<template>
  <div class="scheme-table" @click="handleHidden">
    <table class="scheme-table-header">
      <tr>
        <th width="50"></th>
        <template v-for="(th, index) in tableTh">
          <th :width="th.width" :key="index" v-if="th.name === '状态'">
            <div class="table-type-sort" @click.stop="changePublish">{{th.name}} <i class="el-icon-arrow-down"></i>
              <div class="table-type-filter" :style="{display: publishStatus ? 'block' : 'none'}">
                <CheckboxGroup v-model="checkPublishList">
                  <div><Checkbox :label="true">已发布</Checkbox></div>
                  <div><Checkbox :label="false">未发布</Checkbox></div>
                </CheckboxGroup>
                <div class="table-filter-line"></div>
                <div class="table-filter-confirm" @click.stop="handleFilterPublish">筛选</div>
              </div>
            </div>
          </th>
          <th :width="th.width" :key="index" v-else-if="th.name === '创建人'">
            <div class="table-type-sort" @click.stop="changeOwner">{{th.name}} <i class="el-icon-arrow-down"></i>
              <div class="table-type-filter" :style="{display: createdStatus ? 'block' : 'none'}">
                <CheckboxGroup v-model="checkOwnerList">
                  <div><Checkbox :label="true">自己</Checkbox></div>
                  <div><Checkbox :label="false">其他人</Checkbox></div>
                </CheckboxGroup>
                <div class="table-filter-line"></div>
                <div class="table-filter-confirm" @click.stop="handleFilterOwner">筛选</div>
              </div>
            </div>
          </th>
          <th :width="th.width" :key="index" v-else>{{th.name}}</th>
        </template>
        <!--<th width="60"></th>-->
      </tr>
    </table>
    <div class="scheme-table-body-box">
      <draggable
        class="scheme-table-body"
        element="table"
        v-model="cloneLists"
        :options="dragOptions"
        :move="onMove"
        @start="isDragging=true"
        @end="onEnd">
        <tr v-for="(element, index) in cloneLists" :key="element.id">
          <td width="50">
            <div :class="['scheme-order', {'scheme-order-active': index < element.top_count }]">{{index + 1}}</div>
          </td>
          <template v-for="(td, idx) in tableTd">
            <td v-if="idx === 0" :key="idx" :width="td.width">
              {{element[td.name]}}
            </td>
            <td v-else-if="td.name === 'created_user'" :key="idx" :width="td.width">
              <div class="scheme-name" v-if="element.login_is_created">
                <!--<img src="../../assets/img/ower.png" alt="1">-->
              </div>
              <div class="scheme-name" v-else>
                {{element[td.name].user_name}}
              </div>
            </td>
            <td v-else-if="td.name === 'is_published'" :key="idx" :width="td.width">
              <div class="mySwitch" v-if="element.login_is_created">
                <div class="mySwitch-cover" @click="handleChangeSwitch(element)"></div>
                <Switchs
                  style="display: block"
                  v-model="element.is_published"
                  active-color="#1EBBA6"
                  inactive-color="#D3D4D6"
                  active-text="已发布"
                  inactive-text="未发布">
                </Switchs>
              </div>
              <!--<div v-if="element.is_published" style="color: #1EBBA6;">已发布</div>-->
              <div v-else style="color: #1EBBA6;">已发布</div>
            </td>
            <td  v-else :key="idx" :width="td.width">
              <span class="remark">{{element[td.name]}}</span>
            </td>
          </template>
          <td align="center" width="80" v-if="element.is_published">
            <Button @click="handleEdit(element)" class="operator-button" size="small" type="text"><i class="el-icon-view"></i></Button>
          </td>
          <td align="center" width="80" v-else>
            <Button @click="handleEdit(element)" class="operator-button" size="small" type="text"><i class="el-icon-edit"></i></Button>
            <Button v-hasPermission="'w'" @click="handleDelete(element)" class="operator-button" type="text" size="small"><i class="el-icon-delete"></i></Button>
          </td>
          <!--<td align="center" width="60">-->
          <!--</td>-->
        </tr>
      </draggable>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import { Button, Switch, MessageBox, Message, CheckboxGroup, Checkbox } from 'element-ui'
  export default {
    name: 'dragTable',
    props: {
      lists: {
        require: true
      },
      dragStatus: {
        default: true
      },
      tableTh: {
        require: true
      },
      tableTd: {
        require: true
      }
    },
    components: {
      draggable, Button, Switchs: Switch, MessageBox, Message, CheckboxGroup, Checkbox
    },
    data () {
      return {
        editable: true,
        isDragging: false,
        cloneLists: [],
        checkPublishList: [],
        checkOwnerList: [],
        publishStatus: false,
        createdStatus: false,
        filterStatus: false
      }
    },
    mounted () {
      this.cloneLists = this.lists
    },
    methods: {
      // 拖拽
      onEnd (options) {
        let prev = options.oldIndex
        let next = options.newIndex
        let arg = {prev: prev, next: next}
        this.$emit('dragChange', arg)
      },
      onMove ({relatedContext, draggedContext}) {
        return true
      },
      handleEdit (row) {
        this.$emit('triggerEdit', row)
      },
      handleDelete (row) {
        this.$emit('triggerDelete', row)
      },
      handleChangeSwitch (row) {
        if (row.is_published) {
          MessageBox.confirm('取消发布后其他人不可见，确定取消发布？', '提示', {
            type: 'warning'
          }).then(() => {
            this.$emit('triggerSwitch', row)
          }).catch(() => {
          })
        } else {
          MessageBox.confirm('发布后其他人可见，确定发布？', '提示', {
            type: 'warning'
          }).then(() => {
            this.$emit('triggerSwitch', row)
          }).catch(() => {
          })
        }
      },
      filterMethod () {
        let arr = []
        if (this.checkPublishList.length > 0) {
          arr = this.lists.filter(node => {
            return this.checkPublishList.findIndex(item => item === node.is_published) > -1
          })
        } else {
          arr = this.lists
        }
        if (this.checkOwnerList.length > 0) {
          arr = arr.filter(node => {
            return this.checkOwnerList.findIndex(item => item === node.login_is_created) > -1
          })
        }
        this.cloneLists = arr
        if (this.checkOwnerList.length === 0 && this.checkPublishList.length === 0) {
          this.filterStatus = false
        } else {
          this.filterStatus = true
        }
      },
      handleFilterPublish () {
        this.publishStatus = false
        this.filterMethod()
      },
      changePublish () {
        this.publishStatus = !this.publishStatus
      },
      handleFilterOwner () {
        this.createdStatus = false
        this.filterMethod()
      },
      changeOwner () {
        this.createdStatus = !this.createdStatus
      },
      handleHidden () {
        this.createdStatus = false
        this.publishStatus = false
      }
    },
    watch: {
      lists () {
        this.cloneLists = this.lists
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
          disabled: !this.dragStatus || this.filterStatus,
          ghostClass: 'ghost'
        }
      }
    }
  }
</script>

<style scoped>
  .scheme-table{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .scheme-order{
    width: 30px;
    height: 30px;
    border: solid 1px #DBDBDB;
    text-align: center;
    line-height: 30px;
    border-radius: 3px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .scheme-order-active{
    color: #ffffff;
    border: solid 1px #D99C55;
    background-color: #E3AD5A;
    background-image: -moz-linear-gradient(top, #EAB649, #DEA568);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #EAB649), color-stop(1,#DEA568));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EAB649', endColorstr='#DEA568', GradientType =0);
  }
  .scheme-name{
    overflow: hidden;
    width: auto;
  }
  .scheme-name img {
    display: inline-block;
    margin-top: 7px;
  }
  .operator-button{
    color: #9B9B9B;
    font-size: 16px;
  }
  .scheme-table-header{
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }
  .scheme-table-header tr th:nth-child(2) {
    padding-left: 0px;
    text-align: left;
  }
  .scheme-table-body-box{
    height: calc(100% - 50px);
    overflow: hidden;
    overflow-y: auto;
  }
  .scheme-table-body{
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }
  .scheme-table-header th{
    height: 50px;
    background-color: #1EBBA6;
    color: #ffffff;
  }
  .scheme-table-body td{
    height: 50px;
    border-bottom: solid 1px #EBEEF5;
    color: #606266;
    text-align: center;
    word-break: break-all;
  }
  .scheme-table-body td span{
    display: inline-block;
    text-align: left;
  }
  .scheme-table-body tr:nth-child(even) {
    background-color: #F7F7F7;
  }
  .scheme-table-body tr td:nth-child(2) {
    text-align: left;
  }
  .mySwitch {
    display: inline-block;
    position: relative;
  }
  .mySwitch-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 999;
    cursor: pointer;
  }
  .table-type-sort {
    position: relative;
    cursor: pointer;
    display: inline-block;
  }
  .table-type-filter {
    text-align: left;
    position: absolute;
    border: 1px solid #ebeef5;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-sizing: border-box;
    margin: 2px 0;
    padding: 15px;
    z-index: 1000;
    color: black;
  }
  .table-filter-line {
    width: 100%;
    border-top: solid 1px #EBEEF5;
    margin: 4px 0;
  }
  .table-filter-confirm {
    cursor: pointer;
    color: #606266;
    margin-top: 10px;
    text-align: center;
  }
</style>
