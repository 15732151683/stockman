<template>
  <div class="list-wrapper">
    <ul class="list">
      <li class="list-item" v-for="(item, index) in target" :key="index">
        <div class="list-item-label">
          <span class="label-name" :title="item.name">{{item.name}}&nbsp;</span>
          <span class="label-icon" :class="'icon-' + item.type"></span>
        </div>
        <div class="list-item-progress">
          <completion-progress :percentage="item.completion" :padding="'9px 3px'"></completion-progress>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import CompletionProgress from '../../widgets/Progress2.vue'

  export default {
    name: 'Home',
    components: {CompletionProgress},
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
    height: 30px;
    line-height: 30px;
  }
  .list-item-label {
    width: 240px;
    float: left;
    color: #555;
    clear: both;
    font-size: 12px;
  }
  .label-name {
    display: inline-block;
    vertical-align: top;
    width: 210px;
    font-size: 12px;
    text-align: right;

    word-wrap: break-word;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;
  }
  .label-icon {
    width: 24px;
    height: 18px;
    margin-top: 6px;
    font-size: 12px;
    display: inline-block;
    vertical-align: top;
  }
  .icon-fac {
    background: url(../../../assets/img/icon-fac.png) no-repeat;
  }
  .icon-dept {
    background: url(../../../assets/img/icon-dept.png) no-repeat;
  }
  .list-item-progress {
    overflow: hidden;
  }
</style>
