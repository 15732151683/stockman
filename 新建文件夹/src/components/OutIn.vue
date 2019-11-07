<template>
  <Container :title="title" @downDataA="downCurrentData" @downDataB="downAllData" :showDownload="downButton">
    <template slot="header"></template>
    <template slot="main">
      <SideTable
        @handleChange="checkedChange"
        @handleShow="changeTab"
        :colleges="colleges"
        :collegeTag="collegeTag"
        :allData="allData"
        :tabShow="tabShow">
      </SideTable>
      <div style="height: 100%; width: auto; overflow: hidden;">
        <table cellspacing="0" cellpadding="0" class="table-box">
          <tr>
            <td style="height: 40px;">
              <div class="toolbar-box" v-if="converts.length > 0">
                <div class="toolbar-right">
                  <span class="toolbar-right-title">投入指标</span>
                  <div
                    class="btn-wrapper"
                    v-for="(btn, bIndex) in btns"
                    :key="bIndex">
                    <button
                      class="btn btn-img"
                      :class="[btn.added ? btn.icon : btn.icon + '-unused']"
                      @click="toggleAdded(btn)">
                      {{btn.text}}
                    </button>
                    <div class="convert-box" v-if="btn.expand && btn.added">
                      <div v-if="btn.unit !== '元' && btn.id !== 4">
                        <div class="poper-label">
                          <label>&nbsp;&nbsp;1 {{btn.unit}}&nbsp;
                            <span><span class="fa fa-caret-right"></span>&nbsp;￥</span>
                          </label>
                        </div>
                        <div class="poper-input">
                          <input v-model="converts[bIndex].convert_param" style="width: 40px;" type="text" @keyup.enter="toggleCount"/>
                        </div>
                        <div class="poper-button">
                          <Button type="primary" size="mini" style="background-color: #1ebba6;" @click="toggleCount(converts[bIndex])">{{$t('outIn.edit')}}</Button>
                        </div>
                      </div>
                      <div v-if="btn.id === 4">
                        <div class="poper-label">
                          <label>&nbsp;&nbsp;折旧率&nbsp;</label>
                        </div>
                        <div class="poper-input">
                          <input v-model="converts[bIndex].convert_param" style="width: 40px;" type="text" @keyup.enter="toggleCount"/>
                        </div>
                        <span>&nbsp;% </span>
                        <div class="poper-button">
                          <Button type="primary" size="mini" style="background-color: #1ebba6;" @click="toggleCount(converts[bIndex])">{{$t('outIn.edit')}}</Button>
                        </div>
                      </div>
                      <!--<span v-if="btn.id === 4">&nbsp;% {{$t('outIn.year')}}</span>-->
                      <div class="poper-picker" v-if="timeRange.length > 0">
                        &nbsp;&nbsp;
                        <PickerDate
                          :range="timeRange[bIndex]"
                          :width="'110px'"
                          @rangeChange="yearChange($event, bIndex)"
                          :type="'range'">
                        </PickerDate>
                        <div class="poper-button">
                          <Button
                            type="primary"
                            size="mini"
                            style="background-color: #1ebba6;"
                            @click="toggleYear">确定</Button>
                        </div>
                      </div>
                    </div>
                    <span :class="['space-convert', {'space-convert-active': btn.added}]"  @click.stop="togglePoper(btn)">
                <i class="el-icon-caret-right"></i>
              </span>
                  </div>
                </div>
              </div>
              <div style="width: 100%; height: 1px; overflow: hidden;"></div>
              <div class="toolbar-box" style="margin-top: 10px;" v-if="converts.length > 0">
                <!--<div class="toolbar-left"><strong>{{$t('outIn.scheme')}}</strong></div>-->
                <div class="toolbar-right">
                  <span class="toolbar-right-span">评价方案</span>
                  <button :title="node.name" :key="node.id" @click="changeScheme(node.id)" v-for="node in showScheme" :class="['type-button', {'is-active': node.id === activeScheme}]">{{node.short_name}}</button>
                  <div class="sort-wrapper">
                    <ButtonGroup>
                      <Button
                        v-for="btn in sorts"
                        :key="btn.id"
                        class="btn-sort"
                        :class="{'is-select': btn.selected}"
                        size="small" @click="toggleSort(btn)"
                        :title="btn.title">
                        <span v-if="btn.id === 0">A-Z</span>
                        <span v-else class="fa" :class="btn.class"></span>
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="content">
                <div ref="graph" class="graph-wrapper"></div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </template>
  </Container>
