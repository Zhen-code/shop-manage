<template>
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row :gutter="8">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="query" clearable @clear="clearInput">
            <el-button slot="append" icon="el-icon-search" size="mini" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="400"
        stripe
        border
        class="table">
        <el-table-column
          fixed
          type="index"
          label="#"
          width="60">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="400">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格"
          width="120">
        </el-table-column>
        <el-table-column
          prop="goods_number"
          label="商品数量"
          width="120">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="300">
          <template slot-scope="scope">
            <span>{{scope.row.add_time | formatTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="auto">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain icon="el-icon-edit" circle></el-button>
            <el-button type="danger"  size="mini" plain icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
</template>

<script>
export default {
  name: 'GoodsList',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      total: 0,
      query: '',
      pagenum: 1,
      pagesize: 6
    }
  },
  methods: {
    getGoodsList () {
      this.$http.get('goods', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        console.log(res)
        this.$message.success('操作成功')
        this.total = res.total
        this.tableData = res.goods
      }).catch(err => {
        this.$message.error('操作失败')
        console.log(err)
      })
    },
    handleSizeChange (size) {
      this.pagenum = 1
      this.pagesize = size
      this.getGoodsList()
    },
    handleCurrentChange (num) {
      this.currentPage = num
      this.pagenum = num
      this.getGoodsList()
    },
    search () {
      this.pagenum = 1
      this.getGoodsList()
    },
    clearInput () {
      this.pagenum = 1
      this.getGoodsList()
    },
    addGoods () {
      this.$router.push('/addgoods')
    }
  },
  created () {
    this.getGoodsList()
  }
}
</script>

<style scoped>
  .table{
    margin: 20px 0;
  }
</style>
