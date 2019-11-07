<template>
    <div>
        我是coma组件
        <h3>{{count}}</h3>
        <p>{{$store.getters.mytest}}</p>
        <button @click="changeState(2)">点击我数量加加</button>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { mapActions } from 'vuex';
    import { mapMutations} from 'vuex'
    export default {
        name: "",
        methods:{
//             changeState(){
////                  this.$store.commit("add1",2);
////                 this.$store.dispatch('add1',3);
//
//             },
//            ...mapMutations({changeState:'add1'}),
//            ...mapActions({changeState:'aa'})
        },
        computed:{
//            ...mapState(['count'])
        }

    }
</script>

<style scoped>

</style>