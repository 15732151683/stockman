<template>
  <div class="container">
    <div class="container-header">
      <h2>Please waiting...</h2>
    </div>
    <div class="container-body"></div>
  </div>
</template>

<script>
  export default {
    name: 'Wait'
  }
</script>

<style scoped>
  .container {
    margin: 15px;
    height: calc(100% - 30px);
    cursor: default;
    user-select: none;
  }
  .container-header,
  .container-body{
    padding: 15px;
    background-color: #fff;
  }
  .container-header>h2 {
    height: 40px;
    line-height: 40px;
    color: #32373d;
  }
  .container-body {
    height: calc(100% - 100px);
    overflow: hidden;
  }
</style>
