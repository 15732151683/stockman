<template>
  <Container :title="title">
    <template slot="header"></template>
    <template slot="main">
      <component ref="comp" :is="view" @togglePage="handleTogglePage"></component>
    </template>
  </Container>
</template>

<script>
  import { TogglePage } from '@/mixins'
  import AddUser from './partial/manageUser/AddUser.vue'
  import EditUser from './partial/manageUser/EditUser.vue'
  import UserList from './partial/manageUser/UserList.vue'
  import { mapActions } from 'vuex'
  import { Container } from './widgets'
  export default {
    name: 'ManageUser',
    mixins: [ TogglePage ],
    components: {
      AddUser,
      EditUser,
      UserList,
      Container
    },
    data () {
      return {
        title: '',
        view: 'UserList'
      }
    },
    mounted () {
      this.getRoles()
      this.getDept()
      this.getCollege()
    },
    methods: {
      ...mapActions('config', ['getRoles']),
      ...mapActions('dept', ['getDept']),
      ...mapActions('user', ['getCollege'])
    }
  }
</script>

<style scoped>
</style>
