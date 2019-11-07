<template>
  <div class="container">
    <div class="container-header">
      <h2>Per-Capita Performance</h2>
    </div>
    <div class="container-body">
      <div class="toolbar">
        <div class="btn-wrapper">
          <div class="sticker sticker-output"></div>
          <div
            v-for="sticker in stickers"
            :key="sticker.id"
            :class="sticker.type"
            class="sticker cursor-forbid"></div>
          <div class="sticker sticker-add cursor-forbid"></div>
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
    name: 'PerCapita',
    data () {
      return {
        chart: {},
        stickers: [
          {
            id: 0,
            type: 'sticker0'
          },
          {
            id: 1,
            type: 'sticker1'
          },
          {
            id: 2,
            type: 'sticker2'
          },
          {
            id: 3,
            type: 'sticker3'
          },
          {
            id: 4,
            type: 'sticker4'
          }
        ],
        data: [
          [77, 228140, 'Department of Chemistry'],
          [102, 252400, 'Department of Mathematics'],
          [235, 191060, 'Faculty of Engineering'],
          [46, 158310, 'Department of Physics'],
          [262, 79690, 'Faculty of Computing and Information Technology'],
          [130, 58610, 'Faculty of Environmental Designs'],
          [138, 43440, 'Faculty of Meteorology, Environment and Arid Land Agriculture'],
          [601, 29920, 'Faculty of Medicine'],
          [201, 37110, 'Faculty of Pharmacy'],
          [59, 20750, 'Faculty of Earth Sciences'],
          [58, 7740, 'Faculty of Marine Sciences'],
          [216, 6830, 'Faculty of Applied Medical Sciences'],
          [50, 4800, 'Faculty of Dentistry'],
          [70, 6790, 'Faculty of Art & Humanities'],
          [127, 3610, 'Faculty of Nursing'],
          [312, 3100, 'Faculty of Economics and Administration'],
          [20, 920, 'Jeddah Community Collage'],
          [69, 510, 'Faculty of Law'],
          [45, 470, 'Faculty of Maritime Studies'],
          [40, 130, 'Faculty of Communication and Media'],
          [35, 370, 'Faculty of Home Economics'],
          [9, 90, 'Islamic Economics Institute'],
          [300, 80, 'English Language Institute'],
          [17, 0, 'Faculty Tourism'],
          [8, 10, 'Institute of Educational Graduate Studies'],
          [50, 0, 'The Arabic Language Institute for Speakers of Other Languages']
        ],
        xMax: 650,
        yMax: 300000
      }
    },
    methods: {
      getSlope () {
        return [
          {
            name: 'Slope',
            coord: [0, 0]
          },
          {
            coord: (this.output / this.input > this.yMax / this.xMax)
              ? [this.input / this.output * this.yMax, this.yMax]
              : [this.xMax, this.output / this.input * this.xMax]
          }
        ]
      },
      getGradientPoint () {
        let [x, y] = this.getSlope()[1].coord
        x /= this.xMax
        y /= this.yMax
        let [width, height] = x > y ? [x / y, x] : [y, y / x]
        // this.output > this.input => Slope > 1
//        let slope = - this.input / this.output
//        let x0 = this.output / this.input
        return this.output > this.input
          ? [1 - width, 1, height, width, 0.5]
          : [0, 1 - height, height, width, 0.5]
      },
      create () {
//        let [x, y, width, height, colorStop] = this.getGradientPoint()
//        console.log(width, height)
        let _self = this
        this.chart = echarts.init(this.$refs.graph)
        this.chart.setOption({
          backgroundColor: '#fff',
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              if (params[0].componentType === 'series') {
                return '<div>' + params[0].value[2] + ': ' + '<span style="font-weight: 600;">' +
                  (params[0].value[1] / params[0].value[0]).toFixed(2) + '</span></div>'
              }
            },
            backgroundColor: '#fff',
            borderColor: '#ccc',
            borderWidth: 1,
            textStyle: {
              color: '#333',
              fontSize: 14,
              fontFamily: 'Roboto'
            },
            axisPointer: {
              show: true,
              type: 'cross',
              lineStyle: {
                type: 'dashed',
                width: 1
              },
              label: {
                precision: 0
              }
            },
            extraCssText: 'border-radius: 0;',
            triggerOn: 'none'
          },
          grid: {
            show: true,
            left: 100,
            borderWidth: 0,
//            backgroundColor: '#E5F7F6',
            backgroundColor: '#E5F7F6'
          },
          xAxis: {
            name: 'Staff',
            type: 'value',
            nameGap: 35,
            nameLocation: 'center',
            nameTextStyle: {
              color: '#393939',
              fontSize: 18,
              fontFamily: 'Roboto',
              fontWeight: 600
            },
            max: this.xMax,
            interval: 50,
            splitLine: {
              show: false
            },
            axisTick: {
              show: false,
              interval: 50
            },
            axisLabel: {
              color: '#393939'
            },
            axisLine: {
              lineStyle: {
                color: '#777',
                width: 2
              }
            }
          },
          yAxis: {
            name: 'Output',
            type: 'value',
            nameGap: 70,
            nameLocation: 'center',
            nameTextStyle: {
              fontSize: 18,
              fontFamily: 'Roboto',
              fontWeight: 600,
              color: '#393939'
            },
            max: this.yMax,
            splitLine: {
              show: false
            },
            axisTick: {
              show: false,
              interval: 50
            },
            axisLabel: {
              color: '#393939'
            },
            axisLine: {
              lineStyle: {
                color: '#777',
                width: 2
              }
            }
          },
          series: [
            {
              name: 'scatter',
              type: 'scatter',
              animation: false,
              itemStyle: {
                normal: {
                  color: function (params) {
                    return params.value[1] / params.value[0] > _self.output / _self.input ? '#1ebba6' : '#FF9800'
                  }
                },
                emphasis: {
                  borderColor: '#fff',
                  borderWidth: 3
                }
              },
              markLine: {
                symbol: 'image://',
                lineStyle: {
                  normal: {
                    color: '#1ebba6',
                    type: 'dashed',
                    width: 1.4
                  }
                },
                label: {
                  normal: {
                    show: false
                  }
                },
                data: [this.getSlope()]
              },
              data: this.data
            }
          ]
        })
        this.chart.on('mouseover', function (params) {
          if (params.componentType === 'series') {
            _self.chart.dispatchAction({
              type: 'showTip',
              seriesIndex: 0,
              dataIndex: params.dataIndex
            })
          }
        })
        this.chart.on('mouseout', function (params) {
          if (params.componentType === 'series') {
            _self.chart.dispose()
            _self.create()
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
        this.$emit('mounted')
        this.create()
      })
    },
    computed: {
      input () {
        return this.data.map(item => item[0]).reduce((sum, value) => sum + value)
      },
      output () {
        return this.data.map(item => item[1]).reduce((sum, value) => sum + value)
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
  .btn-wrapper {
    float: left;
    height: 50px;
    line-height: 50px;
    margin-left: 50px;
  }
  .content {
    height: calc(100% - 50px);
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .graph-wrapper {
    /*width: 800px;*/
    height: 100%;
    min-height: 400px;
    /*margin-left: auto;*/
    /*margin-right: auto;*/
    background: #eed;
  }
  .sticker {
    width: 105px;
    height: 42px;
    margin: 0 3px;
    outline: 0;
    cursor: pointer;
    user-select: none;
    background-size: cover;
    background-repeat: no-repeat;
    display: inline-block;
    vertical-align: top;
  }
  .sticker-output {
    background-image: url(../assets/img/udss_55.png);
  }
  .sticker0 {
    background-image: url(../assets/img/udss_57.png);
  }
  .sticker1 {
    background-image: url(../assets/img/udss_59.png);
  }
  .sticker2 {
    background-image: url(../assets/img/udss_61.png);
  }
  .sticker3 {
    background-image: url(../assets/img/udss_63.png);
  }
  .sticker4 {
    background-image: url(../assets/img/udss_65.png);
  }
  .sticker-add {
    width: 42px;
    background-image: url(../assets/img/udss_67.png);
  }
</style>
