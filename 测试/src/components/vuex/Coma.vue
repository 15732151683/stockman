<template>
  <div>
    <h2>我是Coma组件;数量是{{$store.state.count}}</h2>
    <button @click="add(2)">点击我加加</button>
    <button @click="test">点击我弹出</button>
    <h2>这里是通过getters获取的参数{{ getCount }}</h2>
  </div>
</template>

<script>
   import { mapMutations } from 'vuex'
   import { mapActions } from 'vuex'
   import { mapGetters } from 'vuex'
   import {Button} from 'element-ui'
    export default {
        name: "",
        components:{
            Button
        },
        created:function () {
            console.log(this.$store.getters.getCount);
        },
        computed:{
          ...mapGetters([
            'getCount'
            // ...
          ])
        },
        methods:{
          // ...mapMutations(['add']),
          ...mapActions(['add']),
          test(){
            alert(111);
          },
          // add(){
          //     //commit提交到mutations里去
          //     // this.$store.commit("add",2)
          //    //dispatch 提交到actions里去； actions里放异步操作的；
          //   this.$store.dispatch("add",2);
          // }
        }
    }
</script>

<style scoped>

</style>
