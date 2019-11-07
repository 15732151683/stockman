<template>
  <div class="modal-bg">
    <div class="modal-content" @click.stop>
      <div class="modal-head">
        <input placeholder="输入权重名称" v-model="weightName" class="weight-name" />
        <Button style="float: right; background-color: #4A90E2; margin-left: 10px;" type="primary" size="small" class="button-close" @click="handClose">
          返回
        </Button>
        <Button type="primary" size="small" class="button-confirm" @click="confirmCreate" :loading="createSaveLoading" style="float: right;">
          {{$t('weight.confirm')}}
        </Button>
      </div>
      <div class="modal-center" v-show="nowSelTableData.length > 0">
        <div class="weight-chart">
          <div ref="graph" class="weight-graph"></div>
        </div>
        <div class="weight-table">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="width: 150px">{{$t('weight.indType')}}</td>
              <td>{{$t('weight.unSelect')}}</td>
              <td style="text-align: right">{{$t('weight.select')}}</td>
            </tr>
            <tr v-for="(item,index) in nowSelTableData" :key="item.id">
              <td>
                <span class="weight-bar-block" :style="{backgroundColor: color[index]}"></span>
                <span class="weight-bar-name">{{item.name}}</span>
              </td>
              <td colspan="2">
                <div class="weight-bar">
                  <span class="weight-bar-unSelect" :style="{width: (item.total - item.select)/item.total*100+'%', maxWidth: '97%'}">&nbsp;&nbsp;{{item.total - item.select}}</span>
                  <span class="weight-bar-select" :style="{width: item.select/item.total*100+'%', minWidth: '3%'}">{{item.select}}&nbsp;&nbsp;</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="weight-check">
        <div class="weight-check-left">
          全局年份选择：<PickerDate :range="globalYear" @rangeChange="globalYearChange" :width="'140px'" :size="'small'"></PickerDate>
        </div>
        <div class="weight-check-right">
          备注： <Input type="textarea" rows="1" v-model="weightReamrk" style="width: 90%;" />
        </div>
      </div>
      <div class="modal-main">
        <div>
          <button
            v-for="(tab, index) in indType"
            :key="index"
            :class="['ind-type-list', {'is-active': index === activeIndex}]"
            @click="handleClick(index)"
          >{{ tab }}</button>
        </div>
        <div class="ind-table" v-if="testData.length > 0">
          <table cellpadding="0" cellspacing="0" :data = "testData">
            <tr v-for="node in testData" :key="node.id">
              <td :rowspan="item.count" v-for="item in node.parentNode" :key="item.id" v-if="item.id !== testData[0].parentNode[0].id">
                {{item.name}}
              </td>
              <td :colspan="maxDepth - node.level + 1">
                <Checkbox class="ind-checkobox" v-if="node.is_leaf" @change="showchange(node)" v-model="node.status"></Checkbox>{{node.name}}
                <div class="ind-picker-time" v-if="node.is_leaf">
                  <PickerDate :range="node.year_range" @rangeChange="yearChange($event, node)"></PickerDate>
                  <Input placeholder="" :disabled="!node.status" size="mini" class="ind-input" v-model="node.weight" />
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { mapGetters, mapActions } from 'vuex'
  import { TogglePage, ObjInstance, StandTree } from '@/mixins'
  import { Message, Checkbox, Button, Input } from 'element-ui'
  import { PickerDate } from '../../widgets'
  export default {
    name: 'Modal',
    mixins: [ TogglePage, ObjInstance, StandTree ],
    components: {
      Message, Checkbox, Button, Input, PickerDate
    },
    data () {
      return {
        chart: {},
        weightName: '',
        weightReamrk: '',
        nowSelTableData: [],
        color: ['#1CBAA5', '#F24664', '#A243AA', '#ED743E', '#1F9BBA', '#DD6D32', '#3A88FD', '#FF7262', '#F1A616', '#989898', '#989898', '#989898'],
        indType: [],
        activeIndex: 0,
        testData: [],
        depth: 1,
        maxDepth: 1,
        storeParentNode: [],
        checked: false,
        globalYear: '',
        createSaveLoading: false
      }
    },
    mounted () {
      let timer = setInterval(() => {
        if (this.checkedInds.length > 0) {
          this.indType = this.checkedInds.map(node => {
            return node.name
          })
          this.initValue()
          this.testData = this.test()
          this.maxDepth = 0
          this.treeDepth(this.indData)
          clearInterval(timer)
        }
      }, 10)
    },
    methods: {
      ...mapActions('weight', ['createWeight', 'getAllWeight']),
      globalYearChange (data) {
        if (data) {
          this.initYear(data)
          let obj = this.testData
          this.testData = []
          setTimeout(() => {
            this.testData = obj
          }, 10)
        }
      },
      yearChange (data, node) {
        node.year_range = data
      },
      showchange (data) {
        let status = this.allfNodes.find(ite => { return ite.id === data.id }).status
        let parent = ''
        if (data.level === 2) {
          parent = data
        } else {
          parent = this.getNodeData(data)
        }
        this.nowTableData.forEach(node => {
          if (node.id === parent.id) {
            node.select = status ? node.select + 1 : node.select - 1
          }
        })
        this.nowSelTableData = this.nowTableData.filter(node => node.select !== 0)
        this.create()
      },
      handClose () {
        this.togglePage()
      },
      handleClick (index) {
        this.activeIndex = index
        this.testData = this.test()
        this.maxDepth = 0
        this.treeDepth(this.indData)
      },
      // 获取tree最大深度
      treeDepth (branch) {
        branch.forEach(node => {
          let children = node.children
          children && this.treeDepth(children)
          if (this.maxDepth < node.level) {
            this.maxDepth = node.level
          }
        })
      },
      // 获取父级指标
      getParentData (data) {
        return this.fNodes.find(node => node.id === data.pid) || {}
      },
      // 获取根父级指标
      getNodeData (data) {
        let node = this.getParentData(data)
        return node.level === 2 ? node : this.getNodeData(node)
      },
      // 获取指标父级路径指标
      getParentNode (node) {
        this.storeParentNode = []
        let nodes = node
        let allParentObj = []
        nodes.forEach(data => {
          let wrapper = data
          let counter = 0   // 限制循环层级, 同时也限制了树深
          let parentObj = []
          let arr = []
          while (wrapper.pid > 0 && counter++ < 10) {
            let parent = this.clone(this.getParentData(wrapper))
            if (arr.indexOf(parent.id) < 0) {
              arr.push(parent.id)
              if (this.storeParentNode.indexOf(parent.id) < 0) {
                parentObj.push({'name': parent.name, 'id': parent.id})
              }
              this.storeParentNode.push(parent.id)
            }
            parent.children = [wrapper]
            wrapper = parent
          }
          allParentObj.push(parentObj.reverse())
        })
        allParentObj.forEach(node => {
          node.forEach(item => {
            let count = null
            this.storeParentNode.forEach(num => {
              if (num === item.id) {
                count++
              }
            })
            Object.assign(item, {
              'count': count
            })
          })
        })
        nodes.forEach((data, index) => {
          Object.assign(data, {
            parentNode: allParentObj[index]
          })
        })
        return nodes
      },
      test () {
        return this.getParentNode(this.rootNodes)
      },
      initValue () {
        let now = new Date().getFullYear()
        let timer = now + '-' + now
        this.allfNodes.forEach((data) => {
          this.$set(data, 'weight', '')
          this.$set(data, 'status', false)
          data.year_range = timer
        })
      },
      initYear (year) {
        this.allfNodes.forEach((data) => {
          data.year_range = year
        })
      },
      confirmCreate () {
        new Promise((resolve, reject) => {
          this.createSaveLoading = true
          this.createWeight({
            payload: {'weightName': this.weightName, 'indicators': this.indicators, 'remark': this.weightReamrk},
            resolve,
            reject
          })
        }).then(() => {
          Message({
            message: this.$t('element.createSuccess'),
            type: 'success'
          })
          this.createSaveLoading = false
          this.getAllWeight()
          this.togglePage()
        }).catch((message) => {
          this.createSaveLoading = false
          Message({
            message: this.$t('element.createFailure') + message,
            type: 'error'
          })
        })
      },
      create () {
        let _self = this
        this.chart = echarts.init(this.$refs.graph)
        this.chart.setOption({
          animation: false,
          tooltip: {
            trigger: 'item',
            confine: true,
            formatter: '{a} <br/> {b} : {c} ({d}%)'
          },
          color: _self.color,
          series: [
            {
              avoidLabelOverlap: false,
              // 如果不需要开启该策略，例如圆环图这个例子中需要强制所有标签放在中心位置，可以将该值设为 false
              hoverAnimation: false,
              name: this.$t('weight.chart'),
              type: 'pie',
              center: ['50%', '50%'],
              radius: ['65%', '100%'],
              itemStyle: {
                normal: {
                  boderWidth: 2,
                  borderColor: '#fff',
                  label: {
                    show: false,
                    position: 'center'
                  },
                  labelLine: {
                    show: false
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    textStyle: {
                      fontSize: '20',
                      fontWeight: 'bold'
                    }
                  }
                }
              },
              data: _self.nowSelTableData.map(node => {
                return {
                  'value': node.select,
                  'name': node.name
                }
              })
            }
          ]
        })
      }
    },
    computed: {
      ...mapGetters('target', ['checkedInds']),
      allfNodes () {
        return this.flatten(this.checkedInds)
      },
      fNodes () {
        return this.flatten(this.indData)
      },
      rootNodes () {
        return this.fNodes.filter(node => {
          return !node.children || node.children.length === 0
        })
      },
      nowTableData () {
        let arr = []
        arr = this.checkedInds.map(node => {
          let count = 0
          this.flatten([node]).forEach(item => {
            if (item.is_leaf === true) {
              count++
            }
          })
          return {
            'id': node.id,
            'name': node.name,
            'total': count,
            'select': 0
          }
        })
        return arr
      },
      indData () {
        return [this.checkedInds[this.activeIndex]]
      },
      indicators () {
        return this.allfNodes.filter(node => node.status === true).map(item => {
          return {
            id: item.id,
            weight: Number(item.weight),
            year_range: item.year_range
          }
        })
      }
    }
  }
