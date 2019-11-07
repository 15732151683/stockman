<template>
  <div style="width: 100%; height: 100%;">
    <div class="top-box">
      <span>评价方案</span>
      <button :key="node.id" :title="node.name" @click="changeScheme(node.id)" v-for="node in showScheme" :class="['type-button', {'is-active': node.id === activeScheme}]">{{node.short_name}}</button>
      <!--<button class="type-button-add" @click="changePage"><i class="el-icon-plus"></i></button>-->
    </div>
    <div class="graph-wrapper" ref="graph"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  export default {
    name: 'Graph',
    data () {
      return {
        chart: {},
        tree: []
      }
    },
    computed: {
      ...mapGetters('output', ['performance', 'activeScheme']),
      ...mapGetters('config', ['colors']),
      ...mapGetters('evaluation', ['schemes']),
      showScheme () {
        return this.schemes
      }
    },
    methods: {
      ...mapActions('output', ['getPerformance']),
      ...mapMutations('output', ['setActive']),
      changeScheme (id) {
        this.setActive(id)
        this.getPerformance(id)
      },
      create () {
        let _self = this
        let len = _self.tree.length
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
                let index = params.data.rank
                let value = Number(params.data.ratio)
                let name = params.data.abridge
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
              if (params.dataIndex) {
                let childData = ''
                if (params.data.child) {
                  params.data.child.forEach(node => {
                    childData += '<div class="chart-tooltip" style="float: left;"><ul class="list list2"><li class="list-item weighted center">' +
                      node.org_name + '</li>' +
                      '<li class="list-item weighted">' +
                      '<span>' + _self.$t('output.ratio') + '</span>' +
                      '<span>' + Number(node.ratio) + '%</span></li>' +
                      '<li class="list-item weighted">' +
                      '<span>' + _self.$t('output.score') + '</span>' +
                      '<span>' + node.val.toLocaleString() + '</span></li>'
                    if (node.details) {
                      childData += node.details.map(item => {
                        return '<li class="list-item">' +
                          '<span>' + item.indicator_name + '</span>' +
                          '<span>' + item.value.toLocaleString() + '</span></li>'
                      }).join('') + '</ul></div>'
                    }
                  })
                }
                return '<div class="chart-box"><div class="chart-tooltip">' +
                  '<h1>' + params.data.org_name + '</h1>' +
                  '<ul class="list">' +
                  '<li class="list-item weighted">' +
                  '<span>' + _self.$t('output.ratio') + '</span>' +
                  '<span>' + Number(params.data.ratio) + '%</span>' +
                  '<span>(' + params.data.rank + '/' + len + ')</span>' +
                  '</li>' +
                  '<li class="list-item weighted">' +
                  '<span>' + _self.$t('output.score') + '</span>' +
                  '<span>' + params.data.val.toLocaleString() + '</span>' +
                  '<span>(' + params.data.rank + '/' + len + ')</span>' +
                  '</li>' +
                  params.data.details.map(item => '<li class="list-item">' +
                    '<span>' + item.indicator_name + '</span>' +
                    '<span>' + item.value.toLocaleString() + '</span>' +
                    '<span>(' + item.rank + '/' + len + ')</span>' +
                    '</li>').join('') +
                  '</ul></div>' + childData +
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
            name: this.$t('output.title'),
            type: 'treemap',
            width: '100%',
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
    mounted () {
      this.$nextTick(function () {
        if (this.performance.length > 0) {
          this.tree = this.performance
          this.create()
        }
      })
    },
    watch: {
      performance () {
        if (this.performance && this.performance.length !== 0) {
          this.tree = this.performance
          this.create()
          this.chart.dispose()
          this.create()
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
  .top-box{
    width: 100%;
    height: 50px;
  }
  .top-box span {
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
  .graph-wrapper {
    overflow: hidden;
    height: calc(100% - 50px);
    width: 100%;
  }
</style>
