<template>
  <el-card class="box-card">
    <el-row>
      <el-col><el-button type="primary" @click="addCat">分类添加</el-button></el-col>
    </el-row>
    <tree-table :data="cateList"
                :show-index="true"
                index-text="#"
                :columns="columns"
                :selection-type="false"
                :expand-type="false">
      <template slot="isOk" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: #00B72E"></i>
        <i class="el-icon-error" style="color: brown" v-else></i>
      </template>
      <template slot="order" slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag type="warning" v-else>三级</el-tag>
      </template>
      <template slot="opt" slot-scope="scope">
        <el-button type="success" size="mini" icon="el-icon-edit">编辑</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
      </template>
    </tree-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="this.query.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
      title="添加商品分类"
      :visible.sync="catDialogVisible"
      width="30%"
      >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="ruleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="catValue"
            :options="cateOptions"
            :props="cateProps"
            clearable
            @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="catDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitAddCat">确 定</el-button>
  </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'GoodsCat',
  data () {
    return {
      categoryList: [],
      query: {
        type: 3,
        pagenum: 1,
        pagesize: 6
      },
      cateOptions: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      currentPage: 1,
      total: 0,
      catDialogVisible: false,
      ruleForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      rules: {
        cat_name: [{ required: true, message: '请输入商品分类名称', trigger: 'blur' }]
      },
      catValue: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      cateList: []
    }
  },
  methods: {
    getCategoryList () {
      this.$http.get('categories', {
        params: this.query
      }).then(res => {
        console.log(res)
        this.cateList = res.result
        this.total = res.total
      }).catch(err => {
        console.log(err)
      })
    },
    getCascanderList () {
      this.$http.get('categories', {
        params: {
          type: 2
        }
      }).then(res => {
        console.log(res)
        this.cateOptions = res
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange (size) {
      this.query.pagenum = 1
      this.currentPage = 1
      this.query.pagesize = size
      this.getCategoryList()
    },
    handleCurrentChange (num) {
      this.query.pagenum = num
      this.currentPage = num
      this.getCategoryList()
    },
    addCat () {
      this.getCascanderList()
      this.catDialogVisible = true
    },
    handleChange () {
      if (this.catValue.length > 0) {
        this.ruleForm.cat_pid = this.catValue[this.catValue.length - 1]
        this.ruleForm.cat_level = this.catValue.length
      } else {
        this.ruleForm.cat_pid = 0
        this.ruleForm.cat_level = 0
      }
    },
    submitAddCat () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$http.post('categories', this.ruleForm).then(res => {
            this.$message.success('添加成功')
          }).catch(err => {
            console.log(err)
          })
          this.catValue = []
          this.ruleForm = {
            cat_pid: 0,
            cat_level: 0,
            cat_name: ''
          }
          this.getCategoryList()
          this.catDialogVisible = false
        }
      })
    }
  },
  mounted () {
    this.getCategoryList()
  }
}
</script>

<style scoped>
  .el-cascader{
    width: 100%;
  }
</style>