</script>

<style scoped>
  .modal-bg {
    position: fixed;
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1049;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal-content {
    margin-top: 20px;
    width: 900px;
    padding: 20px 25px;
    margin-left: auto;
    margin-right: auto;
    background-color: #fff;
    border-radius: 3px;
    border: 1px solid rgba(0,0,0,.2);
    overflow: hidden;
    position: relative;
  }
  .modal-head {
    overflow: hidden;
  }
  .weight-name {
    width: 400px;
    line-height: 26px;
    padding: 4px 10px;
    font-size: 16px;
    border: none;
    outline: none;
    float: left;
    color: #9D9D9D;
    background-color: #F3F3F3;
    border-radius: 4px;
  }
  .weight-check{
    margin-top: 20px;
    line-height: 40px;
    color: #757575;
    font-size: 14px;
    overflow: hidden;
  }
  .weight-check-left {
    margin-top: 2px;
    float: left;
    width: 40%;
  }
  .weight-check-right {
    float: right;
    width: 60%;
  }
  .modal-center {
    margin-top: 20px;
    overflow: hidden;
  }
  .weight-chart {
    width: 230px;
    height: 230px;
    float: left;
    margin-left: 60px;
  }
  .weight-graph {
    width: 230px;
    height: 230px;
  }
  .weight-table {
    width: 430px;
    float: right;
  }
  .weight-table table{
    width: 420px;
    border: 1px solid #E6E6E6;
    text-align: left;
    line-height: 36px;
  }
  .weight-table table tr{
    border: solid 1px red;
  }
  .weight-table table tr:first-of-type{
    background: #1EBBA6;
    color: #ffffff;
  }
  .weight-table table tr td:first-of-type{
    padding-left: 10px;
  }
  .weight-table table tr td:last-of-type{
    padding-right: 10px;
  }
  .weight-bar {
    width: 100%;
    height: 20px;
    margin-top: 7px;
    line-height: 20px;
    font-size: 0;
  }
  .weight-bar-block {
    width: 10px;
    height: 10px;
    display: inline-block;
  }
  .weight-bar-name {
    margin-left: 10px;
    display: inline-block;
    font-size: 14px;
  }
  .weight-bar-unSelect {
    height: 100%;
    background-color: #EDEDED;
    color: #F2516B;
    display: inline-block;
    font-size: 14px;
  }
  .weight-bar-select {
    height: 100%;
    background-color: #1EBBA6;
    color: #ffffff;
    text-align: right;
    display: inline-block;
    font-size: 14px;
  }
  .modal-main {
    margin-top: 10px;
  }
  .ind-type-list {
    padding: 6px 10px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border: 1px solid #ccc;
    cursor: pointer;
    background: #f0f0f0;
    margin-bottom: -1px;
    margin-right: 3px;
    outline: none;
  }
  .ind-type-list.is-active {
    background: #FFFFFF;
    color: #1EBBA6;
    border-bottom: none;
  }
  .ind-table {
    border: 1px solid #ccc;
    padding: 10px;
    font-size: 14px;
    overflow: hidden;
  }
  .ind-table table {
    width: 100%;
    line-height: 30px;
    overflow: hidden;
  }
  .ind-table table td{
    background-color: #F3F3F3;
    border: solid 2px #ffffff;
    overflow: hidden;
    word-break:break-all;
    word-wrap:break-word;
  }
  .ind-checkobox{
    word-wrap:break-word;
    float: left;
  }
  .ind-input {
    width: 100px;
  }
  .ind-picker-time{
    float: right;
    height: 28px;
    line-height: 28px;
  }
  .hidden {
    display: none;
  }
</style>
