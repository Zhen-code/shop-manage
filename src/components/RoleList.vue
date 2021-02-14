<template>
    <el-card>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="250"
        border>
        <el-table-column type="expand">
          <template slot-scope="scope">
<!--            遍历展开列中每行的一级权限-->
            <el-row v-for="(lv1,index) in scope.row.children" :key="index">
              <el-col :span="4">
                <el-tag closable @close="closeTag(scope.row,lv1.id)">{{lv1.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
               <el-row v-for="(val,i2) in lv1.children" :key="i2">
                 <el-col :span="8">
                   <el-tag type="success" closable @close="closeTag(scope.row,val.id)">{{ val.authName}}</el-tag>
                   <i class="el-icon-arrow-right"></i>
                 </el-col>
                 <el-col :span="16">
                   <el-tag type="warning" closable v-for="(val2,i3) in val.children" :key="i3" @close="closeTag(scope.row,val2.id)">
                     {{val2.authName}}
                   </el-tag>
                 </el-col>
               </el-row>
              </el-col>
            </el-row>
            <span v-if="scope.row.children.length === 0">暂无权限</span>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="#"
          width="200">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名"
          width="140">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          width="220">
        </el-table-column>
        <el-table-column label="操作" width="auto">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain icon="el-icon-edit" circle></el-button>
            <el-button type="success" size="mini" plain icon="el-icon-check" circle @click="handleCheck(scope.row)"></el-button>
            <el-button type="danger"  size="mini" plain icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="分配权限"
        :visible.sync="authDialogRight"
        width="50%"
        :before-close="()=>{authDialogRight=false
        defaultKeys=[]}">
        <el-tree
          ref="rightsTree"
          :props="defaultProps"
          :data="dataTree"
          :default-checked-keys="defaultKeys"
          node-key="id"
          show-checkbox
          default-expand-all
         >
        </el-tree>

        <span slot="footer" class="dialog-footer">
    <el-button @click="authDialogRight = false">取 消</el-button>
    <el-button type="primary" @click="submitRight">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
</template>

<script>
export default {
  name: 'RoleList',
  data () {
    return {
      tableData: [],
      authDialogRight: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      dataTree: [],
      defaultKeys: [],
      roleId: ''
    }
  },
  methods: {
    getRoleList () {
      this.$http('roles').then(res => {
        console.log(res)
        this.tableData = res
      }).catch(err => {
        console.log(err)
      })
    },
    closeTag (role, authId) {
      // 关闭标签同时返回剩余权限数据
      this.$http.delete(`roles/${role.id}/rights/${authId}`).then(res => {
        this.$message.success('删除权限成功')
        console.log(res)
        role.children = res
        // this.getRoleList()
      }).catch(err => {
        console.log(err)
        this.$message.error('删除权限失败')
      })
    },
    handleCheck (role) {
      this.roleId = role.id
      this.getLefKeys(role, this.defaultKeys)
      this.authDialogRight = true
      this.$nextTick(() => {
        this.$refs.rightsTree.setCheckedKeys(this.defaultKeys)
      })
    },
    getLefKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLefKeys(item, arr)
      })
    },
    submitRight () {
      let keys = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys()
      ]
      let str = keys.join(',')
      this.$http.post(`roles/${this.roleId}/rights`, {
        rids: str
      }).then(res => {
        console.log(res)
        this.$message.success('权限分配成功')
      }).catch(err => {
        console.log(err)
        this.$message.error('权限分配失败')
      })
      this.getRoleList()
      this.defaultKeys = []
      this.authDialogRight = false
    },
    getTreeRole () {
      this.$http.get(`rights/tree`).then(res => {
        console.warn(res)
        this.dataTree = res
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.getRoleList()
    this.getTreeRole()
  }
}
</script>

<style scoped>

</style>
