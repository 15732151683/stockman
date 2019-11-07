<template>
  <div class="list-wrapper">
    <ul class="list">
      <li class="list-item-brand">
        <p class="list-item-label">
          <span :title="college.name" @click="test">{{college.name}}&nbsp;</span>
          <!--<span class="collge-name-icon" :class="'icon-' + college.type"></span>-->
        </p>
        <div class="list-item-progress">
          <completion-progress :percentage="college.completion" :padding="'9px 3px'"></completion-progress>
        </div>
      </li>
      <li v-for="(level1, index1) in college.target" :key="index1">
        <div class="list-item-level1">
          <p
            class="list-item-label"
            @click="toggleTreeview(level1)"
            :class="{'color-light-grey': level1.noLabel}">
            <span class="fa label-icon" :class="['fa-' + (level1.expand ? 'minus' : 'plus') + '-square-o']"></span>
            <span :title="level1.name" class="{'no-label': level1.noLabel}">{{level1.name}}&nbsp;</span>
          </p>
          <div class="list-item-progress">
            <completion-progress
              :percentage="level1.completion"
              :padding="'9px 3px'"
              :noLabel="level1.noLabel"></completion-progress>
          </div>
        </div>
        <transition name="fade">
          <ul class="list" v-show="level1.expand">
            <li v-for="(level2, index2) in level1.children" :key="index2">
              <div class="list-item-level2">
                <p
                  class="list-item-label"
                  @click="toggleTreeview(level2)"
                  :class="{'color-light-grey': level2.noLabel}">
                  <span class="fa label-icon" :class="['fa-' + (level2.expand ? 'minus' : 'plus') + '-square-o']"></span>
                  <span :title="level2.name">{{level2.name}}&nbsp;</span>
                </p>
                <div class="list-item-progress">
                  <completion-progress
                    :percentage="level2.completion"
                    :padding="'9px 3px'"
                    :noLabel="level2.noLabel"></completion-progress>
                </div>
              </div>
              <transition name="fade">
                <ul class="list" v-show="level2.expand">
                  <li v-for="(level3, index3) in level2.children" :key="index3">
                    <div class="list-item-level3">
                      <p class="list-item-label" :class="{'color-light-grey': level3.noLabel}">
                        <span :title="level3.name">{{level3.name}}&nbsp;</span>
                      </p>
                      <div class="list-item-progress">
                        <completion-progress
                          :percentage="level3.completion"
                          :padding="'9px 3px'"
                          :noLabel="level3.noLabel"></completion-progress>
                      </div>
                    </div>
                  </li>
                </ul>
              </transition>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import CompletionProgress from '../../widgets/Progress2.vue'

  export default {
    name: 'Dept',
    components: {
      CompletionProgress
    },
    methods: {
      ...mapMutations('completion', ['toggleDeptGlobalExpand']),
      toggleTreeview (item) {
        item.expand = !item.expand
        this.toggleDeptGlobalExpand(item.id)
      },
      test () {
        console.log(this.college)
      }
    },
    computed: {
      ...mapGetters('completion', ['college'])
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
  .list-item-brand,
  .list-item-level1,
  .list-item-level2,
  .list-item-level3 {
    height: 30px;
    line-height: 30px;
  }
  .list-item-level2 .list-item-label{
    text-indent: 8px;
  }
  .list-item-level3 .list-item-label{
    text-indent: 36px;
  }
  .list-item-brand .list-item-label {
    font-weight: 600;
    font-size: 1em;
  }
  .list-item-label {
    width: 35%;
    min-width: 240px;
    max-width: 280px;
    float: left;
    color: #555;
    clear: both;
    font-size: 12px;

    word-wrap: break-word;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;
  }
  .list-item-label.color-light-grey {
    color: #ccc;
  }
  .list-item-progress {
    overflow: hidden;
  }
  .fade-enter-active {
    transition: all 300ms linear;
  }
  .fade-leave-active {
    transition: all 300ms linear;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .collge-name-icon {
    width: 18px;
    height: 18px;
    display: inline-block;
    vertical-align: middle;
  }
  .icon-dept {
    background: url(../../../assets/img/icon-dept.png) no-repeat;
  }
  .icon-fac {
    background: url(../../../assets/img/icon-fac.png) no-repeat;
  }
</style>
