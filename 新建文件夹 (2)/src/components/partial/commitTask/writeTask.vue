<template>
  <div style="width: 100%; height: 100%;">
    <div class="udss-board-top">
      <div class="select-time-range">
        <span><strong>录入指标名称：</strong>{{this.currentInd.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span><strong>单位：</strong>{{this.currentInd.unit.name}}</span>
        <span class="img-box" v-if="errorCount">
          <span class="img-span error-img"></span>&nbsp;{{errorCount}}
        </span>
       <!--<strong>任务名称：</strong>{{currentTask.name}}&nbsp;&nbsp;&nbsp;&nbsp;<strong>年份：</strong>{{yearRange}}-->
      </div>
      <InputData
        @updateData="updateCollegeData"
        :currentInd="currentInd"
        :hidden="onlyRead"
        :yearRange="yearRange"
        :tabThs="tabThs"
        :tabData="tabData"
        :currentTask="currentTask">
      </InputData>
      <Actions
        @clearAllData="handleClearData"
        :currentInd="currentInd"
        :hidden="onlyRead"
        :detailModule="selectIndDetail"
        :yearRange="yearRange"
        :currentTask="currentTask">
      </Actions>
      <Button
        v-if="!currentTask.sub_tasks[0].committed_at"
        type="primary"
        size="mini"
        class="button-add"
        style="float: none; background-color: #1EBBA6; color: #FFFFFF; margin-left: 15px;"
        :loading="commitLoading"
        @click.stop="handleSubmit">任务提交</Button>
      <Button
        :disabled="currentInd.ind_type_id === 2"
        type="primary"
        size="mini"
        style="margin-left: 20px; background-color: #4A90E2; float: right;"
        class="button-add"
        @click="handleReturn">返回</Button>
    </div>
    <div class="udss-board-body">
      <div class="udss-board-toolbox">
        <Tabs :name="tabsName">
          <template slot="Tabs1">
            <SideTree :value="radios" :tree="nodeTree" @getIndData="changeRadio"></SideTree>
          </template>
          <template slot="Tabs2">
            <LogList :logList="taskLog"></LogList>
          </template>
        </Tabs>
      </div>
      <div class="main-box">
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
        <div class="main-box-container">
          <DataByInd
            :currentInd="currentInd"
            :tabData="tabData"
            :tabThs="tabThs"
            :currentTask="currentTask"
            :onlyRead="onlyRead"
            :disabled="true"
            :orgData="selectCollges">
          </DataByInd>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { Input, Button, MessageBox, Message } from 'element-ui'
  import { TogglePage, StandTree } from '@/mixins'
  import { Container, LogList, SideTree, Tabs, Actions, InputData, DataByInd } from '../../widgets'
  export default {
    name: 'WriteTask',
    components: {
      Container, LogList, SideTree, Tabs, Actions, InputData, DataByInd, Input, Button, MessageBox, Message
    },
    mixins: [ TogglePage, StandTree ],
    data () {
      return {
        title: this.$t('writeInd.titleB'),
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
        yearRange: '2017-2018',
        radios: 921,
        tabThs: [],
        dialogTabThs: [],
        tabData: [],
        selectCollges: [],
        onlyRead: false,
        errorList: [],
        isRejected: false,
        taskRemark: '',
        commitLoading: false,
        tabsName: ['指标', '备注历史'],
        errorCount: 0
      }
    },
    created () {
      let id = this.currentTask.sub_tasks[0].ind_ids[0]
      this.radios = id
    },
    mounted () {
      this.$nextTick(function () {
        new Promise((resolve, reject) => {
          this.getTaskLog({resolve, reject, payload: {id: this.currentTask.id, subId: this.currentTask.sub_tasks[0].id}})
        }).then((res) => {
          this.taskRemark = res
        }).catch(() => {})
        this.onlyRead = !!this.currentTask.sub_tasks[0].committed_at
        this.getIndDetail(this.currentTask.id)
        this.yearRange = this.currentTask.year_range
        this.isRejected = this.currentTask.sub_tasks[0].dept_rejected_at
        if (this.isRejected) {
          new Promise((resolve, reject) => {
            this.getSubTaskError({resolve, reject, payload: {id: this.currentTask.id, subId: this.currentTask.sub_tasks[0].id}})
          }).then(() => {
            this.errorList = this.subTaskError
            this.initMarkInd()
            this.getDataByInd({id: this.radios, yearRange: this.yearRange, taskId: this.currentTask.id})
          }).catch(() => {})
        } else {
          this.getDataByInd({id: this.radios, yearRange: this.yearRange, taskId: this.currentTask.id})
        }
      })
    },
    methods: {
      ...mapActions('write', ['getDataByInd']),
      ...mapActions('config', ['getIndDetail']),
      ...mapActions('commitTask', ['getSubTaskError', 'getTaskLog', 'commitTask']),
      clone (obj) {
        return JSON.parse(JSON.stringify(obj))
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
      // 清空数据操作
      handleClearData () {
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
      },
      // 更新数据
      updateCollegeData (res) {
        res.forEach(node => {
          if (node.ind_val === -25535) {
            node.ind_val = ''
          } else {
            node.ind_val = this.precisionNum(node.ind_val)
          }
          let error = this.errorList.find(err => err.id === node.ind_id)
          if (error) {
            if (error.data.findIndex(err => err.id === node.ind_data_id) < 0) {
              this.$set(node, 'remark', false)
            } else {
              this.$set(node, 'remark', true)
            }
          }
          this.tabData.find(item => item.id === node.org_id)[node.year] = node
        })
      },
      // 点击radio改变触发事件
      changeRadio (data) {
        this.getDataByInd({id: data.id, yearRange: this.yearRange, taskId: this.currentTask.id})
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
      // 指标改变后初始化表格显示
      initTabData (data) {
        this.tabThs = []
        let arr = data.orgs[0].val.map(node => {
          return {
            name: String(node.year),
            width: 140,
            index: String(node.year)
          }
        })
        if (this.currentInd.unit.id === 10 || this.currentInd.unit.id === 23) {
          this.tabThs = [].concat([{name: '学院', width: 200, index: 'name'}], arr)
        } else {
          this.tabThs = [].concat([{name: '学院', width: 200, index: 'name'}, {name: '合计', width: '80', index: 'total'}], arr)
        }
        this.tabData = []
        let _self = this
        let errorInd = this.errorList.find(err => err.id === this.currentInd.id)
        if (errorInd) {
          this.tabData = data.orgs.map(node => {
            let obj = {}
            obj.name = node.org_name
            obj.id = node.org_id
            let total = 0
            node.val.forEach(item => {
              let idx = errorInd.data.findIndex(child => child.id === item.ind_data_id)
              if (idx > -1) {
                this.$set(item, 'remark', true)
                this.$set(item, 'text', errorInd.data[idx].remark)
              } else {
                this.$set(item, 'remark', false)
                this.$set(item, 'text', '')
              }
              obj[item.year] = item
              if (item.ind_val === -25535) {
                obj[item.year].ind_val = ''
              } else {
                item.ind_val = _self.precisionNum(item.ind_val)
                total = total + Number(item.ind_val)
              }
            })
            obj.total = _self.precisionNum(total)
            return obj
          })
        } else {
          this.tabData = data.orgs.map(node => {
            let obj = {}
            obj.name = node.org_name
            obj.id = node.org_id
            let total = 0
            node.val.forEach(item => {
              this.$set(item, 'remark', false)
              this.$set(item, 'text', '')
              obj[item.year] = item
              if (item.ind_val === -25535) {
                obj[item.year].ind_val = ''
              } else {
                item.ind_val = _self.precisionNum(item.ind_val)
                total = total + Number(item.ind_val)
              }
            })
            obj.total = _self.precisionNum(total)
            return obj
          })
        }
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
            }
          })
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
      handleReturn () {
        this.togglePage('TaskList')
      },
      initMarkInd () {
        this.fNodes.forEach(node => {
          if (node.is_leaf) {
            let obj = this.errorList.find(err => err.id === node.id)
            if (obj) {
              this.$set(node, 'mark', true)
            } else {
              this.$set(node, 'mark', false)
            }
          }
        })
      },
      handleSubmit () {
        let data = this.currentTask
        let payload = {
          id: data.id,
          subId: data.sub_tasks[0].id,
          remark: this.taskRemark
        }
        MessageBox.confirm(
          '确认提交?',
          '提示',
          {
            type: 'warning'
          }
        ).then(() => {
          new Promise((resolve, reject) => {
            this.commitLoading = true
            this.commitTask({resolve, reject, payload})
          }).then((res) => {
            data.sub_tasks[0].committed_at = true
            if (res) {
              data.task_node = res
            }
            this.commitLoading = false
            this.togglePage('TaskList')
          }).catch(() => {
            this.commitLoading = false
          })
        }).catch(() => {})
      },
      // 计算错误数据个数
      markCurrentInd () {
        let mark = this.errorList.find(node => node.id === this.currentInd.id)
        if (mark) {
          this.currentInd.mark = true
          this.errorCount = mark.data.length
        } else {
          this.currentInd.mark = false
          this.errorCount = 0
        }
      }
    },
    computed: {
      ...mapGetters('write', ['indData']),
      ...mapGetters('config', ['indDetail']),
      ...mapGetters('commitTask', ['nodeTree', 'currentTask', 'subTaskError', 'taskLog']),
      fNodes () {
        return this.flatten(this.nodeTree)
      },
      selectIndDetail () {
        let arr = []
        if (this.indDetail) {
          this.indDetail.forEach(node => {
            arr.push({id: node.id, name: node.name})
          })
        }
        return arr
      }
    },
    watch: {
      indData () {
        if (this.indData && this.indData.orgs && this.indData.orgs.length > 0) {
          if (this.fNodes && this.fNodes.length > 0) {
            this.currentInd = this.fNodes.find(node => node.id === this.indData.ind_id)
            this.initTabData(this.indData)
          } else {
            let timer = setInterval(() => {
              if (this.fNodes && this.fNodes.length > 0) {
                this.currentInd = this.fNodes.find(node => node.id === this.indData.ind_id)
                this.initTabData(this.indData)
                clearInterval(timer)
              }
            }, 10)
          }
        } else {
          this.tabThs = []
          this.tabData = []
        }
      },
      currentInd () {
        this.markCurrentInd()
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
    line-height: 32px;
  }
  .udss-board-toolbox {
    height: 100%;
    width: 300px;
    float: right;
    overflow: hidden;
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
    display: flex;
  }
  .main-box-top span {
    display: inline-block;
    line-height: 48px;
  }
  .main-box-container{
    width: 100%;
    height: calc(100% - 70px);
    margin-top: 10px;
    overflow-y: auto;
    background: #FFFFFF;
  }
  .img-box {
    display: inline-block;
    color: #D96A49;
  }
  .img-box .img-span{
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-left: 15px;
    vertical-align: middle;
    font-size: 0;
  }
  .error-img {
    color: red;
    background: url('../../../assets/img/warn.svg') no-repeat center center;
  }
  .button-add {
    padding: 10px 15px;
  }
</style>
