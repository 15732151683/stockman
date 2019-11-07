<template>
  <Popover style="width: 50%"
    v-model="isDrop"
    placement="bottom"
    trigger="click">
    <div class="val" slot="reference">
      {{val}}
      <i style="color: black; font-weight: 900;font-size:12px;" :class="[isDrop ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" ></i>
    </div>
    <ul class="year-ul" v-show="isDrop" style="background: #FFFFFF; width: 50px" >
      <li :class="['year-li',{'active-list': val === year}]"  @click="select(year,index)"  v-for="(year,index) in year" :key="index">{{year}}</li>
    </ul>
  </Popover>
</template>

<script>
  import { Popover, Button } from 'element-ui'
  export default {
    data () {
      return {
        isDrop: false,
        nowIndex: 0,
        val: '',
        selectedTime: '',
        schemeId: [],
        round: []
      }
    },
    components: {
      Popover, Button
    },
    props: {
      allYear: {
        require: true
      },
      keys: {
        require: true
      },
      currentYear: {
        require: true
      }
    },
    computed: {
      year () {
        let arr = []
        if (this.allYear.org_ind_data && this.allYear.present_ind_id) {
          this.allYear.year_data_list.forEach(item => {
            if (item) {
              arr.push(item.year)
            }
          })
        }
        return arr
      }
    },
    methods: {
      selected () {
        this.isDrop = !this.isDrop
      },
      select (val, index) {
        this.val = val
//        console.log(index)
        this.selected()
        this.$emit('sendYear3', this.val, this.keys)
      }
    },
    mounted () {
      this.val = this.currentYear
    },
    watch: {
      currentYear () {
        this.val = this.currentYear
      }
    }
  }
</script>


<style scoped>
  .active-list{
    color: #409EFF;
  }
  .year-ul{
    width: auto !important;
  }
  .val{
    width:130px;
    text-align: left;
    color: #898989;
    font-size:12px;
  }
  .year-li{
    width: auto !important;
    list-style: none;
    text-align: left;
    margin-bottom: 20px;
    cursor: pointer
  }
</style>
