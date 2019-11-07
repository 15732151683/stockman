<template>
  <div class="label-box">
    <div class="label-button">
      <Select
        v-model="value10"
        multiple
        @remove-tag="deleteTag"
        @change="confirmFilter()"
        default-first-option
        :placeholder="'按' + title + '搜索'">
        <Option
          v-for="item in list"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          <li @click="changed(item)">
            <Checkbox v-model="item.check" style="margin-left: 10px"></Checkbox>
            <span style="margin-left: 20px"> {{item.name}} </span>
          </li>
        </Option>
      </Select>
    </div>
  </div>
</template>

<script>
    import { Select, Option, Checkbox } from 'element-ui'
    export default {
      name: 'labelManage',
      components: {
        Select, Option, Checkbox
      },
      data () {
        return {
          value10: [],
          ww: true
        }
      },
      props: {
        title: {
          default: ''
        },
        listA: {
          default: function () {
            return []
          },
          type: Array
        }
      },
      computed: {
        list () {
          this.listA.forEach(item => {
            item.check = false
          })
          return this.listA
        }
      },
      methods: {
        deleteTag (val) {
          this.list.find(item => {
            if (item.id === val) {
              item.check = !item.check
            }
          })
        },
        confirmFilter () {
          this.$emit('selected', this.value10)
        },
        changed (val) {
          val.check = !val.check
        }
      },
      watch: {
        listA () {
        }
      }
    }
</script>

<style scoped>
  .label-button{
    position: relative;
  }
  .college-tag-button {
    outline: none;
    border: none;
    padding: 10px 30px;
    color: #ffffff;
    background-color: #E4AD59 !important;
    background-image: -moz-linear-gradient(top, #EBB747, #DDA46B) !important;
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #EBB747), color-stop(1,#DDA46B)) !important;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EBB747', endColorstr='#DDA46B', GradientType =0) !important;
  }
  .label-list{
    background: white;
    position: absolute;
    z-index: 1000;
  }
  .el-checkbox.el-checkbox{
    margin-left: 0;
  }
</style>
