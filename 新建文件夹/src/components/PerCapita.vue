<template>
  <Container :title="title" :showDownload="downButton" @downDataA="downCurrentData">
    <template slot="header"></template>
    <template slot="main">
      <SideTable
        @handleChange="checkedChange"
        @handleShow="changeTab"
        :colleges="colleges"
        :collegeTag="collegeTag"
        :allData="perCapita"
        :tabShow="tabShow">
      </SideTable>
      <div style="width: auto; height: 100%; overflow: hidden;">
        <table cellspacing="0" cellpadding="0" class="table-box">
          <tr>
            <td style="height: 40px; overflow: hidden;">
              <div class="left-box" v-if="schemes.length > 0">
                <span>评价方案</span>
                <button :title="node.name"  @click="changeScheme(node.id)" :class="['schemeButton', {'activeColor': activeId === node.id}]" v-for="node in schemeData"  :key="node.id">{{node.short_name}}</button>
                <span style="margin-left: 10px">教师年份&nbsp;</span>
                <DatePicker
                  size="small"
                  :clearable="false"
                  style="width: 100px;"
                  @change="changeYear"
                  v-model="selectYear"
                  value-format="yyyy"
                  type="year"
                  placeholder="选择年">
                </DatePicker>
              </div>
              <div class="sort-wrapper" v-if="schemes.length > 0">
                <ButtonGroup >
                  <Button
                    v-for="btn in sorts"
                    :key="btn.id"
                    class="btn-sort"
                    :class="{'is-select': btn.selected}"
                    size="medium" @click="toggleSort(btn)"
                    :title="btn.title">
                    <span v-if="btn.id === 0">A-Z</span>
                    <span v-else class="fa" :class="btn.class"></span>
                  </Button>
                </ButtonGroup>
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
  import { Container, SideTable } from './widgets'
  import { Button, ButtonGroup, Tree, Table, TableColumn, DatePicker } from 'element-ui'
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    name: 'PerCapita',
    components: {
      Container, Button, ButtonGroup, Tree, Table, TableColumn, SideTable, DatePicker
    },
    data () {
      return {
        title: '',
        chart: {},
        chartType: 1,
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
        sortMode: 1,
        copyCapita: [],
        tabShow: true,
        checkedCollege: [],
        selectYear: '',
        activeId: -1,
        downButton: [true, true, false]
      }
    },
    methods: {
      ...mapActions('perCapita', ['getCapita']),
      ...mapActions('evaluation', ['getScheme']),
      ...mapMutations('perCapita', ['setCapita']),
      ...mapMutations('config', ['config', 'exportDataA', 'exportDataB']),
      // 数据下载
      downCurrentData () {
        let params = {id: this.activeId, year: +this.selectYear}
        this.exportDataB({'name': '师均表现', 'url': '/v1/percapitaoutput/exp', 'type': 'query', 'params': params})
      },
      changeScheme (val) {
        this.activeId = val
        this.getCapita({'id': val, 'year': this.selectYear})
      },
      changeYear (val) {
        this.getCapita({'id': this.activeId, 'year': val})
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
              let param = _self.copyCapita[params[0].dataIndex]
              let childData = ''
              if (param.child) {
                param.child.forEach(node => {
                  childData += '<div class="chart-tooltip" style="float: left;"><ul class="list list2"><li class="list-item weighted center">' +
                    node.org_name + '</li>' +
                    '<li class="list-item">' +
                    '<span>' + _self.$t('perCapita.textA') + '</span>' +
                    '<span>' + node.count.toLocaleString() + '</span>' +
                    '</li>' +
                    '<li class="list-item">' +
                    '<span>' + _self.$t('perCapita.textB') + '</span>' +
                    '<span>' + node.score.toLocaleString() + '</span>' +
                    '</li></ul></div>'
                })
              }
              return '<div class="chart-box"><div class="chart-tooltip">' +
                '<h1>' + param.org_name + '</h1>' +
                '<ul class="list list2">' +
                '<li class="list-item">' +
                '<span>' + _self.$t('perCapita.textA') + '</span>' +
                '<span>' + param.count.toLocaleString() + '</span>' +
                '</li>' +
                '<li class="list-item">' +
                '<span>' + _self.$t('perCapita.textB') + '</span>' +
                '<span>' + param.score.toLocaleString() + '</span>' +
                '</li>' +
                '</ul></div>' + childData +
                '</div>'
            }
          },
          grid: {
            top: '18px',
            left: '60px',
            right: '8%',
            bottom: '20px'
          },
          xAxis: {
            type: 'value',
            // logBase: 10,
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            max: _self.max ? _self.maxValue : null
          },
          yAxis: {
            type: 'category',
            data: _self.copyCapita.map(item => item.short_name),
            axisTick: {
              show: false
            }
          },
          series: [
            {
              name: 'Ratio',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                normal: {
                  color: function (params) {
                    return _self.colors[_self.copyCapita[params.dataIndex].id]
                  }
                }
              },
              data: _self.copyCapita.map(term => term.ratio),
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
                      return _self.$t('perCapita.average') + params.value
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
                    return _self.copyCapita[params.dataIndex].ratio.toLocaleString()
                  }
                }
              }
            }
          ]
        })
      },
      changeType (id) {
        this.chartType = id
        if (this.chartType === 1) {
          this.chart.dispose()
          this.create()
        }
      },
      toggleSort (sort) {
        this.sortMode = sort.id
        for (let item of this.sorts) {
          item.selected = item.id === sort.id
        }
        this.sort()
        this.chart.dispose()
        this.create()
      },
      sort () {
        switch (this.sortMode) {
          case 0:
            this.copyCapita.sort((a, b) => {
              return a.pin_yin.toLowerCase() > b.pin_yin.toLowerCase() ? -1 : 1
            })
            break
          case 1:
            this.copyCapita.sort((a, b) => {
              return a.ratio - b.ratio
            })
            break
          case 2:
            this.copyCapita.sort((a, b) => {
              return b.ratio - a.ratio
            })
            break
        }
      },
      resize () {
        setTimeout(() => {
          this.chart.resize()
        }, 300)
      },
      clone (obj) {
        return JSON.parse(JSON.stringify(obj))
      },
      changeTab () {
        this.tabShow = !this.tabShow
        setTimeout(() => {
          this.chart.resize()
        }, 500)
      },
      checkedChange (data) {
        this.checkedCollege = data
      }
    },
    created () {
      this.setCapita([])
    },
    mounted () {
      // this.selectYear = new Date().getFullYear() - 1 + ''
      this.getScheme()
      this.$nextTick(function () {
        this.$emit('mounted')
        this.getCapita({'id': this.activeId, 'year': -1})
        if (this.perCapita.length > 0) {
          this.copyCapita = JSON.parse(JSON.stringify(this.perCapita))
          this.toggleSort(this.sorts[this.sortMode])
        }
      })
    },
    computed: {
      ...mapGetters('perCapita', ['perCapita']),
      ...mapGetters('config', ['colors']),
      ...mapGetters('evaluation', ['schemes']),
      schemeData () {
        if (this.schemes.length > 0) {
          this.activeId = this.schemes[0].id
        }
        return this.schemes
      },
      colleges () {
        return this.perCapita.map((item, index) => {
          return {'name': item.org_name, 'value': item.ratio, 'tags': item.tags, 'id': index, 'abridge': item.short_name}
        })
      },
      collegeTag () {
        let arr = []
        this.perCapita.forEach(node => {
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
      perCapita () {
        if (this.perCapita && this.perCapita.length === 0) {
          this.copyCapita = []
          this.create()
          this.chart.dispose()
        } else {
          this.selectYear = this.perCapita[0].year + ''
        }
      },
      checkedCollege () {
        this.copyCapita = this.perCapita.filter(node => {
          return this.checkedCollege.findIndex(item => item.name === node.org_name) > -1
        })
        if (this.sortMode === -1) {
          this.toggleSort(this.sorts[1])
        } else {
          this.sort()
          this.chart.dispose()
          this.create()
        }
      }
    }
  }
</script>
<style scoped>
  .table-box {
    width: 100%;
    height: 100%;
  }
  .left-box{
    margin-bottom: 5px;
    overflow: hidden;
  }
  .left-box span {
    color: #ADADAD;
    font-size: 14px;
  }
  .schemeButton{
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
  }
  .activeColor{
    color: #ffffff;
    background-image: -moz-linear-gradient(top, #EBB747, #DBA26F);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #EBB747), color-stop(1,#DBA26F));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EBB747', endColorstr='#DBA26F', GradientType =0);
  }
  .content {
    margin-top: 5px;
    height: calc(100% - 20px);
  }
  .graph-wrapper {
    height: 100%;
    overflow: hidden;
  }
  .sort-wrapper {
    overflow: hidden;
    text-align: right;
    padding-right: 50px;
  }
  .btn-sort {
    width: 60px;
    height: 34px;
    font-size: 12px;
    line-height: 1px;
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