</template>

<script>
  import echarts from 'echarts'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Container, SideTable, PickerDate } from './widgets'
  import { Button, ButtonGroup, Table, TableColumn } from 'element-ui'
  export default {
    name: 'OutIn',
    components: {
      Container, Button, ButtonGroup, Table, TableColumn, SideTable, PickerDate
    },
    data () {
      return {
        title: '',
        chart: {},
        activeScheme: '',
        tabShow: true,
        icons: [
          'btn-building', 'btn-faculty', 'btn-funding', 'btn-equipment', 'btn-teacher'
        ],
        btns: [],
        sorts: [
          {
            id: 0,
            name: 'char',
            class: '',
            selected: false,
            title: this.$t('output.sortC')
          },
          {
            id: 1,
            name: 'asc',
            class: 'fa-sort-amount-asc icon-rotate',
            selected: false,
            title: this.$t('output.sortA')
          },
          {
            id: 2,
            name: 'desc',
            class: 'fa-sort-amount-asc',
            selected: false,
            title: this.$t('output.sortB')
          }
        ],
        sortMode: -1,
        results: [
          {
            name: '',
            sum: 0,
            ratio: '0.000',
            data: []
          }
        ],
        filterResult: [
          {
            name: '',
            sum: 0,
            ratio: '0.000',
            data: []
          }
        ],
        max: true,
        graphType: 'value',
        checkedCollege: [],
        timeRange: [],
        timeData: [],
        colleges: [],
        downButton: [],
        num: 0
      }
    },
    created () {
      this.setAllData([])
    },
    mounted () {
      this.getScheme()
//      this.$nextTick(function () {
      new Promise((resolve, reject) => {
        this.getConvert({resolve, reject})
      }).then(() => {
        this.btns = this.initConvert(this.converts)
        this.computedData()
        this.getAllData({'id': -1, 'inds': this.timeData})
        let timer = setInterval(() => {
          if (this.allData.length > 0 && this.converts.length > 0 && this.showScheme.length > 0) {
            this.activeScheme = this.showScheme[0].id
            this.downButton = [true, true, false]
            this.timeRange = this.getRangeYear()
            clearInterval(timer)
          }
        }, 10)
      }).catch(() => {})
//      })
    },
    computed: {
      ...mapGetters('outIn', ['allData', 'converts']),
      ...mapGetters('evaluation', ['schemes']),
      ...mapGetters('config', ['colors']),
      showScheme () {
        return this.schemes
      },
      collegeTag () {
        let arr = []
        this.allData.forEach(node => {
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
      allData () {
        if (this.allData.length === 0) {
          this.results = []
          this.create()
          this.chart.dispose()
        } else {
          this.generate()
        }
      },
      checkedCollege () {
        this.filterCreate()
      }
    },
    methods: {
      ...mapActions('outIn', ['getCollege', 'getAllData', 'getConvert', 'updateConvert']),
      ...mapMutations('outIn', ['setAllData']),
      ...mapActions('evaluation', ['getScheme']),
      ...mapMutations('config', ['config', 'exportDataA', 'exportDataB']),
      // 数据下载
      downCurrentData () {
        let arr1 = this.activeScheme
        this.computedData()
        let arr2 = this.timeData.map((node, index) => {
          return {
            is_select: this.btns[index].added,
            year_range: node.year_range,
            ind_id: node.ind_id
          }
        })
        let params = {'ids': arr1, 'inds': JSON.stringify(arr2), 'multiple': this.num}
        this.exportDataB({'name': '投入产出', 'url': '/v1/ior/exp/', 'type': 'query', 'params': params})
      },
      downAllData () {
        let arr1 = this.schemes.map(node => node.id).join(',')
        this.computedData()
        let arr2 = this.timeData.map(node => {
          return {
            is_select: true,
            year_range: node.year_range,
            ind_id: node.ind_id
          }
        })
        let params = {'ids': arr1, 'inds': JSON.stringify(arr2)}
        this.exportDataB({'name': '投入产出', 'url': '/v1/ior/exp/', 'type': 'query', 'params': params})
      },
      // 获取默认年份数据
      getRangeYear () {
        let len = this.allData.length
        let chilLen = this.allData[0].ind_data.length
        let range = []
        for (let i = 0; i < chilLen; i++) {
          for (let j = 0; j < len; j++) {
            if (this.allData[j].ind_data[i].start_year !== 0) {
              range[i] = this.allData[j].ind_data[i].start_year + '-' + this.allData[j].ind_data[i].end_year
              break
            }
            range[i] = ''
          }
        }
        let newRange = []
        range.forEach((node) => {
          newRange.push(node)
        })
        return newRange
      },
      initConvert (data) {
        let arr = []
        if (data && data.length > 0) {
          data.forEach(node => {
            let obj = {
              id: node.type_id,
              icon: this.icons[node.type_id - 1],
              text: node.display_text,
              active: true,
              added: true,
              convert: true,
              expand: false,
              unit: node.unit_name,
              decimal: node.decimal
            }
            arr.push(obj)
          })
        }
        return arr
      },
      yearChange (data, id) {
        this.timeRange[id] = data
      },
      toggleYear () {
        setTimeout(() => {
          this.computedData()
          this.getAllData({'id': this.activeScheme, 'inds': this.timeData})
        }, 10)
      },
      computedData () {
        this.timeData = this.converts.map((node, index) => {
          let year = this.timeRange[index]
          return {
            ind_id: node.indicator_id,
            year_range: !year ? '' : year
          }
        })
      },
      checkedChange (data) {
        this.checkedCollege = data
      },
      changeTab () {
        this.tabShow = !this.tabShow
        setTimeout(() => {
          this.chart.resize()
        }, 500)
      },
      changePage () {
        this.$router.push('/weight')
      },
      changeScheme (id) {
        this.activeScheme = id
        this.computedData()
        this.getAllData({'id': id, 'inds': this.timeData})
      },
      thousandium (num) {
        const thorough = function (num) {
          return num.length > 3 ? num.slice(0, 3).concat(['', ...thorough(num.slice(3))]) : num
        }
        let strs = num.toLocaleString().split('.')
        return isNaN(num) ? num : thorough(strs[0].split('').reverse()).reverse().concat(strs[1] ? ['.', strs[1]] : []).join('')
      },
      // 设置颜色
      setColorIndex (tree) {
        tree.forEach((item, index) => {
          if (index < 23) {
            item.id = index
          } else {
            item.id = 22
          }
        })
      },
      // 数字精度处理
      precisionNum (data, decimal) {
        let num = +data
        let mul = Math.pow(10, decimal)
        return (Math.round(num * mul) / mul).toFixed(decimal) * 1
      },
      generate () {
        this.results = this.initTable(this.allData)
        this.results.forEach(node => {
          if (node.child && node.child.length > 0) {
            node.child = this.initTable(node.child, 'child')
          }
        })
        this.results.sort((a, b) => {
          return b.sum - a.sum
        })
        this.colleges = this.results.map(item => {
          return {'name': item.name, 'value': item.sum, 'tags': item.tags, 'id': item.id, 'abridge': item.short_name}
        })
        this.setColorIndex(this.results)
      },
      initTable (table, child) {
        let arr = table.map((item, yIndex) => {
          let data = []
          let sum = 0
          this.btns.forEach((btn, bIndex) => {
            if (btn.added) {
//              let value = this.output[yIndex] * 1000 / this.input[bIndex].converted[yIndex]
              if (item.ind_data[bIndex].ind_val) {
                let value = 0
                if (btn.id === 4) {
                  value = item.ind_data[bIndex].ind_val * this.converts[bIndex].convert_param / 100
                } else {
                  value = item.ind_data[bIndex].ind_val * this.converts[bIndex].convert_param
                }
                value = this.precisionNum(value, btn.decimal)
                let raw = this.precisionNum(item.ind_data[bIndex].ind_val, btn.decimal)
                data.push({
                  name: item.ind_data[bIndex].name,
                  value: value,
                  unit: item.ind_data[bIndex].unit,
                  raw,
                  id: btn.id
                })
                sum += value
              }
            }
          })
          return {
            name: item.org_name,
            sum: sum ? item.score / sum : 0,
            data,
            pinyin: item.pinyin,
            short_name: item.short_name,
            id: item.org_id,
            tags: item.tags,
            child: item.child
          }
        })
        if (child !== 'child') {
          arr.sort((a, b) => {
            return a.sum - b.sum
          })
          let center = Math.ceil(arr.length / 2)
          let count = 0
          if (center) {
            let val = arr[center - 1].sum
            if (val) {
              count = this.multiple(val)
            } else {
              count = 0
            }
          }
          let mul = Math.pow(10, -count)
          arr.forEach(node => {
            if (node.sum !== 0) {
              node.sum = this.precisionNum(node.sum * mul, 2)
            }
          })
          this.num = count
        } else {
          let mul = Math.pow(10, -this.num)
          arr.forEach(node => {
            if (node.sum !== 0) {
              node.sum = this.precisionNum(node.sum * mul, 2)
            }
          })
        }
        return arr
      },
      multiple (num) {
        num = Math.abs(num)
        if (num > 1) {
          return String(num.toFixed(0)).length - 1
        } else {
          let a = 0
          for (let i = 1; true; i++) {
            num = num * 10
            if (num > 1) {
              a = -i
              break
            }
          }
          return a
        }
      },
      filterCreate () {
        this.filterResult = this.results.filter(node => {
          return this.checkedCollege.findIndex(item => item.name === node.name) > -1
        })
        if (this.sortMode === -1) {
          this.toggleSort(this.sorts[1])
        } else {
          this.sort()
          this.chart.dispose()
          this.create()
        }
      },
      toggleCount (data) {
        new Promise((resolve, reject) => {
          this.updateConvert({
            payload: data,
            resolve,
            reject
          })
        }).then(() => {
          this.generate()
          this.filterCreate()
        })
      },
      togglePoper (btn) {
        if (btn.added && btn.convert) {
          btn.expand = !btn.expand
        }
      },
      toggleAdded (btn) {
        btn.added = !btn.added
        this.generate()
        this.filterCreate()
      },
      toggleSort (sort) {
        this.sortMode = sort.id
        for (let item of this.sorts) {
          item.selected = item.id === sort.id
        }
        this.sort()
        this.create()
      },
      sort () {
        switch (this.sortMode) {
          case 0:
            this.filterResult.sort((a, b) => {
              return a.pinyin.toLowerCase() > b.pinyin.toLowerCase() ? -1 : 1
            })
            break
          case 1:
            this.filterResult.sort((a, b) => {
              return a.sum - b.sum
            })
            break
          case 2:
            this.filterResult.sort((a, b) => {
              return b.sum - a.sum
            })
            break
        }
      },
      create () {
        let _self = this
        this.chart = echarts.init(this.$refs.graph)
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            confine: true,
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            backgroundColor: '#fff',
            borderColor: '#fff',
            padding: [10, 15],
            textStyle: {
              color: '#7b7b7b',
              fontFamily: 'roboto'
            },
            extraCssText: 'line-height:14px;border: 1px solid #c5c5c4;border-radius:0;',
            formatter: function (params) {
              let data = _self.filterResult[params[0].dataIndex]
              // console.log(data, '1111111')
              let childData = ''
              if (data.child) {
                data.child.forEach(node => {
                  childData += '<div class="chart-tooltip chart-tooltip-outIn" style="float: left;"><h1 style="color: #7B7B7B; background: #EEEEEE; margin: 0 5px;">' +
                    node.name + '</h1><table>' +
                    '<tr>' +
                    '<td><strong>' + _self.$t('outIn.title') + '</strong></td>' +
                    '<td><strong>' + node.sum + (_self.num === 0 ? '' : (' E' + (_self.num > 0 ? ('+' + _self.num) : _self.num))) + '</strong></td><td></td></tr>'
                  if (node.data) {
                    childData += node.data.map(item => {
                      if (item.unit === '元' && item.id !== 4) {
                        return '<tr>' +
                          '<td>' + item.name + '</td>' +
                          '<td>' + item.value.toLocaleString() + ' 元</td>' +
                          '<td></td></tr>'
                      } else {
                        return '<tr>' +
                          '<td>' + item.name + '</td>' +
                          '<td>' + item.value.toLocaleString() + ' 元</td>' +
                          '<td>(指标值：' + item.raw.toLocaleString() + ' ' + item.unit + ')</td></tr>'
                      }
                    }).join('') + '</table></div>'
                  }
                })
              }
              return '<div class="chart-box-outIn"><div class="chart-tooltip chart-tooltip-outIn">' +
                '<h1>' + data.name + '</h1>' +
                '<table>' +
                '<tr>' +
                '<td><strong>' + _self.$t('outIn.title') + '</strong></td>' +
                '<td><strong>' + data.sum + (_self.num === 0 ? '' : (' E' + (_self.num > 0 ? ('+' + _self.num) : _self.num))) + '</strong></td>' +
                '<td></td>' +
                '</tr>' +
                data.data.map(item => {
                  if (item.unit === '元' && item.id !== 4) {
                    return '<tr class="list-item">' +
                      '<td>' + item.name + '</td>' +
                      '<td>' + item.value.toLocaleString() + '元</td>' +
                      '<td></td>' +
                      '</tr>'
                  } else {
                    return '<tr class="list-item">' +
                      '<td>' + item.name + '</td>' +
                      '<td>' + item.value.toLocaleString() + ' 元</td>' +
                      '<td>(指标值：' + item.raw.toLocaleString() + ' ' + item.unit + ')</td>' +
                      '</tr>'
                  }
                }).join('') +
                '</table></div>' + childData +
                '</div>'
            }
          },
          grid: {
            left: '60px',
            top: '20px',
            right: '8%',
            bottom: '20px'
          },
          xAxis: {
            type: _self.graphType,
            // logBase: 10,
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            name: _self.num === 0 ? '' : ('x E ' + (_self.num > 0 ? ('+' + _self.num) : _self.num)),
            nameLocation: 'end',
            nameTextStyle: {
              padding: [26, 0, 0, 10],
              lineHeight: 100
            }
            // max: _self.max ? _self.maxValue : null
          },
          yAxis: {
            type: 'category',
            data: _self.filterResult.map(item => item.short_name),
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            }
          },
          series: [{
            name: 'Ratio',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: function (params) {
                  return _self.colors[_self.filterResult[params.dataIndex].id]
                }
              }
            },
            data: _self.filterResult.map(term => term.sum),
            markLine: {
              lineStyle: {
                normal: {
                  type: 'dashed',
                  color: '#999'
                }
              },
              label: {
                normal: {
                  show: true,
                  position: 'end',
                  formatter (params) {
                    return _self.$t('outIn.text') + _self.thousandium(params.value) + (params.value === 0 ? '' : (' E' + (_self.num > 0 ? ('+' + _self.num) : _self.num)))
                  }
                }
              },
              symbol: 'image://',
              data: [
                {
                  name: 'Institution average',
                  type: 'average'
                }
              ]
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                color: '#333',
                formatter (params) {
                  return _self.filterResult[params.dataIndex].sum * 1 + (_self.num === 0 ? '' : (' E' + (_self.num > 0 ? ('+' + _self.num) : _self.num)))
                }
              }
            }
          }]
        })
      },
      resize () {
        setTimeout(() => {
          this.chart.resize()
        }, 300)
      },
      dispose () {
        this.chart.dispose()
      }
    }
  }
