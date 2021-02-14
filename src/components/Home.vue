<template>
  <el-container class="box">
    <el-header class="header">
      <img src="../assets/logo.png" class="logo"/>
      <h3 class="title">管理系统</h3>
      <a class="logout" @click="logout">退出</a>
    </el-header>
    <el-container class="middle">
      <el-aside width="200px">
        <el-menu
          default-active="users"
          :unique-opened="true"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true">
          <el-submenu index="users">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户模块</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-location"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="auth">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限模块</span>
            </template>
            <el-menu-item index="authlist">
              <i class="el-icon-location"></i>
              <span>权限列表</span>
            </el-menu-item>
            <el-menu-item index="rolelist">
              <i class="el-icon-location"></i>
              <span>角色列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="goods">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品模块</span>
            </template>
            <el-menu-item index="goodslist">
              <i class="el-icon-location"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="goodscat">
              <i class="el-icon-location"></i>
              <span>商品分类</span>
            </el-menu-item>
            <el-menu-item index="catclassify">
              <i class="el-icon-location"></i>
              <span>分类参数</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="order">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单模块</span>
            </template>
            <el-menu-item index="orderlist">
              <i class="el-icon-location"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main"><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import {sessionData} from '../utils'

export default {
  name: 'Home',
  methods: {
    logout () {
      this.$message.success('退出成功')
      sessionData('clean', 'token')
      this.$router.replace({
        path: 'login'
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next()
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    next()
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    next()
  }
}
</script>

<style scoped>
  @import "../style/index.scss"
</style>
