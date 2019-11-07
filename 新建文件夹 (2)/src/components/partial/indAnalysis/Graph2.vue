<template>
  <div style="width: 100%; height: 100%;">
    <div class="filter-wrapper">
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
    <div class="graph-wrapper" style="text-align: center; line-height: 200px" v-if="tree.length === 0">暂无数据</div>
    <div class="graph-wrapper" ref="graph2"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Input, Button, ButtonGroup, Table, TableColumn } from 'element-ui'
  export default {
    name: 'Graph',
    components: {
      Input, Button, ButtonGroup, Table, TableColumn
    },
    data () {
      return {
        allTotal: '',
        chart: {},
        tree: [],
        tabShow: true,
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
        copyPerformance: []
      }
    },
    computed: {
      ...mapGetters('indAnalysis', ['analysisData', 'tagCheck', 'currentInfo']),
      ...mapGetters('config', ['colors'])

    },
    methods: {
      ...mapMutations('indAnalysis', ['setAnalysisData']),
      ...mapActions('indAnalysis', ['getAnalysisData']),
      create () {
        let _self = this
        this.chart = echarts.init(this.$refs.graph2)
        var states = _self.currentInfo.is_ratio
        var decimal = _self.currentInfo.decimal
        var isPercent = _self.currentInfo.is_percent
        this.chart.setOption({
          title: {
            show: false
          },
          tooltip: {
            trigger: 'axis',
            confine: true,
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
//              let total = 0
//              _self.tree.forEach(item => {
//                total = total + item.ind_val
//              })
              let data = _self.tree[params[0].dataIndex]
              let childData = ''
              if (data.child) {
                data.child.forEach(node => {
                  childData += '<div class="chart-tooltip" style="float: left;"><ul class="list list2"><li class="list-item weighted center">' +
                    node.org_name + '</li>' +
                    '<li class="list-item">' +
                    '<span>' + _self.$t('analysis.data') + '</span>' +
                    '<span>' + Number(node.ind_val).toLocaleString() + '</span>' +
                    '</li>' +
                    '<li class="list-item">' +
                    '<span>' + _self.$t('analysis.number') + '</span>' +
                    '<span>' + node.teacher_data[0].teacher.toLocaleString() + '</span>' +
                    '</li>' +
                    '<li class="list-item">' +
                    '<span>' + _self.$t('analysis.ave') + '</span>' +
                    '<span>' + node.teacher_data[0].teacher_avg.toLocaleString() + '</span>' +
                    '</li></ul></div>'
                })
              }
              if (!isPercent && !states) {
                return '<div  class="chart-box"><div class="chart-tooltip">' +
                  '<h1>' + data.org_name + '</h1>' +
                  '<ul class="list list2">' +
                  '<li  class="list-item weighted">' +
                  '<span>' + _self.$t('analysis.rate') + '</span>' +
                  '<span>' + data.org_ratio + '%' + '</span>' +
                  '</li>' +
                  '<li class="list-item weighted">' +
                  '<span>' + _self.$t('analysis.data') + '</span>' +
                  '<span>' + Number(data.ind_val).toLocaleString() + '</span>' +
                  '</li>' +
                  '<li class="list-item">' +
                  '<span>' + _self.$t('analysis.number') + '</span>' +
                  '<span>' + data.teacher_data[0].teacher.toLocaleString() + '</span>' +
                  '</li>' +
                  '<li class="list-item">' +
                  '<span>' + _self.$t('analysis.ave') + '</span>' +
                  '<span>' + data.teacher_data[0].teacher_avg.toLocaleString() + '</span>' +
                  '</li>' +
                  '</ul></div>' + childData +
                  '</div>'
              } else {
                if (isPercent) {
                  return '<div  class="chart-box"><div class="chart-tooltip">' +
                    '<h1>' + data.org_name + '</h1>' +
                    '<ul class="list list2">' +
                    '<li class="list-item weighted">' +
                    '<span>' + _self.$t('analysis.rate') + '</span>' +
                    '<span>' + '/' + '</span>' +
                    '</li>' +
                    '<li  class="list-item weighted">' +
                    '<span>' + _self.$t('analysis.data') + '</span>' +
                    '<span>' + ((data.ind_val) * 100).toFixed(decimal) + '%' + '</span>' +
                    '</li>' +
                    '<li class="list-item">' +
                    '<span>' + _self.$t('analysis.number') + '</span>' +
                    '<span>' + data.teacher_data[0].teacher.toLocaleString() + '</span>' +
                    '</li>' +
                    '</ul></div>' + childData +
                    '</div>'
                } else {
                  return '<div  class="chart-box"><div class="chart-tooltip">' +
                    '<h1>' + data.org_name + '</h1>' +
                    '<ul class="list list2">' +
                    '<li class="list-item weighted">' +
                    '<span>' + _self.$t('analysis.rate') + '</span>' +
                    '<span>' + '/' + '</span>' +
                    '</li>' +
                    '<li  class="list-item weighted">' +
                    '<span>' + _self.$t('analysis.data') + '</span>' +
                    '<span>' + ((data.ind_val)).toFixed(decimal) + '</span>' +
                    '</li>' +
                    '<li class="list-item">' +
                    '<span>' + _self.$t('analysis.number') + '</span>' +
                    '<span>' + data.teacher_data[0].teacher.toLocaleString() + '</span>' +
                    '</li>' +
                    '</ul></div>' + childData +
                    '</div>'
                }
              }
            },
            backgroundColor: '#fff',
            borderColor: '#fff',
            padding: [10, 15],
            textStyle: {
              color: '#7b7b7b',
              fontFamily: 'roboto'
            },
            extraCssText: 'line-height:14px;border: 1px solid #c5c5c4;border-radius:0;'
          },
          grid: {
            left: '60px',
            right: '7%',
            top: '20px',
            bottom: '20px'
          },
          xAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'category',
            data: _self.tree.map(item => item.short_name_cn),
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            }
          },
          series: [{
            name: _self.$t('analysis.title'),
            type: 'bar',
            data: _self.tree.map(node => {
              return node.ind_val
            }),
            itemStyle: {
              normal: {
                color: function (params) {
                  return _self.colors[_self.tree[params.dataIndex].idx]
                }
              }
            },
            // 平均线
            markLine: {
              lineStyle: {
                normal: {
                  type: 'dashed',
                  color: '#F6AF3B'
                }
              },
              label: {
                normal: {
                  show: true,
                  position: 'end',
                  formatter (params) {
                    return _self.$t('analysis.text') + params.value > 1 ? (isPercent ? (params.value.toFixed(0) * 100) + '%' : params.value.toFixed(0)) : (params.value > 0.1 ? (isPercent ? (params.value.toFixed(1) * 100) + '%' : params.value.toFixed(1)) : (isPercent ? (params.value.toFixed(2) * 100) + '%' : params.value.toFixed(2)))
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
                  let data = _self.tree[params.dataIndex].ind_val
//                  if (data > 1) {
//                    return (data.toFixed(0) - 0).toLocaleString()
//                  } else if (data > 0.6) {
//                    return (data.toFixed(1) - 0).toLocaleString()
//                  } else if (data > 0.01) {
//                    return (data.toFixed(2) - 0).toLocaleString()
//                  } else if (data === 0) {
//                    return 0
//                  } else {
//                    return (data.toFixed(3) - 0).toLocaleString()
//                  }
                  // return _self.tree[params.dataIndex].ind_val.toFixed(2)
                  return isPercent === true ? (data * 100).toFixed(decimal) + '%' : (data).toLocaleString()
                }
              }
            }
          }]
        })
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
            this.tree.sort((a, b) => {
              return a.org_pinyin > b.org_pinyin ? -1 : 1
            })
            break
          case 1:
            this.tree.sort((a, b) => {
              return b.org_rank - a.org_rank
            })
            break
          case 2:
            this.tree.sort((a, b) => {
              return a.org_rank - b.org_rank
            })
            break
        }
      },
      resize () {
        setTimeout(() => {
          this.chart.resize()
        }, 300)
      }
    },
    mounted () {
      this.$nextTick(function () {
        if (this.tagCheck.length > 0) {
          this.tree = JSON.parse(JSON.stringify(this.tagCheck))
          this.create()
          this.toggleSort(this.sorts[this.sortMode])
        }
      })
    },
    watch: {
      tagCheck () {
        if (this.tagCheck.length > 0) {
          this.tree = JSON.parse(JSON.stringify(this.tagCheck))
          this.create()
          this.sort()
          this.toggleSort(this.sorts[this.sortMode])
        } else {
          this.tree = []
          this.create()
          this.chart.dispose()
        }
      }
    }
  }
