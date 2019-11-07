<template>
  <div style="width: 100%; height: 100%;">
    <div class="udss-board-top">
      <input
        class="search-input"
        :placeholder="$t('element.filterText')"
        v-model="filterText" />
      <Button
        v-if="!passVisible"
        type="primary"
        size="mini"
        style="margin-left: 20px; background-color: #1EBBA6;"
        class="button-add"
        @click="handlePass">审核通过</Button>
      <!--<Button
        v-if="passVisible"
        type="primary"
        size="mini"
        style="margin-left: 20px; background-color: #1EBBA6;"
        class="button-add"
        @click="handleCancelPass">取消审核通过</Button>-->
      <Button
        v-if="!passVisible"
        type="primary"
        size="mini"
        style="float: none"
        class="button-add operator-button"
        @click="handleReject">批回重录</Button>
      <Button
        type="primary"
        size="mini"
        style="margin-left: 20px; background-color: #4A90E2; float: right;"
        class="button-add"
        @click="handleReturn">返回</Button>
      <Button
        v-if="!passVisible"
        type="primary"
        size="mini"
        style="margin-left: 20px; background-color: #1EBBA6; float: right;"
        class="button-add"
        @click="handleSave">保存</Button>
    </div>
    <div class="udss-board-body">
      <div class="select-wrapper">
        <div class="tab-change">
          <button :class="['tab-button', {'is-actives': activeTab === 1}]" @click="activeTab = 1">院系</button>
          <button :class="['tab-button', {'is-actives': activeTab === 2}]" @click="activeTab = 2">备注历史</button>
        </div>
        <div class="tab-container" v-show="activeTab === 1">
          <div class="select-table">
            <ul>
              <li v-for="org in selectOrg" :key="org.id">
                <Radio :label="org.id" v-model="radio" @change="handleRadioChange(org)">
                  <span :class="[{'is-mark-line': org.mark}]" style="font-size: 12px;">
                  {{org.name}}
                  </span>
                </Radio>
              </li>
            </ul>
          </div>
        </div>
        <div class="tab-container" v-show="activeTab === 2">
          <LogList :logList="taskLog"></LogList>
        </div>
      </div>
      <div class="udss-board-toolbox">
        <div class="main-box-top">
          <span><strong>备注：</strong></span>
          <div style="flex: 1;">
            <Input
              type="textarea"
              :rows="2"
              size="mini"
              placeholder="备注信息"
              v-model="taskRemark" />
          </div>
        </div>
        <div id="loadings" class="target-tree">
          <div :style="{minWidth: currentOrg.id ? changeWidth : '100%'}" class="tree-header-box">
            <div class="tree-header" style="width: 100%;" id="tree-header-fixed">
              <div class="tree-header-right">
                <span v-for="(year, index) in yearRange" :key="index"><strong>{{year}}</strong></span>
              </div>
              <div class="tree-header-left"><strong>{{$t('writeInd.indicator')}}</strong></div>
              <!--<div class="tree-header-right"><strong>{{$t('writeInd.value')}}</strong></div>-->
            </div>
          </div>
          <div class="target-tree-box" :style="{minWidth: currentOrg.id ? changeWidth : '100%'}">
            <Tree
              :data="nodeTree"
              :expand-on-click-node="true"
              default-expand-all
              :props="defaultProps"
              node-key="id"
              :filter-node-method="filterNode"
              ref="tree">
              <div class="udss-tree-node" slot-scope="{ node, data }">
                <div class="udss-tree-body" v-show="data.is_leaf">
                  <div class="udss-tree-child" v-for="(value, index) in data.val" :key="index">
                    <template v-if="index === 0">
                        <span class="totalStyle">
                          <template v-if="data.unit.id === 10 || data.unit.id === 23">
                            &nbsp;
                          </template>
                          <template v-else>
                            {{value.ind_val}}
                          </template>
                        </span>
                    </template>
                    <template v-else>
                      <div>&nbsp;
                        <span :title="value.text" v-if="!passVisible || currentTask.own_org_checked === 2" :class="['left-icon', {'error-img': value.mark}]" @click="handleIconReMark(value)">
                        &nbsp;
                        </span>
                        <span
                          v-if="!passVisible && value.ind_val"
                          @click="handleRemark(value)"
                          :class="['label-center-box', {'redRemark': data.has_detail && !value.is_full},  {'label-center-error': value.mark}]" :style="{color: value.ind_val * 1 === 0 ? '#CECECE' : '#000000'}">
                            <template v-if="data.unit.id === 10 && value.ind_val !== ''">
                              {{precisionPercentNum(value.ind_val, data)}}
                            </template>
                            <template v-else>
                              {{value.ind_val}}
                            </template>
                        </span>
                        <span
                          v-else
                          :class="['label-center-span', {'redRemark': data.has_detail && !value.is_full}]" :style="{color: value.ind_val * 1 === 0 ? '#CECECE' : '#000000'}">
                            <template v-if="data.unit.id === 10 && value.ind_val !== ''">
                              {{precisionPercentNum(value.ind_val, data)}}
                            </template>
                            <template v-else>
                              {{value.ind_val}}
                            </template>
                        </span>
                        <i @click="handleDetail(data, value)"
                          class="menu-icon"
                          v-if="data.has_detail"
                          v-show="value.ind_val">
                        </i>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="udss-tree-label one-line">
                  <div class="udss-tree-label one-line">
                    <span v-if="data.unit.id === 0" class="udss-tree-text" :title="node.label">
                      {{ node.label }}
                    </span>
                    <span v-else  class="udss-tree-text" :title="node.label + ' (' + data.unit.name + ')'">
                      {{ node.label }}&nbsp;({{data.unit.name}})
                    </span>
                  </div>
                </div>
              </div>
            </Tree>
          </div>
        </div>
      </div>
      <!--备注弹框-->
      <Dialog
        width="400px"
        :visible.sync="remarkVisible"
        :show-close="false"
        title="备注"
        :close-on-click-modal="true">
        <div class="remark-body">
          <Input
            type="textarea"
            :rows="4"
            placeholder="请输入备注"
            v-model="errorRemark" />
        </div>
        <div class="remark-footer">
          <Button
            v-if="!passVisible"
            type="primary"
            size="mini"
            class="button-add"
            @click="confirmIconRemark">保存</Button>
          <Button
            v-if="!passVisible"
            type="primary"
            size="mini"
            style="float: right;"
            class="button-add"
            @click="cancelIconRemark">取消</Button>
        </div>
      </Dialog>
      <Detail
        ref="detailDialog"
        :currentCollege="currentOrg"
        :currentData="currentData"
        :orgData="selectOrg"
        :onlyRead="onlyRead"
        :currentInd = "currentInd">
      </Detail>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Input, Button, Select, Option, Tree, Dialog, Table, TableColumn, Radio, MessageBox, Message } from 'element-ui'
  import { TogglePage, StandTree } from '@/mixins'
  import { Container, PickerDate, LogList } from '../../widgets'
  import Detail from '../write/detail.vue'
  export default {
    name: 'CheckTask',
    components: {
      Container, LogList, Input, Button, Select, Option, Dialog, Table, TableColumn, Radio, Tree, MessageBox, Message, Detail, PickerDate
    },
    mixins: [ TogglePage, StandTree ],
    data () {
      return {
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        currentData: {},
        filterText: '',
        radio: 0,
        currentOrg: {},
        currentInd: {
          'name': '',
          'unit': {
            'name': '',
            'id': ''
          }
        },
        yearRange: [],
        changeWidth: '100%',
        range: '',
        passVisible: false,
        onlyRead: true,
        errorList: [],
        taskRemark: '',
        activeTab: 1,
        errorRemark: '',
        remarkVisible: false
      }
    },
    mounted () {
      new Promise((resolve, reject) => {
        this.getTaskLog({resolve, reject, payload: {id: this.currentTask.id}})
      }).then((res) => {
        this.taskRemark = res
      }).catch(() => {})
      this.passVisible = this.currentTask.own_org_checked === 1 || this.currentTask.own_org_checked === 2 || this.currentTask.task_node.id > 5
      this.range = this.currentTask.year_range
      this.elementId = document.getElementById('loadings')
      this.topElementId = document.getElementById('tree-header-fixed')
      this.elementId.addEventListener('scroll', this.handleScroll)
      this.currentOrg = this.selectOrg[0]
      this.radio = this.currentOrg.id
      new Promise((resolve, reject) => {
        this.getSubTaskError({resolve, reject, payload: {id: this.currentTask.id}})
      }).then(() => {
        this.errorList = this.subTaskError
        this.initMarkOrg()
        this.getDataByCollege({'orgId': this.currentOrg.id, 'yearRange': this.range, 'taskId': this.currentTask.id})
        // this.getDataByInd({id: this.radios, yearRange: this.yearRange, taskId: this.currentTask.id})
      }).catch(() => {})
    },
    methods: {
      ...mapMutations('write', ['setCollegeData']),
      ...mapActions('write', ['getDataByCollege']),
      ...mapActions('commitTask', ['getSubTaskError', 'getTaskLog']),
      ...mapActions('checkTask', ['rejectTask', 'orgCheckPass']),
      filterNode (value, data) {
        if (!value) return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
      handleReturn () {
        this.togglePage('TaskList')
      },
      handleRadioChange (row) {
        this.setCollegeData([])
        this.currentOrg = {
          'id': row.id,
          'name': row.name
        }
        this.indDatas = []
        this.yearRange = []
        this.getDataByCollege({'orgId': this.currentOrg.id, 'yearRange': this.range, 'taskId': this.currentTask.id})
      },
      handleDetail (row, data) {
        this.currentInd = row
        this.currentData = data
        setTimeout(() => {
          this.$refs.detailDialog.handleDetail(this.currentTask.id)
        }, 10)
      },
      // 处理学院指标数据
      initValue () {
        this.cloneIndData = JSON.parse(JSON.stringify(this.collegeData))
        let results = this.collegeData.dataById
        this.yearRange = results ? results[0].ind_val.map(node => node.year) : []
        let num = this.yearRange.length
        this.changeWidth = 450 + num * 100 + 'px'
        if (num > 0) {
          this.range = this.yearRange[num - 1] + '-' + this.yearRange[0]
        } else {
          this.range = ''
        }
        if (this.yearRange.length > 0) {
          this.yearRange.unshift('合计')
        }
        this.fNodes.forEach((data) => {
          if (results === undefined) {
            this.$set(data, 'val', [])
          } else if (data.is_leaf === true) {
            let result = results.find(item => item.indicator_id === data.id) || {}
            let sum = 0
            if (result.ind_val) {
              let errorOrg = this.errorList.find(err => err.id === this.currentOrg.id)
              if (errorOrg) {
                result.ind_val.forEach(child => {
                  child.ind_val = child.ind_val === -25535 ? '' : this.precisionNum(child.ind_val, data)
                  let idx = errorOrg.data.find(err => err.id === child.ind_data_id)
                  if (idx) {
                    this.$set(child, 'mark', true)
                    this.$set(child, 'text', idx.remark)
                  } else {
                    this.$set(child, 'mark', false)
                    this.$set(child, 'text', '')
                  }
                  sum += child.ind_val * 1
                })
              } else {
                result.ind_val.forEach(child => {
                  child.ind_val = child.ind_val === -25535 ? '' : this.precisionNum(child.ind_val, data)
                  this.$set(child, 'mark', false)
                  this.$set(child, 'text', '')
                  sum += child.ind_val * 1
                })
              }
              sum = this.precisionNum(sum, data)
              result.ind_val.unshift(
                {
                  ind_val: sum,
                  year: '合计',
                  ind_id: data.id
                })
              this.$set(data, 'val', result.ind_val)
            } else {
              let fillData = this.yearRange.map((node) => {
                return {
                  ind_val: '',
                  year: node,
                  ind_id: data.id
                }
              })
              fillData[0].ind_val = 0
              this.$set(data, 'val', fillData)
            }
          }
        })
      },
      handleSave () {
        let payload = {
          id: this.currentTask.id,
          move: false,
          remark: this.taskRemark,
          ind_ids: {}
        }
        this.errorList.forEach(node => {
          node.data.forEach(item => {
            payload.ind_ids[item.id] = item.remark
          })
        })
        new Promise((resolve, reject) => {
          this.rejectTask({resolve, reject, payload})
        }).then(() => {
        }).catch(() => {})
      },
      handleReject () {
        let payload = {
          id: this.currentTask.id,
          move: true,
          remark: this.taskRemark,
          ind_ids: {}
        }
        this.errorList.forEach(node => {
          node.data.forEach(item => {
            payload.ind_ids[item.id] = item.remark
          })
        })
        new Promise((resolve, reject) => {
          this.rejectTask({resolve, reject, payload})
        }).then(() => {
          this.togglePage('TaskList')
        }).catch(() => {})
      },
      handlePass () {
        if (this.errorList.length > 0) {
          MessageBox.confirm('还有错误数据没有处理，确定审核通过？', this.$t('element.warming'), {
            type: 'warning'
          }).then(() => {
            let payload = {
              id: this.currentTask.id,
              remark: this.taskRemark
            }
            new Promise((resolve, reject) => {
              this.orgCheckPass({resolve, reject, payload})
            }).then(() => {
              this.passVisible = true
              this.togglePage('TaskList')
            }).catch(() => {})
          }).catch(() => {})
        } else {
          let payload = {
            id: this.currentTask.id,
            remark: this.taskRemark
          }
          new Promise((resolve, reject) => {
            this.orgCheckPass({resolve, reject, payload})
          }).then(() => {
            this.passVisible = true
            this.togglePage('TaskList')
          }).catch(() => {})
        }
      },
      handleRemark (data) {
        data.mark = !data.mark
        let index = this.errorList.findIndex(item => item.id === this.currentOrg.id)
        if (data.mark) {
          if (index < 0) {
            this.errorList.push({
              id: this.currentOrg.id,
              data: [{id: data.ind_data_id, remark: ''}]
            })
          } else {
            this.errorList[index].data.push({id: data.ind_data_id, remark: ''})
          }
        } else {
          if (index >= 0) {
            let idx = this.errorList[index].data.findIndex(err => err.id === data.ind_data_id)
            this.errorList[index].data.splice(idx, 1)
            if (this.errorList[index].data.length === 0) {
              this.errorList.splice(index, 1)
            }
          }
        }
        let newIndex = this.errorList.findIndex(item => item.id === this.currentOrg.id)
        if (newIndex < 0) {
          this.selectOrg.find(org => org.id === this.currentOrg.id).mark = false
        } else {
          this.selectOrg.find(org => org.id === this.currentOrg.id).mark = true
        }
      },
      initMarkOrg () {
        this.selectOrg.forEach(node => {
          let index = this.errorList.findIndex(item => item.id === node.id)
          if (index < 0) {
            this.$set(node, 'mark', false)
          } else {
            this.$set(node, 'mark', true)
          }
        })
      },
      handleIconReMark (item) {
        if (item.mark) {
          this.errorRemark = item.text
          this.currentData = item
          this.remarkVisible = true
        }
      },
      confirmIconRemark () {
        this.currentData.text = this.errorRemark
        let id1 = this.errorList.findIndex(node => node.id === this.currentOrg.id)
        let id2 = this.errorList[id1].data.findIndex(item => item.id === this.currentData.ind_data_id)
        this.errorList[id1].data[id2].remark = this.errorRemark
        this.remarkVisible = false
        this.remarkVisible = false
      },
      cancelIconRemark () {
        this.remarkVisible = false
        this.errorRemark = ''
      },
      // 数字精度处理
      precisionNum (data, node) {
        let num = data * 1
        let decimal = node.decimals
        if (node.unit.id === 10) {
          decimal = decimal + 2
        }
        let mul = Math.pow(10, decimal)
        return (Math.round(num * mul) / mul).toFixed(decimal)
      },
      precisionPercentNum (data, node) {
        if (data === '') {
          return ''
        } else {
          let num = data * 100
          let decimal = node.decimals
          let mul = Math.pow(10, decimal)
          return (Math.round(num * mul) / mul).toFixed(decimal) + '%'
        }
      }
    },
    computed: {
      ...mapGetters('write', ['collegeData']),
      ...mapGetters('config', ['indDetail']),
      ...mapGetters('commitTask', ['nodeTree', 'currentTask', 'subTaskError', 'taskLog']),
      ...mapGetters('checkTask', ['selectOrg']),
      fNodes () {
        return this.flatten(this.nodeTree)
      }
    },
    destroyed () {
      this.elementId.removeEventListener('scroll', this.handleScroll)
    },
    watch: {
      collegeData () {
        this.initValue()
      },
      filterText (val) {
        this.$refs.tree.filter(val)
      }
    }
  }
</script>

<style scoped>
  .udss-board-body {
    width: 100%;
    height: calc(100% - 50px);
    margin-top: 10px;
  }
  .udss-board-top {
    overflow: hidden;
  }
  .udss-board-top button {
    margin-top: 1px;
  }
  .udss-board-toolbox {
    height: 100%;
    overflow: hidden;
  }
  .main-box-top{
    margin-top: 8px;
    overflow: hidden;
    font-size: 14px;
    margin-bottom: 8px;
    display: flex;
  }
  .main-box-top span {
    display: inline-block;
    line-height: 48px;
  }
  .search-input {
    border-radius: 4px;
    width: 300px;
    height: 34px;
    border: solid 1px #D7D7D7;
    outline: none;
    line-height: 34px;
    text-indent: 10px;
    float: left;
    background: url('../../../assets/img/search.png') no-repeat;
    background-position: top 9px right 10px;
  }
  .tree-header-box {
    height: 40px;
    position: relative;
  }
  .tree-header {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #FFFFFF;
    background: #1EBBA6;
    position: absolute;
    z-index: 10;
    left: 0;
    top: 0px;
  }
  .tree-header-left {
    width: 550px;
    padding-left: 50px;
    margin-left: 0px;
  }
  .tree-header-right {
    float: right;
    padding-right: 10px;
  }
  .tree-header-right span{
    width: 140px;
    text-align: center;
    display: block;
    float: left;
  }
  .target-tree {
    height: calc(100% - 70px);
    position: relative;
    overflow-x: auto;
    overflow-y: auto;
  }
  .udss-tree-node {
    display: block;
    width: 100%;
    font-size: 14px;
    position: relative;
    padding-right: 8px;
  }
  .udss-tree-label {
    line-height: 36px;
  }
  .udss-tree-body {
    float: right;
  }
  .udss-tree-child {
    width: 130px;
    padding: 0 5px;
    float: left;
    line-height: 36px;
    overflow: hidden;
    text-align: center;
  }
  .udss-tree-text {
    padding: 3px 0;
  }
  .select-wrapper {
    height: calc(100% - 10px);
    width: 300px;
    margin-left: 20px;
    float: right;
  }
  .select-table {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    overflow: hidden;
    font-size: 12px !important;
  }
  .select-table ul {
    height: 100%;
    overflow: auto;
  }
  .select-table li {
    padding: 10px 5px;
    border-bottom: solid 1px #EBEEF5;
  }
  .menu-icon{
    display: inline-block;
    width: 14px;
    height: 2px;
    border-top: 2px solid #CECECE;
    border-bottom: 2px solid #CECECE;
    background-color: #CECECE;
    padding: 2px 0;
    background-clip:content-box;
    cursor: pointer;
  }
  .left-icon {
    width: 20px;
    display: inline-block;
    margin-right: -4px;
  }
  .error-img {
    background: url('../../../assets/img/warn.svg') no-repeat center center;
    color: red;
  }
  .label-center-box {
    cursor: pointer;
    padding: 4px 10px;
    border-radius: 2px;
  }
  .label-center-span {
    cursor: pointer;
    padding: 0px 10px;
  }
  .label-center-box:hover {
    background-color: rgba(0, 0, 0, 0.5);
    background-image: url('../../../assets/img/warn.svg');
    background-repeat: no-repeat;
    background-position: center center;
  }
  .label-center-error:hover {
    background-color: rgba(0, 0, 0, 0.5);
    background-image: url('../../../assets/img/right.svg');
    background-repeat: no-repeat;
    background-position: center center;
  }
  .redRemark{
    color: red !important;
  }
  .detail-dialog {
    margin: 0px 30px;
    padding-bottom: 40px;
  }
  .detail-dialog-close {
    color: #9B9B9B;
    font-size: 18px;
    text-align: right;
    margin-top: -25px;
  }
  .detail-dialog-close i {
    font-weight: 600;
    cursor: pointer;
  }
  .detail-title{
    font-size: 18px;
    color: #000;
    font-weight: 600;
    padding-bottom: 20px;
  }
  .detail-operator {
    font-size: 16px;
    color: #000;
    font-weight: 600;
    margin-top: 20px;
  }
  .detail-list {
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    margin-top: 26px;
    padding-bottom: 26px;
  }
  .detail-footer {
    margin-top: 10px;
  }
  .import-box {
    position: relative;
  }
  .import-cover-input {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 55;
    cursor: pointer;
    opacity: 0;
  }
  .detail-list-icon {
    display: inline-block;
    vertical-align:middle;
    width: 14px;
    height: 32px;
    padding-right: 5px;
    margin-right: 3px;
    border-right: solid 1px;
    background-size: 12px auto;
    background-position: 2px 9px;
    background-repeat: no-repeat;
  }
  .detail-icon-export {
    background-image: url('../../../assets/img/export.svg');
    border-right-color: #247BCA;
  }
  .detail-icon-import {
    background-image: url('../../../assets/img/import.svg');
    border-right-color: #19B29E;
  }
  .detail-icon-clear {
    background-image: url('../../../assets/img/clear.svg');
    border-right-color: #CB6243;
  }
  .detail-list button{
    display: block;
    border: none;
    outline: none;
    border-radius: 3px;
    height: 32px;
    line-height: 32px;
    overflow: hidden;
    padding: 0 5px;
    color: #FFFFFF;
    cursor: pointer;
  }
  .export-button {
    background-color: #3090E9;
  }
  .import-button {
    background-color: #1EBBA6;
  }
  .clear-button {
    background-color: #D96A49;
  }
  .operator-button {
    padding: 10px 20px;
    margin-left: 20px;
    color: #ffffff;
    background-color: #E4AD59 !important;
    background-image: -moz-linear-gradient(top, #EBB747, #DDA46B) !important;
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #EBB747), color-stop(1,#DDA46B)) !important;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EBB747', endColorstr='#DDA46B', GradientType =0) !important;
  }
  .totalStyle {
    color: #1EBBA6;
    font-weight: bold;
  }
  .is-mark-line {
    color: #D96A49 !important;
  }
  .tab-change{
    height: 40px;
    overflow: hidden;
  }
  .tab-container {
    height: calc(100% - 40px);
    overflow: hidden;
  }
  .tab-button{
    float: left;
    cursor: pointer;
    width: 50%;
    line-height: 40px;
    font-size: 16px;
    color: #767474;
    outline: none;
    border: none;
    text-decoration: none;
    background-image: -moz-linear-gradient(top, #F2F2F2, #D6D6D6);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #F2F2F2), color-stop(1,#D6D6D6));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#F2F2F2', endColorstr='#D6D6D6', GradientType =0);
  }
  .is-actives{
    background: #F3F3F3;
  }
  .remark-body {
    margin: 10px 20px;
  }
  .remark-footer {
    padding: 10px 20px;
    overflow: hidden;
    text-align: right;
  }
</style>
