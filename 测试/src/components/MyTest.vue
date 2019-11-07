<template>
<div>
   <h2>我是mytest组件</h2>
    <p>姓名是:{{ name }};年龄是：{{ age }}</p>
    <button @click="sub">点击我将参数传递到父级</button>
</div>
</template>

<script>
  //app.vue引入 MyTest组件 并且传参数 name：张三  age：20；
  //并且 通过事件 将接收到的参数传递至 app.vue;
    export default {
      name: "",
      props:["name","age"],
      methods:{
          sub(){
              this.$emit("fn",this.name,this.age);
          }
      }
      // data:function () {
      //   return {
      //     name:"张三",
      //     age:20
      //   }
      // }
    }
</script>

<style scoped>

</style>
