<template>
    <div>
        我是comb组件
        <h3>{{$store.state.count}}</h3>
        <button @click="sub">点击我提升状态</button>
    </div>
</template>

<script>
    export default {
        name: "",
        created:function(){
            console.log(this.$store.state.count);
        },
        data:function () {
            return {

            }
        },
        methods:{
            sub(){
                this.$emit("test",this.count);
            }
        }

    }
</script>

<style scoped>

</style>