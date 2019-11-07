<template>
  <div class="container">
    <header>
      <div class="container-header">
        <h2>{{ titles }}</h2>
        <slot name="header"></slot>
      </div>
    </header>
    <main>
      <div class="container-body">
        <slot name="main"></slot>
      </div>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'Container2',
    data () {
      return {
        titles: ''
      }
    },
    props: {
      title: {
        required: true,
        type: String
      }
    },
    mounted () {
      this.titles = this.$route.meta.title
    },
    watch: {
      title () {
        if (this.title) {
          this.titles = this.title
        } else {
          this.titles = this.$route.meta.title
        }
      }
    }
  }
</script>

<style scoped >
  .container {
    margin: 0;
    height: calc(100% - 50px);
    padding: 15px 30px;
    cursor: default;
    /*user-select: none;*/
    background-color: #EFF3F6;
    overflow: hidden;
  }
  .container-header{
    overflow: hidden;
    padding-bottom: 14px;
  }
  .container-header>h2 {
    word-wrap: break-word;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #32373d;
    overflow: hidden;
  }
  .container main {
    height: calc(100% - 40px);
  }
  .container-body{
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #EFF3F6;
  }
</style>
