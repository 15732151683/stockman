<template>
  <div id="app">
    <!--<MyShow></MyShow>-->
    <!--<Test1 @test="test"></Test1>-->
    <!--<Test2 ref="mytest"></Test2>-->
    <!--<My-component/>-->
    <!--<My-test-->
      <!--name="张三"-->
      <!--age="20"-->
      <!--@fn="showData"-->
    <!--/>-->
    <!--<Goods></Goods>-->
    <!--<router-view></router-view>-->
    <!--<router-link :to="{name:'mydog'}" tag="span">点击我切换到狗</router-link>-->
    <!--<router-link :to="{name:'mycat'}" tag="span">点击我切换到猫</router-link>-->
    <Coma></Coma>
    <Comb @test="test"></Comb>
    <Test></Test>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld'
import MyComponent from './components/MyComponent';
import MyTest from './components/MyTest';
import Goods from '@/components/Goods'
// import Coma from '@/components/vuex/Coma'
// import Comb from '@/components/vuex/Comb'
import Test1 from '@/components/Test1'
import Test2 from '@/components/Test2'
import MyShow from '@/components/MyShow'
import Coma from '@/components/vuextest/Coma'
import Comb from '@/components/vuextest/Comb'
// import Dog from "@/components/Dog"
// import Cat from "@/components/Cat"
import Test from "@/components/aaa/aaa"

export default {
  name: 'App',
  components: {
    MyComponent,
    MyTest,
    Goods,
    Coma,
    Comb,
    Test1,
    Test2,
    MyShow,
     Test
  },
    data:function(){
      return {
          count:''
      }
    },
  methods:{
    showData(name,age){
        console.log(name,age);
    },
    test(count){
      // console.log(2222);
      // this.$refs.mytest.clickme();
      //   console.log(count);
        this.count = count;
    }
  }
}
</script>

<style>
  .active{
    background: red;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
