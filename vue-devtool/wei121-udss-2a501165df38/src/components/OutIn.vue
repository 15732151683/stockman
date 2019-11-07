<template>
  <div class="container">
    <div class="container-header">
      <h2>Output / Input</h2>
    </div>
    <div class="container-body">
      <div class="toolbar">
        <div class="btn-group">
          <div
            class="btn-wrapper"
            v-for="(btn, bIndex) in btns"
            :key="bIndex">
            <button
              class="btn btn-img"
              :class="[btn.added ? btn.type : btn.type + '-unused']"
              @click="toggleAdded(btn)">
            </button>
            <div class="convert-box" v-if="btn.expand && btn.added">
              <div class="poper-label">
                <label>{{ ['1 person', '', '1 m²', 'deprecation'][btn.id] }}&nbsp;
                  <span v-if="btn.id !== 3"><span class="fa fa-caret-right"></span>&nbsp;$</span>
                </label>
              </div>
              <div class="poper-input">
                <input v-model="input[bIndex].count" :style="{width: btn.id === 3 ? '15px' : '40px'}" type="text" @keyup.enter="toggleCount"/>
              </div><span v-if="btn.id === 3">% p.a</span>
              <div class="poper-button">
                <el-button type="primary" size="mini" style="background-color: #1ebba6;" @click="toggleCount">change</el-button>
              </div>
            </div>
            <span class="space-convert" @click.stop="togglePoper(btn)"></span>
          </div>
        </div>
        <div class="sort-wrapper">
          <el-button-group>
            <el-button
              v-for="btn in sorts"
              :key="btn.id"
              class="btn-sort"
              :class="{'is-select': btn.selected}"
              size="small" @click="toggleSort(btn)"
              title="Sort by letter.">
              <span v-if="btn.id === 0">A-Z</span>
              <span v-else class="fa" :class="btn.class"></span>
            </el-button>
          </el-button-group>
          <!--
          <div class="sort-group">
            <div
              class="btn-sort"
              v-for="sort in sorts" :key="sort.id"
              :class="['btn-' + sort.name, sort.selected ? 'is-select' : '']"
              @click="toggleSort(sort)">
            </div>
          </div>
          -->
        </div>
      </div>
      <div class="content">
        <!--<div ref="graph" class="graph-wrapper" :class="{'hidden': series.length <= 0}">-->
        <div ref="graph" class="graph-wrapper">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: 'OutIn',
    data () {
      return {
        chart: {},
        btns: [
          {
            id: 0,
            type: 'btn-faculty',
            icon: 'fa-user-o',
            text: 'FACULTY(ppl)',
            color: '#9099d2',
//            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//              {
//                offset: 0,
//                color: '#98a1d6'
//              }, {
//                offset: 1,
//                color: '#747fc1'
//              }
//            ]),
            added: true,
            convert: true,
            expand: false
          },
          {
            id: 1,
            type: 'btn-funding',
            icon: 'fa-rmb',
            text: 'FUNDING($)',
            color: '#f2c055',
//            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//              {
//                offset: 0,
//                color: '#f7c760'
//              }, {
//                offset: 1,
//                color: '#edb94b'
//              }
//            ]),
            added: true,
            convert: false,
            expand: false
          },
          {
            id: 2,
            type: 'btn-building',
            icon: 'fa-building',
            text: 'BUILDING(m²)',
            color: '#8fd0c0',
//            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//              {
//                offset: 0,
//                color: '#94d2c3'
//              }, {
//                offset: 1,
//                color: '#6ebfab'
//              }
//            ]),
            added: true,
            convert: true,
            expand: false
          },
          {
            id: 3,
            type: 'btn-equipment',
            icon: 'fa-television',
            text: 'EQUIPMENT($)',
            count: 0.15,
            color: '#fd7286',
//            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//              {
//                offset: 0,
//                color: '#fe7186'
//              }, {
//                offset: 1,
//                color: '#ef788a'
//              }
//            ]),
            added: true,
            convert: true,
            expand: false
          }
        ],
        sorts: [
          {
            id: 0,
            name: 'char',
            class: '',
            selected: false,
            title: 'Sort by letter.'
          },
          {
            id: 1,
            name: 'asc',
            class: 'fa-sort-amount-asc icon-rotate',
            selected: false,
            title: 'Sort Ascending.'
          },
          {
            id: 2,
            name: 'desc',
            class: 'fa-sort-amount-asc',
            selected: false,
            title: 'Sort Descending.'
          }
        ],
        sortMode: -1,
        input: [
          {
            id: 0,
            count: 15000,
            data: [77, 102, 235, 46, 262, 130, 138, 601, 201, 59, 58, 216, 50, 70, 127, 312, 20, 69, 45, 40, 35, 9, 300, 17, 8, 50],
            converted: []
          },
          {
            id: 1,
            count: 1,
            data: [
              5491169,
              5102890,
              6280549,
              3669996,
              2241735,
              1980120,
              2133834,
              2289909,
              2195278,
              1575259,
              1241842,
              1337582,
              1280646,
              1101110,
              1022646,
              1062302,
              950626,
              922535,
              941849,
              897699,
              915496,
              900674,
              897718,
              788373,
              491205,
              538086
            ],
            converted: []
          },
          {
            id: 2,
            count: 600,
            data: [
              4564,
              5084,
              4929,
              4796,
              4564,
              5477,
              7794,
              4929,
              3286,
              5477,
              5477,
              3989,
              4929,
              2739,
              3469,
              2921,
              1826,
              2921,
              5294,
              1826,
              3258,
              3104,
              3834,
              3286,
              3286,
              3469
            ],
            converted: []
          },
          {
            id: 3,
            count: 15,
            data: [
              19026189,
              19449008,
              21140239,
              21563057,
              17757777,
              23254245,
              21985833,
              21140239,
              20294602,
              22408651,
              20885119,
              19871826,
              21985833,
              2110605,
              12684126,
              2114007,
              131509,
              2114007,
              15220951,
              1008730,
              1943927,
              2097424,
              2536825,
              1691231,
              2056903,
              2959644
            ],
            converted: []
          }
        ],
        output: [
          228140,
          252400,
          191060,
          158310,
          79690,
          58610,
          43440,
          29920,
          37110,
          20750,
          7740,
          6830,
          4800,
          6790,
          3610,
          3100,
          920,
          510,
          470,
          130,
          370,
          90,
          80,
          0,
          10,
          0
        ],
        college: [
          {
            'row': 2,
            'name': 'Chemistry',
            'abridge': 'Dept Chem'
          },
          {
            'row': 3,
            'name': 'Mathematics',
            'abridge': 'Dept Math'
          },
          {
            'row': 4,
            'name': 'Engineering',
            'abridge': 'Fac Engn'
          },
          {
            'row': 5,
            'name': 'Physics',
            'abridge': 'Dept Phys'
          },
          {
            'row': 6,
            'name': 'Computing and Information Technology',
            'abridge': 'Fac Comp & Informat Technol'
          },
          {
            'row': 7,
            'name': 'Environmental Designs',
            'abridge': 'Fac Environm Design'
          },
          {
            'row': 8,
            'name': 'Meteorology, Environment and Arid Land Agriculture',
            'abridge': 'Fac Meteorol Environm & Arid Land Agr'
          },
          {
            'row': 9,
            'name': 'Medicine',
            'abridge': 'Fac Med'
          },
          {
            'row': 10,
            'name': 'Pharmacy',
            'abridge': 'Fac Pharm'
          },
          {
            'row': 11,
            'name': 'Earth Sciences',
            'abridge': 'Fac Earth Sci'
          },
          {
            'row': 12,
            'name': 'Marine Sciences',
            'abridge': 'Fac Marine Sci'
          },
          {
            'row': 13,
            'name': 'Applied Medical Sciences',
            'abridge': 'Fac Appl Med Sci'
          },
          {
            'row': 14,
            'name': 'Dentistry',
            'abridge': 'Fac Dent'
          },
          {
            'row': 15,
            'name': 'Art & Humanities',
            'abridge': 'Fac Arts & Humanities'
          },
          {
            'row': 16,
            'name': 'Nursing',
            'abridge': 'Fac Nursing'
          },
          {
            'row': 17,
            'name': 'Economics and Administration',
            'abridge': 'Fac Econ & Adm'
          },
          {
            'row': 18,
            'name': 'Jeddah Community Collage',
            'abridge': 'Jeddah Community Coll'
          },
          {
            'row': 19,
            'name': 'Law',
            'abridge': 'Fac Law'
          },
          {
            'row': 20,
            'name': 'Maritime Studies',
            'abridge': 'Fac Maritime Studies'
          },
          {
            'row': 21,
            'name': 'Communication and Media',
            'abridge': 'Fac Communication & Media'
          },
          {
            'row': 22,
            'name': 'Home Economics',
            'abridge': 'Home Econ'
          },
          {
            'row': 23,
            'name': 'Islamic Economics Institute',
            'abridge': 'Islamic Econ Dept'
          },
          {
            'row': 24,
            'name': 'English Language Institute',
            'abridge': 'English Language Inst'
          },
          {
            'row': 25,
            'name': 'Tourism',
            'abridge': 'Fac Tourism'
          },
          {
            'row': 26,
            'name': 'Educational Graduate Studies',
            'abridge': 'Educ Grad Studies'
          },
          {
            'row': 27,
            'name': 'The Arabic Language Institute for Speakers of Other Languages',
            'abridge': 'Arabic Language Inst'
          }
        ],
        series: [],
        results: [
          {
            name: '',
            sum: 0,
            ratio: '0.000',
            data: []
          }
        ],
        max: true,
        maxValue: 1000,
        graphType: 'log'
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.yAxis = this.college.map(item => item.abridge)
        this.setConvertedInput()
        this.generate()
        this.create()
        this.$emit('mounted')
      })
    },
    methods: {
      thousandium (num) {
        const thorough = function (num) {
          return num.length > 3 ? num.slice(0, 3).concat(['', ...thorough(num.slice(3))]) : num
        }
        let strs = num.toLocaleString().split('.')
        return isNaN(num) ? num : thorough(strs[0].split('').reverse()).reverse().concat(strs[1] ? ['.', strs[1]] : []).join('')
      },
      generate () {
        let mix = false
        this.results = this.yAxis.map((item, yIndex) => {
          let data = []
          let sum = 0
          let counter = 0
          this.btns.forEach((btn, bIndex) => {
            if (btn.added) {
//              let value = this.output[yIndex] * 1000 / this.input[bIndex].converted[yIndex]
              data.push({
                name: ['Faculty (ppl)', 'Funding ($)', 'Building (m²)', 'Equipment ($)'][bIndex],
                value: this.input[bIndex].data[yIndex],
                color: btn.color
              })
              counter++
              sum += this.input[bIndex].converted[yIndex]
            }
          })
          mix = counter > 1
          return {
            name: item,
//            sum,
            sum: (this.output[yIndex] * 1000 / sum).toFixed(2),
            data
          }
        })
        this.series = []
        for (let item of this.btns) {
          if (item.added) {
            this.series.push({
              name: ['Faculty', 'Funding', 'Building', 'Equipment'][item.id],
              color: mix ? '#f3944e' : item.color,
              count: item.count
            })
            break
          }
        }
      },
      setConvertedInput () {
        this.input.forEach((item, index) => {
          item.converted = item.data.map(term => term * item.count / (index === 3 ? 100 : 1))
        })
      },
      toggleCount () {
        this.setConvertedInput()
        this.generate()
        this.sort()
        this.create()
      },
      togglePoper (btn) {
        if (btn.added && btn.convert) {
          btn.expand = !btn.expand
        }
      },
      toggleAdded (btn) {
        btn.added = !btn.added
        this.generate()
        this.sort()
        this.dispose()
        this.create()
      },
      toggleSort (sort) {
        this.sortMode = sort.id
        for (let item of this.sorts) {
          item.selected = item.id === sort.id
        }
        this.sort()
        this.create()
      },
      test () {
        this.graphType = this.graphType === 'log' ? 'value' : 'log'
        this.maxValue = this.graphType === 'log' ? 1000 : 500
        this.create()
      },
      sort () {
        switch (this.sortMode) {
          case 0:
            this.results.sort((a, b) => {
              return a.name > b.name ? -1 : 1
            })
            break
          case 1:
            this.results.sort((a, b) => {
              return a.sum - b.sum
            })
            break
          case 2:
            this.results.sort((a, b) => {
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
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
              return params[0].name + '<br/>' +
                _self.results[params[0].dataIndex].data.map(item => {
                  return '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + ';"></span>' +
                  '<span style="display: inline-block;width: 120px;">' + item.name + ':</span> ' +
                    '<span style="display: inline-block;width: 120px;text-align: right;">' + item.value + '</span> '
                }).join('<br/>')
            }
          },
          grid: {
            left: '240px',
            right: '4%',
            bottom: '50px'
          },
          xAxis: {
            type: _self.graphType,
            logBase: 10,
            axisTick: {
              show: false
            },
            max: _self.max ? _self.maxValue : null
          },
          yAxis: {
            type: 'category',
            data: _self.results.map(item => item.name),
            axisTick: {
              show: false
            }
          },
          series: _self.series.map((item, index) => {
            return {
//              name: item.name,
              name: 'Ratio',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                normal: {
                  color: item.color
                }
              },
              data: _self.results.map(term => term.sum),
              markLine: index === _self.series.length - 1 ? {
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
                      return 'Average: ' + _self.thousandium(params.value)
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
              } : undefined,
              label: index === _self.series.length - 1 ? {
                normal: {
                  show: true,
                  position: 'right',
                  color: '#333',
                  formatter (params) {
                    return _self.results[params.dataIndex].sum
                  }
                }
              } : undefined
            }
          })
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
  .container {
    margin: 15px;
    height: calc(100% - 30px);
    cursor: default;
    user-select: none;
  }
  .container-header,
  .container-body{
    padding: 15px;
    background-color: #fff;
  }
  .container-header>h2 {
    height: 40px;
    line-height: 40px;
    color: #32373d;
  }
  .container-body {
    height: calc(100% - 100px);
    overflow: hidden;
  }
  .toolbar {
    height: 50px;
    line-height: 50px;
  }
  .content {
    height: calc(100% - 50px);
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .graph-wrapper {
    height: 100%;
    min-height: 600px;
  }
  .convert-box {
    position: absolute;
    top: 36px;
    left: 0;
    width: 172px;
    height: 32px;
    line-height: 32px;
    background-color: #fff;
    z-index: 1050;
    color: #c3c0bf;
    font-size: 12px;
    text-align: center;
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
  .btn-group {
    float: left;
    height: 50px;
    line-height: 50px;
  }
  .btn-wrapper {
    position: relative;
    display: inline-block;
    margin-left: 5px;
    line-height: 1;
  }
  .btn {
    border-radius: .25em;
    border: 1px solid #dcdfe6;
    outline: 0;
    transition: 500ms;
  }
  .btn-img {
    width: 173px;
    height: 37px;
    cursor: pointer;
    line-height: 40px;
    background-repeat: no-repeat;
  }
  .space-convert {
    position: absolute;
    top: 0;
    right: 0;
    height: 35px;
    width: 25px;
    display: block;
    clear: both;
  }
  .btn-faculty-unused {
    background-image: url(../assets/img/udss_35.png);
  }
  .btn-faculty {
    background-image: url(../assets/img/udss_08.png);
  }
  .btn-funding-unused {
    background-image: url(../assets/img/udss_37.png);
  }
  .btn-funding {
    background-image: url(../assets/img/udss_10.png);
  }
  .btn-building-unused {
    background-image: url(../assets/img/udss_39.png);
  }
  .btn-building {
    background-image: url(../assets/img/udss_12.png);
  }
  .btn-equipment-unused {
    background-image: url(../assets/img/udss_41.png);
  }
  .btn-equipment {
    background-image: url(../assets/img/udss_14.png);
  }
  .hidden {
    visibility: hidden;
  }
  .sort-wrapper {
    overflow: hidden;
    text-align: right;
  }
  .sort-group {
    padding-top: 10px;
    border-radius: 3px;
    line-height: 1;
  }
  .btn-sort {
    width: 55px;
    height: 30px;
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

  @media screen and (max-width: 1440px) {
    .btn-text {
      font-size: 12px;
    }
  }
</style>
