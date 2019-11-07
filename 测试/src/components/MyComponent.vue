<template>
  <div>
    <h1>我是MyComponent组件;自定义指令</h1>
    <button @click="sub">点击我触发函数</button>
    <input type="text" v-focus>
    <div class="mydiv" v-setbackground="'blue'"></div>
    {{ message | toUpper("111","2222") }}
    {{ message | reverseStr }}
  </div>
</template>

<script>
    export default {
        name: "",
        data:function () {
          return {
              message:"abcdefg"
          }
        },
        directives:{
            focus:{
              inserted:function (el,bind) {
                 console.log(el,bind);
                 $(el).focus();
              }
            },
            setbackground: {
                inserted:function (el,bind) {
                    console.log(bind);
                    $(el).css({background:bind.value})
                }
            }
        },
      methods:{
        sub:function () {
            alert(1111);
        }
      },
      filters:{
          //vue-resouse  axios
          toUpper:function (val,arg1,arg2) {
             console.log(val,arg1,arg2);
             return val.toUpperCase();
          },
          reverseStr(val){
              return val.split("").reverse().join("");
          }
      }
    }
</script>

<style scoped>
  .mydiv{
    width: 100px;
    height: 100px;
  }

</style>
