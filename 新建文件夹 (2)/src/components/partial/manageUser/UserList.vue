<template>
  <div>
    <div class="udss-toolbox">
      <Input
        class="udss-search"
        type="text"
        v-model="keyword"
        placeholder="请输入关键字"
        suffix-icon="el-icon-search"
        @change="handleInput"/>
      <Button
        @click="handleCreate"
        type="primary"
        icon="el-icon-plus"
        size="mini"
        style="float: none;"
        v-hasPermission="'w'"
        class="button-add">添加用户</Button>
    </div>
    <div id="loadings" class="scheme-table" style="overflow-y:scroll">
      <Table
        class="udss-table"
        max-height="600"
        :row-class-name="tableRowClassName"
        :data="users">
        <TableColumn label="序号" width="80" align="center">
          <template slot-scope="scope">
            {{scope.$index + 1 + (pageSizes * (pageIndex - 1))}}
          </template>
        </TableColumn>
        <TableColumn label="用户名" prop="username" :show-overflow-tooltip="true" align="center"></TableColumn>
        <TableColumn label="真实姓名" prop="name" :show-overflow-tooltip="true" align="center"></TableColumn>
        <TableColumn label="角色" prop="role_name" :show-overflow-tooltip="true" align="center"></TableColumn>
        <TableColumn v-if="showColumn" label="部门/院系" :show-overflow-tooltip="true" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.role.type_id === 4">{{row.org_name}}</span>
            <span v-else>{{row.dept_name}}</span>
          </template>
        </TableColumn>
        <TableColumn label="电子邮箱" prop="email" :show-overflow-tooltip="true" align="center"></TableColumn>
        <TableColumn label="操作" width="160" align="center" v-if="$route.meta.permissionList.includes('w')">
          <template slot-scope="{ row }">
            <Button
              type="text"
              size="small"
              class="operator-button"
              @click="handleUpdate(row)" >
              <i class="el-icon-edit"></i>
            </Button>
            <Button
              type="text"
              size="small"
              v-if="!row.is_login"
              class="operator-button"
              @click="handleDelete(row)">
              <i class="el-icon-delete"></i>
            </Button>
          </template>
        </TableColumn>
      </Table>
      <div class="udss-pagination">
        <Pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSizes"
          :page-sizes="[8, 10, 20]"
          :current-page.sync="pageIndex"
          @size-change="handleSizeChange"
          @current-change="handleChange"></Pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Button, Input, Pagination, Table, TableColumn, Message, MessageBox } from 'element-ui'
  import { TogglePage } from '@/mixins'
  export default {
    name: 'UserList',
    mixins: [ TogglePage ],
    components: { Button, Input, Pagination, Table, TableColumn, Message, MessageBox },
    data () {
      return {
        keyword: '',
        pageIndex: 1,
        tableShow: false,
        pageSizes: 8,
        showColumn: true
      }
    },
    mounted () {
      this.showColumn = JSON.parse(window.sessionStorage.getItem('udssInfo')).has_workflow
      this.pageSizes = this.currentPage.pageSize
      this.pageIndex = this.currentPage.pageIndex
      this.getUsers({keyword: this.keyword, pageSize: this.pageSizes, pageIndex: this.pageIndex})
    },
    methods: {
      ...mapMutations('user', ['setCurrentUser', 'setUser', 'currentpage']),
      ...mapActions('user', ['getUsers', 'delete', 'getRealDept', 'getCollege']),
      tableRowClassName ({row, rowIndex}) {
        if (rowIndex % 2 === 0) {
          return 'even-row'
        } else {
          return 'odd-row'
        }
      },
      toggleAddPage () {
        this.togglePage('AddUser', '添加用户')
      },
      toggleInfoPage () {
        this.togglePage('EditUser', '修改用户')
      },
      getFilterUsers () {
        this.getUsers({keyword: this.keyword, pageSize: this.pageSizes, pageIndex: this.pageIndex})
      },
      handleCreate () {
        this.getRealDept()
        this.getCollege()
        this.toggleAddPage()
      },
      handleUpdate (user) {
        let arr = {pageSize: this.pageSizes, pageIndex: this.pageIndex}
        this.currentpage(arr)
        this.setCurrentUser(user) // 用户更新页面需要用到
        // this.getRealDept()
        this.toggleInfoPage()
      },
      handleDelete (user) {
        MessageBox.confirm(
          '确认删除?',
          '提示',
          {
            type: 'warning'
          }
        ).then(() => {
          new Promise((resolve, reject) => {
            this.delete({payload: user.id, resolve, reject})
          }).then(() => {
            if (this.users.length === 0) {
              this.pageIndex = this.pageIndex - 1
              this.getUsers({keyword: this.keyword, pageSize: this.pageSizes, pageIndex: this.pageIndex})
            } else {
              this.getFilterUsers()
            }
          })
        }).catch(() => {
        })
      },
      handleInput () {
        this.pageIndex = 1 // 按关键字搜索时，重置页码
        this.getFilterUsers()
      },
      handleChange (val) {
        this.pageIndex = val
        this.getFilterUsers()
      },
      handleSizeChange (val) {
        this.pageSizes = val
        this.getFilterUsers()
      }
    },
    computed: {
      ...mapGetters('user', ['users', 'total', 'currentPage'])
    }
  }
</script>

<style scoped>
  .udss-toolbox {
    display: inline-block;
    width: 100%;
    margin-bottom: 10px;
  }
  .udss-search {
    width: 350px;
    margin-right: 30px;
  }
  .udss-table {
    height: 100%;
    width: 100%;
    overflow: hidden;
    overflow-y: scroll;
  }
  .udss-pagination {
    text-align: center;
    margin: 15px 0;
  }
  .operator-button{
    color: #9B9B9B;
    font-size: 16px;
  }
</style>
