<template>
    <el-card>
      <el-button type="primary" size="mini" @click="toggle">模式切换</el-button>
      <el-table
        v-show="type"
        :data="tableData"
        height="600"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="180">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="path"
          label="权限路径">
        </el-table-column>
        <el-table-column
          label="级别">
          <template slot-scope="scope">
            <span>{{scope.row.level==="0"?'一级':scope.row.level==="1"?'二级':scope.row.level==="2"?'三级':''}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-tree v-show="!type" :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </el-card>
</template>

<script>
export default {
  name: 'AuthList',
  data () {
    return {
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      treeData: [],
      type: true
    }
  },
  methods: {
    getAuthList () {
      this.$http.get('rights/list').then(res => {
        console.log(res)
        this.tableData = res
      }).catch(err => {
        console.log(err)
      })
    },
    getTreeAuthList () {
      this.$http.get('rights/tree').then(res => {
        console.log(res)
        this.treeData = res
      }).catch(err => {
        console.log(err)
      })
    },
    toggle () {
      this.type = !this.type
    },
    handleNodeClick (data) {
      console.log(data)
    }
  },
  created () {
    this.getAuthList()
    this.getTreeAuthList()
  }
}
</script>

<style scoped>

</style>
