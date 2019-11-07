<template>
  <Container :title="title" @downDataA="downCurrentData" @downDataB="downAllData" :showDownload="[true, true, true]">
    <template slot="header"></template>
    <template slot="main">
      <div class="udss-board-top">
        <input
          class="search-input"
          :placeholder="$t('element.filterText')"
          v-model="filterText" />
        <div style="display: inline-block; float: left; margin-left: 20px;" v-show="inputStatus === false" v-if="range">
          <PickerDate
            :range="range"
            @rangeChange="yearChange"
            :maxRange="10"
            :size="'small'"
            :width="'120px'">
          </PickerDate>
        </div>
        <Button
          v-hasPermission="'w'"
          type="primary"
          size="mini"
          style="float: left; margin-left: 20px; background-color: #4A90E2;"
          class="button-add"
          v-show="inputStatus === false && range"
          @click="handleEditData">录入指标数据</Button>
        <Button
          v-hasPermission="'w'"
          v-show="inputStatus === true"
          type="primary"
          style="float: left; margin-left: 20px;"
          :loading="confirmDisable"
          class="button-add"
          size="small"
          @click="handlConfirm">{{$t('element.save')}}</Button>
        <Button
          v-show="inputStatus === true"
          type="primary"
          style="float: left; margin-left: 20px;"
          class="button-close"
          size="small"
          @click="handleReturn">返回</Button>
        <Button
          v-hasPermission="'w'"
          :disabled="currentInd.ind_type_id === 2"
          type="primary"
          size="mini"
          style="float: none"
          class="button-add operator-button"
          v-show="inputStatus === false && range"
          @click="handleOperator">数据与明细操作</Button>
      </div>
      <div class="udss-board-body">
        <div class="select-wrapper">
          <!--<div class="select-year">-->
            <!--&lt;!&ndash;<strong>院系：{{currentOrg.name}}</strong>&ndash;&gt;-->
          <!--</div>-->
          <div class="select-table outIn">
            <Table
              size="mini"
              ref="radioTable"
              :data="orgs"
              height="100%"
              tooltip-effect="dark"
              style="width: 100%;">
              <TableColumn :label="$t('writeInd.college')">
                <template slot-scope="scope">
                  <Radio :label="scope.row.id" v-model="radio" @change="handleRadioChange(scope)"><span style="font-size: 12px;">{{scope.row.name}}</span></Radio>
                </template>
              </TableColumn>
            </Table>
          </div>
        </div>
        <div class="udss-board-toolbox">
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
                :data="targets"
                :expand-on-click-node="true"
                default-expand-all
                :props="defaultProps"
                node-key="id"
                :filter-node-method="filterNode"
                ref="tree">
                <div class="udss-tree-node" slot-scope="{ node, data }">
                  <div class="udss-tree-body" v-show="data.is_leaf">
                    <!--<div class="udss-tree-child">-->
                      <!--/><span v-if="data.unit.id !== 0">({{data.unit.name}})</span>-->
                    <!--</div>-->
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
                        <div v-show="inputStatus === false">&nbsp;
                          <span :class="[{'redRemark': data.has_detail && !value.is_full}]" :style="{color: value.ind_val * 1 === 0 ? '#CECECE' : '#000000'}">
                            <template v-if="data.unit.id === 10 && value.ind_val !== ''">
                              {{precisionPercentNum(value.ind_val, data)}}
                            </template>
                            <template v-else>
                              {{value.ind_val}}
                            </template>
                          </span>
                          <i
                            @click="handleDetail(data, value)"
                            class="menu-icon"
                            v-if="data.has_detail"
                            v-show="value.ind_val">
                          </i>
                        </div>
                        <div v-show="inputStatus === true && data.ind_type_id === 1">
                          <Input
                            @change="valueChange(data, value)"
                            type="text"
                            size="mini"
                            v-model="value.ind_val"/>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div class="udss-tree-label one-line">
                    <span v-if="data.unit.id === 0" class="udss-tree-text" :title="node.label">
                      {{ node.label }}
                    </span>
                    <span v-else  class="udss-tree-text" :title="node.label + ' (' + data.unit.name + ')'">
                      {{ node.label }}&nbsp;({{data.unit.name}})
                    </span>
                  </div>
                </div>
              </Tree>
            </div>
          </div>
        </div>
        <Dialog
          width="400px"
          :visible.sync="exportVisible"
          :show-close="false"
          :close-on-click-modal="true">
          <div class="detail-dialog">
            <div class="detail-title">
              <span>明细模板导出</span>
            </div>
            <div>
              <Select v-model="selectDetailModule" placeholder="请选择" style="width: 100%;">
                <Option
                  v-for="item in selectIndDetail"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </Option>
              </Select>
            </div>
            <div class="detail-footer" style="text-align: right;">
              <Button
                class="button-close"
                type="primary"
                size="small"
                style="background-color: #9B9B9B;"
                @click="exportVisible = false">取消</Button>
              <Button
                class="button-confirm"
                type="primary"
                size="small"
                @click="confirmExportModule"
                :disabled="selectDetailModule === ''"
                style="background-color: #3090E9;">导出</Button>
            </div>
          </div>
        </Dialog>
        <Detail
          ref="detailDialog"
          :currentCollege="currentOrg"
          :currentData="currentData"
          :orgData="orgs"
          :currentInd = "currentInd">
        </Detail>
        <Dialog
          width="500px"
          :visible.sync="operatingVisible"
          :show-close="false"
          :close-on-click-modal="true">
          <div class="detail-dialog">
            <div class="detail-dialog-close" @click="operatingVisible = false">
              <i class="el-icon-close"></i>
            </div>
            <div class="detail-operator">
              <span>指标数据操作</span>
            </div>
            <div class="detail-list">
              <button
                @click="handleExportIndData"
                class="export-button">
                <div class="detail-list-icon detail-icon-export"></div>
                导出数据模板
              </button>
              <div class="import-box">
                <input
                  :style="{display: indExportStatus ? 'none' : 'block'}"
                  class="import-cover-input"
                  type="file"
                  v-if="indFileShow"
                  accept=".xlsx"
                  @change="handleImportIndData($event)" />
                <button
                  v-hasPermission="'w'"
                  :disabled="indExportStatus"
                  class="import-button">
                  <div class="detail-list-icon detail-icon-import"></div>
                  <i class="el-icon-loading" v-show="indExportStatus"></i>导入指标数据
                </button>
              </div>
              <button
                v-hasPermission="'w'"
                :disabled="currentInd.ind_type_id === 2"
                class="clear-button"
                @click="handleClearData">
                <div class="detail-list-icon detail-icon-clear"></div>
                清空指标数据
              </button>
            </div>
            <div class="detail-operator">
              <span>指标明细操作</span>
            </div>
            <div class="detail-list" style="padding-bottom: 0px;">
              <button
                v-hasPermission="'w'"
                @click="handleExportModule"
                class="export-button">
                <div class="detail-list-icon detail-icon-export"></div>
                导出明细模板
              </button>
              <div class="import-box">
                <input
                  :style="{display: exportStatus ? 'none' : 'block'}"
                  class="import-cover-input"
                  type="file"
                  v-if="fileShow"
                  accept=".xlsx"
                  @change="handleFile($event)" />
                <button
                  v-hasPermission="'w'"
                  :disabled="exportStatus"
                  class="import-button">
                  <div class="detail-list-icon detail-icon-import"></div>
                  <i class="el-icon-loading" v-show="exportStatus"></i>导入明细数据
                </button>
              </div>
              <button
                v-hasPermission="'w'"
                :disabled="currentInd.ind_type_id === 2"
                class="clear-button"
                @click="handleClearDetail">
                <div class="detail-list-icon detail-icon-clear"></div>
                清空明细数据</button>
            </div>
          </div>
        </Dialog>
      </div>
    </template>
  </Container>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Container, PickerDate } from './widgets'
  import { Input, Button, Select, Option, Tree, Radio, Table, TableColumn, Message, Dialog, MessageBox } from 'element-ui'
  import { TogglePage, ObjInstance, StandTree } from '@/mixins'
  import Detail from './partial/write/detail.vue'
  export default {
    name: 'BuildInd',
    components: {
      Container, Input, Button, Select, Option, Tree, Radio, Table, TableColumn, Detail, PickerDate, Message, Dialog, MessageBox
    },
    mixins: [ TogglePage, ObjInstance, StandTree ],
    data () {
      return {
        title: '',
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        currentOrg: {},
        yearRange: [],
        trueTree: [],
        changeWidth: '100%',
        radio: '',
        filterText: '',
        confirmDisable: false,
        inputStatus: false,
        indDatas: [],
        cloneIndData: [],
        elementId: '',
        topElementId: '',
        currentInd: {
          'name': '',
          'unit': {
            'name': '',
            'id': ''
          }
        },
        range: '',
        currentData: {},
        exportVisible: false,
        exportStatus: false,
        uploadFile: '',
        fileShow: true,
        selectDetailModule: '',
        operatingVisible: false,
        indFileShow: true,
        indExportStatus: false
      }
    },
    mounted () {
      this.title = '数据录入 — ' + this.$route.meta.title
      this.$nextTick(function () {
        this.getTargets()
        this.getOrg()
        this.setCollegeData([])
        this.getIndDetail()
        this.elementId = document.getElementById('loadings')
        this.topElementId = document.getElementById('tree-header-fixed')
        this.elementId.addEventListener('scroll', this.handleScroll)
        let timer = setInterval(() => {
          if (this.orgs.length > 0) {
            this.currentOrg = this.orgs[0]
            this.radio = this.currentOrg.id
            this.getDataByCollege({'orgId': this.currentOrg.id, 'yearRange': ''})
            clearInterval(timer)
          }
        }, 50)
      })
    },
    destroyed () {
      this.elementId.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      ...mapMutations('write', ['setCollegeData']),
      ...mapActions('config', ['getUnitType', 'getIndDetail']),
      ...mapActions('target', ['getTargets']),
      ...mapActions('write', ['getOrg', 'getDataByCollege', 'updateDataByCollege', 'clearDataByCollege', 'clearDetailByCollege']),
      ...mapMutations('config', ['config', 'exportDataA', 'exportDataB']),
      ...mapMutations('write', ['exportModule', 'importData', 'exportIndData', 'importIndData']),
      // 数据下载 start
      downCurrentData () {
        if (this.currentOrg.id) {
          this.exportDataA({'name': '指标数据-按院系', 'url': 'v1/inddata/org/' + this.currentOrg.id + '/exc?year_range=' + this.range})
        }
      },
      downAllData () {
        this.exportDataB({'name': '指标数据全部院系数据', 'url': '/v1/inddata/org/-1/exc?year_range=' + this.range})
      },
      // 数据下载 end
      handleOperator () {
        this.operatingVisible = true
      },
      // 数据清空
      handleClearData () {
        let msg = '确认清空：' + this.currentOrg.name + '，' + this.range + '年所有指标数据及其相关明细数据？'
        MessageBox.confirm(msg, this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            this.clearDataByCollege({resolve, reject, payload: {orgId: this.currentOrg.id, yearRange: this.range}})
          }).then(() => {
            this.fNodes.forEach(node => {
              if (node.is_leaf && node.val && node.val.length > 0) {
                node.val.forEach(item => {
                  if (item.ind_val) {
                    item.ind_val = 0
                  }
                })
              }
            })
          }).catch(() => {})
        }).catch(() => {
        })
      },
      handleClearDetail () {
        let msg = '确认清空：' + this.currentOrg.name + '，' + this.range + '年所有指标明细数据？'
        MessageBox.confirm(msg, this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          this.clearDetailByCollege({orgId: this.currentOrg.id, yearRange: this.range})
        }).catch(() => {})
      },
      // 数据导入和导出
      handleExportModule () {
        this.exportVisible = true
      },
      confirmExportModule () {
        let obj = this.selectIndDetail.find(node => node.id === this.selectDetailModule)
        this.exportModule(obj)
        this.exportVisible = false
      },
      handleFile (event) {
        let payload = {}
        payload.file = event.target.files[0]
        let size = event.target.files[0].size / 1024 / 1024
        if (size > 1) {
          Message({
            message: '文件上传过大！',
            type: 'warning'
          })
        } else {
          this.fileShow = false
          setTimeout(() => {
            this.fileShow = true
          }, 10)
          MessageBox.confirm('是否同步指标数据？', this.$t('element.warming'), {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            payload.status = true
            this.confirmImportFile(payload)
          }).catch(() => {
            payload.status = false
            this.confirmImportFile(payload)
          })
        }
      },
      confirmImportFile (payload) {
        new Promise((resolve, reject) => {
          this.exportStatus = true
          this.importData({resolve, reject, payload})
        }).then(() => {
          Message({
            message: '数据上传成功！',
            type: 'success'
          })
          this.exportStatus = false
        }).catch(() => {
          Message({
            message: '数据上传失败，excel数据格式有误',
            type: 'error'
          })
          this.exportStatus = false
        })
      },
      // （数据导入和导出） end
      // 指标数据导入和导出
      handleExportIndData () {
        let payload = {
          name: '指标数据录入模板'
        }
        this.exportIndData(payload)
      },
      handleImportIndData () {
        let file = event.target.files[0]
        let payload = {file: file}
        let size = event.target.files[0].size / 1024 / 1024
        if (size > 1) {
          Message({
            message: '文件上传过大！',
            type: 'warning'
          })
        } else {
          this.indFileShow = false
          setTimeout(() => {
            this.indFileShow = true
          }, 10)
          new Promise((resolve, reject) => {
            this.indExportStatus = true
            this.importIndData({resolve, reject, payload})
          }).then(() => {
            Message({
              message: '数据上传成功！',
              type: 'success'
            })
            this.indExportStatus = false
          }).catch(() => {
            Message({
              message: '数据上传失败，excel数据格式有误',
              type: 'error'
            })
            this.indExportStatus = false
          })
        }
      },
      yearChange (val) {
        console.log(val)
        this.range = val
        if (this.currentOrg.id) {
          this.indDatas = []
          this.getDataByCollege({'orgId': this.currentOrg.id, 'yearRange': this.range})
        }
      },
      handleDetail (row, data) {
        this.currentInd = row
        this.currentData = data
        setTimeout(() => {
          this.$refs.detailDialog.handleDetail(data) // 方法2
        }, 10)
      },
      handleScroll () {
        this.topElementId.style.top = this.elementId.scrollTop + 'px'
        // var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      },
      initValue () {
        this.cloneIndData = JSON.parse(JSON.stringify(this.collegeData))
        let results = this.collegeData.dataById
        this.yearRange = results ? results[0].ind_val.map(node => node.year) : []
        let num = this.yearRange.length
        this.changeWidth = 400 + num * 100 + 'px'
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
            result.ind_val && result.ind_val.forEach(child => {
              child.ind_val = child.ind_val === -25535 ? '' : this.precisionNum(child.ind_val, data)
              sum += child.ind_val * 1
            })
            sum = this.precisionNum(sum, data)
            if (result.ind_val) {
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
      handleReturn () {
        this.setCollegeData(this.cloneIndData)
        this.inputStatus = false
      },
      valueChange (data, row) {
        let indId = row.ind_id
        let val = row.ind_val ? Number(row.ind_val) : -25535
        let year = row.year
        let dataId = row.ind_data_id ? Number(row.ind_data_id) : -25535
        if (this.indDatas.length > 0) {
          let index = this.indDatas.findIndex(node => node.year === year && node.ind_id === indId)
          index < 0 ? this.indDatas.push({'ind_id': indId, 'ind_val': val, year, 'ind_data_id': dataId}) : this.indDatas[index].ind_val = val
        } else {
          this.indDatas.push({'ind_id': indId, 'ind_val': val, year, 'ind_data_id': dataId})
        }
      },
      handleRadioChange (row) {
        this.setCollegeData([])
        this.currentOrg = {
          'id': row.row.id,
          'name': row.row.name
        }
        this.indDatas = []
        this.yearRange = []
        this.getDataByCollege({'orgId': this.currentOrg.id, 'yearRange': this.range})
      },
      handleEditData () {
        if (this.currentOrg.id) {
          this.indDatas = []
          this.inputStatus = true
        }
      },
      handlConfirm () {
        if (this.indDatas.length > 0) {
          this.confirmDisable = true
          new Promise((resolve, reject) => {
            let payload = {
              'indDatas': this.indDatas,
              'id': 1,
              'orgId': this.currentOrg.id
            }
            this.updateDataByCollege({payload, resolve, reject})
          }).then((res) => {
            this.confirmDisable = false
            this.inputStatus = false
            this.indDatas = []
            res.forEach(node => {
              node.ind_val = node.ind_val === -25535 ? '' : node.ind_val
              let date = this.fNodes.find(item => item.id === node.ind_id)
              node.ind_val = this.precisionNum(node.ind_val, date)
              let index = date.val.findIndex(item => item.year === node.year)
              date.val.splice(index, 1, node)
            })
          }).catch(() => {
            this.confirmDisable = false
          })
        }
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
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
      ...mapGetters('config', ['unitType', 'indDetail']),
      ...mapGetters('target', ['targets']),
      ...mapGetters('write', ['orgs', 'collegeData']),
      selectIndDetail () {
        let arr = []
        if (this.indDetail) {
          this.indDetail.forEach(node => {
            node.referenced && arr.push({id: node.id, name: node.name})
          })
        }
        return arr
      },
      fNodes () {
        return this.flatten(this.targets)
      },
      rootNodes () {
        return this.fNodes.filter(node => {
          return node.is_leaf === true
        })
      },
      indicators () {
        return this.fNodes.filter(node => !isNaN(node.val) && node.val !== '' && node.val !== undefined).map(item => {
          return {
            'indId': item.id,
            'orgId': this.currentOrg.id,
            'val': Number(item.val)
          }
        })
      }
    },
    watch: {
      collegeData () {
        this.initValue()
      },
      filterText (val) {
        this.$refs.tree.filter(val)
      }
    },
    filters: {
      unit: function (val) {
        let a = this.unitType.find(node => node.id === val)
        return a.name
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
  .search-input {
    border-radius: 4px;
    width: 300px;
    height: 34px;
    border: solid 1px #D7D7D7;
    outline: none;
    line-height: 34px;
    text-indent: 10px;
    float: left;
    background: url('../assets/img/search.png') no-repeat;
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
    width: 100px;
    text-align: center;
    display: block;
    float: left;
  }
  .target-tree {
    height: 100%;
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
    width: 90px;
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
    overflow-x: hidden;
    font-size: 12px !important;
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
    background-image: url('../assets/img/export.svg');
    border-right-color: #247BCA;
  }
  .detail-icon-import {
    background-image: url('../assets/img/import.svg');
    border-right-color: #19B29E;
  }
  .detail-icon-clear {
    background-image: url('../assets/img/clear.svg');
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
</style>
