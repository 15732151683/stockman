<template>
  <div class="list-wrapper">
    <ul class="list">
      <li class="list-item" v-for="(item, index) in target" :key="index" v-show="item.completion && item.completion >= 0">
        <div class="list-item-label" @click="changeSchool(item)">
          <span class="label-name" :title="item.name">{{item.abridge}}&nbsp;</span>
        </div>
        <div class="list-item-progress">
          <completion-progress
            :showItem="true"
            :real="item.real"
            :target="item.target"
            :percentage="item.completion"
            :padding="'8px 3px'"
            :noLabel="item.noLabel">
          </completion-progress>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import CompletionProgress from '../../widgets/Progress.vue'
  import { Popover } from 'element-ui'

  export default {
    name: 'Home',
    components: {CompletionProgress, Popover},
    methods: {
      changeSchool (data) {
        this.$emit('childMethod', data, 'dept')
      }
    },
    computed: {
      ...mapGetters('completion', ['target'])
    }
  }
</script>

<style scoped>
  .list-wrapper {
    min-height: 100%;
  }
  .list {
    list-style: none;
  }
  .list-item {
    height: 36px;
    line-height: 36px;
  }
  .list-item-label {
    cursor: pointer;
    width: 80px;
    float: left;
    color: #555;
    clear: both;
    font-size: 12px;
  }
  .label-name {
    display: inline-block;
    vertical-align: top;
    width: 60px;
    font-size: 12px;
    text-align: right;
    word-wrap: break-word;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;
  }
  .list-item-progress {
    cursor: pointer;
    overflow: hidden;
  }
  .progress-title {
    cursor: pointer;
    line-height: 28px;
    text-align: center;
    background-color: #1EBBA6;
    color: #FFFFFF;
    padding: 0 5px;
  }
  ul, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .progress-list {
    margin: 10px 10px 0 10px;
    color: #7b7b7b;
  }
  .progress-list span {
    display: inline-block;
  }
  .progress-list span:nth-child(1) {
      width: 40%;
  }
  .progress-list span:nth-child(2) {
    text-align: right;
    width: 60%;
  }
</style>
