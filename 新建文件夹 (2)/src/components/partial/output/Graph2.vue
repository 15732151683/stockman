<template>
  <div style="width: 100%; height: 100%;">
    <SideTable
      @handleChange="checkedChange"
      @handleShow="changeTab"
      :colleges="colleges"
      :collegeTag="collegeTag"
      :allData="performance"
      :tabShow="tabShow">
    </SideTable>
    <div style="width: auto; height: 100%; overflow: hidden;">
      <table cellspacing="0" cellpadding="0" class="table-box">
        <tr>
          <td style="height: 40px; overflow: hidden;">
            <div class="top-box">
              <span>评价方案</span>
              <button :key="node.id" :title="node.name" @click="changeScheme(node.id)" v-for="node in showScheme" :class="['type-button', {'is-active': node.id === activeScheme}]">{{node.short_name}}</button>
              <!--<button class="type-button-add" @click="changePage"><i class="el-icon-plus"></i></button>-->
            </div>
            <div class="sort-wrapper" v-show="performance.length > 0">
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
          </td>
        </tr>
        <tr>
          <td>
            <div class="graph-wrapper" ref="graph2"></div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Input, Button, ButtonGroup, Table, TableColumn, Checkbox, CheckboxGroup } from 'element-ui'
  import { SideTable } from '../../widgets'
  export default {
    name: 'Graph',
    components: {
      Input, Button, ButtonGroup, Table, TableColumn, Checkbox, CheckboxGroup, SideTable
    },
    data () {
      return {
        tabShow: true,
        btnActive: false,
        chart: {},
        tree: [],
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
        checkedCollege: []
      }
    },
    computed: {
      ...mapGetters('output', ['performance', 'activeScheme']),
      ...mapGetters('config', ['colors']),
      ...mapGetters('evaluation', ['schemes']),
      showScheme () {
        return this.schemes
      },
      colleges () {
        return this.performance.map(item => {
          return {'name': item.org_name, 'value': item.ratio, 'tags': item.tags, 'id': item.org_id, 'abridge': item.abridge}
        })
      },
      multiple () {
        if (this.performance) {
          let data = this.performance.map(node => node.val)
          let mini = data.sort((a, b) => { return a - b }).reverse()[0]
          return Math.pow(10, String(Number(mini).toFixed(0)).length - 1)
        } else {
          return ''
        }
      },
      collegeTag () {
        let arr = []
        this.performance.forEach(node => {
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
    methods: {
      ...mapActions('output', ['getPerformance']),
      ...mapMutations('output', ['setPerformance', 'setActive']),
      changeScheme (id) {
        this.setActive(id)
        this.getPerformance(id)
      },
      changeTab () {
        this.tabShow = !this.tabShow
        setTimeout(() => {
          this.chart.resize()
        }, 500)
      },
      checkedChange (data) {
        this.checkedCollege = data
      },
      create () {
        let _self = this
        let len = _self.performance ? _self.performance.length : 0
        this.chart = echarts.init(this.$refs.graph2)
        this.chart.setOption({
          title: {
            show: false,
            text: this.$t('output.title'),
            left: 'center',
            textStyle: {
              fontSize: 26
            }
          },
          tooltip: {
            trigger: 'axis',
            confine: true,
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
              var data = _self.tree[params[0].dataIndex]
              let childData = ''
              if (data.child) {
                data.child.forEach(node => {
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
                '<h1>' + data.org_name + '</h1>' +
                '<ul class="list">' +
                '<li class="list-item weighted">' +
                '<span>' + _self.$t('output.ratio') + '</span>' +
                '<span>' + Number(data.ratio) + '%</span>' +
                '<span>(' + data.rank + '/' + len + ')</span>' +
                '</li>' +
                '<li class="list-item weighted">' +
                '<span>' + _self.$t('output.score') + '</span>' +
                '<span>' + data.val.toLocaleString() + '</span>' +
                '<span>(' + data.rank + '/' + len + ')</span>' +
                '</li>' +
                data.details.map(item => '<li class="list-item">' +
                  '<span>' + item.indicator_name + '</span>' +
                  '<span>' + item.value.toLocaleString() + '</span>' +
                  '<span>(' + item.rank + '/' + len + ')</span>' +
                  '</li>').join('') +
                '</ul></div>' + childData +
                '</div>'
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
            right: '8%',
            top: '10px',
            bottom: '20px'
          },
          xAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            name: 'x E+' + (String(_self.multiple).length - 1),
            nameLocation: 'end',
            nameTextStyle: {
              padding: [26, 0, 0, 10],
              lineHeight: 100
            },
            axisLabel: {
              formatter: function (val, index) {
                return val / _self.multiple
              }
              // interval: 0,
              // rotate: 90
            }
          },
          yAxis: {
            type: 'category',
            data: _self.tree.map(item => item.abridge),
            axisTick: {
              show: false
            }
          },
          series: [{
            name: this.$t('output.title'),
            type: 'bar',
            data: _self.tree.map(node => {
              return node.val
            }),
            itemStyle: {
              normal: {
                // 随机显示
                // color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}
                // 定制显示（按顺序）
                color: function (params) {
                  // var colorList = [ '#C33531', '#EFE42A', '#64BD3D', '#EE9201', '#29AAE3', '#B74AE5', '#0AAF9F', '#E89589', '#16A085', '#4A235A', '#C39BD3 ', '#F9E79F', '#BA4A00', '#ECF0F1', '#616A6B', '#EAF2F8', '#4A235A', '#3498DB' ]
                  return _self.colors[_self.tree[params.dataIndex].idx]
                }
              }
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                color: '#333',
                formatter (params) {
                  return Number(_self.tree[params.dataIndex].val).toLocaleString()
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
        this.create()
      },
      sort () {
        switch (this.sortMode) {
          case 0:
            this.tree.sort((a, b) => {
              return a.pinyin > b.pinyin ? -1 : 1
            })
            break
          case 1:
            this.tree.sort((a, b) => {
              return a.val - b.val
            })
            break
          case 2:
            this.tree.sort((a, b) => {
              return b.val - a.val
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
      })
    },
    watch: {
      performance () {
        if (this.performance.length === 0) {
          this.tree = []
          this.create()
          this.chart.dispose()
        }
      },
      checkedCollege () {
        this.tree = this.performance.filter(node => {
          return this.checkedCollege.findIndex(item => item.id === node.org_id) > -1
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
  .top-box{
    width: 100%;
    padding-bottom: 10px;
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
    height: calc(100% - 20px);
  }
  .sort-wrapper {
    overflow: hidden;
    text-align: right;
    padding-right: 50px;
  }
  .btn-sort {
    width: 60px;
    height: 30px;
    font-size: 12px;
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
