<template>
    <div>
      <div @mousemove="test" @mouseout="dotShow">
        <span v-for="v,k in res" @mousemove="showDetail(k)">{{v.categoryname}} </span>
        <div class="showdiv"  v-show="judge">
            <ul>
              <li v-for="vv,kk in product"> {{vv.productname}}</li>
            </ul>
        </div>
      </div>


    </div>
</template>

<script>
    export default {
        name: "",
        data:function () {
          return {
            res:'',
            judge:false,
            product:[]
          }
        },
      created(){
          fetch('http://10.80.2.245:8080/product/all').then((res)=>{
              return res.json();
          }).then((res)=>{
              console.log(res);
              this.res = res;
          }).catch((err)=>{
            console.log(err);
          })

      },
      methods:{
        test(){
          this.judge = true;
        },
        dotShow(){
          this.judge = false;
        },
        showDetail(k){
          this.product = this.res[k].products;
        }
      }
    }
</script>

<style scoped>
  .showdiv{
    width: 300px;
    height: 100px;
    background: red;
  }


</style>
