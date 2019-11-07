<template>
  <Container :title="title" :showDownload="downButton" @downDataA="downCurrentData">
    <template slot="header"></template>
    <template slot="main">
      <div style="width:100%;height: 100%; overflow: hidden;">
        <!--右边的日期选择和tab-->
        <div class="toolbar transition" :style="{width: tabShow ? '300px' : '50px'}">
          <div @click="change" :class="['button-sider', {'is-active': !tabShow}]"></div>
          <transition name="slide-fade">
            <div class="analysis" v-show="tabShow">
              <div class="date-picker" v-if="timeRange">
                年份选择 &nbsp;&nbsp;
                <PickerDate
                  :type="'range'"
                  :range="timeRange"
                  @rangeChange="yearChange($event, 1)"
                ></PickerDate>
                <Checkbox style="margin-left: 5px" title="筛选出图中的非零数据" @change="changeActive" label="" v-model="active">去零 <i class="el-icon-question"></i></Checkbox>
              </div>
              <div class="tab-change">
                <button :class="['tab-button', {'is-active': activeTab === 1}]" @click="activeTab = 1">{{$t('completion.indicator')}}</button>
                <button :class="['tab-button', {'is-active': activeTab === 2}]" @click="activeTab = 2">{{$t('completion.college')}}</button>
              </div>
              <div class="tab-box outIn"  v-show="activeTab === 2">
                <div class="select-table" :style="{paddingTop: topHeight + 'px'}">
                  <div class="tags-box" :style="{marginTop: -topHeight + 'px'}" ref="elementBar">
                    <div class="tags-title">标签选择</div>
                    <div class="tags-list">
                      <button :key="tag.id" @click="changeTag(tag)" :class="['tag-button', {'tag-button-active': tag.active}]" v-for="tag in collegesTag">{{tag.name}}</button>
                    </div>
                  </div>
                  <div class="define-table-th">
                    <Checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></Checkbox>&nbsp;&nbsp;全部院系
                  </div>
                  <ul class="define-table-td">
                    <CheckboxGroup v-model="checkedCollege" @change="handleCheckedChange">
                      <li :key="node.id"  v-for="node in colleges">
                        <Checkbox class="SchoolCollege"
                        :label="node"
                        :key="node.id">
                          {{node.name + '&nbsp;' + '-'  + '&nbsp;' + node.shortName}}</Checkbox>
                        </li>
                    </CheckboxGroup>
                  </ul>
                </div>
              </div>
              <div class="tab-box"        v-show="activeTab === 1">
                <div>
                  <Input
                    :placeholder="$t('element.filterText')"
                    suffix-icon="el-icon-search"
                    v-model="filterText" />
                </div>
                <div class="udss-tree-header">
                  <strong>{{$t('writeInd.indicator')}}</strong>
                  <!--<button title="" :class="[active ? 'IsActive' : 'NoActive']" @click="changeActive">去零操作</button>-->
                  <!--<Checkbox title="筛选出非零的数据值" @change="changeActive" label="去零操作" v-model="active"></Checkbox>-->
                </div>
                <div class="target-tree">
                  <Tree
                    :data="checkedInds"
                    expand-on-click-node
                    :default-expanded-keys="defaultExpanded"
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
            </div>
          </transition>
        </div>
        <!--图像-->
        <div class="main-content">
          <div class="graphAll">
            <div class="graph"  ref="graph" ></div>
            <div class="graph2"  ref="graph2"></div>
          </div>
          <div class="main-table ind-table">
            <Table
              style="width: 100%"
              :row-class-name="tableRowClassName"
              :data="tableData"
              :header-row-class-name="tableHeader"
              height="100%">
              <TableColumn
                v-if="index === 0"
                :sortable="true"
                v-for="(th, index) in tableTh" :key="index"
                :prop="th.prop"
                :min-width="index === 0 ? 200 : 80"
                :align="index === 0 ? 'left': 'center'"
                :label="th.label"
                :sort-by="index === 0 ? 'pinyin' : ''"
                >
              </TableColumn>
              <TableColumn
                v-if="index === 1"
                :sortable="true"
                v-for="(th, index) in tableTh" :key="index"
                :prop="th.prop"
                :min-width="index === 0 ? 200 : 80"
                :align="index === 0 ? 'left': 'center'"
                :label="th.label"
                :sort-method="sort(th.label)"
              >
                <template slot-scope="{ row, column, $index }">
                 <div v-if="title.indexOf('比') === -1 ? true : false">
                   <div v-if="!getInfo.is_ratio">
                     {{(row[tableTh[index].prop]).toFixed(getInfo.decimal)}}
                   </div>
                   <div v-if="getInfo.is_ratio">{{(row[tableTh[index].prop] * 100).toFixed(getInfo.decimal) + '%'}}</div>
                 </div>
                  <div v-else>
                    <span>-</span>
                  </div>
                </template>
              </TableColumn>
              <TableColumn
                v-if="index !== 1 && index !== 0"
                :sortable="true"
                v-for="(th, index) in tableTh" :key="index"
                :prop="th.prop"
                :min-width="index === 0 ? 200 : 80"
                :align="index === 0 ? 'left': 'center'"
                :label="th.label"
                :sort-method="sort(th.label)"
              >
                <template slot-scope="{ row, column, $index }">
                  <div v-if="!getInfo.is_ratio">
                    {{(row[tableTh[index].prop]).toFixed(getInfo.decimal)}}
                  </div>
                  <div v-if="getInfo.is_ratio">{{(row[tableTh[index].prop] * 100).toFixed(getInfo.decimal) + '%'}}</div>
                </template>
              </TableColumn>
            </Table>
          </div>
        </div>
      </div>
    </template>
  </Container>
