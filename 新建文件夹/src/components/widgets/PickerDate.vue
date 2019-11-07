<template>
  <Popover
    @show="activeStatus = true"
    @hide="handleHide"
    v-model="visiblePopover"
    placement="bottom"
    trigger="click">
    <div v-if="activeStatus">
      <div class="picker-date-box">
        <div class="picker-date-left">
          <div class="picker-date-top">
            <i class="arrow-left el-icon-d-arrow-left" @click="reduceLeft"></i>
            <i class="arrow-right el-icon-d-arrow-right" @click="addLeft"></i>
            <div class="picker-date">{{leftList[0]}} - {{leftList[9]}}</div>
          </div>
          <div class="picker-date-main">
            <ul class="picker-date-list">
              <li
                :class="[{'hover-list': (startTime < item && item <= endTime)}, {'active-list': startTime === item}]"
                :key="index" v-for="(item, index) in leftList"
                @click="changeStart(item)"
              >{{item}}</li>
            </ul>
          </div>
        </div>
        <div class="picker-date-right" v-if="type === 'range'">
          <div class="picker-date-top">
            <i class="arrow-left el-icon-d-arrow-left" @click="reduceRight"></i>
            <i class="arrow-right el-icon-d-arrow-right" @click="addRight"></i>
            <div class="picker-date">{{rightList[0]}} - {{rightList[9]}}</div>
          </div>
          <div class="picker-date-main">
            <ul class="picker-date-list">
              <li
                :key="index"
                v-for="(item, index) in rightList"
                :class="[{'forbid-list': (startTime > item || item >= (startTime * 1 + maxRange) )}, {'hover-list': (startTime <= item && item < endTime)}, {'active-list': endTime === item}]"
                @click="changeEnd(item)"
              >{{item}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="picker-footer">
        <Button
          style="float: right;"
          type="primary"
          class="button-add"
          size="small"
          @click="visiblePopover = false">确定</Button>
      </div>
    </div>
    <div slot="reference" :style="{width: width, display: 'inline-block'}">
      <Input v-if="showInput" :style="{width: width}" v-model="cloneRang" placeholder="请输入时间" prefix-icon="el-icon-date" :size="size" />
    </div>
    <!--<button  @click.stop="" class="picker-date-input" ><i class="el-icon-date"></i>&nbsp;&nbsp;{{cloneRang}}</button>-->
  </Popover>
</template>

<script>
  import { Popover, Button, Input } from 'element-ui'
  export default {
    name: 'PickerDate',
    components: {
      Popover, Button, Input
    },
    props: {
      range: {
        require: true
      },
      type: {
        require: true,
        default: 'range'
      },
      maxRange: {
        default: 100
      },
      size: {
        default: 'mini'
      },
      width: {
        default: '110px'
      },
      height: {
        default: '30px'
      }
    },
    data () {
      return {
        startTime: '',
        endTime: '',
        leftTop: '',
        rightTop: '',
        leftList: [],
        rightList: [],
        nowTime: '',
        cloneRang: '',
        activeStatus: false,
        visiblePopover: false,
        memoryRange: '',
        showInput: true
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.cloneRang = this.range
        this.memoryRange = this.range
      })
    },
    methods: {
      rangeTime (data) {
        let arr = []
        let num = data % 10
        if (num === 0) {
          for (let i = 0; i < 10; i++) {
            arr.push(String(data + i))
          }
        } else {
          let total = Number(data) - num
          for (let i = 0; i < 10; i++) {
            arr.push(String(total + i))
          }
        }
        return arr
      },
      addRangeTime (data) {
        return data.map(node => {
          return String(Number(node) + 10)
        })
      },
      reduceRangeTime (data) {
        return data.map(node => {
          return String(Number(node) - 10)
        })
      },
      reduceLeft () {
        this.leftList = this.reduceRangeTime(this.leftList)
      },
      addLeft () {
        this.leftList = this.addRangeTime(this.leftList)
      },
      reduceRight () {
        this.rightList = this.reduceRangeTime(this.rightList)
      },
      addRight () {
        this.rightList = this.addRangeTime(this.rightList)
      },
      initLeft (str) {
        this.leftList = str ? this.rangeTime(Number(str)) : this.rangeTime(Number(this.nowTime))
      },
      initRight (str) {
        this.rightList = str ? this.rangeTime(Number(str)) : this.rangeTime(Number(this.nowTime))
      },
      changeStart (item) {
        this.startTime = item
        if (this.startTime > this.endTime) {
          this.endTime = this.startTime
        } else if (this.endTime >= this.startTime * 1 + this.maxRange) {
          this.endTime = this.startTime * 1 + this.maxRange - 1 + ''
        }
        if (this.type === 'range') {
          this.cloneRang = this.startTime + '-' + this.endTime
        } else {
          this.cloneRang = this.startTime
        }
      },
      changeEnd (item) {
        if (item >= this.startTime && item < this.startTime * 1 + this.maxRange) {
          this.endTime = item
          this.cloneRang = this.startTime + '-' + this.endTime
        }
      },
      handleHide () {
        this.activeStatus = false
        if (this.memoryRange !== this.cloneRang) {
          this.$emit('rangeChange', this.cloneRang)
        }
      }
    },
    watch: {
      startTime () {
        this.initLeft(this.startTime)
      },
      endTime () {
        if (this.type === 'range') {
          this.initRight(this.endTime)
        }
      },
      // cloneRang () {
      //   this.showInput = false
      //   setTimeout(() => {
      //     this.showInput = true
      //   }, 2)
      // },
      activeStatus () {
        if (this.activeStatus) {
          this.memoryRange = this.cloneRang
          if (this.type === 'range') {
            this.nowTime = String(new Date().getFullYear())
            if (this.cloneRang) {
              let arr = this.cloneRang.split('-')
              this.startTime = arr[0]
              this.endTime = arr[1]
            } else {
              this.startTime = this.nowTime
              this.endTime = this.nowTime
            }
          } else {
            this.nowTime = String(new Date().getFullYear())
            if (this.cloneRang) {
              this.startTime = this.cloneRang
            } else {
              this.startTime = this.nowTime
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  ul, li{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .picker-date-box{
    height: 180px;
  }
  .picker-date-left, .picker-date-right{
    padding: 0px 10px 10px 10px;
    width: 200px;
    border: solid 1px #E5E5E5;
    height: 170px;
    float: left;
  }
  .picker-date-top{
    height: 40px;
    line-height: 40px;
    border-bottom: solid 1px #E5E5E5;
    text-align: center;
  }
  .picker-date-top i{
    font-size: 20px;
    display: block;
    margin-top: 10px;
    cursor: pointer;
  }
  .arrow-left{
    float: left;
  }
  .arrow-right{
    float: right;
  }
  .picker-date-list{
    margin-top: 10px;
  }
  .picker-date-list li{
    width: 50px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    float: left;
    cursor: pointer;
  }
  .active-list{
    background-color: #4A90E2 !important;
    color: #FFFFFF;
  }
  .hover-list{
    background-color: #EAF8FE;
  }
  .forbid-list{
    background-color: #F3F3F3;
    cursor: not-allowed !important;
  }
  .picker-date-input{
    outline: none;
    border: solid 1px #E5E5E5;
    background-color: #FFFFFF;
    color: #666666;
    text-align: left;
    text-indent: 3px;
  }
  .picker-footer {
    text-align: right;
    margin-top: 5px;
  }
</style>
