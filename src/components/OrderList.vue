<template>
    <div>
      <el-card>
        <el-table :data="goodsList"  style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="order_number" label="订单编号"></el-table-column>
          <el-table-column prop="order_price" label="订单价格"></el-table-column>
          <el-table-column prop="order_pay" label="是否付款"></el-table-column>
          <el-table-column prop="is_send" label="是否发货"></el-table-column>
          <el-table-column prop="create_time" label="下单时间"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini">详情</el-button>
              <el-button type="success" icon="el-icon-check" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="50%"
          :before-close="() => dialogVisible = false">
<!--          <el-timeline :reverse="reverse">-->
<!--            <el-timeline-item-->
<!--              v-for="(activity, index) in activities"-->
<!--              :key="index"-->
<!--              :timestamp="activity.timestamp">-->
<!--              {{activity.content}}-->
<!--            </el-timeline-item>-->
<!--          </el-timeline>-->
          <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
        </el-dialog>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'OrderList',
  data () {
    return {
      query: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0,
      dialogVisible: false,
      reverse: true,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  },
  methods: {
    getOrderList () {
      this.$http.get('orders', {
        params: this.query
      }).then(res => {
        console.log(res)
        this.goodsList = res.goods
        this.total = res.total
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style scoped>

</style>
