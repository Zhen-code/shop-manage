<template>
    <el-card>
      <el-alert
        title="注意，仅为第三级分类添加参数"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>
      <el-row>
        <el-col :span="12"><span>选择商品分类:</span></el-col>
        <el-col :span="12">
          <el-cascader
            v-model="catValue"
            :options="catOptions"
            :props="defaultProps"
            clearable
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="() => addCatDialog = true">添加参数</el-button>
          <el-table
            :data="manyTableData"
            style="width: 100%">
            <el-table-column
              type="expand"
            >
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleTagClose(index,scope.row)">
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
            type="index">
          </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="showEditCatDialog(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteCatDialog(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="() => addCatDialog = true">添加属性</el-button>
          <el-table
            :data="onlyTableData"
            style="width: 100%">
            <el-table-column
              type="expand"
            >
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleTagClose(index,scope.row)">
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              type="index">
            </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="showEditCatDialog(scope.row)">修改</el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="deleteCatDialog(scope.row.attr_id)">
                    删除
                  </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addCatDialog"
        width="30%"
        :before-close="handleClose"
        >
        <el-form :model="ruleForm" :rules="rules" ref="addCatDialog" label-width="100px" class="demo-ruleForm">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="ruleForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addCatDialog = false">取 消</el-button>
    <el-button type="primary" @click="handleAddCat">确 定</el-button>
  </span>
      </el-dialog>
      <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editCatDialog"
        width="30%"
        :before-close="handleEditClose"
      >
        <el-form :model="editRuleForm" :rules="rules" ref="editCatDialog" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editRuleForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editCatDialog = false">取 消</el-button>
    <el-button type="primary" @click="handleEditCat">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
</template>

<script>
export default {
  name: 'CatClassify',
  data () {
    return {
      catValue: [],
      catOptions: [],
      defaultProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addCatDialog: false,
      editCatDialog: false,
      ruleForm: {
        attr_name: ''
      },
      editRuleForm: {
        attr_name: ''
      },
      rules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    getCatClassify () {
      this.$http.get('categories').then(res => {
        console.log(res)
        this.catOptions = res
      }).catch(err => {
        console.log(err)
      })
    },
    handleChange () {
      this.getParams()
      console.log(this.catValue)
    },
    handleTabClick (tab) {
      this.activeName = tab.name
      this.getParams()
    },
    getParams () {
      if (this.catValue.length !== 3) {
        this.catValue = []
        this.manyTableData = []
        this.onlyTableData = []
        this.$message.warning('请选择分类')
        return
      }
      this.$http.get(`categories/${this.catId}/attributes`, {
        params: {
          sel: this.activeName
        }
      }).then(res => {
        console.log(res)
        if (this.activeName === 'only') {
          this.onlyTableData = res.map(item => {
            item.inputVisible = false
            item.inputValue = ''
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            return item
          })
        } else {
          this.manyTableData = res.map(item => {
            item.inputVisible = false
            item.inputValue = ''
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            return item
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleClose () {
      this.$refs['addCatDialog'].resetFields()
      this.addCatDialog = false
    },
    handleEditClose () {
      this.$refs['editCatDialog'].resetFields()
      this.editCatDialog = false
    },
    handleAddCat () {
      this.$refs['addCatDialog'].validate((valid) => {
        if (!valid) return
        this.$http.post(`categories/${this.catId}/attributes`, {
          attr_name: this.ruleForm.attr_name,
          attr_sel: this.activeName
        }).then(res => {
          console.log(res)
          this.getParams()
          this.$message.success('参数添加成功')
        }).catch(err => {
          this.$message.success('参数添加失败')
          console.log(err)
        })
        this.$refs['addCatDialog'].resetFields()
        this.addCatDialog = false
      })
    },
    handleEditCat () {
      this.$refs['editCatDialog'].validate((valid) => {
        if (!valid) return
        this.$http.put(`categories/${this.catId}/attributes/${this.editRuleForm.attr_id}`, {
          attr_sel: this.activeName,
          attr_name: this.editRuleForm.attr_name
        }).then(res => {
          console.log(res)
          this.$message.success('修改参数成功')
          this.getParams()
          this.$refs['editCatDialog'].resetFields()
          this.editCatDialog = false
        }).catch(err => {
          console.log(err)
        })
      })
    },
    async showEditCatDialog (row) {
      let res = await this.$http.get(`categories/${this.catId}/attributes/${row.attr_id}`)
      this.editRuleForm = res
      this.editCatDialog = true
    },
    deleteCatDialog (attrId) {
      this.$confirm('此操作将删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${this.catId}/attributes/${attrId}`).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getParams()
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue)
      this.$http.put(`categories/${this.catId}/attributes/${row.attr_id}`, {
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' '),
        attr_name: row.inputValue
      }).then(res => {
        console.log(res)
        row.inputValue = ''
        row.inputVisible = false
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    handleTagClose (index, row) {
      row.attr_vals.splice(index, 1)
      this.$http.put(`categories/${this.catId}/attributes/${row.attr_id}`, {
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' '),
        attr_name: row.inputValue === '' ? row.attr_name : row.inputValue
      }).then(res => {
        console.log(res)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.getCatClassify()
  },
  computed: {
    isBtnDisabled () {
      if (this.catValue.length !== 3) {
        return true
      }
      return false
    },
    catId () {
      if (this.catValue.length === 3) {
        return this.catValue[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'only') {
        return '静态属性'
      } else {
        return '动态参数'
      }
    }
  }
}
</script>

<style scoped>
  .el-tag{
    margin: 10px;
  }
  .input-new-tag{
    width: 200px;
  }
</style>
