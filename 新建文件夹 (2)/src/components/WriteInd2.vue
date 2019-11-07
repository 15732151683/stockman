<template>
  <Container :title="title" @downDataA="downCurrentData" @downDataB="downAllData" :showDownload="[true, true, false]">
    <template slot="header"></template>
    <template slot="main">
      <div class="udss-board-top">
        <div class="select-time-range" v-if="range">
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
          :disabled="currentInd.ind_type_id === 2"
          type="primary"
          size="mini"
          style="margin-left: 20px; background-color: #4A90E2;"
          class="button-add"
          @click="handleEditData">录入指标数据</Button>
        <Button
          v-hasPermission="'w'"
          :disabled="currentInd.ind_type_id === 2"
          type="primary"
          size="mini"
          style="float: none"
          class="button-add operator-button"
          @click="handleOperator">数据与明细操作</Button>
      </div>
      <div class="udss-board-body">
        <div class="udss-board-toolbox">
          <div style="overflow: hidden;">
            <input
              class="search-input"
              :placeholder="$t('element.filterText')"
              v-model="filterText" />
          </div>
          <div class="udss-tree-header"><strong>{{$t('writeInd.indicator')}}</strong></div>
          <div class="udss-tree-body target-tree">
            <Tree
              :data="targets"
              :expand-on-click-node="true"
              :default-expanded-keys="expandedArray"
              :props="defaultProps"
              node-key="id"
              :filter-node-method="filterNode"
              ref="tree">
              <div class="udss-tree-node" slot-scope="{ node, data }" :title="node.label">
                <div class="udss-tree-button" v-show="data.is_leaf">
                  <Radio :label="data.id" v-model="radios" @change="showWrite(data)"></Radio>
                </div>
                <div :class="['udss-tree-text', 'one-line', {'is-active-line': radios === data.id}]" :title="node.label" @click="changeRadio(data)">
                  {{ node.label }}
                </div>
              </div>
            </Tree>
          </div>
        </div>
        <div class="main-box">
          <div class="main-box-top">
            <span><strong>录入指标名称：</strong>{{this.currentInd.name}}</span><span><strong>单位：</strong>{{this.currentInd.unit.name}}</span>
          </div>
          <div class="main-box-container ind-table" v-if="tabThs.length > 0">
            <Table :data="tabData" style="width: 100%" height="100%" :row-class-name="tableRowClassName">
              <TableColumn
                :fixed="thId === 0"
                :label="th.name"
                :min-width="th.width"
                v-for="(th, thId) in tabThs"
                :align="thId === 0 ? 'left': 'center'"
                :key="thId">
                <template slot-scope="scope">
                  <template v-if="currentInd.unit.id !== 10 && currentInd.unit.id !== 23 && scope.$index === 0">
                    <div v-if="thId === 0" class="table-td-class">
                      <span style="font-weight: bold;">{{ scope.row[th.index] }}</span>
                    </div>
                    <div v-else-if="thId === 1" class="table-td-class">
                      <span class="totalStyle">
                        {{ scope.row[th.index].year ?  scope.row[th.index].ind_val : scope.row[th.index] }}
                      </span>
                    </div>
                    <div v-else :class="['table-td-class', {'table-td-right': currentInd.has_detail}, 'totalStyle']">
                      {{ scope.row[th.index].ind_val }}
                      <span class="menu-icon-box" v-if="currentInd.has_detail">
                        <i @click="handleAllDetail(scope.row[th.index], th.index)"  class="menu-icon"
                           v-show="scope.row[th.index].ind_val"></i>
                      </span>
                    </div>
                  </template>
                  <template v-else>
                    <div v-if="thId === 0" class="table-td-class">
                      <span>{{ scope.row[th.index] }}</span>
                    </div>
                    <template v-else-if="currentInd.unit.id === 10 || currentInd.unit.id === 23">
                      <div :class="['table-td-class', {'table-td-right': currentInd.has_detail}]">
                      <span :class="[{'redRemark': currentInd.has_detail && !scope.row[th.index].is_full}]"
                            :style="{color: scope.row[th.index].ind_val * 1 === 0 ? '#CECECE' : '#000000'}">
                        <template v-if="currentInd.unit.id === 10">
                          {{ precisionPercentNum(scope.row[th.index].ind_val) }}
                        </template>
                        <template v-else>
                          {{ scope.row[th.index].ind_val }}
                        </template>
                      </span>
                        <span class="menu-icon-box" v-if="currentInd.has_detail">
                        <i @click="handleDetail(scope.row[th.index], scope.row)"
                           class="menu-icon"
                           v-show="scope.row[th.index].ind_val">
                        </i>
                      </span>
                      </div>
                    </template>
                    <template v-else>
                      <div v-if="thId === 1" class="table-td-class">
                        <span class="totalStyle">
                          {{ scope.row[th.index].year ?  scope.row[th.index].ind_val : scope.row[th.index]}}
                        </span>
                      </div>
                      <div v-else :class="['table-td-class', {'table-td-right': currentInd.has_detail}]">
                        <span :class="[{'redRemark': currentInd.has_detail && !scope.row[th.index].is_full}]"
                              :style="{color: scope.row[th.index].ind_val * 1 === 0 ? '#CECECE' : '#000000'}">
                          {{ scope.row[th.index].ind_val }}
                        </span>
                        <span class="menu-icon-box" v-if="currentInd.has_detail">
                          <i @click="handleDetail(scope.row[th.index], scope.row)"
                             class="menu-icon"
                             v-show="scope.row[th.index].ind_val">
                          </i>
                        </span>
                      </div>
                    </template>
                  </template>
                </template>
              </TableColumn>
            </Table>
          </div>
        </div>
        <!--数据录入弹框-->
        <Dialog
          width="1000px"
          :visible.sync="dialogTableVisible"
          :show-close="false"
          :close-on-click-modal="false">
          <div class="dialog-table-box ind-table inner-table">
            <div class="dialog-top">
              <span>录入指标名称：{{this.currentInd.name}}</span><span>单位：{{this.currentInd.unit.name}}</span>
            </div>
            <Table
              :data="cloneTabData"
              style="width: 100%"
              height="100%"
              :row-class-name="tableRowClassName">
              <TableColumn
                :fixed="thId === 0"
                :label="th.name"
                :min-width="th.width"
                v-for="(th, thId) in dialogTabThs"
                :align="thId === 0 ? 'left': 'center'"
                :key="thId">
                <template slot-scope="scope">
                  <div v-if="thId === 0" class="table-td-class">
                    <span>{{ scope.row[th.index] }}</span>
                  </div>
                  <div v-else class="table-td-class">
                    <input @change="valueChange(scope.row[th.index], scope.row.id)" type="text" v-model="scope.row[th.index].ind_val" class="dialog-table-input">
                  </div>
                </template>
              </TableColumn>
            </Table>
          </div>
          <div slot="footer" class="dialog-footer">
            <Button
              class="button-close"
              type="primary"
              size="small"
              style="float: left; background-color: #9B9B9B;"
              @click="initAllData">空值补零</Button>
            <Button
              class="button-confirm"
              type="primary"
              size="small"
              style="background-color: #3090E9;"
              :loading="indSaveLoading"
              @click="confirmEditData">确 定</Button>
            <Button
              class="button-close"
              type="primary"
              size="small"
              @click="dialogTableVisible = false">{{$t('element.buttonClose')}}</Button>
          </div>
        </Dialog>
        <!--明细弹框-->
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
        <!--操作弹框-->
        <Dialog
          width="460px"
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
            <div style="width: 100%; height: 1px; background-color: #F5F5F5;"></div>
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
                清空明细数据
              </button>
            </div>
          </div>
        </Dialog>
        <template v-if="!allDetailMode">
          <Detail
            ref="detailDialog"
            :currentCollege="currentCollege"
            :currentData="currentData"
            :orgData="selectCollges"
            :currentInd = "currentInd">
          </Detail>
        </template>
        <template v-else>
          <AllDetail
            ref="allDetailDialog"
            :currentData="currentData"
            :orgData="selectCollges"
            :currentInd = "currentInd">
          </AllDetail>
        </template>
      </div>
    </template>
  </Container>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Input, Button, Select, Option, Tree, Dialog, Table, TableColumn, Radio, MessageBox, Message } from 'element-ui'
  import { TogglePage, StandTree } from '@/mixins'
  import { Container, PickerDate } from './widgets'
  import Detail from './partial/write/detail.vue'
  import AllDetail from './partial/write/allDetail.vue'
  export default {
    name: 'BuildInd2',
    components: {
      Container, Input, Button, Select, Option, Dialog, Table, TableColumn, Radio, Tree, MessageBox, Message, Detail, PickerDate, AllDetail
    },
    mixins: [ TogglePage, StandTree ],
    data () {
      return {
        title: '',
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        currentInd: {
          'name': '',
          'unit': {
            'name': '',
            'id': ''
          }
        },
        range: '',
        currentCollege: {},
        currentData: {},
        radios: 921,
        filterText: '',
        dialogTableVisible: false,
        cloneTableData: [],
        tabThs: [],
        dialogTabThs: [],
        tabData: [],
        selectCollges: [],
        cloneTabData: [],
        orgDatas: [],
        expandedArray: [],
        indSaveLoading: false,
        exportVisible: false,
        exportStatus: false,
        fileShow: true,
        indFileShow: true,
        indExportStatus: false,
        selectDetailModule: '',
        allDetailMode: false,
        operatingVisible: false
      }
    },
    mounted () {
      this.title = '数据录入 — ' + this.$route.meta.title
      this.$nextTick(function () {
        this.getTargets()
        this.getIndDetail()
        let info = JSON.parse(window.sessionStorage.getItem('udssInfo'))
        this.radios = info.trend_def_ind
        this.expandedArray = [info.trend_def_ind]
        this.getDataByInd({id: this.radios, yearRange: this.range})
      })
    },
    methods: {
      ...mapActions('target', ['getTargets']),
      ...mapActions('write', ['getDataByInd', 'updateDataByInd', 'clearDataByInd', 'clearDetailByInd']),
      ...mapActions('config', ['getIndDetail']),
      ...mapMutations('config', ['config', 'exportDataA', 'exportDataB']),
      ...mapMutations('write', ['exportModule', 'importData', 'exportIndData', 'importIndData']),
      // 数据下载 start
      downCurrentData () {
        if (this.currentInd.id) {
          // console.log(this.currentInd, this.range)
          this.exportDataA({'name': '指标数据-按指标', 'url': 'v1/inddata/ind/' + this.currentInd.id + '/exc?year_range=' + this.range})
        }
      },
      downAllData () {
        this.exportDataB({'name': '指标数据', 'url': '/v1/inddata/expdata'})
      },
      handleOperator () {
        this.operatingVisible = true
      },
      // 清空数据
      handleClearData () {
        let msg = '确认清空：' + this.currentInd.name + '，' + this.range + '年所有院系数据及其相关明细数据？'
        MessageBox.confirm(msg, this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            this.clearDataByInd({resolve, reject, payload: {indId: this.currentInd.id, yearRange: this.range}})
          }).then(() => {
            this.tabData.forEach(node => {
              Object.keys(node).forEach(key => {
                let obj = node[key]
                if (typeof obj === 'object') {
                  if (obj.ind_val) {
                    obj.ind_val = 0
                  }
                }
              })
            })
          }).catch(() => {})
        }).catch(() => {
        })
      },
      handleClearDetail () {
        let msg = '确认清空：' + this.currentInd.name + '，' + this.range + '年所有院系明细数据？'
        MessageBox.confirm(msg, this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          this.clearDetailByInd({indId: this.currentInd.id, yearRange: this.range})
        }).catch(() => {})
      },
      // 数据下载 end
      // 明细导入和导出 start
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
      // 明细导入和导出 end
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
      clone (data) {
        return JSON.parse(JSON.stringify(data))
      },
      yearChange (val) {
        this.range = val
        if (this.currentInd.id) {
          this.getDataByInd({id: this.currentInd.id, yearRange: this.range})
        }
      },
      initAllData () {
        let reg = /^0/
        this.cloneTabData.forEach(node => {
          Object.keys(node).forEach(key => {
            let obj = node[key]
            if (typeof obj === 'object') {
              if (!obj.ind_val && !reg.test(obj.ind_val)) {
                obj.ind_val = '0'
                let index = this.orgDatas.findIndex(node => node.year === obj.year && node.org_id === obj.org_id)
                let dataId = obj.ind_data_id ? obj.ind_data_id : -25535
                index < 0 ? this.orgDatas.push({'org_id': obj.org_id, 'ind_val': 0, 'year': obj.year, 'ind_data_id': dataId}) : this.orgDatas[index].ind_val = 0
              }
            }
          })
        })
      },
      valueChange (value, row) {
        let orgId = row
        let val = value.ind_val ? Number(value.ind_val) : -25535
        let year = value.year
        let dataId = value.ind_data_id ? Number(value.ind_data_id) : -25535
        if (this.orgDatas.length > 0) {
          let index = this.orgDatas.findIndex(node => node.year === year && node.org_id === orgId)
          index < 0 ? this.orgDatas.push({'org_id': orgId, 'ind_val': val, year, 'ind_data_id': dataId}) : this.orgDatas[index].ind_val = val
        } else {
          this.orgDatas.push({'org_id': orgId, 'ind_val': val, year, 'ind_data_id': dataId})
        }
      },
      tableRowClassName ({row, rowIndex}) {
        if (rowIndex % 2 === 0) {
          return 'even-row'
        } else {
          return 'odd-row'
        }
      },
      handleDetail (row, data) {
        this.currentCollege = data
        this.currentData = row
        this.allDetailMode = false
        setTimeout(() => {
          this.$refs.detailDialog.handleDetail(row) // 方法2
        }, 10)
      },
      handleAllDetail (row, data) {
        this.currentData = {
          year: data * 1
        }
        this.allDetailMode = true
        setTimeout(() => {
          this.$refs.allDetailDialog.handleDetail() // 方法2
        }, 10)
      },
      // ---------------------
      handleEditData () {
        this.orgDatas = []
        this.dialogTableVisible = true
        if (this.currentInd.unit.id === 10 || this.currentInd.unit.id === 23) {
          this.dialogTabThs = this.clone(this.tabThs)
          this.cloneTabData = this.clone(this.tabData)
        } else {
          this.dialogTabThs = this.clone(this.tabThs)
          this.dialogTabThs.splice(1, 1)
          this.cloneTabData = this.clone(this.tabData).slice(1)
        }
      },
      confirmEditData () {
        if (this.orgDatas.length === 0) {
          this.dialogTableVisible = false
        } else {
          return new Promise((resolve, reject) => {
            this.indSaveLoading = true
            let payload = {
              'orgDatas': this.orgDatas,
              'id': 1,
              'indId': this.currentInd.id
            }
            this.updateDataByInd({payload, resolve, reject})
          }).then((res) => {
            res.forEach(node => {
              if (node.ind_val === -25535) {
                node.ind_val = ''
              } else {
                node.ind_val = this.precisionNum(node.ind_val)
              }
              this.tabData.find(item => item.id === node.org_id)[node.year] = node
            })
            this.dialogTableVisible = false
            this.indSaveLoading = false
            // this.tabData = this.cloneTabData
            this.cloneTabData = []
          }).catch(() => {
            this.indSaveLoading = false
          })
        }
      },
      // 点击tree文字触发事件
      changeRadio (data) {
        // console.log(data, '11111111111111')
        if (data.is_leaf === true) {
          this.radios = data.id
          this.showWrite(data)
        }
      },
      // 点击radio改变触发事件
      showWrite (data) {
        // this.expandedArray = []
        // this.currentInd = data
        this.getDataByInd({id: data.id, yearRange: this.range})
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
      initTabData (data) {
        this.tabThs = []
        let arr = data.orgs[0].val.map(node => {
          return {
            name: String(node.year),
            width: 120,
            index: String(node.year)
          }
        })
        let num = arr.length
        if (num > 0) {
          this.range = arr[num - 1].index + '-' + arr[0].index
        } else {
          this.range = ''
        }
        if (this.currentInd.unit.id === 10 || this.currentInd.unit.id === 23) {
          this.tabThs = [].concat([{name: '学院', width: 200, index: 'name'}], arr)
        } else {
          this.tabThs = [].concat([{name: '学院', width: 200, index: 'name'}, {name: '合计', width: '80', index: 'total'}], arr)
        }
        this.tabData = []
        let _self = this
        this.tabData = data.orgs.map(node => {
          let obj = {}
          obj.name = node.org_name
          obj.id = node.org_id
          let total = 0
          node.val.forEach(item => {
            obj[item.year] = item
            if (item.ind_val === -25535) {
              obj[item.year].ind_val = ''
            } else {
              item.ind_val = _self.precisionNum(item.ind_val)
              total = total + Number(item.ind_val)
              // obj[item.year].percent_val = _self.currentInd.unit.id === 10 ? this.computedPercent(item.ind_val) + '%' : ''
            }
          })
          // obj.total = Math.floor(total * 1000) / 1000
          obj.total = _self.precisionNum(total)
          return obj
        })
        if (this.currentInd.unit.id !== 10 && this.currentInd.unit.id !== 23) {
          let total = {
            name: '院系年度数据总和',
            id: 0
          }
          let sum = 0
          data.ind_val_sum.forEach(item => {
            sum = sum + Number(item.sum)
            total[item.year] = {
              ind_val: _self.precisionNum(item.sum)
              // percent_val: this.currentInd.unit.id === 10 ? this.computedPercent(item.sum) + '%' : ''
            }
          })
          // total.total = Math.floor(sum * 1000) / 1000
          total.total = _self.precisionNum(sum)
          this.tabData.unshift(total)
          this.selectCollges = this.tabData.slice(1).map(node => {
            return {
              name: node.name,
              id: node.id
            }
          })
        } else {
          this.selectCollges = this.tabData.map(node => {
            return {
              name: node.name,
              id: node.id
            }
          })
        }
      },
      // 数字精度处理
      precisionNum (data) {
        let num = data * 1
        let decimal = this.currentInd.decimals
        if (this.currentInd.unit.id === 10) {
          decimal = decimal + 2
        }
        let mul = Math.pow(10, decimal)
        return (Math.round(num * mul) / mul).toFixed(decimal)
      },
      precisionPercentNum (data) {
        if (data === '') {
          return ''
        } else {
          let num = data * 100
          let decimal = this.currentInd.decimals
          let mul = Math.pow(10, decimal)
          return (Math.round(num * mul) / mul).toFixed(decimal) + '%'
        }
      }
      // 两个浮点数相乘
      //  accMul (num1, num2) {
      //    let m = 0
      //    let s1 = num1.toString()
      //    let s2 = num2.toString()
      //    try {
      //      m += s1.split('.')[1].length
      //    } catch (e) {}
      //    try {
      //      m += s2.split('.')[1].length
      //    } catch (e) {}
      //    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
      //  }
    },
    computed: {
      ...mapGetters('target', ['targets']),
      ...mapGetters('write', ['indData']),
      ...mapGetters('config', ['indDetail']),
      fNodes () {
        return this.flatten(this.targets)
      },
      selectIndDetail () {
        let arr = []
        if (this.indDetail) {
          this.indDetail.forEach(node => {
            node.referenced && arr.push({id: node.id, name: node.name})
          })
        }
        return arr
      }
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val)
      },
      indData () {
        if (this.indData && this.indData.orgs && this.indData.orgs.length > 0) {
          // this.showName = this.indData.ind_name
          if (this.fNodes && this.fNodes.length > 0) {
            this.currentInd = this.fNodes.find(node => node.id === this.radios)
            this.initTabData(this.indData)
          } else {
            let timer = setInterval(() => {
              if (this.fNodes && this.fNodes.length > 0) {
                this.currentInd = this.fNodes.find(node => node.id === this.radios)
                this.initTabData(this.indData)
                clearInterval(timer)
              }
            }, 10)
          }
        } else {
          this.tabThs = []
          this.tabData = []
        }
      }
    }
  }