</template>
<script>
  import { Container, PickerDate } from './widgets'
  import { Row, Col, Progress, DatePicker, Tabs, TabPane, Table, TableColumn, Button, Tree, Radio, Input, Checkbox, CheckboxGroup } from 'element-ui'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import echarts from 'echarts'
  export default {
    name: 'Dashboard',
    components: {
      Container, Row, Col, Progress, DatePicker, Tabs, TabPane, PickerDate, Table, TableColumn, Tree, Radio, Input, Checkbox, CheckboxGroup, Button
    },
    data () {
      return {
        title: '',
        year: [],
        allValue: [],
        timeRange: '',
        startYear: '',
        endYear: '',
        tree: [],
        tableTh: [],
        tableData: [],
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        active: false,
        filterText: '',
        check: [],
        radios: 921,
        currentInd: 921,
        yearData: [],
        tabShow: true,
        charts1: {},
        charts2: {},
        activeTab: 1,
        isIndeterminate: true,
        checkedCollege: [],
        checkAll: false,
        topHeight: 0,
        defaultExpanded: [921],
        downButton: [true, true, false],
        cloneTree: []
      }
    },
    methods: {
      ...mapActions('trendAnalysis', ['getTrend']),
      ...mapActions('target', ['getCheckedInds']),
      ...mapMutations('config', ['config', 'exportDataA']),
      downCurrentData () {
        this.exportDataA({'name': this.title, 'url': '/v1/trend/exc?ind_id=' + this.currentInd + '&start_year=' + this.startYear + '&end_year=' + this.endYear})
      },
      sort (a, b) {
      },
      tableRowClassName ({row, rowIndex}) {
        if (rowIndex > -1) {
          return 'tdHeight'
        }
      },
      tableHeader ({row, rowIndex}) {
        if (rowIndex === 0) {
          return 'tdTrColor'
        }
      },
      create () {
        this.charts1 = echarts.init(this.$refs.graph)
        var option = {
          // title: {
          //   text: '全校总数据',
          //   left: '0',
          //   top: '0',
          //   textStyle: {
          //     fontSize: 16
          //   }
          // },
          tooltip: {
            trigger: 'axis',
            confine: true
          },
          grid: {        // 调图形距离上下左右
            left: '10px',
            right: '0%',
            bottom: '3%',
            top: '7%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: ['100px', '100px'], // 图形左右的间距
            axisTick: {
              show: false
            },
            splitLine: {
              show: false     // 显示x对应的竖线
            },
            name: '',
            nameLocation: 'end',
            nameTextStyle: {
              padding: [26, 0, 0, 10],
              lineHeight: 100
            },
            axisLabel: {
              interval: 0
            },
            data: this.trend && this.trend.length > 0 ? this.colleges[0].year : []
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '全校总数据',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 4,
            itemStyle: {
              normal: {
                color: '#386db3',
                lineStyle: {
                  color: '#386db3'
                }
              }
            },
            data: this.trend && this.trend.length > 0 ? this.allValue : []
          }]
        }
        this.charts1.setOption(option, true)
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
      create2 () {
        let states = this.getInfo.is_ratio
        let decimal = this.getInfo.decimal
        // function color () {
        //   return '#' + '0123456789abcdef'.split('').map(function (v, i, a) {
        //     return i > 5 ? null : a[Math.floor(Math.random() * 16)]
        //   }).join('')
        // }
        let arr = ['#17A589', '#2E86C1', '#D68910', '#884EA0', '#CB4335', '#D4AC0D', '#808B96', '#1ABC9C', '#34AEDB', '#F39C12', '#B659A9', '#EC7063', '#EECA3C', '#73C6B6', '#54A4C7', '#F8C471', '#C39BD3', '#F1948A', '#ADB3BE', '#D0D0D7', '#E84D3E', '#9c67c7', '#b4fdf9', '#196c9a', '#f69fee', '#e004a6', '#1cc7ad', '#945172', '#b7dfb3', '#faf7d8', '#ab3c8b', '#49dcc8', '#ae6509', '#b727fe', '#048fdc', '#49080c', '#dad6b3', '#458ea5', '#eab96e', '#e05c70', '#129886', '#d2132f', '#96580a', '#69b104', '#E808E5', '#736591', '#86a70b', '#f18a08', '#c43f4d', '#ecfd8c', '#078e7c', '#6c2b38', '#3f9dd2', '#670b94', '#75d44d']
        // this.tree.forEach((item, index) => {
        //   var s = color()
        //   var idx = arr.indexOf(s)
        //   if (idx > 0) {
        //     console.log(1111111111)
        //     var es = color()
        //     arr.push(es)
        //   } else {
        //     arr.push(s)
        //   }
        // })
        // console.log(arr, 'color arr')
        var h = this.tree
        this.charts2 = echarts.init(this.$refs.graph2)
        var option = {
          color: arr,
          // title: {
          //   text: '各学院数据',
          //   left: '0',
          //   top: '0',
          //   textStyle: {
          //     fontSize: 16
          //   }
          // },
          legend: {
            type: 'scroll',
//            icon: 'image://http://pic.58pic.com/58pic/13/71/26/37q58PICMgF_1024.jpg',
            // 设置文本为红色
            textStyle: {
//              color: 'red'
            },
            width: 'auto',
            pageIconInactiveColor: 'green',
//            backgroundColor: 'green',
//            selectedMode: 'single'
            data: this.tree ? this.tree.map(item => {
              return item.name
            }) : [],
            left: '10px',
            top: '0',
            selected: {}
          },
          tooltip: {
            trigger: 'axis',
            borderWidth: '1',
            position: function (pos, params, dom, rect, size) {
              // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
              var obj = {top: '-35%'}
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = '20%'
              return obj
            },
            formatter: function (params, ticket, callback) {
//              le.log(params)
              params = params.filter(item => {
                return item.data !== ''
              })
              var res = params
              if (params && params.length > 0) {
                let year = params[0].name + '<br/>'
                let years = params[0].name - 0
                let title = ''
                let child = ''
                let title2 = ''
                // 下面筛选为了和点击了legend数据保持一致
                let group = h.filter(item => {
                  let index = res.some(obj => {
                    return obj.seriesName === item.name
                  })
                  if (index === true) {
                    return item
                  }
                })
                for (var j = 0; j < res.length; j++) {
//                  这是组合院系
                  if (group[j].child) {
                    child = group[j].child.map(item => {
                      var s = item.indicator_data.find(obj => obj.year === years)
                      return '<div style="display: flex; padding-left: 14px">' +
                        '-' + '<div style="float: right;">' + '&nbsp' +
                        item.abridge + '</div>' + ':' + '&nbsp' + '&nbsp' + s.value +
                        '</div>'
                    })
                    title2 +=
                      '<div style="padding:5px; float: left; box-sizing: border-box; ">' + '<div style="float: left">' +
                      params[j].marker + res[j].seriesName + '</div>' + ':' + '&nbsp' + '&nbsp' + params[j].value +
                      '<div >' +
                      child.join('') +
                      '</div>' +
                      '</div>'
                  } else {
//                    这里是普通院系
                    if (states) {
                      title += '<div  style="padding:5px;float: left; box-sizing: border-box; ">' + params[j].marker + res[j].seriesName + ':' + '&nbsp' + (params[j].value * 100).toFixed(decimal) + '%' + '</div>'
                    } else {
                      title += '<div  style="padding:5px;float: left; box-sizing: border-box; ">' + params[j].marker + res[j].seriesName + ':' + '&nbsp' + (params[j].value).toFixed(decimal) + '</div>'
                    }
                  }
                }
                return `<div style="">${year}<div style="display: flex;flex-flow: row wrap;justify-content: flex-start;align-items: center">${title}</div>  <br> <div>${title2}</div></div>`
              }
            },
            extraCssText: this.colleges.length > 12 ? 'width:50%' : this.colleges.length > 6 ? 'width:40%; font-size:12px' : 'width:30%; margin:0 auto'
          },
          grid: {        // 调图形距离上下左右
            left: '10px',
            right: '0%',
            bottom: '0%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: ['100px', '100px'], // 图形左右的间距
            axisTick: {
              show: false
            },
            splitLine: {
              show: false     // 显示x对应的竖线
            },
            name: '',
            nameLocation: 'end',
            nameTextStyle: {
              padding: [26, 0, 0, 10],
              lineHeight: 100
            },
            axisLabel: {
              interval: 0
            },
            data: this.trend && this.trend.length > 0 ? this.colleges[0].year : []
          },
          yAxis: {
            type: 'value'
          },
          series: this.trend && this.trend.length > 0 ? this.tree : []
        }
        this.charts2.setOption(option, true)
      },
      changeActive () {
//        this.active = !this.active
        this.removeZero()
      },
      removeZero () {
        if (this.tree && this.tree.length > 0 && this.active === true) {
          this.tree.forEach(obj => {
            obj.data.forEach((item, idx) => {
              if (item === 0) {
                obj.data[idx] = ''
              }
            })
          })
        } else {
          this.tree.forEach(obj => {
            obj.data.forEach((item, idx) => {
              if (item === '') {
                obj.data[idx] = 0
              }
            })
          })
        }
        this.charts2.dispose()
        this.create2()
      },
      change () {
        this.tabShow = !this.tabShow
        setTimeout(() => {
          if (this.title.indexOf('比') === -1) {
            this.charts1.resize()
          }
          this.charts2.resize()
        }, 400)
      },
      resize () {
        setTimeout(() => {
          this.charts1.resize()
          this.charts2.resize()
        }, 300)
      },
      changeRadio (data) {
        if (data.is_leaf === true) {
          this.defaultExpanded = []
          this.radios = data.id
          this.showWrite(data)
        }
      },
      yearChange (data, id) {
        this.endYear = data.split('-')[1]
        this.startYear = data.split('-')[0]
        new Promise((resolve, reject) => {
          this.getTrend({payload: {ID: this.currentInd, startYear: this.startYear, endYear: this.endYear}, resolve, reject})
        }).then((val) => {
          this.tree = this.colleges
          this.charts1.dispose()
          this.create()
          this.removeZero()
        })
      },
      showWrite (data) {
        this.currentInd = data.id
        new Promise((resolve, reject) => {
          this.getTrend({payload: {ID: this.currentInd, startYear: this.startYear, endYear: this.endYear}, resolve, reject})
        }).then((val) => {
          let graph = document.getElementsByClassName('graph')[0]
          let graph2 = document.getElementsByClassName('graph2')[0]
          this.tree = this.colleges
          this.removeZero()
          if (this.title.indexOf('比') !== -1) {
            this.charts1.dispose()
            graph.style.display = 'none'
            graph2.style.marginTop = '100px'
          } else {
            graph.style.display = 'block'
            graph2.style.marginTop = '0'
            this.charts1.dispose()
            this.create()
          }
        })
      },
      changeTag (val) {
        val.active = !val.active
        let filterData = this.filterCollge()
        let checkedCount = filterData.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.colleges.length
        this.checkAll = checkedCount === this.colleges.length
        this.checkedCollege = filterData
        this.check = filterData
        this.charts1.dispose()
        this.create()
        this.removeZero()
      },
      filterCollge () {
        let arr = []
        this.collegesTag.forEach(tag => {
          if (tag.active === true) {
            let data = this.colleges.filter(node => {
              return node.tags.findIndex(child => child.id === tag.id) > -1
            })
            data.forEach(item => {
              arr.findIndex(eve => eve.id === item.id) < 0 && arr.push(item)
            })
          }
        })
        return arr
      },
      handleCheckedChange (value) {
        this.checkedCollege = value
        this.check = value
        let checkedCount = value.length
        this.checkAll = checkedCount === this.colleges.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.colleges.length
        this.changeActiveTag(value)
      },
      changeActiveTag (data) {
        let arr = []
        data.forEach(node => {
          if (node.tags && node.tags.length > 0) {
            node.tags.forEach(tag => {
              arr.findIndex(child => child.id === tag.id) < 0 && arr.push(tag)
            })
          }
        })
        if (arr.length === this.collegesTag.length) {
          this.collegesTag.forEach(node => {
            node.active = true
          })
        } else if (arr.length === 0) {
          this.collegesTag.forEach(node => {
            node.active = false
          })
        } else {
          this.collegesTag.forEach(node => {
            arr.findIndex(item => item.id === node.id) > -1 ? node.active = true : node.active = false
          })
        }
      },
      handleCheckAllChange (val) {
        this.checkedCollege = val ? this.colleges : []
        this.check = val ? this.colleges : []
        this.isIndeterminate = false
        let status
        this.checkedCollege.length === 0 ? status = false : status = true
        this.collegesTag.forEach(node => {
          node.active = status
        })
      },
      handleSelectDefault () {
        let arr = []
        arr = this.colleges
        this.tree = arr
        this.checkedCollege = arr
        this.check = arr
        let checkedCount = arr.length
        this.checkAll = checkedCount === this.colleges.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.colleges.length
      }
    },
    mounted () {
      this.title = this.$route.meta.title
      this.$nextTick(function () {
        console.log()
        let info = JSON.parse(window.sessionStorage.getItem('udssInfo'))
        this.radios = info.trend_def_ind
        this.currentInd = info.trend_def_ind
        this.defaultExpanded = [info.trend_def_ind]
        this.startYear = new Date().getFullYear() - 4 + ''
        this.endYear = new Date().getFullYear() + ''
        this.timeRange = this.startYear + '-' + this.endYear
        this.getCheckedInds()
        this.topHeight = document.getElementsByClassName('tags-box')[0].offsetHeight + 20
        new Promise((resolve, reject) => {
          this.getTrend({payload: {ID: this.currentInd, startYear: Number(this.startYear), endYear: Number(this.endYear)}, resolve, reject})
        }).then(() => {
        })
      })
      if (this.trend.length > 0) {
        this.handleSelectDefault()
      }
    },
    computed: {
      ...mapGetters('trendAnalysis', ['college', 'trend', 'trendName', 'getInfo']),
      ...mapGetters('target', ['checkedInds']),
      ...mapGetters('config', ['colors']),
      colleges () {
        if (this.trend) {
          return this.trend.map(item => {
            return {child: item.child, name: item.abridge, shortName: item.org_name, smooth: true, type: 'line', year: item.indicator_data.map(obj => { return obj.year }), id: item.org_id, tags: item.tags, data: item.indicator_data.map(obj => { return obj.value })}
          })
        } else {
          return []
        }
      },
      collegesTag () {
        let arr = []
        this.trend === null ? arr = [] : this.trend.forEach(node => {
          if (node.tags && node.tags.length > 0) {
            node.tags.forEach(tag => {
              arr.findIndex(child => child.id === tag.id) < 0 && arr.push(tag)
            })
          }
        })
        arr.forEach(node => {
          this.$set(node, 'active', true)
        })
        arr.sort((a, b) => {
          return a.id - b.id
        })
        return arr
      }
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val)
      },
      trend () {
//        console.log(this.trend)
//        if (this.trend.length === 0) {
//          this.downButton = [true, false, false]
//        } else {
//          this.downButton = [true, true, false]
//        }
        this.tableData = []
        if (this.trendName) {
          this.title = this.$route.meta.title + ' - ' + this.trendName
        }
        this.collegesTag.forEach(node => {
          node.active = true
        })
        this.handleSelectDefault()
        this.yearData = []
        this.trend.length > 0 ? this.yearData = this.colleges[0].year : this.yearData = []
        this.trend.length > 0 ? this.tableTh = this.yearData.map(item => {
          return {label: String(item), prop: String(item)}
        }) : this.tableTh = []
        var yuanXi = {label: '院系', prop: 'name'}
        var total = {label: '总值', prop: 'total'}
        this.tableTh.unshift(yuanXi, total)
        var f = []
        var name = [] // 院系
        var val = [] // 总值
        this.trend ? f = this.trend.map(obj => {
          var obs = {}
          obj.indicator_data.forEach(item => {
            obs[item.year] = item.value
          })
          return obs
        }) : f = []
        this.trend ? name = this.trend.map(obj => {
          return {
            name: obj.abridge + ' - ' + obj.org_name,
            pinyin: obj.pinyin
          }
        }) : name = []
        this.trend ? val = this.trend.map(obj => {
          let obs = 0
          let total = {}
          for (var i = 0; i < obj.indicator_data.length; i++) {
            obs += obj.indicator_data[i].value
          }
          total['total'] = obs
          return total
        }) : val = []
        this.colleges ? this.tableData = f.map((item, index) => {
          item.name = name[index].name
          item.pinyin = name[index].pinyin
          item.total = val[index].total
          return item
        }) : this.tableData = []
//        console.log(this.tableData)
      },
      check () {
        if (this.trend) {
          this.tree = this.check
          this.tree[0] ? this.allValue = this.tree[0].data.map((item, index) => {
            var total = 0
            this.tree.forEach(obj => {
              var num = obj.data[index] - 0
              total += num
            })
            return total.toFixed(this.getInfo.decimal)
          }) : this.allValue = []
          this.create()
          this.create2()
          this.charts1.dispose()
          this.charts2.dispose()
          this.create()
          this.create2()
        }
      },
      colleges () {
        this.cloneTree = JSON.parse(JSON.stringify(this.colleges))
        this.trend.length > 0 ? this.yearData = this.colleges[0].year : this.yearData = []
//        console.log(this.cloneTree)
      }
    }
  }
