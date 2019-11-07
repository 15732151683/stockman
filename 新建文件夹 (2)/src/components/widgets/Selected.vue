<template>
  <Popover
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
        if (this.allYear.type_id) {
          this.allYear.eva_univ_rank_list.forEach(item => {
            if (item.eva_scheme_id) {
              arr.push(item.year)
              this.schemeId.push(item.eva_scheme_id)
            }
          })
        } else if (this.allYear.year_data_list) {
          this.allYear.year_data_list.forEach(item => {
            if (item.group_name) {
              arr.push(item.group_name)
              this.schemeId.push(item.year)
            }
          })
        } else if (this.allYear.org_ind_data && this.allYear.present_ind_id) {
          console.log(22222222222333)
          this.allYear.year_data_list.forEach(item => {
            if (item.org_id) {
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
        this.$emit('sendYear', this.val, this.keys, this.schemeId[index], index)
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
    width:160px;
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
