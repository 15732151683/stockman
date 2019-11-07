<template>
  <div style="width: 100%; height: 100%;">
    <div class="udss-board-top">
      <div class="select-time-range">
        <span><strong>录入指标名称：</strong>{{this.currentInd.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span><strong>单位：</strong>{{this.currentInd.unit.name}}</span>
        <!--<span class="img-box" v-if="errorCount">
          <span class="img-span error-img"></span>&nbsp;{{errorCount}}
        </span>-->
      </div>
     <Button
        v-if="!passVisible"
        type="primary"
        size="mini"
        style="margin-left: 20px; background-color: #1EBBA6;"
        class="button-add"
        @click="handlePass">审核通过</Button>
      <!--<Button
       v-if="passVisible && !hasSubmitted"
       type="primary"
       size="mini"
       style="margin-left: 20px; background-color: #1EBBA6;"
       class="button-add"
       @click="handleCancelPass">取消审核通过</Button>
     <Button
       v-if="!passVisible"
       type="primary"
       size="mini"
       style="margin-left: 20px; background-color: #1EBBA6;"
       class="button-add"
       @click="handleSave">保存</Button>
     <Button
       v-if="!passVisible"
       type="primary"
       size="mini"
       style="float: none"
       class="button-add operator-button"
       @click="handleReject">批回重录</Button>-->
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
            :onlyRead="passVisible"
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
  import { Container, LogList, Tabs, SideTree, DataByInd } from '../../widgets'
  export default {
    name: 'CheckTask',
    components: {
      Container, LogList, Tabs, SideTree, DataByInd, Input, Button, MessageBox, Message
    },
    mixins: [ TogglePage, StandTree ],
    data () {
      return {
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
        currentCollege: {},
        currentData: {},
        radios: 921,
        tabThs: [],
        tabData: [],
        selectCollges: [],
        errorList: [],
        errorCount: 0,
        passVisible: false,
        taskRemark: '',
        tabsName: ['指标', '备注历史']
      }
    },
    created () {
      let id = this.currentTask.ind_ids[0]
      this.radios = id
    },
    mounted () {
      this.$nextTick(function () {
        // new Promise((resolve, reject) => {
        //   this.getTaskLog({resolve, reject, payload: {id: this.currentTask.id}})
        // }).then((res) => {
        //   this.taskRemark = res
        // }).catch(() => {})
        new Promise((resolve, reject) => {
          this.getTaskLog({resolve, reject, payload: {id: this.currentTask.id}})
        }).then((res) => {
          this.taskRemark = res
        }).catch(() => {})
        if (this.currentTask.task_node.id > 4) {
          this.passVisible = true
        }
        this.yearRange = this.currentTask.year_range
        this.getDataByInd({id: this.radios, yearRange: this.yearRange, taskId: this.currentTask.id})
      })
    },
    methods: {
      ...mapActions('write', ['getDataByInd']),
      ...mapActions('checkTask', ['checkPass']),
      ...mapActions('commitTask', ['getSubTaskError', 'getTaskLog']),
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
      // 点击radio改变触发事件
      changeRadio (data) {
        this.getDataByInd({id: data.id, yearRange: this.yearRange, taskId: this.currentTask.id})
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
              let idx = errorInd.data.indexOf(item.ind_data_id)
              if (idx < 0) {
                this.$set(item, 'remark', false)
              } else {
                this.$set(item, 'remark', true)
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
      // 审核通过
      handlePass () {
        MessageBox.confirm(
          '确认审核通过?',
          '提示',
          {
            type: 'warning'
          }
        ).then(() => {
          new Promise((resolve, reject) => {
            this.checkPass({resolve, reject, payload: {id: this.currentTask.id, remark: this.taskRemark}})
          }).then((res) => {
            // this.currentTask.task_node = res
            this.togglePage('TaskList')
          }).catch(() => {})
        }).catch(() => {})
      }
    },
    computed: {
      ...mapGetters('write', ['indData']),
      ...mapGetters('commitTask', ['nodeTree', 'currentTask', 'subTaskError', 'taskLog']),
      fNodes () {
        return this.flatten(this.nodeTree)
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
    line-height: 40px;
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
    overflow: hidden;
    background: #FFFFFF;
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
</style>
