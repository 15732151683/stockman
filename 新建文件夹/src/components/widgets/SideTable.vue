<template>
  <div class="filter-wrapper transition" :style="{width: tabShow ? '300px' : '40px'}">
    <transition name="slide-fade">
      <div :style="{paddingTop: barHeight + 'px'}" class="select-table sider-table" @mousewheel.stop="">
        <div @click="changeTab" :class="['button-sider', {'is-active': !tabShow}]" v-show="allData.length > 0"></div>
        <div class="tags-box" :style="{marginTop: -barHeight + 'px'}" ref="elementBar" v-show="allData.length > 0 && tabShow">
          <div class="tags-title">标签选择</div>
          <div class="tags-list">
            <button @click="changeTag(tag)" :class="['tag-button', {'tag-button-active': tag.active}]" :key="tag.id" v-for="tag in collegeTag">{{tag.name}}</button>
          </div>
        </div>
        <div class="define-table-th" v-show="allData.length > 0 && tabShow">
          <Checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></Checkbox>&nbsp;&nbsp;全部院系
        </div>
        <ul class="define-table-td" v-show="allData.length > 0 && tabShow">
          <CheckboxGroup v-model="checkedCollege" @change="handleCheckedChange">
            <li class="one-line" v-for="node in colleges" :key="node.id">
              <Checkbox :label="node" :key="node.id">{{node.abridge}} - {{node.name}}</Checkbox>
            </li>
          </CheckboxGroup>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
  import { Checkbox, CheckboxGroup } from 'element-ui'
  export default {
    name: 'SideTable',
    props: {
      tabShow: {
        require: true
      },
      collegeTag: {
        default: true
      },
      colleges: {
        require: true
      },
      allData: {
        require: true,
        default: []
      }
    },
    components: {
      Checkbox, CheckboxGroup
    },
    data () {
      return {
        barHeight: 0,
        checkAll: false,
        isIndeterminate: true,
        checkedCollege: []
      }
    },
    methods: {
      changeTab () {
        this.$emit('handleShow')
      },
      handleCheckedChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.colleges.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.colleges.length
        this.changeActiveTag(value)
      },
      changeActiveTag (data) {
        let arr = []
        data.forEach(node => {
          if (node.tags && node.tags.length > 0) {
            node.tags.forEach(tag => {
              arr.findIndex(child => child.id === tag.id) < 0 && arr.push(tag)
            })
          }
        })
        if (arr.length === this.collegeTag.length) {
          this.collegeTag.forEach(node => {
            node.active = true
          })
        } else if (arr.length === 0) {
          this.collegeTag.forEach(node => {
            node.active = false
          })
        } else {
          this.collegeTag.forEach(node => {
            arr.findIndex(item => item.id === node.id) > -1 ? node.active = true : node.active = false
          })
        }
      },
      handleCheckAllChange (val) {
        this.checkedCollege = val ? this.colleges : []
        this.isIndeterminate = false
        let status
        this.checkedCollege.length === 0 ? status = false : status = true
        this.collegeTag.forEach(node => {
          node.active = status
        })
      },
      handleSelectDefault () {
        let arr = []
        arr = this.colleges.length < 19 ? this.colleges : this.colleges.slice(0, 18)
        this.checkedCollege = arr
        let checkedCount = arr.length
        this.checkAll = checkedCount === this.colleges.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.colleges.length
        this.changeActiveTag(arr)
      },
      changeTag (item) {
        item.active = !item.active
        let filterData = this.filterCollge()
        let checkedCount = filterData.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.colleges.length
        this.checkedCollege = filterData
      },
      filterCollge () {
        let arr = []
        this.collegeTag.forEach(tag => {
          if (tag.active === true) {
            let data = this.colleges.filter(node => {
              return node.tags.findIndex(child => child.id === tag.id) > -1
            })
            data.forEach(item => {
              arr.findIndex(eve => eve.id === item.id) < 0 && arr.push(item)
            })
          }
        })
        return arr
      }
    },
    watch: {
      allData () {
        if (this.allData && this.allData.length !== 0) {
          this.collegeTag.forEach(node => {
            node.active = true
          })
          setTimeout(() => {
            this.barHeight = document.getElementsByClassName('tags-box')[0].offsetHeight
          }, 10)
        }
      },
      colleges () {
        if (this.colleges && this.colleges.length !== 0) {
          this.handleSelectDefault()
        }
      },
      checkedCollege () {
        this.$emit('handleChange', this.checkedCollege)
      }
    },
    mounted () {
      this.$nextTick(function () {
        if (this.allData.length > 0) {
          this.handleSelectDefault()
          this.barHeight = document.getElementsByClassName('tags-box')[0].offsetHeight
        }
      })
    }
  }
</script>

<style scoped>
  .button-sider {
    cursor: pointer;
    width: 18px;
    height: 18px;
    margin-bottom: 15px;
    position: absolute;
    right: 0;
    top: 11px;
    background: url(../../assets/img/detail.png) no-repeat;
  }
  .button-sider.is-active {
    -moz-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
    filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);
  }
  .filter-wrapper {
    float: right;
    background-color: #ffffff;
    height: 100%;
  }
  .tags-box{
    padding-bottom: 10px;
  }
  .tags-title {
    height: 40px;
    padding-left: 50px;
    font-size: 14px;
    line-height: 40px;
    font-weight: bolder;
    background: url('../../assets/img/collegeTag.png') no-repeat;
    background-position: top 10px left 15px;
    background-color: #DBDBDB;
  }
  .tag-button{
    cursor: pointer;
    font-size: 12px;
    margin-top: 10px;
    margin-right: 10px;
    border: none;
    outline: none;
    padding: 5px 10px;
    border-radius: 4px;
    background-color: #F3F3F3;
    color: #545151;
  }
  .tag-button-active{
    color: #FFFFFF;
    background-color: #E4AD59;
    background-image: -moz-linear-gradient(top, #EBB747, #DDA46B);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #EBB747), color-stop(1,#DDA46B));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EBB747', endColorstr='#DDA46B', GradientType =0);
  }
  .select-table {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    overflow: hidden;
    position: relative;
    font-size: 12px !important;
    box-sizing: border-box ;
    -moz-box-sizing:border-box; /* Firefox */
    -webkit-box-sizing:border-box; /* Safari */
  }
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .4s ease;
  }
  .slide-fade-leave-active {
    transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  .transition {
    transition: all 400ms linear;
  }
  .define-table-th{
    margin-top: 10px;
    height: 40px;
    padding-left: 20px;
    font-size: 14px;
    background-color: #DBDBDB;
    color: #000000;
    line-height: 40px;
    font-weight: bolder;
  }
  .define-table-td {
    border-left: solid 1px #DBDBDB;
    border-bottom: solid 1px #DBDBDB;
    border-right: solid 1px #DBDBDB;
    height: calc(100% - 52px);
    overflow: hidden;
    overflow-y: scroll;
  }
  .define-table-td li{
    height: 40px;
    overflow: hidden;
    line-height: 40px;
    padding-left: 20px;
    border-bottom: solid 1px #DBDBDB;
  }
</style>
