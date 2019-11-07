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
        color: ['#23cdb6', '#1e9cbb', '#c62474', '#a218ab', '#de6e31', '#d89618', '#989898', '#bbbbbb', '#ddd'],
        tree: []
      }
    },
    computed: {
      ...mapGetters('output', ['treeScore'])
    },
    methods: {
      ...mapActions('output', ['getTreeScore']),
      thousandium (value) {
        const thorough = function (value) {
          return value.length > 3 ? value.slice(0, 3).concat(['', ...thorough(value.slice(3))]) : value
        }
        if (value) {
          let strs = value.toLocaleString().split('.')
          return thorough(strs[0].split('').reverse()).reverse().concat(strs[1] ? ['.', strs[1]] : []).join('')
        } else {
          return value
        }
      },
      setColorIndex (tree) {
        tree.forEach((item, index) => {
          if (index >= 0 && index < 6) {
            item.id = index
          } else if (index >= 6 && index < 8) {
            item.id = 6
          } else if (index >= 8 && index < 14) {
            item.id = 7
          } else if (index >= 14) {
            item.id = 8
          }
        })
      },
      create () {
        let _self = this
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
                let index = params.dataIndex
                let value = Number(params.data.value[1]).toFixed(1)
                let name = params.data.name
                let result = ''
                if (index > 0 && index < 7) {
                  result = '{value' + index + '|' + value + '%}\n{name' +
                    index + '|' + name + '}'
                } else if (index >= 7) {
                  result = '{valueSpec' + '|' + value + '%}\n{nameSpec' +
                    '|' + name + '}'
                }
                return result
              },
              rich: {
                value1: {
                  fontSize: 56,
                  align: 'center',
                  fontFamily: 'roboto',
                  fontWeight: 'lighter',
                  color: '#fff'
                },
                value2: {
                  fontSize: 48,
                  align: 'center',
                  fontFamily: 'roboto',
                  fontWeight: '100',
                  color: '#fff'
                },
                value3: {
                  fontSize: 42,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                value4: {
                  fontSize: 36,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                value5: {
                  fontSize: 30,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                value6: {
                  fontSize: 28,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                valueSpec: {
                  fontSize: 24,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                name1: {
                  fontSize: 28,
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
                  fontSize: 22,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                name4: {
                  fontSize: 20,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                name5: {
                  fontSize: 18,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff'
                },
                name6: {
                  fontSize: 18,
                  align: 'center',
                  fontFamily: 'roboto',
                  color: '#fff',
                  wordBreak: 'normal'
                },
                nameSpec: {
                  fontSize: 14,
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
              if (params.dataIndex) {
                return '<div class="chart-tooltip">' +
                  '<h1>' + params.data.name + '</h1>' +
                  '<ul class="list">' +
                  '<li class="list-item weighted">' +
                  '<span>Contribution Ratio</span>' +
                  '<span>' + Number(params.data.value[1]).toFixed(1) + '%</span>' +
                  '<span>(' + params.data.value[2] + '/26)</span>' +
                  '</li>' +
                  '<li class="list-item weighted" style="margin-top: 5px;margin-bottom: 8px;">' +
                  '<span>Weighted Score</span>' +
                  '<span>' + _self.thousandium(params.data.value[0]) + '</span>' +
                  '<span>(' + params.data.value[2] + '/26)</span>' +
                  '</li>' +
                  params.data.details.map(item => item.value && item.rank ? '<li class="list-item">' +
                    '<span>' + item.name + '</span>' +
                    '<span>' + _self.thousandium(item.value) + '</span>' +
                    '<span>(' + item.rank + '/26)</span>' +
                    '</li>' : '').join('') +
                  '</ul>' +
                  '</div>'
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
            name: 'Output',
            type: 'treemap',
            width: '100%',
            height: '100%',
            visibleMin: 1000,
            breadcrumb: {
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
                color: this.color,
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
            data: this.tree
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
    mounted () {
      this.$nextTick(function () {
        this.getTreeScore()
        let timer = setInterval(() => {
          if (this.treeScore.length > 0) {
            this.tree = JSON.parse(JSON.stringify(this.treeScore))
            this.setColorIndex(this.tree)
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
    width: 86%;
    margin: 0 auto;
    height: 100%;
    border: 1px solid #ddd;
    padding: 3px;
  }
</style>
