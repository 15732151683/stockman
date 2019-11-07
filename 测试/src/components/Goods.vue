<template>
    <div>
      <h1>我是goods组件</h1>
      <button class="btn btn-primary">111</button>
      <i class="glyphicon glyphicon-user"></i>
      <ul>
        <li v-for="v,k in productList">产品名字：{{ v.productName }};产品价格：{{ v.productPrice }}</li>
      </ul>
    </div>
</template>

<script>
    export default {
        name: "",
        data:function(){
          return {
              productList:[]
          }
        },
        created:function () {
            // fetch("api/getData",{}).then((res)=>{
            //   return res.json();
            // }).then((res)=>{
            //     console.log(res);
            //     this.productList = res.result.productList;
            // }).catch((error)=>{
            //     console.log(error);
            // })
            this.$http.get("api/getData").then((res)=>{
              console.log(res);
              this.productList = res.data.result.productList;
            }).catch((error)=>{
                console.log(error);
            })

        }
    }
</script>

<style scoped>


</style>
