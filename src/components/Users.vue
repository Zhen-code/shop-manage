<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>用户列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="row">
      <el-col>
        <el-input placeholder="请输入内容" v-model="searchVal" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-button type="primary" @click="addUser">添加用户</el-button>
      </el-col>
    </el-row>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="250">
        <el-table-column
          fixed
          type="index"
          label="#"
          width="150">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          width="120">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="300">
        </el-table-column>
        <el-table-column
        label="用户状态"
        width="300">
          <template slot-scope="scope">
            <el-switch
              @change="change(scope.row.id,scope.row.mg_state)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
      </el-table-column>
        <el-table-column
          label="创建时间"
          width="120">
          <template slot-scope="scope">
            <span>{{scope.row.create_time|formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain icon="el-icon-edit" circle></el-button>
            <el-button type="success" size="mini" plain icon="el-icon-check" circle @click="handleRole(scope.row)"></el-button>
            <el-button type="danger"  size="mini" plain icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="添加" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="用户角色" :visible.sync="dialogRoleVisible">
      <el-form>
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <p>{{userName}}</p>
        </el-form-item>
        <el-form-item label="用户角色" :label-width="formLabelWidth">
          <p>{{userRole}}</p>
        </el-form-item>
        <el-form-item label="角色列表" :label-width="formLabelWidth">
          <el-select v-model="selectRole" placeholder="请选择角色">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="(item,index) in roleList" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'Users',
  data () {
    return {
      searchVal: '',
      tableData: [],
      pagenum: 1,
      pageSize: 2,
      total: 0,
      currentPage: 1,
      dialogFormVisible: false,
      formLabelWidth: '120',
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      dialogRoleVisible: false,
      selectRole: -1,
      roleList: [],
      userName: '',
      userId: '',
      userRole: ''
    }
  },
  methods: {
    getUserList () {
      this.$http.get(`users?query=${this.searchVal}&pagenum=${this.pagenum}&pagesize=${this.pageSize}`)
        .then(res => {
          console.log(res)
          this.total = res.total
          this.tableData = res.users
        }).catch(err => {
          console.log(err)
        })
    },
    handleSizeChange (size) {
      this.pageSize = size
      this.currentPage = 1
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (page) {
      this.currentPage = page
      this.pagenum = page
      this.getUserList()
    },
    addUser () {
      this.dialogFormVisible = true
    },
    handleAddUser () {
      this.$http.post('users', this.form).then(res => {
        this.$message.success('添加用户成功')
        this.getUserList()
        this.dialogFormVisible = false
      }).catch(err => {
        console.log(err)
      })
      this.dialogFormVisible = false
    },
    search () {
      this.pagenum = 1
      this.currentPage = 1
      this.getUserList()
    },
    async change (uId, type) {
      await this.$http.put(`users/${uId}/state/${type}`)
      this.$message.success('用户状态修改成功')
    },
    async handleRole (row) {
      console.log(row)
      this.userName = row.username
      this.userRole = row.role_name
      this.userId = row.id
      let user = await this.$http.get(`users/${row.id}`)
      let flag = this.roleList.some(item => {
        return item.value === user.rid
      })
      if (flag) {
        this.selectRole = user.rid
      } else {
        this.selectRole = -1
      }
      this.dialogRoleVisible = true
    },
    getRoleList () {
      this.$http.get('roles').then(res => {
        this.roleList = res.map(i => {
          return {
            label: i.roleName,
            value: i.id
          }
        })
        console.log(this.roleList)
      }).catch(err => {
        console.log(err)
      })
    },
    editUserRole () {
      if (this.selectRole === -1) {
        return
      }
      this.$http.put(`users/${this.userId}/role`, {
        rid: this.selectRole
      }).then(res => {
        console.log(res)
        this.$message.success('更改用户角色成功')
      }).catch(err => {
        console.log(err)
      })
      this.selectRole = -1
      this.getUserList()
      this.dialogRoleVisible = false
    }
  },
  created () {
    this.getUserList()
    this.getRoleList()
  }
}
</script>

<style scoped>
  .box-card{
    height: 100%;
    width: 100%;
  }
  .input-with-select{
    width: 300px;
  }
  .row{
    margin-top: 30px;
  }
</style>
