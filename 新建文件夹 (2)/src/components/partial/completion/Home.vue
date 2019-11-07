<template>
  <div class="list-wrapper">
    <ul class="list">
      <li class="list-item" v-for="(item, index) in target" :key="index" v-show="item.completion && item.completion >= 0">
        <div class="list-item-label" @click="changeSchool(item)">
          <span class="label-name" :title="item.name">{{item.abridge}}&nbsp;</span>
        </div>
        <div class="list-item-progress">
          <completion-progress :percentage="item.completion" :padding="'8px 3px'" :noLabel="item.noLabel"></completion-progress>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import CompletionProgress from '../../widgets/Progress.vue'

  export default {
    name: 'Home',
    components: {CompletionProgress},
    computed: {
      ...mapGetters('completion', ['target'])
    },
    methods: {
      changeSchool (data) {
        this.$emit('childMethod', data, 'dept')
      }
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
    overflow: hidden;
  }
</style>
