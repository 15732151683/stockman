<template>
  <div class="graph-wrapper" ref="graph"></div>
</template>

<script>
  import echarts from 'echarts'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Graph',
    data () {
      return {
        chart: {},
        tree: []
      }
    },
    computed: {
      ...mapGetters('indAnalysis', ['analysisData', 'tagCheck', 'currentInfo']),
      ...mapGetters('config', ['colors'])
    },
    methods: {
      ...mapActions('indAnalysis', ['getAnalysisData']),
      create () {
        let _self = this
        let states = _self.currentInfo.is_ratio
        let decimal = _self.currentInfo.decimal
        var isPercent = _self.currentInfo.is_percent
        this.chart = echarts.init(this.$refs.graph)
        this.chart.setOption({
          label: {
            normal: {
              show: true,
              formatter: function (params) {
                const getFixedName = function (name, length) {
                  if (name.length > length) {
                    return name.substr(0, length) + '\n' + getFixedName(name.substr(length), length)
                  } else {
                    return name
                  }
                }
                let index = params.data.org_rank
                let value = ''
                let name = params.data.short_name_cn
                let result = ''
                if (!states && !isPercent) {
                  value = (params.data.org_ratio)
                  result = '{valueSpec' + '|' + value + '%}\n{nameSpec' +
                    '|' + name + '}'
                } else {
                  if (isPercent) {
                    value = ((params.data.ind_val) * 100).toFixed(decimal)
                    result = '{value' + index + '|' + value + '%}\n{name' +
                      index + '|' + name + '}'
                  } else {
                    value = ((params.data.ind_val)).toFixed(decimal)
                    result = '{value' + index + '|' + value + '}\n{name' +
                      index + '|' + name + '}'
                  }
                }
                return result
              },
              rich: {
                value1: {
                  fontSize: 48,
                  align: 'center',
                  fontFamily: 'roboto',
                  fontWeight: 'lighter',
                  color: '#fff'
                },
                value2: {
                  fontSize: 42,
                  align: 'center',
                  fontFamily: 'roboto',
                  fontWeight: '100',
                  color: '#fff'
                },
                value3: {
                  fontSize: 32,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                value4: {
                  fontSize: 30,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                value5: {
                  fontSize: 26,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                value6: {
                  fontSize: 24,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                valueSpec: {
                  fontSize: 20,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                name1: {
                  fontSize: 24,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                name2: {
                  fontSize: 22,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                name3: {
                  fontSize: 18,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                name4: {
                  fontSize: 18,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                name5: {
                  fontSize: 16,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                name6: {
                  fontSize: 14,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff',
                  wordBreak: 'normal'
                },
                nameSpec: {
                  fontSize: 12,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                }
              }
            }
          },
          tooltip: {
            confine: true,
            hideDelay: 0,
            formatter: function (params) {
//              let total = 0
//              _self.tree.forEach(item => {
//                total = total + item.ind_val
//              })
              let data = params.data
              let childData = ''
              if (params.dataIndex) {
                if (data.child) {
                  if (isPercent || states) {
                    data.child.forEach(node => {
                      childData += '<div class="chart-tooltip" style="float: left;"><ul class="list list2"><li class="list-item weighted center">' +
                        node.org_name + '</li>' +
                        '<li class="list-item ">' +
                        '<span>' + _self.$t('analysis.data') + '</span>' +
                        '<span>' + Number(node.ind_val).toLocaleString() + '</span>' +
                        '</li>' +
                        '<li class="list-item">' +
                        '<span>' + _self.$t('analysis.number') + '</span>' +
                        '<span>' + node.teacher_data[0].teacher.toLocaleString() + '</span>' +
                        '</ul></div>'
                    })
                  } else {
                    data.child.forEach(node => {
                      childData += '<div class="chart-tooltip" style="float: left;"><ul class="list list2"><li class="list-item weighted center">' +
                        node.org_name + '</li>' +
                        '<li class="list-item ">' +
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
                }
                if (!states && !isPercent) {
                  return '<div class="chart-box"><div class="chart-tooltip">' +
                    '<h1>' + data.org_name + '</h1>' +
                    '<ul class="list list2">' +
                    '<li class="list-item weighted">' +
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
                    return '<div class="chart-box"><div class="chart-tooltip">' +
                      '<h1>' + data.org_name + '</h1>' +
                      '<ul class="list list2">' +
                      '<li class="list-item weighted">' +
                      '<span>' + _self.$t('analysis.rate') + '</span>' +
                      '<span>' + '/' + '</span>' +
                      '</li>' +
                      '<li class="list-item weighted">' +
                      '<span>' + _self.$t('analysis.data') + '</span>' +
                      '<span>' + (Number(data.ind_val) * 100).toFixed(decimal) + '%' + '</span>' +
                      '</li>' +
                      '<li class="list-item">' +
                      '<span>' + _self.$t('analysis.number') + '</span>' +
                      '<span>' + data.teacher_data[0].teacher.toLocaleString() + '</span>' +
                      '</li>' +
                      '</ul></div>' + childData +
                      '</div>'
                  } else {
                    return '<div class="chart-box"><div class="chart-tooltip">' +
                      '<h1>' + data.org_name + '</h1>' +
                      '<ul class="list list2">' +
                      '<li class="list-item weighted">' +
                      '<span>' + _self.$t('analysis.rate') + '</span>' +
                      '<span>' + '/' + '</span>' +
                      '</li>' +
                      '<li class="list-item weighted">' +
                      '<span>' + _self.$t('analysis.data') + '</span>' +
                      '<span>' + (Number(data.ind_val)).toFixed(decimal) + '</span>' +
                      '</li>' +
                      '<li class="list-item">' +
                      '<span>' + _self.$t('analysis.number') + '</span>' +
                      '<span>' + data.teacher_data[0].teacher.toLocaleString() + '</span>' +
                      '</li>' +
                      '</ul></div>' + childData +
                      '</div>'
                  }
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
          series: [{
            name: this.$t('analysis.title'),
            type: 'treemap',
            width: '94%',
            left: 10,
            height: '100%',
            visibleMin: 3000,
            // breadcrumb当前路径显示
            breadcrumb: {
              show: false,
              itemStyle: {
                normal: {
                  textStyle: {
                    fontFamily: 'Roboto'
                  }
                }
              }
            },
//            roam: 'move',
            levels: [
              {
                color: this.colors,
                colorMappingBy: 'id',
                itemStyle: {
                  normal: {
                    borderWidth: 2,
                    borderColor: '#fff',
                    gapWidth: 2
                  }
                }
              }
            ],
            data: this.tree.map(node => {
              return node
            })
          }]
        })
        this.chart.on('mouseover', function (params) {
          if (params.dataIndex > 14) {
            _self.$emit('highlight', params.dataIndex - 1)
          }
        })
        this.chart.on('mouseout', function (params) {
          if (params.dataIndex > 14) {
            _self.$emit('unhighlight')
          }
        })
      },
      resize () {
        setTimeout(() => {
          this.chart.resize()
        }, 300)
      }
    },
    watch: {
//      analysisData () {
//        if (this.analysisData.length > 0) {
//          this.tree = this.analysisData
//          this.create()
//          this.chart.dispose()
//          this.create()
//        } else {
//          this.create()
//          this.chart.dispose()
//        }
//      },
      tagCheck () {
        if (this.tagCheck.length > 0) {
          this.tree = this.tagCheck
          this.create()
          this.chart.dispose()
          this.create()
        } else {
          this.create()
          this.chart.dispose()
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        let timer = setInterval(() => {
          if (this.tagCheck.length > 0) {
            this.tree = JSON.parse(JSON.stringify(this.tagCheck))
            this.create()
            clearInterval(timer)
          }
        }, 10)
      })
    }
  }
</script>

<style scoped>
  .graph-wrapper {
    overflow: hidden;
    margin-top: 10px;
    height: calc(100% - 20px);
    width: 100%;
  }
</style>