</script>
<style scoped >
  .tags-title {
    height: 40px;
    padding-left: 50px;
    font-size: 14px;
    line-height: 40px;
    font-weight: bolder;
    background-position: top 10px left 15px;
    background-color: #DBDBDB;
  }
  .tag-button{
    cursor: pointer;
    font-size: 12px;
    margin-top: 10px;
    margin-right: 10px;
    border: none;
    outline: none;
    padding: 5px 10px;
    border-radius: 4px;
    background-color: #F3F3F3;
    color: #545151;
  }
  .select-table {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    overflow: hidden;
    font-size: 12px !important;
    box-sizing: border-box ;
    border-bottom: 1px solid #DBDBDB;
  }
  .define-table-th{
    margin-top: 10px;
    height: 40px;
    padding-left: 20px;
    font-size: 14px;
    background-color: #DBDBDB;
    color: #000000;
    line-height: 40px;
    font-weight: bolder;
  }
  .define-table-td {
    border-left: solid 1px #DBDBDB;
    border-bottom: solid 1px #DBDBDB;
    border-right: solid 1px #DBDBDB;
    height: calc(100% - 140px);
    overflow: hidden;
    overflow-y: scroll;
  }
  .SchoolCollege{
    white-space:normal;
    width: 270px;
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    align-items: center;
    height: 40px;
  }
  .define-table-td li{
    height: 40px;
    display: flex;
    flex-flow: row;
    align-items: center;
    padding-left: 20px;
    border-bottom: solid 1px #DBDBDB;
  }
  .NoActive, .IsActive{
    padding: 7px 15px;
    outline: none;
    border: none;
  }
  .IsActive{
    background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0,#ebb747),color-stop(1,#dba26f));
    color: white;
  }
  .NoActive{
    background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0,#f5f5f5),color-stop(1,#d8d8d8));
    color: #7989B2;
  }
  .tag-button-active{
    color: #FFFFFF;
    background-color: #E4AD59;
    background-image: -moz-linear-gradient(top, #EBB747, #DDA46B);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #EBB747), color-stop(1,#DDA46B));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EBB747', endColorstr='#DDA46B', GradientType =0);
  }
  .toolbar {
    float: right;
    width: 300px;
    height: 100%;
    overflow: hidden;
    margin-left: 20px;
  }
  .main-content {
    width: auto;
    height: 100%;
  }
  .graph{
    margin-top: 10px;
    width: 100%;
    height: 30%;
  }
  .graph2{
    margin-top: 20px;
    width: 100%;
    height: 63%;
  }
  .graphAll{
    overflow: hidden;
    height: 60%;
  }
  .analysis{
    width: 100%;
    margin-top: 30px;
    height: calc(100% - 40px);
  }
  .target-tree{
    height: calc(100% - 100px);
    font-size:14px;
    overflow: hidden;
    overflow-y: scroll
  }
  .slide-fade-enter-active {
    transition: all .4s ease;
  }
  .slide-fade-leave-active {
    transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  .transition {
    transition: all 400ms linear;
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
  .udss-tree-header {
    margin-top: 10px;
    height: 40px;
    line-height: 40px;
    color: #000000;
    text-indent: 45px;
    background-color: #F2F2F2;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content:space-between;
  }
  .button-sider {
    cursor: pointer;
    width: 18px;
    height: 18px;
    float: right;
    background: url(../assets/img/detail.png) no-repeat;
  }
  .button-sider.is-active {
    -moz-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
    filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);
  }
  .date-picker {
    font-size: 14px;
    margin-top: -30px;
  }
  /*新建css*/
  .tab-change {
    margin-top: 10px;
    clear: both;
    height: 40px;
    width: 100%;
  }
  .tab-button {
    float: left;
    cursor: pointer;
    width: 50%;
    line-height: 40px;
    font-size: 16px;
    color: #767474;
    outline: none;
    border: none;
    /*background-color: #eee;*/
    text-decoration: none;
    background-image: -moz-linear-gradient(top, #F2F2F2, #D6D6D6);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #F2F2F2), color-stop(1,#D6D6D6));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#F2F2F2', endColorstr='#D6D6D6', GradientType =0);
  }
  .tab-button.is-active {
    color: #000000;
    background-image: -moz-linear-gradient(top, #F4F4F4, #F4F4F4);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #F4F4F4), color-stop(1,#F4F4F4));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#F4F4F4', endColorstr='#F4F4F4', GradientType =0);
  }
  .tab-box {
    margin-top: 10px;
    width: 100%;
    height: calc(100% - 50px);
    overflow: hidden;
  }
  .main-table {
    height: 40%;
    overflow: hidden;
  }
</style>
