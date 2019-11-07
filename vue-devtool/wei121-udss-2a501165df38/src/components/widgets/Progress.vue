<template>
  <div class="progress-wrapper" :style="{padding: padding}">
    <div class="progress-track" :style="{height: width + 'px'}">
      <div class="progress-inner" :class="status" :style="{width: length + '%' }"></div>
      <div class="progress-label" :class="{'is-danger': percentage == 0}">{{percentage}}&nbsp;%</div>
      <div class="progress-bg"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Progress',
    data () {
      return {
        passLine: 50,
        goodLine: 80,
        completeLine: 100
      }
    },
    props: {
      percentage: {
        default: 0,
        required: true,
        validator (value) {
          return !isNaN(value)
        }
      },
      width: {
        default: 12,
        validator (value) {
          return !isNaN(value)
        }
      },
      padding: {
        default: '3px'
      },
      split: {
        default () {
          return [100, 80, 50]
        }
      }
    },
    computed: {
      status () {
        let status = ''
        if (this.percentage >= this.split[0]) {
          status = 'status-yellow'
        } else if (this.percentage >= this.split[1] && this.percentage < this.split[0]) {
          status = 'status-green'
        } else if (this.percentage >= this.split[2] && this.percentage < this.split[1]) {
          status = 'status-orange'
        } else {
          status = 'status-red'
        }
        return status
      },
      length () {
//        目标上限 160%
        return this.percentage * 5 / 10
      }
    }
  }
</script>

<style scoped>
  .progress-track {
    width: 100%;
    position: relative;
  }
  .progress-bg {
    top: 0;
    left: 0;
    width: 62.5%;
    height: 100%;
    z-index: 1049;
    position: absolute;
    background-color: #ebeef5;
    border-top-right-radius: 100px;
    border-bottom-right-radius: 100px;
  }
  .progress-inner {
    height: 100%;
    display: inline-block;
    vertical-align: top;
    position: relative;
    z-index: 1050;
    border-top-right-radius: 100px;
    border-bottom-right-radius: 100px;
    -webkit-transition: all 500ms;
    -moz-transition: all 500ms;
    -ms-transition: all 500ms;
    -o-transition: all 500ms;
    transition: all 500ms;
  }
  .progress-label {
    height: 100%;
    line-height: 100%;
    position: relative;
    z-index: 1050;
    display: inline-block;
    vertical-align: top;
    font-size: 12px;
  }
  .status-green {
    background: rgb(215,238,233); /* Old browsers */
    background: -moz-linear-gradient(top, rgba(215,238,233,1) 0%, rgba(111,192,172,1) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(215,238,233,1) 0%,rgba(111,192,172,1) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(215,238,233,1) 0%,rgba(111,192,172,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#d7eee9', endColorstr='#6fc0ac',GradientType=0 ); /* IE6-9 */
  }
  .status-yellow {
    background: rgb(252,248,177); /* Old browsers */
    background: -moz-linear-gradient(top, rgba(252,248,177,1) 0%, rgba(229,218,95,1) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(252,248,177,1) 0%,rgba(229,218,95,1) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(252,248,177,1) 0%,rgba(229,218,95,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fcf8b1', endColorstr='#e5da5f',GradientType=0 ); /* IE6-9 */
  }
  .status-orange {
    background: rgb(248,201,153); /* Old browsers */
    background: -moz-linear-gradient(top, rgba(248,201,153,1) 0%, rgba(222,142,82,1) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(248,201,153,1) 0%,rgba(222,142,82,1) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(248,201,153,1) 0%,rgba(222,142,82,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f8c999', endColorstr='#de8e52',GradientType=0 ); /* IE6-9 */
  }
  .status-red {
    background: rgb(250,161,154); /* Old browsers */
    background: -moz-linear-gradient(top, rgba(250,161,154,1) 0%, rgba(202,68,61,1) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(250,161,154,1) 0%,rgba(202,68,61,1) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(250,161,154,1) 0%,rgba(202,68,61,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#faa19a', endColorstr='#ca443d',GradientType=0 ); /* IE6-9 */
  }
  .is-danger {
    color: #f00;
  }
</style>
