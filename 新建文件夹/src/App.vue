<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    created () {
      let routeList = JSON.parse(window.sessionStorage.getItem('routeList'))
      if (routeList) {
        routeList.forEach(node => {
          node.component = (resolve) => require(['@/components/' + node.name], resolve)
        })
        let routes = {
          path: '/platform',
          name: 'Platform',
          component: (resolve) => require(['@/components/Platform'], resolve),
          children: routeList
        }
        if (this.$router.options.routes.length <= 2) {
          this.$router.addRoutes([routes])
          this.$router.options.routes.push(routes)
        }
      }
    }
  }
</script>

<style>
  #app {
    height: 100%;
  }
</style>
