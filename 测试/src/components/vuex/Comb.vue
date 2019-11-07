<template>
<div>
  <h2>我是comb组件;数量是：{{ $store.state.count }}</h2>
  <button @click="minus">点击我减减</button>
</div>
</template>

<script>
    export default {
        name: "",
        methods:{
          minus(){
              // this.$store.commit("minus",3);
            this.$store.dispatch("minus",3);
          }
        }
    }
</script>

<style scoped>

</style>
