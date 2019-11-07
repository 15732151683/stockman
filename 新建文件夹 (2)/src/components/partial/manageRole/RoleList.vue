<template>
  <div style="width: 100%; height: 100%;">
    <div class="udss-toolbox">
      <Input
        class="udss-search"
        type="text"
        clearable
        v-model="keyword"
        placeholder="请输入关键字"
        suffix-icon="el-icon-search"
        @change="handleInput"/>
      <Button
        @click="handleAdd"
        type="primary"
        icon="el-icon-plus"
        size="mini"
        style="float: none;"
        v-hasPermission="'w'"
        class="button-add">添加角色</Button>
    </div>
    <div class="table-box scheme-table">
      <Table
        class="udss-table"
        :row-class-name="tableRowClassName"
        :border="false"
        :data="cloneRoleList">
        <TableColumn label="序号" width="80" align="center">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </TableColumn>
        <TableColumn label="名称" prop="role_name" align="center"></TableColumn>
        <TableColumn label="权限" align="center">
          <TableColumn label="可设置子账户" align="center">
            <template slot-scope="{ row }">
              <i v-if="row.is_account" class="el-icon-check"></i>
              <i v-else class="el-icon-close"></i>
            </template>
          </TableColumn>
          <TableColumn label="可修改指标项" align="center">
            <template slot-scope="{ row }">
              <i v-if="row.is_update_ind" class="el-icon-check"></i>
              <i v-else class="el-icon-close"></i>
            </template>
          </TableColumn>
          <TableColumn label="可修改指标值" align="center">
            <template slot-scope="{ row }">
              <i v-if="row.is_update_ind_data" class="el-icon-check"></i>
              <i v-else class="el-icon-close"></i>
            </template>
          </TableColumn>
        </TableColumn>
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
              class="operator-button"
              @click="handleDelete(row)">
              <i class="el-icon-delete"></i>
            </Button>
          </template>
        </TableColumn>
      </Table>
    </div>
  </div>
</template>

<script>
  import { TogglePage } from '@/mixins'
  import { Table, TableColumn, Input, Button, MessageBox } from 'element-ui'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  export default {
    name: 'RoleList',
    mixins: [ TogglePage ],
    components: {
      Table, TableColumn, Input, Button, MessageBox
    },
    data () {
      return {
        keyword: '',
        cloneRoleList: []
      }
    },
    mounted () {
      this.getRoleList()
    },
    computed: {
      ...mapGetters('role', ['roleList'])
    },
    methods: {
      ...mapActions('role', ['getRoleList', 'getRoleDetail', 'deleteRole']),
      ...mapMutations('role', ['setNowRole']),
      tableRowClassName ({row, rowIndex}) {
        if (rowIndex % 2 === 0) {
          return 'even-row'
        } else {
          return 'odd-row'
        }
      },
      handleAdd () {
        this.togglePage('AddRole')
      },
      handleUpdate (row) {
        this.setNowRole(row)
        this.getRoleDetail(row.role_id)
        this.togglePage('EditRole')
      },
      handleDelete (row) {
        MessageBox.confirm(
          '确认删除?',
          '提示',
          {
            type: 'warning'
          }
        ).then(() => {
          this.deleteRole(row.role_id)
        }).catch(() => {
        })
      },
      filterRoleList () {
        return this.roleList.filter(node => node.role_name.indexOf(this.keyword) > -1)
      },
      handleInput () {
        // console.log(this.keyword, '1111')
        this.cloneRoleList = this.filterRoleList()
        // console.log(this.cloneRoleList, 'sousuo')
      }
    },
    watch: {
      roleList () {
        this.cloneRoleList = this.filterRoleList()
      }
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
  .table-box {
    width: 100%;
    height: calc(100% - 50px);
  }
  .operator-button{
    color: #9B9B9B;
    font-size: 16px;
  }
</style>