</script>

<style scoped>
  .table-box {
    width: 100%;
    height: 100%;
  }
  .toolbar-box {
    width: 100%;
  }
  .toolbar-left {
    float: left;
    width: 130px;
    padding-right: 20px;
    text-align: right;
    line-height: 42px;
    color: #4A4A50;
  }
  .toolbar-right {
    padding-right: 20px;
  }
  .toolbar-right-span {
    line-height: 34px;
    float: left;
    color: #ADADAD;
    font-size: 14px;
  }
  .toolbar-right-title {
    line-height: 44px !important;
    float: left;
    color: #ADADAD;
    font-size: 14px;
  }
  .type-button {
    cursor: pointer;
    line-height: 18px;
    font-size: 14px;
    padding: 8px 20px;
    color: #767474;
    outline: none;
    border: none;
    margin: 0 4px;
    text-decoration: none;
    background-image: -moz-linear-gradient(top, #F5F5F5, #D8D8D8);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #F5F5F5), color-stop(1,#D8D8D8));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#F5F5F5', endColorstr='#D8D8D8', GradientType =0);
  }
  .type-button.is-active {
    color: #ffffff;
    background-image: -moz-linear-gradient(top, #EBB747, #DBA26F);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #EBB747), color-stop(1,#DBA26F));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EBB747', endColorstr='#DBA26F', GradientType =0);
  }
  .content {
    width: 100%;
    height: calc(100% - 20px);
    overflow: hidden;
    overflow-y: scroll;
  }
  .graph-wrapper {
    overflow: hidden;
    height: 100%;
  }
  .convert-box {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    line-height: 32px;
    background-color: #fff;
    z-index: 1050;
    color: #c3c0bf;
    font-size: 12px;
    border: 1px solid #cecece;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .poper-label,
  .poper-input,
  .poper-button {
    display: inline-block;
    vertical-align: top;
    text-align: center;
  }
  .poper-picker{
    width: 100%;
  }
  .poper-input {
    padding: 5px 0;
  }
  .poper-input input {
    width: 40px;
    display: block;
    font-size: 12px;
    padding: 3px 0;
    color: #495057;
    text-align: center;
    background-color: #fff;
    background-image: none;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  }
  .poper-input input:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: none;
  }
  .poper-button button {
    padding: 4px 2px;
  }
  .btn-wrapper {
    position: relative;
    float: left;
    margin-left: 5px;
    line-height: 1;
  }
  .btn {
    outline: none;
    border: 1px #D8D8D8 solid;
    transition: 500ms;
  }
  .btn-img {
    color: #9B9B9B;
    background-color: #F0F0F0;
    height: 40px;
    cursor: pointer;
    line-height: 40px;
    font-weight: bold;
    background-repeat: no-repeat;
    background-position: 10px 5px;
    background-size: auto 30px;
    padding-right: 40px;
    padding-left: 50px;
    min-width: 190px;
  }
  .space-convert {
    position: absolute;
    top: 1px;
    right: 0;
    height: 40px;
    width: 25px;
    display: block;
    clear: both;
    cursor: pointer;
    line-height: 40px;
  }
  .space-convert i {
    color: #9B9B9B;
  }
  .space-convert-active i {
    color: #FFFFFF;
  }
  .btn-faculty-unused {
    background-image: url(../assets/img/faculty.svg);
  }
  .btn-faculty {
    background-image: url(../assets/img/faculty2.svg);
    background-color: #79CDF1;
    color: #FFFFFF;
  }
  .btn-funding-unused {
    background-image: url(../assets/img/funding.svg);
  }
  .btn-funding {
    background-image: url(../assets/img/funding2.svg);
    background-color: #F5C45C;
    color: #FFFFFF;
  }
  .btn-building-unused {
    background-image: url(../assets/img/building.svg);
  }
  .btn-building {
    background-image: url(../assets/img/building2.svg);
    background-color: #85CBBB;
    color: #FFFFFF;
  }
  .btn-equipment-unused {
    background-image: url(../assets/img/equipment.svg);
  }
  .btn-equipment {
    background-image: url(../assets/img/equipment2.svg);
    background-color: #F97288;
    color: #FFFFFF;
  }
  .btn-teacher-unused {
    background-image: url(../assets/img/teacher.svg);
  }
  .btn-teacher {
    background-image: url(../assets/img/teacher2.svg);
    background-color: #8D96CF;
    color: #FFFFFF;
  }
  .hidden {
    visibility: hidden;
  }
  .sort-wrapper {
    overflow: hidden;
    text-align: left;
    float: right;
    margin-left: 20px;
  }
  .btn-sort {
    width: 60px;
    height: 34px;
    font-size: 14px;
    border: 1px solid #ebeef0;
  }
  .btn-sort:hover {
    color: #606266;
    background-color: #fff;
  }
  .btn-char {
    background-image: url(../assets/img/sort-char-unselected.png);
  }
  .btn-asc {
    background-image: url(../assets/img/sort-asc-unselected.png);
  }
  .btn-desc {
    background-image: url(../assets/img/sort-desc-unselected.png);
  }
  .btn-sort.is-select {
    border-color: #e5e5e5;
    color: #70c0ac;
    background-color: #ecf5ff;
  }
  .btn-char.is-select {
    background-image: url(../assets/img/sort-char-selected.png);
  }
  .btn-asc.is-select {
    background-image: url(../assets/img/sort-asc-selected.png);
  }
  .btn-desc.is-select {
    background-image: url(../assets/img/sort-desc-selected.png);
  }
  .icon-rotate {
    transform: rotateX(180deg);
  }
</style>
