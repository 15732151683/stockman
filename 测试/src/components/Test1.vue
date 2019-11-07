<template>
    <div>
      我是test1组件<button @click="tochildren">点击</button>
    </div>
</template>

<script>
    export default {
        name: "",
        methods:{
          tochildren(){
              this.$emit("test")
          }
        }
    }
</script>

<style scoped>

</style>
