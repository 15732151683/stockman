<template>
  <div class="tabs-box">
    <div class="tabs-button-box">
      <button :class="['tabs-button', {'tabs-is-active': activeTab === 1}]" @click="activeTab = 1">{{name[0]}}</button>
      <button :class="['tabs-button', {'tabs-is-active': activeTab === 2}]" @click="activeTab = 2">{{name[1]}}</button>
    </div>
    <div class="tabs-body" v-show="activeTab === 1">
      <slot name="Tabs1"></slot>
    </div>
    <div class="tabs-body" v-show="activeTab === 2">
      <slot name="Tabs2"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Tabs',
    data () {
      return {
        activeTab: 1
      }
    },
    props: {
      name: {
        default: ['', '']
      }
    }
  }
</script>

<style scoped>
  .tabs-box {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .tabs-button-box{
    height: 40px;
    margin-top: 10px;
    overflow: hidden;
  }
  .tabs-button{
    float: left;
    cursor: pointer;
    width: 50%;
    line-height: 40px;
    font-size: 16px;
    color: #767474;
    outline: none;
    border: none;
    text-decoration: none;
    background-image: -moz-linear-gradient(top, #F2F2F2, #D6D6D6);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #F2F2F2), color-stop(1,#D6D6D6));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#F2F2F2', endColorstr='#D6D6D6', GradientType =0);
  }
  .tabs-is-active{
    background: #F3F3F3;
  }
  .tabs-body {
    height: calc(100% - 50px);
    overflow-y: auto;
  }
</style>