</script>

<style scoped>
  .graph-wrapper {
    overflow: hidden;
    height: calc(100% - 40px);
    width: 100%;
  }
  .filter-wrapper {
    width: 150px;
    float: right;
    background-color: #ffffff;
    height: 35px;
  }
  .sort-wrapper {
    overflow: hidden;
    text-align: center;
  }
  .btn-sort {
    width: 50px;
    height: 35px;
    font-size: 14px;
    border: 1px solid #ebeef0;
  }
  .btn-sort:hover {
    color: #606266;
    background-color: #fff;
  }
  .btn-char {
    background-image: url(../../../assets/img/sort-char-unselected.png);
  }
  .btn-asc {
    background-image: url(../../../assets/img/sort-asc-unselected.png);
  }
  .btn-desc {
    background-image: url(../../../assets/img/sort-desc-unselected.png);
  }
  .btn-sort.is-select {
    border-color: #e5e5e5;
    color: #70c0ac;
    background-color: #ecf5ff;
  }
  .btn-char.is-select {
    background-image: url(../../../assets/img/sort-char-selected.png);
  }
  .btn-asc.is-select {
    background-image: url(../../../assets/img/sort-asc-selected.png);
  }
  .btn-desc.is-select {
    background-image: url(../../../assets/img/sort-desc-selected.png);
  }
  .icon-rotate {
    transform: rotateX(180deg);
  }
</style>