</script>

<style scoped>
  .udss-board-top {
    overflow: hidden;
  }
  .udss-board-top button {
    margin-top: 1px;
  }
  .udss-board-body {
    width: 100%;
    height: calc(100% - 40px);
    font-size: 14px;
  }
  .select-time-range {
    float: left;
    font-size: 14px;
  }
  .udss-board-toolbox {
    height: 100%;
    width: 300px;
    float: right;
    overflow: hidden;
  }
  .udss-tree-header {
    height: 40px;
    line-height: 40px;
    color: #000000;
    text-indent: 45px;
    background-color: #F2F2F2;
  }
  .search-input {
    margin: 5px 0;
    border-radius: 4px;
    width: calc(100% - 2px);
    height: 36px;
    border: solid 1px #D7D7D7;
    outline: none;
    line-height: 36px;
    text-indent: 10px;
    background: url('../assets/img/search.png') no-repeat;
    background-position: top 10px right 20px;
  }
  .udss-tree-node {
    flex: 1;
    line-height: 40px;
    display: inline-block;
    padding-right: 2px;
    overflow: hidden;
  }
  .udss-tree-text {
    margin-right: 55px;
    line-height: 40px;
  }
  .is-active-line{
    color: #409EFF;
  }
  .udss-tree-button {
    line-height: 40px;
    float: right;
    margin-right: 20px;
    color: red;
    width: 20px;
    overflow: hidden;
  }
  .udss-tree-body {
    height: calc(100% - 100px);
    overflow: hidden;
    overflow-y: auto;
  }
  .main-box{
    margin-right: 340px;
    height: 100%;
    overflow: hidden;
  }
  .main-box-top{
    margin-top: 8px;
    overflow: hidden;
    font-size: 14px;
    margin-bottom: 8px;
  }
  .main-box-top span {
    margin-right: 20px;
    display: block;
    line-height: 34px;
    float: left;
  }
  .main-box-container{
    width: 100%;
    height: calc(100% - 50px);
    overflow: scroll;
    background: #eeeedd;
  }
  .table-td-class{
    color: #000000;
  }
  .table-td-right{
    text-align: right;
  }
  .table-td-class span{
    display: inline-block;
  }
  .dialog-top{
    font-size: 18px;
    color: #000;
    font-weight: bold;
    padding-bottom: 10px;
  }
  .dialog-top span{
    margin-right: 20px;
  }
  .dialog-footer{
    margin-top: 20px;
  }
  .dialog-table-box{
    margin: 20px 30px;
    height: 600px;
  }
  .dialog-table-input{
    width: 95%;
    height: 28px;
    border: solid 1px #ECECEC;
    outline: none;
    text-align: center;
  }
  .menu-icon-box {
    display: inline-block;
    width: 25px;
    height: 0px;
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
    line-height: 32px;
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
