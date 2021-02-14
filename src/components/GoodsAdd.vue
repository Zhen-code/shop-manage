<template>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false">
      </el-alert>
      <el-steps :space="200" :active="active - 0" finish-status="success"  align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addRuleForm" :rules="addRules" ref="addRuleForm" label-width="100px" label-position="top">
        <el-tabs :tab-position="tabPosition" v-model="active" :before-leave="beforeLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addRuleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addRuleForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addRuleForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addRuleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addRuleForm.goods_cat"
                :options="catOptions"
                :props="defaultProps"
                clearable
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item) in manyData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="i" v-for="(i,v) in item.attr_vals" :key="v"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item) in onlyData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            :headers="headerObj"
            :on-success="onSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传图片文件</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="content"
                          ref="myQuillEditor"
                          :options="editorOption"
                         >
            </quill-editor>
            <el-button type="primary" @click="addGoods" class="addBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-dialog
        title="图片预览"
        :visible.sync="previewVisible"
        width="50%"
        :before-close=" () => { this.previewVisible = false}">
        <img :src="previewPath" class="img_pre" />
        <span slot="footer" class="dialog-footer">
    <el-button @click="previewVisible = false">取 消</el-button>
    <el-button type="primary" @click="previewVisible = false">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
</template>

<script>
import {sessionData} from '../utils'

export default {
  name: 'GoodsAdd',
  data () {
    return {
      active: 0,
      tabPosition: 'left',
      addRuleForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: []
      },
      addRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'change' }]
      },
      catOptions: [],
      defaultProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyData: [],
      onlyData: [],
      uploadUrl: 'http://localhost:8888/api/private/v1/upload',
      headerObj: {
        Authorization: sessionData('get', 'token')
      },
      pics: [],
      previewPath: '',
      previewVisible: false,
      content: '',
      editorOption: {

      }
    }
  },
  methods: {
    onSuccess (response, file) {
      console.log(response, file)
      if (response.meta.status !== 200) {
        this.$message.error('图片上传失败')
        return
      }
      let picInfo = {}
      picInfo.pic = response.data.tmp_path
      this.pics.push(picInfo)
    },
    handlePreview (file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove () {

    },
    getCatClassify () {
      this.$http.get('categories').then(res => {
        console.log(res)
        this.catOptions = res
      }).catch(err => {
        console.log(err)
      })
    },
    handleChange () {
      if (this.addRuleForm.goods_cat.length !== 3) {
        this.addRuleForm.goods_cat = []
      }
    },
    beforeLeave (oldActive, active) {
      if (this.active !== 0 && this.addRuleForm.goods_cat.length === 0) {
        this.$message.error('请选择分类')
        return false
      }
    },
    tabClick () {
      console.log(this.active)
      if (this.active === '1') {
        this.$http.get(`categories/${this.addRuleForm.goods_cat[2]}/attributes`, {
          params: {
            sel: 'many'
          }
        }).then(res => {
          res.forEach(i => {
            i.attr_vals = i.attr_vals === '' ? [] : i.attr_vals.split(' ')
          })
          this.manyData = res
        }).catch(err => { console.log(err) })
      } else if (this.active === '2') {
        this.$http.get(`categories/${this.addRuleForm.goods_cat[2]}/attributes`, {
          params: {
            sel: 'only'
          }
        }).then(res => {
          this.onlyData = res
        }).catch(err => { console.log(err) })
      }
    },
    addGoods () {
      this.$refs.addRuleForm.validate(valid => {
        if (!valid) {
          return this.$message.error('请填写完整必填项')
        }
        // let attrs = []
        let manyData = this.manyData.map(item => {
          return {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
        })
        let onlyData = this.onlyData.map(item => {
          return {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
        })
        this.$http.post('goods', {
          goods_name: this.addRuleForm.goods_name,
          goods_cat: this.addRuleForm.goods_cat,
          goods_price: this.addRuleForm.goods_price,
          goods_number: this.addRuleForm.goods_number,
          goods_weight: this.addRuleForm.goods_weight,
          goods_introduce: this.content,
          pics: this.pics,
          attrs: [...manyData, ...onlyData]
        }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      })
    }
  },
  created () {
    this.getCatClassify()
  }
}
</script>

<style scoped>
  .el-steps{
    margin: 10px 0;
  }
  .el-checkbox{
   margin-right: 0px !important;
  }
  .img_pre{
    width: 100%;
  }
  .ql-editor{
    height: 200px;
  }
  .addBtn{
    margin-top: 30px;
  }
  .el-card{
    height: 100%;
  }
  .el-tab-pane{
    overflow: auto;
  }
</style>
