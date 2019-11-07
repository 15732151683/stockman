<template>
    <div>
      <img class="catStyle" src="../assets/cat.jpeg" />
      <h2>我是猫组件</h2>
      <p>猫的颜色{{ $route.params.color }}；性别是：{{$route.params.sex}}</p>
      <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "",
        created:function () {
          console.log(this.$route);
          // console.log(this.$router)
        }
    }
</script>

<style scoped>
  .catStyle{
    width: 200px;
  }

</style>
