<template>
  <div
    class="modal-bg"
    :class="{hidden: !show}"
    @click="handClose()">
    <div
      class="modal-content"
      :class="{hidden: !show}"
      :style="{marginTop: top + 'px', width: width + 'px'}" @click.stop>
      <slot name="header"></slot>
      <slot name="body"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Modal',
    props: {
      show: {
        default: false
      },
      top: {
        type: Number,
        default: 100
      },
      width: {
        type: Number,
        default: 400
      }
    },
    methods: {
      handClose () {
        this.$emit('handClose')
      }
    }
  }
</script>

<style scoped>
  .modal-bg {
    position: fixed;
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1049;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal-content {
    min-width: 400px;
    margin-left: auto;
    margin-right: auto;
    background-color: #fff;
    border-radius: 3px;
    border: 1px solid rgba(0,0,0,.2)
  }
  .hidden {
    display: none;
  }
</style>
